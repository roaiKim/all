// @ts-nocheck
function getEle() {
    const parent = document.querySelectorAll(".doc-main");
    const title = parent[0].querySelector(`h2[id^="doc-content-"]`);

    const state = {};

    function removeSign(name = "", regular) {
        return name.replaceAll(regular, "");
    }

    function filter(element, level, treeState, index) {
        const pathParent = element.querySelector(`.path-parent`);
        const pathParentValue = pathParent.querySelectorAll(`.path-parent a`);
        const pathValue = Array.from(pathParentValue).map((item) => item.innerText?.replaceAll(".", ""));
        const base = element.querySelector(`.path-base`)?.innerText;
        const defaultValue = element.querySelector(`span.default-value`)?.innerText;
        const propTypesEle = element.querySelector(`.prop-types`);
        const propTypes = Array.from(propTypesEle.querySelectorAll(`span`))
            .map((item) => item.innerText)
            .filter(Boolean)
            .map((item) => item.toLocaleLowerCase());
        const des = element.querySelector(`.item-description`);
        const description = Array.from(des.querySelectorAll(`p`)).map((item) => item.innerText);
        const shortDescroption = element.querySelector(`.item-description > p`)?.innerText;
        const ul = des.querySelector(`ul`);
        const li = ul?.querySelectorAll(`li`) || [];
        const options = [];

        Array.from(li).forEach((item) => {
            const desc = item.querySelector("p")?.innerText || item?.innerText;
            const key = item.querySelector(".codespan")?.innerText;

            if (key) {
                options.push({
                    key: removeSign(key, /[= ']/g),
                    des: removeSign(desc, /[= ']/g),
                });
            }
        });

        const current = {};

        current["sort"] = index;
        current["level"] = level;
        current["parentPath"] = pathValue;
        current["id"] = base;
        current["name"] = base;
        current["defaultValue"] = removeSign(defaultValue, /[= ']/g);
        current["shortDescroption"] = shortDescroption;
        if (shortDescroption !== description?.[0] || description?.length > 1) {
            current["description"] = description;
        }
        current["options"] = options;
        current["propTypes"] = propTypes;
        current["descendant"] = [];

        const descendant = {};

        if (current["description"]?.length > 0) {
            const example = Array.from(des.querySelectorAll(`pre`))
                .map((item) => item.innerText)
                .filter(Boolean);
            current["example"] = example;
        }

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

        treeState[base] = {
            ...current,
        };

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
