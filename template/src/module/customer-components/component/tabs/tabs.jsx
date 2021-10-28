import React from "react";
import SVG from "./tab-svg";
import "./index.less";

export default function TabComponent() {
    return (
        <div className="ro-header-tabs-container">
            <div className="ro-tabs-container">
                <ChromeTab tabs={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]} active={2} />
            </div>
            <div className="ro-tabs-container-bottom-bar" />
        </div>
    );
}

function ChromeTab({ tabs, active }) {
    return tabs.map((item) => (
        <div key={item} className="ro-tab-item" {...(active === item ? { active: "true" } : {})}>
            <div className="ro-tab-item-dividers" />
            <div className="ro-tab-item-background">
                <SVG />
            </div>
            <div className="ro-tab-item-content">
                <div className="ro-tab-item-favicon chrome-google" />
                <div className="ro-tab-item-title">Google</div>
                <div className="ro-tab-item-drag-handle" />
                <div className="ro-tab-item-close">{/* <CloseOutlined style={{ color: "#000" }} /> */}</div>
            </div>
        </div>
    ));
}
