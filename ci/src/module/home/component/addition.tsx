import { Button } from "antd";
import { ModalCard } from "components/modal-card";
import { PageModal } from "components/page-modal";
import { PageModalState } from "utils/hooks/usePageModal";
import { STATUS_TAG } from "../type";

interface AdditionProps extends PageModalState {}

// registerValidateLocale({
//     "zh-CN": {
//         required: "この項目は必須です",
//     },
// });

export default function (props: AdditionProps) {
    const { modalState } = props;
    // const form = useMemo(
    //     () =>
    //         createForm({
    //             effects() {
    //                 onFieldReact("projectId", (field: FieldType) => {
    //                     const { clientId, projectId } = form.values;
    //                     console.log("---effect--");
    //                     field.setValue((state) => (state.value = null));
    //                 });
    //             },
    //         }),
    //     []
    // );
    const baseInfo = {
        status: 3,
        createTime: 1658745167000,
        createUserName: "罗森",
        updateTime: 166099785000,
        updateUserName: "罗森2",
    };

    return (
        <div>
            <PageModal open={modalState.open} close={() => {}} width={1100} title={"运单管理"}>
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
