import type { DragState, Shapes } from "../main/print";
import type { DraggableType } from "../main/static";

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

    render(props) {
        const { element } = props;
        const { x, y, width, height, content, id } = element || {};

        return <div className="print-element">{content}</div>;
    }
}
