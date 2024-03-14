import { useState } from "react";
import { connect, DispatchProp } from "react-redux";
import { roPushHistory } from "@core";
import { Button, Input } from "antd";
import { RootState } from "type/state";
import { Rox } from "./magnet";
import "./index.less";

import { actions } from "..";

interface ProjectProps extends DispatchProp {}

function Project(props: ProjectProps) {
    const link = () => {
        roPushHistory("/waybill", { id: "1551864590885830658", readonly: false });
        // props.dispatch(actions.push());
    };

    const [inputValue, setInputValue] = useState("");

    return (
        <div className="ro-project-module">
            <div style={{ height: 100 }}>
                client
                <Button onClick={link}>跳转运单</Button>
            </div>
            <div style={{ height: 100 }}>
                <Input
                    onChange={(event) => {
                        setInputValue(event.target.value);
                    }}
                ></Input>
                <Button onClick={() => Rox(inputValue)}>action</Button>
                <video></video>
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    //
});

export default connect(mapStateToProps)(Project);
