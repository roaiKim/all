import { ErrorListener } from "@core";
import { setupGlobalErrorHandler } from "utils/error/error-handler";

interface BootstrapOption {
    errorListener?: ErrorListener;
    rootContainer?: HTMLElement | null;
}

export function bootstrap(option: BootstrapOption): void {
    setupGlobalErrorHandler(option.errorListener);
}
