import React from "react"
import { Menu } from 'antd';
import { connect } from 'react-redux';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
class MemuComponent extends React.PureComponent {
    constructor(props){
        super(props)
    }
 
    render(){
        const {collapsed} = this.props;
        return (
            <nav className="ro-nav">
                <section>
                    <img src={require("asset/images/global/logo.jpeg")}></img>
                    {
                        !collapsed && <h3>Website</h3>
                    }
                </section>
                <Menu
                    onClick={this.handleClick}
                    inlineCollapsed={collapsed}
                    mode="inline"
                >
                    <SubMenu key="sub1" icon={<MailOutlined />} title="Navigation One">
                    <Menu.ItemGroup key="g1" title="Item 1">
                        <Menu.Item key="1">Option 1</Menu.Item>
                        <Menu.Item key="2">Option 2</Menu.Item>
                    </Menu.ItemGroup>
                    <Menu.ItemGroup key="g2" title="Item 2">
                        <Menu.Item key="3">Option 3</Menu.Item>
                        <Menu.Item key="4">Option 4</Menu.Item>
                    </Menu.ItemGroup>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
                    <Menu.Item key="5">Option 5</Menu.Item>
                    <Menu.Item key="6">Option 6</Menu.Item>
                    <SubMenu key="sub3" title="Submenu">
                        <Menu.Item key="7">Option 7</Menu.Item>
                        <Menu.Item key="8">Option 8</Menu.Item>
                    </SubMenu>
                    </SubMenu>
                    <SubMenu key="sub4" icon={<SettingOutlined />} title="Navigation Three">
                        <Menu.Item key="9">Option 9</Menu.Item>
                        <Menu.Item key="10">Option 10</Menu.Item>
                        <Menu.Item key="11">Option 11</Menu.Item>
                        <Menu.Item key="12">Option 12</Menu.Item>
                    </SubMenu>
                </Menu>
            </nav>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        collapsed: state.app.main.collapsed
    }
}

export default connect(mapStateToProps)(MemuComponent);