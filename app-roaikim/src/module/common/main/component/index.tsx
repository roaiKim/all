import { useEffect } from "react";
import { connect, type DispatchProp, useStore } from "react-redux";
import { BrowserRouter, Route, Routes, useParams } from "react-router";
import { showLoading, useLoadingStatus } from "@core";
import { ConfigProvider } from "antd";
// import { Switch } from "react-router-dom";
import zhCN from "antd/locale/zh_CN";
import { Spinning } from "components/common";
import { PageLoading } from "components/page-loading";
import { SolarLoading } from "components/solar-loading";
import { lessPrefixName } from "config/static-constant";
// import { antdCSSComponentToken } from "asset/theme/antd-component-token";
// import { antdCSSToken } from "asset/theme/antd-token";
import { LoginComponent } from "module/common/login/type";
import type { RootState } from "type/rootState";
import { removeMainLoading } from "utils/framework/remove-main-loading";
import MainLayout from "./main";
// import BodyContainer from "./main";
// import "./index.less";

interface MainProps extends DispatchProp, ReturnType<typeof mapStateToProps> {}

function Main(props: MainProps) {
    const mainLoading = useLoadingStatus("main");
    const { appLoadingStatus } = props;

    useEffect(() => {
        if (appLoadingStatus === "done" || appLoadingStatus === "error") {
            // 去除 loading
            removeMainLoading();
        }
    }, [appLoadingStatus]);

    return (
        <div className={`${lessPrefixName}-page ro-main-container`}>
            {/* <Spinning text={"加载中"} loading={mainLoading} /> */}
            {/* <SolarLoading text="正在启动" loading={mainLoading} theme="light" /> */}
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
