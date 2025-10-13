import { useState } from "react";
import { ChromeStyleTabs, type ChromeStyleTabType } from "chrome-style-tabs-react";
import { AppleOutlined } from "@ant-design/icons";

export default function ChromeExample() {
    const [tabs, setTabs] = useState<ChromeStyleTabType[]>(
        new Array(15).fill(0).map((item, index) => ({
            key: "Fackbook" + index,
            label: "Fackbook " + index,
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
