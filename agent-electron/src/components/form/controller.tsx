import { Input, InputNumber, Select, Switch } from "antd";
import type { PropsWithChildren } from "react";
import { CollectionType, type SceneryProps } from "./collection";

function Controller(props: PropsWithChildren<SceneryProps>) {
    switch (props.port) {
        case CollectionType.INPUT: {
            const { value, onChange, washLight } = props;
            return (
                <Input
                    size="small"
                    value={value}
                    onChange={(event) => {
                        onChange?.(event.target.value);
                    }}
                    {...washLight}
                ></Input>
            );
        }

        case CollectionType.NUMBER: {
            const { value, onChange, washLight } = props;
            return (
                <InputNumber
                    size="small"
                    value={value}
                    onChange={(nextValue: number | null) => {
                        onChange?.(nextValue);
                    }}
                    style={{ width: "100%" }}
                    {...washLight}
                />
            );
        }
        case CollectionType.SELECT: {
            const { value, onChange, washLight } = props;
            return (
                <Select
                    size="small"
                    value={value}
                    onChange={(nextValue) => {
                        onChange?.(nextValue);
                    }}
                    style={{ width: "100%" }}
                    options={[]}
                    {...washLight}
                />
            );
        }
        case CollectionType.SWITCH: {
            const { value, onChange, washLight } = props;
            return (
                <Switch
                    size="small"
                    value={value}
                    onChange={(checked) => {
                        onChange?.(checked);
                    }}
                    style={{ width: "100%" }}
                    {...washLight}
                />
            );
        }
        case CollectionType.CUSTOM:
            return props.children;
    }
}

export default Controller;
