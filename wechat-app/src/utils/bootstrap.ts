import { ErrorListener } from "@core";
import { setupGlobalErrorHandler } from "utils/error/error-handler";
import ErrorHandler from "utils/error-listener";
import { roEvent } from "./events";
import { routerHandler } from "./events/router-handler";
import { HISTORY_NAVIGATE_TO } from "./functions/push-history";
import { cacheServices } from "./service-register";

interface BootstrapOption {
    errorListener?: ErrorListener;
    rootContainer?: HTMLElement | null;
}

export function bootstrap(): void {
    // console.log("==", cacheServices);
    // routerHandler();
    setupGlobalErrorHandler(new ErrorHandler());
    // roEvent.on(HISTORY_NAVIGATE_TO, (a) => {
    //     console.log("--change--", a);
    // });
}
