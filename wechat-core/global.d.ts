export {};

declare module "@tarojs/taro" {
    interface ComponentCustomProperties {
        $translate: (key: string) => string;
    }
}
