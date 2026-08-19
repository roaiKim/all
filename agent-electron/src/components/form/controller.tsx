import { Input, InputNumber, Select, Switch } from "antd";
import type { PropsWithChildren } from "react";
import { CollectionType, type SceneryProps, type ValueType } from "./collection";

interface ControllerProps extends Pick<SceneryProps<ValueType>, "value" | "port" | "washLight" | "onChange"> {
    name?: string;
}

function Controller(props: PropsWithChildren<ControllerProps>) {
    const { port, value, onChange = () => void 0, children, ...washLight } = props;

    // const onChange = change ?? (() => void 0);
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
            return <InputNumber size="small" value={value} onChange={onChange} style={{ width: "100%" }} {...washLight}></InputNumber>;
        case CollectionType.SELECT:
            return <Select size="small" value={value} onChange={onChange} style={{ width: "100%" }} options={[]} {...washLight} />;
        case CollectionType.SWITCH:
            return <Switch size="small" value={Boolean(value)} onChange={onChange as any} style={{ width: "100%" }} {...washLight} />;
        case CollectionType.CUSTOM:
            return children;
    }
}

export default Controller;
