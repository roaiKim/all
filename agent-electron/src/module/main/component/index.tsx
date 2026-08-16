import { useEffect, useState } from "react";
import { connect, type DispatchProp } from "react-redux";
import { useLoadingStatus } from "@core";
import { ConfigProvider } from "antd";
import { tabTypeModule } from "@project/config";
import { cssToken } from "asset/styles/css-config";
import { PageLoading } from "components/page-loading";
import { SolarLoading } from "components/solar-loading";
import { When } from "components/when";
import { lessPrefixName } from "config/static-constant";
import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import { removeMainLoading } from "utils/framework/remove-main-loading";
import MultiplePage from "./multiple-page";
import SinglePage from "./single-page";
import "./index.less";

interface MainProps extends DispatchProp, ReturnType<typeof mapStateToProps> {}

function Main(props: MainProps) {
    const mainLoading = useLoadingStatus("main");
    const { appLoadingStatus } = props;
    const [initialed, setInitialed] = useState(false);

    useEffect(() => {
        if (appLoadingStatus === "done" || appLoadingStatus === "error") {
            setInitialed(true);
            removeMainLoading();
        }
    }, [appLoadingStatus]);

    return (
        <ConfigProvider prefixCls={lessPrefixName} theme={{ cssVar: { prefix: lessPrefixName }, token: cssToken }}>
            <When when={initialed}>
                <div className={`${joinLessPrefix("main-module")}`}>
                    <PageLoading show={mainLoading} theme="light" />
                    {tabTypeModule === "multiple" ? <MultiplePage /> : <SinglePage />}
                </div>
            </When>
        </ConfigProvider>
    );
}

const mapStateToProps = (state: RootState) => ({
    appLoadingStatus: state.app.main.appLoadingStatus,
});

export default connect(mapStateToProps)(Main);
