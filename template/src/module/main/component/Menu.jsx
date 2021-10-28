import React from "react";
import { Menu } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { cacheMenu } from "service/MenuLoader";
import { actions as navigationActions } from "module/navigation";

const { SubMenu } = Menu;
class MemuComponent extends React.PureComponent {
    openMenuItem = (url) => this.props.dispatch(navigationActions.open(url));

    renderMenu(menu) {
        return menu.children ? (
            <SubMenu key={menu.id} title={menu.title} icon={menu && menu.icon}>
                {menu.children.map((item) => this.renderMenu(item))}
            </SubMenu>
        ) : (
            <Menu.Item icon={menu.icon || null} key={(menu.page && menu.page.path) || ""} onClick={() => this.openMenuItem(menu.page?.path)}>
                {/* <Link to={(menu.page && menu.page.path) || "/"}>{menu.page && menu.page.title}</Link> */}
                {menu.page && menu.page.title}
            </Menu.Item>
        );
    }

    render() {
        const { collapsed } = this.props;

        return (
            <nav className="ro-nav">
                <Menu onClick={this.handleClick} inlineCollapsed={collapsed} mode="inline">
                    {cacheMenu.map((item) => this.renderMenu(item))}
                </Menu>
            </nav>
        );
    }
}

const mapStateToProps = (state) => ({
    collapsed: state.app.navigation.collapsed,
});

export default connect(mapStateToProps)(MemuComponent);
