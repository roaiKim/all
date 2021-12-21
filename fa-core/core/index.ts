import "core-js/stable";
import "regenerator-runtime/runtime";
import "./debug";

export { bootstrap } from "./platform/bootstrap";
export { Module } from "./platform/Module";

export { async } from "./util/async";
export { captureError } from "./util/error-util";
export { ajax, uri } from "./util/network";
export { ErrorBoundary } from "./util/ErrorBoundary";
export { Route } from "./util/Route";

export { createActionHandlerDecorator, Loading, Interval, Mutex, RetryOnNetworkConnectionError, SilentOnNetworkConnectionError, Log } from "./decorator";
export { Exception, APIException, NetworkConnectionException } from "./Exception";
export { showLoading, loadingAction, navigationPreventionAction } from "./reducer";
export { register } from "./module";
export { useLoadingStatus, useAction, useObjectKeyAction, useUnaryAction, useBinaryAction } from "./hooks";
export { logger } from "./app";

export type { ErrorListener } from "./module";
export type { State } from "./reducer";
export type { AsyncOptions, AsyncErrorComponentProps, ReactComponentKeyOf } from "./util/async";
