import { View, Image, Button, Textarea } from "@tarojs/components";
import { RootState } from "type/state";
import { roDispatch } from "@core";
import { connect } from "react-redux";
import { useState } from "react";
import { NavList } from "component/nav-list";
import logo from "asset/img/global/logo.png";
import { Toast } from "utils/ui/toast";
import { roPushHistory } from "utils";
import { AtButton, AtInput, AtModal, AtModalAction, AtModalContent, AtModalHeader, AtSwitch } from "taro-ui";
import "./index.less";
import { actions } from "../index.module";

interface AdditionProps extends ReturnType<typeof mapStateToProps> {}

function Addition(props: AdditionProps) {
    const { profile } = props;
    const [recognition, setRecognition] = useState("");
    const [contacts, setContacts] = useState({
        person: "",
        phoneNumber: "",
        detailAddress: "",
        province: "",
        city: "",
        district: "",
        street: "",
        defaultAddress: false,
    });

    return (
        <View className="ro-addition-page">
            <View className="ro-address-example">示例：华华，138****0000，北京市大兴区某医院某号楼</View>
            <View className="ro-address-recognition">
                <Textarea
                    placeholderClass="placeholder"
                    placeholder="请粘贴或输入文本，点击“识别”自动识别姓名电话和地址"
                    value={recognition}
                    onInput={(e) => {
                        setRecognition(e.detail.value);
                    }}
                ></Textarea>
                <View className="btn-line">
                    <AtButton disabled={!recognition} className="confirm-btn bluebg" type="primary" onClick={() => {}}>
                        <View className="confirm-text">识别</View>
                    </AtButton>
                </View>
            </View>
            <NavList style={{ marginTop: 15 }}>
                <NavList.NavListItem title="联系人" childrenStyle={{ justifyContent: "flex-start", textAlign: "left" }}>
                    <AtInput
                        name="person"
                        type="text"
                        placeholder="请输入联系人"
                        border={false}
                        value={contacts.person}
                        onChange={(value: string) => {
                            setContacts((prev) => ({ ...prev, person: value }));
                        }}
                    />
                </NavList.NavListItem>
                <NavList.NavListItem title="手机号" childrenStyle={{ justifyContent: "flex-start", textAlign: "left" }}>
                    <AtInput
                        name="phoneNumber"
                        type="text"
                        placeholder="请输入手机号"
                        border={false}
                        value={contacts.phoneNumber}
                        onChange={(value: string) => {
                            setContacts((prev) => ({ ...prev, phoneNumber: value }));
                        }}
                    />
                </NavList.NavListItem>
                <NavList.NavListItem title="省市区" childrenStyle={{ justifyContent: "flex-start", textAlign: "left" }} arrow="right">
                    <AtInput
                        name="person"
                        type="text"
                        placeholder="请输入省市区"
                        border={false}
                        value={contacts.person}
                        onChange={(value: string) => {
                            setContacts((prev) => ({ ...prev, person: value }));
                        }}
                    />
                </NavList.NavListItem>
                <NavList.NavListItem title="详细地址" childrenStyle={{ justifyContent: "flex-start", textAlign: "left" }}>
                    <AtInput
                        name="detailAddress"
                        type="text"
                        placeholder="请输入详细地址"
                        border={false}
                        value={contacts.detailAddress}
                        onChange={(value: string) => {
                            setContacts((prev) => ({ ...prev, detailAddress: value }));
                        }}
                    />
                </NavList.NavListItem>
                <NavList.NavListItem
                    title="设置默认地址"
                    // childrenStyle={{ justifyContent: "flex-start", textAlign: "left" }}
                    description="提醒：每次下单会默认推荐使用该地址"
                >
                    <AtSwitch
                        checked={contacts.defaultAddress}
                        border={false}
                        onChange={(value) => {
                            setContacts((prev) => ({ ...prev, defaultAddress: value }));
                        }}
                    />
                </NavList.NavListItem>
            </NavList>
        </View>
    );
}

const mapStateToProps = (state: RootState) => ({
    profile: state.app.user?.profile,
});

export default connect(mapStateToProps)(Addition);
