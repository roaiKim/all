import "./index.less";
import { RootState } from "type/state";
import { connect, DispatchProp, useDispatch } from "react-redux";
import { Button } from "antd";
import { actions as HeaderAction } from "module/common/header/module";
import { setHistory } from "@core";

interface ProjectProps extends DispatchProp {}

function Project(props: ProjectProps) {
    const dispath = useDispatch();
    const link = () => {
        setHistory("/waybill", { orderId: "1551864590885830658" });
        // dispath(HeaderAction.pushTab("project"));
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
