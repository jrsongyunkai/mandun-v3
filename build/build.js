'use strict'
require('./check-versions')()

// process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const spinner = ora('正在打包中...' + process.env.ENV_CONFIG + '环境')
spinner.start()
console.info(process.env.NODE_ENV + '正在打包中...' + process.env.ENV_CONFIG + '环境')

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }
    function getNowFormatDate() {
      var date = new Date()
      var seperator1 = '-'
      var seperator2 = ':'
      var month = date.getMonth() + 1
      var strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + ' ' + (date.getHours() <= 9 ? '0' + date.getHours() : date.getHours()) + seperator2 + (date.getMinutes() <= 9 ? '0' + date.getMinutes() : date.getMinutes() + seperator2 + (date.getSeconds() <= 9 ? '0' + date.getSeconds() : date.getSeconds()))
      return currentdate
    }
    console.log(chalk.cyan('  打包时间：' + getNowFormatDate() + '.\n'))
    console.log(chalk.yellow(
      '  打包完成了！\n'
    ))
  })
})
