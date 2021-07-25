import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
  entry: './src/entry.jsx',
  mode: "development",
  output:{
    filename: 'bundle.js',
    path: path.resolve(__dirname,'public')
  },
  module: {
    rules: [
      {
        test: /(.js|.jsx)$/,
        exclude: '/node_modules/',
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env','@babel/preset-react'
            ]
          }
        },
      },
      {
        test: /\.s[ac]ss$/,
        use: ['style-loader','css-loader','sass-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.jsx','.js','.scss']
  }
}
