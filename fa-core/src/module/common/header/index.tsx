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
        <header className="ro-header-container">
            <MenuFoldOutlined className="ro-neu" />

            <ExpandOutlined className="ro-neu" />

            <div className="ro-nav-tabs-container"></div>

            <a href="#" className="ro-profile ro-neu">
                <span>rosen</span>
                <img alt="avatar" width={40} src={headerImg} />
            </a>

            <Badge size="small" count={5} overflowCount={99} offset={[-10, 10]}>
                <BellOutlined className="ro-neu" />
            </Badge>

            <Dropdown overlay={dropdown} trigger={["click"]}>
                <SettingOutlined className="ro-neu" />
            </Dropdown>
        </header>
    );
}
