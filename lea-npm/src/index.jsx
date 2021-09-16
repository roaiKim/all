import ReactDOM from "react-dom";
import React from "react";
import Op from "./Op";
// import "asset/css/global/index.less";

import ReactSortableHoc from "package/react-sortable-hoc"

ReactDOM.render(<div>
    <ReactSortableHoc />
</div>,
document.getElementById("react-app"))
