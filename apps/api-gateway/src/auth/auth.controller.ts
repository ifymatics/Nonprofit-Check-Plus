import { Controller, Post, Body, ConflictException, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { LoginDto, RegisterDto } from '@app/shared/dtos';
import { AUTH_SERVICE } from '@app/shared';

// @ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    console.log('HITTING API-GATEWAY register method: ', dto);
    try {
      return await lastValueFrom(this.authClient.send('auth_register', dto));
    } catch (error) {
      if (error?.response.statusCode === 409) {
        throw new ConflictException(error.message);
      }
    }
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('HITTING API-GATEWAY login method: ', dto);
    try {
      const { token, expires, email, fullName, id } = await firstValueFrom(
        this.authClient.send('auth_login', dto),
      );

      res.cookie('Authentication', token, {
        httpOnly: true,
        expires: new Date(expires),
        secure: true,
        sameSite: 'none',
      });
      return { email, fullName, id };
    } catch (error) {
      if (error?.response.statusCode === 401) {
        throw new ConflictException(error.message);
      }
    }
  }
}
