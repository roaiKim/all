import React from "react";
import "./index.less";

class Main extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    onClick =() => {
        console.log("error");
        const { history } = this.props;
        history.push("/table", { id: 888, name: "item" });
    }

    render() {
        return (
            <article className="ro-module-wrap ro-user-module">
                User module
                <button onClick={this.onClick} type="button">click</button>
            </article>
        );
    }

}

export default Main;
