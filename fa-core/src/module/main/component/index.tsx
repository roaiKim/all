import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { showLoading, Route } from "@core";
import { Switch } from "react-router-dom";
import { Button, message } from "antd";
import { Loading } from "components/Loading";

export default function () {
    const ref = useRef<{ times: number; timer: NodeJS.Timeout | null }>({ times: 0, timer: null });
    const [content, setContent] = useState("");

    useEffect(() => {
        // 3秒之后可以刷新
        setTimeout(() => {
            setContent("刷新");
        }, 3000);
    }, []);
    // useEffect(() => {
    //     ref.current && (ref.current.times = 0);
    // }, []);

    const refresh = () => {
        if (ref.current.times >= 5) {
            message.destroy();
            message.info("操作频繁，请30s后再试！");
            if (!ref.current.timer) {
                ref.current.timer = setTimeout(() => {
                    ref.current.times = 0;
                    ref.current.timer = null;
                }, 30000);
            }
            return;
        }
        // const { dispatch } = this.props;
        // dispatch(actions.fetchLoginUser());
        ref.current.times += 1;
    };

    return (
        <div>
            <Loading>
                <Button type="link" onClick={refresh}>
                    {content}
                </Button>
            </Loading>
        </div>
    );
}
