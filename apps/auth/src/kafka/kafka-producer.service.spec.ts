import { Test, TestingModule } from '@nestjs/testing';
import { KafkaProducerService } from './kafka-producer.service';
import { ClientKafka } from '@nestjs/microservices';

describe('KafkaProducerService', () => {
  let service: KafkaProducerService;
  let kafkaClientMock: Partial<ClientKafka>;

  beforeEach(async () => {
    kafkaClientMock = {
      emit: jest.fn().mockReturnValue({
        toPromise: () => Promise.resolve('mocked-response'),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaProducerService,
        {
          provide: 'KAFKA_PRODUCER',
          useValue: kafkaClientMock,
        },
      ],
    }).compile();

    service = module.get<KafkaProducerService>(KafkaProducerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call kafka.emit with topic and message', async () => {
    const topic = 'test-topic';
    const message = { foo: 'bar' };

    await service.emit(topic, message);

    expect(kafkaClientMock.emit).toHaveBeenCalledWith(topic, message);
  });
});
