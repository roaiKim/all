import { Image, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useState } from "react";
import { AtButton, AtIcon, AtModal, AtModalContent } from "taro-ui";
import { roPushHistory } from "utils";
import "./index.less";

function Main() {
    const [notification, setNotification] = useState(true);

    return (
        <View className="ro-home-page">
            <Image className="ro-home-bg" src={require("asset/img/home/bg.png")}></Image>

            <AtButton
                className="btn global-blue-bg"
                type="primary"
                onClick={() => {
                    //
                }}
            >
                <View className="btn-text">
                    <AtIcon className="btn-icon" size={18} value="calendar"></AtIcon>预约下单
                </View>
            </AtButton>
            <AtButton
                className="btn"
                onClick={() => {
                    roPushHistory("/pages/webview/index");
                }}
            >
                <View className="btn-text">
                    <AtIcon className="btn-icon" size={18} value="edit"></AtIcon>委托申请
                </View>
            </AtButton>

            <AtModal isOpened={notification} closeOnClickOverlay={false}>
                <AtModalContent>
                    <View className="ro-notification-container">
                        <View className="title">下单须知</View>
                        <View className="content">
                            未开通华人冷链物流客户账号的客户，您可以在“华人冷链小程序”直接发起委托申请，填写销售人员及详细委托信息，完成之后会有相关人员进一步跟进委托订单对接工作。
                        </View>
                        <AtButton
                            className="modal-btn global-blue-bg"
                            type="primary"
                            onClick={() => {
                                setNotification(false);
                            }}
                        >
                            <View className="modal-btntext">我已知晓</View>
                        </AtButton>
                    </View>
                </AtModalContent>
            </AtModal>
        </View>
    );
}

export default Main;
