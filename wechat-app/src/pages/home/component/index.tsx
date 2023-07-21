import { LoginService } from "service/public-api/LoginService";
import { ajax } from "http/network";
import { Button, View } from "@tarojs/components";
import Taro from "@tarojs/taro";

function Main() {
    const on = () => {
        // const login = new LoginService();
        // const request = {
        //     grant_type: "password",
        //     username: "gongchao",
        //     password: `FXhi3+aMlwbivn8EPBWrgQ==`,
        // };
    };

    return (
        <View>
            home
            <Button
                className="btn"
                type="default"
                onClick={() => {
                    Taro.navigateTo({ url: "/pages/login/password" });
                    // Taro.navigateTo({ url: "/pages/webview/index" });
                }}
            >
                <View className="btntext">百度一下</View>
            </Button>
        </View>
    );
}

export default Main;
