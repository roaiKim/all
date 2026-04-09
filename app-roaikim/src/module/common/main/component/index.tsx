import { useEffect } from "react";
import { connect, type DispatchProp } from "react-redux";
import { Route, Routes } from "react-router";
import { useLoadingStatus } from "@core";
import { ConfigProvider } from "antd";
import { PageLoading } from "components/page-loading";
import { lessPrefixName } from "config/static-constant";
import { LoginComponent } from "module/common/login/type";
import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import { removeMainLoading } from "utils/framework/remove-main-loading";
import MainLayout from "./main";
import "./index.less";

interface MainProps extends DispatchProp, ReturnType<typeof mapStateToProps> {}

function Main(props: MainProps) {
    const mainLoading = useLoadingStatus("main");
    const { appLoadingStatus } = props;

    useEffect(() => {
        if (appLoadingStatus === "done" || appLoadingStatus === "error") {
            removeMainLoading();
        }
    }, [appLoadingStatus]);

    return (
        <ConfigProvider /* prefixCls={lessPrefixName} */>
            <div className={`${joinLessPrefix("main-module")}`}>
                <PageLoading show={mainLoading} theme="light" />
                <Routes>
                    <Route path="/login/:id?" element={<LoginComponent></LoginComponent>} />
                    <Route path="*" element={<MainLayout></MainLayout>} />
                </Routes>
            </div>
        </ConfigProvider>
    );
}

const mapStateToProps = (state: RootState) => ({
    appLoadingStatus: state.app.main.appLoadingStatus,
});

export default connect(mapStateToProps)(Main);
