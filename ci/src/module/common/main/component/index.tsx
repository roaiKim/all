import { connect, DispatchProp } from "react-redux";
import { Route, showLoading } from "@core";
import { Switch } from "react-router-dom";
import { LoginComponent } from "module/common/login/type";
import { RootState } from "type/state";
import BodyContainer from "./main";
import "./index.less";

interface MainProps extends DispatchProp, ReturnType<typeof mapStateToProps> {}

function Main(props: MainProps) {
    return (
        <div className="ro-main-container">
            <Switch>
                <Route path="/login" component={LoginComponent} />
                <Route component={BodyContainer} />
            </Switch>
        </div>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        globalLoading: showLoading(state), // 全局loading
        PERMISSION_DONE: state.app.main.PERMISSION_DONE,
    };
};

export default connect(mapStateToProps)(Main);
