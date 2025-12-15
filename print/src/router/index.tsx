import { Route, Routes } from "react-router";
import AIPrint from "@md/ai-print/1";
import Home from "@md/common/home";
import Print from "@md/print";
import PrintTemplateEditor from "@src/module/ai-print/2";
import DragPrintComponent from "@src/module/ai-print/3";
import DragContainer from "@src/module/ai-print/4";
import DragContainer1 from "@src/module/ai-print/5";
import DragContainer6 from "@src/module/ai-print/6";
import DragContainer7 from "@src/module/ai-print/7";
import WebContainer from "@src/module/move";

export function AppRouter() {
    return (
        <Routes>
            <Route index element={<Home />} />
            <Route path="print" element={<Print />} />
            <Route path="1" element={<AIPrint />} />
            <Route path="2" element={<PrintTemplateEditor />} />
            <Route path="3" element={<DragPrintComponent />} />
            <Route path="4" element={<DragContainer />} />
            <Route path="5" element={<DragContainer1 />} />
            <Route path="6" element={<DragContainer6 />} />
            <Route path="7" element={<DragContainer7 />} />
            <Route path="web" element={<WebContainer />} />
        </Routes>
    );
}
