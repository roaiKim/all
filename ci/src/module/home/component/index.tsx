import React, { useEffect, useState } from "react";
import "./index.less";
import { RootState } from "type/state";
import { connect, DispatchProp } from "react-redux";
import { PageTitle } from "components/page-header";
import { PageModal } from "components/page-modal";
import { PageTable } from "components/page-table";
import { usePageModal } from "utils/hooks/usePageModal";
import Addition from "./addition";
import { Button } from "antd";
import { v4 } from "uuid";

interface HomeProps extends DispatchProp {
    type: string | null;
}

function Home(props: HomeProps) {
    const [name, setName] = useState<string>("wawa");
    const { view, setView } = usePageModal({ name });

    return (
        <div className="ro-home-module">
            <Addition view={view} setView={setView} />
            <PageTitle title="运单管理" view={view} setView={setView}>
                <Button
                    size="small"
                    onClick={() => {
                        setName(v4());
                    }}
                >
                    改名
                </Button>
            </PageTitle>
            <PageTable />
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    type: state.app.home.type,
});

export default connect(mapStateToProps)(Home);
