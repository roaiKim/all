import { View, Image } from "@tarojs/components";
import EmptyImg from "asset/img/template/empty.png";
import "./index.less";

function Empty(props) {
    const { title = "暂无数据" } = props;

    return (
        <View className="ro-empty-card-component">
            <Image src={EmptyImg}></Image>
            <View>{title}</View>
        </View>
    );
}

export default Empty;
