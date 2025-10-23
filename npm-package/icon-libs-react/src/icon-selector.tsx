import { useEffect, useState } from "react";
import { IconsManifest } from "react-icons";
// import { Button, Input, InputNumber, Select } from "antd";
// import Modal from "@src/components/modal";
// import useViewBasic from "@src/hooks/useViewBasic";
import { ColorSelector } from "./color-selector";
import { MimesisIcons, MimesisLibsType, useGetIconLib } from "./mimesis-icons";

interface IconSelectorProps {
    lib?: MimesisLibsType;
    name?: string;
    onConfirm?: (color: IconSelectorState) => void;
    showSize?: boolean;
    showColor?: boolean;
}

interface IconSelectorState {
    lib: MimesisLibsType;
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
    color: "",
});

export const IconSelector = function AddOrEdit(props: IconSelectorProps, ref) {
    const { lib, name, showSize = true, showColor = true } = props;
    const [state, setState] = useState(initState());

    const [searchValue, setSearchValue] = useState(null);

    const [libs] = useState(() => IconsManifest);

    const { IconList, loading } = useGetIconLib(state.lib);
    // const { viewState, setViewState, clearBasicValue } = useViewBasic();

    const showModal = () => {
        if (lib && name) {
            setState((prev) => ({ ...prev, lib, name }));
        }
    };

    const onSubmit = () => {
        if (props.onConfirm) {
            props.onConfirm(state);
        } else {
            console.log("icon-state", state);
        }
    };

    useEffect(() => {
        if (lib) {
            setState((prev) => ({ ...prev, lib, name }));
        }
    }, [lib, name]);

    return (
        <div>
            <div style={{ padding: "0px 15px 15px 15px", position: "relative" }}>
                <div
                    style={{
                        padding: "15px 5px",
                        position: "sticky",
                        top: 0,
                        backgroundColor: "var(--ant-color-bg-base)",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <select
                        value={state.lib}
                        style={{ width: 180 }}
                        onChange={(event) => {
                            const value = event.target.value as MimesisLibsType;
                            setState((prev) => ({ ...prev, ...initState(), lib: value }));
                        }}
                        // options={libIcon}
                        // placeholder="图标选择"
                    >
                        <option></option>
                        {libs?.map((item) => (
                            <option value={item.id}>{item.name}</option>
                        ))}
                    </select>
                    <input
                        placeholder="搜索图标名称"
                        // onSearch={(value) => {
                        //     console.log("--", value);
                        //     setSearchValue(value);
                        // }}
                        style={{ width: 160, marginLeft: 5 }}
                    />
                    {state.lib && state.name ? (
                        <div style={{ marginLeft: 20, flexGrow: 1, display: "flex" }}>
                            <div
                                style={{
                                    width: (state.width || 24) + 8,
                                    height: (state.height || 24) + 8,
                                    margin: 5,
                                    padding: 3,
                                    border: "1px dotted #333",
                                    borderRadius: 3,
                                    cursor: "pointer",
                                }}
                            >
                                <MimesisIcons
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
                                    <span style={{ marginRight: 5 }}>宽度</span>
                                    <input
                                        value={state.width}
                                        onChange={(value) => {
                                            // setState((prev) => ({ ...prev, width: value }));
                                        }}
                                        style={{ width: 100 }}
                                    />
                                </div>
                            )}
                            {showSize && (
                                <div style={{ display: "flex", alignItems: "center", marginLeft: 10 }}>
                                    <span style={{ marginRight: 5 }}>高度</span>
                                    <input
                                        value={state.height}
                                        onChange={(value) => {
                                            // setState((prev) => ({ ...prev, height: value }));
                                        }}
                                        style={{ width: 100 }}
                                    />
                                </div>
                            )}
                            {showColor && (
                                <div style={{ display: "flex", alignItems: "center", marginLeft: 10 }}>
                                    <span style={{ marginRight: 5 }}>颜色</span>
                                    <ColorSelector
                                        color={state.color || "#000000"}
                                        onSetting={(color) => {
                                            setState((prev) => ({ ...prev, color }));
                                        }}
                                        example
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ marginLeft: 20, flexGrow: 1 }}></div>
                    )}
                    <button onClick={onSubmit}>确定</button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
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
            <button onClick={showModal}>选择</button>
        </div>
    );
};
