import { useContext, useState } from "react";
import { connect, DispatchProp } from "react-redux";
import { Button } from "antd";
import { PageTable } from "components/page-table";
import { RootState } from "type/state";
import { useModuleName } from "utils/hooks/useModuleName";
import { usePageModal } from "utils/hooks/usePageModal";
import Addition from "./addition";
import "./index.less";

interface WaybillProps extends DispatchProp, ReturnType<typeof mapStateToProps> {}

function Waybill(props: WaybillProps) {
    const { addition } = props;
    const pageModalState = usePageModal({ open: addition.additionOpen, readonly: addition.additionReadonly });
    const moduleName = useModuleName();

    return (
        <div className="ro-waybill-module">
            <Addition addition={addition} pageModalState={pageModalState} />
            <PageTable.header title="运单管理" pageModalState={pageModalState}>
                <Button
                    size="small"
                    onClick={() => {
                        // setCount((prev) => ({ ...prev, count: prev.count + 1 }));
                    }}
                >
                    改名
                </Button>
            </PageTable.header>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    table: state.app.waybill.table,
    addition: state.app.waybill.addition,
});

export default connect(mapStateToProps)(Waybill);
