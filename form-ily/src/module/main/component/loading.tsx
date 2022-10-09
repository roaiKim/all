import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { showLoading, Route } from "@core";
import { Switch } from "react-router-dom";
import { Button, message } from "antd";
import { Loading } from "components/loading";

export default function () {
    const ref = useRef<{ counts: number; timer: NodeJS.Timeout | null; time: number }>({
        counts: 0,
        timer: null,
        time: 0,
    });
    const [content, setContent] = useState("");

    useEffect(() => {
        // 3秒之后可以刷新
        setTimeout(() => {
            setContent("努力加载中...");
        }, 3000);
    }, []);

    const refresh = () => {
        if (ref.current.counts >= 5) {
            if (!ref.current.time) ref.current.time = Date.now();
            message.destroy();
            const second = Math.floor(30 - (Date.now() - ref.current.time) / 1000);
            message.info(`操作频繁，请${second < 1 ? 1 : second}s后再试！`);
            if (!ref.current.timer) {
                ref.current.timer = setTimeout(() => {
                    ref.current.counts = 0;
                    ref.current.timer = null;
                    ref.current.time = 0;
                }, 30000);
            }
            return;
        }
        // const { dispatch } = this.props;
        // dispatch(actions.fetchLoginUser());
        ref.current.counts += 1;
    };

    return (
        <Loading>
            <Button type="link" onClick={refresh}>
                {content}
            </Button>
        </Loading>
    );
}
