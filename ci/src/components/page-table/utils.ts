export const transformTitle = (columns) => {
    const dd = {};
    return columns
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
};
