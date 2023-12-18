import { useContext, useState } from "react";
import { connect, DispatchProp } from "react-redux";
import { Button } from "antd";
import { PageTable } from "components/page-table";
import { RootState } from "type/state";
import { usePageMainModal, usePageModal } from "utils/hooks/usePageModal";
import Addition from "./addition";
import Export from "./export";
import "./index.less";

import { actions } from "..";

interface WaybillProps extends DispatchProp, ReturnType<typeof mapStateToProps> {}

function Waybill(props: WaybillProps) {
    const { addition, table } = props;
    const pageModalState = usePageMainModal(addition);
    const exportState = usePageModal();

    return (
        <div className="ro-waybill-module">
            <Addition addition={addition} modalState={pageModalState} />
            <Export modalState={exportState} />
            <PageTable.header title="运单管理" modalState={pageModalState}>
                <Button
                    size="small"
                    onClick={() => {
                        exportState.setViewState({ open: true, initialized: true });
                    }}
                >
                    改名
                </Button>
            </PageTable.header>
            <PageTable action={actions.pageTable} tableSource={table.source} rowKey="transportOrderNumber" />
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    table: state.app.waybill.table,
    addition: state.app.waybill.addition,
});

export default connect(mapStateToProps)(Waybill);
