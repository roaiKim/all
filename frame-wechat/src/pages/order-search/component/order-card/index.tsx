import { useDispatch } from "react-redux";
import { Image, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AtButton, AtIcon } from "taro-ui";
import { copyToClipboard } from "utils/functions";
import { actions } from "pages/order-search/index.module";
import { RenderTitle } from "./render-title";
import "./index.less";

function OrderCard(props) {
    const { info } = props;
    const dispatch = useDispatch();

    const toDetail = () => {
        if (info.isDraft) {
            return;
        }
        //
    };
    const cancel = () => {
        //
    };
    const edit = () => {
        //
    };
    const again = () => {
        //
    };

    return (
        <View className="ro-order-card">
            <View className="top-line">
                <View className="title">订单号：</View>
                <View className="number">{info.transportOrderNumber || "-"}</View>
                <View
                    className="copy"
                    onClick={() => {
                        copyToClipboard(info.transportOrderNumber);
                    }}
                >
                    <AtIcon size={12} value="file-generic"></AtIcon>
                </View>
            </View>
            <View className="content" onClick={toDetail}>
                <View className="address-line">
                    <View className="left">
                        <View className="top">{info.pickupCity === "市辖区" ? info.pickupProvince : info.pickupCity}</View>
                        <View className="bottom">{info.pickupContactName}</View>
                    </View>
                    <View className="center">
                        <RenderTitle status={info.status} isDraft={info.isDraft} />
                    </View>
                    <View className="right">
                        <View className="top">{info.deliveryCity === "市辖区" ? info.deliveryProvince : info.deliveryCity}</View>
                        <View className="bottom">{info.deliveryContactName}</View>
                    </View>
                </View>
                <View className="detail-line">
                    <View className="dashed"></View>
                    <View className="top">
                        <Image src={require("asset/img/order/qu.png")} className="qu">
                            取
                        </Image>
                        <View className="text">{info.pickupAddress}</View>
                    </View>
                    <View className="bottom">
                        <Image src={require("asset/img/order/pai.png")} className="pai">
                            派
                        </Image>
                        <View className="text">{info.deliveryAddress}</View>
                    </View>
                </View>
                <View className="other-line">
                    <View className="left">
                        <View className="top">客户项目编码：</View>
                        <View className="bottom">{info.clientProjectNumber}</View>
                    </View>
                    <View className="split">|</View>
                    <View className="right">
                        <View className="top">其他：</View>

                        <View className="bottom">{info.temperatureAreaName}</View>
                    </View>
                </View>
            </View>
            {(info.status === 1 || info.status === 4 || info.status === 5) && (
                <View className="btn-line">
                    {info.status === 1 && (
                        <AtButton className="btn" onClick={cancel}>
                            <View className="btntext">取消订单</View>
                        </AtButton>
                    )}
                    {info.status === 1 && (
                        <AtButton className="btn" type="secondary" onClick={edit}>
                            <View className="btntext">修改订单</View>
                        </AtButton>
                    )}
                    {(info.status === 4 || info.status === 5) && (
                        <AtButton className="btn" type="secondary" onClick={again}>
                            <View className="btntext">再次下单</View>
                        </AtButton>
                    )}
                </View>
            )}
            {info.isDraft && (
                <View className="btn-line">
                    <AtButton
                        className="btn"
                        type="secondary"
                        onClick={() => {
                            //
                        }}
                    >
                        <View className="btntext">修改订单</View>
                    </AtButton>
                </View>
            )}
        </View>
    );
}

export default OrderCard;
