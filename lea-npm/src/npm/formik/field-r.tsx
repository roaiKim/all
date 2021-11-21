import React from "react";
import { Field, Form, Formik, FormikProps } from "formik";

const MyInput = ({ field, form, ...props }) => {
    return <input {...field} {...props} />;
};

export const Example = () => (
    <div>
        <h1>My Form</h1>
        <Formik
            initialValues={{ email: "", color: "red", firstName: "", lastName: "" }}
            onSubmit={(values, actions) => {
                console.log(JSON.stringify(values, null, 2));
                actions.setSubmitting(false);
            }}
        >
            {(props: FormikProps<any>) => (
                <Form>
                    <Field type="email" name="email" placeholder="Email" />
                    <Field as="select" name="color">
                        <option value="red">Red</option>
                        <option value="green">Green</option>
                        <option value="blue">Blue</option>
                    </Field>

                    <Field name="lastName">
                        {({
                            field, // { name, value, onChange, onBlur }
                            form, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                            meta,
                        }) => {
                            console.log("field-form-meta", field, form, meta);
                            return (
                                <div>
                                    <input type="text" placeholder="Email" {...field} />
                                    {meta.touched && meta.error && <div className="error">{meta.error}</div>}
                                </div>
                            );
                        }}
                    </Field>
                    <Field name="lastName" placeholder="Doe" component={MyInput} />
                    <button type="submit">Submit</button>
                </Form>
            )}
        </Formik>
    </div>
);
