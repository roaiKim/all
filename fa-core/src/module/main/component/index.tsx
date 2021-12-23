import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { showLoading, Route } from "@core";
import { Switch } from "react-router-dom";
import { Button, message } from "antd";
import { cacheModules } from "utils/function/loadComponent";
import Header from "module/common/header";

export default function () {
    return (
        <main className="ro-websit-container">
            <Header />
            {cacheModules.map((item) => {
                const Component = item.module.Component;
                return <Component key={item.moduleId} />;
            })}
        </main>
    );
}
