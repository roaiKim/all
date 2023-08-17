import { Button, Input, ScrollView, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { RootState } from "type/state";
import Empty from "component/Empty";
import { connect } from "react-redux";
import "./index.less";
import OrderCard from "./order-card";
import V from "./v";

interface OrderSearchProps extends ReturnType<typeof mapStateToProps> {
    name: string;
}

function OrderSearch(props: OrderSearchProps) {
    const { dataSoure } = props;
    const [pageHeight, setPageHeight] = useState(400);

    useEffect(() => {
        // const menuButtonObject = Taro.getMenuButtonBoundingClientRect();
        const sysinfo = Taro.getSystemInfoSync();
        // const statusBarHeight = sysinfo.statusBarHeight || 0;
        // const menuBottonHeight = menuButtonObject.height;
        // const menuBottonTop = menuButtonObject.top;
        // const height = statusBarHeight + menuBottonHeight + (menuBottonTop - statusBarHeight) * 2;
        const windowHeight = sysinfo.windowHeight || 400;
        setPageHeight(windowHeight - 170);
    }, []);

    return (
        <View className="ro-order-search-page">
            <View className="top-bg">
                <View className="title">订单查询</View>
                <View className="input-box">
                    <Input
                        confirmType="search"
                        placeholder="订单号搜索"
                        controlled
                        onConfirm={(value) => {
                            console.log(value.detail.value);
                        }}
                    />
                </View>
            </View>
            <ScrollView
                className="ro-order-search-scroll"
                scrollY
                scrollWithAnimation
                scrollTop={0}
                style={{
                    height: pageHeight,
                }}
                lowerThreshold={20}
                upperThreshold={20}
                onScrollToUpper={(commonEventFunction) => {
                    console.log(commonEventFunction);
                }}
            >
                {dataSoure?.length > 0 ? (
                    dataSoure.map((item) => <OrderCard key={item.orderNumber || item.transportOrderNumber} info={item}></OrderCard>)
                ) : (
                    <Empty title="暂无订单"></Empty>
                )}
            </ScrollView>
        </View>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        dataSoure: state.app.orderSearch.dataSource,
    };
};

export default connect(mapStateToProps)(OrderSearch);
