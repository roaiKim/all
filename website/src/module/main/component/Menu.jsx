import React from "react";
import { Menu } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { cacheMenu } from "service/MenuLoader";

const { SubMenu } = Menu;
class MemuComponent extends React.PureComponent {

    renderMenu(menu) {
        return (
            menu.children
                ? (
                    <SubMenu key={menu.id} title={menu.title} icon={menu && menu.icon}>
                        {

                            menu.children.map((item) => this.renderMenu(item))
                        }
                    </SubMenu>
                )
                : (
                    <Menu.Item icon={(menu.icon || (menu.page && menu.page.icon)) || null} key={(menu.page && menu.page.path) || ""}>
                        <Link to={(menu.page && menu.page.path) || "/"}>{(menu.page && menu.page.title) || "请指定名称"}</Link>
                    </Menu.Item>
                )
        );
    }

    render() {
        const { collapsed } = this.props;

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
                    {
                        cacheMenu.map((item) => this.renderMenu(item))
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
