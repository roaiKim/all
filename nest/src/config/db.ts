import { join } from "path";

export default {
    type: "mysql",
    host: "139.224.27.51",
    port: 3306,
    username: "root",
    password: "mogu2018",
    database: "rosen",
    entities: [join(__dirname, "../", "**/**.entity{.ts,.js}")],
    synchronize: true,
};
