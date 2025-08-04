import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaProducerService {
  constructor(@Inject('KAFKA_PRODUCER') private readonly kafka: ClientKafka) {}

  async emit(topic: string, message: any) {
    return this.kafka.emit(topic, message);
  }
}
