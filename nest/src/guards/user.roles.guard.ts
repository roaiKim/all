import { CanActivate, Injectable, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { UserService } from "module/user/user.service";
import { Reflector } from "@nestjs/core";

/* @Injectable()
export class UserRole1 implements CanActivate {
    constructor(private readonly userService: UserService) {}
    canActivate(context: ExecutionContext): boolean {
        const headers = context.switchToHttp().getRequest().headers
        const headerss = context.getType()
        console.log('re', headerss)
        const {token} = headers
        // console.log('userService', this.userService.getRoles("ro"))
        if(token === "woaini") {
            return true
        }
        return false
    }
} */

@Injectable()
export class UserRole implements CanActivate {
    constructor(private readonly userService: UserService, private readonly reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean {
        const role = this.reflector.get("roles", context.getHandler());
        console.log("roles", typeof role, role);
        if (!role) {
            return true;
        }

        const headers = context.switchToHttp().getRequest().headers;
        const { role: userRole } = headers;
        console.log("userRole", typeof userRole, userRole);

        if (!userRole) {
            // return false
            throw new HttpException(
                {
                    code: 400,
                    error: "",
                    message: "你没有权限",
                },
                HttpStatus.OK
            );
        }
        if (role === userRole) {
            return true;
        }
        return false;
    }
}
