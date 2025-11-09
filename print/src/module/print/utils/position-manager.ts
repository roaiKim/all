export class PositionManager {
    /**
     * @description 获取元素的宽
     * @param element HTMLElement
     * @returns number
     */
    static getElementWidth(element: HTMLElement) {
        const rect = element.getBoundingClientRect();
        return rect.width;
    }

    /**
     * @description 获取元素的宽
     * @param element HTMLElement
     * @returns number
     */
    static getElementHeight(element: HTMLElement) {
        const rect = element.getBoundingClientRect();
        return rect.height;
    }

    /**
     * @description 鼠标事件获取 pageX
     * @param event MouseEvent
     * @returns number
     */
    static getPageX(event: MouseEvent) {
        return event.pageX;
    }

    /**
     * @description 鼠标事件获取 pageY
     * @param event MouseEvent
     * @returns number
     */
    static getPageY(event: MouseEvent) {
        return event.pageY;
    }

    /**
     * @description 获取元素 坐标 pageX
     * @param element 元素 HTMLElement
     * @returns number
     */
    static getPageXByAbsolute(element: HTMLElement) {
        const elementRect = element.getBoundingClientRect();
        return elementRect.x + window.pageXOffset;
    }

    /**
     * @description 获取元素 坐标 pageY
     * @param element 元素 HTMLElement
     * @returns number
     */
    static getPageYByAbsolute(element: HTMLElement) {
        const elementRect = element.getBoundingClientRect();
        return elementRect.y + window.pageYOffset;
    }

    /**
     * @description 检测 A Element 是否在 B Element 中
     * @param children HTMLElement
     * @param container HTMLElement
     * @param config 是否完全包含
     * @returns boolean
     */
    static isChildrenInContainer(childrenElement: HTMLElement, containerElement: HTMLElement, config: boolean = false) {
        if (!childrenElement || !containerElement) return false;
        const childrenX = this.getPageXByAbsolute(childrenElement);
        const childrenY = this.getPageYByAbsolute(childrenElement);
        const containerX = this.getPageXByAbsolute(containerElement);
        const containerY = this.getPageYByAbsolute(containerElement);
        const containerWidth = this.getElementWidth(containerElement);
        const containerHeight = this.getElementHeight(containerElement);
        const childrenWidth = this.getElementWidth(childrenElement);
        const childrenHeight = this.getElementHeight(childrenElement);
        const childrenRectXRange = [childrenX, childrenX + childrenWidth]; // children X range
        const childrenRectYRange = [childrenY, childrenY + childrenHeight];
        const containerRectXRange = [containerX, containerX + containerWidth];
        const containerRectYRange = [containerY, containerY + containerHeight];
        if (config) {
            return (
                childrenRectXRange[0] > containerRectXRange[0] &&
                childrenRectXRange[0] < containerRectXRange[1] &&
                childrenRectYRange[0] > containerRectYRange[0] &&
                childrenRectYRange[0] < containerRectYRange[1] &&
                //
                childrenRectXRange[1] < containerRectXRange[1] &&
                childrenRectYRange[1] < containerRectYRange[1]
            );
        } else {
            return (
                childrenRectXRange[0] > containerRectXRange[0] &&
                childrenRectXRange[0] < containerRectXRange[1] &&
                childrenRectYRange[0] > containerRectYRange[0] &&
                childrenRectYRange[0] < containerRectYRange[1]
            );
        }
    }

    static getRectState(element: HTMLElement) {
        if (element) {
            const { width, height, x, y } = element.getBoundingClientRect();
            return {
                width,
                height,
                x: x + window.pageXOffset,
                y: y + window.pageYOffset,
            };
        }
        return {
            width: 0,
            height: 0,
            x: 0,
            y: 0,
        };
    }

    static getPositionByContainer(childrenElement: HTMLElement, containerElement: HTMLElement) {
        if (!childrenElement || !containerElement) return { x: 0, y: 0 };
        const childrenX = this.getPageXByAbsolute(childrenElement);
        const childrenY = this.getPageYByAbsolute(childrenElement);
        const containerX = this.getPageXByAbsolute(containerElement);
        const containerY = this.getPageYByAbsolute(containerElement);
        return {
            x: childrenX - containerX,
            y: childrenY - containerY,
        };
    }
}
