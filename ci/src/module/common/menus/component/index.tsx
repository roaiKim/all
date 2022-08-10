import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { connect, DispatchProp } from "react-redux";
import { RootState } from "type/state";
import { actions } from "module/common/menus";
import { actions as HeaderActions } from "module/common/header/module";
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
                        dispatch(HeaderActions.pushTab(key));
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
    menus: state.app.menus.menus,
    collapsed: state.app.menus.collapsed,
    activeName: state.app.header.activeTabName,
});

export default connect(mapStateToProps)(MeunComponent);
