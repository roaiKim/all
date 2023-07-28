import { ErrorListener } from "@core";
import { setupGlobalErrorHandler } from "utils/error/error-handler";
import ErrorHandler from "utils/error-listener";

interface BootstrapOption {
    errorListener?: ErrorListener;
    rootContainer?: HTMLElement | null;
}

export function bootstrap(): void {
    setupGlobalErrorHandler(new ErrorHandler());
}
