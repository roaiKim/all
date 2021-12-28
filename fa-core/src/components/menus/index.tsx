import { Menu } from "antd";
import React from "react";
import { AppstoreOutlined, MailOutlined, SettingOutlined } from "@icon";
import { ModuleStatement, cacheModules } from "utils/function/loadComponent";
import { Link } from "react-router-dom";

const { SubMenu } = Menu;

interface MenusProps {
    menus: ModuleStatement;
}

export const Menus = () => {
    return (
        <Menu onClick={() => {}} style={{ width: "100%" }} mode="inline">
            {/* <SubMenu key="sub4" icon={<SettingOutlined />} title="Game"> */}
            {cacheModules.map(({ module }) => {
                const { path, title } = module;
                return (
                    <Menu.Item key={path}>
                        <Link to={path}>{title}</Link>
                    </Menu.Item>
                );
            })}
            {/* </SubMenu> */}
        </Menu>
    );
};
