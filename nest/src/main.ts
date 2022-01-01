import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { CustomException } from "./filter/http.exception.filter";
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   await app.listen(3000);
// }
// bootstrap();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix("api"); // 全局路由前缀

    app.use(cookieParser()); // 使用cookie中间件

    app.useGlobalFilters(new CustomException()); // 启用全局异常过滤器

    // app.useWebSocketAdapter(new WsAdapter(app)); // 启动websocket Adapter

    // app.use(history()); // history-api-fallback

    app.enableCors();

    await app.listen(3200);
}

bootstrap();

console.info("\n程序已启动", "端口为3200\n");
