import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import React, { useCallback, useEffect, useState } from "react";
import Left from "asset/global/left.png";
import "./index.less";

interface NavBarProps {
    title?: string | React.ReactNode;
    showBack?: boolean;
}

export default function NavBar(props: NavBarProps) {
    const { title, showBack = true } = props;
    const [navBarHeight, setHavBarHeight] = useState(0);
    const [hasRouterHistry, setHasRouterHistry] = useState(false); // 是否有队列

    useEffect(() => {
        const menuButtonObject = Taro.getMenuButtonBoundingClientRect();
        const sysinfo = Taro.getSystemInfoSync();
        const statusBarHeight = sysinfo.statusBarHeight || 0;
        const menuBottonHeight = menuButtonObject.height;
        const menuBottonTop = menuButtonObject.top;
        const height = statusBarHeight + menuBottonHeight + (menuBottonTop - statusBarHeight) * 2;
        setHavBarHeight(height);
        // 获取当前对列长度
        const histry = Taro.getCurrentPages();
        if (histry?.length > 1) {
            setHasRouterHistry(true);
        }
    }, []);

    const backPage = useCallback(() => {
        Taro.navigateBack({ delta: 1 });
    }, []);

    return (
        <View className="ro-nav-custom-bar" style={{ height: `${navBarHeight}px` }}>
            <Image src={Left} className={`nav-back ${showBack && hasRouterHistry ? "" : "hidden"}`} onClick={backPage}></Image>
            <Text className="nav-title">{title}</Text>
        </View>
    );
}
