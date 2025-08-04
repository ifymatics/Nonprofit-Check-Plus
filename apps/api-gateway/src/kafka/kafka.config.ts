import { ClientProviderOptions, Transport } from '@nestjs/microservices';

export const kafkaClientOptions: ClientProviderOptions = {
  name: 'KAFKA_CLIENT',
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'api-gateway',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    },
    consumer: {
      groupId: 'api-gateway-consumer',
    },
  },
};
