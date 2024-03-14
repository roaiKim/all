import { ThemeConfig } from "antd";

const antdCSSComponentToken: ThemeConfig["components"] = {
    Menu: {
        fontSize: 14,
    },
    Table: {
        rowHoverBg: "#EAF4FE",
        rowSelectedBg: null,
        rowSelectedHoverBg: null,
    },
};

export { antdCSSComponentToken };
