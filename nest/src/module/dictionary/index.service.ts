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

    async createTree(dic: DictionaryEntry): Promise<string> {
        try {
            const tree = {
                isJson: 1,
                code: "DICTIONARY_TREE_LIST",
                ...dic,
            };
            await this.dictionaryRepository.insert(tree);
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

    async updateTree(content: string): Promise<string> {
        try {
            await this.dictionaryRepository.update({ code: "DICTIONARY_TREE_LIST" }, { content });
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

    async addSubTree(type: string, text: string, code: string): Promise<string> {
        try {
            const tree = { isJson: 1, type, code, text };
            await this.dictionaryRepository.insert(tree);
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

    async getSub(type: string): Promise<DictionaryEntity[]> {
        const dictionary = await this.dictionaryRepository.find({ where: { type } });
        return dictionary;
    }
}
