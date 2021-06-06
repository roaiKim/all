import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";
import { app } from "./app";

const SET_STATE_ACTION = "@@framework/setState";
export function setStateAction(module, state, type) {
    return {
        type,
        name: SET_STATE_ACTION,
        payload: { module, state },
    };
}
function setStateReducer(state = {}, action) {
    if (action.name === SET_STATE_ACTION) {
        const { module, state: moduleState } = action.payload;
        return { ...state, [module]: { ...state[module], ...moduleState } };
    }
    return state;
}
export const LOADING_ACTION = "@@framework/loading";
export function loadingAction(show, identifier = "global") {
    return {
        type: LOADING_ACTION,
        payload: { identifier, show },
    };
}
function loadingReducer(state = {}, action) {
    if (action.type === LOADING_ACTION) {
        const { payload } = action;
        const count = state[payload.identifier] || 0;
        return {
            ...state,
            [payload.identifier]: count + (payload.show ? 1 : -1),
        };
    }
    return state;
}
export const WEBSITE_ACTION = "@@framework/setWebsite";
export function websiteAction(website) {
    return {
        type: WEBSITE_ACTION,
        payload: {
            website,
        },
    };
}
function websiteReducer(state = {}, action) {
    if (action.type === WEBSITE_ACTION) {
        const { payload } = action;
        return {
            ...state,
            ...payload.website,
        };
    }
    return state;
}
export function rootReducer(history) {
    return combineReducers({
        router: connectRouter(history),
        loading: loadingReducer,
        website: websiteReducer,
        app: setStateReducer,
    });
}
export function showLoading(state, identifier = "global") {
    return state.loading[identifier] > 0;
}
export const executeMethodMiddleware = (() => (next) => (action) => {
    const result = next(action);
    const handler = app.actionHandlers[action.type];
    if (handler) {
        handler(...action.payload);
    }
    return result;
});
