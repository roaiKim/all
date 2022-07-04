import { Button } from "antd";
import { SetView, ViewState } from "utils/hooks/usePageModal";
import "./index.less";

interface PageTitleProps {
    title?: string;
    view: ViewState;
    setView: SetView;
}

export function PageTitle(props: PageTitleProps) {
    const { title, setView } = props;
    return (
        <div className="ro-page-header">
            <div>{title}</div>
            <div className="ro-header-btns">
                <div>
                    <Button size="small">自定义</Button>
                </div>
                <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                        setView({ show: true });
                    }}
                >
                    新增
                </Button>
                <Button size="small" danger type="dashed">
                    删除
                </Button>
            </div>
        </div>
    );
}
