import dayjs from "dayjs";
import { PageTableRequest } from "@api/AdvancedTableService";
import { ColumnsService, RenderColumnType } from "./type";

export const renderTableTitle = (columnOrigin, service: typeof ColumnsService, isNoneOrder: boolean, startOrder: number) => {
    const originCol = columnOrigin.reduce((prev, next) => ((prev[next.propKey] = next), prev), {});

    const columns = [];
    const columnsConfig = [];

    if (!isNoneOrder) {
        columns.push({
            align: "center",
            dataIndex: "",
            key: "",
            title: "序号",
            width: 50,
            fixed: "left",
            render(text, record, index) {
                return startOrder + index + 1;
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
            dataIndex: "",
            key: "",
            title: "操作",
            width: 120,
            fixed: "right",
            render(text, record, index) {
                return "操作" + index;
            },
        });
    }
    // const cols = columns
    //     .filter((item) => item.title)
    //     .map((item) => {
    //         if (!dd[item.propKey]) {
    //             dd[item.propKey] = 1;
    //         } else {
    //             console.log("重复Key", item.propKey);
    //         }
    //         return {
    //             dataIndex: item.propKey,
    //             key: item.propKey,
    //             title: item.title,
    //             ellipsis: true,
    //             width: 150,
    //             render(value) {
    //                 if (typeof value === "object") {
    //                     if (Array.isArray(value)) {
    //                         return "Array";
    //                     }
    //                     return "object";
    //                 }
    //                 return value || "-";
    //             },
    //         };
    //     });

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
