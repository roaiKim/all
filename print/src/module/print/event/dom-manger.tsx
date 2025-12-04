export class DomManger {
    #temporaryTemplateDom: HTMLElement;
    #printContainerDom: HTMLElement;
    #printBodyDom: HTMLElement;
    #printTemplateDom: HTMLElement;
    #dragContainerDom: HTMLElement;
    #printControlDom: HTMLElement;
    constructor() {
        this.#temporaryTemplateDom = document.getElementById("temporaryTemplateDom");
        this.#printContainerDom = document.getElementById("printContainerDom");
        this.#printBodyDom = document.getElementById("printBodyDom");
        this.#printTemplateDom = document.getElementById("printTemplateDom");
        this.#dragContainerDom = document.getElementById("dragContainerDom");
        this.#printControlDom = document.getElementById("printControlDom");
    }

    get temporaryTemplateDom() {
        if (this.#temporaryTemplateDom) {
            return this.#temporaryTemplateDom;
        } else {
            this.#temporaryTemplateDom = document.getElementById("temporaryTemplateDom");
            return this.#temporaryTemplateDom;
        }
    }

    get printContainerDom() {
        if (this.#printContainerDom) {
            return this.#printContainerDom;
        } else {
            this.#printContainerDom = document.getElementById("printContainerDom");
            return this.#printContainerDom;
        }
    }

    get printBodyDom() {
        if (this.#printBodyDom) {
            return this.#printBodyDom;
        } else {
            this.#printBodyDom = document.getElementById("printBodyDom");
            return this.#printBodyDom;
        }
    }

    get printTemplateDom() {
        if (this.#printTemplateDom) {
            return this.#printTemplateDom;
        } else {
            this.#printTemplateDom = document.getElementById("printTemplateDom");
            return this.#printTemplateDom;
        }
    }

    get dragContainerDom() {
        if (this.#dragContainerDom) {
            return this.#dragContainerDom;
        } else {
            this.#dragContainerDom = document.getElementById("dragContainerDom");
            return this.#dragContainerDom;
        }
    }

    get printControlDom() {
        if (this.#printControlDom) {
            return this.#printControlDom;
        } else {
            this.#printControlDom = document.getElementById("printControlDom");
            return this.#printControlDom;
        }
    }
}
