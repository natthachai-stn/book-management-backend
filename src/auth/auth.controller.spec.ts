import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
    let controller: AuthController;

    const mockAuthService = {
        login: jest.fn(),
        validateUser: jest.fn(),
        validateToken: jest.fn(),
    };

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: mockAuthService
                }
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should login user and return token', async () => {
        const mockTokenResult = {
            message: 'get access token success',
            user: {
                email: 'john@test.com',
                fullname: 'John Doe',
            },
            accessToken: 'signed-token',
        };

        mockAuthService.login.mockResolvedValue(mockTokenResult);

        const req = { user: { email: 'john@test.com' } } as any;

        const result = await controller.login(req);

        expect(mockAuthService.login).toHaveBeenCalledWith(expect.objectContaining({ email: 'john@test.com' }));
        expect(result).toEqual(mockTokenResult);
    });
});
