import { Exception, JavaScriptException } from "@/http/type"
import { GLOBAL_ERROR_ACTION, GLOBAL_PROMISE_REJECTION_ACTION } from "@/service/error-listener"

export type ActionHandler = (...args: any[]) => any

let errorHandlerRunning = false

interface GlobalErrorHandler {
  errorHandler: ErrorHandler
}

export const globalErrorHandler: GlobalErrorHandler = {
  errorHandler() {},
}

export function errorToException(error: unknown): Exception {
  if (error instanceof Exception) {
    return error
  } else {
    let message: string
    if (!error) {
      message = "[No Message]"
    } else if (typeof error === "string") {
      message = error
    } else if (error instanceof Error) {
      message = error.message
    } else {
      try {
        message = JSON.stringify(error)
      } catch (e) {
        message = "[Unknown]"
      }
    }
    return new JavaScriptException(message, error)
  }
}

export type ErrorHandler = (error: Exception) => unknown

export async function runUserErrorHandler(handler: ErrorHandler, exception: Exception) {
  if (errorHandlerRunning) return

  try {
    errorHandlerRunning = true
    await handler(exception)
  } catch (e) {
    console.warn("[framework] Fail to execute error handler", e)
  } finally {
    errorHandlerRunning = false
  }
}

export function specialErrorCode(exception: Exception, action: string, stacktrace?: string): string | null {
  const errorMessage = exception.message.toLowerCase()
  const ignoredPatterns = [
    { pattern: "loading chunk", errorCode: "JS_CHUNK" },
    { pattern: "loading css chunk", errorCode: "CSS_CHUNK" },
    { pattern: "content security policy", errorCode: "CSP" },
    { pattern: "script error", errorCode: "CORS" },
    { pattern: "ucbrowser", errorCode: "VENDOR" },
    { pattern: "vivo", errorCode: "VENDOR" },
    { pattern: "huawei", errorCode: "VENDOR" },
    { pattern: "the operation is insecure", errorCode: "BROWSER_LIMIT" },
    { pattern: "access is denied for this document", errorCode: "BROWSER_LIMIT" },
  ]

  const matchedPattern = ignoredPatterns.find(({ pattern }) => errorMessage.includes(pattern))
  if (matchedPattern) {
    return `IGNORED_${matchedPattern.errorCode}_ISSUE`
  }
  if (
    exception instanceof JavaScriptException &&
    !isValidStacktrace(stacktrace) &&
    [GLOBAL_ERROR_ACTION, GLOBAL_PROMISE_REJECTION_ACTION].includes(action)
  ) {
    return "IGNORED_UNCATEGORIZED_ISSUE"
  }
  if (
    action === GLOBAL_ERROR_ACTION &&
    stacktrace &&
    errorMessage.includes("'offsetwidth' of null") &&
    stacktrace.includes("Array.forEach")
  ) {
    return "IGNORED_ANTD_TAB_ISSUE"
  }
  if (action === GLOBAL_ERROR_ACTION && errorMessage.includes("'forcepopupalign' of null")) {
    return "IGNORED_ANTD_SLIDER_ISSUE"
  }
  return null
}

function isValidStacktrace(stacktrace?: string): boolean {
  if (stacktrace) {
    const ignoredPatterns = ["chrome-extension://"]
    if (ignoredPatterns.some((_) => stacktrace.includes(_))) {
      return false
    }

    return stacktrace.includes(".js")
  }
  return false
}
