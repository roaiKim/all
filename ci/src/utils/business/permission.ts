const pagePermission = {};
/**
 * 转换菜单 dev
 * @param menus
 * @returns
 */
export function transformMeuns(menus) {
    const list = [];
    menus.forEach((item) => {
        let children = undefined;
        const childrenLength = item.children?.length;
        if (childrenLength && item.children.every((item1) => item1.type === "page" || item1.type === "category")) {
            children = item.children;
        }
        if (item.type === "page") {
            pagePermission[item.id] = {
                name: item.name,
            };
        }
        list.push({
            // key: item.type === "page" ? `/${item.id.replace(/\//g, "-")}` : item.id,
            key: item.id,
            label: item.name,
            children: children ? transformMeuns(children) : undefined,
        });
    });
    return list;
}

/**
 *
 * @returns 获取页面级别的权限
 */
export function getPagePermission() {
    return pagePermission;
}
