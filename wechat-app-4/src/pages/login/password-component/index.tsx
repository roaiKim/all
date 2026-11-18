import { useState } from "react";
import { useDispatch } from "react-redux";
import { actions as mainActions } from "@pages/main/index.module";
import { LOGIN_REMEMBER_USERNAME } from "@config/static-envs";
import { Button, Image, Input, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { encrypted } from "@utils/functions/encrypted";
import logo from "@asset/img/global/logo.png";
import eye from "@asset/img/template/eye.png";
import noeye from "@asset/img/template/noeye.png";
import "./index.less";

/**
 *
 * @returns grant_type: password
username: gongchao
password: FXhi3+aMlwbivn8EPBWrgQ==
 */

function Main() {
    const [showPassword, setShowPassword] = useState(true);
    const [userName, setUserName] = useState(() => Taro.getStorageSync(LOGIN_REMEMBER_USERNAME));
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const login = () => {
        if (!userName) {
            return Taro.showToast({
                title: "请输入用户名",
                icon: "none",
                duration: 2000,
            });
        }
        if (!password) {
            return Taro.showToast({
                title: "请输入密码",
                icon: "none",
                duration: 2000,
            });
        }
        Taro.setStorageSync(LOGIN_REMEMBER_USERNAME, userName);
        dispatch(mainActions.login(userName, encrypted(password)));
    };

    return (
        <View className="ro-login-page">
            <View className="login-header">
                <Image className="logo" src={logo}></Image>
            </View>

            <View className="form">
                <View className="field">
                    <View className="label">账号</View>
                    <Input
                        className="input"
                        controlled
                        value={userName}
                        onInput={(e) => {
                            setUserName(e.detail.value);
                        }}
                        placeholder="请输入您的账号"
                        placeholderClass="placeholder"
                    ></Input>
                </View>

                <View className="field">
                    <View className="label">密码</View>
                    <View className="input-wrap">
                        <Input
                            className="input input-password"
                            controlled
                            value={password}
                            onInput={(e) => {
                                setPassword(e.detail.value);
                            }}
                            password={showPassword}
                            placeholder="请输入您的密码"
                            placeholderClass="placeholder"
                        ></Input>
                        <View className="eye" onClick={togglePassword}>
                            <Image className="eye-icon" src={showPassword ? noeye : eye}></Image>
                        </View>
                    </View>
                </View>
            </View>

            <Button className="btn" onClick={login}>
                登录
            </Button>
        </View>
    );
}

export default Main;
