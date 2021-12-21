import { async, AsyncOptions, State, ReactComponentKeyOf } from "@core";
import { State as HomeState } from "module/home/type";
import { State as MainState } from "module/main/type";
import { State as GameOneState } from "module/game/gameOne/type";
import { State as GameTwoState } from "module/game/gameTwo/type";

export interface RootState extends State {
    app: {
        main: MainState;
        home: HomeState;
        gameOne: GameOneState;
        gameTwo: GameTwoState;
    };
}

// @ts-ignore
const modules = require.context("module/", true, /type\.ts$/);

// 这个是由于 webpack 本身的 bug 导致的, webpack.config.js 文件中， 如果 resolve.modules 定义了 则 require.context 会有多(双)倍的
const modulesPath = modules.keys().filter((item: string) => item.startsWith("module"));

interface CacheModules {
    moduleId: string;
    module: {
        path: string;
        title: string;
        icon: any;
        disabled?: boolean;
        Component: <T, K extends ReactComponentKeyOf<T>>(resolve: () => Promise<T>, component: K, params: AsyncOptions) => T[K];
        permissions: string[];
    };
}

const cacheModules: CacheModules[] = modulesPath
    .map((path: string) => ({
        moduleId: path,
        module: modules(path).default,
    }))
    .filter((item: CacheModules) => item.module)
    .filter((item: CacheModules) => !item.module.disabled);

const ai = cacheModules.map((item) => item.module);

type UIs = typeof ai;

console.log("modulesPath", modulesPath);
console.log("cacheModules", cacheModules);
