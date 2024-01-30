import { ComponentType } from "react";
import { RouteComponentProps } from "react-router";
// 这个是全局加载的功能
// @ts-ignore webpack 提供的功能 ts 暂时无法识别
const origins = require.context("module/", true, /type\.ts$/);
const modulesId: string[] = origins.keys().filter((item: string) => item.startsWith("module"));

export const modules: ModuleStatement[] = modulesId
    .map((id) => origins(id).statement)
    .filter((item) => !!item && !item.disabled)
    .sort((prev, next) => (prev.order || 9) - (next.order || 10));
