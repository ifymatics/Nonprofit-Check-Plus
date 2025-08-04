import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { User } from './users/entities/users.entity';
import { LoginDto, RegisterDto } from '@app/shared/dtos';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should call authService.signup with the correct payload and return the result', async () => {
      const signupDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'John Doe',
      };

      const result: User = {
        id: 'user-id',
        email: signupDto.email,
        password: 'hashed-password',
        fullName: signupDto.fullName,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        isVerified: false,
      };

      mockAuthService.register.mockResolvedValue(result);

      const response = await controller.register(signupDto);
      expect(authService.register).toHaveBeenCalledWith(signupDto);
      expect(response).toEqual(result);
    });
  });

  describe('login', () => {
    it('should call authService.login with the correct payload and return a JWT token', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const token = 'jwt.token.here';
      mockAuthService.login.mockResolvedValue({ accessToken: token });

      const response = await controller.login(loginDto);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(response).toEqual({ accessToken: token });
    });
  });
});
