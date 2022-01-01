import { ExceptionFilter, ArgumentsHost, HttpException } from "@nestjs/common";

export class CustomException implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): JSON {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        if (exception instanceof HttpException) {
            const exceptionBody = exception.getResponse();
            // 只会转化含有code的自定义的 HttpException 而且消息体为json对象
            if (exceptionBody.hasOwnProperty("code") && typeof exceptionBody === "object") {
                const exceptionResponse = {
                    ...exceptionBody,
                    timeISO: new Date().toISOString(),
                    path: request.url,
                };
                return response.status(200).json(exceptionResponse);
            }
        }
        // 有些异常没有 getStatus() 或 getResponse()
        try {
            return response.status(exception.getStatus()).json(exception.getResponse());
        } catch {
            return response.status(200).json({
                message: exception.toString(),
                code: -1,
                timeISO: new Date().toISOString(),
                path: request.url,
            });
        }
    }
}
