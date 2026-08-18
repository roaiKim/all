import { Input, InputNumber, Select } from "antd";
import type { PropsWithChildren } from "react";
import { CollectionType, type SceneryProps, type ValueType } from "./collection";

interface ControllerProps extends Pick<SceneryProps<ValueType>, "value" | "port" | "washLight" | "onChange"> {
    name?: string;
}

function Controller(props: PropsWithChildren<ControllerProps>) {
    const { port, value, onChange, children, ...washLight } = props;

    switch (port) {
        case CollectionType.INPUT:
            return (
                <Input
                    size="small"
                    value={value}
                    onChange={(event) => {
                        onChange(event.target.value);
                    }}
                    {...washLight}
                ></Input>
            );

        case CollectionType.NUMBER:
            return <InputNumber size="small" value={value} onChange={onChange} {...washLight}></InputNumber>;
        case CollectionType.SELECT:
            return <Select size="small" value={value} onChange={onChange} options={[]} {...washLight} />;
        case CollectionType.CUSTOM:
            return children;
    }
}

export default Controller;
