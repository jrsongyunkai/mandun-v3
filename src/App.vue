<template>
    <div id="apps">
        <div class="scroll-wrap">
            <el-scrollbar class="scroll-wrap">
                <!-- <transition name="el-zoom-in-top"> -->
                    <router-view v-if="isRouter"></router-view>
                <!-- </transition> -->
            </el-scrollbar>
        </div>
    </div>
</template>

<script>
/* global config */
import store from '@/store'
import { checkLogin } from '@/api/api'
export default {
  name: 'App',
  data: function () {
    return {
      isRouter: false
    }
  },
  mounted () {
    checkLogin({})
      .then(res => {
        const theHead = document.getElementsByTagName('head').item(0)
        const myScript = document.createElement('script')
        myScript.type = 'text/javascript'
        myScript.innerHTML = 'var loginchk = function () {};' + res
        myScript.defer = true
        theHead.appendChild(myScript)
        store.commit('realName', config.realName)
        store.commit('pageCustom', config.pageCustom)
        if (config.useMap === 'BAIDU_OFFLINE') {
          let script = document.createElement('script')
          script.type = 'text/javascript'
          script.src = './baiduMap/baidumap_offline_v2_load.js'
          document.head.appendChild(script)
        }
        this.$nextTick(() => {
          this.isRouter = true
        })
      })
  }
}
</script>

<style lang="stylus">
#apps
    font-family: 14px/1.5 "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    height 100%
    color #fff
    background -webkit-linear-gradient(left top, #19254d , #001717)
    background -o-linear-gradient(bottom right, #19254d , #001717)
    background -moz-linear-gradient(bottom right, #19254d , #001717)
    background linear-gradient(to bottom right, #19254d , #001717)
    background-repeat no-repeat
    background-position center
    background-size 100% 100%
    filter unquote('progid:DXImageTransform.Microsoft.Gradient(startcolorstr=#19254d, endcolorstr=#001717, gradientType=1)')
html, body
    width 100%
    height 100%
.scroll-wrap
    height 100%
.el-padding-left-20
    padding-left 20px !important
    text-overflow ellipsis
    white-space nowrap
    overflow hidden
.boundary
    padding 0
    border 1px solid #666
    -webkit-border-radius 10px
    -moz-border-radius 10px
    border-radius 10px
.chart-title,.real-time-alarm-title
    height 40px
    line-height 40px
    border-bottom 1px solid #666
.el-table--enable-row-hover .el-table__body tr
    &:hover>td
        background-color transparent
.el-table--enable-row-hover .el-table__body tr
    &:hover>td.danger-row
        background-color #544558
.el-table--enable-row-hover .el-table__body tr
    &:hover>td.warning-row
        background-color #5A5B5C
.el-table::before
    height 0
.fade-enter-active
    transition opacity .2s
.fade-enter,.fade-leave-to
    opacity 0
.el-table, .el-table__expanded-cell, .el-table th, .el-table tr
    background-color transparent
    color #fff
.el-table td, .el-table th.is-leaf
    border-bottom 1px solid #303a5e
.el-table--border::after,.el-table--group::after,.el-table::before
    background-color transparent
.el-pagination
    margin-top 5px
.el-col .el-pagination__total,.el-col .el-pagination__jump
    color #fff
.el-table .el-button--text
    color #fff
.pickDate
    padding 10px 10px 0 10px
.pickDate .block
    float right
    margin-left 10px
.padding-10-lr
  padding 0 10px
.el-scrollbar__wrap
    overflow-x hidden
.el-scrollbar__wrap .el-autocomplete-suggestion__list, .el-scrollbar__wrap .el-select-dropdown__list
    padding-bottom 24px
.fades-enter-active, .fades-leave-active
    transition opacity  .3s
.fades-enter, .fades-leave-to
    opacity 0
.fade-enter-active, .fade-leave-active
    transition all .2s
    transform translate3d(0, 0px, 0)
.fade-enter, .fade-leave-to
    transition all .2s
    opacity 0
    transform translate3d(0, 20px, 0)
    min-height 500px
.el-message
    top 60px
#warn, #leakage, #temperature, #leakageA, #load, #power, #control, #BuiltInTiming, #LatitudeLongitudeTiming, #list, #tabsOverView, #AnalysisReport, #EnergyOverview, #RegionalRelations, #SavingScheme, #EnergyReport, #EnergyManagement, #EnergyFormula, #EnergyTrend, #EnergyComparison, #EnergyConsumption, #EnergyStatistics, #EnergyAnalysis, #EnergyTrend, #openingClosingWarning
    position absolute
    left 200px
    width calc(100% - 200px)
.el-autocomplete-suggestion
    // width 250px !important
.export-popper
    .popper__arrow
        left 510.531px !important
.period-time-picker
    .el-time-panel__footer
        display none
.iconfont, .jump, .pointer
    cursor pointer
.fw
    font-weight 600
.mt-5
    margin-top 5px
.mt-10
    margin-top 10px
.mt-15
    margin-top 15px
.mt-20
    margin-top 20px
.mt-30
    margin-top 30px
.ml-5
    margin-left 5px
.ml-10
    margin-left 10px
.ml-15
    margin-left 15px
.ml-20
    margin-left 20px
.ml-30
    margin-left 30px
.mr-5
    margin-right 5px
.mr-10
    margin-right 10px
.mr-15
    margin-right 15px
.mr-20
    margin-right 20px
.mr-30
    margin-right 30px
.mb-0
    margin-bottom 0
.mb-5
    margin-bottom 5px
.mb-10
    margin-bottom 10px
.mb-20
    margin-bottom 20px
.c-success
    color #67C23A
.c-danger
    color #F56C6C
.c-warning
    color #E6A23C
.c-primary
    color #409EFF
.c-info
    color #909399
.c-default
  color #fff !important
  &:hover
    color #409EFF !important
.tc
    text-align center
.tr
    text-align right
.tl
    text-align left
.fl
    float left
.fr
    float right
[v-cloak]
  display none
.clearfix:after
    content "."
    clear both
    display block
    height 0
    overflow hidden
    visibility hidden
.block .el-date-editor.el-input, .el-date-editor.el-input__inner, .short-input
    width 140px
.left-padding-right
    padding-left 0 !important
    padding-right 0 !important
.pr-10
  padding-right 10px !important
.top-padding-bottom
    padding-top 0 !important
    padding-bottom 0 !important
.el-table--border
    border 1px solid #303a5e
.el-table--border td, .el-table--border th
    border-right 1px solid #303a5e
.el-table--border th.gutter:last-of-type
    border-bottom 1px solid #303a5e
.el-table--scrollable-y .el-table__body-wrapper
  overflow hidden
.trip-warning
  width 480px
  text-align center
  .el-message-box__btns
    text-align center
.el-dialog__body
  padding 10px
.el-form-item__label, .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover, .el-breadcrumb__inner a, .el-breadcrumb__inner.is-link, .el-breadcrumb__separator, .el-breadcrumb__inner.is-link:hover
  color #fff
.add-btn
  margin-right 10px
  color #fff
.el-input--mini .el-input__inner
  height 22px
  line-height 22px
.fs-12
  font-size 12px
.fs-14
  font-size 14px
.fs-16
  font-size 16px
.fs-18
  font-size 18px
.fs-20
  font-size 20px
.custom-device-dialog
  .el-dialog__body
    height 70vh
.custom-select-dialog
  position: absolute
  top 96px
  left 50%
  margin-left -661.5px
  bottom 0
  margin-top 0 !important
  max-height calc(100% - 116px)
  max-width calc(100% - 20px)
  min-width 1323px
  display flex
  flex-direction column
.auto-complete
  width auto !important
.popper-time .el-time-panel__footer .cancel
  display none
.popper-hour .el-time-spinner__wrapper
                &:nth-last-of-type(2)
                  display none
.el-notification
  background-color #041a20
.el-notification .el-notification__closeBtn
  color #fff
.el-notification .el-notification__group .el-notification__title
  color #fff
.disInline
  display inline
</style>
