import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users/users.service';
import { JwtService } from '@nestjs/jwt';
import { KafkaProducerService } from './kafka/kafka-producer.service';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto, RegisterDto } from '@app/shared/dtos';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let kafkaProducer: KafkaProducerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            validateLogin: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: KafkaProducerService,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    kafkaProducer = module.get<KafkaProducerService>(KafkaProducerService);
  });

  describe('register', () => {
    it('should create a user and emit Kafka event', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
      };

      const mockUser = {
        id: 'user-id-123',
        email: dto.email,
        name: dto.fullName,
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(mockUser as any);

      const emitSpy = jest.spyOn(kafkaProducer, 'emit');

      const result = await service.register(dto);

      expect(usersService.create).toHaveBeenCalledWith(dto);
      expect(emitSpy).toHaveBeenCalledWith('user.created', {
        userId: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should return JWT token if credentials are valid', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = { id: 'user-id-123', email: dto.email };

      jest
        .spyOn(usersService, 'validateLogin')
        .mockResolvedValue(mockUser as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mocked-jwt-token');

      const result = await service.login(dto);

      expect(usersService.validateLogin).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id });
      expect(result).toEqual({ token: 'mocked-jwt-token' });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const dto: LoginDto = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(usersService, 'validateLogin').mockResolvedValue(null as any);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
