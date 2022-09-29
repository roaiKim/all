export const transformTitle = (columns) => {
    const dd = {};
    const cols = columns
        .filter((item) => item.title)
        .map((item) => {
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
            };
        });

    return cols;
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
