/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require("axios");
const cheerio = require("cheerio");

async function fetchEChartsNav() {
    try {
        const response = await axios.get("https://echarts.apache.org/zh/option.html#yAxis");
        const $ = cheerio.load(response.data);

        const navItems = $(".el-tree-node .doc-nav-item.inner")
            .map((i, el) => ({
                text: $(el).text().trim(),
                html: $(el).html().trim(),
                href: $(el).find("a").attr("href") || "",
            }))
            .get();

        console.log("抓取结果:", navItems);
        return navItems;
    } catch (error) {
        console.error("抓取失败:", error);
    }
}

fetchEChartsNav();
