const doc = require("./swagger.json");
const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");
const childProcess = require("child_process");
const axios = require("axios");
const Agent = require("https").Agent;
const yargs = require("yargs");

const swggerUrl = [
    "http://192.168.2.244:4788/order/v2/api-docs"
];

const apiURL = yargs.argv.url || swggerUrl;
const publicDir = path.resolve(__dirname, `autoApi`);

// 执行 命令函数
function spawn(command, arguments) {
    const isWindows = process.platform === "win32";
    const result = childProcess.spawnSync(isWindows ? command + ".cmd" : command, arguments, {stdio: "inherit"});
    if (result.error) {
        console.error(result.error);
        process.exit(1);
    }
    if (result.status !== 0) {
        console.error(`返回非零退出码, code=${result.status}, command=${command} ${arguments.join(" ")}`);
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

// 验证 swagger 文档 是否合法
function validateSwagger(response) {
    const contentType = response.headers["content-type"];
    if (!contentType || !contentType.startsWith("application/json")) {
        return "swagger response contentType 错误"
    }
    const api = response.data;
    if (!api.paths || !api.definitions) {
        // console.info(chalk`{white.red swagger 文档验证失败}, url={green ${apiURL}}, 地址返回值为=${JSON.stringify(api)}}`);
        return "swagger response 验证失败"
    }
    return false
}

// 拉取 swagger 文档
async function fetchSwagger(url) {
    return new Promise((reolve, reject) => {
        axios.get(url, {httpsAgent: new Agent({rejectUnauthorized: false})}).then((response) => {
            console.info(chalk`{white.green swagger 文档拉取成功 }, url={green ${url}}`);
            const errorValue = validateSwagger(response);
            if (!errorValue) {
                reolve({
                    success: true,
                    url: url,
                    data: response.data
                })
            } else {
                reolve({
                    success: false,
                    url: url,
                    data: errorValue
                })
            }
        }).catch((error) => {
            reolve({
                success: false,
                url: url,
                data: error
            })
        })
    });
}

// 格式化函数
function formatSources() {
    console.info(chalk`{white.green 开始格式化...}`);
    spawn("prettier", ["--config", "t/prettier.json", "--write", `${publicDir}/**/**.{ts,json,js}`]);
}

// 基础类型(含object)
const basicType = ["number", "string", "boolean", "object", "void"];

function checkType(type) {
    return basicType.includes(type);
}

// 路径 api 转成对象, 相同路径开头的放入同一个Class中
function transAPiPath(api) {
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
    return map;
}

// 类型转化映射函数
function translateTypes(properties, key, key1, typeMap) { // {"type": "array", "items": {"type": "integer", "format": "int32"}}
    switch (properties.type) {
        case "array":
            if (properties.items && properties.items.$ref) {
                const value = properties.items.$ref.split("/");
                let string = `${value[value.length - 1]}[]`;
                if (typeMap) {
                    // 这里针对泛型处理
                    for(const [a, b] of Object.entries(typeMap)) {
                        string = string.replace(a, b);
                    }
                }
                return string;
            }
            if (properties.items && properties.items.type) {
                // console.error("properties", key, key1, properties.items);
                return checkType(properties.items.type) ? `${properties.items.type}[]` : `${translateTypes(properties.items, key, key1)}[]`;
            }
            console.info(chalk`{red.bold array错误 ${key} ${key1} ${properties.type}}`);
        case "number":
        case "integer":
        case "int32":
        case "int":
            return "number";
        case "string":
            return "string";
        case "boolean":
            return "boolean";
        case "object":
            console.info(chalk`{red 本类型为object类型, 请检查确认 ${key} ${key1} ${properties.type}}`);
            return "object";
        default:
            if (!properties.type && properties.$ref) {
                const value = properties.$ref.split("/");
                let string = `${value[value.length - 1]}`;
                if (typeMap) {
                    // 这里针对泛型处理
                    for(const [a, b] of Object.entries(typeMap)) {
                        string = string.replace(a, b);
                    }
                }
                return string;
            }
            key1 && console.info(chalk`{red.bold 未预设的类型 ${key} ${key1} ${properties.type}}`);
    }
}

const genericityType = ["T", "U", "K", "R", "S"]

// 泛型转化 这里不会有泛型嵌套 如 Response<Page<StowageAbnormal>> 会被转化成 Response<T>, 需要在使用时 自动传入 Response<Page<StowageAbnormal>>
// 因为 Page 本身也是泛型, 
function translateGenericity(type) {
    // "Response<Page<StowageAbnormal>>".match(/(?<=<)\w+/g)
    let genericity = type.match(/«(.*)»/)[1]; // Page<StowageAbnormal> // replace(/«/g, "<").replace(/»/g, ">");
    // const genericity = string;
    const obj = {};
    obj[genericity] = genericityType[0];
    const string = type.replace(genericity, obj[genericity]).replace(/«/g, "<").replace(/»/g, ">");
    return {
        obj,
        string
    };
}

// 生成 typeScript 文件
function generateTypes(definitions, dir) {
    const lines = [];
    lines.push(`// 这个文件是 'yarn api' 自动生成的, 谨慎修改; \n`);
    lines.push(`\n`);
    const keyarr = Object.keys(definitions)// .slice(0, 10);
    const genericityType = {};
    for(let i = 0; i < keyarr.length ; i++) {
        let key = keyarr[i];
        let typeMap = null;
        const value = definitions[key];
        if (key.includes("«")) {
            // console.log("含«的类型 --", key);
            // 类型申明时 不对 Map 和 List 进行转化, 只是使用时转化。List<int> ==> int[]; Map<string, string> ==> {[key: string]: string}
            if (!key.includes("Map") && !key.includes("List")) {
                const { obj, string } = translateGenericity(key)
                key = string;
                typeMap = obj;
                if (genericityType[key]) {
                    continue;
                } else {
                    genericityType[key] = key;
                }
            } else {
                continue;
            }
        }
        if (key === "Response") {
            // 这个单独处理 因为和 Response<T> 冲突
            continue;
        }
        lines.push(`\n export interface ${key} {`);
        lines.push(``);
        if (value.type === "object" && value.properties) {
            for(const [key1, value1] of Object.entries(value.properties)) {
                // console.log([key1, value1]);
                lines.push(`${key1}: ${translateTypes(value1, key, key1, typeMap)};`);
            }
            lines.push(`}`);
            lines.push(`;`);
        } else {
            console.log("key", key, value.type);
        }
    }
    fs.writeFileSync(dir, lines.join(""), "utf8");
}

// 返回值 类型
function generateResponseType(responseSwagger, path) {
    if (!responseSwagger["200"]) {
        console.info(chalk`{red.bold ${path} 未预设200的返回值, 请检查}`);
        return "void";
    }
    const response = responseSwagger["200"];
    if (!response.schema) {
        return "void";
    } else {
        const ref = response.schema.$ref;
        if (!ref) {
            return response.schema.type ? translateTypes({ type: response.schema.type }, path) : "void"
        }
        const arr = ref.split("/");
        const _type = `${arr[arr.length - 1]}`; // Response«List«int»»
        if (_type.match(/«(.*)»/) && _type.match(/«(.*)»/)[1]) {
            const basicType = _type.match(/«(.*)»/)[1].replace(/«/g, "<").replace(/»/g, ">");
            // Response«List«Map«string,string»»»
            if (basicType.includes("Map") && basicType.includes("List")) {
                const mapString = basicType.match(/List<(.*)>/)[1]; // Map<string,string>
                const keyValue = mapString.match(/Map<(.*)>/)[1];
                const keyValueArray = keyValue.split(",");
                const valueType = keyValueArray[1]
                const type = `{[key: string]: ${valueType}}[]`
                return type;
            } else if (basicType.includes("Map")) {
                console.info(chalk`{red.bold 返回值含有 Map 类型 ${basicType} ${ref}}`);
            } else if (basicType.includes("List")) {
                const genericityList = basicType.match(/<(.*)>/);
                if (genericityList && genericityList[1]) {
                    const finallyType = checkType(genericityList[1]) ? genericityList[1] : (translateTypes({ type: genericityList[1] }, path) || genericityList[1]);// genericityList[1];
                    return `${finallyType}[]`;
                }
                return basicType;
            }
            return checkType(basicType) ? basicType : (translateTypes({ type: basicType }, path) || basicType);
        } else {
            return _type === "Response" ? "object" : "void";
        }
    }
}

// 返回值 导入
function requiredTypeTranslate(type) {
    // 如果是基础类型 则不加入导入序列 // import { type } from "./types"
    if (checkType(type)) {
        return null;
    }
    //只有字母 /^[a-zA-Z]+?$/.test("Order")
    if (/^[a-zA-Z]+?$/.test(type)) {
        return type;
    }
    // /^\w+?\[\]$/.test("Order[]")
    if (/^\w+?\[\]$/.test(type) && !/<.*?>$/.test(type)) {
        const _type = type.replace("[]", "");
        return checkType(_type) ? null : _type;
    }
    // /<.*?>$/.test("Order<Customer<UI>>")
    if (/<.*?>$/.test(type)) {
        const _type = type.match(/(?=<|\b)\w+/g);
        if (_type) {
            return _type.filter((item) => !checkType(item));
        }
    }
    return null;
}

function paramTranslate(parameters) {
    if (!parameters) {
        return {};
    }
    const pathRequest = {};
    const bodyRequest = {};
    const queryRequest = {};
    const request = [];
    parameters.forEach((param) => {
        if (param.in === "path") {
            const type = translateTypes({ type: param["type"] });
            pathRequest[param["name"]] = type;
            request.push(`${param["name"]}${param["required"] ? "" : "?"}: ${type}`);
        } else if (param.in === "query") {
            const type = translateTypes({ type: param["type"] });
            queryRequest[param["name"]] = type;
            request.push(`${param["name"]}${param["required"] ? "" : "?"}: ${type}`);
        } else if (param.in === "body") {
            const type = translateTypes(param.schema);
            bodyRequest[param["name"]] = type;
            request.push(`${param["name"]}${param["required"] ? "" : "?"}: ${type}`);
        }
    })
    
    return {
        pathRequest, bodyRequest, queryRequest, request
    }
    // return request;
}

// 生成 AJAXService 对象文件
function generateService(paths, ClassServerDir, typeDir) {
    const api = transAPiPath(paths)
    const keyarr = Object.keys(api) //.slice(0, 2);
    for(let i = 0; i < keyarr.length ; i++) {
        const lines = [];
        lines.push(`import {ajax} from "../../core"; \n \n`);
        lines.push(`// 这个文件是 'yarn api' 自动生成的, 谨慎修改; \n`);
        lines.push(`\n`);

        const key = keyarr[i]; // 获取的是 最外层的 name
        const value = api[key];
        const className = `${replaceFirstUper(toHump(key))}AJAXService`;

        lines.push(`export class ${className} {`);
        lines.push(``);

        let paths = Object.keys(value); // 获取的是 path
        const requiredTypes = []; // 需要导入的类型
        paths.forEach((path) => {
            const pathValue = value[path]; // get: {}
            const methods = Object.keys(pathValue);
            methods.forEach((method) => {
                const pathObject = pathValue[method];
                const staticName = pathObject.operationId;
                const { request, pathRequest, bodyRequest, queryRequest } = paramTranslate(pathObject.parameters);
                const responseType = generateResponseType(pathObject.responses, path);
                if (queryRequest && Object.keys(queryRequest).length) {
                    path = path + "?" + Object.keys(queryRequest).map(item => `${item}=\${${item}}`).join("&")
                }
                const param = [];
                pathRequest && Object.keys(pathRequest).map(item => param.push(`\n* @param in path {${pathRequest[item]}} ${item}`));
                queryRequest && Object.keys(queryRequest).map(item => param.push(`\n* @param in query {${queryRequest[item]}} ${item}`));
                bodyRequest && Object.keys(bodyRequest).map(item => param.push(`\n* @param in body {${bodyRequest[item]}} ${item}`));

                const pathParams = pathRequest ? `{${Object.keys(pathRequest).join(",")}}` : "{}";
                const requestBody = bodyRequest ? `{${Object.keys(bodyRequest).join(",")}}` : "{}";
                
                lines.push(`
                /**
                * @description ${pathObject.summary} ${param.join("")}
                * @returns ${responseType}
                */\n`);
                lines.push(`public static ${staticName}(${request}): Promise<${responseType}>{`);
                lines.push(`return ajax("${method.toUpperCase()}", \`${path}\`, ${pathParams}, ${requestBody});`);
                lines.push("}");
                lines.push("\n");
                lines.push("\n");
                const requiredType = requiredTypeTranslate(responseType);
                if (requiredType) {
                    if (Array.isArray(requiredType)) {
                        requiredType.forEach((item) => !requiredTypes.includes(item) && requiredTypes.push(item))
                    } else {
                        !requiredTypes.includes(requiredType) && requiredTypes.push(requiredType)
                    }
                }
                request && request.forEach(item => {
                    const _item = item.split(/[?:]/);
                    const type = _item[_item.length - 1];
                    const imortType = requiredTypeTranslate(type.trim());
                    if (imortType) {
                        if (Array.isArray(imortType)) {
                            imortType.forEach((item) => !requiredTypes.includes(item) && requiredTypes.push(item))
                        } else {
                            !requiredTypes.includes(imortType) && requiredTypes.push(imortType)
                        }
                    }
                })
            });
        });
        lines.push("}");
        if (requiredTypes.length > 0) lines.unshift(`import {${requiredTypes.join(",")}} from "../${typeDir}";`);
        // 清空文件夹
        const fileName = `${ClassServerDir}/${className}.ts`;
        fs.writeFileSync(fileName, lines.join(""), "utf8");
    }
}

function generateDoc(response) {
    const { url, data } = response;
    // 获取 swagger url 的前缀, 把相同前缀的放入相同文件夹 / 不同的 url 放入不同的文件夹 
    const dirPrefix = url.match(/(?<=:\d+\/)(\w+)/)[1];
    // url dir name
    const urlDirName = replaceFirstUper(toHump(dirPrefix))
    // 获取 当前 url 下的 目录。 如果没有则新建
    const dirName = `${publicDir}/${urlDirName}`;
    if (!fs.pathExistsSync(dirName)) {
        fs.ensureDirSync(dirName)
    }
    // 后台返回类型中有中文, 需要替换掉
    const request = JSON.parse(JSON.stringify(data).replace(/公共分页对象/g, "PublicPagination"));
    // 清空 当前 url 的文件夹
    fs.emptyDirSync(dirName);
    // 生成 url 的返回值 的文档
    fs.writeFileSync(`${publicDir}/${dirPrefix}-swagger.json`, JSON.stringify(request), "utf8");

    const typeDir = `${publicDir}/${dirPrefix}Type.ts`
    // 生成 Type 类型
    generateTypes(request.definitions, typeDir);
    // 生成 API 文档
    generateService(request.paths, dirName, `${dirPrefix}Type`);
}

function generate() {
    // 如果没有根目录 则新建
    if (!fs.pathExistsSync(publicDir)) {
        fs.ensureDirSync(publicDir)
    }
    const urls = Array.isArray(apiURL) ? apiURL : [apiURL];
    const swaggerApis = urls.map(item => fetchSwagger(item));

    Promise.all(swaggerApis).then((responses) => {
        responses.forEach((response) => {
            if (response.success) {
                generateDoc(response)
            } else {
                const { data, url } = response;
                console.info(chalk`{red.bold 文档拉取失败, 错误信息为${data}, url=${url}}`);
            }
        })
        // 格式化
        formatSources();
    });
}

generate();
