import React from "react";
import {
    MenuFoldOutlined, ExpandOutlined, SettingOutlined, BellOutlined,
} from "@icon";
import {
    Input, Badge, Dropdown, Menu,
} from "antd";
import { actions } from "module/main";
import { WithConfirm } from "@tools";
import { connect } from "react-redux";

class Header extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {

        };
        this.logOut = this.logOut.bind(this);
    }

    toggleCollapseMenu = () => {
        const { dispatch } = this.props;
        dispatch(actions.toggleCollapseMenu());
    }

    @WithConfirm("确认要退出吗?")
    logOut() {
        const { dispatch } = this.props;
        dispatch(actions.logOut());
    }

    menu = () => (
        <Menu>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                    个人信息
                </a>
            </Menu.Item>
            <Menu.Item danger onClick={this.logOut}>退出</Menu.Item>
        </Menu>
    )

    render() {
        return (
            <header className="ro-main-header">
                <div className="ro-icon ro-left-aside">
                    <MenuFoldOutlined onClick={this.toggleCollapseMenu} />
                    <ExpandOutlined />
                </div>
                <div className="ro-icon ro-right-aside ro-flex ro-align-items">
                    <Input placeholder="Select" />
                    <Badge size="small" count={5} overflowCount={99} offset={[-10, 10]}>
                        <BellOutlined />
                    </Badge>
                    <a href="#" className="ro-profile">
                        <span>rosen</span>
                        <img alt="" src={require("asset/images/global/header.jpg")} />
                    </a>
                    <Dropdown overlay={this.menu()} trigger="click">
                        <SettingOutlined />
                    </Dropdown>
                </div>
            </header>
        );
    }

}

export default connect()(Header);
