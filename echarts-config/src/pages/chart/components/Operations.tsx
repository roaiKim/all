import React, { useEffect, useState } from "react";
import { Select } from "antd"; // 引入Ant Design React的Select组件
// 引入API服务（需确保GolbalService已适配React，此处保持原调用逻辑）
import { GolbalService } from "@service/api/GolbalService";
import RightPng from "./v2_shmer7.png";
// 引入图片资源（路径需与实际项目一致）
import LeftPng from "./v2_shw169.png";
import Compose from "./Compose"; // 复用之前转换的React版Compose组件

// 类型定义（增强TypeScript类型安全）
type ConditionType = 1 | 2 | 3; // 1=今日，2=本周，3=本月
interface Modal1Type {
    订单数: number;
    运输体积: number;
    运输重量: number;
}
interface Modal2Type {
    订单数: number;
    签收量: number;
    签收完成率: number;
}

const Operations: React.FC = () => {
    // 1. 状态管理：替代Vue的ref/reactive
    const [condition, setCondition] = useState<ConditionType>(1); // 下拉选择值
    const [modal1, setModal1] = useState<Modal1Type>({
        订单数: 0,
        运输体积: 0,
        运输重量: 0,
    });
    const [modal2, setModal2] = useState<Modal2Type>({
        订单数: 0,
        签收量: 0,
        签收完成率: 0,
    });

    // 2. 数据请求：替代Vue的onMounted+getData
    const getData = () => {
        // 运输能力数据请求
        GolbalService.getOrderTransportCapacityStatistics({
            type: condition,
        }).then((res: any) => {
            console.log("运输能力数据:", res);
            setModal1({
                订单数: res.订单数,
                运输体积: res.运输体积,
                运输重量: res.运输重量,
            });
        });

        // 发运与签收数据请求
        GolbalService.getOrderTransportShippingReceiptStatistics({
            type: condition,
        }).then((res: any) => {
            console.log("发运与签收数据:", res);
            setModal2({
                订单数: res.订单数,
                签收量: res.签收量,
                签收完成率: res.签收完成率,
            });
        });
    };

    // 组件挂载时初始化数据（替代Vue的onMounted）
    useEffect(() => {
        getData();
    }, []); // 空依赖数组=仅挂载时执行

    // 下拉选择变化时重新请求数据（替代Vue的@change）
    const handleSelectChange = (value: ConditionType) => {
        setCondition(value);
        getData(); // 选择变化后刷新数据
    };

    // 3. JSX渲染：替代Vue模板
    return (
        <Compose
            className="operations-module"
            title="运营综合能力"
            query={
                <div style={{ padding: "5px 20px" }}>
                    <Select
                        value={condition}
                        style={{ width: 120 }}
                        onChange={handleSelectChange}
                        options={[
                            { value: 1, label: "今日" },
                            { value: 2, label: "本周" },
                            { value: 3, label: "本月" },
                        ]}
                    />
                </div>
            }
        >
            <div className="flex">
                <div style={{ padding: "0 0 20px 20px", height: "100%" }} className="flex1">
                    <div className="background">
                        <div
                            style={{
                                color: "#004386",
                                fontWeight: "bold",
                                marginTop: "10px",
                            }}
                        >
                            运输能力
                        </div>
                        <div className="flex space-between">
                            <div style={{ width: "50px" }}>
                                <div className="img">
                                    <img src={LeftPng} alt="运输能力图标" />
                                </div>
                            </div>
                            <div>
                                <div style={{ color: "rgb(79, 89, 109)" }}>订单数</div>
                                <div className="count">{modal1.订单数}</div>
                            </div>
                            <div>
                                <div style={{ color: "rgb(79, 89, 109)" }}>运输重量</div>
                                <div className="count">{modal1.运输重量}</div>
                            </div>
                            <div>
                                <div style={{ color: "rgb(79, 89, 109)" }}>运输体积</div>
                                <div className="count">{modal1.运输体积}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ padding: "0 20px 20px" }} className="flex1">
                    <div className="background">
                        <div
                            style={{
                                color: "#004386",
                                fontWeight: "bold",
                                marginTop: "10px",
                            }}
                        >
                            发运与签收
                        </div>
                        <div className="flex space-between">
                            <div style={{ width: "50px" }}>
                                <div className="img">
                                    <img src={RightPng} alt="发运与签收图标" />
                                </div>
                            </div>
                            <div>
                                <div style={{ color: "rgb(79, 89, 109)" }}>订单数</div>
                                <div className="count">{modal2.订单数}</div>
                            </div>
                            <div>
                                <div style={{ color: "rgb(79, 89, 109)" }}>签收量</div>
                                <div className="count">{modal2.签收量}</div>
                            </div>
                            <div>
                                <div style={{ color: "rgb(79, 89, 109)" }}>签收完成率</div>
                                <div className="count">{modal2.签收完成率}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Compose>
    );
};

export default Operations;
