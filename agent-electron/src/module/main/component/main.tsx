import { Pane, SplitPane } from "react-split-pane";
import { DIVIDER_SIZE } from "config/static-constant";
import { MainComponent as Attribute } from "module/attribute";
import { MainComponent as Material } from "module/material";
import { MainComponent as Scenario } from "module/scenario";
import { MainComponent as Scenery } from "module/scenery";
import type { PropsWithChildren } from "react";
import { joinLessPrefix } from "utils/framework";
import "./index.less";

interface HomeProps {
    name?: string;
}

export default function (props: PropsWithChildren<HomeProps>) {
    const { children } = props;
    return (
        <SplitPane
            direction="vertical"
            dividerSize={DIVIDER_SIZE}
            dividerStyle={{ height: DIVIDER_SIZE }}
            onResizeEnd={(sizes) => {
                console.log("-sizes--", sizes);
            }}
        >
            <Pane minSize="40%" defaultSize="60%" className={joinLessPrefix("pane")}>
                <SplitPane direction="horizontal" dividerSize={DIVIDER_SIZE} dividerStyle={{ width: DIVIDER_SIZE }}>
                    <Pane minSize="15%" defaultSize="25%" className={joinLessPrefix(["pane", "pane-children"])}>
                        <Material></Material>
                    </Pane>
                    <Pane minSize="25%" className={joinLessPrefix(["pane", "pane-children"])}>
                        <Scenario></Scenario>
                    </Pane>
                    <Pane minSize="15%" defaultSize="25%" className={joinLessPrefix(["pane", "pane-children"])}>
                        <Attribute></Attribute>
                    </Pane>
                </SplitPane>
            </Pane>
            <Pane minSize="20%" className={joinLessPrefix(["pane", "pane-children"])}>
                <Scenery></Scenery>
            </Pane>
        </SplitPane>
    );
}
