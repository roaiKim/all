import { PropsWithChildren, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { IconSelector, IconSelectorProps } from "./icon-selector";
import { useGetLanguage } from "./useGetLanguage";

export interface RoveiconSelectorProps extends Partial<IconSelectorProps> {
    /**
     * @description wrap style
     */
    style?: React.CSSProperties;
    title?: string;
    isPopup?: boolean;
}

export function RoveIconSelector(props: PropsWithChildren<RoveiconSelectorProps>) {
    const { onConfirm: save, style = {}, children, isPopup, title, ...rest } = props;

    const [open, setOpen] = useState(false);
    const { getLanguage } = useGetLanguage();

    const onConfirm = (state) => {
        if (save) {
            save(state);
        }
        setOpen(false);
    };

    if (!isPopup) {
        return <IconSelector onConfirm={onConfirm} {...rest} />;
    }

    return (
        <div style={style}>
            {open && (
                <div className="rover-modal">
                    <div className="rover-container">
                        <div className="rover-modal-header">
                            <span>{title || getLanguage("rove-modal-title")}</span>
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
                            <IconSelector onConfirm={onConfirm} {...rest} />
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
                {children || <button className="rove-button">{getLanguage("rove-modal-select-name")}</button>}
            </div>
        </div>
    );
}
