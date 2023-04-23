export { bootstrap } from "./platform/bootstrap";
export { Module } from "./platform/Module";

export { createActionHandlerDecorator, Loading, Interval, Mutex, KeepState } from "./decorator";
export { showLoading, loadingAction, navigationPreventionAction } from "./reducer";
export { register } from "./module";
export { useLoadingStatus } from "./hooks";

export type { State } from "./reducer";
