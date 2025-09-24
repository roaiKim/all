import React, { useCallback, useEffect, useRef, useState } from "react";
import { Select } from "antd"; // 假设使用Ant Design React的Select组件
import dayjs from "dayjs";
import * as echarts from "echarts";
import { GolbalService } from "@service/api/GolbalService";
import Compose from "./Compose"; // 需确保Compose已转为React组件

// 定义接口：接口返回的网货业务数据结构
export interface OftAnalysisResponse {
    已签收数: number;
    未签收数: number;
    已开票金额: number;
    未开票金额: number;
    网货服务商?: number; // 用于控制组件显示
}

// 定义接口：ECharts饼图数据项结构
interface EChartPieItem {
    value: number;
    name: string;
    itemStyle: { color: string };
    emphasis: { itemStyle: { color: string } };
}

const OftBusinessStat: React.FC = () => {
    // 1. 状态管理（替代Vue的ref/reactive）
    // 控制组件整体显示/隐藏
    const [showOft, setShowOft] = useState<boolean>(false);
    // 月份下拉数据（生成当前年份12个月，格式：YYYY-MM）
    const months = useCallback(
        () => new Array(12).fill(null).map((_, index) => `${dayjs().format("YYYY")}-${(index + 1).toString().padStart(2, "0")}`),
        []
    );
    // 两个下拉框的选中值（运单统计月份、开票统计月份）
    const [condition, setCondition] = useState<string>(dayjs().format("YYYY-MM"));
    const [condition1, setCondition1] = useState<string>(dayjs().format("YYYY-MM"));

    // 2. DOM与实例引用（替代Vue的ref）
    const chart1Ref = useRef<HTMLDivElement>(null); // 运单统计图表容器
    const chart2Ref = useRef<HTMLDivElement>(null); // 开票统计图表容器
    const myChart1Ref = useRef<echarts.ECharts | null>(null); // 运单图表实例
    const myChart2Ref = useRef<echarts.ECharts | null>(null); // 开票图表实例
    // 定时器引用（用于图表resize延迟执行，避免内存泄漏）
    const timerRef = useRef<{ one: number | null; two: number | null }>({
        one: null,
        two: null,
    });

    // 3. 运单统计数据获取与图表渲染
    const getData = useCallback(async () => {
        try {
            const res = await GolbalService.oftAnalysis({ yearOfMonth: condition });
            // 当网货服务商数据存在且大于0时，显示组件
            if ((res["网货服务商"] || 0) > 0) setShowOft(true);

            // 运单统计图表配置
            const option1: echarts.EChartsOption = {
                tooltip: { trigger: "item" },
                legend: { bottom: "0%", left: "center" },
                grid: { top: "5%" },
                title: {
                    text: "运单统计",
                    left: "center",
                    top: "45%",
                    textStyle: { fontSize: 16, color: "#454c5c", align: "center" },
                },
                series: [
                    {
                        name: "运单统计",
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
                                value: res.已签收数,
                                name: "已签收数",
                                itemStyle: { color: "#FFEB3B" },
                                emphasis: { itemStyle: { color: "#FFEB3B" } },
                            },
                            {
                                value: res.未签收数,
                                name: "待签收数",
                                itemStyle: { color: "#FF9800" },
                                emphasis: { itemStyle: { color: "#FF9800" } },
                            },
                        ] as EChartPieItem[],
                    },
                ],
            };

            // 渲染图表并延迟执行resize（确保图表自适应）
            if (myChart1Ref.current) {
                myChart1Ref.current.setOption(option1);
                // 清除之前的定时器，避免重复执行
                if (timerRef.current.one) clearTimeout(timerRef.current.one);
                timerRef.current.one = setTimeout(() => myChart1Ref.current?.resize(), 100);
            }
        } catch (error) {
            console.error("获取运单统计数据失败：", error);
        }
    }, [condition]); // 依赖condition：选中月份变化时重新执行

    // 4. 开票统计数据获取与图表渲染
    const getData1 = useCallback(async () => {
        try {
            const res = await GolbalService.oftAnalysis({ yearOfMonth: condition1 });
            // 当网货服务商数据存在且大于0时，显示组件
            if ((res["网货服务商"] || 0) > 0) setShowOft(true);

            // 开票统计图表配置
            const option2: echarts.EChartsOption = {
                tooltip: { trigger: "item" },
                legend: { bottom: "0%", left: "center" },
                grid: { top: "5%" },
                title: {
                    text: "开票统计",
                    left: "center",
                    top: "45%",
                    textStyle: { fontSize: 16, color: "#454c5c", align: "center" },
                },
                series: [
                    {
                        name: "开票统计",
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
                                value: res.已开票金额,
                                name: "已开票金额",
                                itemStyle: { color: "rgb(115 160 250)" },
                                emphasis: { itemStyle: { color: "rgb(115 160 250)" } },
                            },
                            {
                                value: res.未开票金额,
                                name: "待开票金额",
                                itemStyle: { color: "rgb(89 194 117)" },
                                emphasis: { itemStyle: { color: "rgb(89 194 117)" } },
                            },
                        ] as EChartPieItem[],
                    },
                ],
            };

            // 渲染图表并延迟执行resize
            if (myChart2Ref.current) {
                myChart2Ref.current.setOption(option2);
                // 清除之前的定时器，避免重复执行
                if (timerRef.current.two) clearTimeout(timerRef.current.two);
                timerRef.current.two = setTimeout(() => myChart2Ref.current?.resize(), 100);
            }
        } catch (error) {
            console.error("获取开票统计数据失败：", error);
        }
    }, [condition1]); // 依赖condition1：选中月份变化时重新执行

    // 5. 生命周期处理（替代Vue的onMounted）
    useEffect(() => {
        // 初始化ECharts实例
        if (chart1Ref.current) myChart1Ref.current = echarts.init(chart1Ref.current);
        if (chart2Ref.current) myChart2Ref.current = echarts.init(chart2Ref.current);

        // 初始加载数据
        getData();
        getData1();

        // 组件卸载时的清理工作（避免内存泄漏）
        return () => {
            // 销毁图表实例
            if (myChart1Ref.current) myChart1Ref.current.dispose();
            if (myChart2Ref.current) myChart2Ref.current.dispose();
            // 清除定时器
            if (timerRef.current.one) clearTimeout(timerRef.current.one);
            if (timerRef.current.two) clearTimeout(timerRef.current.two);
        };
    }, [getData, getData1]); // 依赖getData和getData1：确保函数引用稳定

    // 6. 下拉框变化事件处理
    // 运单统计下拉框变化
    const handleConditionChange = (newValue: string) => {
        setCondition(newValue);
    };
    // 开票统计下拉框变化
    const handleCondition1Change = (newValue: string) => {
        setCondition1(newValue);
    };

    // 7. JSX渲染（替代Vue的template）
    return (
        // 控制组件整体显示/隐藏（对应Vue的:style="{display: showOft ? 'block' : 'none'}"）
        <div style={{ display: showOft ? "block" : "none" }}>
            <Compose
                className="oft-module"
                // Vue的slot转为React的props传递
                title="网货业务统计"
                // 传递查询区域样式（对应Vue的queryStyle="flex-grow: 1"）
                queryStyle={{ flexGrow: 1 }}
                // 查询区域内容（对应Vue的v-slot:query）
                query={
                    <div style={{ padding: "5px 20px", display: "flex", justifyContent: "space-between" }}>
                        {/* 运单统计下拉框 */}
                        <Select
                            value={condition}
                            style={{ width: 120 }}
                            onChange={handleConditionChange}
                            options={months().map((item) => ({ value: item, label: item }))}
                            placeholder="选择月份"
                        />
                        {/* 开票统计下拉框 */}
                        <Select
                            value={condition1}
                            style={{ width: 120 }}
                            onChange={handleCondition1Change}
                            options={months().map((item) => ({ value: item, label: item }))}
                            placeholder="选择月份"
                        />
                    </div>
                }
            >
                {/* 图表容器（flex布局，对应Vue的display: flex） */}
                <div style={{ display: "flex" }}>
                    <div ref={chart1Ref} className="chart"></div>
                    <div ref={chart2Ref} className="chart"></div>
                </div>
            </Compose>
        </div>
    );
};

export default OftBusinessStat;
