export default {
    pages: [
        "pages/common/profile-center/profile/index",
        "pages/home/index",
        "pages/common/change-password/index",
        "pages/common/login/password-login/index",
        "pages/common/login/wechat-login/index",
        "pages/common/profile-center/user/index",
        "pages/task/task/index",
        "pages/task/pickup/index",
        "pages/task/receipt/index",
        "pages/task/abnormal/index",
        "pages/common/webview/index",
        "pages/main/index",
        "pages/order-search/index",
    ],
    window: {
        backgroundTextStyle: "light",
        navigationBarBackgroundColor: "#fff",
        navigationBarTitleText: "WeChat",
        navigationBarTextStyle: "black",
    },
    lazyCodeLoading: "requiredComponents",
    tabBar: {
        selectedColor: "#317AFF",
        borderStyle: "white",
        list: [
            {
                pagePath: "pages/task/task/index",
                text: "任务",
                iconPath: "asset/img/tab-bar/search.png",
                selectedIconPath: "asset/img/tab-bar/searcha.png",
            },
            // {
            //     pagePath: "pages/home/index",
            //     text: "任务",
            //     iconPath: "asset/img/tab-bar/home.png",
            //     selectedIconPath: "asset/img/tab-bar/homea.png",
            // },
            // {
            //     pagePath: "pages/order-search/index",
            //     text: "任务",
            //     iconPath: "asset/img/tab-bar/search.png",
            //     selectedIconPath: "asset/img/tab-bar/searcha.png",
            // },
            {
                pagePath: "pages/common/profile-center/profile/index",
                text: "我的",
                iconPath: "asset/img/tab-bar/profile.png",
                selectedIconPath: "asset/img/tab-bar/profilea.png",
            },
        ],
    },
} as const;
