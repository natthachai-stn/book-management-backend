import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guard/local.guard';
import { Request } from 'express';
import { User } from '../user/entity/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalGuard)
    @Post('login')
    login(@Req() req: Request) {
        return this.authService.login(req.user as User);
    }

}
