import { View, Image } from "@tarojs/components";

interface RenderTitleProps {
    status: number;
    isDraft: boolean;
}

export const RenderTitle = (props: RenderTitleProps) => {
    const { status, isDraft } = props;
    if (isDraft) {
        return (
            <>
                <View className="status-tag" style={{ background: "#f5f5f5", color: "red" }}>
                    草稿
                </View>
                <Image src={require("asset/img/order/arrnone.png")}></Image>
            </>
        );
    } else if (status === 1) {
        return (
            <>
                <View className="status-tag" style={{ background: "#f5f5f5", color: "#828282" }}>
                    待确认
                </View>
                <Image src={require("asset/img/order/arrnone.png")}></Image>
            </>
        );
    } else if (status === 2) {
        return (
            <>
                <View className="status-tag" style={{ background: "#e6e3ff", color: "#1966ff" }}>
                    已确认
                </View>
                <Image src={require("asset/img/order/arrhalf.png")}></Image>
            </>
        );
    } else if (status === 3) {
        return (
            <>
                <View className="status-tag" style={{ background: "#e6e3ff", color: "#1966ff" }}>
                    运输中
                </View>
                <Image src={require("asset/img/order/arrhalf.png")}></Image>
            </>
        );
    } else if (status === 4) {
        return (
            <>
                <View className="status-tag" style={{ background: "#f5f5f5", color: "#828282" }}>
                    已取消
                </View>
                <Image src={require("asset/img/order/arrnone.png")}></Image>
            </>
        );
    } else if (status === 5) {
        return (
            <>
                <View className="status-tag" style={{ background: "#E8FEE5", color: "#0AB503" }}>
                    已签收
                </View>
                <Image src={require("asset/img/order/arrok.png")}></Image>
            </>
        );
    } else if (status === 6) {
        return (
            <>
                <View className="status-tag" style={{ background: "#FFE8E8", color: "#F41E1E" }}>
                    拒签
                </View>
                <Image src={require("asset/img/order/arrred.png")}></Image>
            </>
        );
    } else {
        return (
            <>
                <View className="status-tag" style={{ background: "#f5f5f5", color: "#828282" }}>
                    -
                </View>
                <Image src={require("asset/img/order/arrnone.png")}></Image>
            </>
        );
    }
};
