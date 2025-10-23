import { useId, useState } from "react";
import { ChromeFilled } from "@ant-design/icons";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import { IconSelector } from "../src/index";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: "Example/icon-selector",
    component: IconSelector,
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
} satisfies Meta<typeof IconSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultTabs = new Array(15).fill(0).map((item, index) => ({
    key: "Chrome" + index,
    label: "Chrome " + index,
    icon: <ChromeFilled />,
    // disabled: index % 2 === 0,
}));

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const mimesisIconsBase: Story = {
    args: {
        lib: "ai",
        name: "AiFillCloseSquare",
    },
    render: function ChromeExample() {
        return (
            <div style={{ width: "calc(100vw - 100px)", height: "80vh" }}>
                <IconSelector showColor showSize />
            </div>
        );
    },
};

export const mimesisIconsWithColor: Story = {
    args: {
        lib: "ai",
        name: "AiFillCloseSquare",
    },
    render: function ChromeExample() {
        return (
            <div style={{ width: "calc(100vw - 100px)", height: "80vh" }}>
                <IconSelector showColor showSize />
            </div>
        );
    },
};

export const mimesisIconsWithSize: Story = {
    args: {
        lib: "ai",
        name: "AiFillCloseSquare",
    },
    render: function ChromeExample() {
        return (
            <div style={{ width: "calc(100vw - 100px)", height: "80vh" }}>
                <IconSelector showColor showSize />
            </div>
        );
    },
};
