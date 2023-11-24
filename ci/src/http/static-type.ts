export enum ContentType {
    JSON = "application/json",
    FORM_DATA = "multipart/form-data",
    FORM = "application/x-www-form-urlencoded",
}

export const ignoreName = ["login"];
export const whitelistUrl = ["/api/auth/oauth/token"];
