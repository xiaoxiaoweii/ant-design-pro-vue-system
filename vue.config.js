const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const createThemeColorReplacerPlugin = require('./config/plugin.config')

function resolve (dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
const vueConfig = {
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            // 删除注释
            output:{
              comments:false
            },
            // 删除console debugger 删除警告
            compress: {
              warnings: false,
              drop_console: true,//console
              drop_debugger: false,
              pure_funcs: ['console.log']//移除console
            }
          }
      })
    ]
    }
  },

  chainWebpack: config => {
    config.resolve.alias.set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'business/[name].[hash:8].[ext]'
      })
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme
          // 'primary-color':'#F5222D',
          // 'link-color': '#F5222 D',
          // 'border-radius-base': '4px'
        },
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    port: 7000,
    proxy: {
      '/business': {
        target: 'http://192.168.40.202:33102',
        ws: true,
        changeOrigin: true
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: false,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

// preview.pro.loacg.com only do not use in your production;
if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
  // add `ThemeColorReplacer` plugin to webpack plugins
  vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
}

module.exports = vueConfig
