import { Controller, Get, Query, Post, Body, UseGuards, SetMetadata, Param } from "@nestjs/common";
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
    async getTree(): Promise<RoResponse<DictionaryEntity>> {
        const dictionarys = await this.dictionaryService.getList();
        return { code: 0, message: "OK", data: dictionarys || null };
    }

    @Post("create/tree")
    async createTree(@Body() request: DictionaryEntry): Promise<RoResponse<string>> {
        const result = await this.dictionaryService.createTree(request);
        return { code: 0, message: "OK", data: result };
    }

    @Post("update/tree")
    async updateTree(@Body() request: DictionaryEntry): Promise<RoResponse<string>> {
        const { content } = request;
        const result = await this.dictionaryService.updateTree(content);
        return { code: 0, message: "OK", data: result };
    }

    @Post("add/:type")
    async addSubTree(@Param("type") type: string, @Body() request: DictionaryEntry): Promise<RoResponse<string>> {
        const { text, code } = request;
        const result = await this.dictionaryService.addSubTree(type, text, code);
        return { code: 0, message: "OK", data: result };
    }

    @Get("get/:type")
    async getSubTree(@Param("type") type: string): Promise<RoResponse<DictionaryEntry[]>> {
        const result = await this.dictionaryService.getSub(type);
        return { code: 0, message: "OK", data: result };
    }
}
