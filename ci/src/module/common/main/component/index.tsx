import React from "react";
import "./index.less";
import { MainComponent } from "module/common/header/type";

const Header = MainComponent;

export default function () {
    return (
        <main className="ro-main-body">
            <Header />
        </main>
    );
}
