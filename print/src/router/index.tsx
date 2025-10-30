import { Route, Routes } from "react-router";
import AIPrint from "@md/ai-print/1";
import Home from "@md/common/home";
import Print from "@md/print";
import PrintTemplateEditor from "@src/module/ai-print/2";
import DragPrintComponent from "@src/module/ai-print/3";

export function AppRouter() {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="print" element={<Print />} />
            <Route path="ai-print" element={<AIPrint />} />
            <Route path="ai-print2" element={<PrintTemplateEditor />} />
            <Route path="ai-print3" element={<DragPrintComponent />} />
        </Routes>
    );
}
