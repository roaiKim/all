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
        list.push({
            key: item.key,
            label: item.label,
            children: children ? transformMeuns(children) : undefined,
        });
    });
    return list;
}

/**
 * 初始化 表格数据
 * @returns
 */
export function initialTableSource() {
    return {
        table: {
            source: {
                data: [],
                pageIndex: 1,
                pageSize: 20,
                total: "0",
            },
            sourceLoading: true,
            sourceLoadError: false,
        },
    };
}

/**
 * 防抖函数
 * @param handle
 * @param delay
 * @param immdiate
 * @returns
 */
export function debounce(handler: (...args: any[]) => any, delay: number, immdiate = false) {
    let timer = null;
    let isInvoke = false;

    function _debounce(...arg: any[]) {
        if (timer) clearTimeout(timer);
        if (immdiate && !isInvoke) {
            handler.apply(this, arg);
            isInvoke = true;
        } else {
            timer = setTimeout(() => {
                handler.apply(this, arg);
                isInvoke = false;
                timer = null;
            }, delay);
        }
    }

    _debounce.cancel = function () {
        if (timer) clearTimeout(timer);
        timer = null;
        isInvoke = false;
    };
    return _debounce;
}
