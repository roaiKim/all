import { PropsWithChildren, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { IconSelector, IconSelectorProps } from "./icon-selector";
import { RoveIcon } from "./rove-icons";

interface RoveiconSelectorProps extends Partial<IconSelectorProps> {
    /**
     * @description wrap style
     */
    style?: React.CSSProperties;
    isPopup?: boolean;
}

export function RoveIconSelector(props: PropsWithChildren<RoveiconSelectorProps>) {
    const { lib, name, onConfirm, showSize, showColor, showCopy, showCopyName, style = {}, children, isPopup } = props;

    const [open, setOpen] = useState(false);

    if (!isPopup) {
        return (
            <IconSelector
                lib={lib}
                name={name}
                onConfirm={onConfirm}
                showSize={showSize}
                showColor={showColor}
                showCopy={showCopy}
                showCopyName={showCopyName}
            />
        );
    }

    return (
        <div style={style}>
            {open && (
                <div className="rover-modal">
                    <div className="rover-container">
                        <div className="rover-modal-header">
                            <span>select icon</span>
                            <div
                                className="rover-close"
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                <RiCloseFill />
                            </div>
                        </div>
                        <div className="rover-modal-body">
                            <IconSelector
                                lib={lib}
                                name={name}
                                onConfirm={onConfirm}
                                showSize={showSize}
                                showColor={showColor}
                                showCopy={showCopy}
                                showCopyName={showCopyName}
                            />
                        </div>
                        {/* <div className="rover-modal-footer"></div> */}
                    </div>
                </div>
            )}
            <div
                className="rove-handler"
                onClick={() => {
                    if (isPopup) {
                        setOpen(true);
                    }
                }}
            >
                {children || <button className="rove-button">select</button>}
            </div>
        </div>
    );
}
