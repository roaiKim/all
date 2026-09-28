import { createRoot } from "react-dom/client";
import Rect from "../src/rect";

function injectRootContainer(): HTMLElement {
    const rootContainer = document.createElement("div");
    rootContainer.id = "framework-app-root";
    document.body.appendChild(rootContainer);
    return rootContainer;
}

const root = createRoot(injectRootContainer());
root.render(<Rect />);
