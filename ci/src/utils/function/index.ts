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
