const fs = require('fs').promises;
const path = require('path');

/**
 * 清理 URL：去除查询参数（?及后面内容）和路径参数（${xxx}/:xxx），返回纯静态路径
 * @param {string} rawUrl - 原始 URL（可能含模板字符串/REST参数）
 * @returns {string} 标准化的纯静态路径
 */
function cleanUrl(rawUrl) {
  if (!rawUrl) return '';
  // 1. 去除查询参数（?及后面所有内容）
  const urlWithoutQuery = rawUrl.split('?')[0];
  // 2. 去除路径参数（匹配 ${xxx} 或 :xxx 格式）
  const urlWithoutPathParams = urlWithoutQuery.replace(
    /(\$\{[^}]+\})|(:[a-zA-Z0-9_]+)/g,
    ''
  );
  // 3. 清理连续斜杠（如 /a//b → /a/b）和末尾斜杠（如 /api/ → /api）
  return urlWithoutPathParams.replace(/\/+/g, '/').replace(/\/$/, '');
}

/**
 * 提取 GolbalService 类中所有含 ajax 调用的静态方法，生成映射对象
 * key：类名+静态方法名（如 "GolbalServicegetDictionary"）
 * value：清理后的 ajax 静态路径
 * @param {string} codeText - 包含 GolbalService 类的完整代码文本
 * @returns {Record<string, string>} 完整的方法-URL 映射对象
 */
function extractFullClassMethodUrlMap(codeText) {
  try {
    // 步骤1：先匹配出 GolbalService 类的完整内容（包括类名和类体）
    // 正则说明：匹配 "export class 类名 { ... }"，支持类体跨多行
    const classMatch = codeText.match(/export class (\w+)\s*\{([\s\S]*?)\}\s*$/);
    if (!classMatch) {
      throw new Error('未找到 GolbalService 类定义，请检查代码文本');
    }
    const className = classMatch[1]; // 类名：GolbalService
    const classBody = classMatch[2]; // 类体：所有静态方法的代码

    // 步骤2：匹配类体中所有静态方法（含 ajax 调用）
    // 正则说明：
    // - static\s+(\w+)：匹配静态方法名（如 getDictionary）
    // - \s*\([^)]*\)：匹配方法参数列表（如 (code: string)）
    // - \s*:\s*Promise[^}]*?：匹配方法返回值类型（如 : Promise<Record<string, any>[]>）
    // - ajax\(\s*(?:"[^"]*"|'[^']*'|`[^`]*`)\s*,\s*(["'`])(.*?)\1：匹配 ajax 调用并捕获第二个参数（URL）
    // - [\s\S]*?\}：匹配方法体剩余内容（支持跨多行）
    const methodRegex = /static\s+(\w+)\s*\([^)]*\)\s*:\s*Promise[^}]*?ajax\(\s*(?:"[^"]*"|'[^']*'|`[^`]*`)\s*,\s*(["'`])(.*?)\1[\s\S]*?\}/g;

    const methodUrlMap = {};
    let matchResult;

    // 循环匹配所有符合条件的静态方法
    while ((matchResult = methodRegex.exec(classBody)) !== null) {
      const methodName = matchResult[1]; // 静态方法名（如 getDictionary）
      const rawUrl = matchResult[3];     // ajax 第二个参数（原始 URL，含引号内内容）
      const cleanedUrl = cleanUrl(rawUrl); // 清理后的纯静态路径

      // 生成 key：类名 + 方法名（如 "GolbalServicegetDictionary"）
      const mapKey = `${className}${methodName}`;
      methodUrlMap[mapKey] = cleanedUrl;
    }

    // 步骤3：校验是否匹配到所有方法（避免遗漏）
    const matchedMethodCount = Object.keys(methodUrlMap).length;
    console.log(`成功匹配到 ${matchedMethodCount} 个含 ajax 调用的静态方法`);

    if (matchedMethodCount === 0) {
      console.warn('未匹配到任何含 ajax 调用的静态方法，请检查正则或代码格式');
    }

    return methodUrlMap;
  } catch (error) {
    console.error('提取方法-URL 映射失败：', error.message);
    return {};
  }
}

/**
 * 从文件读取代码并生成映射对象（可选，支持文件场景）
 * @param {string} filePath - GolbalService 代码文件路径（如 ./src/service/GolbalService.ts）
 * @returns {Promise<Record<string, string>>} 方法-URL 映射对象
 */
async function extractFromFile(filePath) {
  try {
    const absolutePath = path.resolve(__dirname, filePath);
    const codeText = await fs.readFile(absolutePath, 'utf8');
    return extractFullClassMethodUrlMap(codeText);
  } catch (error) {
    console.error('读取文件并提取映射失败：', error.message);
    return {};
  }
}

// ------------------------------
// 示例：直接解析用户提供的完整代码文本
// ------------------------------
const userCodeText = `import { ajax } from "@http";
import type { QualityAbnormalItem } from "@src/pages/home/components/AbnormalQuality";
import type { OperateAnalysisItem } from "@src/pages/home/components/Analyze";
import type { OrderNodeResponse } from "@src/pages/home/components/FinancialOrderNode";
import type { DriverData } from "@src/pages/home/components/GoldService";
import type { OftAnalysisResponse } from "@src/pages/home/components/oft";
import type { FinancialData } from "@src/pages/home/components/Settlement";

export class GolbalService {
    static getDictionary(code: string): Promise<Record<string, any>[]> {
        return ajax("GET", \`/api/common/dictionary/getDictionaryByTypeAndStatus/\${code}\`, {});
    }

    static getByUserId(): Promise<Record<string, any>[]> {
        return ajax("GET", "/api/admin/account/dataPermissionTree/getByUserId");
    }

    static getPending(): Promise<Record<string, any>[]> {
        return ajax("GET", "/api/system/index/todo");
    }

    static getOrderTransportCapacityStatistics(params: any): Promise<Record<string, any>[]> {
        return ajax("GET", \`/api/system/index/orderTransportCapacityStatistics?type=\${params.type}\`);
    }

    static getOrderTransportShippingReceiptStatistics(params: any): Promise<Record<string, any>[]> {
        return ajax("GET", \`/api/system/index/orderTransportShippingReceiptStatistics?type=\${params.type}\`);
    }

    static getTodayOperateAnalysis(): Promise<OperateAnalysisItem[]> {
        return ajax("GET", \`/api/system/index/todayOperateAnalysis\`);
    }

    static getSettlementAnalysis(params: any): Promise<FinancialData> {
        return ajax("GET", \`/api/system/index/settlementAnalysis?yearOfMonth=\${params.type}\`);
    }

    static getOrderNodeAnalysis(params: any): Promise<OrderNodeResponse> {
        return ajax("GET", \`/api/system/index/orderNodeAnalysis?yearOfMonth=\${params.type}\`);
    }

    static getTopClientAnalysis(params: any): Promise<Record<string, any>[]> {
        return ajax("GET", \`/api/system/index/topClientAnalysis?yearOfMonth=\${params.yearOfMonth}&type=\${params.type}\`);
    }

    static getTopDriverAnalysis(params: any): Promise<DriverData[]> {
        return ajax("GET", \`/api/system/index/topDriverAnalysis?yearOfMonth=\${params.yearOfMonth}&type=\${params.type}\`);
    }

    static getAbnormalQuality(params: any): Promise<{ data: QualityAbnormalItem[] }> {
        return ajax("POST", \`/api/tms/exceptionTransportOrder/advanced-page\`, params);
    }

    static oftAnalysis(params: any): Promise<OftAnalysisResponse> {
        return ajax("GET", \`/api/system/index/oftAnalysis\`, params);
    }
}`;

// 执行提取并打印完整结果
const fullMethodUrlMap = extractFullClassMethodUrlMap(userCodeText);
console.log('\nGolbalService 类静态方法与 URL 完整映射：');
console.log(JSON.stringify(fullMethodUrlMap, null, 2));