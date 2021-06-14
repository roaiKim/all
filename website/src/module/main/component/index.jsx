import React from "react";
import { connect } from "react-redux";
import { showLoading, Route } from "core";
import { Button, message } from "antd";
import { Switch } from "react-router-dom";
import Login from "module/login/user";
import { actions } from "module/main";
import Loading from "aComponent/Loading";
import MainLayout from "./MainLayout";
import "./index.less";

class Main extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {

            // bodyHeight: document.body.clientHeight || 0,
        };
    }

    refreshTime = 0

    refresh = () => {
        console.log("this.refreshTime", this.refreshTime);
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

        // const { bodyHeight } = this.state;
        const { website, isCheckLoading } = this.props;

        // isCheckLoading 为 true, 说明 check 接口失败
        if (isCheckLoading) {
            return (
                <Loading>
                    <Button type="link" onClick={this.refresh}>刷新</Button>
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
