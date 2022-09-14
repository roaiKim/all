import { Button } from "antd";
import { PropsWithChildren } from "react";
import { SetView, ViewState } from "utils/hooks/usePageModal";
import "./index.less";

interface PageTitleProps {
    title?: string;
    view: ViewState;
    setView: SetView;
}

export function PageTitle(props: PropsWithChildren<PageTitleProps>) {
    const { title, setView, children } = props;
    return (
        <div className="ro-page-header">
            <div>{title}</div>
            <div className="ro-header-btns">
                <div>{children}</div>
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
