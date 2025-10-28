import { useEffect, useRef, useState } from "react";
import { IconsManifest } from "react-icons";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ColorSelector } from "./color-selector";
import { RoveIcon, RoveIconProps } from "./rove-icons";
import { RoveSearch } from "./search";
import { useGetLanguage } from "./useGetLanguage";
import { RoveIconLibsType, useGetRoveIcons } from "./useGetRoveIcons";
import { copyToClipboard } from "./utils";

export interface IconSelectorProps extends Partial<Pick<RoveIconProps, "lib" | "name">> {
    /**
     * @description confirm function
     * @param state color IconSelectorState
     * @returns
     */
    onConfirm?: (state: IconSelectorState) => void;
    /**
     * @description show width and height input?
     * @default true
     */
    showSize?: boolean;
    /**
     * @description show color picker?
     * @default true
     */
    showColor?: boolean;
    /**
     * @description show copy name button?
     * @default true
     */
    showCopy?: boolean;
    /**
     * @description show copy button?
     * @default true
     */
    showCopyName?: boolean;
    /**
     * @description react icons are not all based on the MIT protocol. Should we only select those that include the MIT protocol?
     * @default false
     */
    MIT?: boolean;
    /**
     * @description Exclude icon library
     */
    exclude?: RoveIconLibsType[];
    /**
     * @description With the highest weight. If this option is available, only the selected values will be included.
     */
    include?: RoveIconLibsType[];
}

export interface IconSelectorState {
    lib: RoveIconLibsType;
    name: string;
    width: number;
    height: number;
    color: string;
}

const validateName = (originName, value) => {
    if (!originName || !value) {
        return false;
    }
    const v1 = originName.toLocaleLowerCase();
    const v2 = value.toLocaleLowerCase();
    return v1.includes(v2);
};

const initState = (): IconSelectorState => ({
    lib: "ai",
    name: null,
    width: 24,
    height: 24,
    color: "#000000",
});

export const IconSelector = function AddOrEdit(props: IconSelectorProps, ref) {
    const { lib, name, showSize = true, showColor = true, showCopy = true, showCopyName = true } = props;
    const [state, setState] = useState(initState());
    const overHandlerRef = useRef(null);
    const [searchValue, setSearchValue] = useState(null);
    const [panelInView, setPanelInView] = useState(true);
    const { getLanguage } = useGetLanguage();

    const [libs] = useState(() => {
        const { MIT, exclude = [], include } = props;

        if (include) {
            return IconsManifest.filter((item) => include.includes(item.id as RoveIconLibsType));
        }

        return IconsManifest.filter((item) => (MIT ? (item.license || "").toLocaleUpperCase() === "MIT" : true)).filter(
            (item) => !exclude.includes(item.id as RoveIconLibsType)
        );
    });

    const { IconList, loading } = useGetRoveIcons(state.lib);

    const onSubmit = () => {
        if (props.onConfirm) {
            props.onConfirm(state);
        } else {
            //
        }
    };

    useEffect(() => {
        if (lib) {
            setState((prev) => ({ ...prev, lib, name }));
        }
    }, [lib, name]);

    useEffect(() => {
        const handler = overHandlerRef.current;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setPanelInView(true);
                } else {
                    setPanelInView(false);
                }
            },
            { threshold: [0] }
        );

        observer.observe(handler);
        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className="rove-panel">
            <div className={`rove-panel-header ${panelInView ? "" : "sticky"}`}>
                <select
                    className="rove-select"
                    value={state.lib}
                    onChange={(event) => {
                        const value = event.target.value as RoveIconLibsType;
                        setState((prev) => ({ ...prev, ...initState(), lib: value }));
                    }}
                >
                    {libs?.map((item) => (
                        <option value={item.id}>{item.name}</option>
                    ))}
                </select>
                <RoveSearch
                    onSearch={(value) => {
                        setSearchValue(value);
                    }}
                ></RoveSearch>
                {state.lib && state.name ? (
                    <div style={{ marginLeft: 20, flexGrow: 1, display: "flex" }}>
                        <div
                            style={{
                                borderRadius: 3,
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <RoveIcon
                                style={{
                                    width: state.width || 24,
                                    height: state.height || 24,
                                    color: state.color || undefined,
                                }}
                                lib={state.lib}
                                name={state.name}
                            />
                        </div>
                        {showSize && (
                            <div style={{ display: "flex", alignItems: "center", marginLeft: 10 }}>
                                <span style={{ marginRight: 5 }}>{getLanguage("rove-selector-width")}:</span>
                                <input
                                    className="rove-input"
                                    value={state.width}
                                    onChange={(event) => {
                                        const value = event.target.value as any as number;
                                        setState((prev) => ({ ...prev, width: value }));
                                    }}
                                    pattern="/^[1-9]\d*$/"
                                    style={{ width: 60 }}
                                />
                            </div>
                        )}
                        {showSize && (
                            <div style={{ display: "flex", alignItems: "center", marginLeft: 10 }}>
                                <span style={{ marginRight: 5 }}>{getLanguage("rove-selector-height")}:</span>
                                <input
                                    className="rove-input"
                                    value={state.height}
                                    onChange={(event) => {
                                        const value = event.target.value as any as number;
                                        setState((prev) => ({ ...prev, height: value }));
                                    }}
                                    pattern="/^[1-9]\d*$/"
                                    style={{ width: 60 }}
                                />
                            </div>
                        )}
                        {showColor && (
                            <div style={{ display: "flex", alignItems: "center", marginLeft: 10 }}>
                                <span style={{ marginRight: 5 }}>{getLanguage("rove-selector-color")}:</span>
                                <ColorSelector
                                    color={state.color}
                                    onSetting={(color) => {
                                        setState((prev) => ({ ...prev, color }));
                                    }}
                                />
                            </div>
                        )}
                        {showCopy && (
                            <button
                                style={{ marginLeft: 10 }}
                                onClick={() => {
                                    const text = `${state.lib}#${state.name}`;
                                    copyToClipboard(text);
                                }}
                                className="rove-button"
                            >
                                {getLanguage("rove-selector-copyname")}
                            </button>
                        )}
                        {showCopyName && (
                            <button
                                style={{ marginLeft: 10 }}
                                onClick={() => {
                                    const text = JSON.stringify(state);
                                    copyToClipboard(text);
                                }}
                                className="rove-button"
                            >
                                {getLanguage("rove-selector-copy")}
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={{ marginLeft: 20, flexGrow: 1 }}></div>
                )}
                <button className="rove-button primary" onClick={onSubmit}>
                    {getLanguage("rove-selector-ok")}
                </button>
            </div>
            <div className="rove-panel-body">
                <div ref={overHandlerRef}></div>
                {loading && (
                    <div className="rove-pb-mask">
                        <AiOutlineLoading3Quarters style={{ width: 30, height: 30 }} />
                    </div>
                )}
                {(searchValue ? IconList.filter((item) => validateName(item.name, searchValue)) : IconList)?.map((item) => {
                    const Component = item.Component;
                    return (
                        <div
                            key={item.name}
                            style={{
                                width: 40,
                                height: 40,
                                margin: 5,
                                padding: 3,
                                border: state.name === item.name ? "2px solid red" : "1px dotted #333",
                                borderRadius: 3,
                                cursor: "pointer",
                                backgroundColor: state.name === item.name ? "#ff000024" : "initial",
                            }}
                            onClick={() => {
                                setState((prev) => ({
                                    ...prev,
                                    name: state.name === item.name ? "" : item.name,
                                }));
                            }}
                        >
                            <Component style={{ width: "100%", height: "100%" }} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
