import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/users.entity';
import { RegisterDto } from '@app/shared/dtos';

describe('UsersController (Microservice TCP)', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'John Doe',
      };

      const result: User = {
        id: '1',
        email: dto.email,
        password: 'hashed-password',
        fullName: dto.fullName,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: false,
      };

      mockUsersService.create.mockResolvedValue(result);

      const response = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const result: User[] = [
        {
          id: '1',
          email: 'test@example.com',
          password: 'hashed-password',
          fullName: 'John Doe',
          isVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: false,
        },
      ];

      mockUsersService.findAll.mockResolvedValue(result);

      const response = await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
      expect(response).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user by ID', async () => {
      const id = '1';
      const result: User = {
        id,
        email: 'test@example.com',
        password: 'hashed-password',
        fullName: 'John Doe',
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: false,
      };

      mockUsersService.findOne.mockResolvedValue(result);

      const response = await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(response).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const id = '1';
      const dto: UpdateUserDto = {
        fullName: 'Jane Doe',
      };

      const result: User = {
        id,
        email: 'test@example.com',
        password: 'hashed-password',
        fullName: dto.fullName!,
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: false,
      };

      mockUsersService.update.mockResolvedValue(result);

      const response = await controller.update({ id, dto });
      expect(service.update).toHaveBeenCalledWith(id, dto);
      expect(response).toEqual(result);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const id = '1';
      const result = { message: 'User deleted successfully' };

      mockUsersService.remove.mockResolvedValue(result);

      const response = await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
      expect(response).toEqual(result);
    });
  });
});
