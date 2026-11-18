import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { showLoading } from "@core";
import { loginPage } from "@config/static-envs";
import { Button, Checkbox, CheckboxGroup, Image, Picker, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { RootState } from "@type/state";
import { roPushHistory } from "@utils";
import logo from "@asset/img/global/logo.png";
import "./index.less";

interface LoginProps {
    name: string | null;
}

function Login(props: LoginProps) {
    const [check, setCheck] = useState(false);

    const getPhoneNumberEventDetail = (e) => {
        if (check) {
            if (!e.detail.code) {
                return Taro.showToast({
                    title: "微信授权失败",
                    icon: "none",
                    duration: 2000,
                });
            }
            // dispatch(actions.getPhone(e.detail.code));
        } else {
            Taro.showToast({
                title: "请先阅读并同意隐私政策与服务指南",
                icon: "none",
                duration: 2000,
            });
        }
    };
    return (
        <View className="ro-login-page">
            <Image src={logo}></Image>
            <Button
                className="btn bluebg"
                type="primary"
                onClick={() => {
                    if (check) {
                        roPushHistory(loginPage);
                    } else {
                        Taro.showToast({
                            title: "请先阅读并同意隐私政策与服务指南",
                            icon: "none",
                            duration: 2000,
                        });
                    }
                }}
            >
                <View className="btntext">账号登录</View>
            </Button>
            <Button className="wxlogin-btn" openType="getPhoneNumber" onGetPhoneNumber={getPhoneNumberEventDetail}>
                <View className="btntext">微信手机号登录</View>
            </Button>

            <View
                className="enter-box"
                onClick={() => {
                    setCheck(!check);
                }}
            >
                <Checkbox className="checkbox" color="#3579ff" value="1" checked={check} harmonyDirection="flex"></Checkbox>
                <View>阅读并同意</View>
                <View className="check-content">隐私政策</View>
            </View>
        </View>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        autoLoading: showLoading(state, "auto"),
    };
};

export default connect(mapStateToProps)(Login);
