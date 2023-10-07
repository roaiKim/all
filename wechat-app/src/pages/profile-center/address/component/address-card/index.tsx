import Taro from "@tarojs/taro";
import { View, Radio } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import { useDispatch } from "react-redux";
import { actions } from "../../index.module";
import "./index.less";

function AddressCard(props) {
    const { info, clickBack } = props;
    const dispatch = useDispatch();
    const radioClick = (e) => {
        // if (!info.defaultAddress) {
        //     dispatch(actions.setDefault(info.id));
        // }
    };
    const toBack = () => {
        clickBack();
    };
    return (
        <View className="ro-address-card">
            <View className="name-line" onClick={toBack}>
                <View className="name">{info.person}</View>
                <View className="phone">{info.phoneNumber}</View>
                {Boolean(info.defaultAddress) && <View className="default">默认</View>}
            </View>
            <View className="address-line" onClick={toBack}>
                <View className="left">
                    {info.province + info.city + info.district}
                    {info.street ? info.street : ""}
                    {info.detailAddress}
                </View>
                <View
                    className="right"
                    onClick={(e) => {
                        e.stopPropagation();
                        const str = JSON.stringify(info);
                        // Taro.navigateTo({ url: "/pages/addAddress/index?info=" + str });
                    }}
                >
                    <AtIcon size={16} color="#999" value="edit"></AtIcon>
                </View>
            </View>
            <View className="set-line">
                <View className="left">
                    <Radio className="radio" color="#3579ff" checked={Boolean(info.defaultAddress)} onClick={radioClick} value="1">
                        默认地址
                    </Radio>
                </View>
                <View
                    className="right"
                    onClick={() => {
                        // dispatch(actions.delAddress([info.id]));
                    }}
                >
                    删除
                </View>
            </View>
        </View>
    );
}

export default AddressCard;
