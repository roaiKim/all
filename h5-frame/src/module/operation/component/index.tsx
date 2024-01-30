import { connect, DispatchProp } from "react-redux";
import { roPushHistory } from "@core";
import { RootState } from "type/state";
import "./index.less";

interface OperationProps extends DispatchProp {}

function Operation(props: OperationProps) {
    return (
        <div className="ro-operation-module">
            <div style={{ height: 100 }}> hello Operation</div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    //
});

export default connect(mapStateToProps)(Operation);
