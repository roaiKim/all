import { useEffect, useState } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { NoFountComponent } from "module/common/404/type";
import { LoginComponent } from "module/common/login/type";
import { MainComponent as HomeComponent } from "module/home/type";
import { joinLessPrefix } from "utils/framework";
import cacheModules from "utils/function/load-modules";
import MainLayout from "./main";

function SinglePage() {
    const [modules] = useState(() => {
        const systemModules = cacheModules.systemModules;
        return Object.keys(systemModules).filter(Boolean);
    });

    console.log("modules", modules);
    return (
        <Routes>
            <Route path="/login/:id?" element={<LoginComponent></LoginComponent>} />
            <Route
                path="/"
                element={
                    <MainLayout>
                        <Outlet></Outlet>
                    </MainLayout>
                }
            >
                <Route index element={<HomeComponent></HomeComponent>} />
                {modules.map((key) => {
                    const module = cacheModules.systemModules[key];
                    if (module) {
                        const { path, component: Component } = module;
                        return <Route key={key} path={path} element={<Component></Component>} />;
                    }
                    return null;
                })}
                <Route path="*" element={<NoFountComponent />} />
            </Route>
        </Routes>
    );
}

export default SinglePage;
