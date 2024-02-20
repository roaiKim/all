import { connect, DispatchProp } from "react-redux";
import { roPushHistory } from "@core";
import { RootState } from "type/state";
import "./index.less";

interface ProjectProps extends DispatchProp {}

function Project(props: ProjectProps) {
    return (
        <div className="ro-finance-module">
            <div style={{ height: 100 }}> hello finance</div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    //
});

export default connect(mapStateToProps)(Project);
