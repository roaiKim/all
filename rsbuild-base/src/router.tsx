import { useEffect } from "react";
import { Route, Routes } from "react-router";
import Home from "@src/pages/home";
import { WEB_COMMA_TENANT_ID, WEB_TOKEN } from "./service/config/static-envs";
import { StorageService } from "./service/StorageService";

export function AppRouter() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const commaTenantId = params.get("commaTenantId");

        if (token) {
            StorageService.set(WEB_TOKEN, token);
        }
        if (commaTenantId) {
            StorageService.set(WEB_COMMA_TENANT_ID, commaTenantId);
        }
    }, []);

    return (
        <Routes>
            <Route index element={<Home />} />
            {/* <Route path="about" element={<About />} /> */}
        </Routes>
    );
}
