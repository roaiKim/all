import { Injectable, HttpException, HttpStatus, forwardRef, Inject } from "@nestjs/common";
import { UserGetUserRequest } from "module/type";
import { Repository, Connection, getRepository, Like } from "typeorm";
import { UserEntity } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "module/auth/auth.service";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly usersRepository: Repository<UserEntity>,
        private connection: Connection,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ) {}

    async getUserList(quest: UserGetUserRequest): Promise<[UserEntity[], number]> {
        const user = await this.usersRepository.findAndCount({
            take: 10,
            skip: 0,
        });
        return user;
    }

    async createUser(user: UserGetUserRequest[]): Promise<string> {
        try {
            await this.usersRepository.insert(user);
            return "ok";
        } catch (exception) {
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

    async updateUser(id: string, name: string): Promise<string> {
        // 直接用语句更新 不需要先查找再更新
        const result = await this.usersRepository.update({ id }, { name });
        if (!result.affected) {
            throw new HttpException(
                {
                    message: "",
                    error: "用户不存在",
                    code: 15530,
                },
                HttpStatus.BAD_REQUEST
            );
        }
        return "ok";
    }

    async deteleUser(name: string): Promise<string> {
        const user = await this.usersRepository.delete({ name });
        if (!user.affected) {
            throw new HttpException(
                {
                    message: "",
                    error: "用户不存在",
                    code: 15530,
                },
                HttpStatus.BAD_REQUEST
            );
        }
        return "ok";
    }

    async getUser(name: string): Promise<UserEntity> {
        const user = await this.usersRepository.findOne({
            name: Like(`%${name}%`),
        });
        // const user = await this.usersRepository.find({where: [{name: Like(`%luo%`)}, {id: Like(`%4329%`)}]});
        if (!user) {
            throw new HttpException(
                {
                    message: "",
                    error: "用户不存在",
                    code: 15530,
                },
                HttpStatus.BAD_REQUEST
            );
        }
        return user;
    }

    async getUserIncludePassword(name: string): Promise<UserEntity> {
        const user = await this.usersRepository.findOne({ where: { name } });
        if (!user) {
            throw new HttpException(
                {
                    message: "",
                    error: "用户不存在",
                    code: 15530,
                },
                HttpStatus.BAD_REQUEST
            );
        }
        return user;
    }

    async getUserByCookie(id: string): Promise<UserEntity> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new HttpException(
                {
                    message: "",
                    error: "用户不存在",
                    code: 15530,
                },
                HttpStatus.BAD_REQUEST
            );
        }
        // 随机 延迟 1000 ms 以内
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(user);
            }, Math.random() * 3000);
        });
    }

    async login(name: string, password: string): Promise<UserEntity> {
        const user = await this.usersRepository.findOne({
            where: { name, password },
        });
        if (!user) {
            throw new HttpException(
                {
                    message: "用户名或密码不正确!",
                    error: "",
                    code: 2323,
                },
                HttpStatus.BAD_REQUEST
            );
        }
        return user;
    }
}
