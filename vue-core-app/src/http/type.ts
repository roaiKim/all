export enum ContentType {
  JSON = "application/json",
  FORM_DATA = "multipart/form-data",
  FORM = "application/x-www-form-urlencoded",
}

export type RequestMethod = "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | "PATCH"

export const whitelistUrl = ["/api/auth/oauth/token"]

export abstract class Exception {
  /**
   * @param message is JavaScript original message, in English usually.
   * In prod environment, you are not advised to display the error message directly to end-user.
   */
  protected constructor(public message: string) {}
}

export class APIException extends Exception {
  constructor(
    message: string,
    public statusCode: number,
    public requestURL: string,
    public responseData: any,
    public errorId: string | null,
    public errorCode: number | null,
  ) {
    super(message)
  }
}

export class NetworkConnectionException extends Exception {
  constructor(
    message: string,
    public requestURL: string,
    public originalErrorMessage: string = "",
  ) {
    super(message)
  }
}

export class JavaScriptException extends Exception {
  constructor(
    message: string,
    public originalError: any,
  ) {
    super(message)
  }
}
