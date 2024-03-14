import { connect, DispatchProp } from "react-redux";
import { Route, showLoading } from "@core";
import { ConfigProvider } from "antd";
import { Switch } from "react-router-dom";
import zhCN from "antd/locale/zh_CN";
import { antdCSSComponentToken } from "asset/theme/antd-component-token";
import { antdCSSToken } from "asset/theme/antd-token";
import { LoginComponent } from "module/common/login/type";
import { RootState } from "type/state";
import BodyContainer from "./main";
import "./index.less";

interface MainProps extends DispatchProp, ReturnType<typeof mapStateToProps> {}

function Main(props: MainProps) {
    return (
        <ConfigProvider
            theme={{
                // cssVar: { prefix: "ro" },
                token: antdCSSToken,
                components: antdCSSComponentToken,
            }}
            locale={zhCN}
            componentSize="small"
        >
            <div className="ro-main-container">
                <Switch>
                    <Route path="/login" component={LoginComponent}></Route>
                    <Route component={BodyContainer}></Route>
                </Switch>
            </div>
        </ConfigProvider>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        globalLoading: showLoading(state), // 全局loading
        PERMISSION_DONE: state.app.main.PERMISSION_DONE,
    };
};

export default connect(mapStateToProps)(Main);
