import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchHistory } from './entities/search-history.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import * as Joi from 'joi';
import { PactmanClient } from './pactman/pactman.client';
import { HttpModule } from '@nestjs/axios';
import { PactmanClientMock } from './pactman/packmanClientMock';
import { KafkaProducerService } from './kafka/kafka.producer.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(__dirname, ' ', '../../search/.env'),
      validationSchema: Joi.object({
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
        entities: [SearchHistory],
        synchronize: true, // disable in production
      }),
    }),
    TypeOrmModule.forFeature([SearchHistory]),
    HttpModule,
  ],
  controllers: [SearchController],
  exports: [
    /*KafkaProducerService*/
  ],
  providers: [
    SearchService,
    // KafkaProducerService,
    {
      provide: PactmanClient,
      useClass:
        process.env.USE_MOCK_PACTMAN == 'true'
          ? PactmanClientMock
          : PactmanClient,
    },
  ],
})
export class SearchModule {}
