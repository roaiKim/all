import React from "react";
import "./index.less";
import { HeaderComponent } from "module/common/header/type";
import { MenuComponent } from "module/common/menus/type";
import { Switch } from "react-router-dom";
import { Route } from "@core";
import { cacheModules, cache } from "utils/function/loadComponent";
import { NoFountComponent } from "module/common/404/type";

export default function () {
    console.log("---cacheModules---", cacheModules);
    console.log("---cache---", cache);
    return (
        <div className="ro-body-container">
            <HeaderComponent />
            <div className="ro-main-body">
                <MenuComponent />
                <main className="ro-module-body">
                    <Switch>
                        {cacheModules.map(({ module }) => {
                            const { path, component } = module;
                            return <Route key={path} path={path} component={component} />;
                        })}
                        <Route component={NoFountComponent} />
                    </Switch>
                </main>
            </div>
        </div>
    );
}
