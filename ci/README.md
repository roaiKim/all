## sino-wechat-app
华人临床小程序
- react redux taro taro-ui 

## 安装
> yarn install
## 运行
> yarn dev:weapp // 微信小程序

然后打开微信开发者工具 选择导入 文件夹为当前目录的 dist 文件夹, 更改代码后 会自动重新编译

## 项目目录
``` ts
|-- config
|-- core // 框架核心
|-- src
    |-- pages
        |-- index
            |-- component // 页面组件page
                |-- index.less
                |-- main.tsx
            |-- index.config.ts
            |-- index.module.ts // 数据模型层 所有的请求接口和全局状态Redux都需要在这里  详情看下方
            |-- index.ts // page 入口 固定写法 数据模型层和组件相连接
            |-- type.ts // 类型 这个模块的类型 State 及其他 类型
        |-- user
            |-- component
                |-- index.less
                |-- main.tsx
            |-- index.config.ts
            |-- index.module.ts
            |-- index.ts
            |-- type.ts
    |-- service
        |-- api // 所有的后台请求接口都需要放在这
            |-- UserService.ts
            |-- XXXService.ts
        |-- type
            |-- state.ts // 全局 Redux State
        |-- utils
            |-- decorator // 装饰器
                |-- withConfirm.ts // 二次确认装饰器
            |-- common.ts
        |-- app.config.ts // Taro config 文件
        |-- app.less
        |-- app.loading.tsx // loading 文件
        |-- app.ts // 整个 wechat 入口
        |-- index.html
|-- .eslintrc.js
|-- prettier.json
|-- project.tt.json
|-- package.json
|-- global.d.ts
|-- babel.config.js
|-- project.config.json 
|-- README.md
|-- tsconfig.json
|-- .editorconfig
|-- yarn.lock
```

## Example
> <span style="color: #45df0b"> 完整详细的 在 src/pages/zz-example 文件夹, 内部有详细的介绍和注释 </span>

## 开发
pages 下的每一个文件夹都是一个页面,也是一个模块, 每一个模块都会有这个状态的redux目录
``` ts
|-- pages
        |-- index
            |-- component // 页面组件page
                |-- index.less
                |-- main.tsx
            |-- index.config.ts
            |-- index.module.ts // 数据模型层 所有的请求接口和全局状态Redux都需要在这里 详情看下方
            |-- index.ts // page 入口 固定写法 数据模型层和组件相连接
            |-- type.ts // 类型 这个模块的类型 State 及其他 类型
```
* component
    * 具体的Page组件
* index.config.ts
    *  Taro的页面配置
* index.module.ts
    * 数据模型层 详情看下方
* index.ts
    * page 组件入口 固定写法 模块都一样
* type.ts
    * 类型

## 数据模型层(src/pages/xxx/index.module.ts)
> 每一个模块下的 index.module.ts 都是这个模块的模型数据 整个应用的 接口请求功能、redux交互和跳转到其他页面 都应该写在这里
> 例如
``` ts
// 初始化 这个模块下的 state
const initialHomeState: State = {
    name: null,
    addressInfo: null
};
// 数据模型
// "home" 为这个模块的名字 需要在 type/state.ts 中定义
class HomeModule extends Module<RootState, "home"> {
    // onEnter 模块page安装完自动执行的方法 类似于 componentDidMount
    // 对于page刚刚进来自动执行的方法都需要放在这个方法里面
    // Loading 装饰器 判断该方法是否在执行的 可以接收一个参数用于区分不同的 Loading 详情见下方的 @Loading 装饰器介绍 使用 @Loading只能装饰 async 函数
    @Loading()
    async onEnter(parms) {
        // parms 参数 是获取跳转过来的 url 中querystring参数 对象格式 可以这里取 然后放入 redux
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 2000);
        });
        // 放入 Redux 中 // 在这个模块的
        this.setState({ name: "ROSEN" });
        await this.address();
        // ...
    }

    // onDestroy componentWillUnMount page组件卸载执行的方法
    // 由于 page 销毁时 会自动清空该模块下的State， 如果 不想清空 使用 @KeepState(ture) 
    @KeepState(true)
    onDestroy() {}

    // onTick 方法会自动循坏(上一个请求结束才会进行下一个请求) 无法提前结束 直到页面被销毁 @Interval(10) 可以设置时间间隔 单位为 秒
    @Interval(10)
    onTick() {}

    // 其他方法
    reset() {
        this.setState({ name: null });
    }

    // 获取地址簿列表 接口请求 示例一
    address1() {
        UserService.address({ offset: 0, limit: 999 }).then((addressInfo) => {
            this.setState({ addressInfo });
        });
    }
    // 获取地址簿列表 接口请求 事例二
    async address2() {
        const addressInfo = await UserService.address({ offset: 0, limit: 999 });

        this.setState({ addressInfo });
        // 接口请求 放入到了 ModuleName 下的 state 中, 详细用法 看下方的 redux 介绍
    }

    // WithConfirm 装饰器 用于二次确认 比如删除 退出功能.可以传 参数 提示内容
    @WithConfirm()
    async delete() {
        console.log("--delete--");
    }
}

// 注册一个模块 "home" 为模块名
const module = register(new HomeModule("home", initialHomeState));
// 模块导出的 actions 
const actions = module.getActions();
```

## Service/api
> 整个系统的 接口 都放在这里

## type/state.ts
> 这个是整个系统的 redux state 类型.每新增一个模块都需要在这里定义模块的 state

## Decorator 装饰器

### @Loading 
> @core 导出。可以监听这个方法是否正在运行. 可以用于loading显示  
> 函数开始运行时 loading为true, 运行结束后loading为false;  
> 不传参数意味着 全局的loading。不需要自己额外实现效果。比如加载数据需要全局loading。只需要在<span style="color: orange"> 数据模型层 </span>用@Loading 修饰。会自动全局显示loading。  
> 其他的需要自己用于实现。    
> 比如 Button 点击之后 用于显示 Button 的loading状态  
> <span style="color: orange"> @Loading 的参数用于区分不同的 loading名称, 可相同。但同一个页面 不同的Button Loading 需要不同的name。不同页面name则可以相同</span>  
> <span style="color: orange"> @Loading 只能修饰 async 函数 </span>

``` ts
// index.module.ts
class HomeModule extends Module<RootState, "home"> {
    // 这里设置 Loading 的名称为 saveButton。
    @Loading("saveButton")
    async onButtonClick(parms) {
        const data = await fetchData();
        //...
    }
}
```

``` js
// 使用方法一
// component/main.tsx
function Home(props: HomeProps) {
    const dispatch = useDispatch();
    const { autoLoading } = props;
    return (
        <View className="ro-home-page">
            <Text>Hello world! Welcome {name} </Text>
            <Button
                loading={autoLoading}
                onClick={() => {
                    // 这个action 用@Loading 修饰
                    dispatch(actions.onButtonClick());
                }}
            >
                删除
            </Button>
        </View>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        name: state.app.home.name,
        autoLoading: showLoading(state, "saveButton"), // 这里获取到名称为 saveButton 的 loading
    };
};

export default connect(mapStateToProps)(Home);
```

``` ts
// 使用方法二
// component/main.tsx
function Home(props: PropsWithChildren<HomeProps>) {
    // 获取名称为 saveButton 的 loading
    const saveButtonloading = useLoadingStatus("saveButton");
    const { children } = props;
    return (
        <Button
                loading={saveButtonloading}
                onClick={() => {
                    // 这个action 用@Loading 修饰
                    dispatch(actions.onButtonClick());
                }}
            >
                删除
        </Button>
    );
}
```

### @WithConfirm
> 当某一个方法需要 二次确认时 可以使用这个修饰 比如 删除 退出 等动作

``` ts
// 数据模型
// component/main.tsx
class HomeModule extends Module<RootState, "home"> {
    // WithConfirm 装饰器 用于二次确认 比如删除 退出功能.可以传 参数 提示内容
    @WithConfirm()
    delete() {
        console.log("--delete--");
    }
}
```

``` js
// component/main.tsx
// 当点击 删除时 会自动弹窗 二次确认是否继续操作
function Home(props: HomeProps) {
    const dispatch = useDispatch();
    const { autoLoading } = props;
    return (
        <View className="ro-home-page">
            <Text>Hello world! Welcome {name} </Text>
            <Button
                loading={autoLoading}
                onClick={() => {
                    dispatch(actions.delete());
                }}
            >
                删除
            </Button>
        </View>
    );
}
```

### @Mutex 互斥锁
> 某一个方法禁止连续调用时 可以用这个修饰  
> 防止用户多次点击(比如下单操作)  
> <span style="color: orange"> @Mutex 只能修饰 async 函数 </span>  

``` ts
class HomeModule extends Module<RootState, "home"> {
    @Mutex()
    async reset() {
        console.log("reset-click");
        await fetch();
        this.setState({ name: null });
    }

}
```

> 其他 装饰器请参考[数据模型层](#数据模型层srcpagesxxxindexmodulets)

## Redux 数据模型 type/state.ts
> <span style="color: orange"> RootState["app"] 下的 key 和模块之间有约束 </span>
``` ts
// 这个 home 名称需要是 RootState["app"] 下的 key
const module = register(new HomeModule("home", initialHomeState));
```
``` ts
import { State } from "@core";
import { State as HomeState } from "pages/index/type";
import { State as ProfileState } from "pages/user/type";
// 这个整个 Redux 的状态树
// app 下是 每一个 page 的 state
export interface RootState extends State {
    app: {
        home: HomeState;
        profile: ProfileState;
    };
}

```
``` ts
// @core state
export interface State {
    loading: LoadingState;
    navigationPrevented: boolean;
    app: object;
}
```

## 需要注意的点
* 不能在组件内部请求数据   

<span style="color: orange"> 不正确的方式 </span> 

``` js
// component/main.tsx
function Home(props: HomeProps) {
    const [data, setData] = useState();
    // 对于 componentDidMount 生命周期的请求, 需要在该 page 的模型层的onEntry方法中操作
    useEffect(() => {
        fetApi().then((response) => {
            setData(response);
        });
    }, []);

    return (
        <View className="ro-home-page">
            不正确的
        </View>
    );
}
```

<span style="color: orange"> 正确的方式 </span> 

``` ts
class HomeModule extends Module<RootState, "home"> {
    @Loading()
    async onEnter(parms) {
        const response = await fetApi();
        this.setState({data: response})
    }
}
```

## QA
* 为什么要数据模型层
  > 因为 需要 把组件和数据隔离开来。对于组件来说 不应该做该组件不相干的事情，不应该关心数据是怎么请求的。数据和组件各司其职。  
  > 把某一个模块下的所有请求动作全部放到一起，方便管理
