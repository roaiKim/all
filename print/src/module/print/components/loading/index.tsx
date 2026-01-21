import "./index.less";

interface WaitingProps {
    text?: string;
}

export function Waiting(props: WaitingProps) {
    const { text = "加载中" } = props;
    return (
        <div className="waiting-stage">
            <span className="waiting-loader">
                <span className="waiting-loader-hand waiting-loader-hand-short"></span>
                <span className="waiting-loader-hand waiting-loader-hand-long"></span>
            </span>
            <p className="waiting-text">{text}</p>
        </div>
    );
}
