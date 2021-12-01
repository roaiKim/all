import Address from "./address.json";
const getAddressGrade = (list, grade) => {
    const fun = (children, index) => {
        return index >= grade || !children?.length
            ? null
            : children.map((item) => ({
                  label: item.label,
                  value: item.value,
                  children: (item.children?.length && fun(item.children, index + 1)) || null,
              }));
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
console.log(getAddressGrade(Address.data, 2));
