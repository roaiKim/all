import React, { useCallback, useEffect, useState } from "react";
import { Empty, Select, Table } from "antd"; // Ant Design React 组件
import dayjs from "dayjs";
import { GolbalService } from "@service/api/GolbalService";
import sortPng from "./v2_shmhtg.png";
import Compose from "./Compose"; // 需确保 Compose 已转为 React 组件

// 定义接口：接口返回的质量异常数据结构（从 Vue 响应数据提取）
export interface QualityAbnormalItem {
    id: string | number;
    transportOrderNumber: string; // 订单号
    transportOrder?: { clientName: string }; // 嵌套的客户名称
    clientName?: string; // 客户名称（可能从 transportOrder 提取）
    exceptionNodeName: string; // 异常环节
    exceptionTypeName: string; // 异常类型
    remark: string; // 备注
    createUserName: string; // 提交人
    createTime: string; // 提交时间（时间戳或字符串）
    [key: string]: any; // 兼容其他未定义字段
}

// 定义接口：表格列配置类型
type TableColumnType = Parameters<typeof Table>[0]["columns"];

const QualityAbnormal: React.FC = () => {
    // 1. 状态管理（替代 Vue 的 ref）
    // 月份下拉数据（生成当前年份 12 个月，格式：YYYY-MM）
    const months = useCallback(
        () => new Array(12).fill(null).map((_, index) => `${dayjs().format("YYYY")}-${(index + 1).toString().padStart(2, "0")}`),
        []
    );
    // 选中的月份条件（默认当前月）
    const [condition, setCondition] = useState<string>(dayjs().format("YYYY-MM"));
    // 表格数据源（质量异常列表）
    const [modal, setModal] = useState<QualityAbnormalItem[]>([]);

    // 2. 表格列配置（对应 Vue 的 columns，使用 React 表格的 render 实现自定义单元格）
    const columns: TableColumnType = [
        {
            title: "订单号",
            dataIndex: "transportOrderNumber",
            key: "transportOrderNumber",
            width: 150,
        },
        {
            title: "客户名称",
            dataIndex: "clientName",
            key: "clientName",
            width: 150,
        },
        {
            title: "异常环节",
            dataIndex: "exceptionNodeName",
            key: "exceptionNodeName",
            width: 120,
        },
        {
            title: "异常类型",
            dataIndex: "exceptionTypeName",
            key: "exceptionTypeName",
            width: 120,
        },
        {
            title: "备注",
            dataIndex: "remark",
            key: "remark",
            width: 160,
            // 超出部分省略显示
            render: (text: string) => <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{text}</div>,
        },
        {
            title: "提交人",
            dataIndex: "createUserName",
            key: "createUserName",
            width: 120,
        },
        {
            title: "提交时间",
            dataIndex: "createTime",
            key: "createTime",
            width: 180,
            // 时间格式化（对应 Vue 的 dayjs 处理）
            render: (time: string) => (time ? dayjs(time).format("YYYY-MM-DD HH:mm") : "-"),
        },
        // {
        //     title: "",
        //     dataIndex: "id",
        //     key: "id",
        //     // 时间格式化（对应 Vue 的 dayjs 处理）
        //     render: (time: string) => " ",
        // },
    ];

    // 3. 获取质量异常数据（对应 Vue 的 getData）
    const getData = useCallback(async () => {
        try {
            // 构造接口参数（与 Vue 逻辑完全一致）
            const params = {
                offset: 0,
                limit: 20,
                pageNo: 1,
                pageSize: 20,
                selectColumns: [
                    "id",
                    "transportOrderNumber",
                    "transportOrder.clientName",
                    "transportOrder.projectName",
                    "exceptionNumber",
                    "emergencyProcessingStatus",
                    "exceptionNodeName",
                    "exceptionTypeName",
                    "exceptionLevel",
                    "updateUserName",
                    "updateTime",
                    "createUserName",
                    "createTime",
                    "emergencyProcessingRemark",
                    "remark",
                    "*",
                ],
                // 条件筛选：当月时间范围（开始到结束）
                conditionBodies: condition
                    ? [
                          {
                              conditions: [
                                  {
                                      property: "createTime",
                                      values: [`${dayjs(condition, "YYYY-MM").startOf("month").format("YYYY-MM-DD")} 00:00:00`],
                                      type: "GREATER_THAN_OR_EQUAL",
                                  },
                              ],
                          },
                          {
                              conditions: [
                                  {
                                      property: "createTime",
                                      values: [`${dayjs(condition, "YYYY-MM").endOf("month").format("YYYY-MM-DD")} 23:59:59`],
                                      type: "LESS_THAN_OR_EQUAL",
                                  },
                              ],
                          },
                      ]
                    : [],
                orders: [{ orderBy: "createTime", ascending: false }], // 按提交时间倒序
            };

            // 调用接口（替换 Vue 的 .then 为 async/await）
            const res = await GolbalService.getAbnormalQuality(params);
            console.log("GolbalService", res);

            // 处理数据：从 transportOrder 提取 clientName（与 Vue 逻辑一致）
            const formattedData =
                res?.data?.map((item: QualityAbnormalItem) => ({
                    ...item,
                    clientName: item?.transportOrder?.clientName || item.clientName || "-", // 兜底处理
                    key: item.id, // React 表格需唯一 key（用 id 作为 key）
                })) || [];

            setModal(formattedData);
        } catch (error) {
            console.error("获取质量异常数据失败：", error);
            setModal([]); // 错误时清空数据
        }
    }, [condition]); // 依赖 condition：月份变化时重新请求

    // 4. 生命周期处理（对应 Vue 的 onMounted）
    useEffect(() => {
        // 组件挂载时获取初始数据
        getData();
    }, [getData]); // 依赖 getData：确保函数引用稳定

    // 5. 下拉框变化事件（对应 Vue 的 @change）
    const handleConditionChange = (newValue: string) => {
        setCondition(newValue); // 更新选中月份
    };

    // 6. JSX 渲染（替代 Vue 的 template）
    return (
        <Compose
            className="abnormal-quality-module"
            // Vue 的 slot 转为 React 的 props 传递
            title="质量异常"
            // 查询区域（对应 Vue 的 v-slot:query）
            query={
                <div style={{ padding: "5px 20px" }}>
                    <Select
                        value={condition}
                        style={{ width: 120 }}
                        onChange={handleConditionChange}
                        options={months().map((item) => ({ value: item, label: item }))} // 月份选项
                        placeholder="选择月份"
                    />
                </div>
            }
        >
            {/* 表格容器（对应 Vue 的 a-table） */}
            <div style={{ padding: "0 20px 20px" }}>
                <Table
                    columns={columns}
                    dataSource={modal}
                    pagination={false} // 关闭分页（与 Vue 一致）
                    rowKey="id" // 唯一行 key（避免警告）
                    // 表格样式优化（可选，与原 Vue 视觉一致）
                    // style={{ border: "1px solid #f0f0f0" }}
                />
            </div>
        </Compose>
    );
};

export default QualityAbnormal;
