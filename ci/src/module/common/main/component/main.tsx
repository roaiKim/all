import { HeaderComponent, HeaderTab } from "module/common/header/type";
import { MenuComponent } from "module/common/menus/type";
import { cacheModules, cache } from "utils/function/loadComponent";
import { DevelopingModule } from "components/common";
import { connect, DispatchProp } from "react-redux";
import { RootState } from "type/state";
import "./index.less";
import { showLoading } from "@core";

interface BodyContainerProps extends DispatchProp, ReturnType<typeof mapStateToProps> {}

function BodyContainer(props: BodyContainerProps) {
    const { tabs, activeTabName, globalLoading } = props;

    return (
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
                                    <MainComponent hidden={activeTabName !== key} />
                                </div>
                            );
                        }
                        return <DevelopingModule key={key} hidden={hidden} />;
                    })}
                </main>
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        tabs: state.app.header?.headerTabs,
        activeTabName: state.app.header?.activeTabName,
        globalLoading: showLoading(state),
    };
};

export default connect(mapStateToProps)(BodyContainer);
