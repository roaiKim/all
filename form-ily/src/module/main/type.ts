import { async } from "@core";

export interface State {
    user: any;
    prevPathname: string | null;
    collapsed: boolean;
}
