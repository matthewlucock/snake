import path from 'path'

import webpack from 'webpack'
import autoprefixer from 'autoprefixer'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const SRC = path.resolve(__dirname, 'src')
const ASSETS = path.resolve(__dirname, 'assets')
const DIST = path.resolve(__dirname, 'dist')

const config: webpack.Configuration = {
  mode: 'production',
  entry: path.resolve(SRC, 'index.tsx'),
  output: { path: DIST },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: { snake: SRC, assets: ASSETS }
  },

  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader' },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                exportLocalsConvention: 'camelCaseOnly',
                localIdentName: '[hash:base64:5]'
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: { plugins: [autoprefixer] }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: { includePaths: [SRC] }
            }
          }
        ]
      },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
      { test: /\.svg$/, use: 'preact-svg-loader' }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(SRC, 'index.html'),
      inject: 'head',
      scriptLoading: 'defer'
    })
  ]
}

export default config
