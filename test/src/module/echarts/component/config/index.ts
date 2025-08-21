import GridConfig from "./grid";
import LegendConfig from "./legend";
import TitleConfig from "./title";

export enum EchartsNodeType {
    null = "null",
    string = "string",
    number = "number",
    boolean = "boolean",
    function = "function",
    options = "options",
    color = "color",
    array = "array",
    object = "array",
}

export interface EchartsTreeState {
    id: string;
    name: string;
    nodeType?: EchartsNodeType | keyof typeof EchartsNodeType;
    isLeaf: boolean;
    level: number;
    parentPath?: string[];
    sort: number;

    value?: any;
    defaultValue?: string;
    descendant?: EchartsTreeState[];
    shortDescroption?: string;
    example?: string[];
    description?: string[];
    options?: Record<string, string>[];
    propTypes?: (keyof typeof EchartsNodeType)[];
}

const echartsTreeState: EchartsTreeState[] = [
    {
        sort: 0,
        id: "title",
        name: "title",
        nodeType: "null",
        isLeaf: false,
        level: 1,
        descendant: TitleConfig,
        parentPath: ["title"],
    },
    {
        sort: 2,
        id: "legend",
        name: "legend",
        nodeType: "null",
        isLeaf: false,
        level: 1,
        descendant: LegendConfig,
        parentPath: ["legend"],
    },
    {
        sort: 3,
        id: "grid",
        name: "grid",
        nodeType: "null",
        isLeaf: false,
        level: 1,
        descendant: GridConfig,
        parentPath: ["grid"],
    },
    {
        sort: 4,
        id: "xAxis",
        name: "xAxis",
        nodeType: "null",
        isLeaf: false,
        level: 1,
        descendant: [],
        parentPath: ["xAxis"],
    },
    {
        sort: 5,
        id: "yAxis",
        name: "yAxis",
        nodeType: "null",
        isLeaf: false,
        level: 1,
        descendant: [],
        parentPath: ["yAxis"],
    },
];

export default echartsTreeState;
