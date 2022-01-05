import React from "react";
import { Module, register } from "@core";
import Home from "./component";
import { RootState } from "type/state";
import { Service } from "./index.api";

const initialState = {
    records: null,
};

class DataDictionaryModule extends Module<RootState, "dataDictionary"> {
    async onEnter() {
        const records = await Service.get();
        this.setState({ records });
    }
}

const module = register(new DataDictionaryModule("dataDictionary", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Home);
