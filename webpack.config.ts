import path from 'path'

import webpack from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const config: webpack.Configuration = {
  mode: 'production',
  entry: path.resolve('src/index.tsx'),
  output: { path: path.resolve('dist') },
  resolve: { extensions: ['.js', '.ts', '.tsx'] },

  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader' },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { modules: true } },
          { loader: 'postcss-loader', options: { plugins: [require('autoprefixer')] } },
          'sass-loader'
        ]
      },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ template: path.resolve('src/index.html') }),
    new MiniCssExtractPlugin()
  ],

  stats: { all: false, assets: true }
}

export default config
