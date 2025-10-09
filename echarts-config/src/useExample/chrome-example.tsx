import { useState } from "react";
import { AppleOutlined, FacebookOutlined, GithubOutlined, GoogleOutlined } from "@ant-design/icons";
import ChromeStyleTabs from "@src/pages/chrome";
import type { ChromeStyleTabType } from "@src/pages/chrome/tab";

const defafultAbs = [
    {
        key: "Github",
        label: "Github",
        icon: <GithubOutlined />,
    },
    {
        key: "Google",
        label: "Google",
        icon: <GoogleOutlined />,
    },
    {
        key: "Apple",
        label: "Apple",
        icon: <AppleOutlined />,
    },
    {
        key: "Fackbook",
        label: "Fackbook",
        icon: <FacebookOutlined />,
    },
    {
        key: "Github1",
        label: "Github1",
        icon: <GithubOutlined />,
    },
    {
        key: "Google1",
        label: "Google1",
        icon: <GoogleOutlined />,
    },
    {
        key: "Apple1",
        label: "Apple1",
        icon: <AppleOutlined />,
    },
    {
        key: "Fackbook1",
        label: "Fackbook1",
        icon: <FacebookOutlined />,
    },
];

function ChromeExample() {
    const [tabs, setTabs] = useState<ChromeStyleTabType[]>(
        new Array(15).fill(0).map((item, index) => ({
            key: "Fackbook" + index,
            label: "Fackbook" + index,
            icon: <AppleOutlined />,
            // disabled: index % 2 === 0,
        }))
    );
    const [activeKey, setActiveKey] = useState("Google");

    return (
        <div>
            <ChromeStyleTabs
                tabs={tabs}
                activeKey={activeKey}
                onClose={(tab, index, tabs) => {
                    setTabs(tabs);
                }}
                onDrag={(tabs) => {
                    setTabs(tabs);
                }}
            />
        </div>
    );
}

export default ChromeExample;
