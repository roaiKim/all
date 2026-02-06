import { Input, InputNumber, Select } from "antd";
import { MicrophoneType, type SceneryProps, type ValueType } from "./index";

interface ControllerProps extends Pick<SceneryProps<ValueType>, "value" | "port" | "washLight" | "onChange"> {
    name?: string;
}

function Controller(props: ControllerProps) {
    const { port, value, onChange, ...washLight } = props;

    switch (port) {
        case MicrophoneType.INPUT:
            return (
                <Input
                    value={value}
                    onChange={(event) => {
                        onChange(event.target.value);
                    }}
                    {...washLight}
                ></Input>
            );

        case MicrophoneType.NUMBER:
            return <InputNumber value={value} onChange={onChange} {...washLight}></InputNumber>;
        case MicrophoneType.SELECT:
            return <Select value={value} onChange={onChange} options={[]} {...washLight} />;
    }
}

export default Controller;
