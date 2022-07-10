// import "core-js/stable";
// import "regenerator-runtime/runtime";
// import "./debug";

export { bootstrap } from "./platform/bootstrap";
export { Module } from "./platform/Module";

export { ajax } from "./http";

export { createActionHandlerDecorator, Loading, Interval, Mutex } from "./decorator";
export { showLoading, loadingAction, navigationPreventionAction } from "./reducer";
export { register } from "./module";
export { useLoadingStatus } from "./hooks";

export type { State } from "./reducer";
