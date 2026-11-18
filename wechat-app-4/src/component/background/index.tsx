import React, { useState } from "react";
import { Text, View } from "@tarojs/components";
import Taro, { usePageScroll } from "@tarojs/taro";
import "./index.less"; // 假设您将样式放在单独的 scss 文件中

export interface PropsType {
    isNoneLinearGradient?: boolean;
    title?: string;
    showBack?: boolean;
    children?: React.ReactNode;
}

export const Background: React.FC<PropsType> = (props) => {
    // 使用 useState 保存计算出的布局数据，避免每次渲染都重新计算
    const [layout, setLayout] = useState(() => {
        try {
            const custom = Taro.getMenuButtonBoundingClientRect();
            const systemInfo = Taro.getSystemInfoSync();
            const statusBarHeight = systemInfo.statusBarHeight || 0;

            // 兼容 H5 或部分环境获取不到胶囊信息的情况
            if (!custom || custom.top === undefined) {
                return {
                    statusBarHeightPx: `${statusBarHeight}px`,
                    paddingTop: "44px", // 默认兜底高度
                };
            }

            return {
                statusBarHeightPx: `${statusBarHeight}px`,
                paddingTop: `${custom.height + (custom.top - statusBarHeight) * 2}px`,
            };
        } catch (error) {
            console.error("获取系统信息失败", error);
            return { statusBarHeightPx: "0px", paddingTop: "44px" };
        }
    });

    const { statusBarHeightPx, paddingTop } = layout;

    // 监听页面滚动（原代码只打印了 log，未实际使用）
    usePageScroll((e) => {
        // console.log("onPageScroll background", e.scrollTop);
    });

    const toBack = () => {
        Taro.navigateBack({ delta: 1 });
    };

    return (
        <View className="background-main">
            {/* 顶部导航栏 */}
            {!!paddingTop && (
                <View className="title-box" style={{ height: paddingTop, paddingTop: statusBarHeightPx }}>
                    {props.showBack && (
                        <View style={{ paddingRight: "10px", paddingLeft: "10px", zIndex: 9999 }} onClick={toBack}>
                            {/* 注意：原代码使用的是 wd-icon。在 React 中如果您使用了 Taro UI 或 NutUI，请替换为对应的 Icon 组件 */}
                            {/* <wd-icon name="thin-arrow-left" size="20px" style={{ color: "white" }} /> */}
                            <Text style={{ color: "white", fontSize: "20px" }}>{"<"}</Text>
                        </View>
                    )}
                    <View className="title">{props.title}</View>
                </View>
            )}

            {/* 内容区域 */}
            <View className={props.isNoneLinearGradient ? "" : "background-white"}>{props.children}</View>
        </View>
    );
};
