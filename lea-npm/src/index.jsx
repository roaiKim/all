import ReactDOM from "react-dom";
import React from "react";
import Op from "./Op";
// import "asset/css/global/index.less";

import ReactSortableHoc from "package/react-sortable-hoc";
import FormikRO from "npm/formik";
import Flow from "npm/logicflow";
import BeautifulDnd from "npm/beautiful_dnd";

ReactDOM.render(
    <div>
        {/* <ReactSortableHoc /> */}
        <FormikRO />
        {/* <Flow /> */}
    </div>,
    document.getElementById("react-app")
);
