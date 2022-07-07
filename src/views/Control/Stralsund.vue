<template>
  <div id="stralsund">
    <el-col :span="24" class="attention" v-show="alarmName !== ''">{{ $t('home.alarm') + $t('table.status') + '：' }}<span class="c-danger">{{ alarmName }}</span>{{ ' (' + $t('control.attention') + ')' }}</el-col>
    <el-col class="box">
      <el-col class="tc primary-wrap" :class="orderFlag ? 'not-allowed' : ''" @click.native="handleReset">
        <i class="primary-icon iconfont icon-shuaxin"></i>
        <p class="primary-title">{{ $t('control.clearAlarm') }}</p>
      </el-col>
      <el-col :offset="2" class="tc primary-wrap" :class="orderFlag ? 'not-allowed' : ''" @click.native="handleTrip">
        <i class="primary-icon iconfont icon-lianjie-duankai"></i>
        <p class="primary-title">{{ $t('btns.trip') }}</p>
      </el-col>
      <el-col class="tc primary-wrap" :class="orderFlag ? 'not-allowed' : ''" @click.native="handleQuery">
        <i class="primary-icon iconfont icon-chaxun"></i>
        <p class="primary-title">{{ $t('btns.query') }}</p>
      </el-col>
      <el-col :offset="2" class="tc primary-wrap" @click.native="handleConfiguration">
        <i class="primary-icon iconfont icon-shezhi"></i>
        <p class="primary-title">{{ $t('table.configuration') }}</p>
      </el-col>
    </el-col>
    <el-col class="box-wrap">
      <el-row>
        <span v-for="(item, index) in datas" :key="index" class="box-right" @click="handleSwitch(item, index)">
          <el-col @click="handleSwitch(item, index)" class="pointer" :class="item.alarmValue === 0 ? 'grid-content grid-content-open' : 'grid-content grid-content-close'">
            <i v-show="item.loopType === 0" class="iconfont icon-yangan"></i>
            <i v-show="item.loopType === 1" class="iconfont icon-dianya"></i>
            <i v-show="item.loopType === 2" class="iconfont icon-shandian"></i>
            <i v-show="item.loopType === 4" class="iconfont icon-wenduji"></i>
            <i v-show="item.loopType === 8" class="iconfont icon-icon-class-a"></i>
            <i v-show="item.loopType === 17" class="iconfont icon-yangan"></i>
            <i v-show="item.loopType === 18" class="iconfont icon-yangan"></i>
            <i v-show="item.loopType === 40" class="iconfont icon-yangan"></i>
            <i v-show="item.loopType === 41" class="iconfont icon-yangan"></i>
            <span :class="item.loopType === 32 || item.loopType === 33 || item.loopType === 34 || item.loopType === 35 ? 'empty' : ''">
              <p v-if="item.loopType === 0">{{ item.alarmValue === 0 ? $t('control.normal') : $t('control.abnormal') }}</p>
              <p v-else-if="item.loopType === 32 || item.loopType === 33 || item.loopType === 34 || item.loopType === 35">{{ item.detectValue + item.others.unit}}</p>
              <p v-else>{{ item.detectValue + '/' + item.tripUpperLimit + item.others.unit }}</p>
              <p v-show="item.loopType === 0" :title="$t('control.smoke') + $t('control.loop') + item.loopAddr">{{ $t('control.smoke') + $t('control.loop') + item.loopAddr }}</p>
              <p v-show="item.loopType === 1" :title="$t('main.volt') + $t('control.loop') + item.loopAddr">{{ $t('main.volt') + $t('control.loop') + item.loopAddr }}</p>
              <p v-show="item.loopType === 2" :title="$t('control.leakage') + $t('control.loop') + item.loopAddr">{{ $t('control.leakage') + $t('control.loop') + item.loopAddr }}</p>
              <p v-show="item.loopType === 4" :title="$t('menu.temperature') + $t('control.loop') + item.loopAddr">{{ $t('menu.temperature') + $t('control.loop') + item.loopAddr }}</p>
              <p v-show="item.loopType === 8" :title="$t('control.current') + $t('control.loop') + item.loopAddr">{{ $t('control.current') + $t('control.loop') + item.loopAddr }}</p>
              <p v-show="item.loopType === 17" :title="$t('control.pressure') + $t('control.loop') + item.loopAddr">{{ $t('control.pressure') + $t('control.loop') + item.loopAddr }}</p>
              <p v-show="item.loopType === 18" :title="$t('control.level') + $t('control.loop') + item.loopAddr">{{ $t('control.level') + $t('control.loop') + item.loopAddr }}</p>
              <p v-show="item.loopType === 32" :title="$t('control.ratedCurrent')">{{ $t('control.ratedCurrent') }}</p>
              <p v-show="item.loopType === 33" :title="$t('control.electricity')">{{ $t('control.electricity') }}</p>
              <p v-show="item.loopType === 34" :title="$t('control.activePower')">{{ $t('control.activePower') }}</p>
              <p v-show="item.loopType === 35" :title="$t('control.powerFactor')">{{ $t('control.powerFactor') }}</p>
              <p v-show="item.loopType === 40" :title="$t('control.battery') + $t('menu.electricity') + $t('control.loop') + item.loopAddr">{{ $t('control.battery') + $t('menu.electricity') + $t('control.loop') + item.loopAddr }}</p>
              <p v-show="item.loopType === 41" :title="$t('control.signal') + $t('control.loop') + item.loopAddr">{{ $t('control.signal') + $t('control.loop') + item.loopAddr }}</p>
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
        <StralsundConfiguration v-if="equipmentFlag"></StralsundConfiguration>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>
<script>
/* global config */
import store from '@/store'
import StralsundConfiguration from './StralsundConfiguration'
import { queryNorChannelByMac, strlStatusQuery, strlAlarmReset, strlTripOut } from '@/api/api'
export default {
  props: {
    param: {
      type: Object
    }
  },
  data () {
    return {
      datas: [],
      alarmName: '',
      orderFlag: false,
      equipmentFlag: false,
      timer: '',
      timerID: null,
      index: 0
    }
  },
  created () {
    this.init()
  },
  activated () {
    this.setTimer(this.queryNorChannel, config.pollingInterval.queryNorChannelByMac * 1000)
  },
  deactivated () {
    clearTimeout(this.timer)
    clearTimeout(this.timerID)
  },
  methods: {
    init () {
      this.queryNorChannel()
      this.setTimer(this.queryNorChannel, config.pollingInterval.queryNorChannelByMac * 1000)
    },
    queryNorChannel () {
      let params = {
        mac: this.param.mac
      }
      queryNorChannelByMac(params)
        .then(res => {
          if (res.success) {
            if (res.data.length > 0) {
              this.datas = res.data
              if (res.data[this.index].others.alarmName) {
                this.alarmName = res.data[this.index].others.alarmName
              } else {
                this.alarmName = ''
              }
              store.commit('stralsundObj', res.data[this.index])
              store.commit('dateFlag', false)
            } else {
              store.commit('dateFlag', true)
              store.commit('stralsundObj', [])
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
    handleSwitch (item, index) {
      this.index = index
      if (item.others.alarmName) this.alarmName = item.others.alarmName
      store.commit('stralsundObj', item)
    },
    handleReset () {
      if (this.orderFlag) return false
      let params = {
        mac: this.param.mac,
        cmd: 'STRL_ALARM_RESET'
      }
      strlAlarmReset(params)
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
    handleQuery () {
      if (this.orderFlag) return false
      let params = {
        mac: this.param.mac,
        cmd: 'STRL_STATUS_QUERY'
      }
      strlStatusQuery(params)
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
    handleTrip () {
      if (this.orderFlag) return false
      let params = {
        mac: this.param.mac,
        cmd: 'STRL_TRIP_OUT'
      }
      this.$confirm(this.$t('message.tripWarning'), this.$t('message.warning'), {
        confirmButtonText: this.$t('btns.ok'),
        dangerouslyUseHTMLString: true,
        showCancelButton: false,
        customClass: 'trip-warning',
        type: ''
      }).then(() => {
        strlTripOut(params)
          .then(res => {
            if (res.success) {
              if (res.code === '0') {
                this.$message({
                  type: 'success',
                  message: this.$t('message.controlSuccess')
                })
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.cancelled')
        })
      })
      return false
    },
    handleConfiguration () {
      if (this.$store.state.stralsundObj.dataCategory === undefined) {
        this.$message({
          message: this.$t('table.configuration') + this.$t('stralsund.unavailable'),
          type: 'error'
        })
        return false
      }
      store.commit('systemFlag', 'StralsundConfiguration')
      this.equipmentFlag = true
    },
    handleEquipmentClose () {
      this.equipmentFlag = false
    },
    liftRestrictions () {
      this.timer = setTimeout(() => {
        this.orderFlag = false
      }, 3e3)
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
    StralsundConfiguration
  }
}
</script>
<style lang="stylus" scoped>
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
.divider-vertical
  display inline-block
  width 1px
  height 162px
  margin 0 8px
  vertical-align middle
  position relative
  background #fff
.box-wrap
  width 958px
  overflow hidden
.el-row
  .box-right
    &:nth-child(1)
    &:nth-child(2)
    &:nth-child(3)
    &:nth-child(4)
      margin-top 0
.box
  padding-left 17px
  width 292px
  height 282px
  margin-right 20px
  margin-bottom 20px
  border-right 2px solid #fff
.box-right
  display inline-block
  margin 10px 22.5px 0
  .grid-content
    width 194px
    padding 0
    -webkit-border-radius 5px
    -moz-border-radius 5px
    border-radius 5px
    height 60px
    font-size 0
    i
      margin-left 40px
      display inline-block
      line-height 58px
      font-size 30px
      vertical-align middle
    span
      vertical-align middle
      margin-left 16px
      font-size 16px
      display inline-block
      max-width calc(100% - 98px)
      p
        margin 0
        height 18px
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
.grid-content-open
  border 1px solid #fff
.grid-content-close
  border 1px solid #f9482e
  color #f9482e
.attention
  margin-bottom 20px
.empty
  display block !important
  margin 0 !important
  padding-top 12.5px
  max-width 100% !important
  text-align center
.not-allowed
  cursor not-allowed
  color #999
  .iconfont
    cursor not-allowed
@media screen and (max-width: 1366px)
  .grid-content
    padding 0 20px !important
#stralsund >>> .details-dialog
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
