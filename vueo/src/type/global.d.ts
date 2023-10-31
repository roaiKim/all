export {};

declare module "vue" {
    interface ComponentCustomProperties {
        $translate: (key: string) => string
    }
}