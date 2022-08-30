import "./index.less";
import { Switch } from "react-router-dom";
import { Route, showLoading } from "@core";
import BodyContainer from "./main";
import { LoginComponent } from "module/login/type";
import { connect, DispatchProp } from "react-redux";
import { RootState } from "type/state";
import { GlobalMask } from "components/common";

interface MainProps extends DispatchProp, ReturnType<typeof mapStateToProps> {}

function Main(props: MainProps) {
    const { permissionLoading } = props;
    return (
        <GlobalMask loading={permissionLoading} loadingRender title="权限数据加载中请稍后...">
            <div className="ro-main-container">
                <Switch>
                    <Route path="/login" component={LoginComponent} />
                    <BodyContainer></BodyContainer>
                </Switch>
            </div>
        </GlobalMask>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        permissionLoading: showLoading(state, "PERMISSION"),
    };
};

export default connect(mapStateToProps)(Main);
