import { Input, InputNumber, Select } from "antd";
import { CollectionType, type SceneryProps, type ValueType } from "./collection";

interface ControllerProps extends Pick<SceneryProps<ValueType>, "value" | "port" | "washLight" | "onChange"> {
    name?: string;
}

function Controller(props: ControllerProps) {
    const { port, value, onChange, ...washLight } = props;

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
    }
}

export default Controller;
