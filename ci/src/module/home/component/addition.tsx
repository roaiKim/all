import { Button } from "antd";
import { ModalCard } from "components/modal-card";
import { PageModal } from "components/page-modal";
import { SetView, ViewState } from "utils/hooks/usePageModal";

interface AdditionProps {
    view: ViewState;
    setView: SetView;
}

export default function (props: AdditionProps) {
    const { view, setView } = props;
    return (
        <div>
            <PageModal view={view} setView={setView} title={"运单管理"}>
                <ModalCard>
                    <ModalCard.Header title="路由节点">
                        <Button size="small">保存</Button>
                    </ModalCard.Header>
                </ModalCard>
            </PageModal>
        </div>
    );
}
