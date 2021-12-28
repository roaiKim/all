import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { showLoading, Route } from "@core";
import { Switch } from "react-router-dom";
import { Button, message } from "antd";
import { cacheModules } from "utils/function/loadComponent";
import Header from "module/common/header";
import { Menus } from "components/menus";
import { RootState } from "type/state";
import { MainComponent as Home } from "module/home";
import "./index.less";

export default function () {
    console.log("-cacheModules-", cacheModules);
    return (
        <div className="ro-websit-container">
            <Header />
            <main className="ro-main-container">
                <menu className="ro-main-menus">
                    <Menus />
                </menu>
                <main className="ro-main-body">
                    <Switch>
                        {/* <Route path="/" component={Home} /> */}
                        {cacheModules.map(({ module }) => {
                            const { path, component } = module;
                            return <Route key={path} path={path} component={component} />;
                        })}
                        {/* <Route component={Nofound} /> */}
                    </Switch>
                </main>
            </main>
            <footer></footer>
        </div>
    );
}
