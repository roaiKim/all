import { ConnectedRouter } from "connected-react-router";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { app } from "../app";
import { websiteAction } from "../reducer";

export function bootstrarp(option) {
    renderRoot(option.entryComponent, option.rootContainer || injectRootContainer());
}
function windowResize() {
    const domHeight = document.body.offsetHeight;
    const domWidth = document.body.offsetWidth;
    app.store.dispatch(websiteAction({
        width: domWidth,
        height: domHeight,
    }));
}
function renderRoot(EntryComponent, rootContainer) {
    ReactDOM.render(
        <Provider store={app.store}>
            <ConnectedRouter history={app.browserHistory}>
                <EntryComponent />
            </ConnectedRouter>
        </Provider>,
        rootContainer,
        () => {
            // window.addEventListener("resize", windowResize);
        },
    );
}
function injectRootContainer() {
    const rootContainer = document.createElement("main");
    rootContainer.id = "react-app-root";
    document.body.appendChild(rootContainer);
    return rootContainer;
}
