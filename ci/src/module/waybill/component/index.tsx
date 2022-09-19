import "./index.less";
import { RootState } from "type/state";
import { connect, DispatchProp } from "react-redux";

interface WaybillProps extends DispatchProp {}

function Waybill(props: WaybillProps) {
    return (
        <div className="ro-waybill-module">
            <div style={{ height: 100 }}>Hello Waybill</div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    //
});

export default connect(mapStateToProps)(Waybill);
