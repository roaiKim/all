export { CellTable, CellTableProps } from "./components/cell-table";

function transData(fields) {
    if (!fields?.length) {
        return {
            columns: [],
            dataSource: [],
        };
    }
    const columns = [];
    const dataSource = {};
    fields.forEach((field, index) => {
        const { displayName, values } = field || {};
        columns.push([displayName, displayName]);
        if (values?.length) {
            values.forEach((value, valueIndex) => {
                dataSource[valueIndex] = {
                    ...(dataSource[valueIndex] || {}),
                    [displayName]: value.value,
                };
            });
        }
    });
    return {
        columns,
        dataSource: Object.values(dataSource),
    };
}
