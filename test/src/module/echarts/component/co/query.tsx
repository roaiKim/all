// @ts-nocheck
function getEle() {
    const parent = document.querySelectorAll(".doc-main");
    const title = parent[0].querySelector(`h2[id^="doc-content-"]`);

    const state = {};

    function filter(element, level, treeState, index) {
        const pathParent = element.querySelector(`.path-parent`);
        const pathParentValue = pathParent.querySelectorAll(`.path-parent a`);
        const pathValue = Array.from(pathParentValue).map((item) => item.innerText?.replaceAll(".", ""));
        const base = element.querySelector(`.path-base`)?.innerText;
        const defaultValue = element.querySelector(`.default-value span`)?.innerText;
        const propTypesEle = element.querySelector(`.prop-types`);
        const propTypes = Array.from(propTypesEle.querySelectorAll(`span`))
            .map((item) => item.innerText)
            .filter(Boolean)
            .map((item) => item.toLocaleLowerCase());
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

        current["sort"] = index;
        current["level"] = level;
        current["parentPath"] = pathValue;
        current["id"] = base;
        current["name"] = base;
        current["defaultValue"] = defaultValue;
        current["description"] = description;
        current["options"] = options;
        current["propTypes"] = propTypes;
        current["descendant"] = [];

        treeState[base] = {
            ...current,
        };

        const descendant = {};

        const children = element.querySelector(`.children`);
        if (children) {
            Array.from(children.querySelectorAll(`.level-${level}`)).forEach((item, index) => {
                const top = {};
                const sl = filter(item, level + 1, top, index);
                const vl = Object.values(top)[0];
                if (vl?.id) {
                    descendant[vl.id] = vl;
                }
                current["descendant"].push(sl);
            });
            current["isLeaf"] = false;
        } else {
            current["isLeaf"] = true;
        }
        return current;
    }
    const config = [];
    Array.from(document.querySelectorAll(`.level-1`)).forEach((item, index) => {
        const sl = filter(item, 2, state, index);
        config.push(sl);
    });

    console.log("-------config---------", config);
    console.log("-------state---------", state);
}
