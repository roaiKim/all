import { JwtService } from "@nestjs/jwt";
import { UserService } from "module/user/user.service";
import { HttpException, HttpStatus, Injectable, forwardRef, Inject } from "@nestjs/common";
import { RoResponse } from "module/type";
import { UserEntity } from "module/user/user.entity";

@Injectable()
export class AuthService {
    constructor(
        // @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    /* async validateUser(name: string, password: string): Promise<UserEntity> {
        const user = await this.userService.login(name, password)
        if (user) {
            return user
        } else {
            throw new HttpException({
                error: "用户名或密码错误",
                message: "用户名或密码错误"
            }, HttpStatus.BAD_REQUEST)
        }
    } */

    login(user: { name: string; userId: string }): string {
        try {
            return this.jwtService.sign(user);
        } catch (error) {
            throw new HttpException(
                {
                    message: "",
                    error: "生成token失败,请稍后重试!",
                    code: 124569,
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }
}
