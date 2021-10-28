import { Lifecycle, Module, register, Loading } from "core";
import { FileManagementService } from "@api/FileManagementService";
import Main from "./component";

const initialState = {
    list: null,
};

class UserModule extends Module {
    @Lifecycle()
    onRender() {
        this.getlist();
    }

    @Loading("table")
    async getlist() {
        await FileManagementService.list().then((response) => {
            this.setState({ list: response });
        });
    }
}

const module = register(new UserModule("file", initialState));
export const actions = module.getActions();
export const MainComponent = module.attachLifecycle(Main);
