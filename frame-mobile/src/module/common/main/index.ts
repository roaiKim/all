import { loading, Module, register } from "@core";
import { ReportService } from "@api/ReportService";
import { RootState } from "type/state";
import Main from "./component";

const initialMainState = {
    pages: [],
};

class MainModule extends Module<RootState, "main"> {
    async onEnter() {
        this.pages();
    }

    @loading("main")
    async pages() {
        const pages = await ReportService.page();
        this.setState({ pages: pages?.records || [] });
    }

    calcPageHeight() {
        try {
            const container = document.querySelector(".ro-main-container");
            if (container) {
                (container as any).style.height = `${window.innerHeight}px`;
            }
        } catch (e) {
            console.error("获取文档高度失败", e);
        }
    }
}

const module = register(new MainModule("main", initialMainState));
export const actions = module.getActions();
export const MainComponent = module.connect(Main);
