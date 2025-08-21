/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require("axios");
const cheerio = require("cheerio");

async function fetchEChartsNav() {
    try {
        const response = await axios.get("https://echarts.apache.org/zh/option.html#title");
        const $ = cheerio.load(response.data);

        const navItems = $(".doc-nav-item span")
            .map((i, el) => ({
                text: $(el).text().trim(),
            }))
            .get();

        console.log("抓取结果:", navItems);
        console.log("response:", response);
        return navItems;
    } catch (error) {
        console.error("抓取失败:", error);
    }
}

fetchEChartsNav();
