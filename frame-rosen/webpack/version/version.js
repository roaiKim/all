const moment = require("dayjs");

const MAJOR = 0; // 主版本号
const MINOR = 0; // 次版本号
const PATCH = 1; // 修订版本
const BUILD_DATE = moment(new Date()).format("YYYYMMDDHHmm"); // 修订版本
const version = `${MAJOR}.${MINOR}.${PATCH}`;

module.exports = {
    MAJOR,
    MINOR,
    PATCH,
    BUILD_DATE,
    version,
};
