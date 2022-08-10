import "./index.less";
import { RootState } from "type/state";
import { connect, DispatchProp } from "react-redux";

interface ProjectProps extends DispatchProp {}

function Project(props: ProjectProps) {
    return (
        <div className="ro-project-module">
            <div style={{ height: 100 }}>Hello Project</div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    //
});

export default connect(mapStateToProps)(Project);
