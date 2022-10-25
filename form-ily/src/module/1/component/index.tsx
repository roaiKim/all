import React from "react";
import "./index.less";
import { createForm } from "@formily/core";
import { FormProvider, Field, FormConsumer } from "@formily/react";
import { FormItem, FormLayout, Input } from "@formily/antd";
import { AdvancedSelect } from "./sl";

interface HomeProps {}

const form = createForm();

export default function (prop: HomeProps) {
    return (
        <div className="ro-example-component-container">
            <div>
                <FormProvider form={form}>
                    <FormLayout layout="vertical">
                        <Field name="input" title="输入框" required initialValue={"wend"} decorator={[FormItem]} component={[Input]}></Field>
                    </FormLayout>
                    <FormConsumer>
                        {() => (
                            <div>
                                <Field
                                    name="inputs"
                                    title="输入框"
                                    required
                                    value={form.values.input}
                                    decorator={[FormItem]}
                                    component={[
                                        AdvancedSelect,
                                        {
                                            optionLabel: "op",
                                            optionValue: "ha",
                                            options: [
                                                {
                                                    op: "io",
                                                    ha: "iop",
                                                },
                                                {
                                                    op: "io1",
                                                    ha: "iop1",
                                                },
                                                {
                                                    op: "io2",
                                                    ha: "iop2",
                                                },
                                            ],
                                        },
                                    ]}
                                ></Field>
                            </div>
                        )}
                    </FormConsumer>
                </FormProvider>
                <div style={{ width: 300 }}>TTTTTTTTTTT</div>
            </div>
        </div>
    );
}
