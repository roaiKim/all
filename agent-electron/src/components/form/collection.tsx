import { Input, InputNumber, type InputNumberProps, type InputProps, type SelectProps, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import type { PropsWithChildren } from "react";
import Controller from "./controller";
import "./index.less";

export enum CollectionType {
    NUMBER = "NUMBER",
    SELECT = "SELECT",
    INPUT = "INPUT",
    CUSTOM = "CUSTOM",
}

type RemoveDefaultController<T> = Omit<T, "value" | "onChange">;

type ScenerWashLight = RemoveDefaultController<InputNumberProps> | RemoveDefaultController<InputProps> | RemoveDefaultController<SelectProps>;

export type ValueType = string | number;

export interface SceneryProps<T> {
    port: CollectionType | keyof typeof CollectionType;
    value: T;
    label: string | React.ReactNode;
    onChange: (value: T) => void;
    /**
     * form 表单控件的原始参数
     */
    washLight?: ScenerWashLight;
    description?: string;
    /**
     * 是否显示
     */
    powered?: boolean;
}

export function Collection<T extends ValueType = ValueType>(props: PropsWithChildren<SceneryProps<T>>) {
    const { port, value, label, onChange, washLight = {}, description, powered = true, children } = props;
    if (!powered) {
        return null;
    }

    return (
        <div className={`scenery-row ${description ? "scenery-row-description" : ""}`}>
            <div>{label}：</div>
            <div>
                <Controller port={port} value={value} onChange={onChange} {...washLight}>
                    {children}
                </Controller>
            </div>
            {description && (
                <Tooltip placement="left" title={description}>
                    <QuestionCircleOutlined style={{ fontSize: 13 }} />
                </Tooltip>
            )}
        </div>
    );
}
