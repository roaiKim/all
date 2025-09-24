import React, { useEffect, useMemo, useRef, useState } from "react";
import { Select } from "antd";
import dayjs from "dayjs";
import * as echarts from "echarts";
import { GolbalService } from "@service/api/GolbalService";
import Compose from "./Compose"; // 需确保Compose已转为React组件

// 定义接口：接口返回的订单状态数据结构
export interface OrderNodeResponse {
    已取消: number;
    已拒收: number;
    已提交: number;
    已签收: number;
    已配载: number;
    异常签收: number;
    正常签收: number;
    运输中: number;
    部分签收: number;
}

// 定义接口：ECharts饼图数据项结构
interface EChartPieDataItem {
    value: number;
    name: string;
    itemStyle: { color: string };
    emphasis: { itemStyle: { color: string } };
}

const FinancialOrderNode: React.FC = () => {
    // 1. 状态管理（替代Vue的ref/reactive）
    // 月份下拉数据（生成当前年份12个月）
    const months = useMemo(() => {
        return Array(12)
            .fill(null)
            .map((_, index) => {
                const month = index + 1;
                const value = `${dayjs().format("YYYY")}-${month < 10 ? `0${month}` : month}`;
                return { value, label: value };
            });
    }, []);

    // 选中的月份条件（替代Vue的ref）
    const [condition, setCondition] = useState<string>(dayjs().format("YYYY-MM"));

    // 2. DOM引用（替代Vue的ref获取DOM）
    const chart1Ref = useRef<HTMLDivElement>(null); // 第一个图表容器
    const chart2Ref = useRef<HTMLDivElement>(null); // 第二个图表容器
    const myChart1Ref = useRef<echarts.ECharts | null>(null); // 第一个图表实例
    const myChart2Ref = useRef<echarts.ECharts | null>(null); // 第二个图表实例

    // 3. 获取数据并渲染图表（核心逻辑）
    const getData = async () => {
        try {
            // 调用接口（替换Vue的.then为async/await，更符合React习惯）
            const res = await GolbalService.getOrderNodeAnalysis({ type: condition });
            console.log("GolbalService", res);

            // -------------------------- 图表1：订单状态饼图配置 --------------------------
            const option1: echarts.EChartsOption = {
                tooltip: { trigger: "item" },
                legend: { bottom: "0%", left: "center" },
                grid: { top: "5%" },
                title: {
                    text: "订单状态",
                    left: "center",
                    top: "45%",
                    textStyle: { fontSize: 16, color: "#454c5c", align: "center" },
                },
                series: [
                    {
                        name: "订单节点",
                        type: "pie",
                        radius: ["40%", "70%"],
                        label: {
                            alignTo: "edge",
                            formatter: "{name|{b}}\n{time|{c}}{per|（{d}%）}",
                            lineHeight: 15,
                            width: 120,
                            rich: {
                                time: { fontSize: 15, color: "#999", fontWeight: "bold" },
                                per: { fontSize: 12, color: "#000", fontWeight: "bold" },
                            },
                        },
                        labelLine: { length: 1, length2: 0, maxSurfaceAngle: 80 },
                        data: [
                            {
                                value: res.已签收,
                                name: "已签收",
                                itemStyle: { color: "rgb(25 211 46)" },
                                emphasis: { itemStyle: { color: "rgb(25 211 46)" } },
                            },
                            {
                                value: res.已提交,
                                name: "已提交",
                                itemStyle: { color: "rgb(115 160 250)" },
                                emphasis: { itemStyle: { color: "rgb(115 160 250)" } },
                            },
                            {
                                value: res.已配载,
                                name: "已配载",
                                itemStyle: { color: "rgb(89 194 117)" },
                                emphasis: { itemStyle: { color: "rgb(89 194 117)" } },
                            },
                            {
                                value: res.运输中,
                                name: "运输中",
                                itemStyle: { color: "rgb(102 187 196)" },
                                emphasis: { itemStyle: { color: "rgb(102 187 196)" } },
                            },
                        ] as EChartPieDataItem[],
                    },
                ],
            };

            // -------------------------- 图表2：签收状态饼图配置 --------------------------
            const option2: echarts.EChartsOption = {
                tooltip: { trigger: "item" },
                legend: { bottom: "0%", left: "center" },
                grid: { top: "5%" },
                color: ["rgb(253 164 84)", "rgb(25 211 46)", "rgb(242 204 85)", "rgb(232 80 80)"],
                title: {
                    text: "签收状态",
                    left: "center",
                    top: "45%",
                    textStyle: { fontSize: 16, color: "#454c5c", align: "center" },
                },
                series: [
                    {
                        name: "订单节点",
                        type: "pie",
                        radius: ["40%", "70%"],
                        label: {
                            alignTo: "edge",
                            formatter: "{name|{b}}\n{time|{c}}{per|（{d}%）}",
                            lineHeight: 15,
                            width: 120,
                            rich: {
                                time: { fontSize: 15, color: "#999", fontWeight: "bold" },
                                per: { fontSize: 12, color: "#000", fontWeight: "bold" },
                            },
                        },
                        labelLine: { length: 1, length2: 0, maxSurfaceAngle: 80 },
                        data: [
                            {
                                value: res.已拒收,
                                name: "已拒收",
                                itemStyle: { color: "#FF9800" },
                                emphasis: { itemStyle: { color: "#FF9800" } },
                            },
                            {
                                value: res.异常签收,
                                name: "异常签收",
                                itemStyle: { color: "#FF5722" },
                                emphasis: { itemStyle: { color: "#FF5722" } },
                            },
                            {
                                value: res.正常签收,
                                name: "正常签收",
                                itemStyle: { color: "#4CAF50" },
                                emphasis: { itemStyle: { color: "#4CAF50" } },
                            },
                            {
                                value: res.部分签收,
                                name: "部分签收",
                                itemStyle: { color: "#FFEB3B" },
                                emphasis: { itemStyle: { color: "#FFEB3B" } },
                            },
                        ] as EChartPieDataItem[],
                    },
                ],
            };

            // 渲染图表（需确保图表实例已初始化）
            if (myChart1Ref.current) myChart1Ref.current.setOption(option1);
            if (myChart2Ref.current) myChart2Ref.current.setOption(option2);
        } catch (error) {
            console.error("获取订单节点数据失败：", error);
        }
    };

    // 4. 生命周期处理（替代Vue的onMounted）
    useEffect(() => {
        // 初始化图表实例（组件挂载时执行）
        if (chart1Ref.current) myChart1Ref.current = echarts.init(chart1Ref.current);
        if (chart2Ref.current) myChart2Ref.current = echarts.init(chart2Ref.current);

        // 获取初始数据
        getData();

        // 组件卸载时销毁图表（避免内存泄漏）
        return () => {
            if (myChart1Ref.current) myChart1Ref.current.dispose();
            if (myChart2Ref.current) myChart2Ref.current.dispose();
        };
    }, []); // 空依赖：仅在组件挂载/卸载时执行

    // 5. 下拉框变化事件（替代Vue的@change）
    const handleSelectChange = (newValue: string) => {
        setCondition(newValue); // 更新选中的月份
        getData(); // 重新获取对应月份的数据
    };

    // 6. JSX渲染（替代Vue的template）
    return (
        <Compose
            className="financial-order-node-module"
            // Vue的slot转换为React的props传递（需确保Compose组件支持title/query props）
            title="订单节点统计"
            query={
                <div style={{ padding: "5px 20px" }}>
                    {/* 下拉选择框（假设使用Ant Design React的Select组件，需确保已安装） */}
                    <Select
                        value={condition}
                        style={{ width: 120 }}
                        onChange={handleSelectChange}
                        options={months} // 转换为React Select的options格式
                    />
                </div>
            }
        >
            {/* 图表容器（通过ref关联DOM） */}
            <div ref={chart1Ref} className="chart" style={{ height: "48%" }}></div>
            <div ref={chart2Ref} className="chart" style={{ height: "48%" }}></div>
        </Compose>
    );
};

export default FinancialOrderNode;
