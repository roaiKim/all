import Taro from "@tarojs/taro";
import { View, Radio } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import { roDispatch } from "@core";
import { actions } from "../../index.module";
import "./index.less";
import { AddressService$addAddress$Request } from "../../service";

interface AddressCardProps {
    address: AddressService$addAddress$Request;
}

function AddressCard(props: AddressCardProps) {
    const { address } = props;

    const setDefaultAddress = (e) => {
        if (!address.defaultAddress) {
            roDispatch(actions.setDefaultAddress(address.id));
        }
    };

    return (
        <View className="ro-address-card">
            <View
                onClick={() => {
                    roDispatch(actions.toEditAddressPageAction(address));
                }}
            >
                <View className="name-line">
                    <View className="name">{address.person}</View>
                    <View className="phone">{address.phoneNumber}</View>
                    {Boolean(address.defaultAddress) && <View className="default">默认</View>}
                </View>
                <View className="address-line">
                    <View className="left">
                        {address.province + address.city + address.district}
                        {address.street ? address.street : ""}
                        {address.detailAddress}
                    </View>
                    <View className="right">
                        <AtIcon size={16} color="#999" value="edit"></AtIcon>
                    </View>
                </View>
            </View>
            <View className="set-line">
                <View className="left">
                    <Radio className="radio" color="#3579ff" checked={Boolean(address.defaultAddress)} onClick={setDefaultAddress} value="1">
                        默认地址
                    </Radio>
                </View>
                <View
                    className="right"
                    onClick={() => {
                        roDispatch(actions.deleteAddress([address.id]));
                    }}
                >
                    删除
                </View>
            </View>
        </View>
    );
}

export default AddressCard;
