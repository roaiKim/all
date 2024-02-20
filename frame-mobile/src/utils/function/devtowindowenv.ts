import dayjs from "dayjs";
import { isDevelopment } from "config/static-envs";
import { modules } from "./loadComponent";

if (isDevelopment) {
    console.log("%c dev", "color: red");
    (window as any).__modules = modules;
    (window as any).__dayjs = dayjs;
}
