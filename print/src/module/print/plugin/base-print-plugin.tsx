import type { PrintElement } from "../main";
import type { DragState, Shapes } from "../main/print";

export interface BasePrintPluginOption {
    type: keyof Shapes;
    key: string;
    title: string;
    width?: number;
    height?: number;
}

export class BasePrintPlugin {
    defaultOption: Partial<BasePrintPluginOption> = {
        width: 160,
        height: 80,
    };
    option: BasePrintPluginOption;
    constructor(option: BasePrintPluginOption) {
        this.option = {
            ...this.defaultOption,
            ...option,
        };

        this.dragRender.bind(this);
        this.render.bind(this);
    }

    dragRender(props: DragState) {
        const { width = 0, height = 0 } = props;
        return <div style={{ width, height }}></div>;
    }

    render(props: PrintElement): React.ReactNode {
        const { content } = props || {};
        return content;
    }
}
