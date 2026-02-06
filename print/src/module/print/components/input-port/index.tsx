import { Input, InputNumber, type InputNumberProps, type InputProps, type SelectProps, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Controller from "./controller";
import "./index.less";

export enum MicrophoneType {
    NUMBER = "NUMBER",
    SELECT = "SELECT",
    INPUT = "INPUT",
}

type RemoveDefaultController<T> = Omit<T, "value" | "onChange">;

type ScenerWashLight = RemoveDefaultController<InputNumberProps> | RemoveDefaultController<InputProps> | RemoveDefaultController<SelectProps>;

export type ValueType = string | number;

export interface SceneryProps<T> {
    port: MicrophoneType | keyof typeof MicrophoneType;
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

export function Scenery<T extends ValueType = ValueType>(props: SceneryProps<T>) {
    const { port, value, label, onChange, washLight = {}, description, powered = true } = props;
    if (!powered) {
        return null;
    }

    return (
        <div className={`scenery-row ${description ? "scenery-row-description" : ""}`}>
            <div>{label}：</div>
            <div>
                <Controller port={port} value={value} onChange={onChange} {...washLight} />
            </div>
            {description && (
                <Tooltip placement="left" title={description}>
                    <QuestionCircleOutlined style={{ fontSize: 13 }} />
                </Tooltip>
            )}
        </div>
    );
}
