import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { app } from "../app";

interface BootstrapOption {
    componentType: React.ComponentType;
    rootContainer?: HTMLElement | null;
}

export const LOGGER_ACTION = "@@framework/logger";
export const VERSION_CHECK_ACTION = "@@framework/version-check";
export const GLOBAL_ERROR_ACTION = "@@framework/global";
export const GLOBAL_PROMISE_REJECTION_ACTION = "@@framework/promise-rejection";

export function bootstrap(option: BootstrapOption): void {
    renderRoot(option.componentType, option.rootContainer || injectRootContainer());
}

function renderRoot(EntryComponent: React.ComponentType, rootContainer: HTMLElement) {
    ReactDOM.render(
        <Provider store={app.store}>
            <EntryComponent />
        </Provider>,
        rootContainer
    );
}

function injectRootContainer(): HTMLElement {
    const rootContainer = document.createElement("div");
    rootContainer.id = "framework-app-root";
    document.body.appendChild(rootContainer);
    return rootContainer;
}
