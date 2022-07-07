<template>
    <div id="TemperatureHumiditySensor">
      <el-col class="box">
        <el-col class="tc primary-wrap">
          <i class="primary-icon iconfont icon-jiedian"></i>
          <el-select v-model="formInline.line" @change="handleNodeName" class="custom-input" style="margin-bottom: 2px" popper-class="auto-complete" size="mini" :placeholder="$t('placeholder.pleaseChoose')">
            <el-option
              v-for="item in options"
              :key="item.nodeId"
              :label="item.nodeName"
              :value="item.nodeId">
            </el-option>
          </el-select>
        </el-col>
        <el-col :offset="2" class="tc primary-wrap" @click.native="handleParameter">
          <i class="primary-icon iconfont icon-shezhi"></i>
          <p class="primary-title">{{ $t('table.configuration') }}</p>
        </el-col>
      </el-col>
      <el-col class="box-wrap">
        <el-row>
          <span class="box-right">
            <el-col class="pointer grid-content grid-content-open">
              <i class="iconfont icon-wenduji"></i>
              <span class="tc" v-if="list.tem">
                <p>{{ $t('menu.temperature') + '：' + (list.tem[0] ? list.tem[0] + '℃' : '-- ℃') }}</p>
                <p>{{ $t('control.upperLimit') + '：' + (list.tem[1] ? list.tem[1] + '℃' : '-- ℃') }}</p>
                <p>{{ $t('control.lowerLimit') + '：' + (list.tem[2] ? list.tem[2] + '℃' : '-- ℃') }}</p>
              </span>
            </el-col>
          </span>
          <span class="box-right">
            <el-col class="pointer grid-content grid-content-open">
              <i class="iconfont icon-fenzu"></i>
              <span class="tc" v-if="list.hum">
                <p>{{ $t('menu.humidity') + '：' + (list.hum[0] ? list.hum[0] + '%RH' : '-- %RH') }}</p>
                <p>{{ $t('control.upperLimit') + '：' + (list.hum[1] ? list.hum[1] + '%RH' : '-- %RH') }}</p>
                <p>{{ $t('control.lowerLimit') + '：' + (list.hum[2] ? list.hum[2] + '%RH' : '-- %RH') }}</p>
              </span>
            </el-col>
          </span>
        </el-row>
      </el-col>
      <el-dialog
        :title="$t('dialog.equipmentParameterAdjustment')"
        :close-on-click-modal="false"
        custom-class="details-dialog"
        :modal="false"
        width="1323px"
        lock-scroll="false"
        :visible.sync="equipmentFlag"
        :before-close="handleEquipmentClose">
        <el-scrollbar style="height: 100%;">
          <TemperatureHumidityConfiguration v-if="equipmentFlag" :online="online" :equipmentNum="param.equipmentType"></TemperatureHumidityConfiguration>
        </el-scrollbar>
      </el-dialog>
    </div>
</template>

<script>
/* global config */
import store from '@/store'
import TemperatureHumidityConfiguration from './TemperatureHumidityConfiguration'
import { getEffectAddr, findByMacAndNode } from '@/api/api'
export default {
  props: {
    param: {
      type: Object
    },
    online: {
      type: Number
    }
  },
  components: {
    TemperatureHumidityConfiguration
  },
  data () {
    return {
      equipmentFlag: false,
      formInline: {
        line: ''
      },
      options: {},
      list: {}
    }
  },
  created () {},
  mounted () {
    this.init()
    this.$nextTick(function () {
      this.setTimer(this.queryFindByMacAndNode, config.pollingInterval.findByMacAndNode * 1000)
    })
  },
  methods: {
    init () {
      this.getAddr()
    },
    getAddr () {
      let params = {
        mac: this.param.mac
      }
      getEffectAddr(params)
        .then(res => {
          if (res.success) {
            this.formInline.line = res.datas[0].nodeName
            this.options = res.datas
            let val = res.datas[0].nodeId
            store.commit('nodeId', res.datas[0].nodeId)
            this.handleNodeName(val)
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
        .catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    },
    handleNodeName (val) {
      let params = {
        mac: this.param.mac,
        nodeId: val
      }
      findByMacAndNode(params)
        .then(res => {
          if (res.success) {
            this.list = res.data
            store.commit('nodeId', val)
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
        .catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    },
    queryFindByMacAndNode () {
      let params = {
        mac: this.param.mac,
        nodeId: this.$store.state.nodeId
      }
      findByMacAndNode(params)
        .then(res => {
          if (res.success) {
            this.list = res.data
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
        .catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    },
    handleParameter () {
      this.equipmentFlag = true
    },
    handleEquipmentClose () {
      this.equipmentFlag = false
    },
    setTimer (fn, delay) {
      let _this = this
      function timer () {
        _this.timerID = setTimeout(function () {
          timer()
          fn()
        }, delay)
      }
      timer()
    }
  },
  watch: {},
  destroyed () {
    clearTimeout(this.timerID)
  }
}
</script>

<style lang="stylus" scoped>
#TemperatureHumiditySensor
  margin-top 15px
.box
  padding-left 17px
  width 292px
  height 191px
  margin-right 20px
  margin-bottom 20px
  border-right 2px solid #fff
.primary-wrap
  width 95.5px
  margin-bottom 25px
  border 1px solid #fff
  -webkit-border-radius 5px
  -moz-border-radius 5px
  border-radius 5px
.primary-icon
  font-size 42px
  text-align center
.primary-title
  margin 0 0 5px
.attention
  margin-bottom 20px
.box-wrap
  width 958px
  overflow hidden
.box-right
  margin 0 20.5px
  display inline-block
  .grid-content
    width 431px
    height 183.4px
    -webkit-border-radius 5.85px
    -moz-border-radius 5.85px
    border-radius 5.85px
    border 1px solid #fff
  i
    padding-left 50px
    display inline-block
    line-height 183.4px
    font-size 60px
    vertical-align middle
  span
    vertical-align middle
    font-size 22px
    display inline-block
    width calc(100% - 194px)
  .zh-span
    padding-left 59px
  .en-span
    padding-left 30px
  .grid-content-unavailable
    border 1px solid #999
    color #999
  .grid-content-open
    border 1px solid #fff
.custom-input
        >>> .el-input__inner
              margin-top -6px
              background-color #0c1e32
              color #fff
              font-size 14px
              text-align center
              border none
.custom-input
        >>> .el-input--mini .el-input__icon
              line-height 22px
#TemperatureHumiditySensor >>> .details-dialog
    background-color #0c1e32
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
    border 1px solid #fff
    .el-dialog__title, .el-dialog__headerbtn .el-dialog__close
      color #fff
      font-size 18px
    .el-dialog__header
      padding 14px 17px 0
      height 19px
    .el-dialog__body
      color #fff
      padding 0 17px
      overflow auto
      overflow-y hidden
    .el-dialog__headerbtn
      top 10px
      right 5px
</style>
