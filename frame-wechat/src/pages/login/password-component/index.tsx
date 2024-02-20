import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Image, Input, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { actions as mainActions } from "pages/main/index.module";
import logo from "asset/img/global/logo.png";
import eye from "asset/img/template/eye.png";
import noeye from "asset/img/template/noeye.png";
import "./index.less";

/**
 * 
 * @returns grant_type: password
username: gongchao
password: FXhi3+aMlwbivn8EPBWrgQ==
 */

function Main() {
    const [showPassword, setShowPassword] = useState(true);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const togglePassword = () => {
        setShowPassword(!showPassword);
    };
    const dispatch = useDispatch();
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
        dispatch(mainActions.login(userName, password));
    };

    return (
        <View className="ro-login-page">
            <Image src={logo}></Image>
            <View className="title">华药冷链</View>
            <View className="eye-father">
                <View className="input-title">账号</View>
                <Input
                    controlled
                    value={userName}
                    onInput={(e) => {
                        setUserName(e.detail.value);
                    }}
                    placeholder="请输入您的账号"
                    placeholderClass="placeholder"
                ></Input>
                <View className="eye"></View>
            </View>

            <View className="eye-father">
                <View className="input-title">密码</View>
                <Input
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
                    <>{showPassword ? <Image src={noeye}></Image> : <Image src={eye}></Image>}</>
                </View>
            </View>
            <Button className="btn bluebg" type="primary" onClick={login}>
                <View className="btntext">登录</View>
            </Button>
        </View>
    );
}

export default Main;
