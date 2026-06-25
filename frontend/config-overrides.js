const { override, addWebpackModuleRule, addWebpackPlugin } = require('customize-cra');
const webpack = require('webpack');

module.exports = override(
  addWebpackModuleRule({
    test: /\.(js|jsx|mjs)$/,
    include: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          ['@babel/preset-env', {
            targets: {
              browsers: ['last 2 versions']
            },
            include: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-optional-chaining',
              '@babel/plugin-proposal-nullish-coalescing-operator'
            ]
          }],
          '@babel/preset-react'
        ],
        plugins: [
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          ['@babel/plugin-proposal-optional-chaining'],
          ['@babel/plugin-proposal-nullish-coalescing-operator']
        ],
        cacheDirectory: true
      }
    }
  }),
  addWebpackPlugin(
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  )
);
