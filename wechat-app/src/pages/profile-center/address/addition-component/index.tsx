import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { roDispatch } from "@core";
import { Button, Image, Picker, Text, Textarea, View } from "@tarojs/components";
import { roPushHistory } from "utils";
import { AtButton, AtInput, AtSwitch } from "taro-ui";
import { Toast } from "utils/ui/toast";
import { RootState } from "type/state";
import { NavList } from "component/nav-list";
import logo from "asset/img/global/logo.png";
import { actions } from "../index.module";
import { AddressService$addAddress$Request } from "../service";
import "./index.less";

interface AdditionProps extends ReturnType<typeof mapStateToProps> {}

function Addition(props: AdditionProps) {
    const { analysisAddress, addressValuesIndex, provinces, citys, districts, streets, addressType } = props;
    const [recognition, setRecognition] = useState("");
    const [contacts, setContacts] = useState<AddressService$addAddress$Request>({
        addressType,
        person: "",
        phoneNumber: "",
        detailAddress: "",
        province: "",
        city: "",
        district: "",
        street: "",
        defaultAddress: 0,
    });

    useEffect(() => {
        if (analysisAddress) {
            setContacts((prev) => ({ ...prev, ...analysisAddress }));
        }
    }, [analysisAddress]);

    const addressPickerColumnsChange = (column: number, value: number) => {
        roDispatch(actions.addressPicker(column, value));
    };

    const analysisAddressByText = (text: string) => {
        roDispatch(actions.analysisAddressByText(text));
    };

    const addressConfirm = (values) => {
        const province = provinces[values[0]]?.name;
        const city = citys[values[1]]?.name;
        const district = districts[values[2]]?.name;
        const street = streets[values[3]]?.name;
        setContacts((prev) => ({ ...prev, province, city, district, street }));
    };

    const saveAddress = () => {
        if (!contacts.person) {
            return Toast.text("请输入联系人！");
        }
        if (!contacts.phoneNumber) {
            return Toast.text("请输入手机号！");
        }
        if (contacts.phoneNumber.length !== 11) {
            return Toast.text("请正确输入11位手机号！");
        }
        if (!contacts.district) {
            return Toast.text("请选择省市区！");
        }
        if (!contacts.detailAddress) {
            return Toast.text("请输入详细地址！");
        }
        if (contacts.id) {
            roDispatch(actions.editAddress({ ...contacts, addressType }));
        } else {
            roDispatch(actions.addAddress({ ...contacts, addressType }));
        }
    };

    return (
        <View className="ro-addition-page" style={{ paddingBottom: 60 }}>
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
                    <AtButton
                        disabled={!recognition}
                        className="confirm-btn bluebg"
                        type="primary"
                        onClick={() => {
                            analysisAddressByText(recognition);
                        }}
                    >
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
                <Picker
                    mode="multiSelector"
                    value={addressValuesIndex}
                    range={[provinces, citys, districts, streets]}
                    rangeKey="name"
                    onChange={(event) => {
                        addressConfirm(event.detail.value);
                    }}
                    onCancel={() => {
                        roDispatch(actions.setAddressValuesIndex());
                    }}
                    onColumnChange={(event) => {
                        const { column, value } = event?.detail || {};
                        addressPickerColumnsChange(column, value);
                    }}
                >
                    <NavList.NavListItem
                        title="省市区"
                        childrenStyle={{ justifyContent: "flex-start", textAlign: "left", height: 40, marginLeft: 20, color: "#333" }}
                        arrow="right"
                    >
                        {[contacts.province, contacts.city, contacts.district, contacts.street].filter(Boolean).join("/") || (
                            <View style={{ color: "#D3D3D3", width: "100%" }}>点击选择省市区</View>
                        )}
                    </NavList.NavListItem>
                </Picker>
                <NavList.NavListItem title="详细地址" childrenStyle={{ justifyContent: "flex-start", textAlign: "left" }}>
                    <AtInput
                        name="detailAddress"
                        type="text"
                        placeholder="(例如**街*号**)"
                        border={false}
                        value={contacts.detailAddress}
                        onChange={(value: string) => {
                            setContacts((prev) => ({ ...prev, detailAddress: value }));
                        }}
                        style={{ width: "100%" }}
                    />
                </NavList.NavListItem>
                <NavList.NavListItem
                    title="设置默认地址"
                    // childrenStyle={{ justifyContent: "flex-start", textAlign: "left" }}
                    description="提醒：每次下单会默认推荐使用该地址"
                >
                    <AtSwitch
                        checked={!!contacts.defaultAddress}
                        border={false}
                        onChange={(value) => {
                            setContacts((prev) => ({ ...prev, defaultAddress: Number(value) }));
                        }}
                    />
                </NavList.NavListItem>
            </NavList>
            <AtButton className="g-btn-fixed" type="primary" onClick={saveAddress}>
                <View className="save-text">保存</View>
            </AtButton>
        </View>
    );
}

const mapStateToProps = (state: RootState) => ({
    addressValuesIndex: state.app.address?.addressValuesIndex,
    analysisAddress: state.app.address?.analysisAddress,
    provinces: state.app.address?.provinces,
    citys: state.app.address?.citys,
    districts: state.app.address?.districts,
    streets: state.app.address?.streets,
    addressType: state.app.address.tabKey,
});

export default connect(mapStateToProps)(Addition);
