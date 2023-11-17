import { useState } from "react";
import { connect } from "react-redux";
import { roDispatch } from "@core";
import { Button, Image, View } from "@tarojs/components";
import { roPushHistory } from "utils";
import { AtInput, AtModal, AtModalAction, AtModalContent, AtModalHeader } from "taro-ui";
import { Toast } from "utils/ui/toast";
import { RootState } from "type/state";
import { NavList } from "component/nav-list";
import logo from "asset/img/global/logo.png";
import { actions } from "../index.module";
import "./index.less";

interface UserProps extends ReturnType<typeof mapStateToProps> {}

function User(props: UserProps) {
    const { profile } = props;
    const [visiable, showVisiable] = useState({
        showNumber: false,
        showEmail: false,
        phoneNumber: "",
        email: "",
    });

    return (
        <View className="ro-user-page">
            <NavList>
                <NavList.NavListItem title="头像">
                    <Image style={{ width: 35, height: 35 }} src={logo} mode="aspectFit"></Image>
                </NavList.NavListItem>
                <NavList.NavListItem
                    title="电话"
                    rightValue={profile?.phoneNumber}
                    onClick={() => {
                        showVisiable((prev) => ({ ...prev, showNumber: true, phoneNumber: profile?.phoneNumber }));
                    }}
                />
                <NavList.NavListItem
                    title="邮箱"
                    rightValue={profile?.mail}
                    onClick={() => {
                        showVisiable((prev) => ({ ...prev, showEmail: true, email: profile?.mail }));
                    }}
                />
                <NavList.NavListItem
                    arrow="right"
                    title="修改密码"
                    onClick={() => {
                        roPushHistory("/pages/profile-center/user/addition");
                    }}
                />
                <AtModal isOpened={visiable.showNumber} onClose={() => {}}>
                    <AtModalHeader>修改电话</AtModalHeader>
                    <AtModalContent>
                        {visiable.showNumber && (
                            <AtInput
                                border={false}
                                name="phone"
                                type="number"
                                placeholder="电话"
                                value={visiable.phoneNumber}
                                onChange={(value) => {
                                    showVisiable((prev) => ({ ...prev, phoneNumber: `${value || ""}` }));
                                }}
                            />
                        )}
                    </AtModalContent>
                    <AtModalAction>
                        <Button onClick={() => showVisiable((prev) => ({ ...prev, showNumber: false, phoneNumber: "" }))}>取消</Button>
                        <Button
                            onClick={() => {
                                if (/^\d{11}$/.test(visiable.phoneNumber)) {
                                    roDispatch(actions.editUserInfo({ phoneNumber: visiable.phoneNumber }));
                                    showVisiable((prev) => ({ ...prev, showNumber: false, phoneNumber: "" }));
                                } else {
                                    Toast.text("请正确输入手机号");
                                }
                            }}
                        >
                            确认保存
                        </Button>
                    </AtModalAction>
                </AtModal>
                <AtModal isOpened={visiable.showEmail} onClose={() => {}}>
                    <AtModalHeader>修改邮箱</AtModalHeader>
                    <AtModalContent>
                        {visiable.showEmail && (
                            <AtInput
                                border={false}
                                name="email"
                                type="text"
                                placeholder="邮箱"
                                value={visiable.email}
                                onChange={(value) => {
                                    showVisiable((prev) => ({ ...prev, email: `${value || ""}` }));
                                }}
                            />
                        )}
                    </AtModalContent>
                    <AtModalAction>
                        <Button onClick={() => showVisiable((prev) => ({ ...prev, showEmail: false, email: "" }))}>取消</Button>
                        <Button
                            onClick={() => {
                                if (/\w+?@\w+?\.\w+?$/.test(visiable.email)) {
                                    roDispatch(actions.editUserInfo({ mail: visiable.email }));
                                    showVisiable((prev) => ({ ...prev, showEmail: false, email: "" }));
                                } else {
                                    Toast.text("请正确输入邮箱");
                                }
                            }}
                        >
                            确认保存
                        </Button>
                    </AtModalAction>
                </AtModal>
            </NavList>
        </View>
    );
}

const mapStateToProps = (state: RootState) => ({
    profile: state.app.user?.profile,
});

export default connect(mapStateToProps)(User);
