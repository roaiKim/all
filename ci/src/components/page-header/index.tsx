import { Button } from "antd";
import "./index.less";

interface PageHeaderProps {
    title?: string;
}

export function PageModuleHeader(props: PageHeaderProps) {
    const { title } = props;
    return (
        <div className="ro-page-header">
            <div>{title}</div>
            <div className="ro-header-btns">
                <div>
                    <Button size="small">自定义</Button>
                </div>
                <Button size="small" type="primary">
                    新增
                </Button>
                <Button size="small" danger type="dashed">
                    删除
                </Button>
            </div>
        </div>
    );
}
