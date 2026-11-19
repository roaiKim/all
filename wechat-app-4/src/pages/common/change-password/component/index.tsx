import React, { useState } from "react";
import { connect } from "react-redux";
import { roDispatch } from "@core";
import { AtButton, AtInput } from "taro-ui";
import { actions } from "@pages/common/change-password";
import { Image, View } from "@tarojs/components";
import { RootState } from "@type/state";
import { encrypted } from "@utils/functions/encrypted";
import { Toast } from "@utils/ui/toast";
import eye from "@asset/img/template/eye.png";
import noeye from "@asset/img/template/noeye.png";
import "./index.less";

type PhoneNumberProps = ReturnType<typeof mapStateToProps>;

function PhoneNumber(props: PhoneNumberProps) {
    const { userId } = props;
    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [passwordVisible, setPasswordVisible] = useState({
        currentPasswordVisible: false,
        newPasswordVisible: false,
        confirmPasswordVisible: false,
    });

    const togglePasswordVisible = (field: keyof typeof passwordVisible) => {
        setPasswordVisible((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const nextStepAction = () => {
        if (!password.currentPassword) {
            Toast.text("请输入当前密码");
            return;
        }
        if (!password.newPassword) {
            Toast.text("请输入新密码");
            return;
        }
        if (!password.confirmPassword) {
            Toast.text("请输入确认密码");
            return;
        }
        if (password.newPassword !== password.confirmPassword) {
            Toast.text("两次密码输入不一致，请确认");
            return;
        }
        roDispatch(
            actions.changePassword({
                id: userId,
                password: encrypted(password.newPassword),
                rePassword: password.confirmPassword,
                oldPassword: encrypted(password.currentPassword),
            })
        );
    };

    return (
        <View className="ro-password-page">
            <View>
                <View className="ro-password-label">当前密码</View>
                <View className="password-field">
                    <AtInput
                        name="currentPassword"
                        type={passwordVisible.currentPasswordVisible ? "text" : "password"}
                        placeholder="请输入当前密码"
                        value={password.currentPassword}
                        onChange={(value) => {
                            setPassword((prev) => ({ ...prev, currentPassword: `${value || ""}` }));
                        }}
                    />
                    <View className="password-eye" onClick={() => togglePasswordVisible("currentPasswordVisible")}>
                        <Image className="password-eye-icon" src={passwordVisible.currentPasswordVisible ? eye : noeye} />
                    </View>
                </View>
            </View>
            <View style={{ marginTop: 15 }}>
                <View className="ro-password-label">新密码</View>
                <View className="password-field">
                    <AtInput
                        name="newPassword"
                        type={passwordVisible.newPasswordVisible ? "text" : "password"}
                        placeholder="请输入新密码"
                        value={password.newPassword}
                        onChange={(value) => {
                            setPassword((prev) => ({ ...prev, newPassword: `${value || ""}` }));
                        }}
                    />
                    <View className="password-eye" onClick={() => togglePasswordVisible("newPasswordVisible")}>
                        <Image className="password-eye-icon" src={passwordVisible.newPasswordVisible ? eye : noeye} />
                    </View>
                </View>
            </View>
            <View style={{ marginTop: 15 }}>
                <View className="ro-password-label">确认密码</View>
                <View className="password-field">
                    <AtInput
                        name="confirmPassword"
                        type={passwordVisible.confirmPasswordVisible ? "text" : "password"}
                        placeholder="请再次输入新密码"
                        value={password.confirmPassword}
                        onChange={(value) => {
                            setPassword((prev) => ({ ...prev, confirmPassword: `${value || ""}` }));
                        }}
                    />
                    <View className="password-eye" onClick={() => togglePasswordVisible("confirmPasswordVisible")}>
                        <Image className="password-eye-icon" src={passwordVisible.confirmPasswordVisible ? eye : noeye} />
                    </View>
                </View>
            </View>

            <View style={{ width: "80%", marginTop: 60 }}>
                <AtButton className="modal-btn global-blue-bg" type="primary" onClick={nextStepAction}>
                    <View className="btntext">修改密码</View>
                </AtButton>
            </View>
        </View>
    );
}

const mapStateToProps = (state: RootState) => ({
    userId: state.app.main.loginInfo?.user_id,
});

export default connect(mapStateToProps)(PhoneNumber);
