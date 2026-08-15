import { useEffect, useMemo, useState } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
// import { NoFountComponent } from "module/common/404/type";
// import { LoginComponent } from "module/common/login/type";
// import { MainComponent as HomeComponent } from "module/home/type";
import { joinLessPrefix } from "utils/framework";
import localModules from "utils/function/load-modules";
import MainLayout from "./main";

function SinglePage() {
    const modules = useMemo(() => Array.from(localModules.systemModules.keys()), []);

    console.log("modules", modules);
    return (
        <Routes>
            {/* <Route path="/login/:id?" element={<LoginComponent></LoginComponent>} /> */}
            <Route
                path="/"
                element={
                    <MainLayout>
                        <Outlet></Outlet>
                    </MainLayout>
                }
            >
                {/* <Route index element={<HomeComponent></HomeComponent>} /> */}
                {modules.map((key) => {
                    const module = localModules.systemModules.get(key);
                    if (module) {
                        const { path, component: Component } = module;
                        return <Route key={key} path={path} element={<Component></Component>} />;
                    }
                    return null;
                })}
                {/* <Route path="*" element={<NoFountComponent />} /> */}
            </Route>
        </Routes>
    );
}

export default SinglePage;
