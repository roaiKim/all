import { __extends } from "tslib";
var Exception = /** @class */ (function () {
    /**
     * @param message is JavaScript original message, in English usually.
     * In prod environment, you are not advised to display the error message directly to end-user.
     */
    function Exception(message) {
        this.message = message;
    }
    return Exception;
}());
export { Exception };
var APIException = /** @class */ (function (_super) {
    __extends(APIException, _super);
    function APIException(message, statusCode, requestURL, responseData, errorId, errorCode) {
        var _this = _super.call(this, message) || this;
        _this.statusCode = statusCode;
        _this.requestURL = requestURL;
        _this.responseData = responseData;
        _this.errorId = errorId;
        _this.errorCode = errorCode;
        return _this;
    }
    return APIException;
}(Exception));
export { APIException };
var NetworkConnectionException = /** @class */ (function (_super) {
    __extends(NetworkConnectionException, _super);
    function NetworkConnectionException(message, requestURL, originalErrorMessage) {
        if (originalErrorMessage === void 0) { originalErrorMessage = ""; }
        var _this = _super.call(this, message) || this;
        _this.requestURL = requestURL;
        _this.originalErrorMessage = originalErrorMessage;
        return _this;
    }
    return NetworkConnectionException;
}(Exception));
export { NetworkConnectionException };
var JavaScriptException = /** @class */ (function (_super) {
    __extends(JavaScriptException, _super);
    function JavaScriptException(message, originalError) {
        var _this = _super.call(this, message) || this;
        _this.originalError = originalError;
        return _this;
    }
    return JavaScriptException;
}(Exception));
export { JavaScriptException };
//# sourceMappingURL=Exception.js.map