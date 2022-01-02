import {
    Controller,
    Get,
    Query,
    Post,
    Body,
    Param,
    ParseIntPipe,
    Redirect,
    Req,
    UseGuards,
    Delete,
    Res,
    SetMetadata,
    forwardRef,
    Inject,
    Next,
    Ip,
    Session,
    UseInterceptors,
    Render,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { RoResponse, UserGetUserResponse, UserGetUserRequest, UserUpdateUserRequest, PageLimitResponse } from "module/type";
import { UserRole } from "guards/user.roles.guard";
import { JwtAuthGuard, redirctAuthGuard } from "guards/auth.ext.guard";
import { UserEntity } from "./user.entity";
import { Response } from "express";
import { AuthService } from "module/auth/auth.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { JwtUserToken } from "module/auth/auth.type";
import { join } from "path";
import TransformInterceptor from "interceptors/transformInterceptor";

// @Controller({path: 'user', host: "12"}) //
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

    @UseGuards(AuthGuard("local"))
    @Post("login")
    async login(@Body("name") requestName: string, @Body("password") password: string /* , @Res() response: Response */): Promise<any> {
        const user = await this.userService.login(requestName, password);
        const { name, id } = user;
        const token = this.authService.login({ name, userId: id });
        return {
            code: 0,
            message: "OK",
            data: {
                user: user,
                token: token,
            },
        };
        /* response.cookie('token', token, { maxAge: 432000000, httpOnly: true, domain: "http://127.0.0.1:8000", sameSite: "none",secure: true})
            return response.json({code: 0, message: "OK",data: {
            user: user,
            token: token
            }}) */
    }

    // @UseGuards(UserRole)
    // @UseGuards(JwtAuthGuard)
    @SetMetadata("roles", "admin")
    @Get("get")
    @UseInterceptors(TransformInterceptor)
    async getUser(@Query() request: UserGetUserRequest): Promise<UserEntity> {
        const user = await this.userService.getUser(request.name);
        console.log("--nest-->");
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Get("getuserlist")
    async getUserList(@Query() request: UserGetUserRequest): Promise<RoResponse<PageLimitResponse<UserEntity>>> {
        const [list, totalRecord] = await this.userService.getUserList(request);
        return { code: 0, message: "OK", data: { list, totalRecord } };
    }

    @SetMetadata("roles", ["admin", "ddd"])
    @Post("create")
    async createUser(@Body() request: UserGetUserRequest[]): Promise<RoResponse<string>> {
        console.log("create", request);
        const result = await this.userService.createUser(request);
        return { code: 0, message: "OK", data: result };
    }

    @Post("update/:id")
    async updateUser(@Param("id") id: string, @Body() request: UserUpdateUserRequest): Promise<RoResponse<string>> {
        const result = await this.userService.updateUser(id, request.name);
        return { code: 0, message: "OK", data: result };
    }

    @Delete("detele")
    async deteleUser(@Body() request: UserGetUserRequest): Promise<RoResponse<string>> {
        const result = await this.userService.deteleUser(request.name);
        return { code: 0, message: "OK", data: result };
    }

    @Post("change/:id")
    changePassword(@Param("id") password: string): RoResponse<UserGetUserResponse> {
        console.log("response", password);
        return { code: 0, message: "OK", data: { name: password } };
    }

    @Get("redirect")
    @Redirect("/login", 302)
    redirectLogin(@Res() response: Response): void {
        //
    }

    // @Get('redirect')
    @Redirect("", 302)
    redirectLogin2(@Res() response: Response): any {
        // console.log("response", response)
        // 动态确定重定向的url地址 / Redirect 修饰的方法返回下列的对象会覆盖Redirect中的url和code
        return { url: "https://www.baidu.com", statusCode: 302 };
    }

    // 通过jwt获取user
    @UseGuards(JwtAuthGuard)
    @Get("check")
    async getUserByCookie(@Req() request: Request & { user: JwtUserToken }): Promise<RoResponse<UserEntity>> {
        const { user } = request;
        const { userId = "" } = user;
        console.log("check: 3200", user);
        const userInfo = await this.userService.getUserByCookie(userId);
        return { code: 0, message: "OK", data: userInfo };
    }
}
