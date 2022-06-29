import React, { useEffect, useState } from "react";
import "./index.less";
import { RootState } from "type/state";
import { connect, DispatchProp } from "react-redux";

interface HomeProps extends DispatchProp {
    userName: string | null;
    type: string | null;
}

function Home(props: HomeProps) {
    return <div className="ro-home-module">HOME</div>;
}

const mapStateToProps = (state: RootState) => ({
    userName: state.app.main.userName,
    type: state.app.home.type,
});

export default connect(mapStateToProps)(Home);
