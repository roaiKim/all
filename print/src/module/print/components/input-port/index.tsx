import { InputNumber, type InputNumberProps } from "antd";
import "./index.less";

export enum MicrophoneType {
    NUMBER = "NUMBER",
    SELECT = "SELECT",
    INPUT = "INPUT",
}

type SceneryElectricPower = InputNumberProps;
type ValueType = string | number;

interface SceneryProps<T> {
    port: MicrophoneType | keyof typeof MicrophoneType;
    value: T;
    label: string | React.ReactNode;
    onChange: (value: T) => void;
    electric?: Omit<SceneryElectricPower, "value" | "onChange">;
    description?: string;
}

export function Scenery<T extends ValueType = ValueType>(props: SceneryProps<T>) {
    const { port, value, label, onChange, electric = {}, description } = props;

    return (
        <div className="scenery-row">
            <div>{label}：</div>
            <div>
                <InputNumber value={value} onChange={onChange} {...electric} />
            </div>
            {!!description && (
                <>
                    <div></div>
                    <div className="scenery-description">{description}</div>
                </>
            )}
        </div>
    );
}
