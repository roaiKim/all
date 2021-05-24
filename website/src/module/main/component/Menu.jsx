import React from "react"
import { Menu } from 'antd';
import { connect } from 'react-redux';
import { SettingOutlined } from '@ant-design/icons';
import cacheMenu from "service/MenuLoader"

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
                    <SubMenu key="sub4" icon={<SettingOutlined />} title="Navigation Three">
                        <Menu.Item key="9">Option 9</Menu.Item>
                        <Menu.Item key="10">Option 10</Menu.Item>
                        <Menu.Item key="11">Option 11</Menu.Item>
                        <Menu.Item key="12">Option 12</Menu.Item>
                        {
                            cacheMenu.map(({path, title}) => <Menu.Item key={path}>{title}</Menu.Item>)
                        }
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