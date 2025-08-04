import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { AUTH_SERVICE, MicroserviceValidationPipe } from '@app/shared';

async function bootstrap() {
  const envPath = join(__dirname, ' ', '../../auth/.env');
  dotenv.config({ path: envPath });
  const app = await NestFactory.create(AuthModule);

  // Swagger Setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Auth Service')
    .setDescription('Handles authentication and user management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Kafka Microservice
  // const microserviceKafka = await app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       clientId: 'auth-service',
  //       brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
  //     },
  //     consumer: {
  //       groupId: 'auth-consumer',
  //     },
  //   },
  // });
  // // TCP Microservice
  const microserviceTcp = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: AUTH_SERVICE, //'127.0.0.1',
      port: 4001, //parseInt('4001'),
    },
  });
  // ✅ THIS IS WHAT MAKES VALIDATION PIPE WORK
  app.useGlobalPipes(new MicroserviceValidationPipe());
  await app.startAllMicroservices();

  console.log('Auth service running...');
}

bootstrap();
