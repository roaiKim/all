import React from "react";
import "./index.less";

class Main extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return (
            <article className="ro-module-wrap ro-user-module">
                User module
                <div className="ro-tips-wave-container">
                    <span>捞</span>
                    <b />
                    <b />
                    <b />
                </div>
            </article>
        );
    }

}

export default Main;
