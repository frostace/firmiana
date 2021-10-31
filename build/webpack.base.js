const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const rootDir = process.cwd();

module.exports = {
    entry: path.resolve(rootDir, "src/app.tsx"),
    output: {
        path: path.resolve(rootDir, "dist"),
        filename: "bundle.[contenthash:8].js",
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                use: "babel-loader",
                include: path.resolve(rootDir, "src"),
                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            // 省略...
            {
                test: /\.(le|c)ss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader, // 单独抽离css文件的bundle，和style-loader互斥，不能同时存在，只能将其替换
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                auto: /\.module\.\w+$/i,
                                localIdentName: "[local]__[hash:base64:5]",
                            },
                        },
                    },
                    "less-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [["autoprefixer"]], // auto-prefixer，自动增加-moz-, -ms-, -webkit-等前缀
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                type: "asset",
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(rootDir, "public/index.html"),
            inject: "body",
            scriptLoading: "blocking",
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            // 支持将public/js路径中，维护的静态js资源，打包到dist/js中，被产物直接引用
            patterns: [
                {
                    from: "*.js",
                    context: path.resolve(rootDir, "public/js"),
                    to: path.resolve(rootDir, "dist/js"),
                },
                {
                    from: "*.css",
                    context: path.resolve(rootDir, "public/css"),
                    to: path.resolve(rootDir, "dist/css"),
                },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
        }),
    ],
    optimization: {
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            // `...`,
            new CssMinimizerPlugin(),
        ],
    },
};
