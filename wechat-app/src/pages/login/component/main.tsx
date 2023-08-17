import { View, Checkbox, Image, CheckboxGroup, Picker, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState } from "react";
import logo from "asset/img/global/logo.png";
import { connect, useDispatch } from "react-redux";
import { showLoading } from "@core";
import { RootState } from "type/state";
import { actions } from "../index.module";
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
            <View className="title">华药冷链</View>
            <Button
                className="btn bluebg"
                type="primary"
                onClick={() => {
                    if (check) {
                        Taro.navigateTo({ url: "/pages/login/password" });
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

            <View className="enter-box">
                <View
                    className="checkbox"
                    onClick={() => {
                        setCheck(!check);
                    }}
                >
                    <CheckboxGroup>
                        <Checkbox color="#3579ff" value="1" checked={check}>
                            <View className="check-content">登录华药冷链，阅读并同意</View>
                        </Checkbox>
                    </CheckboxGroup>
                    <View>《上维天宫服务协议》</View>
                </View>
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
