export const pathMmapping = {
    "/cap/client": "/management",
    "/cap/address": "/address",
};

export function getPathByKey(key: string) {
    return pathMmapping[key];
}
