import dayjs from "dayjs";
import { alphabet, CellTableColumn, ColumnsService } from "./type";

export const deafaultColKeys = ["__orderNumber", "__operate"];

const renderAction = (actionView) => {
    return {
        align: "center",
        dataIndex: deafaultColKeys[1],
        key: deafaultColKeys[1],
        title: "操作",
        width: actionView || 120,
        fixed: "right",
        render(text: string, record: object, rowIndex: number, colIndex: number, colKey: string) {
            return "操作" + rowIndex;
        },
    };
};

// 渲染 表格
export const renderTableColumnsByServer = (service: typeof ColumnsService, isNoneOrder: boolean, isNoneAction: boolean, actionView) => {
    const columns = [];

    if (!isNoneOrder) {
        columns.push({
            align: "center",
            dataIndex: deafaultColKeys[0],
            key: deafaultColKeys[0],
            title: "序号",
            width: 50,
            fixed: "left",
            render(text: string, record: object, rowIndex: number, colIndex: number, colKey: string) {
                return <div style={{ textAlign: "center" }}>{rowIndex + 1}</div>;
            },
        });
    }

    for (const propertyName in service) {
        const propertys: any = {};
        for (const t in service[propertyName]) {
            propertys[t] = service[propertyName][t];
        }
        const { columnName, columnWidth, columnType, columnDataType, columnMap, columnConfig, columnStaticOption } = propertys;
        const renderProperty = {
            dataIndex: propertyName,
            key: propertyName,
            title: columnName,
            ellipsis: true,
            width: columnWidth || 150,
            render(text: string, record: object, rowIndex: number, colIndex: number, colKey: string) {
                // columnType: "customer" | "string" | "option" | "date" | "ignore";
                if (columnType === "string") {
                    return text ?? "-";
                } else if (columnType === "customer") {
                    return service[propertyName](text, record, rowIndex, colIndex, colKey);
                } else if (columnType === "option") {
                    const current = columnStaticOption.find((item) => item.key === text);
                    if (current) {
                        const { value, style } = current;
                        return <span style={style || {}}>{value}</span>;
                    }
                    return "-";
                } else if (columnType === "date") {
                    return text ? dayjs(text).format(columnDataType) : "-";
                }
                return text ?? "-";
            },
        };

        columns.push(renderProperty);
    }

    if (!isNoneAction) {
        columns.push(renderAction(actionView));
    }
    return columns;
};

export const renderTableColumnsByArray = (columns: CellTableColumn[], isNoneOrder: boolean, isNoneAction: boolean, actionView) => {
    const col = [];
    if (!isNoneOrder) {
        col.push({
            align: "center",
            dataIndex: deafaultColKeys[0],
            key: deafaultColKeys[0],
            title: "序号",
            width: 50,
            fixed: "left",
            render(text: string, record: object, rowIndex: number, colIndex: number, colKey: string) {
                return <div style={{ textAlign: "center" }}>{rowIndex + 1}</div>;
            },
        });
    }
    columns.forEach((item) => {
        const [columnName, propertyName] = item;
        let [, , render, columnWidth] = item;

        if (typeof render === "number") {
            columnWidth = render;
            render = null;
        }

        col.push({
            dataIndex: propertyName,
            key: propertyName,
            title: columnName,
            width: columnWidth || 150,
            render: (text: string, record: object, rowIndex: number, colIndex: number, colKey: string) => {
                if (!render || render === true) {
                    return text;
                } else {
                    return render(text, record, rowIndex, colIndex, colKey);
                }
            },
        });
    });
    if (!isNoneAction) {
        col.push(renderAction(actionView));
    }
    return col;
};

export function getColPosition(colIndex: number) {
    const firstOrder = colIndex / 26;
    const secondOrder = colIndex % 26;
    let colSign = "";
    if (firstOrder < 1) {
        colSign = alphabet[secondOrder];
    } else {
        colSign = `${alphabet[Math.floor(firstOrder) - 1]}${alphabet[secondOrder]}`;
    }
    return colSign;
}
