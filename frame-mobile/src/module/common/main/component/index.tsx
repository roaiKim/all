import { useMemo } from "react";
import { connect, DispatchProp } from "react-redux";
import { roPushHistory, Route, showLoading } from "@core";
import { TabBar } from "antd-mobile";
import { Switch } from "react-router-dom";
import { RootState } from "type/state";
import { modules } from "utils/function/loadComponent";
import { MenuIcon } from "utils/MenuIcon";
import "./index.less";

interface MainProps extends DispatchProp, ReturnType<typeof mapStateToProps> {}

function Main(props: MainProps) {
    const { pagesLoading } = props;

    const tabBars = useMemo(() => {
        return modules?.filter((item) => item.bar);
    }, [modules]);

    return (
        <div className="ro-app-container">
            <div className="ro-page-container">
                <Switch>
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
        pagesLoading: showLoading(state, "main"), // 全局loading
    };
};

export default connect(mapStateToProps)(Main);
