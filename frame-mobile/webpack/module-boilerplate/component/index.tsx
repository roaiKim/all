import "./index.less";
import { RootState } from "type/state";
import { connect, DispatchProp } from "react-redux";

interface {1} extends DispatchProp {}

function {2}(props: {1}) {
    return <div className="ro-{4}-module">Hello {2}</div>;
}

const mapStateToProps = (state: RootState) => ({
    //
});

export default connect(mapStateToProps)({2});
