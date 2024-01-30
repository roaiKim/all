import { useEffect, useMemo } from "react";
import { connect, DispatchProp } from "react-redux";
import { roPushHistory, Route, showLoading } from "@core";
import { Button, TabBar } from "antd-mobile";
import { Switch } from "react-router-dom";
import { RootState } from "type/state";
import { modules } from "utils/function/loadComponent";
import { MenuIcon } from "utils/MenuIcon";
import BodyContainer from "./main";
import "./index.less";

interface MainProps extends DispatchProp, ReturnType<typeof mapStateToProps> {}

function Main(props: MainProps) {
    const tabBars = useMemo(() => {
        return modules?.filter((item) => item.bar);
    }, [modules]);

    return (
        <div className="ro-app-container">
            <div className="ro-page-container">
                <Switch>
                    {/* <Route path="/login" component={LoginComponent} /> */}
                    {modules.map((module) => (
                        <Route key={module.name} path={module.path} component={module.component} />
                    ))}
                </Switch>
            </div>
            <div className="ro-tabbar-container">
                <TabBar
                    onChange={(key) => {
                        const bar = tabBars.find((item) => item.name === key);
                        if (bar) {
                            roPushHistory(key);
                        }
                    }}
                >
                    {tabBars.map((module) => {
                        return <TabBar.Item key={module.name} icon={MenuIcon[module.name]} title={module.title} />;
                    })}
                </TabBar>
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        globalLoading: showLoading(state), // 全局loading
        PERMISSION_DONE: state.app.main.PERMISSION_DONE,
    };
};

export default connect(mapStateToProps)(Main);
