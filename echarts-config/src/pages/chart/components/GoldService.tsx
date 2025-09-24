import React, { useCallback, useEffect, useState } from "react";
import { Select, Table } from "antd";
import dayjs from "dayjs";
import { GolbalService } from "@service/api/GolbalService";
import sortPng from "./v2_shmhtg.png";
import Compose from "./Compose";

// 定义表格数据接口
export interface DriverData {
    sort: number;
    司机: string;
    运单数: number;
    接货及时率: number;
    派送及时率: number;
    货损率: number;
    key: string; // React列表需要的唯一key
}

const TopDrivers: React.FC = () => {
    // 状态管理
    const [condition, setCondition] = useState<string>(dayjs().format("YYYY-MM"));
    const [type, setType] = useState<number>(1);
    const [modal, setModal] = useState<DriverData[]>([]);

    // 生成12个月数据
    const getMonths = useCallback(() => {
        return new Array(12).fill(null).map((_, index) => `${dayjs().format("YYYY")}-${(index + 1).toString().padStart(2, "0")}`);
    }, []);

    // 表格列定义
    const columns = [
        {
            title: "排名",
            dataIndex: "sort",
            key: "sort",
            align: "center" as const,
            width: 100,
            render: (_: null, record: DriverData, index: number) => {
                // 排名单元格渲染，前三名显示图标，其他显示数字
                return (
                    <div style={{ position: "relative", display: "inline-block", width: "100%", textAlign: "center" }}>
                        {index === 0 && (
                            <img
                                src={sortPng}
                                alt="第一名"
                                style={{
                                    width: "100px",
                                    position: "absolute",
                                    clipPath: "inset(0px 64px 0px 0px)", // 替代Vue的clip属性
                                    top: "-45px",
                                    left: "15px",
                                }}
                            />
                        )}
                        {index === 1 && (
                            <img
                                src={sortPng}
                                alt="第二名"
                                style={{
                                    width: "100px",
                                    position: "absolute",
                                    clipPath: "inset(0px 37px 0px 32px)",
                                    top: "-61px",
                                    left: "-17px",
                                }}
                            />
                        )}
                        {index === 2 && (
                            <img
                                src={sortPng}
                                alt="第三名"
                                style={{
                                    width: "100px",
                                    position: "absolute",
                                    clipPath: "inset(0px 0px 0px 63px)",
                                    top: "-61px",
                                    left: "-48px",
                                }}
                            />
                        )}
                        {![0, 1, 2].includes(index) && <span>{index + 1}</span>}
                    </div>
                );
            },
        },
        {
            title: "司机",
            dataIndex: "司机",
            key: "司机",
        },
        {
            title: "运单数",
            dataIndex: "运单数",
            key: "运单数",
        },
        {
            title: "提货及时率",
            key: "接货及时率",
            dataIndex: "接货及时率",
            render: (value: number) => <span>{value}%</span>,
        },
        {
            title: "派送及时率",
            key: "派送及时率",
            dataIndex: "派送及时率",
            render: (value: number) => <span>{value}%</span>,
        },
        {
            title: "货损率",
            key: "货损率",
            dataIndex: "货损率",
            render: (value: number) => <span>{value}%</span>,
        },
    ];

    // 获取数据
    const getData = useCallback(async () => {
        try {
            const res = await GolbalService.getTopDriverAnalysis({
                type,
                yearOfMonth: condition,
            });

            // 为数据添加key属性，符合React要求
            const formattedData = res.map((item, index) => ({
                ...item,
                key: `driver-${index}`,
                sort: index + 1,
            }));

            setModal(formattedData);
        } catch (error) {
            console.error("获取金牌服务数据失败：", error);
        }
    }, [type, condition]);

    // 组件挂载时获取数据
    useEffect(() => {
        getData();
    }, [getData]);

    // 处理下拉框变化
    const handleTypeChange = (value: number) => {
        setType(value);
    };

    const handleConditionChange = (value: string) => {
        setCondition(value);
    };

    return (
        <Compose
            className="gold-service-module"
            title="金牌服务"
            query={
                <div style={{ padding: "5px 20px" }}>
                    <Select
                        value={type}
                        style={{ width: 120 }}
                        onChange={handleTypeChange}
                        options={[
                            { value: 1, label: "运单数" },
                            { value: 2, label: "接货及时率" },
                            { value: 3, label: "派送及时率" },
                            { value: 4, label: "货损率" },
                            { value: 5, label: "运单数" },
                        ]}
                    />
                    <span style={{ margin: "0 8px" }}>&emsp;</span>
                    <Select
                        value={condition}
                        style={{ width: 120 }}
                        onChange={handleConditionChange}
                        options={getMonths().map((item) => ({
                            key: item,
                            value: item,
                            label: item,
                        }))}
                    />
                </div>
            }
        >
            <div style={{ padding: "0 20px 20px" }}>
                <Table columns={columns} dataSource={modal} pagination={false} />
            </div>
        </Compose>
    );
};

export default TopDrivers;
