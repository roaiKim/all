import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { showLoading, Route } from "@core";
import { Switch } from "react-router-dom";
import { Button, message } from "antd";
import { cacheModules } from "utils/function/loadComponent";

export default function () {
    return (
        <div>
            main
            {cacheModules.map((item) => {
                const Component = item.module.Component;
                return <Component key={item.moduleId} />;
            })}
        </div>
    );
}
