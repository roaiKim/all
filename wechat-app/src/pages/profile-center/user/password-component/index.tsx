import { View, Image, Input } from "@tarojs/components";
import React, { useState } from "react";
import { roDispatch } from "@core";
import { RootState } from "type/state";
import { connect } from "react-redux";
import { AtButton, AtInput } from "taro-ui";
import { actions } from "pages/profile-center/user/index.module";
import { Toast } from "utils/ui/toast";
import "./index.less";

interface PhoneNumberProps extends ReturnType<typeof mapStateToProps> {}

function PhoneNumber(props: PhoneNumberProps) {
    const { validatePassword } = props;
    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const nextStepAction = () => {
        if (validatePassword) {
            if (!password.currentPassword) {
                Toast.text("请输入当前密码");
                return;
            }
            roDispatch(actions.validatePassword(password.currentPassword));
        } else {
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
            roDispatch(actions.changePassword(password.newPassword));
        }
    };

    return (
        <View className="ro-password-page">
            <View className="ro-password-title">{validatePassword ? "验证当前密码" : "设置新密码"}</View>
            {validatePassword ? (
                <View>
                    <View className="ro-password-label">密码</View>
                    <AtInput
                        name="currentPassword"
                        type="password"
                        placeholder="请输入当前密码"
                        value={password.currentPassword}
                        onChange={(value) => {
                            setPassword((prev) => ({ ...prev, currentPassword: `${value || ""}` }));
                        }}
                    />
                </View>
            ) : (
                <React.Fragment>
                    <View>
                        <View className="ro-password-label">新密码</View>
                        <AtInput
                            name="newPassword"
                            type="password"
                            placeholder="请输入新密码"
                            value={password.newPassword}
                            onChange={(value) => {
                                setPassword((prev) => ({ ...prev, newPassword: `${value || ""}` }));
                            }}
                        />
                    </View>
                    <View style={{ marginTop: 15 }}>
                        <View className="ro-password-label">确认密码</View>
                        <AtInput
                            name="confirmPassword"
                            type="password"
                            placeholder="请再次输入新密码"
                            value={password.confirmPassword}
                            onChange={(value) => {
                                setPassword((prev) => ({ ...prev, confirmPassword: `${value || ""}` }));
                            }}
                        />
                    </View>
                </React.Fragment>
            )}

            <View style={{ width: "80%", marginTop: 60 }}>
                <AtButton className="modal-btn global-blue-bg" type="primary" onClick={nextStepAction}>
                    <View className="btntext">{validatePassword ? "下一步" : "修改密码"}</View>
                </AtButton>
            </View>
        </View>
    );
}

const mapStateToProps = (state: RootState) => ({
    validatePassword: state.app.user?.validatePassword,
});

export default connect(mapStateToProps)(PhoneNumber);
