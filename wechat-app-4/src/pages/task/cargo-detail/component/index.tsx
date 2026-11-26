import { useEffect } from "react";
import { connect } from "react-redux";
import Empty from "@component/Empty";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { RootState } from "@type/state";
import OrderBlock from "./order-block";
import { CARGO_MODE_TITLES } from "../type";
import "./index.less";

function CargoDetail(props: ReturnType<typeof mapStateToProps>) {
    const { tasks, mode } = props;

    useEffect(() => {
        Taro.setNavigationBarTitle({ title: CARGO_MODE_TITLES[mode] });
    }, [mode]);

    if (tasks.length === 0) {
        return (
            <View className="ro-cargo-page">
                <Empty title="暂无货物明细" />
            </View>
        );
    }

    return (
        <View className="ro-cargo-page">
            {tasks.map((task) => (
                <View className="task-block" key={task.taskId}>
                    <View className="task-title">{task.taskNo}</View>
                    {(task.orders || []).map((order) => (
                        <OrderBlock order={order} key={order.orderId} />
                    ))}
                </View>
            ))}
        </View>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        mode: state.app.cargoDetail.mode,
        tasks: state.app.cargoDetail.tasks,
    };
};

export default connect(mapStateToProps)(CargoDetail);
