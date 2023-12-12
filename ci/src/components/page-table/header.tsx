import { PropsWithChildren } from "react";
import { Button } from "antd";
import { PageModalState } from "utils/hooks/usePageModal";

interface PageTitleProps extends PageModalState {
    title?: string;
}

export function PageTitle(props: PropsWithChildren<PageTitleProps>) {
    const { title, pageModalState, children } = props;
    return (
        <div className="ro-page-header">
            <div>{title}</div>
            <div className="ro-header-btns">
                <div>{children}</div>
                <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                        pageModalState.setViewState({ open: true });
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
