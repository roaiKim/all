# nest
### 控制器
> 控制器负责处理传入的 请求 和向客户端返回 响应
用 @Controller() 装饰

### 提供者
> Providers 是提供服务的对象 可以是 service,repository,factory, helper 等对象。 
用 @Injectable() 装饰
可以通过 constructor 注入

### 模块 

> 是用来处理组织架构的对象
用 @module() 装饰
接受一个对象
> providers 需要注入的提供者
> controllers 创建的一组控制器
> imports 需要导入的模块 这些模块导出了当前模块的提供者
> exports 本模块导出的提供者， 可供其他 导入了 当前模块的 模块 使用 本模块的提供者

### 中间件

> 中间件是路由处理程序之前的函数
> nest中间件等价于express中间件

```typescript
// 中间件的实现 class中间件需要实现NestMiddleware接口
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    console.log('Request...');
    next();
  }
}

// 应用中间件 集成在模块中 模块需要实现 NestModule
@Module({
  // 
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(UserController); // 为 UserController 控制器应用中间件
    }
}
```


### 异常过滤器

> 异常过滤器是处理异常的问题 返回对用户友好的提示

```typescript
// 定义自定义异常
export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}

// 使用自定义异常
throw new ForbiddenException();
```

```typescript
// 定义异常过滤器
// @Catch 告诉过滤器处理 HttpException 类的异常;
// @Catch可以接受多个参数;
// 如果需要处理所有异常 不用@Catch装饰
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response
      .status(status)
      .json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}
// 使用异常过滤器
@UseFilters(new HttpExceptionFilter())
```


### 管道
> 管道是一种转化或验证功能的对象 用@Injectable()装饰

###### 有两个功能
> 1 转化: 将输入的数据转化成所需要的数据输出
> 2 验证: 对输入的数据进行验证,成功就继续传递,失败着抛出异常,由全局过滤器处理

// TODO: 未完待续



### 守卫
> 守卫是一个使用 @Injectable() 装饰器的类, 它的功能是是守卫路由的对象; 它在每一个中间件之后执行,在任何的拦截器和管道之前执行

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
```

### 拦截器
> 拦截器具有函数执行前后的添加一些逻辑 可以转化函数返回的结果
```typescript
class TransformInterceptor implements NestInterceptor {
    intercept (content: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(map(data => ({
            "code": 0,
            "message": "OK",
            "data": data || null
        })))
    }
}

//
@UseInterceptors(TransformInterceptor)
```