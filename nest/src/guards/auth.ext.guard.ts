import { ExecutionContext, Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    canActivate(context: ExecutionContext): any {
        return super.canActivate(context);
    }

    handleRequest(err: unknown, user: unknown, info: Record<string, unknown>): any {
        if (err || !user) {
            throw (
                err ||
                new HttpException(
                    {
                        error: "未登录或登录过期",
                        message: info.toString(),
                        // code: 10000
                    },
                    HttpStatus.UNAUTHORIZED
                )
            );
        }
        return user;
    }
}

@Injectable()
export class redirctAuthGuard extends AuthGuard("jwt") {
    canActivate(context: ExecutionContext): any {
        return super.canActivate(context);
    }

    handleRequest(err: unknown, user: unknown, info: Record<string, unknown>, context: ExecutionContext): any {
        // console.log("ol", err, user, info)

        if (err || !user) {
            return false;
        }
        return user;
    }
}
