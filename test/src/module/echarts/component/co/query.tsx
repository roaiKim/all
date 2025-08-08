// @ts-nocheck
function getEle() {
    const parent = document.querySelectorAll(".doc-main");
    const title = parent[0].querySelector(`h2[id^="doc-content-"]`);

    const state = {};

    function filter(element, level, treeState) {
        const pathParent = element.querySelector(`.path-parent`);
        const pathParentValue = pathParent.querySelectorAll(`.path-parent a`);
        const pathValue = Array.from(pathParentValue).map((item) => item.innerText);
        const base = element.querySelector(`.path-base`)?.innerText;
        const defaultValue = element.querySelector(`.default-value span`)?.innerText;
        const propTypes = Array.from(element.querySelectorAll(`.prop-types span`)).map((item) => item.innerText);
        const description = element.querySelector(`.item-description > p`)?.innerText;

        const des = element.querySelector(`.item-description`);
        const de = des.querySelectorAll(`li`);
        const options = [];

        Array.from(de).forEach((item) => {
            const v = item.querySelector("p")?.innerText;
            const d = item.querySelector(".codespan")?.innerText;

            if (v || d) {
                options.push({
                    key: v,
                    des: d,
                });
            }
        });

        const current = {};

        current["parentKey"] = pathValue;
        current["key"] = base;
        current["defaultValue"] = defaultValue;
        current["description"] = description;
        current["options"] = options;
        current["propTypes"] = propTypes;
        current["children"] = [];

        treeState[base] = current;

        const children = element.querySelector(`.children`);
        if (children) {
            Array.from(children.querySelectorAll(`.level-${level}`)).forEach((item) => {
                const top = {};
                filter(item, level + 1, top);
                current["children"].push(top);
            });
        }
    }

    Array.from(document.querySelectorAll(`.level-1`)).forEach((item) => {
        filter(item, 2, state);
    });

    console.log("-------state---------", state);
}
