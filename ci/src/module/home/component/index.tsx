import React, { useEffect, useState } from "react";
import "./index.less";
import { RootState } from "type/state";
import { connect, DispatchProp, useDispatch } from "react-redux";
import { PageTitle } from "components/page-header";
import { PageModal } from "components/page-modal";
import { PageTable } from "components/page-table";
import { usePageModal } from "utils/hooks/usePageModal";
import Addition from "./addition";
import { Button } from "antd";
import { v4 } from "uuid";
import { actions } from "module/home";

interface HomeProps extends ReturnType<typeof mapStateToProps> {}

function Home(props: HomeProps) {
    const [count, setCount] = useState<{ count: number; count2: number; count3: number }>({ count: 1, count2: 1, count3: 1 });
    const { view, setView } = usePageModal();
    const { tableSource } = props;

    return (
        <div className="ro-home-module">
            <Addition view={view} setView={setView} />
            <PageTitle title="运单管理" view={view} setView={setView}>
                <Button
                    size="small"
                    onClick={() => {
                        setCount((prev) => ({ ...prev, count: prev.count + 1 }));
                    }}
                >
                    改名{count.count}-{count.count2}-{count.count3}
                </Button>
            </PageTitle>
            <PageTable
                signature={{
                    name: "s/project",
                    fetch: actions.fetchPageTable,
                }}
                tableSource={tableSource}
            />
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    tableSource: state.app.home.tableSource,
});

export default connect(mapStateToProps)(Home);
