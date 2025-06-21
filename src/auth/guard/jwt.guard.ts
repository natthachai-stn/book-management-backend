import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor(private readonly authService: AuthService) {
        super();
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest<Request>();
            const { authorization } = request.headers;
            if (!authorization || authorization.trim() === '') {
                throw new UnauthorizedException('Please provide token');
            }
            const authToken = authorization.replace(/bearer/gim, '').trim();
            const resp = await this.authService.validateToken(authToken);
            request.user = resp;
            return true;
        } catch (error) {
            throw new ForbiddenException(error.message || 'session expired! Please log in');
        }
    }
}
