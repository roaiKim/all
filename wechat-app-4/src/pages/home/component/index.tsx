import { useState } from "react";
import { AtButton, AtIcon, AtModal, AtModalContent } from "taro-ui";
import { Image, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { pushHistory } from "@utils";
import "./index.less";

function Main() {
    const [notification, setNotification] = useState(true);

    return <View className="ro-home-page">null</View>;
}

export default Main;
