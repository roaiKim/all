import React from "react";
import { MenuFoldOutlined, ExpandOutlined, SettingOutlined, BellOutlined, FullscreenExitOutlined } from "@icon";
import { Badge, Dropdown, Menu } from "antd";
import { actions } from "module/navigation";
import { WithConfirm } from "@tools";
import { connect } from "react-redux";
import { TabComponent } from "@component";
import websiteLogoImg from "asset/images/global/logo.jpeg";
import headerImg from "asset/images/global/header.jpg";
import "./index.less";

class Header extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isFullScreen: false,
            activeTab: 2,
            tabs: [1, 2, 3, 4, 5],
        };
        this.logOut = this.logOut.bind(this);
    }

    toggleCollapseMenu = () => {
        const { dispatch } = this.props;
        console.log("ds");
        dispatch(actions.toggleCollapseMenu());
    };

    toggleFullScreen = () => {
        const { isFullScreen } = this.state;
        if (!isFullScreen) {
            const element = document.documentElement;
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
        this.setState({ isFullScreen: !isFullScreen });
    };

    @WithConfirm("确认要退出吗?")
    logOut() {
        const { dispatch } = this.props;
        dispatch(actions.logOut());
    }

    onCloseTab = (event, key) => {
        event.stopPropagation();
        if (key) {
            const { tabs } = this.state;
            this.setState({
                tabs: tabs.filter((item) => item !== key),
            });
        }
    };

    onActiveTab = (key) => {
        if (key) {
            this.setState({ activeTab: key });
        }
    };

    menu = () => (
        <Menu>
            <Menu.Item key="1">
                <a
                    //   target="_blank"
                    rel="noopener noreferrer"
                    href="#"
                >
                    个人信息
                </a>
            </Menu.Item>
            <Menu.Item key="2" danger onClick={this.logOut}>
                退出
            </Menu.Item>
        </Menu>
    );

    getTab = (id) => <div className={id === 2 ? "active" : ""}>{id}</div>;

    render() {
        const { isFullScreen, tabs, activeTab } = this.state;

        return (
            <header className="ro-navigation-header ro-icon">
                <section>
                    <img src={websiteLogoImg} alt="" />
                    <h3>Website</h3>
                </section>
                <MenuFoldOutlined onClick={this.toggleCollapseMenu} />
                {!isFullScreen ? <ExpandOutlined onClick={this.toggleFullScreen} /> : <FullscreenExitOutlined onClick={this.toggleFullScreen} />}
                <TabComponent tabs={tabs} activeTab={activeTab} onClose={this.onCloseTab} onActive={this.onActiveTab} />
                <Badge size="small" count={5} overflowCount={99} offset={[-10, 10]}>
                    <BellOutlined />
                </Badge>
                <a href="#" className="ro-profile">
                    <span>rosen</span>
                    <img alt="" src={headerImg} />
                </a>
                <Dropdown overlay={this.menu()} trigger="click">
                    <SettingOutlined />
                </Dropdown>
                <div className="ro-tabs-container-bottom-bar" />
            </header>
        );
    }
}

const mapStateToProps = (state) => ({
    collapsed: state.app.navigation.collapsed,
});

export default connect(mapStateToProps)(Header);
