import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { SearchModule } from './search.module';
import { SEARCH_SERVICE } from '@app/shared';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(SearchModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: SEARCH_SERVICE, //'0.0.0.0',
      port: parseInt(process.env.TCP_PORT || '4003'),
    },
  });

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       clientId: 'search-service',
  //       brokers: [process.env.KAFKA_BROKER!],
  //     },
  //     consumer: {
  //       groupId: 'search-consumer',
  //     },
  //   },
  // });

  await app.startAllMicroservices();
  await app.init();
  console.log('✅ SearchService is running...');
}
bootstrap();
