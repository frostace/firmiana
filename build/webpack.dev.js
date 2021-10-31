const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base");

module.exports = merge(baseConfig, {
    mode: "development",
    devtool: "eval-cheap-module-source-map", // 开启console的 error traces
    devServer: {
        port: "3001", // 默认是 8080
        hot: true,
        compress: true, // 是否启用 gzip 压缩
        proxy: {
            "/api": {
                target: "http://0.0.0.0:80",
                pathRewrite: {
                    "/api": "",
                },
            },
        },
    },
});
