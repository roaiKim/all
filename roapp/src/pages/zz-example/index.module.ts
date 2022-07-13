import { Interval, KeepState, Loading, Module, register } from "@core";
import { WithConfirm } from "@utils/decorator/withConfirm";
import { RootState } from "type/state";
import { State } from "./type";

// 默认 state
const initialExampleState: State = {
    name: null,
};

class ExampleModule extends Module<RootState, "example"> {
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
        // await this.address();
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
        // UserService.address({ offset: 0, limit: 999 }).then((addressInfo) => {
        //     this.setState({ addressInfo });
        // });
    }

    // 获取地址簿列表 接口请求 事例二
    async address2() {
        // const addressInfo = await UserService.address({ offset: 0, limit: 999 });
        // this.setState({ addressInfo });
        // 接口请求 放入到了 ModuleName 下的 state 中, 详细用法 看下方的 redux 介绍
    }

    // WithConfirm 装饰器 用于二次确认 比如删除 退出功能.可以传 参数 提示内容
    @WithConfirm()
    async delete() {
        console.log("--delete--");
    }
}

const module = register(new ExampleModule("example", initialExampleState));
const actions = module.getActions();

export { module, actions };
