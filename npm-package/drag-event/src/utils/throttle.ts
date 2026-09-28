interface ThrottleOptions {
    leading?: boolean;
    trailing?: boolean;
}

export function throttle<T extends (...args: any[]) => any>(
    func: T,
    interval: number,
    options: ThrottleOptions = {}
): (...args: Parameters<T>) => void {
    let lastTime = 0;
    let timeoutId: number | null = null;
    const { leading = true, trailing = true } = options;

    return function (...args: Parameters<T>): void {
        const now = Date.now();
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const context = this;

        // 如果是第一次调用且不允许立即执行，则更新lastTime
        if (!lastTime && !leading) {
            lastTime = now;
        }

        // 计算剩余时间
        const remainingTime = interval - (now - lastTime);

        // 如果剩余时间小于等于0，则执行函数
        if (remainingTime <= 0) {
            if (timeoutId !== null) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            lastTime = now;
            func.apply(context, args);
        }
        // 如果允许 trailing 且没有定时器，则设置定时器
        else if (trailing && timeoutId === null) {
            timeoutId = setTimeout(() => {
                lastTime = leading ? Date.now() : 0;
                timeoutId = null;
                func.apply(context, args);
            }, remainingTime);
        }
    };
}
