import React from "react";
import { connect } from "react-redux";
import { showLoading, Route } from "core";
import { Switch } from "react-router-dom";
import { cacheMenu } from "service/MenuLoader";
import Menu from "./Menu";
import Header from "./Header";
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

        console.log("cacheMenu", cacheMenu);
        return (
            <article className="ro-main-wrap">
                <Menu />
                <section className="ro-main" style={{ minHeight: bodyHeight }}>
                    <Header />
                    <main className="ro-body-container">
                        {/* {[2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 23, 24].map((_) => (
                            <div key={_} style={{ height: 120 }}>
                                hahahahhhah hahahahha
                            </div>
                        ))} */}
                        <Switch>
                            {/* <Route path="/" component={<div>HOME</div>} /> */}
                            {cacheMenu.map(({ path, Component }) => (
                                <Route key={path} path={path} component={Component} />
                            ))}
                            {/* <Route component={<div>404</div>} /> */}
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
    isLoading: showLoading(state, "mask"),
});

export default connect(mapStateToProps)(Main);
