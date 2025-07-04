import {
  errorToException,
  globalErrorHandler,
  runUserErrorHandler,
  specialErrorCode,
  type ErrorHandler,
} from "@/service/error-listener/error-util"
import { isDevelopment } from "@/service/config/static-envs"
import type { Exception } from "@/http/type"
import ErrorListenerHandler from "./listener"

export interface ErrorListener {
  onError: ErrorHandler
}

export const GLOBAL_PROMISE_REJECTION_ACTION = "@@framework/promise-rejection"
export const GLOBAL_ERROR_ACTION = "@@framework/global"
const ignoreErrors = ["ResizeObserver loop limit exceeded"]

function setupGlobalErrorHandler(errorListener?: ErrorListener) {
  if (errorListener) {
    globalErrorHandler.errorHandler = errorListener.onError.bind(errorListener)
  }
  window.addEventListener(
    "error",
    (event) => {
      // event.preventDefault();
      try {
        const analyzeByTarget = (): string => {
          if (event.target && event.target !== window) {
            const element = event.target as HTMLElement
            return `DOM source error: ${element.outerHTML}`
          }
          return `Unrecognized error, serialized as ${JSON.stringify(event)}`
        }
        captureError(event.error || event.message || analyzeByTarget(), GLOBAL_ERROR_ACTION)
      } catch (e) {
        //
      }
    },
    true,
  )
  window.addEventListener(
    "unhandledrejection",
    (event) => {
      event.preventDefault()
      try {
        captureError(event.reason, GLOBAL_PROMISE_REJECTION_ACTION)
      } catch (e) {
        //
      }
    },
    true,
  )
}

export function captureError(error: unknown, action: string = ""): Exception {
  const exception = errorToException(error)

  const errorMessage = exception.message
  const ignore = ignoreErrors.find((errorKey) => errorMessage.includes(errorKey))
  if (ignore) return

  if (isDevelopment) {
    console.error(`[framework] Error captured from [${action}]`, error)
  }

  const errorStacktrace = error instanceof Error ? error.stack : undefined
  const errorCode = specialErrorCode(exception, action, errorStacktrace)
  if (!errorCode) {
    runUserErrorHandler(globalErrorHandler.errorHandler, exception)
  } else {
    // 常规 js 错误
  }

  return exception
}

export const errorListener = {
  install(app) {
    setupGlobalErrorHandler(new ErrorListenerHandler())
  },
}
