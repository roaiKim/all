import { Form, FormGrid, FormItem, Input, Password, Submit } from "@formily/antd";
import { createForm, onFieldReact, registerValidateLocale, Field as FieldType } from "@formily/core";
import { FormProvider, Field, VoidField } from "@formily/react";
import { Button } from "antd";
import { ModalCard } from "components/modal-card";
import { PageModal } from "components/page-modal";
import { BaseSelect } from "components/select";
import { useMemo } from "react";
import { SetView, ViewState } from "utils/hooks/usePageModal";

interface AdditionProps {
    view: ViewState;
    setView: SetView;
}

registerValidateLocale({
    "zh-CN": {
        required: "この項目は必須です",
    },
});

export default function (props: AdditionProps) {
    const { view, setView } = props;
    const form = useMemo(
        () =>
            createForm({
                effects() {
                    onFieldReact("projectId", (field: FieldType) => {
                        const { clientId, projectId } = form.values;
                        console.log("---effect--");
                        field.setValue((state) => (state.value = null));
                    });
                },
            }),
        []
    );

    return (
        <div>
            <PageModal view={view} setView={setView} place="global" width={1100} title={"运单管理"}>
                <ModalCard>
                    <ModalCard.Header title="基本信息">
                        <Button
                            size="small"
                            onClick={() => {
                                console.log("==form.values==", form.values);
                                // form.validate();
                            }}
                        >
                            保存
                        </Button>
                    </ModalCard.Header>
                    <Form form={form}>
                        <VoidField
                            name="voidField"
                            component={[
                                FormGrid,
                                {
                                    maxColumns: 3,
                                    minColumns: 2,
                                    columnGap: 15,
                                    rowGap: 0,
                                },
                            ]}
                        >
                            <Field
                                name="[clientId, clientName]"
                                title="客户名称"
                                required
                                decorator={[
                                    FormItem,
                                    {
                                        labelWidth: 80,
                                        labelAlign: "right",
                                    },
                                ]}
                                component={[BaseSelect, { size: "small" }]}
                            ></Field>
                            <Field
                                name="[projectId, projectName]"
                                title="冷云项目"
                                required
                                decorator={[
                                    FormItem,
                                    {
                                        labelWidth: 100,
                                        labelAlign: "right",
                                    },
                                ]}
                                component={[BaseSelect, { size: "small" }]}
                            ></Field>
                            <Field
                                name="[transportMethodCode, transportMethodName]"
                                title="运输模式"
                                required
                                decorator={[
                                    FormItem,
                                    {
                                        labelWidth: 80,
                                        labelAlign: "right",
                                    },
                                ]}
                                component={[BaseSelect, { size: "small" }]}
                            ></Field>
                            <Field
                                name="businessTypeCode"
                                title="业务类型"
                                decorator={[
                                    FormItem,
                                    {
                                        labelWidth: 80,
                                        labelAlign: "right",
                                    },
                                ]}
                                component={[Input, { size: "small" }]}
                            ></Field>
                            <Field
                                name="businessSubTypeCode"
                                title="业务子类型"
                                decorator={[
                                    FormItem,
                                    {
                                        labelWidth: 100,
                                        labelAlign: "right",
                                    },
                                ]}
                                component={[Input, { size: "small" }]}
                            ></Field>
                            <Field
                                name="paperyFaceListNumber"
                                title="冷云单号"
                                decorator={[
                                    FormItem,
                                    {
                                        labelWidth: 80,
                                        labelAlign: "right",
                                    },
                                ]}
                                component={[Input, { size: "small" }]}
                            ></Field>
                        </VoidField>
                    </Form>
                </ModalCard>
            </PageModal>
        </div>
    );
}
