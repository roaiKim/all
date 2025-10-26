import { Divider } from "antd";
import { AlignCenterOutlined, AlignLeftOutlined, AlignRightOutlined, RotateLeftOutlined, RotateRightOutlined } from "@ant-design/icons";
import { operateHeight } from "@src/configure";
import IconButton from "../header/icon-button";
import "./index.less";

export default function Operate() {
    return (
        <div className="rk-operate" style={{ height: operateHeight }}>
            <div className="rk-o-button">
                <IconButton size="s" pointer="pointer">
                    <RotateLeftOutlined />
                </IconButton>
                <IconButton size="s" pointer="pointer">
                    <RotateRightOutlined />
                </IconButton>
                <Divider type="vertical" className="rk-o-divider" />
                <IconButton size="s" pointer="pointer" title="左对齐">
                    <AlignLeftOutlined />
                </IconButton>
                <IconButton size="s" pointer="pointer" title="水平对齐">
                    <AlignCenterOutlined />
                </IconButton>
                <IconButton size="s" pointer="pointer" title="右对齐">
                    <AlignRightOutlined />
                </IconButton>
                <IconButton size="s" pointer="pointer" title="顶部对齐">
                    <AlignLeftOutlined rotate={90} />
                </IconButton>
                <IconButton size="s" pointer="pointer" title="垂直对齐">
                    <AlignCenterOutlined rotate={90} />
                </IconButton>
                <IconButton size="s" pointer="pointer" title="下对齐">
                    <AlignRightOutlined rotate={90} />
                </IconButton>
                <Divider type="vertical" className="rk-o-divider" />
            </div>
            <div></div>
        </div>
    );
}
