import { throttle } from "../print/utils/throttle";

interface WebEventState {
    x: number;
    y: number;
    width: number;
    height: number;
    draging: boolean;
}

export const initialDragState = () => ({ x: 1000, y: 1000, width: 100, height: 100, draging: false });

export class WebEvent {
    #containerDom: HTMLElement;
    #dragDom: HTMLElement;
    #body: HTMLElement;
    state: WebEventState;
    #mousedown;
    #move;
    offsetX: number = 0;
    offsetY: number = 0;
    constructor(dragId: string, containeId: string, move) {
        this.#dragDom = document.getElementById(dragId);
        this.#body = document.body;
        this.#containerDom = document.getElementById(containeId);
        this.#move = move;

        if (!this.#dragDom || !this.#containerDom) {
            console.error("元素或容器不存在");
            return;
        }

        this.state = initialDragState();

        this.#mousedown = throttle(this.eventMousemove, 40);

        this.init();
    }

    init() {
        console.log("--this.#dragDom--", this.#dragDom.getBoundingClientRect());
        console.log("--this.offsetWidth--", this.#dragDom.offsetWidth);
        console.log("--this.offsetHeight--", this.#dragDom.offsetHeight);
        this.#dragDom.addEventListener("mousedown", this.eventMousedown);
    }

    eventMousedown = (event) => {
        event.preventDefault();
        const { offsetX, offsetY } = event;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.#body.addEventListener("mousemove", this.#mousedown);
        this.#body.addEventListener("mouseup", this.eventMouseup);
        this.#body.addEventListener("mouseleave", this.eventMouseup);
    };

    eventMousemove = (event) => {
        event.preventDefault();
        console.log("--this.mousemoveEvent--");
        const x = event.x - this.offsetX;
        const y = event.y - this.offsetY;
        this.state.x = x + window.pageXOffset;
        this.state.y = y + window.pageYOffset;
        if (this.#move) {
            this.#move(this.state);
        }
    };

    eventMouseup = (event) => {
        event.preventDefault();
        console.log("--this.mouseupEvent--", event);
        this.#body.removeEventListener("mousemove", this.#mousedown);
        this.#body.removeEventListener("mouseup", this.eventMouseup);
        this.#body.removeEventListener("mouseleave", this.eventMouseup);
    };
}
