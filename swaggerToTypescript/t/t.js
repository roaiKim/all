const doc = require("./swagger.json");
const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");
const childProcess = require("child_process");

const publicDir = path.resolve(__dirname, `autoApi`);
const typePath = path.resolve(__dirname, `${publicDir}/type.ts`);
const swaggerPath = path.resolve(__dirname, `${publicDir}/swagger-doc.ts`);

// 执行 命令函数
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

// 首字母大写
function replaceFirstUper(str)  {     
    const name = str//.toLowerCase();     
    return name.replace(/\b(\w)|\s(\w)/g, function(m){  
        return m.toUpperCase();  
    });    
}

// 转驼峰命名
function toHump(name) {
    return name.replace(/[_-](\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}

// 格式化函数
function formatSources() {
    console.info(chalk`{white.bold format generated sources}`);
    spawn("prettier", ["--config", "t/prettier.json", "--write", `${publicDir}/*.{ts,json}`]);
}

// 基础类型(含object)
const basicType = ["number", "string", "boolean", "object"];

function checkType(type) {
    return basicType.includes(type);
}

// 类型转化映射函数
function translateType(properties, key, key1) {
    switch (properties.type) {
        case "array":
            if (properties.items && properties.items.$ref) {
                const value = properties.items.$ref.split("/");
                return `${value[value.length - 1]}[]`;
            }
            if (properties.items && properties.items.type) {
                return checkType(properties.items.type) ? properties.items.type : translateType(properties.items, key, key1);
            }
            console.info(chalk`{red.bold array错误 ${key} ${key1} ${properties.type}}`);
        case "number":
        case "integer":
        case "int32":
            return "number";
        case "string":
            return "string";
        case "boolean":
            return "boolean";
        case "object":
            console.info(chalk`{red.bold 本类型为object类型, 请检查确认 ${key} ${key1} ${properties.type}}`);
            return "object";
        default:
            if (!properties.type && properties.$ref) {
                const value = properties.$ref.split("/");
                return `${value[value.length - 1]}`;
            }
            console.info(chalk`{red.bold 未预设的类型 ${key} ${key1} ${properties.type}}`);
    }
}

// 生成 typeScript 文件
function generateType(definitions) {
    const lines = [];
    lines.push(`// 这个文件是 'yarn api' 自动生成的, 谨慎修改; \n`);
    lines.push(`\n`);
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
                lines.push(`${key1}: ${translateType(value1, key, key1)};`);
            }
            lines.push(`}`);
            lines.push(`;`);
        } else {
            console.log("key", key, value.type);
        }
    }
    fs.writeFileSync(typePath, lines.join(""), "utf8");
}

// 路径 api 转成对象, 相同路径开头的放入同一个Class中
function transPath(api) {
    const map = {};
    const keyarr = Object.keys(api)//.slice(0, 10);
    for(let i = 0; i < keyarr.length ; i++) {
        const key = keyarr[i];
        const value = api[key];
        const pathArray = key.split("/").filter(_ => !!_);
        const serverName = pathArray[0];
        if (map[serverName]) {
            map[serverName] = {
                ...map[serverName],
                [key]: value
            }
        } else {
            map[serverName] = {
                [key]: value
            }
        }
    }
    generateApi(map)
}

// 生成 AJAXService 对象文件
function generateApi(api) {
    // 
    const keyarr = Object.keys(api)//.slice(0, 2);
    for(let i = 0; i < keyarr.length ; i++) {
        const lines = [];
        lines.push(`import {ajax} from "../core"; \n`);
        lines.push(`// 这个文件是 'yarn api' 自动生成的, 谨慎修改; \n`);
        lines.push(`\n`);
        const key = keyarr[i]; // 获取的是 最外层的 name
        const value = api[key];
        const className = `${replaceFirstUper(toHump(key))}AJAXService`;
        lines.push(`export class ${className} {`);
        lines.push(``);
        const paths = Object.keys(value); // 获取的是 path
        paths.forEach((path) => {
            const pathValue = value[path]; // get: {}
            const methods = Object.keys(pathValue);
            methods.forEach((method) => {
                const pathObject = pathValue[method];
                const staticName = pathObject.operationId;
                const parameterSignature = "";
                const pathParams = "{}";
                const requestBody = "{}";
                const responseType = "any";
                lines.push(`// ${pathObject.summary}; \n`);
                lines.push(`public static ${staticName}(${parameterSignature}): Promise<${responseType}>{`);
                lines.push(`return ajax("${method.toUpperCase()}", "${path}", ${pathParams}, ${requestBody});`);
                lines.push("}");
                lines.push("\n");
                lines.push("\n");
            });
        });
        lines.push("}");
        const fileName = `${publicDir}/${className}.ts`;
        fs.writeFileSync(fileName, lines.join(""), "utf8");
    }
}

function generate() {
    const { definitions, paths } = doc;
    // 清空文件夹
    fs.emptyDirSync(publicDir);
    // 生成 Type 类型
    generateType(definitions);
    // 生成 API 文档
    transPath(paths);
    // 格式化
    formatSources();
}

generate();