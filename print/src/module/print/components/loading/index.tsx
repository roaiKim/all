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

interface LoadingProps {
    text?: string;
}

export const Loading = (props: LoadingProps) => {
    const { text = "加载中" } = props;
    // 配置加载条数量和延迟
    const barCount = 6;
    const baseDelay = 0.1;

    return (
        <div className="scale-stage">
            <span className="scale-loader">
                {Array.from({ length: barCount }).map((_, index) => (
                    <span key={index} className={`scale-loader-bar scale-loader-bar-${index + 1}`} />
                ))}
            </span>
            <p className="scale-text">{text}</p>
        </div>
    );
};
