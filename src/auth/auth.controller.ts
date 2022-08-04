import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { AuthDto, SignInDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: SignInDto) {
    return this.authService.signin(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('confirm')
  async confirm(@Query('token') token: string) {
    return this.authService.confirm(token);
  }

  @HttpCode(HttpStatus.OK)
  @Get('newmail')
  async newMail(@Query('token') token: string) {
    return this.authService.newMail(token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refreshToken')
  refreshToken(@Headers('authorization') authorization: string) {
    return this.authService.createAccessTokenFromRefreshToken(
      authorization.split('Bearer ')[1],
    );
  }

  @HttpCode(HttpStatus.OK)
  @Get('logout')
  logout(@Headers('authorization') authorization: string) {
    return this.authService.logout(authorization.split('Bearer ')[1]);
  }
}
