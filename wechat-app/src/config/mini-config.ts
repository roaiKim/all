export default {
    pages: [
        "pages/home/index",
        "pages/login/index",
        "pages/login/password",
        "pages/order-search/index",
        "pages/profile-center/profile/index",
        "pages/profile-center/user/index",
        "pages/profile-center/user/addition",
        "pages/profile-center/address/index",
        "pages/profile-center/address/addition",
        "pages/webview/index",
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
                pagePath: "pages/home/index",
                text: "订单下单",
                iconPath: "asset/img/tab-bar/home.png",
                selectedIconPath: "asset/img/tab-bar/homea.png",
            },
            {
                pagePath: "pages/order-search/index",
                text: "订单查询",
                iconPath: "asset/img/tab-bar/search.png",
                selectedIconPath: "asset/img/tab-bar/searcha.png",
            },
            {
                pagePath: "pages/profile-center/profile/index",
                text: "个人中心",
                iconPath: "asset/img/tab-bar/profile.png",
                selectedIconPath: "asset/img/tab-bar/profilea.png",
            },
        ],
    },
} as const;
