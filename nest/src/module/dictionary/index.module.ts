import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { DictionaryController } from "./index.controller";
import { DictionaryService } from "./index.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DictionaryEntity } from "./index.entity";
import { AuthService } from "module/auth/auth.service";
import { AuthModule } from "module/auth/auth.module";

@Module({
    imports: [AuthModule, TypeOrmModule.forFeature([DictionaryEntity])],
    controllers: [DictionaryController],
    providers: [DictionaryService],
    exports: [DictionaryService],
})
export class DictionaryModule {}
