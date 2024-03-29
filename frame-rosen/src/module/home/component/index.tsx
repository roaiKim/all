import React, { useState } from "react";
import { connect } from "react-redux";
import { showLoading } from "@core";
import { Button } from "antd";
import produce from "immer";
import { PageTable } from "components/page-table";
import { actions } from "module/home";
import { RootState } from "type/state";
import { usePageModal } from "utils/hooks/usePageModal";
import Addition from "./addition";
import "./index.less";

interface HomeProps extends ReturnType<typeof mapStateToProps> {}

function Home(props: HomeProps) {
    const [count, setCount] = useState<{ count: number; count2: number; count3: number }>({ count: 1, count2: 1, count3: 1 });
    const pageModalState = usePageModal();
    const [values, setTimes] = useState({ times: 1 });

    const { tableSource, tableLoading } = props;
    console.log("update-times", values.times);
    return (
        <div className="ro-home-module">
            <Addition modalState={pageModalState} />
            <PageTable.header title="运单管理" modalState={pageModalState}>
                <Button
                    size="small"
                    onClick={() => {
                        setCount((prev) => ({ ...prev, count: prev.count + 1 }));
                    }}
                >
                    改名{count.count}-{count.count2}-{count.count3}
                </Button>
                <Button
                    size="small"
                    onClick={() => {
                        // setTimes((prev) => ({ ...prev, times: 1 }));
                        values.times += 1;
                        setTimes(values);
                        // setTimes(
                        //     produce(values, (draft) => {
                        //         draft.times += 1;
                        //     })
                        // );
                    }}
                >
                    times{values.times}
                </Button>
            </PageTable.header>

            {values.times}
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
