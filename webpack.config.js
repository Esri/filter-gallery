const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        "index": "./src/index"
    },

    output: {
        path: __dirname + "/dist",
        filename: "[name].js",
        libraryTarget: "amd"
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
            { from: "src/nls", to: "nls" },
            { from: "src/config", to: "config" },
            { from: "src/index.html", to: "index.html" },
            { from: "src/favicon.png", to: "favicon.png" },
            { from: "src/oauth-callback.html", to: "oauth-callback.html" },
            { from: "src/telemetry", to: "telemetry" }
        ])
    ],

    optimization: {
        concatenateModules: false
    },

    externals: [
        function (context, request, callback) {
            // Externalize dojo/i18n requests
            if (/^dojo\/i18n!/.test(request)) {
                return callback(null, `amd dojo/i18n!./nls/resources`);
            }

            // Externalize requests to dojo or js api
            if (
                /^dojo/.test(request) ||
                /^dojox/.test(request) ||
                /^dijit/.test(request) ||
                /^esri/.test(request)
            ) {
                return callback(null, `amd ${request}`);
            }
            callback();
        }
    ]
}
