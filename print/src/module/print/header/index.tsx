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
import "./index.less";

export default function Header() {
    return (
        <div className="rk-header" style={{ height: headerHeight }}>
            <div className="rk-copyright">
                <PrinterOutlined style={{ fontSize: 40 }} />
                <span className="rk-print-name">ROAIKIM-PRINT</span>
            </div>
            <div className="rk-element">
                <IconButton text="文本" hoverMask pointer="move">
                    <FontSizeOutlined />
                </IconButton>
                <IconButton text="图片" hoverMask pointer="move">
                    <PictureOutlined />
                </IconButton>
                <IconButton text="条形码" hoverMask pointer="move">
                    <QrcodeOutlined />
                </IconButton>
                <IconButton text="二维码" hoverMask pointer="move">
                    <BarcodeOutlined />
                </IconButton>
                <IconButton text="长文" hoverMask pointer="move">
                    <OneToOneOutlined />
                </IconButton>
                <IconButton text="表格" hoverMask pointer="move">
                    <TableOutlined />
                </IconButton>
                <IconButton text="html" hoverMask pointer="move">
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
