import { View, Image, Input } from "@tarojs/components";
import { RootState } from "type/state";
import { connect } from "react-redux";
import { NavList } from "component/nav-list";
import logo from "asset/img/global/logo.png";
import { AtButton, AtInput } from "taro-ui";
import "./index.less";

interface PhoneNumberProps extends ReturnType<typeof mapStateToProps> {}

function PhoneNumber(props: PhoneNumberProps) {
    const { confirmPassword } = props;

    return (
        <View className="ro-password-page">
            <View className="ro-password-title">验证当前密码</View>
            <View>
                <View className="ro-password-label">密码</View>
                <AtInput
                    name="phone"
                    type="number"
                    placeholder="请输入当前密码"
                    // value={visiable.phoneNumber}
                    onChange={(value) => {
                        // showVisiable((prev) => ({ ...prev, phoneNumber: `${value || ""}` }));
                    }}
                />
            </View>
            <View style={{ width: "80%", marginTop: 60 }}>
                <AtButton className="modal-btn global-blue-bg" type="primary" onClick={() => {}}>
                    <View className="btntext">下一步</View>
                </AtButton>
            </View>
        </View>
    );
}

const mapStateToProps = (state: RootState) => ({
    confirmPassword: state.app.user?.confirmPassword,
});

export default connect(mapStateToProps)(PhoneNumber);
