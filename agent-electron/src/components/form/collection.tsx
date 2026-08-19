import { type InputNumberProps, type InputProps, type SelectProps, type SwitchProps, Tooltip } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import type { PropsWithChildren } from "react";
import Controller from "./controller";
import "./index.less";

export enum CollectionType {
    NUMBER = "NUMBER",
    SELECT = "SELECT",
    INPUT = "INPUT",
    SWITCH = "SWITCH",
    CUSTOM = "CUSTOM",
}

type RemoveDefaultController<T> = Omit<T, "value" | "onChange">;

export type ValueType = string | number | boolean;

type CommonSceneryProps = {
    label: string | React.ReactNode;
    description?: string;
    powered?: boolean;
};

type ValueByPort = {
    [CollectionType.INPUT]: string;
    [CollectionType.NUMBER]: number | null;
    [CollectionType.SELECT]: ValueType;
    [CollectionType.SWITCH]: boolean;
    [CollectionType.CUSTOM]: ValueType;
};

type WashLightByPort = {
    [CollectionType.INPUT]: RemoveDefaultController<InputProps>;
    [CollectionType.NUMBER]: RemoveDefaultController<InputNumberProps>;
    [CollectionType.SELECT]: RemoveDefaultController<SelectProps>;
    [CollectionType.SWITCH]: RemoveDefaultController<SwitchProps>;
    [CollectionType.CUSTOM]: Record<string, never>;
};

type SceneryPropsByPort<P extends CollectionType> = CommonSceneryProps & {
    port: P;
    value?: ValueByPort[P];
    onChange?: (value: ValueByPort[P]) => void;
    washLight?: WashLightByPort[P];
};

export type SceneryProps = {
    [P in CollectionType]: SceneryPropsByPort<P>;
}[CollectionType];

type SelectSceneryProps<T extends ValueType> = Omit<SceneryPropsByPort<CollectionType.SELECT>, "value" | "onChange"> & {
    value?: T;
    onChange?: (value: T) => void;
};

export function Collection<T extends ValueType>(props: PropsWithChildren<SelectSceneryProps<T>>): React.ReactElement | null;
export function Collection<P extends CollectionType>(props: PropsWithChildren<SceneryPropsByPort<P>>): React.ReactElement | null;
export function Collection(props: PropsWithChildren<SceneryProps>) {
    const { label, description, powered = true } = props;
    if (!powered) {
        return null;
    }

    return (
        <div className={`scenery-row ${description ? "scenery-row-description" : ""}`}>
            <div>{label}：</div>
            <div>
                <Controller {...props} />
            </div>
            {description && (
                <Tooltip placement="left" title={description}>
                    <QuestionCircleOutlined style={{ fontSize: 13 }} />
                </Tooltip>
            )}
        </div>
    );
}
