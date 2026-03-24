import React, { type PropsWithChildren } from "react";
import { joinLessPrefix } from "utils/framework";
import { LoadingSVG } from "./loading-svg";

interface Props {
    title?: string | React.ReactNode;
    loading?: boolean;
    backgroundColor?: string;
    initialized?: boolean;
    refresh?: () => void;
}

export function GlobalMask(props: PropsWithChildren<Props>) {
    const { title, loading, children, backgroundColor = "#fff", initialized, refresh } = props;

    return (
        <React.Fragment>
            <div className={joinLessPrefix("global-mask")} style={{ backgroundColor, display: loading ? "block" : "none" }}>
                <div
                    className={`${joinLessPrefix("develop-module")} ${joinLessPrefix("flex")} ${joinLessPrefix("center")} ${joinLessPrefix("height-100")}`}
                >
                    <LoadingSVG>
                        <div>
                            {title}
                            {refresh && (
                                <p onClick={refresh} className={joinLessPrefix("a-action")}>
                                    重试
                                </p>
                            )}
                        </div>
                    </LoadingSVG>
                </div>
            </div>
            {initialized ? children : null}
        </React.Fragment>
    );
}
