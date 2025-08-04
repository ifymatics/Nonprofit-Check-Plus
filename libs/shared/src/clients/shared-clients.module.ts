// src/shared/shared-clients.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ADMIN_SERVICE, AUTH_SERVICE, SEARCH_SERVICE } from '@app/shared'; // adjust path if needed
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ADMIN_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: '0.0.0.0',
            port: 4002,
          },
        }),
      },
      {
        name: AUTH_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: '0.0.0.0',
            port: 4001,
          },
        }),
      },

      {
        name: SEARCH_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: '0.0.0.0',
            port: 4003,
          },
        }),
      },
    ]),
  ],
  exports: [ClientsModule], // 👈 make all clients available to other modules
})
export class SharedClientsModule {}
