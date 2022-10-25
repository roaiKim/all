import React from "react";
import { Module, register } from "@core";
import Home from "./component";
import { RootState } from "type/state";

const initialState = {
    name: null,
    count: 0,
};

class ExampleModule extends Module<RootState, "example"> {
    override onEnter() {
        console.log("ExampleModule module action --");
        // this.setState({ name: "rosen" });
    }
}

const module = register(new ExampleModule("example", initialState));
export const actions = module.getActions();
export const MainComponent = module.connect(Home);
