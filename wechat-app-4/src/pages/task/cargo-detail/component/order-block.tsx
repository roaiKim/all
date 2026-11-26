import { DriverExecutionCargoOrder } from "@api/DriverExecutionService";
import { Text, View } from "@tarojs/components";
import { getPackageExtra, getPlanQty } from "./helper";

function OrderBlock(props: { order: DriverExecutionCargoOrder }) {
    const { order } = props;
    const packageLines = order.packageLines || [];
    const planLines = order.planLines || [];
    const isPlan = order.cargoSource === "PLAN" || packageLines.length === 0;

    return (
        <View className="order-card">
            <View className="order-head">
                <Text className="order-no">{order.orderNo || order.orderId}</Text>
                <Text className={`source-tag ${isPlan ? "plan" : "actual"}`}>{isPlan ? "计划货物" : "实装货物"}</Text>
            </View>
            {order.customerName && <View className="order-sub">客户：{order.customerName}</View>}
            {order.pickupAddress && <View className="order-sub">提货地址：{order.pickupAddress}</View>}
            {order.deliveryAddress && <View className="order-sub">送货地址：{order.deliveryAddress}</View>}

            {isPlan ? (
                planLines.length > 0 ? (
                    <View className="cargo-table">
                        <View className="table-head">
                            <Text className="col-main">计划物料</Text>
                            <Text className="col-qty">数量</Text>
                        </View>
                        {planLines.map((line, index) => (
                            <View className="table-row" key={`${line.materialCode || "plan"}_${index}`}>
                                <View className="col-main">
                                    <View className="material-name">{line.materialName || line.materialCode || "-"}</View>
                                    {line.materialCode && <View className="material-code">{line.materialCode}</View>}
                                </View>
                                <Text className="col-qty">{getPlanQty(line)}</Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <View className="cargo-empty">暂无货物明细</View>
                )
            ) : (
                <View className="cargo-table">
                    <View className="table-head">
                        <Text className="col-main">物料</Text>
                        <Text className="col-box">箱号</Text>
                        <Text className="col-qty">数量</Text>
                    </View>
                    {packageLines.map((line, index) => (
                        <View className="table-row" key={line.packageId || `${line.materialCode || "package"}_${index}`}>
                            <View className="col-main">
                                <View className="material-name">{line.materialName || line.materialCode || "-"}</View>
                                {line.materialCode && <View className="material-code">{line.materialCode}</View>}
                                {getPackageExtra(line) && <View className="material-code">{getPackageExtra(line)}</View>}
                            </View>
                            <Text className="col-box">{line.boxNo || "-"}</Text>
                            <Text className="col-qty">
                                {line.pcs ?? 0} {line.unit || "PCS"}
                            </Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

export default OrderBlock;
