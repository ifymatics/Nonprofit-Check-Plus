import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, NotBeforeError } from '@nestjs/jwt';
import { UsersService } from './users/users.service';

import { KafkaProducerService } from './kafka/kafka-producer.service';
import { RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { LoginDto, RegisterDto } from '@app/shared/dtos';
export interface TokenPayload {
  userId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    //private readonly kafkaProducer: KafkaProducerService,
  ) {}

  async register(dto: RegisterDto) {
    console.log('HITTING AUTHSERVICE register method: ', dto);
    try {
      const user = await this.usersService.create(dto);
      // await this.kafkaProducer.emit('user.created', {
      //   userId: user.id,
      //   email: user.email,
      // });
      return user;
    } catch (error) {
      if (
        error.message.includes('duplicate key value violates unique constraint')
      ) {
        console.log(error.message);
        throw new RpcException(new ConflictException('User already exists'));
      }
    }
  }

  async getOne(id: string) {
    return this.usersService.findOne(id);
  }
  async login(dto: LoginDto) {
    const user = await this.usersService.validateLogin(dto.email, dto.password);

    if (!user) throw new RpcException(new UnauthorizedException());
    const tokenPayload: TokenPayload = { userId: user.id.toString() };
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + Number(this.configService.get('JWT_EXPIRATION')),
    );
    const token = this.jwtService.sign(tokenPayload, {
      expiresIn: Number(this.configService.get('JWT_EXPIRATION')),
    });
    // const token = this.jwtService.sign({ sub: user.id });
    console.log('LOGIN DATA IN SERVICE: ', token, expires);
    return { token, expires, email: user.email, fullName: user.fullName };
  }
}
