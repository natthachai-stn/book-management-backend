import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        let message = 'Internal server error';

        if (exception instanceof HttpException) {
            const responseMessage = exception.getResponse();
            message =
                typeof responseMessage === 'string'
                    ? responseMessage
                    : (responseMessage as any)?.message || message;
        } else if (exception instanceof Error) {
            message = exception.message || message;
        }

        response.status(status).json({
            message,
            data: []
        });
    }
}
