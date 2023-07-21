import { ErrorListener } from "@core";
import { setupGlobalErrorHandler } from "./global-error-Handler";

interface BootstrapOption {
    errorListener?: ErrorListener;
    rootContainer?: HTMLElement | null;
}

export function bootstrap(option: BootstrapOption): void {
    setupGlobalErrorHandler(option.errorListener);
}
