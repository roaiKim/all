import { PropsWithChildren, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { IconSelector, IconSelectorProps } from "./icon-selector";
import { RoveIcon, RoveIconProps } from "./rove-icons";

type RoveIconMixiSelector = RoveIconProps & IconSelectorProps;

interface RoveIconSelectorProps extends RoveIconMixiSelector {
    /**
     * @description wrap style
     */
    style?: React.CSSProperties;
    /**
     * @description Popup window selection or direct selection
     * @default false
     */
    isPopup?: boolean;
}

export function RoveIconSelector(props: PropsWithChildren<RoveIconSelectorProps>) {
    const { lib, name, onConfirm, showSize, showColor, showCopy, showCopyName, style = {}, children, isPopup, ...rest } = props;

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
                            <div className="rover-close">
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
                onClick={() => {
                    if (isPopup) {
                        setOpen(true);
                    }
                }}
            >
                {children || <RoveIcon lib={lib} name={name} {...rest} />}
            </div>
        </div>
    );
}
