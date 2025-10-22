import { Route, Routes } from "react-router";
import Home from "@md/common/home";
import Print from "@md/print";

export function AppRouter() {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="print" element={<Print />} />
        </Routes>
    );
}
