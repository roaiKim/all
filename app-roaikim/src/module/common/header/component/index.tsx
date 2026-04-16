import React from "react";
import { connect, type DispatchProp } from "react-redux";
import { Dropdown } from "antd";
// import { arrayMoveImmutable } from "array-move";
import { DownOutlined, EditOutlined, InfoCircleOutlined, PoweroffOutlined, RightOutlined } from "@ant-design/icons";
import { BookmarkTabs } from "components/bookmark-tabs";
import { HeaderTabs } from "components/header-tab";
// import { BookmarkTabCard } from "components/bookmark-tabs/bookmark-tab-card";
import { header_height, WEB_USERNAME } from "config/static-constant";
import { actions } from "module/common/header/index";
import { actions as MainActions } from "module/common/main";
import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
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

const items = [
    {
        key: "1",
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                1st menu item
            </a>
        ),
    },
    {
        key: "2",
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                2nd menu item
            </a>
        ),
    },
    {
        key: "3",
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
                3rd menu item
            </a>
        ),
    },
];

function Header(props: HeaderProps) {
    const { headerTabs, activeTabName, dispatch, userName } = props;

    const onSortEnd = ({ oldIndex, newIndex }) => {
        // if (oldIndex === newIndex || newIndex === 0) return;
        // const tabs = arrayMoveImmutable(headerTabs, oldIndex, newIndex);
        // dispatch(actions.sortHeaderTabs(tabs));
    };

    const operateClick = ({ key }) => {
        // console.log("--item", item);
        // 注销
        if (key === "6") {
            dispatch(MainActions.logoutWithConfirm());
        }
    };

    return (
        <header className={joinLessPrefix("header-module")}>
            <div className={joinLessPrefix("main-header")} style={{ minHeight: header_height }}>
                <HeaderTabs />
            </div>
            <div className="ro-header-operate">
                ff
                <Dropdown menu={{ items, onClick: operateClick }}>
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
