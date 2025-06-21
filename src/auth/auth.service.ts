import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entity/user.entity';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findOne(email);
        if (user) {
            const comparePass = compareSync(pass, user.password);
            if (!comparePass) {
                throw new UnauthorizedException();
            }
        } else {
            throw new UnauthorizedException();
        }
        const { password, ...result } = user;
        return result;
    }

    async validateToken(token: string) {
        const result = await this.jwtService.verify(token, {
            secret: process.env.JWT_SECRET_KEY,
        });
        return result;
    }

    async login(user: User) {
        const payload = {
            fullname: `${user.firstname} ${user.lastname}`,
            email: user.email,
            id: user.id,
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET_KEY,
        });
        const result = {
            message: 'get access token success',
            user: {
                email: user.email,
                fullname: `${user.firstname} ${user.lastname}`,
            },
            accessToken,
        };
        return result;
    }

}
