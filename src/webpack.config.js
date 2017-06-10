const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.rules = [
    {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['node6'],
                plugins: ["transform-inline-environment-variables"]
            }
        }
    }
];

module.exports = {
    entry: './alexa/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    externals: [nodeExternals()], // Ignore node modules
    node: {
        process: false
    }
};