import React from "react";
import { useFormik } from "formik";

export const SignupForm = () => {
    // Pass the useFormik() hook initial form values and a submit function that will
    // be called when the form is submitted
    const formik = useFormik({
        initialValues: {
            email: "",
            lastName: "",
            firstName: "",
        },
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });
    console.log("render");
    return (
        <form onSubmit={formik.handleSubmit}>
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" name="firstName" type="text" value={formik.values.firstName} onChange={formik.handleChange} />

            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" name="lastName" type="text" value={formik.values.lastName} onChange={formik.handleChange} />

            <label htmlFor="email">Email Address</label>
            <input id="email" name="email" type="email" onChange={formik.handleChange} value={formik.values.email} />
            <button type="submit">Submit</button>
        </form>
    );
};
