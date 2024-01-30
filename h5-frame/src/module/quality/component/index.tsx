import { connect, DispatchProp } from "react-redux";
import { roPushHistory } from "@core";
import { RootState } from "type/state";
import "./index.less";

interface QualityProps extends DispatchProp {}

function Quality(props: QualityProps) {
    return <div className="ro-quality-module">hello Quality</div>;
}

const mapStateToProps = (state: RootState) => ({
    //
});

export default connect(mapStateToProps)(Quality);
