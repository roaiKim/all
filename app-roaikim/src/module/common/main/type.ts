interface NavPermission {
    key: string;
    label: string;
    children?: NavPermission[];
}

export interface State {
    name?: string;
    appLoadingStatus: "loading" | "done" | "error";
    navPermission: NavPermission[];
    pagePermission: Record<string, string>;
}
