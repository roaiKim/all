import { arrayMoveImmutable } from "array-move";
import React, { useState } from "react";
import { actions } from "module/common/header";
import { SortableTabs } from "./HeaderTab";
import logoimg from "asset/images/global/logoimg.png";
import { connect, DispatchProp } from "react-redux";
import { RootState } from "type/state";
import { State } from "../type";
import "./index.less";

interface HeaderProps extends DispatchProp {
    headerTabs: State["headerTabs"];
    activeTabName: string;
}

function Header(props: HeaderProps) {
    const { headerTabs, activeTabName, dispatch } = props;

    const onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex === newIndex || newIndex === 0) return;
        const tabs = arrayMoveImmutable(headerTabs, oldIndex, newIndex);
        dispatch(actions.sortHeaderTabs(tabs));
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
                activeKey={activeTabName}
                onClick={({ key }) => {
                    dispatch(actions.toggleActiveKey(key));
                }}
                onClose={({ key }) => {
                    dispatch(actions.closeTabByKey(key));
                }}
            />
            <div className="ro-header-operate"></div>
        </header>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        headerTabs: state.app.header.headerTabs,
        activeTabName: state.app.header.activeTabName,
    };
};

export default connect(mapStateToProps)(Header);
