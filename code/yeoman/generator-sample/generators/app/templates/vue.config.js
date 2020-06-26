const path = require('path')
const poststylus = require('poststylus')
const pxtorem = require('postcss-pxtorem')
const copyWebpackPlugin = require('copy-webpack-plugin')
const vConsolePlugin = require("vconsole-webpack-plugin")
const webpackIconfontPluginNodejs = require('webpack-iconfont-plugin-nodejs')

const resolve = file => path.resolve(__dirname, file)
const isDevelopment = process.env.NODE_ENV === 'development'

const target = 'http://10.10.38.191/'
module.exports = {
  publicPath: '',
  pages: {
    index: {
      entry: 'src/main.js',
      template: isDevelopment ? 'public/index.html' : 'public/index_prod.html',
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('api', resolve('src/api'))
      .set('assets', resolve('src/assets'))
      .set('common', resolve('src/common'))
      .set('components', resolve('src/components'))
      .set('mixins', resolve('src/mixins'))
      .set('router', resolve('src/router'))
      .set('store', resolve('src/store'))
      .set('views', resolve('src/views'))
    config.plugins.delete('prefetch')

    config.module.rules.delete('svg')

    config.module
      .rule("images")
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
      .use("url-loader")
      .loader("url-loader")
      .tap(options =>
        Object.assign(options, {
          limit: 10240,
          fallback: {
            loader: "file-loader",
            options: {
              name: "images/[name].[ext]"
            }
          }
        })
      );

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.transformToRequire = {
          video: ['src', 'poster'],
          source: 'src',
          img: 'src',
          image: 'xlink:href'
        }
      })
  },
  configureWebpack: {
    watchOptions: {
      aggregateTimeout: 500,
      poll: 20000,
      ignored: '/node_modules/'
    },
    performance: {
      hints: 'warning',
      //入口起点的最大体积 整数类型（以字节为单位）
      maxEntrypointSize: 50000000,
      //生成文件的最大体积 整数类型（以字节为单位 300k）
      maxAssetSize: 30000000,
      //只给出 js 文件的性能提示
      assetFilter: function(assetFilename) {
        return assetFilename.endsWith('.js')
      }
    },
    externals: isDevelopment
      ? {}
      : {
          vue: "Vue",
          vuex: "Vuex",
          "vue-router": "VueRouter",
          Axios: "axios"
        }
    ,
    plugins: [
      // 从开发环境的包里摘取静态文件
      new copyWebpackPlugin (
        isDevelopment
          ? []
          : [
            { from: 'node_modules/vue/dist/vue.min.js', to: 'static/js' },
            { from: 'node_modules/vuex/dist/vuex.min.js', to: 'static/js' },
            { from: 'node_modules/vue-router/dist/vue-router.min.js', to: 'static/js' },
            { from: 'node_modules/axios/dist/axios.min.js', to: 'static/js' }
          ]
      ),
      new vConsolePlugin({
        enable: process.env.ENABLE_VCONSOLE === "true"
      }),
      new webpackIconfontPluginNodejs({
        fontName: 'my-icon',
        cssPrefix: 'ico',
        svgs: resolve('src/assets/fonts/svg/*.svg'),
        cssOutput: resolve('src/assets/fonts/font.css'),
        fontsOutput: resolve('src/assets/fonts'),
        htmlOutput: false
      })
    ]
  },
  productionSourceMap: false,
  devServer: {
    host: '0.0.0.0',
    port: '9098', //代理端口
    open: false, //项目启动时是否自动打开浏览器，false为不打开，true表示打开
    proxy: {
      '/advisor': {
        target: target,
        changeOrigin: true,
        pathRewrite: {
          '^/advisor': '/advisor'
        }
      },
      '/hexinifs': {
        target: target,
        changeOrigin: true,
        pathRewrite: {
          '^/hexinifs': '/hexinifs'
        }
      },
      '/group1': {
        target: target,
        changeOrigin: true,
        pathRewrite: {
          '^/group1': '/group1'
        }
      },
      '/cgiws': {
        target: target,
        changeOrigin: true,
        pathRewrite: {
          '^/cgiws': '/cgiws'
        }
      },
      '/product-h5': {
        target: target,
        changeOrigin: true,
        pathRewrite: {
          '^/product-h5': '/product-h5'
        }
      }
    }
  },
  css: {
    sourceMap: isDevelopment,
    loaderOptions: {
      stylus: {
        use: [
          poststylus([
            pxtorem({
              rootValue: 75, //1rem = 75px
              propWhiteList: [],
              minPixelValue: 2
            }),
            'autoprefixer'
          ])
        ],
        import: [resolve('./src/assets/styl/index')]
      },
      postcss: {
        plugins: [
          require('postcss-pxtorem')({
            rootValue: 75,
            propWhiteList: [],
            minPixelValue: 2
          }),
          require('autoprefixer')()
        ]
      }
    }
  },
  // transpileDependencies: ['mand-mobile']
}
