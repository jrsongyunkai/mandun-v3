'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const urls = ['https://v3cdn1.snd02.com/', 'https://v3cdn2.snd02.com/', 'https://v3cdn3.snd02.com/', 'https://v3cdn4.snd02.com/', 'https://v3cdn5.snd02.com/']
let _url = urls[Math.floor(Math.random() * urls.length)]
module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/**': {
        // target: 'http://192.168.1.186:8081',
        // target: 'http://192.168.1.160:8081',
        // target: 'http://192.168.1.159:8081',
        // target: 'http://192.168.3.22:8081',
        // target: 'http://192.168.3.34:8081',
        target: 'http://120.76.211.142:8081',
        changeOrigin: true
      }
    },

    // Various Dev Server settings
    // host: 'localhost', // can be overwritten by process.env.HOST
    host: 'localhost',
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: false,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    // devtool: 'cheap-module-eval-source-map',
    devtool: 'eval',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true,
    cdn: {
      js: [
        "/static/js/crypt.min.js",
        "/static/js/vue.min.js",
        "/static/js/vuex.min.js",
        "/static/js/axios.min.js",
        "/static/js/vue-router.min.js",
        "/static/js/config.js"
      ]
    }
  },

  build: {
    prodEnv: require('./prod.env'),
    testEnv: require('./test.env'),
    devEnv: require('./dev.env'),
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: process.env.ENV_CONFIG === 'prod' ? _url : '/',
    // assetsPublicPath: '/',

    /**
     * Source Maps
     */

    // productionSourceMap: true,
    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    cdn: {
      js: process.env.ENV_CONFIG === 'prod' ? [
        "https://v3cdn1.snd02.com/static/js/crypt.min.js",
        "https://v3cdn2.snd02.com/static/js/vue.min.js",
        "https://v3cdn3.snd02.com/static/js/vuex.min.js",
        "https://v3cdn4.snd02.com/static/js/axios.min.js",
        "https://v3cdn5.snd02.com/static/js/vue-router.min.js",
        "https://v3cdn1.snd02.com/static/js/config.js"
      ] : 
      [
        "/static/js/crypt.min.js",
        "/static/js/vue.min.js",
        "/static/js/vuex.min.js",
        "/static/js/axios.min.js",
        "/static/js/vue-router.min.js",
        "/static/js/config.js"
      ]
    }
  }
}
