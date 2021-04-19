const path = require("path")


module.exports = {
    mode: "development",
    module: {
        rules: [{
            test: /\.js$/,
            // loader: "loader1"
            use: [
                "loader1",
                "loader2"
            ]
        }]
    },
    recordsPath: path.resolve(__dirname, "record.json"),
    resolveLoader: {
        modules: [
            "node_modules", path.resolve(__dirname, "loaders")
        ]
    }
}
