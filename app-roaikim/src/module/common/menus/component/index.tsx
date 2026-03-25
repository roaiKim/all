import { connect, type DispatchProp } from "react-redux";
// import { roPushHistory } from "@core";
import { Input, Menu } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { header_height } from "config/static-constant";
import { actions } from "module/common/menus";
import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
// import { nameToPath, pathToName } from "utils/function/loadComponent";
import type { State } from "../type";
import "./index.less";

interface MeunComponentProps extends DispatchProp {
    menus: State["menus"];
    collapsed: State["collapsed"];
    activeName: string;
}

function MeunComponent(props: MeunComponentProps) {
    const { menus, collapsed, activeName, dispatch } = props;

    // const selectKey = nameToPath[activeName] || activeName;

    return (
        // <menu className={`ro-meuns-module ${!collapsed ? "collapsed" : ""}`}>
        //     <div className="ro-meuns-container">
        //         <Menu
        //             // selectedKeys={[selectKey || "home"]}
        //             onClick={({ key = "" }) => {
        //                 // 是否有 模块path
        //                 // const path = pathToName[key];
        //                 // roPushHistory(path || key);
        //             }}
        //             items={menus || []}
        //             mode="inline"
        //             inlineCollapsed={collapsed}
        //         />
        //     </div>
        //     <div
        //         className="ro-meuns-collapsed"
        //         onClick={() => {
        //             dispatch(actions.toggleCollapsed(!collapsed));
        //         }}
        //     >
        //         {collapsed ? <RightOutlined /> : <LeftOutlined />}
        //     </div>
        // </menu>
        <div className={joinLessPrefix("menus-module")}>
            <div className={joinLessPrefix("main-logo")} style={{ height: header_height }}>
                lgoo
            </div>
            <div>
                <Input.Search></Input.Search>
            </div>
            <div className={joinLessPrefix("main-nav")}>
                <div className={joinLessPrefix("meuns-container")}>
                    <Menu
                        // selectedKeys={[selectKey || "home"]}
                        onClick={({ key = "" }) => {
                            // 是否有 模块path
                            // const path = pathToName[key];
                            // roPushHistory(path || key);
                        }}
                        items={menus || []}
                        mode="inline"
                        inlineCollapsed={collapsed}
                    />
                </div>
            </div>
            <div
                className={joinLessPrefix("meuns-collapsed")}
                onClick={() => {
                    dispatch(actions.toggleCollapsed(!collapsed));
                }}
            >
                {collapsed ? <RightOutlined /> : <LeftOutlined />}
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    // menus: state.app.menus.menus,
    menus: state.app.main?.navPermission,
    collapsed: state.app.menus.collapsed,
    // activeName: state.app.header.activeTabName,
});

export default connect(mapStateToProps)(MeunComponent);
