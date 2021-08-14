const doc = require("./swagger.json");
const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");
const childProcess = require("child_process");

const typeSourcePath = path.resolve(__dirname, `type.ts`);
const swaggerDoc = path.resolve(__dirname, `swagger-doc.ts`);

function spawn(command, arguments) {
    const isWindows = process.platform === "win32";
    const result = childProcess.spawnSync(isWindows ? command + ".cmd" : command, arguments, {stdio: "inherit"});
    if (result.error) {
        console.error(result.error);
        process.exit(1);
    }
    if (result.status !== 0) {
        console.error(`non-zero exit code returned, code=${result.status}, command=${command} ${arguments.join(" ")}`);
        process.exit(1);
    }
}

function formatSources() {
    console.info(chalk`{white.bold format generated sources}`);
    spawn("prettier", ["--config", "t/prettier.json", "--write", `t/type.ts`]);
}

const basicType = ["number", "string", "boolean", "object"];

function checkType(type) {
    return basicType.includes(type);
}

function translateType(properties) {
    switch (properties.type) {
        case "array":
            if (properties.items && properties.items.$ref) {
                const value = properties.items.$ref.split("/");
                return `${value[value.length - 1]}[]`;
            }
            if (properties.items && properties.items.type) {
                return checkType() ? properties.items.type : translateType(properties.items);
            }
        case "number":
        case "integer":
            return "number";
        case "string":
            return "string";
        default:
            // console.log("properties.type", properties.type);
    }
}

function generateType(definitions) {
    const lines = [];
    const keyarr = Object.keys(definitions)// .slice(0, 10);
    for(let i = 0; i < keyarr.length ; i++) {
        const key = keyarr[i];
        const value = definitions[key];
        if (key.includes("«")) {
            continue;
        }
        lines.push(`export interface ${key} {`);
        lines.push(``);
        if (value.type === "object" && value.properties) {
            for(const [key1, value1] of Object.entries(value.properties)) {
                // console.log([key1, value1]);
                lines.push(`${key1}: ${translateType(value1)};`);
            }
            lines.push(`}`);
            lines.push(`;`);
        } else {
            console.log("key", key, value.type);
        }
    }
    return lines;
}

function generate(type) {
    const { definitions } = doc;
    const lines = generateType(definitions);
    // lines.push(`export `);
    // lines.push(JSON.stringify(s));  
    // types.forEach(type => lines.push(`export ${type.type} ${type.name} ${type.definition}`));
    // fs.writeFileSync(swaggerDoc, doc, "utf8");
    fs.writeFileSync(typeSourcePath, lines.join(""), "utf8");
    formatSources();
}

generate();