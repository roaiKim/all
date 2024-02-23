interface PageEmptyProps {
    error: boolean;
    title?: string;
    titleError?: string;
    handlerName?: string;
    handler?: () => void | Promise<void>;
    style?: React.CSSProperties;
}

export function pageEmpty(props: PageEmptyProps) {
    const { titleError = "数据加载错误", title = "暂无数据", handlerName = "重新加载", error, handler, style = {} } = props;
    let nodeTitle = <div>{title}</div>;
    if (error) {
        nodeTitle = (
            <div>
                {titleError}, 点击
                <a
                    onClick={() => {
                        handler && handler();
                    }}
                >
                    {handlerName}
                </a>
                .
            </div>
        );
    }
    return (
        <div className="ro-page-empty" style={style}>
            {nodeTitle}
        </div>
    );
}
