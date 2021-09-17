import React from "react";
import { useFormik } from "formik";

export const SignupForm = () => {
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const validate = (values) => {
        const errors: any = {};
        if (!values.firstName) {
            errors.firstName = "firstName is Required";
        } else if (values.firstName.length < 10) {
            errors.firstName = "Must be 10 characters or than";
        }

        if (!values.lastName) {
            errors.lastName = "Required";
        } else if (values.lastName.length < 20) {
            errors.lastName = "Must be 20 characters or less";
        }
        return errors;
    };

    const formik = useFormik({
        initialValues: {
            email: "",
            lastName: "",
            firstName: "",
        },
        validate,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });
    console.log("render", formik.errors, formik.touched);
    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" name="firstName" type="text" value={formik.values.firstName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.firstName && formik.errors.firstName ? <span style={{ color: "red" }}>{formik.errors.firstName}</span> : null}

            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" name="lastName" type="text" value={formik.values.lastName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
            {formik.touched.lastName && formik.errors.lastName ? <span style={{ color: "red" }}>{formik.errors.lastName}</span> : null}

            <label htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" onChange={formik.handleChange} value={formik.values.email} onBlur={formik.handleBlur} />
            <button type="submit">Submit</button>
        </form>
    );
};
