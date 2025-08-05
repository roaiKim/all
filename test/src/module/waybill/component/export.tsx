import { Button } from "antd";
import { AdditionMessage } from "type";
import { ModalCard } from "components/modal-card";
import { PageModal } from "components/page-modal";
import { STATUS_TAG } from "module/home/type";
import { PageModalState } from "utils/hooks/usePageModal";
import { WaybillService$addition$response } from "../type";

interface ExportProps extends PageModalState {}

export default function (props: ExportProps) {
    const { modalState } = props;

    return (
        <div>
            <PageModal
                open={modalState.open}
                close={() => {
                    modalState.setViewState({ open: false });
                }}
                width={1100}
                title="批量导入"
            >
                <ModalCard>
                    <div>Ti</div>
                </ModalCard>
            </PageModal>
        </div>
    );
}
