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

    async getList(): Promise<DictionaryEntity> {
        const dictionary = await this.dictionaryRepository.findOne({ where: { code: "DICTIONARY_TREE_LIST" } });
        return dictionary;
    }

    async createUser(dic: DictionaryEntry[]): Promise<string> {
        try {
            await this.dictionaryRepository.insert(dic);
            return "ok";
        } catch (exception) {
            throw new HttpException(
                {
                    message: exception.sqlMessage,
                    error: exception.toString(),
                    code: 15530,
                },
                HttpStatus.BAD_REQUEST
            );
        }
    }
}
