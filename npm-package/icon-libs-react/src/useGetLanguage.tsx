import React, { useContext } from "react";

const languageEn = {
    "rove-modal-title": "select icon",
    "rove-modal-select-name": "select",
    "rove-selector-width": "width",
    "rove-selector-height": "height",
    "rove-selector-color": "color",
    "rove-selector-copyname": "Copy name",
    "rove-selector-copy": "Copy",
    "rove-selector-ok": "Confirm",
    "rove-search-placeholder": "Search icon name",
    "rove-search-button": "Search",
};

const languageCh = {
    "rove-modal-title": "选择图标",
    "rove-modal-select-name": "选择",
    "rove-selector-width": "宽",
    "rove-selector-height": "高",
    "rove-selector-color": "颜色",
    "rove-selector-copyname": "复制名称",
    "rove-selector-copy": "复制",
    "rove-selector-ok": "确认",
    "rove-search-placeholder": "搜索图标",
    "rove-search-button": "搜索",
};

interface RoveContextType {
    type?: "en" | "ch";
    language?: Partial<Record<keyof typeof languageEn, string>>;
}

export const RoveContext = React.createContext<RoveContextType>({
    type: "en",
    language: {},
});

export const useGetLanguage = () => {
    const languageContext = useContext(RoveContext);
    const { type, language = {} } = languageContext;

    const getLanguage = (key) => {
        if (type === "en") {
            return language[key] || languageEn[key];
        } else if (type === "ch") {
            return language[key] || languageCh[key];
        } else {
            return language[key];
        }
    };

    return {
        getLanguage,
    };
};
