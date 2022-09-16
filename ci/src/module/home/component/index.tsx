import React, { useState } from "react";
import { RootState } from "type/state";
import { connect } from "react-redux";
import { PageTable } from "components/page-table";
import { usePageModal } from "utils/hooks/usePageModal";
import Addition from "./addition";
import { Button } from "antd";
import { actions } from "module/home";
import "./index.less";
import { showLoading } from "@core";

interface HomeProps extends ReturnType<typeof mapStateToProps> {}

function Home(props: HomeProps) {
    const [count, setCount] = useState<{ count: number; count2: number; count3: number }>({ count: 1, count2: 1, count3: 1 });
    const { view, setView } = usePageModal();
    const { tableSource, tableLoading } = props;
    // console.log("ttableLoadingt", tableLoading);
    return (
        <div className="ro-home-module">
            <Addition view={view} setView={setView} />
            <PageTable.header title="运单管理" view={view} setView={setView}>
                <Button
                    size="small"
                    onClick={() => {
                        setCount((prev) => ({ ...prev, count: prev.count + 1 }));
                    }}
                >
                    改名{count.count}-{count.count2}-{count.count3}
                </Button>
            </PageTable.header>
            <PageTable
                signature={{
                    name: "s/waybill",
                    fetch: actions.fetchPageTable,
                }}
                tableSource={tableSource}
            />
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    tableSource: state.app.home.tableSource,
    tableLoading: showLoading(state, "table"),
});

export default connect(mapStateToProps)(Home);
