import React from "react";
import { Menu } from "antd";
import { connect } from "react-redux";
import { SettingOutlined } from "@icon";
import { map, cacheMenu } from "service/MenuLoader";

const { SubMenu } = Menu;
class MemuComponent extends React.PureComponent {

    renderMenu(menu) {
        return (
            menu.children
                ? (
                    <SubMenu key={menu.id} title={menu.title}>
                        {

                            menu.children.map((item) => this.renderMenu(item))
                        }
                    </SubMenu>
                )
                : (
                    <Menu.Item icon={(menu.icon && (menu.page && menu.page.icon)) || null} key={(menu.page && menu.page.path) || ""}>
                        {(menu.page && menu.page.title) || "请指定名称"}
                    </Menu.Item>
                )
        );
    }

    render() {
        const { collapsed } = this.props;

        console.log("MenucacheMenu", map, cacheMenu);

        return (
            <nav className="ro-nav">
                <section>
                    <img src={require("asset/images/global/logo.jpeg")} alt="" />
                    {
                        !collapsed && <h3>Website</h3>
                    }
                </section>
                <Menu
                    onClick={this.handleClick}
                    inlineCollapsed={collapsed}
                    mode="inline"
                >
                    <SubMenu key="sub4" icon={<SettingOutlined />} title="Navigation Three">
                        <Menu.Item key="9">Option 9</Menu.Item>
                        <Menu.Item key="10">Option 10</Menu.Item>
                        <Menu.Item key="11">Option 11</Menu.Item>
                        <Menu.Item key="12">Option 12</Menu.Item>
                    </SubMenu>
                    {
                        map.map((item) => this.renderMenu(item))
                    }
                </Menu>
            </nav>
        );
    }

}

const mapStateToProps = (state) => ({
    collapsed: state.app.main.collapsed,
});

export default connect(mapStateToProps)(MemuComponent);
