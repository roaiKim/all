import Address from "./address.json";
const getAddressGrade = (list, grade) => {
    const fun = (children, index) => {
        // index.value = index.value + 1;
        let config = true;
        if (index + 1 >= grade) {
            return null;
        }
        if (!children?.length) {
            return null;
        }
        return children.map((item) => {
            let chs = null;
            if (config && item.children?.length) {
                chs = fun(item.children, index + 1)
            }
            return {
                label: item.label,
                value: item.value,
                children: chs, // item.children?.length && index < grade ? fun(item.children) : null,
            };
        });
    };
    return list.map((item) => {
        const index = 0;
        return {
            label: item.label,
            value: item.value,
            children: fun(item.children, index),
        };
    });
};
console.log(getAddressGrade(Address.data, 3));
