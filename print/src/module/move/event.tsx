interface WebEventState {
    x: number;
    y: number;
    width: number;
    heigth: number;
    draging: boolean;
}

export class WebEvent {
    #containerDom: HTMLElement;
    #dragDom: HTMLElement;
    state: WebEventState;
    constructor(dragId: string, containeId: string) {
        this.#dragDom = document.getElementById(dragId);
        this.#containerDom = document.getElementById(containeId);

        if (!this.#dragDom || !this.#containerDom) {
            console.error("元素或容器不存在");
            return;
        }

        this.init();
    }

    init() {
        console.log("--this.#dragDom--", this.#dragDom.getBoundingClientRect());
        console.log("--this.offsetWidth--", this.#dragDom.offsetWidth);
        console.log("--this.offsetHeight--", this.#dragDom.offsetHeight);
        this.#dragDom.addEventListener("mousedown", this.startDrag.bind(this));
    }

    startDrag(event) {
        console.log("--this.event--", event);
        console.log("--this.clientX--", event.clientX, event.clientY);
    }
}
