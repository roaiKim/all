import React from "react";
import { connect } from "react-redux";
import { TabComponent } from "@component";
import "./index.less";
import Parent from "./Parent";
import Child from "./Child";

class Main extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <article className="ro-module-wrap ro-components-module">
                <div className="ro-table-wrap">
                    ff
                    <Parent>
                        <Child> ss </Child>
                    </Parent>
                </div>
                <div>{/* <TabComponent /> */}</div>
            </article>
        );
    }
}

const mapStateToProps = (state) => ({
    source: state.app.component.list,
});

export default connect(mapStateToProps)(Main);
