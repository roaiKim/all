import React from "react";
import { generate } from "./t";
import "./index.less";

class Main extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const type = generate();
        console.log(" type -", type);
        return (
            <article className="ro-module-wrap ro-type-module">
                <div className="ro-info-wrap">tio</div>
            </article>
        );
    }
}

export default Main;
