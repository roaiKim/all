import { Controller, Get, Query, Post, Body, UseGuards, SetMetadata } from "@nestjs/common";
import { DictionaryService } from "./index.service";
import { RoResponse, UserGetUserResponse, UserGetUserRequest, UserUpdateUserRequest, PageLimitResponse } from "module/type";
import { UserRole } from "guards/user.roles.guard";
import { JwtAuthGuard, redirctAuthGuard } from "guards/auth.ext.guard";
import { DictionaryEntity } from "./index.entity";
import { Response } from "express";
import { AuthService } from "module/auth/auth.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { JwtUserToken } from "module/auth/auth.type";
import { join } from "path";
import TransformInterceptor from "interceptors/transformInterceptor";
import { DictionaryEntry } from "./type";

@UseGuards(JwtAuthGuard)
@Controller("dictionary")
export class DictionaryController {
    constructor(private readonly dictionaryService: DictionaryService, private readonly authService: AuthService) {}

    @Get("get/tree")
    async getUserList(): Promise<RoResponse<DictionaryEntity>> {
        const dictionarys = await this.dictionaryService.getList();
        return { code: 0, message: "OK", data: dictionarys || null };
    }

    @Post("create/tree")
    async createUser(@Body() request: DictionaryEntry[]): Promise<RoResponse<string>> {
        console.log("request", request);
        const result = await this.dictionaryService.createUser(request);
        return { code: 0, message: "OK", data: result };
    }
}
