import { connect, DispatchProp } from "react-redux";
import { showLoading } from "@core";
import { useLocation, useParams } from "react-router-dom";
import { DevelopingModule, GlobalMask } from "components/common";
import { HeaderComponent } from "module/common/header/type";
import { actions } from "module/common/main";
import { MenuComponent } from "module/common/menus/type";
import { RootState } from "type/state";
import { cache } from "utils/function/loadComponent";
import "./index.less";

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
        title = "数据加载中请稍后...";
    } else if (PERMISSION_DONE === false && !PERMISSION_LOADING) {
        title = <div style={{ color: "red" }}>数据加载失败，请稍后重试</div>;
        permissionError = true;
    } else if (globalLoading) {
        title = "Loading...";
    }

    const reFetchByError = () => {
        dispatch(actions.fetchPermission());
    };

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
