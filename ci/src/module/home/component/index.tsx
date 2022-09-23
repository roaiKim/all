import React, { useState } from "react";
import { RootState } from "type/state";
import { connect, useDispatch } from "react-redux";
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
    const [s, setS] = useState([]);

    const { tableSource, tableLoading } = props;

    console.log("s", s);
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
                isNonePagination
            />
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    tableSource: state.app.home.table,
    tableLoading: showLoading(state, "table"),
});

export default connect(mapStateToProps)(Home);
