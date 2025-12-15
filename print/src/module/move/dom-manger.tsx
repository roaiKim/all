class DomManger {
    #webContainer: HTMLElement;
    constructor() {
        this.#webContainer = document.getElementById("web-container");
    }

    get webContainer() {
        if (this.#webContainer) {
            return this.#webContainer;
        } else {
            this.#webContainer = document.getElementById("web-container");
            return this.#webContainer;
        }
    }
}

export const domManger = new DomManger();
