import { useContext, useMemo, useState } from "react";
import { Checkbox, Radio, RadioChangeEvent, Tag } from "antd";
import { EchartsTreeState } from "../config";

import { expandPathContext } from "..";

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
    // const { expandPath = [], calcPath } = useContext(expandPathContext);
    const [valueType, setValueType] = useState(() => {
        if (field.propTypes?.length === 1) {
            return field.propTypes[0];
        }
        return null;
    }); // valueType
    const [value, setValue] = useState(); // valueType

    const optionsWithDisabled = field.propTypes?.map((item) => ({ label: item, value: item }));

    const onChange = (event: RadioChangeEvent) => {
        const valueType = event.target.value;
        setValueType(valueType);
    };

    return (
        <div className="ec-value-container">
            {filterFalseValue(field.defaultValue) && (
                <div className="ec-default-value">
                    <span>defalutValue:</span>
                    <Tag color="cyan" style={{ borderRadius: 2 }}>
                        {field.defaultValue}
                    </Tag>
                </div>
            )}
            {isLeaf && (
                <div className="ec-value-type">
                    <span>valueType:</span>
                    <Radio.Group onChange={onChange} options={optionsWithDisabled} value={valueType}></Radio.Group>
                </div>
            )}
            {!!options?.length && (
                <div className="ec-options">
                    <span>options:</span>
                    <Radio.Group>
                        {options?.map((item) => (
                            <Radio.Button key={item.key} value={item.key}>
                                {item.key}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                </div>
            )}
        </div>
    );
}
