import classNames from "classnames";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

interface HeaderTabCardProps<T = any> {
    activeId: string;
    tab: T;
    onClick: (tab: T) => void;
    onClose: (tab: T) => void;
}

export function HeaderTabCard(props: HeaderTabCardProps) {
    const { activeId, tab, onClick, onClose } = props;
    const isActive = tab.id === activeId;

    return (
        <button
            className={classNames(joinLessPrefix("header-tabs-tab"), joinLessPrefix("header-mimicry"), {
                "is-active": isActive,
            })}
            onClick={() => onClick(tab)}
        >
            <span className={joinLessPrefix("header-tabs-tab-top")}></span>
            <span className={joinLessPrefix("header-tabs-tab-title")}>{tab.title}</span>
            <div
                className={joinLessPrefix("header-tabs-tab-close")}
                aria-label={`关闭 ${tab.title}`}
                onClick={(event) => {
                    event.stopPropagation();
                    onClose(tab);
                }}
            >
                <span className={joinLessPrefix("header-tabs-tab-close-dot")}></span>
                <span className={joinLessPrefix("header-tabs-tab-close-x")}>×</span>
            </div>
        </button>
    );
}
