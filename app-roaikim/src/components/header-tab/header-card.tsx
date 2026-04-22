import classNames from "classnames";
import { joinLessPrefix } from "utils/framework";

interface HeaderTabCardProps {
    activeId: string;
    tab: any;
}

export function HeaderTabCard(props: HeaderTabCardProps) {
    const { activeId, tab } = props;
    const isActive = tab.id === activeId;

    return (
        <button
            className={classNames(joinLessPrefix("header-tabs-tab"), {
                "is-active": isActive,
            })}
            onClick={() => {}}
        >
            <span className={joinLessPrefix("header-tabs-tab-top")}></span>
            <span className={joinLessPrefix("header-tabs-tab-title")}>{tab.title}</span>
            <div
                className={joinLessPrefix("header-tabs-tab-close")}
                aria-label={`关闭 ${tab.title}`}
                onClick={(event) => {
                    event.stopPropagation();
                }}
            >
                <span className={joinLessPrefix("header-tabs-tab-close-dot")}></span>
                <span className={joinLessPrefix("header-tabs-tab-close-x")}>×</span>
            </div>
        </button>
    );
}
