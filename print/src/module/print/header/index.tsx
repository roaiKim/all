import { useEffect, useLayoutEffect, useRef } from "react";
import {
    BarcodeOutlined,
    CameraOutlined,
    ExportOutlined,
    FontSizeOutlined,
    Html5Outlined,
    ImportOutlined,
    OneToOneOutlined,
    PictureOutlined,
    PrinterOutlined,
    QrcodeOutlined,
    SaveOutlined,
    TableOutlined,
} from "@ant-design/icons";
import { headerHeight } from "@src/configure";
import Drager from "./drager";
import IconButton from "./icon-button";
import { CustomerDragEvent } from "../event/drag-event";
import type { DragState, WebPrint } from "../main/print";
import { DraggableType } from "../main/static";
import "./index.less";

interface HeaderProps {
    printModule: WebPrint;
}

export default function Header(props: HeaderProps) {
    const { printModule } = props;
    const dragContainer = useRef(null);
    const customerDragEvent = useRef<CustomerDragEvent>(null);

    // useEffect(() => {
    //     if (printModule) {
    //         customerDragEvent.current = new CustomerDragEvent(printModule, dragContainer.current);
    //         customerDragEvent.current.mousedown();
    //     }
    //     return () => {
    //         customerDragEvent.current?.destroyAll();
    //     };
    // }, [printModule]);

    return (
        <div className="rk-header" style={{ height: headerHeight }}>
            <div className="rk-copyright">
                <PrinterOutlined style={{ fontSize: 40 }} />
                <span className="rk-print-name">ROAIKIM-PRINT</span>
            </div>
            <div id="dragContainerDom" ref={dragContainer} className="rk-element">
                <Drager text="文本" printModule={printModule} draggableType={DraggableType.TEXT} hoverMask pointer="move">
                    <FontSizeOutlined />
                </Drager>
                <Drager text="图片" printModule={printModule} draggableType={DraggableType.IMG} hoverMask pointer="move">
                    <PictureOutlined />
                </Drager>
                <Drager text="条形码" printModule={printModule} draggableType={DraggableType.BRCODE} hoverMask pointer="move">
                    <QrcodeOutlined />
                </Drager>
                <Drager text="二维码" printModule={printModule} draggableType={DraggableType.QRCODE} hoverMask pointer="move">
                    <BarcodeOutlined />
                </Drager>
                <Drager text="长文" printModule={printModule} draggableType={DraggableType.TEXTAREA} hoverMask pointer="move">
                    <OneToOneOutlined />
                </Drager>
                <Drager text="表格" printModule={printModule} draggableType={DraggableType.TABLE} hoverMask pointer="move">
                    <TableOutlined />
                </Drager>
                <Drager text="html" printModule={printModule} draggableType={DraggableType.HTML} hoverMask pointer="move">
                    <Html5Outlined />
                </Drager>
            </div>
            <div className="rk-functional">
                <IconButton text="导出模版" pointer="pointer">
                    <ExportOutlined />
                </IconButton>
                <IconButton text="导入模版" pointer="pointer">
                    <ImportOutlined />
                </IconButton>
                <IconButton text="保存" pointer="pointer">
                    <SaveOutlined />
                </IconButton>
            </div>
        </div>
    );
}
