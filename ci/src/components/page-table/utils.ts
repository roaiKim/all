export const transformTitle = (columns, handleResize) => {
    const dd = {};
    return columns
        .filter((item) => item.title)
        .map((item, index) => {
            if (!dd[item.propKey]) {
                dd[item.propKey] = 1;
            } else {
                console.log("重复Key", item.propKey);
            }
            return {
                dataIndex: item.propKey,
                key: item.propKey,
                title: item.title,
                ellipsis: true,
                width: 150,
                render(value) {
                    if (typeof value === "object") {
                        if (Array.isArray(value)) {
                            return "Array";
                        }
                        return "object";
                    }
                    return value || "-";
                },
                onHeaderCell: (column) => ({
                    width: column.width,
                    onResize: handleResize(index),
                }),
            };
        });
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
