import { connect, DispatchProp } from "react-redux";
import { roPushHistory } from "@core";
import { Button } from "antd";
import { RootState } from "type/state";
import "./index.less";

interface ProjectProps extends DispatchProp {}

function Project(props: ProjectProps) {
    const link = () => {
        roPushHistory("/waybill", { id: "1551864590885830658" });
    };

    return (
        <div className="ro-project-module">
            <div style={{ height: 100 }}>
                Hello Project
                <Button onClick={link}>跳转运单</Button>
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    //
});

export default connect(mapStateToProps)(Project);
