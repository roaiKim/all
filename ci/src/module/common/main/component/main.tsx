import { connect, DispatchProp } from "react-redux";
import { roDispatchAction, showLoading } from "@core";
import { RouteComponentProps } from "react-router-dom";
import { DevelopingModule, GlobalMask } from "components/common";
import { HeaderComponent, HeaderTabType } from "module/common/header/type";
import { actions } from "module/common/main";
import { MenuComponent } from "module/common/menus/type";
import { RootState } from "type/state";
import { modulesCache } from "utils/function/loadComponent";
import "./index.less";

interface BodyContainerProps extends DispatchProp, RouteComponentProps<any>, ReturnType<typeof mapStateToProps> {
    PERMISSION_DONE: boolean;
}

const refreshWhenError = () => {
    roDispatchAction(actions.fetchPermission());
};

function BodyContainer(props: BodyContainerProps) {
    const { headerTabs, activeTabName, globalLoading, PERMISSION_DONE, PERMISSION_LOADING, location, match } = props;

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

    return (
        <GlobalMask
            loading={!PERMISSION_DONE || globalLoading}
            refresh={permissionError ? refreshWhenError : undefined}
            initialized={PERMISSION_DONE}
            title={title}
        >
            <div className="ro-body-container">
                <HeaderComponent />
                <div className="ro-main-body">
                    <MenuComponent />
                    <main className="ro-module-body">
                        {headerTabs?.map((item) => {
                            const { key, type, label } = item;
                            const module = modulesCache[key];
                            const hidden = activeTabName !== key;
                            if (type === HeaderTabType.A && module) {
                                const { component } = module.module || {};
                                const MainComponent = component;
                                return (
                                    <div key={key} className={`ro-g-container-module ${hidden ? "" : "active-module"}`}>
                                        <MainComponent location={location} match={match?.params} hidden={activeTabName !== key} />
                                    </div>
                                );
                            }
                            return <DevelopingModule tabItem={item} key={key} hidden={hidden} />;
                        })}
                    </main>
                </div>
            </div>
        </GlobalMask>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        headerTabs: state.app.header?.headerTabs,
        activeTabName: state.app.header?.activeTabName,
        globalLoading: showLoading(state),
        PERMISSION_LOADING: showLoading(state, "PERMISSION"),
        PERMISSION_DONE: state.app.main.PERMISSION_DONE,
    };
};

export default connect(mapStateToProps)(BodyContainer);

/* 
PERMISSION_DONE; 权限数据加载是否成功

PERMISSION_LOADING;  // 权限数据是否完成
 */
