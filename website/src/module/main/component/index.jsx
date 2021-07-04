import React from "react";
import { connect } from "react-redux";
import { showLoading, Route } from "core";
import { Button, message } from "antd";
import { Switch } from "react-router-dom";
import Login from "module/login/user";
import { actions } from "module/main";
import { Loading } from "@component";
import MainLayout from "./MainLayout";
import "./index.less";

class Main extends React.PureComponent {

    refreshTime = 0

    constructor(props) {
        super(props);
        this.state = {
            content: null,
        };
    }

    componentDidMount() {
        // 3秒之后可以刷新
        setTimeout(() => {
            this.setState({ content: "刷新" });
        }, 3000);
    }

    refresh = () => {
        if (this.refreshTime >= 5) {
            message.destroy();
            message.info("操作频繁，请30s后再试！");
            if (!this.timer) {
                this.timer = setTimeout(() => {
                    this.refreshTime = 0;
                    this.timer = 0;
                }, 30000);
            }
            return;
        }
        const { dispatch } = this.props;
        dispatch(actions.fetchLoginUser());
        this.refreshTime += 1;
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {

        const { content } = this.state;
        const { isCheckLoading } = this.props;
        // isCheckLoading 为 true, 说明 check 接口未返回或者失败
        if (isCheckLoading) {
            return (
                <Loading>
                    <Button type="link" onClick={this.refresh}>{content}</Button>
                </Loading>
            );
        }
        return (
            <Switch>
                <Route path="/login" component={Login.Component} />
                <Route component={MainLayout} />
            </Switch>
        );
    }

}

const mapStateToProps = (state) => ({
    record: state.app.main.record,
    website: state.website,
    isCheckLoading: showLoading(state, "check"),
});

export default connect(mapStateToProps)(Main);
