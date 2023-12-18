import { Button } from "antd";
import { AdditionMessage } from "type";
import { ModalCard } from "components/modal-card";
import { PageModal } from "components/page-modal";
import { STATUS_TAG } from "module/home/type";
import { PageModalState } from "utils/hooks/usePageModal";
import { WaybillService$addition$response } from "../type";

interface AdditionProps extends PageModalState {
    addition: AdditionMessage<WaybillService$addition$response>;
}

export default function (props: AdditionProps) {
    const { modalState } = props;

    const baseInfo = {
        status: 3,
        createTime: 1658745167000,
        createUserName: "罗森",
        updateTime: 166099785000,
        updateUserName: "罗森2",
    };

    console.log("==pageModalState==", modalState.loading);

    return (
        <div>
            <PageModal
                open={modalState.open}
                close={() => {
                    modalState.setViewState({ open: false });
                }}
                width={1100}
                title={"运单管理"}
            >
                <PageModal.header statusTag={STATUS_TAG} baseInfo={baseInfo}></PageModal.header>
                <ModalCard>
                    <ModalCard.Header title="基本信息">
                        <Button
                            size="small"
                            onClick={() => {
                                // console.log("==form.values==", form.values);
                                // form.validate();
                            }}
                        >
                            保存
                        </Button>
                    </ModalCard.Header>
                    <div>Ti</div>
                </ModalCard>
            </PageModal>
        </div>
    );
}
