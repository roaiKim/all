import { NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

class TransformInterceptor implements NestInterceptor {
    intercept(content: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => ({
                code: 0,
                message: "OK",
                data: data || null,
            }))
        );
    }
}

export default TransformInterceptor;
