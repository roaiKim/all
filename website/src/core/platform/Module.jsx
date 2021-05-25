import { push, replace } from "connected-react-router";
import { app } from "../app";
import { setStateAction } from "../reducer";

export class Module {

    name;

    initialState;

    constructor(name, initialState) {
        this.name = name;
        this.initialState = initialState;
    }

    onRegister() { }

    // eslint-disable-next-line no-unused-vars
    onRender(routeParameters, location) { }

    onDestroy() { }

    get state() {
        return this.rootState.app[this.name];
    }

    get rootState() {
        return app.store.getState();
    }

    setState(newState) {
        app.store.dispatch(setStateAction(this.name, newState, `@@${this.name}/setState[${Object.keys(newState).join(",")}]`));
    }

    setHistory(urlOrState, usePush = true) {
        if (typeof urlOrState === "string") {
            app.store.dispatch(usePush ? push(urlOrState) : replace(urlOrState));
        } else {
            // eslint-disable-next-line no-restricted-globals
            const currentURL = location.pathname + location.search;
            app.store.dispatch(usePush ? push(currentURL, urlOrState) : replace(currentURL, urlOrState));
        }
    }

}
