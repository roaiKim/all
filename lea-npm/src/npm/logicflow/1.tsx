import React from "react";
// import AllPower from "@src/libs/power.json";
import LogicFlow from "@logicflow/core";
import "@logicflow/core/dist/style/index.css";

interface FlowState {
    id: string;
}

class Flow extends React.Component<{}, any> {
    constructor(props) {
        super(props);
        // console.log('AllPower', AllPower)
        this.state = {};
    }

    componentDidMount() {
        console.log("logicflowContainer");
        const lf = new LogicFlow({
            container: document.getElementById("logicflowContainer"),
            stopScrollGraph: true,
            stopZoomGraph: true,
            width: 500,
            height: 500,
            grid: {
                type: "dot",
                size: 20,
            },
        });
        const data = {
            // 节点
            nodes: [
                {
                    id: 50,
                    type: "rect",
                    x: 100,
                    y: 150,
                    text: "你好",
                },
                {
                    id: 21,
                    type: "circle",
                    x: 300,
                    y: 150,
                },
            ],
            // 边
            edges: [
                {
                    type: "polyline",
                    sourceNodeId: 50,
                    targetNodeId: 21,
                },
            ],
        };
        lf.render(data);
    }

    render() {
        const { allPower, permissions } = this.state;
        return <div id="logicflowContainer"></div>;
    }
}

export default Flow;
