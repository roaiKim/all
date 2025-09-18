import React, { useEffect, useRef } from "react";
import * as echarts from "echarts"; // 引入ECharts（需确保项目已安装）
// 引入API服务
import { GolbalService } from "@service/api/GolbalService";
import Compose from "./Compose"; // 复用React版Compose组件

// 类型定义：适配接口返回数据结构
export interface OperateAnalysisItem {
    hour: string | number; // 小时（如"08"、"09"）
    待提货: number;
    待派送: number;
}

const Analyze: React.FC = () => {
    // 1. 图表DOM引用：替代Vue的ref(null)
    const chartRef = useRef<HTMLDivElement>(null);
    // 2. 图表实例存储：避免重复初始化
    const chartInstanceRef = useRef<echarts.ECharts | null>(null);

    // 3. 数据请求与图表渲染逻辑
    const getDataAndRenderChart = () => {
        GolbalService.getTodayOperateAnalysis().then((res: OperateAnalysisItem[]) => {
            console.log("今日运营分析数据:", res);
            // 处理接口返回数据，提取x轴（小时）和y轴（待提货/待派送）数据
            const xAxisData = res?.map((item) => item.hour) || [];
            const yAxisPendingPick = res?.map((item) => item.待提货) || [];
            const yAxisPendingDeliver = res?.map((item) => item.待派送) || [];

            // 初始化图表实例（仅首次渲染时初始化）
            if (!chartInstanceRef.current && chartRef.current) {
                chartInstanceRef.current = echarts.init(chartRef.current);
                // 监听窗口 resize，自动适配图表尺寸
                window.addEventListener("resize", () => {
                    chartInstanceRef.current?.resize();
                });
            }

            // 配置ECharts选项（与Vue原配置完全一致）
            const chartOption: echarts.EChartsOption = {
                title: { text: "" },
                tooltip: { trigger: "axis" },
                legend: { data: ["提货", "派送"], top: 1 },
                grid: {
                    left: "1%",
                    right: "2%",
                    bottom: "3%",
                    top: 45,
                    containLabel: true,
                },
                toolbox: {
                    feature: { saveAsImage: {} }, // 保存为图片功能
                },
                xAxis: {
                    type: "category",
                    boundaryGap: false,
                    data: xAxisData,
                },
                yAxis: { type: "value" },
                series: [
                    {
                        name: "提货",
                        type: "line",
                        data: yAxisPendingPick,
                    },
                    {
                        name: "派送",
                        type: "line",
                        data: yAxisPendingDeliver,
                    },
                ],
            };

            // 设置图表选项（更新图表数据）
            chartInstanceRef.current?.setOption(chartOption);
        });
    };

    // 4. 组件挂载时初始化图表：替代Vue的onMounted
    useEffect(() => {
        getDataAndRenderChart();

        // 组件卸载时清理：销毁图表实例+移除resize监听
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.dispose();
                chartInstanceRef.current = null;
            }
            window.removeEventListener("resize", () => {
                chartInstanceRef.current?.resize();
            });
        };
    }, []); // 空依赖数组=仅挂载时执行

    // 5. JSX渲染：对应Vue模板
    return (
        <Compose className="analyze-module" title="今日运营分析" query={<div style={{ padding: "5px 20px" }}>单位：票</div>}>
            <div ref={chartRef} className="chart" style={{ padding: "0 20px 20px" }}></div>
        </Compose>
    );
};

export default Analyze;
