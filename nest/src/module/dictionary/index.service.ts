import { Injectable, HttpException, HttpStatus, forwardRef, Inject } from "@nestjs/common";
import { Repository, Connection, getRepository, Like } from "typeorm";
import { DictionaryEntity } from "./index.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "module/auth/auth.service";
import { UserGetUserRequest } from "module/type";
import { DictionaryEntry } from "./type";

@Injectable()
export class DictionaryService {
    constructor(
        @InjectRepository(DictionaryEntity)
        private readonly dictionaryRepository: Repository<DictionaryEntity>
    ) {}

    async getUserList(): Promise<[DictionaryEntity[], number]> {
        const user = await this.dictionaryRepository.findAndCount({
            take: 10,
            skip: 0,
        });
        return user;
    }

    async createUser(dic: DictionaryEntry[]): Promise<string> {
        try {
            await this.dictionaryRepository.insert(dic);
            return "ok";
        } catch (exception) {
            console.log("exception", exception);
            throw new HttpException(
                {
                    message: `${((exception.sqlMessage || "").match(/(?<='|").*?(?='|")/) || [])[0]} 已存在`,
                    error: exception.toString(),
                    code: 15530,
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }
}
