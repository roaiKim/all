import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { connect, DispatchProp } from "react-redux";
import { RootState } from "type/state";
import { actions } from "module/common/menus";
import { State } from "../type";
import "./index.less";

interface MeunComponentProps extends DispatchProp {
    menus: State["menus"];
    collapsed: State["collapsed"];
}

function MeunComponent(props: MeunComponentProps) {
    const { menus, collapsed, dispatch } = props;

    return (
        <menu className={`ro-meuns-module ${!collapsed ? "collapsed" : ""}`}>
            <div className="ro-meuns-container">
                <Menu
                    onClick={(a) => {
                        console.log(a);
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
});

export default connect(mapStateToProps)(MeunComponent);
