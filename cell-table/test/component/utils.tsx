import dayjs from "dayjs";
import { ColumnsService } from "./type";

export const deafaultColKeys = ["__orderNumber", "__operate"];

export const renderTableTitle = (columnOrigin, service: typeof ColumnsService, isNoneOrder: boolean, startOrder: number) => {
    const originCol = columnOrigin.reduce((prev, next) => ((prev[next.propKey] = next), prev), {});

    const columns = [];
    const columnsConfig = [];

    if (!isNoneOrder) {
        columns.push({
            align: "center",
            dataIndex: deafaultColKeys[0],
            key: deafaultColKeys[0],
            title: "序号",
            width: 35,
            fixed: "left",
            render(text, record, index, rowIndex) {
                return <div style={{ textAlign: "center" }}>{rowIndex + index + 1}</div>;
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
            render(text, record, index) {
                // columnType: "customer" | "string" | "option" | "date" | "ignore";
                if (columnType === "string") {
                    return text ?? "-";
                } else if (columnType === "customer") {
                    return service[propertyName](text, record, index);
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

        columnsConfig.push({
            propertys,
            propertyName,
            origin: originCol[propertyName] || null,
        });
    }

    if (!isNoneOrder) {
        columns.push({
            align: "center",
            dataIndex: deafaultColKeys[1],
            key: deafaultColKeys[1],
            title: "操作",
            width: 120,
            fixed: "right",
            render(text, record, index) {
                return "操作" + index;
            },
        });
    }
    return { columns, columnsConfig };
};

export const transformSelected = (originSelected, rowKey) => {
    if (Array.isArray(originSelected) && originSelected?.length) {
        if (originSelected.every((item) => typeof item === "object")) {
            return originSelected.map((item, index) => {
                if (rowKey) {
                    if (typeof rowKey === "string") {
                        return item[rowKey];
                    }
                    return rowKey(item as any, index);
                }
                return item["id"];
            });
        } else {
            return originSelected;
        }
    }
    return [];
};

function calcColService(colService = {}) {
    console.log("--colService--", colService);
}
