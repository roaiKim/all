import path from "node:path";
import { context } from "esbuild";

const watch = process.argv.includes("--watch");

const options = {
    entryPoints: ["electron/main.ts", "electron/preload.ts"],
    bundle: true,
    platform: "node",
    format: "cjs",
    outdir: "dist-electron",
    outExtension: { ".js": ".cjs" },
    external: ["electron"],
    alias: {
        "utils/framework/uid": path.resolve("src/utils/framework/uid"),
    },
    logLevel: "info",
};

const ctx = await context(options);

if (watch) {
    await ctx.watch();
    console.log("[electron] watching main process sources...");
} else {
    await ctx.rebuild();
    await ctx.dispose();
}
