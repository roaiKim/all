export declare abstract class Exception {
    message: string;
    /**
     * @param message is JavaScript original message, in English usually.
     * In prod environment, you are not advised to display the error message directly to end-user.
     */
    protected constructor(message: string);
}
export declare class APIException extends Exception {
    statusCode: number;
    requestURL: string;
    responseData: any;
    errorId: string | null;
    errorCode: number;
    constructor(message: string, statusCode: number, requestURL: string, responseData: any, errorId: string | null, errorCode: number);
}
export declare class NetworkConnectionException extends Exception {
    requestURL: string;
    originalErrorMessage: string;
    constructor(message: string, requestURL: string, originalErrorMessage?: string);
}
export declare class JavaScriptException extends Exception {
    originalError: any;
    constructor(message: string, originalError: any);
}
