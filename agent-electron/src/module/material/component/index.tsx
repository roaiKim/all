import { Tabs } from "antd";
import type { RootState } from "type/rootState";
import { joinLessPrefix } from "utils/framework";
import Sceen from "./sceen";
import Asset from "./asset";
import "./index.less";

interface MaterialProps {}

function Material(props: MaterialProps) {
    return (
        <div className={joinLessPrefix("material-page")}>
            <Tabs
                rootClassName="scenery-tabs"
                defaultActiveKey="sceen"
                size="small"
                items={[
                    {
                        key: "sceen",
                        label: "幕章",
                        children: <Sceen />,
                    },
                    {
                        key: "material",
                        label: "素材",
                        children: <Asset />,
                    },
                    {
                        key: "component",
                        label: "组件",
                        children: "Content of Tab Pane 3",
                    },
                    {
                        key: "advanced",
                        label: "高级",
                        children: "Content of Tab Pane 4",
                    },
                ]}
                onChange={() => {}}
            />
        </div>
    );
}

export default Material;
