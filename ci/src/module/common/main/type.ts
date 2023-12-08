interface NavPermission {
    key: string;
    label: string;
    children?: NavPermission[];
}

export interface State {
    /**
     * 权限数据加载是否完成
     */
    PERMISSION_DONE: boolean;
    /**
     * 菜单权限 只作用于菜单
     */
    navPermission: NavPermission[];
    /**
     * 页面权限
     */
    pagePermission: Record<string, { name: string }>;
}
