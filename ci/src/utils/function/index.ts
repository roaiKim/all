export function transformMeuns(menus) {
    const list = [];
    menus.forEach((item) => {
        let children = undefined;
        const childrenLength = item.children?.length;
        if (childrenLength && item.children.every((item1) => item1.type === "page" || item1.type === "category")) {
            children = item.children;
        }
        list.push({
            key: item.key,
            label: item.label,
            children: children ? transformMeuns(children) : undefined,
        });
    });
    return list;
}
