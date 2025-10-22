import { Input, Popover, ColorPicker } from "antd";
import "./color-selector.less";
import { AggregationColor } from "antd/es/color-picker/color";

interface ColorSelectorProps {
    color: string | undefined;
    onSetting: (color?: string, colors?: AggregationColor) => void;
    example?: boolean;
    style?: React.CSSProperties;
}

export function ColorSelector(props: ColorSelectorProps) {
    const { onSetting, color, example, style = {} } = props;

    return (
        <div style={{ display: "flex", flexWrap: "wrap", ...style }}>
            <ColorPicker
                // allowClear
                onChange={(color, css) => {
                    onSetting(css, color);
                }}
                // showAlpha={false}
                value={color || undefined}
            />
        </div>
    );
}
