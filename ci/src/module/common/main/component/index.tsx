import "./index.less";
import { Switch } from "react-router-dom";
import { Route } from "@core";
import BodyContainer from "./main";
import { LoginComponent } from "module/login/type";

export default function () {
    return (
        <div className="ro-main-container">
            <Switch>
                <Route path="/login" component={LoginComponent} />
                <BodyContainer></BodyContainer>
            </Switch>
        </div>
    );
}
