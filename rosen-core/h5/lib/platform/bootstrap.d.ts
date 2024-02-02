import React from "react";
import { Location } from "history";
import { ErrorListener } from "../module";
interface BrowserConfig {
    onIE?: () => void;
    onLocationChange?: (location: Location) => void;
    navigationPreventionMessage?: string;
}
interface BootstrapOption {
    componentType: React.ComponentType;
    errorListener?: ErrorListener;
    rootContainer?: HTMLElement | null;
    browserConfig?: BrowserConfig;
}
export declare const LOGGER_ACTION = "@@framework/logger";
export declare const VERSION_CHECK_ACTION = "@@framework/version-check";
export declare const GLOBAL_ERROR_ACTION = "@@framework/global";
export declare const GLOBAL_PROMISE_REJECTION_ACTION = "@@framework/promise-rejection";
export declare function bootstrap(option: BootstrapOption): void;
export {};
