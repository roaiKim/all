import { Lifecycle, Module, register } from "core";
import { FileUploadService } from "@api/FileUploadService";
import { message } from "antd";
import Main from "./component";

const initialState = {

};

class UploadModule extends Module {

    @Lifecycle()
    onRender() {
        console.log("upload module action");
    }

    upload(file) {
        FileUploadService.upload(file).then((respone) => {
            console.log("UploadModule upload respone", respone);
            message.success("操作成功!");
        }).catch((error) => {
            console.log("UploadModule upload error", error);
        });
    }

}

const module = register(new UploadModule("upload", initialState));
export const actions = module.getActions();
export const MainComponent = module.attachLifecycle(Main);
