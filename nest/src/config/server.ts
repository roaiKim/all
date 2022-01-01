import { join } from "path";

const config = {
    development: {
        host: "localhost",
        picturePath: "/source/p",
        prefix: "p",
    },
    production: {
        host: "http://119.29.53.45",
        picturePath: "/swtg/p",
        prefix: "p",
    },
};

export default config[process.env.NODE_ENV] || config["development"];
