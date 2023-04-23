import { Button, Image, View } from "@tarojs/components";
import logo from "asset/global/logo.png";
import Taro from "@tarojs/taro";
import "./index.less";

function Main() {
    return (
        <View className="ro-profile-container">
            <View className="ro-top-bg">
                <View className="ro-user-info">
                    <Image
                        src={logo}
                        onClick={() => {
                            Taro.navigateTo({ url: "/pages/login/index" });
                        }}
                    ></Image>
                    <View
                        onClick={() => {
                            Taro.navigateTo({ url: "/pages/login/index" });
                        }}
                    >
                        立即登录
                    </View>
                </View>
            </View>
            <View className="ro-bottom-user">
                <View className="ro-user-line">功能管理</View>
                <View className="ro-user-line">个人信息</View>
                <View className="ro-user-line">收货地址</View>
            </View>
        </View>
    );
}

export default Main;
