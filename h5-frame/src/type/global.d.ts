declare module "uuid" {
    export const v4: () => string;
}

declare interface ModuleStatement {
    /**
     * name: 必须要的 是模块名称同时也是模块的路径
     */
    name: string;
    /**
     * 模块显示名称
     */
    title: string;
    /**
     * 路径
     */
    path?: string;
    /**
     * h5 用于下方的 TabBar
     */
    bar?: boolean;
    /**
     * 菜单图片
     */
    icon?: string;
    /**
     * 是否显示
     */
    disabled?: boolean;
    /**
     * 顺序 暂无用处
     */
    order?: number;
    /**
     * page组件
     * 可以是异步的(用async封装) 推荐
     * 也可以同步的 知道导入
     */
    component: ComponentType<any>;
}
