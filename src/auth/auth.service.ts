import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AuthDto, SignInDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';
import { MailService } from 'src/mail/mail.service';
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
      //generate the password hash
      const hash = await argon.hash(dto.password);
      delete dto.password;

      !dto.pseudo ? (dto.pseudo = dto.firstname) : null;

      //save the user to the database

      const user = await this.prisma.user.create({
        data: { ...dto, password: hash },
      });

      const validationToken = await this.signToken(
        'JWT_SECRET',
        this.config.get('JWT_EXPIRATION'),
        user.id,
        user.email,
      );

      this.redisEmail(user, validationToken);

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

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.verified)
        throw new HttpException(
          'User already verified',
          HttpStatus.BAD_REQUEST,
        );

      const validateToken = await this.cache.get(`${this.prefix}${user.id}`);

      if (validateToken !== token) {
        throw new ForbiddenException('Invalid token');
      }

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

  async newMail(token: string) {
    try {
      const user: User = await this.checkEmail(token);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

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

      return HttpStatus.CREATED;
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
      if (!user) {
        throw new ForbiddenException('Invalid credentials');
      }
      //compare password hash with the one in the database
      const pwMatches = await argon.verify(user.password, dto.password);
      //if the password is not correct throw exception
      if (!pwMatches) {
        throw new ForbiddenException('Invalid credentials');
      }

      const refresh_token = await this.signToken(
        'REFRESH_JWT_SECRET',
        this.config.get('REFRESH_JWT_EXPIRATION'),
        user.id,
        user.email,
      );

      const cryptedRefreshToken: string = await argon.hash(refresh_token);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { refresh_token: cryptedRefreshToken },
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

      //send back the user
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

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

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

      if (!decoded) {
        throw new ForbiddenException('Invalid refresh token');
      }

      const user = await this.prisma.user.findFirst({
        where: { id: decoded.sub },
      });

      if (!user) {
        throw new HttpException(
          'User with this id does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      if (!user.refresh_token) {
        throw new ForbiddenException('User already logged out');
      }

      const isRefreshTokenMatching = await argon.verify(
        user.refresh_token,
        token,
      );

      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Invalid token');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async checkEmail(token: string) {
    try {
      const decoded = this.jwt.decode(token);

      if (!decoded) {
        throw new ForbiddenException('Invalid refresh token');
      }

      const user = await this.prisma.user.findFirst({
        where: { id: decoded.sub },
      });

      if (!user) {
        throw new HttpException(
          'User with this id does not exist',
          HttpStatus.NOT_FOUND,
        );
      }

      if (user.id !== decoded.sub) {
        throw new ForbiddenException('Invalid token');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}
