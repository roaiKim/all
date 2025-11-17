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
import IconButton from "./icon-button";
import { CustomerDragEvent } from "../event/drag-event";
import type { DragState, WebPrint } from "../main/print";
import { DraggableType } from "../main/static";
import "./index.less";

interface HeaderProps {
    printModule: WebPrint;
    printTemporaryTemplate: DragState;
}

export default function Header(props: HeaderProps) {
    const { printModule, printTemporaryTemplate } = props;
    const dragContainer = useRef(null);
    const customerDragEvent = useRef<CustomerDragEvent>(null);

    useEffect(() => {
        if (printModule) {
            customerDragEvent.current = new CustomerDragEvent(printModule, dragContainer.current);
            customerDragEvent.current.mousedown();
        }
        return () => {
            customerDragEvent.current?.destroyAll();
        };
    }, [printModule]);

    // useEffect(() => {
    //     if () {}
    //     customerDragEvent.current.mouseup();
    // }, [printTemporaryTemplate.moving]);

    return (
        <div className="rk-header" style={{ height: headerHeight }}>
            <div className="rk-copyright">
                <PrinterOutlined style={{ fontSize: 40 }} />
                <span className="rk-print-name">ROAIKIM-PRINT</span>
            </div>
            <div ref={dragContainer} className="rk-element">
                <IconButton text="文本" draggableType={DraggableType.TEXT} hoverMask pointer="move">
                    <FontSizeOutlined />
                </IconButton>
                <IconButton text="图片" draggableType={DraggableType.IMG} hoverMask pointer="move">
                    <PictureOutlined />
                </IconButton>
                <IconButton text="条形码" draggableType={DraggableType.BRCODE} hoverMask pointer="move">
                    <QrcodeOutlined />
                </IconButton>
                <IconButton text="二维码" draggableType={DraggableType.QRCODE} hoverMask pointer="move">
                    <BarcodeOutlined />
                </IconButton>
                <IconButton text="长文" draggableType={DraggableType.TEXTAREA} hoverMask pointer="move">
                    <OneToOneOutlined />
                </IconButton>
                <IconButton text="表格" draggableType={DraggableType.TABLE} hoverMask pointer="move">
                    <TableOutlined />
                </IconButton>
                <IconButton text="html" draggableType={DraggableType.HTML} hoverMask pointer="move">
                    <Html5Outlined />
                </IconButton>
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
