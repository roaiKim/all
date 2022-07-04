import React from "react";
import "./index.less";
import { HeaderComponent } from "module/common/header/type";
import { MenuComponent } from "module/common/menus/type";
import { MainComponent } from "module/home/type";

export default function () {
    return (
        <main className="ro-main-container">
            <HeaderComponent />
            <div className="ro-main-body">
                <MenuComponent />
                <main className="ro-module-body">
                    <MainComponent />
                </main>
            </div>
        </main>
    );
}
