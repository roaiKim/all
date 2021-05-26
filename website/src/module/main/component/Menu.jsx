import React from "react";
import { Menu } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { SettingOutlined } from "@icon";
import { map } from "service/MenuLoader";

const { SubMenu } = Menu;
class MemuComponent extends React.PureComponent {

    renderMenu() {
        return Object.keys(map).map((item) => {
            const current = map[item];
            return (
                <Menu.Item key={item}>
                    <Link to={current.path || ""}>{current.title || "sss"}</Link>
                </Menu.Item>
            );
        });
    }

    render() {
        const { collapsed } = this.props;
        console.log("map", map);
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
                        <Menu.Item key="9">
                            <Link to="/upload">用户上传</Link>
                        </Menu.Item>
                        <Menu.Item key="10"><Link to="/user">用户信息</Link></Menu.Item>
                        <Menu.Item key="12">Option 12</Menu.Item>
                        {
                            this.renderMenu()
                        }
                    </SubMenu>
                </Menu>
            </nav>
        );
    }

}

const mapStateToProps = (state) => ({
    collapsed: state.app.main.collapsed,
});

export default connect(mapStateToProps)(MemuComponent);
