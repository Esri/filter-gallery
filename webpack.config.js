const fs = require('fs');
const path = require('path');
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

    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            { test: /\.js$/, loader: 'source-map-loader', enforce: 'pre' }
        ]
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: "src/nls", to: "nls" },
            { from: "src/config", to: "config" },
            { from: "src/index.html", to: "index.html" }
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
