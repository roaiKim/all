import React from "react";
import { connect } from "react-redux";
import { showLoading, Route } from "core";
import { Switch } from "react-router-dom";
import { cacheRoute } from "service/MenuLoader";
import Header from "module/navigation";
import Menu from "./Menu";
import Nofound from "./404Nofound";

class Main extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            bodyHeight: document.body.clientHeight || 0,
        };
    }

    render() {
        const { bodyHeight } = this.state;
        const { website } = this.props;

        return (
            <main className="ro-main-wrap">
                <Header />
                <main className="ro-main">
                    <Menu />
                    <section className="ro-body-container">
                        <Switch>
                            {cacheRoute.map(({ path, Component }) => (
                                <Route key={path} path={path} component={Component} />
                            ))}
                            <Route component={Nofound} />
                        </Switch>
                    </section>
                </main>
                <footer>--</footer>
            </main>
        );
    }
}

const mapStateToProps = (state) => ({
    record: state.app.main.record,
    website: state.website,
    isLoading: showLoading(state, "mask"),
});

export default connect(mapStateToProps)(Main);
