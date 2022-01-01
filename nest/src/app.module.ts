import { resolve } from "path";
import { Module } from "@nestjs/common";
import { UserModule } from "./module/user/user.module";
import { ConfigModule, ConfigService } from "nestjs-config";
import { TypeOrmModule } from "@nestjs/typeorm";
// import { FileUploadModule } from 'module/fileUpload/file.module';
// import { HttpRoModule } from 'module/http/http.module';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { ChatEventsModule } from 'module/webSocket/chat.module';
// import { TimingMoule } from 'module/timingTask/timing.module';
// import { StreamModule } from 'module/stream/stream.module';
// import { FileDownloadModule } from 'module/fileDownload/file.module';

@Module({
    imports: [
        ConfigModule.load(resolve(__dirname, "config", "**/!(*.d).{ts,js}")),
        TypeOrmModule.forRootAsync({
            useFactory: (config: ConfigService) => config.get("db"),
            inject: [ConfigService],
        }),
        /* ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'client'),
      exclude: ['/api*']
    }), */
        UserModule,
        // FileUploadModule,
        // HttpRoModule,
        // ChatEventsModule,
        // TimingMoule,
        // StreamModule,
        // FileDownloadModule
    ],
})
export class AppModule {}
