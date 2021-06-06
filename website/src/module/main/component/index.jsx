import React from "react";
import { connect } from "react-redux";
import { showLoading, Route } from "core";
import { Switch } from "react-router-dom";
import { cacheRoute } from "service/MenuLoader";
import Menu from "./Menu";
import Header from "./Header";
import Nofound from "./404Nofound";
import "./index.less";

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
            <article className="ro-main-wrap">
                <Menu />
                <section className="ro-main" style={{ height: website.height || bodyHeight }}>
                    <Header />
                    <main className="ro-body-container">
                        <Switch>
                            {cacheRoute.map(({ path, Component }) => (
                                <Route key={path} path={path} component={Component} />
                            ))}
                            <Route component={Nofound} />
                        </Switch>
                    </main>
                    <footer>--</footer>
                </section>
            </article>
        );
    }

}

const mapStateToProps = (state) => ({
    record: state.app.main.record,
    website: state.website,
    isLoading: showLoading(state, "mask"),
});

export default connect(mapStateToProps)(Main);
