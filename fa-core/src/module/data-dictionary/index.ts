import React from "react";
import { Module, register } from "@core";
import Home from "./component";
import { RootState } from "type/state";
import { DictionaryService } from "./index.api";
import { TreeContent } from "./type";

const initialState = {
    records: null,
};

class DataDictionaryModule extends Module<RootState, "dataDictionary"> {
    async onEnter() {
        this.getTree();
    }

    async getTree() {
        const records = await DictionaryService.get();
        this.setState({ records });
    }

    async createTree(request: TreeContent, callBack: () => void) {
        const records = await DictionaryService.createTree(request);
        this.setState({ records });
        callBack();
    }

    async updateTree(request: TreeContent, callBack: () => void) {
        await DictionaryService.updateTree(request);
        this.getTree();
        callBack();
    }
}

const module = register(new DataDictionaryModule("dataDictionary", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Home);
