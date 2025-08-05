export enum ContentType {
    JSON = "application/json",
    FORM_DATA = "multipart/form-data",
    FORM = "application/x-www-form-urlencoded",
}

export type RequestMethod = "OPTIONS" | "GET" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT" | "PATCH";

export const whitelistUrl = ["/api/auth/oauth/token"];

export const ViewType = {
    view: "view",
    page: "page",
    pageHide: "pageHide",
    category: "category",
    api: "api",
} as const;
