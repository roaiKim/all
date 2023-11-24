export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduntion = process.env.NODE_ENV === "production";
export const noDevelopment = process.env.NODE_ENV !== "development";
export const noProduntion = process.env.NODE_ENV !== "production";

const APP_NAME = "RO_MIMI_APP";

export const DEV_PROXY_HOST = "DEVELOPMENT_NETWORK_PROXY";
export const WEB_TOKEN = `${APP_NAME}_TOKEN`;
export const WEB_USERID = `${APP_NAME}_USERID`;
export const WEB_ISLOGIN = `${APP_NAME}_ISLOGIN`;
export const WEB_REFRESHTOKEN = `${APP_NAME}_REFRESHTOKEN`;
export const WEB_USERNAME = `${APP_NAME}_USERNAME`;
export const WEB_GETTOKENTIME = `${APP_NAME}_GETTOKENTIME`;
export const WEB_USER_INFO = `${APP_NAME}_USER_INFO`;
export const WEB_DEPARTMENT_ID = `${APP_NAME}_DEPARTMENT_ID`;
export const WEB_NEW_USER = `${APP_NAME}_NEW_USER`;
export const LOGIN_REMEMBER_USERNAME = `${APP_NAME}_LOGIN_USERNAME`;
export const LOGIN_REMEMBER_PASSWORD = `${APP_NAME}_LOGIN_PASSWORD`;

export const ignoreName = ["login"];
