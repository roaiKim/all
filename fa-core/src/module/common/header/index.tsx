import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { showLoading, Route } from "@core";
import { Switch } from "react-router-dom";
import { Badge, Button, Dropdown, Menu, message } from "antd";
import { cacheModules } from "utils/function/loadComponent";
import { MenuFoldOutlined, ExpandOutlined, SettingOutlined, BellOutlined } from "@icon";
import headerImg from "asset/images/global/header.jpg";
import "./index.less";

export default function () {
    const dropdown = (
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
            <Menu.Item key="2" danger>
                退出
            </Menu.Item>
        </Menu>
    );

    return (
        <header className="ro-header-container ro-icon">
            <MenuFoldOutlined />

            <ExpandOutlined />

            <div className="ro-nav-tabs-container"></div>

            <Badge size="small" count={5} overflowCount={99} offset={[-10, 10]}>
                <BellOutlined />
            </Badge>

            <a href="#" className="ro-profile">
                <span>rosen</span>
                <img alt="avatar" width={40} src={headerImg} />
            </a>

            <Dropdown overlay={dropdown} trigger={["click"]}>
                <SettingOutlined />
            </Dropdown>
        </header>
    );
}
