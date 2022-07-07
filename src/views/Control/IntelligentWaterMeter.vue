<template>
    <div id="IntelligentWaterMeter" v-loading.lock="fullscreenLoading">
        <el-col :span="24" class="attention" v-show="alarmName">{{ $t('home.alarm') + $t('table.status') + '：' }}<span class="c-danger">{{ alarmName }}</span>{{ ' (' + $t('control.smokeAttention') + alarmName + ',' + $t('control.smokeSecondAttention') +')' }}</el-col>
        <el-col :span="24" class="box-wrap">
          <el-row>
            <div :class="state === '1' ? 'primary-wrap pointer' : 'box-grey primary-wrap pointer'" @click="handelMeterReading('1')">
              <el-col :class="state === '2' ? 'disable tc' : 'tc'">
                <i class="primary-icon iconfont icon-kaifa"></i>
                <p class="primary-title" >{{ $t('table.openValve') }}</p>
              </el-col>
            </div>
            <div :class="state === '0' ? 'primary-wrap pointer' : 'box-grey primary-wrap pointer'" @click="handelMeterReading('0')">
              <el-col :class="state === '2' ? 'disable tc' : 'tc'">
                <i class="primary-icon iconfont icon-bifa"></i>
                <p class="primary-title" >{{ $t('table.closeValve') }}</p>
              </el-col>
            </div>
            <div class="primary-wrap pointer" @click="handleRefresh">
              <el-col class="tc">
                <i class="primary-icon iconfont icon-shuaxin"></i>
                <p class="primary-title" >{{ $t('btns.refresh') }}</p>
              </el-col>
            </div>
            <div class="box-border"></div>
            <div class="box fr">
              <el-col class="tc" style="line-height: 70px">
                  <span class="block">{{ $t('statistics.cumulative') + $t('table.waterConsumption') }}：</span>
                  <span class="block">{{ (water ? water : '--') + $t('table.ton') }}</span>
              </el-col>
            </div>
            <div :class="state === '2' ? 'mt-5 c-danger' : 'mt-5'" style="margin-left: 50px">{{ $t('message.currentIs') + (state === '0' ? $t('table.openValve') : state === '1' ? $t('table.closeValve') : state === '2' ? $t('control.malfunction') : '') }}</div>
          </el-row>
        </el-col>
    </div>
</template>

<script>
/* global config */
import { findHuaxuChannelByMac, valveControl } from '@/api/api'
export default {
  components: {},
  props: {
    param: {
      type: Object
    }
  },
  data () {
    return {
      alarmName: '',
      water: '',
      state: '',
      fullscreenLoading: false,
      timer: null,
      timerID: null
    }
  },
  created () {
    this.init()
  },
  activated () {
    this.setTimer(this.queryFindHuaxuChannelByMac, config.pollingInterval.findHuaxuChannelByMac * 1000)
  },
  deactivated () {
    clearTimeout(this.timer)
    clearTimeout(this.timerID)
  },
  methods: {
    init () {
      this.queryFindHuaxuChannelByMac()
      this.setTimer(this.queryFindHuaxuChannelByMac, config.pollingInterval.findHuaxuChannelByMac * 1000)
    },
    queryFindHuaxuChannelByMac () {
      findHuaxuChannelByMac({mac: this.param.mac})
        .then(res => {
          if (res.success) {
            this.alarmName = res.data.alarmName
            this.water = res.data.currentQuantity
            this.state = res.data.valveState
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
    handleRefresh () {
      this.fullscreenLoading = true
      findHuaxuChannelByMac({mac: this.param.mac})
        .then(res => {
          if (res.success) {
            this.alarmName = res.data.alarmName
            this.water = res.data.currentQuantity
            this.state = res.data.valveState
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
          setTimeout(() => {
            this.fullscreenLoading = false
          }, 200)
        })
    },
    handelMeterReading (val) {
      if (this.state === '2') return false
      this.$confirm(val === '0' ? this.$t('message.confirmYouWant') + this.$t('table.closeValve') + '?' : this.$t('message.confirmYouWant') + this.$t('table.openValve') + '?', this.$t('dialog.prompt'), {
        confirmButtonText: this.$t('btns.ok'),
        cancelButtonText: this.$t('btns.cancel'),
        type: 'warning'
      }).then(() => {
        let params = {
          mac: this.param.mac,
          command: val
        }
        valveControl(params)
          .then(res => {
            if (res.success) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.queryFindHuaxuChannelByMac()
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.cancelled')
        })
      })
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
  watch: {}
}
</script>

<style lang="stylus" scoped>
#IntelligentWaterMeter
  margin-top 15px
  height 191px
.box
  margin-top 18px
  width 685px
  height 70px
  -webkit-border-radius 5px
  -moz-border-radius 5px
  border-radius 5px
  border 1px solid #fff
  display inline-block
  margin-right 35px
  i
    float left
    margin 0 10px
    font-size 40px
    line-height 70px
.primary-wrap
  width 95.5px
  height 70px
  border 1px solid #fff
  -webkit-border-radius 5px
  -moz-border-radius 5px
  border-radius 5px
  display inline-block
  .primary-icon
    font-size 42px
    text-align center
  .primary-title
    margin 0 0 5px
.box-border
  height 90px
  margin 0 20px
  border-right 1px solid #fff
  display inline-block
.block
  display inline-block
  font-size 28px
.disable
  &:hover
    cursor not-allowed
.box-grey
  border 1px solid #999
  color #999
.attention
  margin-bottom 20px
</style>
