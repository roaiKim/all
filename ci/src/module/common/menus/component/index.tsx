import { connect, DispatchProp } from "react-redux";
import { roPushHistory } from "@core";
import { Menu } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { actions } from "module/common/menus";
import { RootState } from "type/state";
import { pathToModules } from "utils/function/loadComponent";
import { State } from "../type";
import "./index.less";

interface MeunComponentProps extends DispatchProp {
    menus: State["menus"];
    collapsed: State["collapsed"];
    activeName: string;
}

function MeunComponent(props: MeunComponentProps) {
    const { menus, collapsed, activeName, dispatch } = props;

    return (
        <menu className={`ro-meuns-module ${!collapsed ? "collapsed" : ""}`}>
            <div className="ro-meuns-container">
                <Menu
                    selectedKeys={[activeName || "home"]}
                    onClick={({ key }) => {
                        roPushHistory(pathToModules[key] || "no-found");
                    }}
                    items={menus || []}
                    mode="inline"
                    inlineCollapsed={collapsed}
                />
            </div>
            <div
                className="ro-meuns-collapsed"
                onClick={() => {
                    dispatch(actions.toggleCollapsed(!collapsed));
                }}
            >
                {collapsed ? <RightOutlined /> : <LeftOutlined />}
            </div>
        </menu>
    );
}

const mapStateToProps = (state: RootState) => ({
    // menus: state.app.menus.menus,
    menus: state.app.main?.navPermission,
    collapsed: state.app.menus.collapsed,
    activeName: state.app.header.activeTabName,
});

export default connect(mapStateToProps)(MeunComponent);
