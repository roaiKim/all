import Address from "./address.json";
const getAddressGrade = (list, grade) => {
    const fun = (children, index) => {
        if (!children?.length) {
            return null;
        }
        return children.map((item) => {
            let chs = null;
            if (index.value < grade) {
                item.children?.length && (chs = fun(item.children, index));
                index.value = index.value + 1;
            } else {
                // index.value = 0;
            }
            return {
                label: item.label,
                value: item.value,
                children: chs, // item.children?.length && index < grade ? fun(item.children) : null,
            };
        });
    };
    return list.map((item) => {
        const index = {
            value: 0,
        };
        return {
            label: item.label,
            value: item.value,
            children: fun(item.children, index),
        };
    });
    // return fun(list);
};
console.log(getAddressGrade(Address.data, 3));
