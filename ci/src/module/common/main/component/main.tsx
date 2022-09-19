import { HeaderComponent, HeaderTab } from "module/common/header/type";
import { MenuComponent } from "module/common/menus/type";
import { cacheModules, cache } from "utils/function/loadComponent";
import { DevelopingModule, GlobalMask } from "components/common";
import { connect, DispatchProp, useDispatch } from "react-redux";
import { RootState } from "type/state";
import "./index.less";
import { Route, showLoading } from "@core";
import { Switch, useLocation, useParams } from "react-router-dom";
import { actions } from "module/common/main";

interface BodyContainerProps extends DispatchProp, ReturnType<typeof mapStateToProps> {
    PERMISSION_DONE: boolean;
}

function BodyContainer(props: BodyContainerProps) {
    const { tabs, activeTabName, globalLoading, PERMISSION_DONE, PERMISSION_LOADING, dispatch } = props;

    const location = useLocation();
    const params = useParams();

    let title = null;
    let permissionError = false;
    if (PERMISSION_DONE === null || PERMISSION_LOADING) {
        title = "权限数据加载中请稍后...";
    } else if (PERMISSION_DONE === false && !PERMISSION_LOADING) {
        title = <div style={{ color: "red" }}>权限数据加载失败，请稍后重试</div>;
        permissionError = true;
    } else if (globalLoading) {
        title = "Loading...";
    }

    const reFetchByError = () => {
        dispatch(actions.fetchPermission());
    };

    // if (PERMISSION_DONE === false && !PERMISSION_LOADING) {
    //     title = "权限数据加载失败，请稍后重试";
    // }

    // console.log("--location=params--", location, params);
    return (
        <GlobalMask
            loading={!PERMISSION_DONE || globalLoading}
            refresh={permissionError ? reFetchByError : undefined}
            loadingRender={PERMISSION_DONE}
            title={title}
        >
            <div className="ro-body-container">
                <HeaderComponent />
                <div className="ro-main-body">
                    <MenuComponent />
                    <main className="ro-module-body">
                        {tabs?.map((item) => {
                            const { key } = item;
                            const module = cache[key];
                            const hidden = activeTabName !== key;
                            if (module) {
                                const { component } = module.module || {};
                                const MainComponent = component;
                                return (
                                    <div key={key} className={`ro-g-container-module ${hidden ? "" : "active-module"}`}>
                                        <MainComponent location={location} match={params} hidden={activeTabName !== key} />
                                    </div>
                                );
                            }
                            return <DevelopingModule key={key} hidden={hidden} />;
                        })}
                    </main>
                </div>
            </div>
        </GlobalMask>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        tabs: state.app.header?.headerTabs,
        activeTabName: state.app.header?.activeTabName,
        globalLoading: showLoading(state),
        PERMISSION_LOADING: showLoading(state, "PERMISSION"),
        PERMISSION_DONE: state.app.main.PERMISSION_DONE,
    };
};

export default connect(mapStateToProps)(BodyContainer);
