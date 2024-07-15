import { useMemo, useState } from "react";
import ReactDOM from "react-dom";
import "tslib";
import { cellTableColumn, WaybillColumns } from "./render/columns";
import { tableValue } from "./render/table-values";
import { CellTable } from "../src";

function TableContainer() {
    const [data, setData] = useState(tableValue);
    return (
        <div>
            <CellTable
                columns={cellTableColumn}
                dataSource={data}
                onCellChange={(value, record, rowIndex: number, colIndex: number, colKey: string) => {
                    console.log("onCellChange", value, record, rowIndex, colIndex, colKey);
                }}
                // getRowHeight={(rowData, rowIndex, colIndex, colKey) => {
                //     if (rowIndex === 5) {
                //         return 80;
                //     }
                //     return 40;
                // }}
                tableHeight={650}
                cellDeletePromiseCallBack={(dataSource) => {
                    setData(dataSource);
                    return Promise.resolve(true);
                }}
            ></CellTable>
        </div>
    );
}

ReactDOM.render(<TableContainer />, document.getElementById("react-app"));
