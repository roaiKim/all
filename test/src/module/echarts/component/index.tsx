import { createContext, useEffect, useState } from "react";
import { connect, DispatchProp } from "react-redux";
import { roPushHistory } from "@core";
import { Button, Input, Tabs } from "antd";
import * as echarts from "echarts";
import { RootState } from "type/state";
import { Main } from "./co";
import echartsTreeState from "./config";
import "./index.less";

import { actions } from "..";

interface ProjectProps extends DispatchProp {}

export const expandPathContext = createContext<any>({});

function Project(props: ProjectProps) {
    const link = () => {
        roPushHistory("/waybill", { id: "1551864590885830658", readonly: false });
        // props.dispatch(actions.push());
    };

    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        // echarts.init(document.getElementById("main")).setOption({});
    }, []);

    const [expandPath, setExpandPath] = useState([]);
    const calcPath = (path) => {
        if (expandPath.includes(path)) {
            const tui = expandPath.filter((item) => item !== path).filter((item) => !item.includes(path));
            setExpandPath(tui);
        } else {
            const pathArray = path.split(".");
            const p = [];
            for (let i = 2; i <= pathArray.length; i++) {
                p.push(pathArray.slice(0, i).join("."));
            }
            setExpandPath(p);
        }
    };

    return (
        <div className="ro-echarts-module">
            <expandPathContext.Provider
                value={{
                    expandPath,
                    setExpandPath,
                    calcPath,
                }}
            >
                <div>
                    <Tabs
                        tabPosition="left"
                        defaultActiveKey="title"
                        items={echartsTreeState.map((item) => ({
                            label: `${item.name}`,
                            key: `${item.id}`,
                            children: <Main parentkey="" field={item} />,
                        }))}
                        onChange={() => {
                            //
                        }}
                    />
                </div>
            </expandPathContext.Provider>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    //
});

export default connect(mapStateToProps)(Project);
