import { Tag } from "antd";
import moment from "moment";
import React, { PropsWithChildren } from "react";

interface StatusTag {
    key: number | string;
    value: string;
    color: string;
}

interface BaseInfo {
    status: number | string;
    createTime: number;
    createUserName: string;
    updateTime: number;
    updateUserName: string;
}

interface PageModalHeaderProps {
    statusTag: StatusTag[];
    baseInfo: BaseInfo;
}

const FIELDS_MAP = {
    status: "当前状态",
    createUserName: "创建人",
    createTime: "创建时间",
    updateUserName: "更新人",
    updateTime: "更新时间",
};

export function PageModalHeader(props: PropsWithChildren<PageModalHeaderProps>) {
    const { statusTag, baseInfo, children } = props;

    return (
        <div className="ro-modal-title">
            {Object.keys(FIELDS_MAP)
                .map((item) => {
                    if (baseInfo[item]) {
                        const value = baseInfo[item];
                        const field = FIELDS_MAP[item];
                        let labelValue = value;
                        const { value: tagValue, color } = statusTag.find((item) => item.key === value) || {};
                        if (typeof value === "number") {
                            if (value < 100) {
                                labelValue = tagValue ? <Tag color={color || "#108ee9"}>{tagValue}</Tag> : null;
                            } else {
                                labelValue = moment(value).format("YYYY-MM-DD HH:mm:ss");
                            }
                        }
                        return labelValue ? (
                            <div key={item}>
                                <label>{field}：</label> <div>{labelValue}</div>
                            </div>
                        ) : null;
                    }
                    return null;
                })
                .filter(Boolean)}
            {children}
        </div>
    );
}
