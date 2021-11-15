import React from "react";
import { Module, register } from "@core";
import Home from "./component";
import { RootState } from "type/state";

const initialState = {
    name: null,
    count: 0,
};

class HomeModule extends Module<RootState, "home"> {
    override onEnter() {
        console.log("home module action --");
        this.setState({ name: "rosen" });
    }

    // override onTick() {
    //     this.setState({ count: this.state.count + 1 });
    // }
}

const module = register(new HomeModule("home", initialState));
export const actions = module.getActions();
export const MainComponent: React.ComponentType = module.connect(Home);
