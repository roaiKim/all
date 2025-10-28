import { useId, useState } from "react";
import { ChromeFilled } from "@ant-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { IconSelectorState, RoveContext, RoveIcon, RoveIconSelector, RoveiconSelectorProps } from "../src/index";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: "Example/Rove Icon Selector",
    component: RoveIconSelector,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
        docs: {
            // 👇 Enable Code panel for all stories in this file
            codePanel: true,
        },
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        // backgroundColor: { control: 'color' },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    args: { showColor: true, showSize: true },
} satisfies Meta<RoveiconSelectorProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultTabs = new Array(15).fill(0).map((item, index) => ({
    key: "Chrome" + index,
    label: "Chrome " + index,
    icon: <ChromeFilled />,
    // disabled: index % 2 === 0,
}));

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Base: Story = {
    args: {
        lib: "ai",
        name: "AiFillCloseSquare",
    },
    render: function Example() {
        return (
            <div style={{ width: "calc(100vw - 100px)", height: "80vh" }}>
                <RoveIconSelector showColor showSize />
            </div>
        );
    },
};

export const WithModal: Story = {
    args: {
        lib: "ai",
        name: "AiFillCloseSquare",
    },
    render: function Example() {
        const [state, setState] = useState<IconSelectorState>({
            lib: "ai",
            name: "",
            width: 24,
            height: 24,
            color: "#000000",
        });

        return (
            <div style={{ width: "calc(100vw - 100px)", height: "80vh", display: "flex" }}>
                <RoveIconSelector
                    isPopup
                    onConfirm={(state) => {
                        setState(state);
                    }}
                ></RoveIconSelector>
                <div style={{ marginLeft: 20 }}></div>
                <RoveIcon {...state} />
            </div>
        );
    },
};

export const WithChildren: Story = {
    args: {
        lib: "ai",
        name: "AiFillCloseSquare",
    },
    render: function Example() {
        const [state, setState] = useState<IconSelectorState>({
            lib: "ai",
            name: "",
            width: 24,
            height: 24,
            color: "#000000",
        });
        return (
            <div style={{ width: "calc(100vw - 100px)", height: "80vh", display: "flex" }}>
                <RoveIconSelector
                    isPopup
                    onConfirm={(state) => {
                        setState(state);
                    }}
                >
                    <button className="rove-button primary">with children Popup</button>
                </RoveIconSelector>
                <div style={{ marginLeft: 20 }}></div>
                <RoveIcon {...state} />
            </div>
        );
    },
};

export const MITIcon: Story = {
    args: {
        lib: "ai",
        name: "AiFillCloseSquare",
    },
    render: function Example() {
        const [state, setState] = useState<IconSelectorState>({
            lib: "ai",
            name: "",
            width: 24,
            height: 24,
            color: "#000000",
        });
        return (
            <div style={{ width: "calc(100vw - 100px)", height: "80vh", display: "flex" }}>
                <RoveIconSelector
                    MIT
                    onConfirm={(state) => {
                        setState(state);
                    }}
                ></RoveIconSelector>
            </div>
        );
    },
};

export const ExcludeIcon: Story = {
    args: {
        lib: "ai",
        name: "AiFillCloseSquare",
    },
    render: function Example() {
        const [state, setState] = useState<IconSelectorState>({
            lib: "ai",
            name: "",
            width: 24,
            height: 24,
            color: "#000000",
        });
        return (
            <div style={{ width: "calc(100vw - 100px)", height: "80vh", display: "flex" }}>
                <RoveIconSelector
                    exclude={["ai", "bi", "bs"]}
                    onConfirm={(state) => {
                        setState(state);
                    }}
                ></RoveIconSelector>
            </div>
        );
    },
};

export const IncludeIcon: Story = {
    args: {
        lib: "ai",
        name: "AiFillCloseSquare",
    },
    render: function Example() {
        const [state, setState] = useState<IconSelectorState>({
            lib: "ai",
            name: "",
            width: 24,
            height: 24,
            color: "#000000",
        });
        return (
            <div style={{ width: "calc(100vw - 100px)", height: "80vh", display: "flex" }}>
                <RoveIconSelector
                    include={["ai", "bi", "bs"]}
                    onConfirm={(state) => {
                        setState(state);
                    }}
                ></RoveIconSelector>
            </div>
        );
    },
};

export const languageCH: Story = {
    args: {
        lib: "ai",
        name: "AiFillCloseSquare",
    },
    render: function Example() {
        const [state, setState] = useState<IconSelectorState>({
            lib: "ai",
            name: "",
            width: 24,
            height: 24,
            color: "#000000",
        });
        return (
            <div style={{ width: "calc(100vw - 100px)", height: "80vh", display: "flex" }}>
                <RoveContext.Provider
                    value={{
                        type: "ch",
                    }}
                >
                    <>
                        <RoveIconSelector
                            isPopup
                            onConfirm={(state) => {
                                setState(state);
                            }}
                        ></RoveIconSelector>
                        <div style={{ marginLeft: 20 }}></div>
                        <RoveIcon {...state} />
                    </>
                </RoveContext.Provider>
            </div>
        );
    },
};

export const ReplaceLanguage: Story = {
    args: {
        lib: "ai",
        name: "AiFillCloseSquare",
    },
    render: function Example() {
        const [state, setState] = useState<IconSelectorState>({
            lib: "ai",
            name: "",
            width: 24,
            height: 24,
            color: "#000000",
        });
        return (
            <div style={{ width: "calc(100vw - 100px)", height: "80vh", display: "flex" }}>
                <RoveContext.Provider
                    value={{
                        type: "en",
                        language: {
                            "rove-modal-title": "my modal title",
                        },
                    }}
                >
                    <>
                        <RoveIconSelector
                            isPopup
                            onConfirm={(state) => {
                                setState(state);
                            }}
                        ></RoveIconSelector>
                        <div style={{ marginLeft: 20 }}></div>
                        <RoveIcon {...state} />
                    </>
                </RoveContext.Provider>
            </div>
        );
    },
};

export const OtherLanguage: Story = {
    args: {
        lib: "ai",
        name: "AiFillCloseSquare",
    },
    render: function Example() {
        const [state, setState] = useState<IconSelectorState>({
            lib: "ai",
            name: "",
            width: 24,
            height: 24,
            color: "#000000",
        });
        return (
            <div style={{ width: "calc(100vw - 100px)", height: "80vh", display: "flex" }}>
                <RoveContext.Provider
                    value={{
                        language: {
                            "rove-modal-title": "アイコンを選択",
                            "rove-modal-select-name": "選択",
                            "rove-selector-width": "幅",
                            "rove-selector-height": "高さ",
                            "rove-selector-color": "色",
                            "rove-selector-copyname": "名前をコピー",
                            "rove-selector-copy": "コピー",
                            "rove-selector-ok": "確定",
                            "rove-search-placeholder": "アイコン名を検索",
                            "rove-search-button": "検索",
                        },
                    }}
                >
                    <>
                        <RoveIconSelector
                            isPopup
                            onConfirm={(state) => {
                                setState(state);
                            }}
                        >
                            <button className="rove-button primary">選択 アイコンです</button>
                        </RoveIconSelector>
                        <div style={{ marginLeft: 20 }}></div>
                        <RoveIcon {...state} />
                    </>
                </RoveContext.Provider>
            </div>
        );
    },
};
