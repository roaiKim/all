import Popup from "reactjs-popup";
import { Chrome } from "@uiw/react-color";

interface ColorSelectorProps {
    color: string | undefined;
    onSetting: (color?: string) => void;
    style?: React.CSSProperties;
}

export function ColorSelector(props: ColorSelectorProps) {
    const { onSetting, color, style = {} } = props;

    return (
        <div style={{ display: "flex", flexWrap: "wrap", ...style }}>
            <Popup trigger={<div className="customer-color-pick" style={{ background: color }}></div>} position="bottom center" closeOnDocumentClick>
                <Chrome
                    onChange={(color) => {
                        onSetting(color.hex);
                    }}
                    color={color || undefined}
                />
            </Popup>
        </div>
    );
}
