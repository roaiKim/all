import { Module } from "@core";
import { app } from "core/app";
import React from "react";
import { RootState } from "type/state";
import { roPushHistory } from "utils";

export function ValidateAuth(moduleClass) {
    try {
        moduleClass.prototype.needAuth = true;
        moduleClass.prototype.authAction = () => {
            roPushHistory("/pages/login/index", null, { redirection: true });
        };
    } catch (e) {
        //
    }
    return moduleClass;
}
