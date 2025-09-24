import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Select, Table } from "antd";
import dayjs from "dayjs";
import { GolbalService } from "@service/api/GolbalService";
import sortPng from "./v2_shmhtg.png";
import Compose from "./Compose";

// 定义数据接口
interface ClientData {
    货主公司: string;
    运费统计: number | string;
    货量: number | string;
    订单数: number | string;
    key: string; // React列表渲染需要的唯一key
}

const TopClients: React.FC = () => {
    // 状态管理
    const [type, setType] = useState<number>(1);
    const [condition, setCondition] = useState<string>(dayjs().format("YYYY-MM"));
    const [modal, setModal] = useState<ClientData[]>([]);

    // 生成月份数据
    const months = useMemo(() => {
        return Array(12)
            .fill(null)
            .map((_, index) => {
                const month = index + 1;
                const value = `${dayjs().format("YYYY")}-${month < 10 ? `0${month}` : month}`;
                return { value, label: value };
            });
    }, []);

    // 表格列配置
    const columns = [
        {
            title: "排名",
            dataIndex: "sort",
            key: "sort",
            align: "center" as const,
            width: 100,
            render: (_: any, __: any, index: number) => (
                <div style={{ position: "relative" }}>
                    {index === 0 && (
                        <img
                            src={sortPng}
                            alt="第一名"
                            style={{
                                width: "100px",
                                position: "absolute",
                                clip: "rect(0px, 36px, 60px, 0px)",
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
                                clip: "rect(0px, 63px, 74px, 32px)",
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
                                clip: "rect(0px, 95px, 75px, 63px)",
                                top: "-61px",
                                left: "-48px",
                            }}
                        />
                    )}
                    {![0, 1, 2].includes(index) && <span>{index + 1}</span>}
                </div>
            ),
        },
        {
            title: "货主公司",
            dataIndex: "货主公司",
            key: "货主公司",
        },
        {
            title: "运费统计",
            dataIndex: "运费统计",
            key: "运费统计",
        },
        {
            title: "货量",
            key: "货量",
            dataIndex: "货量",
        },
        {
            title: "订单数",
            key: "订单数",
            dataIndex: "订单数",
        },
    ];

    // 获取数据
    const getData = useCallback(async () => {
        try {
            const res = await GolbalService.getTopClientAnalysis({
                type,
                yearOfMonth: condition,
            });

            // 为数据添加唯一key
            const formattedData = (res as any[]).map((item, index) => ({
                ...item,
                key: `client-${index}`,
            }));

            setModal(formattedData);
        } catch (error) {
            console.error("获取实力货主数据失败：", error);
        }
    }, [type, condition]);

    // 组件挂载时获取数据
    useEffect(() => {
        getData();
    }, [getData]);

    // 处理类型选择变化
    const handleTypeChange = (value: number) => {
        setType(value);
    };

    // 处理月份选择变化
    const handleConditionChange = (value: string) => {
        setCondition(value);
    };

    return (
        <Compose
            className="strong-cargo-owner-module"
            title="实力货主"
            query={
                <div style={{ padding: "5px 20px" }}>
                    <Select
                        value={type}
                        style={{ width: 120, marginRight: 8 }}
                        onChange={handleTypeChange}
                        options={[
                            { value: 1, label: "运费" },
                            { value: 2, label: "货量" },
                            { value: 3, label: "订单" },
                        ]}
                    />
                    <Select value={condition} style={{ width: 120 }} onChange={handleConditionChange} options={months} />
                </div>
            }
        >
            <div style={{ padding: "0 20px 20px" }}>
                <Table columns={columns} dataSource={modal} pagination={false} />
            </div>
        </Compose>
    );
};

export default TopClients;
