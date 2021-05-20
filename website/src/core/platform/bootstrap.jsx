import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { app } from '../app';
export function bootstrarp(option) {
    renderRoot(option.entryComponent, option.rootContainer || injectRootContainer());
}
function renderRoot(EntryComponent, rootContainer) {
    ReactDOM.render(<Provider store={app.store}>
      <ConnectedRouter history={app.browserHistory}>
        <EntryComponent />
      </ConnectedRouter>
    </Provider>, rootContainer);
}
function injectRootContainer() {
    const rootContainer = document.createElement("main");
    rootContainer.id = "react-app-root";
    document.body.appendChild(rootContainer);
    return rootContainer;
}
