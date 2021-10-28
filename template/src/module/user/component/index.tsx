import React from "react";
import "./index.less";
import Test from "./typescript";

class Main extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { avb } = this.props;
        return (
            <article className="ro-module-wrap ro-user-module">
                User module
                <div className="ro-tips-wave-container">
                    <span>捞</span>
                    <b />
                    <b />
                    <b />
                </div>
                <Test />
            </article>
        );
    }
}

export default Main;
