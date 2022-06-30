import { CloseOutlined } from "@icon";

interface HeaderTabProps {
    name: number;
}

export function HeaderTab(props: HeaderTabProps) {
    const { name } = props;
    return (
        <div className="ro-header-tab-item ro-flex">
            <div className="ro-tab-trapezoid"></div>
            <span className="ro-tab-title">项目管理{name}</span>
            <CloseOutlined />
        </div>
    );
}
