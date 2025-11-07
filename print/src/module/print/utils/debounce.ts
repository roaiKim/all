interface DebounceOptions {
    immediate?: boolean;
}

export function debounce<T extends (...args: any[]) => any>(func: T, delay: number, options: DebounceOptions = {}): (...args: Parameters<T>) => void {
    let timeoutId: number | null = null;
    const { immediate = false } = options;

    return function (...args: Parameters<T>): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const context = this;

        // 如果设置了immediate且当前没有定时器，则立即执行
        if (immediate && timeoutId === null) {
            func.apply(context, args);
        }

        // 清除之前的定时器
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }

        // 设置新的定时器
        timeoutId = setTimeout(() => {
            if (!immediate) {
                func.apply(context, args);
            }
            timeoutId = null;
        }, delay);
    };
}
