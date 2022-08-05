import { arrayMoveImmutable } from "array-move";
import React, { useState } from "react";
import { SortableTabs } from "./HeaderTab";
import logoimg from "asset/images/global/logoimg.png";
import { connect } from "react-redux";
import { RootState } from "type/state";
import { State } from "../type";
import "./index.less";

interface HeaderProps {
    headerTabs: State["headerTabs"];
}

function Header(props: HeaderProps) {
    // const [activeKey, setActiveKey] = useState<string>();
    // const [tabs, setTabs] = useState<string[]>(["客户管理", "项目管理", "路由管理", "承运路线", "车辆调度", "运单管理"]);
    const { headerTabs } = props;
    const onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex === newIndex) return;
        // setTabs((prevTabs) => arrayMoveImmutable(prevTabs, oldIndex, newIndex));
    };

    return (
        <header className="ro-header-module ro-flex">
            <div className="ro-header-logo ro-flex ro-col-center">
                <img alt="logo" src={logoimg} />
                <div className="text-overflow-ellipsis">中集冷云综合服务平台</div>
            </div>
            <SortableTabs
                axis="x"
                lockAxis="x"
                lockOffset="0%"
                lockToContainerEdges
                hideSortableGhost
                distance={10}
                onSortEnd={onSortEnd}
                helperClass="ro-header-tab-help-sort"
                tabs={headerTabs}
                activeKey={""}
                onClick={() => {}}
            />
            <div className="ro-header-operate"></div>
        </header>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        headerTabs: state.app.header.headerTabs,
    };
};

export default connect(mapStateToProps)(Header);
