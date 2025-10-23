import Popup from "reactjs-popup";
import { Chrome } from "@uiw/react-color";
import "./color-selector.less";

interface ColorSelectorProps {
    color: string | undefined;
    onSetting: (color?: string) => void;
    example?: boolean;
    style?: React.CSSProperties;
}

export function ColorSelector(props: ColorSelectorProps) {
    const { onSetting, color, example, style = {} } = props;

    return (
        <div style={{ display: "flex", flexWrap: "wrap", ...style }}>
            <Popup trigger={<button className="button">Trigger</button>} position="right center" closeOnDocumentClick>
                <Chrome
                    // allowClear
                    onChange={(color) => {
                        onSetting(color.hex);
                    }}
                    // showAlpha={false}
                    color={color || undefined}
                />
            </Popup>
        </div>
    );
}
