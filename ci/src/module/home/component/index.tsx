import React, { useEffect, useState } from "react";
import "./index.less";
import { RootState } from "type/state";
import { connect, DispatchProp } from "react-redux";
import { PageTitle } from "components/page-header";
import { PageModal } from "components/page-modal";
import { PageTable } from "components/page-table";
import { usePageModal } from "utils/hooks/usePageModal";
import Addition from "./addition";

interface HomeProps extends DispatchProp {
    userName: string | null;
    type: string | null;
}

function Home(props: HomeProps) {
    const { view, setView } = usePageModal({});
    return (
        <div className="ro-home-module">
            <Addition view={view} setView={setView} />
            <PageTitle title="运单管理" view={view} setView={setView} />
            <PageTable />
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    userName: state.app.main.userName,
    type: state.app.home.type,
});

export default connect(mapStateToProps)(Home);
