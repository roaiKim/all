import { connect, type DispatchProp } from "react-redux";
// import { roPushHistory } from "@core";
import { Input, Menu } from "antd";
import classNames from "classnames";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { When } from "components/when";
import { header_height } from "config/static-constant";
import { actions } from "module/common/menus";
import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import logoUrl from "asset/image/logo.svg";
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

    console.log("--menus--", menus);

    return (
        <div className={classNames(joinLessPrefix("menus-module"), { collapsed })}>
            <div className={joinLessPrefix("menus-logo")} style={{ height: header_height }}>
                <img src={logoUrl} alt="roaikim" width={200} height={46} />
            </div>
            <When when={!collapsed}>
                <div className={joinLessPrefix("menus-search")}>
                    <Input.Search></Input.Search>
                </div>
            </When>
            <div className={joinLessPrefix("menus-nav")}>
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
