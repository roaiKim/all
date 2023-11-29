import React from "react";
import { connect, DispatchProp } from "react-redux";
import { Dropdown } from "antd";
import { arrayMoveImmutable } from "array-move";
import { DownOutlined, EditOutlined, InfoCircleOutlined, PoweroffOutlined, RightOutlined } from "@ant-design/icons";
import { WEB_USERNAME } from "config/static-envs";
import { actions } from "module/common/header/module";
import { actions as MainActions } from "module/common/main";
import { RootState } from "type/state";
import { StorageService } from "utils/StorageService";
import logoimg from "asset/images/global/logoimg.png";
import { SortableTabs } from "./HeaderTab";
import "./index.less";

interface HeaderProps extends DispatchProp, ReturnType<typeof mapStateToProps> {}

const headerOperate = [
    {
        label: <div>admin</div>,
        key: "0",
    },
    {
        type: "divider",
        key: "1",
    },
    {
        icon: <EditOutlined />,
        label: (
            <div>
                个人资料
                <RightOutlined />
            </div>
        ),
        key: "3",
    },
    {
        icon: <InfoCircleOutlined />,
        label: <div>关于</div>,
        key: "4",
    },
    {
        icon: <InfoCircleOutlined />,
        label: <div>开发环境</div>,
        key: "5",
    },
    {
        icon: <PoweroffOutlined />,
        label: <div>注销</div>,
        key: "6",
    },
];

function Header(props: HeaderProps) {
    const { headerTabs, activeTabName, dispatch, userName } = props;

    const onSortEnd = ({ oldIndex, newIndex }) => {
        if (oldIndex === newIndex || newIndex === 0) return;
        const tabs = arrayMoveImmutable(headerTabs, oldIndex, newIndex);
        dispatch(actions.sortHeaderTabs(tabs));
    };

    const operateClick = ({ key }) => {
        // console.log("--item", item);
        // 注销
        if (key === "6") {
            dispatch(MainActions.logoutWithConfirm());
        }
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
            <div className="ro-header-operate">
                <Dropdown menu={{ items: headerOperate, onClick: operateClick }}>
                    <a onClick={(e) => e.preventDefault()}>
                        {userName}
                        <DownOutlined />
                    </a>
                </Dropdown>
            </div>
        </header>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        headerTabs: state.app.header.headerTabs,
        activeTabName: state.app.header.activeTabName,
        userName: StorageService.get<string>(WEB_USERNAME),
    };
};

export default connect(mapStateToProps)(Header);
