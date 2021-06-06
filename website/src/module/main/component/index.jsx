import React from "react";
import { connect } from "react-redux";
import { showLoading, Route } from "core";
import { Switch } from "react-router-dom";
import Login from "module/login/user";
import MainLayout from "./MainLayout";
import "./index.less";

class Main extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {

            // bodyHeight: document.body.clientHeight || 0,
        };
    }

    render() {

        // const { bodyHeight } = this.state;
        // const { website } = this.props;

        return (
            <Switch>
                <Route path="/login" component={Login.Component} />
                <Route component={MainLayout} />
            </Switch>
        );
    }

}

const mapStateToProps = (state) => ({
    record: state.app.main.record,
    website: state.website,
    isLoading: showLoading(state, "mask"),
});

export default connect(mapStateToProps)(Main);
