import type { WebPrint } from "../../main/print";

interface SpotlightManagerProps {
    container?: string | HTMLElement;
}

export class SpotlightManager {
    #containerDom: HTMLElement;
    printModule: WebPrint;
    constructor(props: SpotlightManagerProps, printModule: WebPrint) {
        const { container } = props;

        this.#containerDom = this.#getDom(container);
        this.printModule = printModule;
    }

    #getDom = (element?: string | HTMLElement) => {
        if (!element) {
            return null;
        }
        if (typeof element === "string") {
            return document.getElementById(element);
        } else {
            return element;
        }
    };

    registerClick = () => {
        this.#containerDom.addEventListener("click", this.mousemoveHander);
    };

    mousemoveHander = (event) => {
        if (!this.isSpotlighting()) {
            event.stopPropagation();
            event.preventDefault();
            const target: any = event.target;
            if (target) {
                if (target.dataset?.draggableId) {
                    const id = target.dataset?.draggableId;
                    this.printModule.upSpotlight(id);
                }
            }
        }
    };

    isSpotlighting() {
        return false; //this.printModule.protagonist.dramaActor?.id === this.getActor()?.id;
    }
}
