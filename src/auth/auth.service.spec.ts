import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../user/entity/user.entity';

const mockJwtService = () => ({
    sign: jest.fn(),
    verify: jest.fn(),
})

const mockUserService = () => ({
    findOne: jest.fn(),
})

jest.mock('bcrypt', () => ({
    compareSync: jest.fn().mockReturnValue(true)
}))

describe('AuthService', () => {
    let authService: AuthService
    let userService: ReturnType<typeof mockUserService>
    let jwtService: ReturnType<typeof mockJwtService>

    const mockUser = {
        id: '1',
        email: 'john@test.com',
        firstname: 'John',
        lastname: 'Doe',
    } as unknown as User

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useFactory: mockUserService
                },
                {
                    provide: JwtService,
                    useFactory: mockJwtService
                }
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService)
        userService = module.get(UserService)
        jwtService = module.get(JwtService)

    });

    it('should validate user if exists', async () => {
        userService.findOne.mockResolvedValue(mockUser);

        const result = await authService.validateUser('john@test.com', 'mockpass');
        expect(userService.findOne).toHaveBeenCalledWith('john@test.com');
        expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user not found', async () => {
        userService.findOne.mockResolvedValue(null);

        await expect(authService.validateUser('wronguser', 'wrongpass')).rejects.toThrow(UnauthorizedException);
    });

    it('should return token payload when validating token', async () => {
        const payload = {
            email: 'sam@test.com',
            exp: 1750717976,
            fullname: 'Sam Wilson',
            iat: 1750696376,
            id: 3
        }

        jwtService.verify.mockResolvedValue(payload)

        const result = await authService.validateToken('mocktoken');

        expect(jwtService.verify).toHaveBeenCalledWith('mocktoken', {
            secret: process.env.JWT_SECRET_KEY,
        });

        expect(result).toEqual(payload);
    });


    it('should return login result with token', async () => {
        jwtService.sign.mockReturnValue('signedToken');

        const result = await authService.login(mockUser);

        expect(jwtService.sign).toHaveBeenCalledWith(
            {
                fullname: 'John Doe',
                email: 'john@test.com',
                id: '1',

            },
            { secret: process.env.JWT_SECRET_KEY },
        );

        expect(result).toEqual({
            message: 'get access token success',
            user: {
                email: 'john@test.com',
                fullname: 'John Doe',
            },
            accessToken: 'signedToken',
        });
    });
});
