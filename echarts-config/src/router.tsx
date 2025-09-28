import { useEffect } from "react";
import { Route, Routes } from "react-router";
import Chart from "@src/pages/chart";
import Config from "@src/pages/config";
import Leaflet from "@src/pages/leaflet";
import Tile from "@src/pages/leaflet/tile";
import Vis from "@src/pages/vis";
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
            <Route index element={<Config />} />
            <Route path="about" element={<Chart />} />
            <Route path="vis" element={<Vis />} />
            <Route path="le" element={<Leaflet />} />
            <Route path="lie" element={<Tile />} />
        </Routes>
    );
}
