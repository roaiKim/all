import React from "react";
import { HeaderTab } from "./HeaderTab";
import "./index.less";

export default function () {
    return (
        <header className="ro-header-container ro-flex">
            <div className="ro-header-logo ro-flex ro-col-center">
                <img alt="logo" src={localStorage.getItem("headerLogo")} />
                <div className="text-overflow-ellipsis">中集冷云综合服务平台</div>
            </div>
            <div className="ro-header-tabs ro-flex ro-col-center">
                {[1, 3, 4, 5, 6].map((item) => (
                    <HeaderTab key={item} name={item} />
                ))}
            </div>
            <div className="ro-header-operate"></div>
        </header>
    );
}
