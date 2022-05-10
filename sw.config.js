const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        "sw": "./src/pwa/sw"
    },

    output: {
        path: __dirname + "/dist",
        filename: "[name].js"
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' }
        ]
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: "src/pwa/webapp.manifest", to: "webapp.manifest" },
            { from: "src/pwa/images", to: "images" },
            // { from: "styles", to: "styles" }
            { from: "shared", to: "shared" }
        ])
    ],
}
