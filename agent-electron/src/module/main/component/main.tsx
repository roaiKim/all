import { type PropsWithChildren, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pane, SplitPane } from "react-split-pane";
import { MAIN_LAYOUT_FILE } from "config/file.path";
import defaultLayout from "service/JSON/layout.json";
import { DIVIDER_SIZE } from "config/static-constant";
import { MainComponent as Attribute } from "module/attribute";
import { actions } from "module/main";
import { MainComponent as Material } from "module/material";
import { MainComponent as Scenario } from "module/scenario";
import { MainComponent as Scenery } from "module/scenery";
import { electronFile } from "service/electron";
import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import type { MainLoyoutRatio } from "../type";
import "./index.less";

interface HomeProps {
    name?: string;
}

const calcRatios = (sizes: number[]): number[] => {
    const total = sizes.reduce((sum, size) => sum + size, 0);
    return total ? sizes.map((size) => size / total) : sizes;
};

const ratiosPer = (ratio: number) => ratio * 100 + "%";

export default function (props: PropsWithChildren<HomeProps>) {
    const { children } = props;
    const dispatch = useDispatch();
    const mainLoyoutRatio = useSelector((state: RootState) => state.app.main.mainLoyoutRatio);

    const saveLayout = (patch: Partial<MainLoyoutRatio>) => {
        dispatch(actions.setMainLoyoutRatio(patch));
    };

    // console.log("===ratios==", mainLoyoutRatio);

    return (
        <SplitPane
            direction="vertical"
            dividerSize={DIVIDER_SIZE}
            dividerStyle={{ height: DIVIDER_SIZE }}
            onResizeEnd={(sizes) => {
                const [top, bottom] = calcRatios(sizes);
                saveLayout({ top, bottom });
            }}
        >
            <Pane minSize="40%" size={ratiosPer(mainLoyoutRatio.top)} className={joinLessPrefix("pane")}>
                <SplitPane
                    direction="horizontal"
                    dividerSize={DIVIDER_SIZE}
                    dividerStyle={{ width: DIVIDER_SIZE }}
                    onResizeEnd={(sizes) => {
                        const [left, center, right] = calcRatios(sizes);
                        saveLayout({ left, center, right });
                    }}
                >
                    <Pane minSize="15%" size={ratiosPer(mainLoyoutRatio.left)} className={joinLessPrefix(["pane", "pane-children"])}>
                        <Material></Material>
                    </Pane>
                    <Pane minSize="25%" size={ratiosPer(mainLoyoutRatio.center)} className={joinLessPrefix(["pane", "pane-children"])}>
                        <Scenario></Scenario>
                    </Pane>
                    <Pane minSize="15%" size={ratiosPer(mainLoyoutRatio.right)} className={joinLessPrefix(["pane", "pane-children"])}>
                        <Attribute></Attribute>
                    </Pane>
                </SplitPane>
            </Pane>
            <Pane minSize="20%" size={ratiosPer(mainLoyoutRatio.bottom)} className={joinLessPrefix(["pane", "pane-children"])}>
                <Scenery></Scenery>
            </Pane>
        </SplitPane>
    );
}
