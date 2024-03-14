import { useEffect, useRef, useState } from "react";
import { roDispatchAction, roPushHistory } from "@core";
import { actions } from "module/common/header";
import { HeaderTab, HeaderTabType } from "module/common/header/type";

function NoFoundModule(props) {
    const { keyPath } = props;
    const [ms, setMs] = useState(3);
    const timer = useRef(null);

    const autoSkipHome = () => {
        const time = ms - 1;
        if (time < 0) {
            if (timer.current) {
                clearInterval(timer.current);
                timer.current === null;
            }
            roDispatchAction(actions.closeTabByKey(keyPath, "/home"));
        } else {
            timer.current = setTimeout(() => {
                setMs(time);
                autoSkipHome();
            }, 1300);
        }
    };

    useEffect(() => {
        autoSkipHome();
        return () => {
            if (timer.current) {
                clearInterval(timer.current);
                timer.current === null;
            }
        };
    }, [ms]);

    return (
        <h2>
            页面不存在, {ms}秒后
            <a
                onClick={() => {
                    roDispatchAction(actions.closeTabByKey(keyPath, "/home"));
                }}
                style={{ color: "#1677ff", cursor: "pointer" }}
            >
                返回首页
            </a>
        </h2>
    );
}

export function DevelopingModule(props: { tabItem: HeaderTab; hidden: boolean }) {
    const { tabItem, hidden } = props;
    const { type, key, label } = tabItem;

    return (
        <div className={`ro-g-developing-container-module ${hidden ? "" : "active-module"}`}>
            <div className="ro-develop-module ro-flex ro-center ro-height-100">
                <h2></h2>
                {type === HeaderTabType.B ? (
                    <h2>
                        {label} 暂无权限
                        <a
                            onClick={() => {
                                roDispatchAction(actions.closeTabByKey(key, "/home"));
                            }}
                            style={{ color: "#1677ff", cursor: "pointer" }}
                        >
                            返回首页
                        </a>
                    </h2>
                ) : type === HeaderTabType.C ? (
                    <h2>{label} 开发中...</h2>
                ) : type === HeaderTabType.D ? (
                    <NoFoundModule keyPath={key} />
                ) : (
                    <h2>-</h2>
                )}
            </div>
        </div>
    );
}
