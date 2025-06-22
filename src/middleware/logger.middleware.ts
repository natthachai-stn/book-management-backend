import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as moment from 'moment';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const log = {
            timestamp: moment().format('DD/MM/YYYY HH:mm:ss A'),
            method: req.method,
            url: req.protocol + '://' + req.get('host') + req.originalUrl,
        };

        console.log(JSON.stringify(log));
        next();
    }
}
