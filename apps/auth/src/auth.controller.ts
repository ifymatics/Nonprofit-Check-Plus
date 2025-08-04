import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

import { ApiTags } from '@nestjs/swagger';
import {
  MessagePattern,
  Payload,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @MessagePattern('auth_register', Transport.TCP)
  register(@Payload() dto) {
    console.log('HITTING AUTH register method: ', dto);
    return this.authService.register(dto);
  }

  @MessagePattern('auth_login', Transport.TCP)
  login(@Payload() dto) {
    return this.authService.login(dto);
  }
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: { Authentication: string }) {
    const token = data?.Authentication;
    // console.log('auth authenticate methode: ===>', data);
    if (!token) {
      // throw new UnauthorizedException('No token provided');
      throw new RpcException({
        statusCode: 401,
        message: 'No token provided',
      });
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      const user = await this.authService.getOne(payload.userId);

      // console.log('auth authenticate method user: ===>', user);
      if (!user) {
        // throw new UnauthorizedException('User not found');
        throw new RpcException({
          statusCode: 401,
          message: 'Invalid token: user not found',
        });
      }

      return user; // should be serializable DTO
    } catch (err) {
      // throw new UnauthorizedException('Invalid token');

      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired token',
      });
    }
  }
}
