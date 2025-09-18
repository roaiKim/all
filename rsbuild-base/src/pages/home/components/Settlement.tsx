import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Select } from "antd";
import dayjs from "dayjs";
import { GolbalService } from "@service/api/GolbalService";
import Compose from "./Compose"; // 假设Compose组件已转换为React版本

// 定义财务数据类型
export interface FinancialData {
    已付: number | string;
    已收: number | string;
    应付: number | string;
    应收: number | string;
    承运毛利: number | string;
    毛利率: number | string;
}

const FinancialSettlement: React.FC = () => {
    // 生成12个月的选项
    const months = useMemo(() => {
        return Array(12)
            .fill(null)
            .map((_, index) => {
                const month = index + 1;
                const value = `${dayjs().format("YYYY")}-${month < 10 ? `0${month}` : month}`;
                return { value, label: value };
            });
    }, []);

    // 状态管理
    const [condition, setCondition] = useState<string>(dayjs().format("YYYY-MM"));
    const [modal, setModal] = useState<FinancialData>({
        已付: 0,
        已收: 0,
        应付: 0,
        应收: 0,
        承运毛利: 0,
        毛利率: 0,
    });

    // 数字格式化函数
    const numberToCurrencyNo = useCallback((value: number | string) => {
        if (!value) return 0;

        // 确保值为数字
        const num = typeof value === "string" ? parseFloat(value) : value;
        if (isNaN(num)) return 0;

        // 获取整数部分
        const intPart = Math.trunc(num);
        // 整数部分处理，增加千位分隔符
        const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
        // 处理小数部分
        const valueArray = num.toString().split(".");

        if (valueArray.length === 2) {
            return `${intPartFormat}.${valueArray[1]}`;
        }
        return intPartFormat;
    }, []);

    // 获取财务数据
    const getData = useCallback(async () => {
        try {
            const res = await GolbalService.getSettlementAnalysis({ type: condition });
            console.log("GolbalService", res);

            setModal({
                已付: numberToCurrencyNo(res.已付),
                已收: numberToCurrencyNo(res.已收),
                应付: numberToCurrencyNo(res.应付),
                应收: numberToCurrencyNo(res.应收),
                承运毛利: numberToCurrencyNo(res.承运毛利),
                毛利率: res.毛利率,
            });
        } catch (error) {
            console.error("获取财务数据失败:", error);
        }
    }, [condition, numberToCurrencyNo]);

    // 组件挂载时获取数据
    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <Compose
            className="settlement-module"
            title="财务结算"
            query={
                <div style={{ padding: "5px 20px" }}>
                    <Select
                        value={condition}
                        style={{ width: "120px" }}
                        onChange={(value) => {
                            setCondition(value);
                        }}
                        options={months}
                    ></Select>
                </div>
            }
        >
            <div className="flex">
                <div style={{ padding: "0 20px 20px" }} className="flex1">
                    <div className="background">
                        <div className="flex space-between">
                            <div className="flex1" style={{ borderRight: "1px solid #eee", marginRight: "50px" }}>
                                <div className="title">应收</div>
                                <div className="count" style={{ marginBottom: "20px" }}>
                                    {modal.应收}
                                </div>
                                <div className="title">已收</div>
                                <div className="count">{modal.已收}</div>
                            </div>

                            <div className="flex1" style={{ borderRight: "1px solid #eee", marginRight: "50px" }}>
                                <div className="title">应付</div>
                                <div className="count" style={{ marginBottom: "20px" }}>
                                    {modal.应付}
                                </div>
                                <div className="title">已付</div>
                                <div className="count">{modal.已付}</div>
                            </div>

                            <div className="flex1">
                                <div className="title">承运毛利</div>
                                <div className="count" style={{ marginBottom: "20px" }}>
                                    {modal.承运毛利}
                                </div>
                                <div className="title">毛利率</div>
                                <div className="count">{modal.毛利率}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Compose>
    );
};

// 导出组件
export default FinancialSettlement;
