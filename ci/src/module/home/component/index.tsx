import React, { useState } from "react";
import { connect } from "react-redux";
import { showLoading } from "@core";
import { Button } from "antd";
import { PageTable } from "components/page-table";
import { actions } from "module/home";
import { RootState } from "type/state";
import { usePageModal } from "utils/hooks/usePageModal";
import Addition from "./addition";
import "./index.less";

interface HomeProps extends ReturnType<typeof mapStateToProps> {}

function Home(props: HomeProps) {
    const [count, setCount] = useState<{ count: number; count2: number; count3: number }>({ count: 1, count2: 1, count3: 1 });
    const { view, setView } = usePageModal();
    const [s, setS] = useState([]);

    const { tableSource, tableLoading } = props;

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
            {/* <PageTable
                signature={{
                    name: "s/waybillkkk",
                    actions,
                }}
                tableSource={tableSource}
                rowKey="transportOrderNumber"
                rowSelection={{
                    onChange(data: any, source: any) {
                        setS(source);
                    },
                    selectedRowKeys: s,
                }}
                tableLoading={tableLoading}
            /> */}
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    tableSource: state.app.home.table,
    tableLoading: showLoading(state, "table"),
});

export default connect(mapStateToProps)(Home);
