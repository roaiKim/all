import React from "react";
import SVG from "./tab-svg";
import "./index.less";

function TabComponent(props) {
    const { activeTab, tabs, onClose, onActive } = props;
    return (
        <div className="ro-header-tabs-container">
            <div className="ro-scroll-tabs-container">
                <div className="ro-tabs-container">
                    {tabs.map((item) => (
                        <div key={item} className="ro-tab-item" onClick={() => onActive(item)} {...(activeTab === item ? { active: "true" } : {})}>
                            <div className="ro-tab-item-dividers" />
                            <div className="ro-tab-item-background">
                                <SVG />
                            </div>
                            <div className="ro-tab-item-content">
                                <div className="ro-tab-item-favicon chrome-google" />
                                <div className="ro-tab-item-title">
                                    Google
                                    {item}
                                </div>
                                <div className="ro-tab-item-drag-handle" />
                                <div className="ro-tab-item-close" onClick={(event) => onClose(event, item)} aria-hidden="true" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export { TabComponent };
