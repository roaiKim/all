import { InputNumber, type InputNumberProps } from "antd";
import "./index.less";

export enum MicrophoneType {
    NUMBER = "NUMBER",
}

type SceneryElectricPower = InputNumberProps;

interface SceneryProps<T = unknown> {
    value: T;
    label: string | React.ReactNode;
    onChange: (value: T) => void;
    electric: Omit<SceneryElectricPower, "value" | "onChange">;
}

export function Scenery<T>(props: SceneryProps<T>) {
    const { value, label, onChange, electric = {} } = props;

    return (
        <div className="scenery-row">
            <div>{label}：</div>
            <div>
                <InputNumber value={value} onChange={onChange} {...electric} />
            </div>
            <div>测测</div>
        </div>
    );
}
