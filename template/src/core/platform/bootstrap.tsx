import { ConnectedRouter } from "connected-react-router";
import React, { ComponentType } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { app } from "../app";
import { websiteAction } from "../reducer";

interface BootstrapOption {
    entryComponent: ComponentType;
    rootContainer?: HTMLElement;
    hasResize?: boolean;
}

export function bootstrap(option: BootstrapOption) {
    renderRoot(option.entryComponent, option.rootContainer || injectRootContainer(), option.hasResize || false);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function windowResize() {
    const domHeight = document.body.offsetHeight;
    const domWidth = document.body.offsetWidth;
    app.store.dispatch(
        websiteAction({
            width: domWidth,
            height: domHeight,
        })
    );
}
function renderRoot(EntryComponent: ComponentType, rootContainer: HTMLElement, hasResize: boolean) {
    ReactDOM.render(
        <Provider store={app.store}>
            <ConnectedRouter history={app.browserHistory}>
                <EntryComponent />
            </ConnectedRouter>
        </Provider>,
        rootContainer,
        () => {
            if (hasResize) window.addEventListener("resize", windowResize);
        }
    );
}
function injectRootContainer() {
    const rootContainer = document.createElement("div");
    rootContainer.id = "react-app-root";
    document.body.appendChild(rootContainer);
    return rootContainer;
}
