<template>
  <div id="smoke">
    <el-col :span="24" class="attention" v-show="alarmName !== ''">{{ $t('home.alarm') + $t('table.status') + '：' }}<span class="c-danger">{{ alarmName }}</span>{{ ' (' + $t('control.attention') + ')' }}</el-col>
    <el-col class="box">
      <el-col class="tc primary-wrap" :class="orderFlag ? 'not-allowed' : ''" @click.native="handleReset">
        <i class="primary-icon iconfont icon-shuaxin"></i>
        <p class="primary-title">{{ $t('control.clearAlarm') }}</p>
      </el-col>
      <el-col :offset="2" class="tc primary-wrap" :class="datas.length > 0 ? '' : 'not-allowed'" @click.native="handleConfiguration">
        <i class="primary-icon iconfont icon-shezhi"></i>
        <p class="primary-title">{{ $t('table.configuration') }}</p>
      </el-col>
    </el-col>
    <el-col class="box-wrap">
      <el-row>
        <span class="box-right" v-if="datas.length > 0">
          <el-col class="pointer grid-content grid-content-unavailable">
            <i class="iconfont icon-yangan1"></i>
            <span :class="$i18n.locale === 'zh' ? 'zh-span' : 'en-span'">
              <p>{{ $t('stralsund.concentration') + '：' + '-- %' }}</p>
            </span>
          </el-col>
        </span>
        <span v-for="(item, index) in datas" :key="index" class="box-right">
          <el-col @click="handleSwitch(item)" class="pointer grid-content" :class="item.others.alarmFlag ? 'grid-content-close' : 'grid-content-open'">
            <i @click="handleSwitch(item)" class="iconfont icon-dianchi"></i>
            <span :class="$i18n.locale === 'zh' ? 'zh-span' : 'en-span'" @click="handleSwitch(item)">
              <p>{{ $t('menu.electricity') + '：' + item.others.Level + (item.others.unit ? ' ' + item.others.unit : ' %') }}</p>
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
        <SmokeConfiguration v-if="equipmentFlag"></SmokeConfiguration>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>
<script>
/* global config */
import store from '@/store'
import SmokeConfiguration from './SmokeConfiguration'
import { queryForsafeChannelByMac, forsafeDeviceCommand } from '@/api/api'
export default {
  props: {
    mac: {
      type: String
    }
  },
  data () {
    return {
      alarmName: '',
      datas: [],
      equipmentFlag: false,
      orderFlag: false,
      timer: null,
      timerID: null
    }
  },
  created () {
    this.init()
  },
  activated () {
    this.setTimer(this.queryNorChannel, config.pollingInterval.queryForsafeChannelByMac * 1000)
  },
  deactivated () {
    clearTimeout(this.timer)
    clearTimeout(this.timerID)
  },
  methods: {
    init () {
      this.queryNorChannel()
      this.setTimer(this.queryNorChannel, config.pollingInterval.queryForsafeChannelByMac * 1000)
    },
    queryNorChannel () {
      let params = {
        mac: this.mac
      }
      queryForsafeChannelByMac(params)
        .then(res => {
          if (res.success) {
            this.datas = res.data
            if (res.data.length > 0) {
              if (res.data[0].others.alarmName) this.alarmName = res.data[0].others.alarmName
              store.commit('smokeObj', res.data[0])
              store.commit('dateFlag', false)
            } else {
              store.commit('dateFlag', true)
              store.commit('smokeObj', [])
            }
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
        .finally(() => {})
    },
    handleSwitch (item) {
      if (item.others.alarmName) this.alarmName = item.others.alarmName
      store.commit('smokeObj', item)
    },
    handleReset () {
      if (this.orderFlag) return false
      let params = {
        mac: this.mac,
        cmd: 'FORSAFE_FIRERST',
        equipmentType: 6,
        data: 1
      }
      forsafeDeviceCommand(params)
        .then(res => {
          if (res.success) {
            if (res.code === '0') {
              this.$message({
                type: 'success',
                message: this.$t('message.controlSuccess')
              })
              this.queryNorChannel()
            }
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
        .finally(() => {
          this.orderFlag = true
          this.liftRestrictions()
        })
    },
    liftRestrictions () {
      this.timer = setTimeout(() => {
        this.orderFlag = false
      }, 3e3)
    },
    handleConfiguration () {
      if (this.datas.length > 0) {
        this.equipmentFlag = true
      }
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
  destroyed () {
    clearTimeout(this.timer)
    clearTimeout(this.timerID)
  },
  components: {
    SmokeConfiguration
  }
}
</script>
<style lang="stylus" scoped>
#smoke
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
    font-size 80px
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
  .grid-content-close
    border 1px solid #f9482e
    color #f9482e
.not-allowed
  cursor not-allowed
  color #999
  .iconfont
    cursor not-allowed
.icon-yangan1
  font-size 64px !important
#smoke >>> .details-dialog
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
