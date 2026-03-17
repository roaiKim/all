import { connect, type DispatchProp, useStore } from "react-redux";
import { BrowserRouter, Route, Routes, useParams } from "react-router";
import { showLoading } from "@core";
import { ConfigProvider } from "antd";
// import { Switch } from "react-router-dom";
import zhCN from "antd/locale/zh_CN";
// import { antdCSSComponentToken } from "asset/theme/antd-component-token";
// import { antdCSSToken } from "asset/theme/antd-token";
import { LoginComponent } from "module/common/login/type";
import type { RootState } from "type/rootState";
import Login from "./login";
// import BodyContainer from "./main";
// import "./index.less";

interface MainProps extends DispatchProp, ReturnType<typeof mapStateToProps> {}

function Main(props: MainProps) {
    const params = useParams();
    const store = useStore().getState();
    console.log("store-store", store);
    return (
        // <ConfigProvider
        //     theme={{
        //         // cssVar: { prefix: "ro" },
        //         token: antdCSSToken,
        //         components: antdCSSComponentToken,
        //     }}
        //     locale={zhCN}
        //     componentSize="small"
        // >
        <div className="ro-main-container">
            <Routes>
                <Route path="/login/:id?" element={<LoginComponent></LoginComponent>} />
                <Route element={<div>main</div>} />
            </Routes>
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
