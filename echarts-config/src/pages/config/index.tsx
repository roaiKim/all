import { createContext, useEffect, useState } from "react";
import { Button, Input, Tabs } from "antd";
import * as echarts from "echarts";
import { Main } from "./co";
import echartsTreeState from "./config";
import "./index.less";

export const expandPathContext = createContext<any>({});

function Config() {
    const [expandPath, setExpandPath] = useState<string[]>([]);

    const calcPath = (path: string) => {
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

export default Config;
