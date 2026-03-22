import { connect, type DispatchProp, useStore } from "react-redux";
import { BrowserRouter, Route, Routes, useParams } from "react-router";
import { showLoading, useLoadingStatus } from "@core";
import { ConfigProvider } from "antd";
// import { Switch } from "react-router-dom";
import zhCN from "antd/locale/zh_CN";
import { Spinning } from "components/common";
import { SolarLoading } from "components/solar-loading";
// import { antdCSSComponentToken } from "asset/theme/antd-component-token";
// import { antdCSSToken } from "asset/theme/antd-token";
import { LoginComponent } from "module/common/login/type";
import type { RootState } from "type/rootState";
import MainLayout from "./main";
// import BodyContainer from "./main";
// import "./index.less";

interface MainProps extends DispatchProp, ReturnType<typeof mapStateToProps> {}

function Main(props: MainProps) {
    const mainLoading = useLoadingStatus("main");
    const { appLoadingStatus } = props;

    return (
        <div className="ro-main-container">
            {/* <Spinning text={"加载中"} loading={mainLoading} /> */}
            <SolarLoading text="正在启动" loading={mainLoading} theme="light" />
            {/* <PageLoading text={"加载中"} show={true} /> */}
            <Routes>
                <Route path="/login/:id?" element={<LoginComponent></LoginComponent>} />
                <Route path="*" element={<MainLayout></MainLayout>} />
            </Routes>
        </div>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        appLoadingStatus: state.app.main.appLoadingStatus,
    };
};

export default connect(mapStateToProps)(Main);
