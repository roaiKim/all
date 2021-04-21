import helloworld from "./helloworld";

const helloworldStr = helloworld();

function component() {
    const element = document.createElement("div")

    element.innerHTML = helloworldStr;

    return element;
}

document.body.appendChild(component())
