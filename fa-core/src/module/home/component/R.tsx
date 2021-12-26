import React from "react";
import { connect } from "react-redux";
import { RootState } from "type/state";

class Rs extends React.Component {
    render() {
        return <div>sss</div>;
    }
}

const mapStateToProps = (state: RootState) => {
    return { name: state.app.home.name };
};

export default connect(mapStateToProps)(Rs);
