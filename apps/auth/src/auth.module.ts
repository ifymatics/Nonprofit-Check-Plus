import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as Joi from 'joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KafkaModule } from './kafka/kafka.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/users.entity';
import { join } from 'path';
import { AUTH_SERVICE } from '@app/shared';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, ' ', '../../auth/.env'),
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        TCP_PORT: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        KAFKA_BROKER: Joi.string().required(),
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DB_HOST'),
        port: Number(configService.getOrThrow('DB_PORT')),
        username: configService.getOrThrow('DB_USER'),
        password: configService.getOrThrow('DB_PASS'),
        database: configService.getOrThrow('DB_NAME'),
        entities: [User],
        synchronize: true, // disable in production
      }),
    }),

    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRATION') || '1d' },
      }),
      inject: [ConfigService],
    }),

    // Kafka client module for producing messages
    ClientsModule.register([
      //   {
      //     name: 'KAFKA_PRODUCER',
      //     transport: Transport.KAFKA,
      //     options: {
      //       client: {
      //         clientId: 'auth-service',
      //         brokers: [process.env.KAFKA_BROKER!],
      //       },
      //       consumer: {
      //         groupId: 'auth-consumer',
      //       },
      //     },
      //   },
      {
        name: AUTH_SERVICE, // TCP identifier
        transport: Transport.TCP,
        options: {
          host: AUTH_SERVICE, //'127.0.0.1',
          port: parseInt('4001'),
        },
      },
    ]),

    // KafkaModule,
    UsersModule,
  ],

  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
