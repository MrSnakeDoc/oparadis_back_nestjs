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
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginType, RefreshTockenType } from './types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({
    description: `${HttpStatus.CREATED}`,
  })
  @ApiOperation({
    summary: 'Signup route',
    description: 'Signup route',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @ApiOkResponse({
    description: `Token and refresh token`,
    type: LoginType,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Login route',
    description: 'Login route',
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signin(@Body() dto: SignInDto) {
    return this.authService.signin(dto);
  }

  @ApiOkResponse({
    description: `${HttpStatus.OK}`,
  })
  @ApiOperation({
    summary: 'Email confirmation route',
    description:
      'This route verify the token in the link given by mail to a new user to confirm his mail address',
  })
  @HttpCode(HttpStatus.OK)
  @Get('confirm')
  async confirm(@Query('token') token: string) {
    return this.authService.confirm(token);
  }

  @ApiOkResponse({
    description: `${HttpStatus.CREATED}`,
  })
  @ApiOperation({
    summary: 'Sends a new confirmation mail',
    description:
      'Send a new verification mail to a user to confirm his mail address',
  })
  @HttpCode(HttpStatus.CREATED)
  @Get('newmail')
  async newMail(@Query('token') token: string) {
    return this.authService.newMail(token);
  }

  @ApiOkResponse({
    description: `Token refreshed`,
    type: RefreshTockenType,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'refresh the accessToken using the refreshToken',
    description: 'refresh the accessToken using the refreshToken',
  })
  @HttpCode(HttpStatus.OK)
  @Post('refreshToken')
  refreshToken(@Headers('authorization') authorization: string) {
    return this.authService.createAccessTokenFromRefreshToken(
      authorization.split('Bearer ')[1],
    );
  }

  @ApiOkResponse({
    description: `Token and refreshed token deleted`,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Logout the user',
    description: 'logout the user',
  })
  @HttpCode(HttpStatus.OK)
  @Get('logout')
  logout(@Headers('authorization') authorization: string) {
    return this.authService.logout(authorization.split('Bearer ')[1]);
  }
}
