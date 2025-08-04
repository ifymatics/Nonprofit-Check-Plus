import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthController } from './auth/auth.controller';
import { AdminController } from './admin/admin.controller';
import { kafkaClientOptions } from './kafka/kafka.config';
import { join } from 'path';
import { UsersController } from './users/users.controller';
import {
  ADMIN_SERVICE,
  AUTH_SERVICE,
  JwtAuthGuard,
  LoggerModule,
  SEARCH_SERVICE,
} from '@app/shared';

import { SearchController } from './search/search.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, ' ', '../../api-gateway/.env'),
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION'),
        },
      }),
      inject: [ConfigService],
    }),
    LoggerModule,
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.TCP,
        options: {
          host: AUTH_SERVICE, //process.env.AUTH_HOST || 'localhost',
          port: parseInt(process.env.AUTH_PORT || '4001'),
        },
      },
      {
        name: ADMIN_SERVICE,
        transport: Transport.TCP,
        options: {
          host: ADMIN_SERVICE, //process.env.ADMIN_HOST || 'localhost',
          port: parseInt(process.env.ADMIN_PORT || '4002'),
        },
      },
      {
        name: SEARCH_SERVICE,
        transport: Transport.TCP,
        options: {
          host: SEARCH_SERVICE, //process.env.SEARCH_HOST || 'localhost',
          port: parseInt(process.env.SEARCH_PORT || '4003'),
        },
      },
      kafkaClientOptions,
    ]),
    LoggerModule,
  ],
  controllers: [
    AuthController,
    AdminController,
    SearchController,
    UsersController,
  ],
  providers: [JwtAuthGuard],
  exports: [JwtModule],
})
export class ApiGatewayModule {}
