import { useImperativeHandle, useState, forwardRef, useEffect } from "react";
import Modal from "@src/components/modal";
import useViewBasic from "@src/hooks/useViewBasic";
import { intl, intlMsgs } from "@src/lang";
import { DynamicIcon, LibIconType, useGetIconLib } from "./index";
import RemoteSelect from "../select_databook";
import { IconsManifest } from "react-icons";
import { Button, Input, InputNumber, Select } from "antd";
import { ColorSelector } from "./color-selector";

interface DynamicIconSelectorProps {
    lib?: LibIconType;
    name?: string;
    onConfirm?: (color: DynamicIconSelectorState) => void;
    showSize?: boolean;
    showColor?: boolean;
}

interface DynamicIconSelectorState {
    lib: LibIconType;
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

const initState = (): DynamicIconSelectorState => ({
    lib: "ai",
    name: null,
    width: 24,
    height: 24,
    color: ""
});

export const DynamicIconSelector = forwardRef(function AddOrEdit(props: DynamicIconSelectorProps, ref) {
    const { lib, name, showSize = true, showColor = true } = props;
    const [state, setState] = useState(initState());
    const [searchValue, setSearchValue] = useState(null);
    const [libIcon, setLibIcon] = useState(() => {
        const types = [];
        IconsManifest.forEach((item) => {
            types.push({ label: item.name, value: item.id });
        });
        return types;
    });
    const { IconList, loading } = useGetIconLib(state.lib);
    const { viewState, setViewState, clearBasicValue } = useViewBasic();
    const { open } = viewState;

    useImperativeHandle(ref, () => ({
        show: () => {
            showModal();
        }
    }));

    const showModal = () => {
        setViewState({ open: true, readOnly: false, initLoading: false });
        if (lib && name) {
            setState((prev) => ({ ...prev, lib, name: name }));
        }
    };

    function changeOpen(open) {
        setViewState({ open });
        if (!open) {
            clearBasicValue();
            setState(initState());
        }
    }

    const onSubmit = () => {
        if (props.onConfirm) {
            props.onConfirm(state);
        } else {
            console.log("icon-state", state);
        }
        changeOpen(false);
    };

    useEffect(() => {
        if (lib) {
            setState((prev) => ({ ...prev, lib, name: name }));
        }
    }, [lib, name]);

    return (
        <div>
            <Modal
                onSubmit={onSubmit}
                style={{
                    width: "95%",
                    maxWidth: 1000
                }}
                changeOpen={changeOpen}
                open={open}
                title={intl.formatMessage(intlMsgs.图标选择)}
                footerText={intl.formatMessage(intlMsgs.保存)}
                loading={viewState.loading}
            >
                <div style={{ padding: "0px 15px 15px 15px", position: "relative" }}>
                    <div
                        style={{
                            padding: "15px 5px",
                            position: "sticky",
                            top: 0,
                            backgroundColor: "var(--ant-color-bg-base)",
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        <Select
                            value={state.lib}
                            style={{ width: 180 }}
                            onChange={(value) => {
                                setState((prev) => ({ ...prev, ...initState(), lib: value }));
                            }}
                            options={libIcon}
                            placeholder={intl.formatMessage(intlMsgs.图标选择)}
                        />
                        <Input.Search
                            placeholder="搜索图标名称"
                            onSearch={(value) => {
                                console.log("--", value);
                                setSearchValue(value);
                            }}
                            style={{ width: 160, marginLeft: 5 }}
                        />
                        {!!(state.lib && state.name) ? (
                            <div style={{ marginLeft: 20, flexGrow: 1, display: "flex" }}>
                                <div
                                    style={{
                                        width: (state.width || 24) + 8,
                                        height: (state.height || 24) + 8,
                                        margin: 5,
                                        padding: 3,
                                        border: "1px dotted #333",
                                        borderRadius: 3,
                                        cursor: "pointer"
                                    }}
                                >
                                    <DynamicIcon
                                        style={{
                                            width: state.width || 24,
                                            height: state.height || 24,
                                            color: state.color || undefined
                                        }}
                                        lib={state.lib}
                                        name={state.name}
                                    />
                                </div>
                                {showSize && (
                                    <div style={{ display: "flex", alignItems: "center", marginLeft: 10 }}>
                                        <span style={{ marginRight: 5 }}>{intl.formatMessage(intlMsgs.宽度)}</span>
                                        <InputNumber
                                            value={state.width}
                                            onChange={(value) => {
                                                setState((prev) => ({ ...prev, width: value }));
                                            }}
                                            style={{ width: 100 }}
                                            addonAfter="px"
                                        />
                                    </div>
                                )}
                                {showSize && (
                                    <div style={{ display: "flex", alignItems: "center", marginLeft: 10 }}>
                                        <span style={{ marginRight: 5 }}>{intl.formatMessage(intlMsgs.高度)}</span>
                                        <InputNumber
                                            value={state.height}
                                            onChange={(value) => {
                                                setState((prev) => ({ ...prev, height: value }));
                                            }}
                                            style={{ width: 100 }}
                                            addonAfter="px"
                                        />
                                    </div>
                                )}
                                {showColor && (
                                    <div style={{ display: "flex", alignItems: "center", marginLeft: 10 }}>
                                        <span style={{ marginRight: 5 }}>{intl.formatMessage(intlMsgs.颜色)}</span>
                                        <ColorSelector
                                            color={state.color || "#000000"}
                                            onSetting={(color) => {
                                                setState((prev) => ({ ...prev, color: color }));
                                            }}
                                            example
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ marginLeft: 20, flexGrow: 1 }}></div>
                        )}
                        <Button type="primary" onClick={onSubmit}>
                            {intl.formatMessage(intlMsgs.确定)}
                        </Button>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {(searchValue
                            ? IconList.filter((item) => validateName(item.name, searchValue))
                            : IconList
                        )?.map((item) => {
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
                                        backgroundColor: state.name === item.name ? "#ff000024" : "initial"
                                    }}
                                    onClick={() => {
                                        setState((prev) => ({
                                            ...prev,
                                            name: state.name === item.name ? "" : item.name
                                        }));
                                    }}
                                >
                                    <Component style={{ width: "100%", height: "100%" }} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </Modal>
            <Button onClick={showModal}>{intl.formatMessage(intlMsgs.选择)}</Button>
        </div>
    );
});
