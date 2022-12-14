import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AuthDto, SignInDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { RedisCacheService } from '../redis-cache/redis-cache.service';
import { MailService } from '../mail/mail.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly prefix: string = 'usersVerif:';
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private cache: RedisCacheService,
    private mail: MailService,
  ) {}

  async signup(dto: AuthDto) {
    try {
      const data = { ...dto };
      //generate the password hash
      data.password = await argon.hash(dto.password);

      const user = await this.prisma.user.create({
        data: { ...data, verified: true },
      });

      const emailToken = await this.signToken(
        'JWT_MAIL',
        this.config.get('JWT_EXPIRATION'),
        user.id,
        user.email,
      );

      // this.redisEmail(user, emailToken);

      return HttpStatus.CREATED;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials already in use');
        }
      }
      throw error;
    }
  }

  async confirm(token: string) {
    try {
      const user: User = await this.checkEmail(token);

      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      if (user.verified)
        throw new HttpException(
          'User already verified',
          HttpStatus.BAD_REQUEST,
        );

      const validateToken = await this.cache.get(`${this.prefix}${user.id}`);

      if (validateToken !== token)
        throw new ForbiddenException('Invalid token');

      await this.cache.del(`${this.prefix}${user.id}`);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { verified: true },
      });

      return HttpStatus.OK;
    } catch (error) {
      throw error;
    }
  }

  async newMail(email: string) {
    try {
      if (email === undefined || !email)
        throw new HttpException(
          'email in query missing',
          HttpStatus.BAD_REQUEST,
        );

      const user: User = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      if (user.verified)
        throw new HttpException(
          'User already verified',
          HttpStatus.BAD_REQUEST,
        );

      const validationToken = await this.signToken(
        'JWT_SECRET',
        this.config.get('JWT_EXPIRATION'),
        user.id,
        user.email,
      );

      this.redisEmail(user, validationToken);

      return HttpStatus.OK;
    } catch (error) {
      throw error;
    }
  }

  async redisEmail(user: User, validationToken: string) {
    await this.cache.set(
      `${this.prefix}${user.id}`,
      validationToken,
      this.config.get('EMAIL_VALIDATION_EXPIRATION'),
    );

    //send the email with the validation token
    await this.mail.sendUserConfirmation(user, validationToken);
  }

  async signin(dto: SignInDto) {
    //find the user in the database
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      //if the user is not found throw exception
      if (!user) throw new ForbiddenException('Invalid credentials');

      //compare password hash with the one in the database
      const pwMatches = await argon.verify(user.password, dto.password);
      //if the password is not correct throw exception
      if (!pwMatches) throw new ForbiddenException('Invalid credentials');

      const refresh_token = await this.signToken(
        'REFRESH_JWT_SECRET',
        this.config.get('REFRESH_JWT_EXPIRATION'),
        user.id,
        user.email,
      );

      const hashedRefreshToken: string = await argon.hash(refresh_token);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refresh_token: hashedRefreshToken },
      });

      //send back the user
      return {
        accessToken: await this.signToken(
          'JWT_SECRET',
          this.config.get('JWT_EXPIRATION'),
          user.id,
          user.email,
        ),
        refreshToken: refresh_token,
      };
    } catch (error) {
      throw error;
    }
  }

  async signToken(
    secretToUse: string,
    expiration: string,
    userId: string,
    email: string,
  ): Promise<string> {
    const payload = { sub: userId, email };
    const secret = this.config.get(secretToUse);
    const token = await this.jwt.signAsync(payload, {
      expiresIn: expiration,
      secret,
    });
    return token;
  }

  async createAccessTokenFromRefreshToken(refreshToken) {
    try {
      const user = await this.checkToken(refreshToken);

      return {
        accessToken: await this.signToken(
          'JWT_SECRET',
          this.config.get('JWT_EXPIRATION'),
          user.id,
          user.email,
        ),
      };
    } catch (error) {
      throw error;
    }
  }

  async logout(token: string) {
    try {
      const user = await this.checkToken(token);

      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refresh_token: null },
      });

      return;
    } catch (error) {
      throw error;
    }
  }

  async checkToken(token) {
    try {
      const decoded = this.jwt.decode(token);

      if (!decoded)
        throw new HttpException('Invalid refresh token', HttpStatus.FORBIDDEN);

      const user = await this.prisma.user.findFirst({
        where: { id: decoded.sub },
      });

      if (!user)
        throw new HttpException(
          'User with this id does not exist',
          HttpStatus.NOT_FOUND,
        );

      if (!user.refresh_token)
        throw new HttpException(
          'User already logged out',
          HttpStatus.BAD_REQUEST,
        );

      const isRefreshTokenMatching = await argon.verify(
        user.refresh_token,
        token,
      );

      if (!isRefreshTokenMatching)
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async checkEmail(token: string) {
    try {
      const decoded = this.jwt.decode(token);

      if (!decoded) throw new ForbiddenException('Invalid refresh token');

      const user = await this.prisma.user.findFirst({
        where: { id: decoded.sub },
      });

      if (!user)
        throw new HttpException(
          'User with this id does not exist',
          HttpStatus.NOT_FOUND,
        );

      if (user.id !== decoded.sub)
        throw new ForbiddenException('Invalid token');

      return user;
    } catch (error) {
      throw error;
    }
  }
}
