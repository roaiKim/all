import "./index.less";
import { Switch, useLocation, useParams } from "react-router-dom";
import { Route, showLoading } from "@core";
import BodyContainer from "./main";
import { LoginComponent } from "module/login/type";
import { connect, DispatchProp } from "react-redux";
import { RootState } from "type/state";

interface MainProps extends DispatchProp, ReturnType<typeof mapStateToProps> {}

function Main(props: MainProps) {
    return (
        <div className="ro-main-container">
            <Switch>
                <Route path="/login" component={LoginComponent} />
                <Route component={BodyContainer} />
                {/* <BodyContainer></BodyContainer> */}
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
