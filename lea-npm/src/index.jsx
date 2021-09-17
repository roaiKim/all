import ReactDOM from "react-dom";
import React from "react";
import Op from "./Op";
// import "asset/css/global/index.less";

import ReactSortableHoc from "package/react-sortable-hoc";
import FormikRO from "npm/formik";

ReactDOM.render(
    <div>
        {/* <ReactSortableHoc /> */}
        <FormikRO />
    </div>,
    document.getElementById("react-app")
);
