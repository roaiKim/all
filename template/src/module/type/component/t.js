const doc = require("./swagger.json");

function translateType(properties) {
    switch (properties.type) {
        case "array":
            if (properties.items && properties.items.$ref) {
                const value = properties.items.$ref.split("/");
                return value[value.length - 1];
            }
            return "s";
        case "number":
        case "integer":
            return "number";
        case "string":
            return "string";
        default:
            console.log("properties.type", properties.type);
    }
}

function generateType(definitions) {
    const lines = [];
    const keyarr = Object.keys(definitions).slice(0, 2);
    console.log("keyarr.length", keyarr.length);
    for (let i = 0; i < keyarr.length; i++) {
        const key = keyarr[i];
        const value = definitions[key];
        if (key.includes("«")) {
            continue;
        }
        lines.push(`export interface ${key} {`);
        lines.push("");
        for (const [key1, value1] of Object.entries(value.properties)) {
            // console.log([key1, value1]);
            lines.push(`${key1}: ${translateType(value1)};`);
        }
        lines.push("}");
        lines.push(";");
    }
    return lines.join("");
}

export function generate() {
    const { definitions } = doc;
    return generateType(definitions);
}
