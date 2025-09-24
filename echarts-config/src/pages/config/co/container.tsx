import { useContext, useMemo, useState } from "react";
import { Checkbox, Radio, type RadioChangeEvent, Tag } from "antd";
import { RenderBy } from "./only-render";
import { RenderField } from "./value-rander";
import type { EchartsNodeType, EchartsTreeState } from "../config";

interface ContainerProps {
    field: EchartsTreeState;
    parentkey: string;
    cyclicKey: string;
}

export const filterFalseValue = (name) => {
    return name !== null && name !== undefined && name !== "";
};

export function Container(props: ContainerProps) {
    const { field, parentkey, cyclicKey } = props;
    const { descendant = [], level, isLeaf, options } = field;

    // 值类型
    const [valueType, setValueType] = useState<keyof typeof EchartsNodeType>(() => {
        if (field.propTypes?.length === 1) {
            return field.propTypes[0];
        }
        return null;
    });
    const [optionValue, setOptionValue] = useState(undefined);
    // 值
    const [value, setValue] = useState(); // valueType

    const optionsWithDisabled = field.propTypes?.map((item) => ({ label: item, value: item }));

    const onChange = (event: RadioChangeEvent) => {
        const valueType = event.target.value;
        setValueType(valueType);
    };

    return (
        <div className="ec-value-container">
            <RenderBy when={filterFalseValue(field.defaultValue)}>
                <div className="ec-row ec-default-value">
                    <span>默认值:</span>
                    <Tag color="cyan" style={{ borderRadius: 2 }}>
                        {field.defaultValue}
                    </Tag>
                </div>
            </RenderBy>
            <RenderBy when={isLeaf}>
                <div className="ec-row ec-value-type">
                    <span>值类型:</span>
                    <Radio.Group onChange={onChange} options={optionsWithDisabled} value={valueType}></Radio.Group>
                </div>
            </RenderBy>
            <RenderBy when={!!options?.length}>
                <div className="ec-row ec-options">
                    <span>选项:</span>
                    <Radio.Group
                        options={options?.map((item) => ({ label: item.key, value: item.key }))}
                        value={optionValue}
                        onChange={(event) => {
                            setOptionValue(event.target.value);
                        }}
                    />
                </div>
            </RenderBy>
            <RenderBy when={valueType && !options?.length}>
                <div className="ec-row ec-value">
                    <span>值:</span>
                    <RenderField type={valueType}></RenderField>
                </div>
            </RenderBy>
        </div>
    );
}
