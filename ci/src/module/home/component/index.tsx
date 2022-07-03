import React, { useEffect, useState } from "react";
import "./index.less";
import { RootState } from "type/state";
import { connect, DispatchProp } from "react-redux";
import { PageModuleHeader } from "components/page-header";
import { PageModuleTable } from "components/page-table";

interface HomeProps extends DispatchProp {
    userName: string | null;
    type: string | null;
}

function Home(props: HomeProps) {
    return (
        <div className="ro-home-module">
            <PageModuleHeader title="运单管理" />
            <PageModuleTable />
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    userName: state.app.main.userName,
    type: state.app.home.type,
});

export default connect(mapStateToProps)(Home);
