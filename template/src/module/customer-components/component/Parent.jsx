import React from "react";

class Parent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const View = React.cloneElement(this.props.children, { type: "ros" });
        return <div>{View}</div>;
    }
}

export default Parent;
