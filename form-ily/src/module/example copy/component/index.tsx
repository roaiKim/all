import React from "react";
import "./index.less";

interface HomeState {}

interface HomeProps {}

export default class Home extends React.PureComponent<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);
        this.state = {};
    }

    override render() {
        return (
            <div className="ro-example-component-container">
                <div style={{ width: 300 }}>TTTTTTTTTTT</div>
            </div>
        );
    }
}
