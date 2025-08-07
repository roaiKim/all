import { useEffect, useState } from "react";
import { connect, DispatchProp } from "react-redux";
import { roPushHistory } from "@core";
import { Button, Input, Tabs } from "antd";
import * as echarts from "echarts";
import { RootState } from "type/state";
import { ContainerRender } from "./co/container-render";
import echartsTreeState from "./config";
import "./index.less";

import { actions } from "..";

interface ProjectProps extends DispatchProp {}

function Project(props: ProjectProps) {
    const link = () => {
        roPushHistory("/waybill", { id: "1551864590885830658", readonly: false });
        // props.dispatch(actions.push());
    };

    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        // echarts.init(document.getElementById("main")).setOption({});
    }, []);

    return (
        <div className="ro-echarts-module">
            <div>
                <Tabs
                    tabPosition="left"
                    defaultActiveKey="title"
                    items={echartsTreeState.map((item) => ({
                        label: `${item.name}`,
                        key: `${item.id}`,
                        children: <ContainerRender parentkey="" field={item} />,
                    }))}
                    onChange={() => {
                        //
                    }}
                />
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    //
});

export default connect(mapStateToProps)(Project);
