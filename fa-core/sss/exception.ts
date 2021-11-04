export abstract class Exception {
    protected constructor(public message: string) {}
}

// api 异常
export class APIException extends Exception {
    constructor(message: string, public statusCode: number, public requestURL: string, public responseData: any, public errorId: string | null, public errorCode: string | null) {
        super(message);
    }
}

// 网络异常
export class NetWorkConnectionException extends Exception {
    constructor(message: string, public requestURL: string, public orininalErrorMessage: string = "") {
        super(message);
    }
}

// 程序异常
export class JavaScriptException extends Exception {
    constructor(message: string, public orininalError: any) {
        super(message);
    }
}
