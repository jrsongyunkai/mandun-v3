<template>
   <div id="smokeAlarm">
    <el-col :span="24" class="attention" v-show="alarmName !== ''">{{ $t('home.alarm') + $t('table.status') + '：' }}<span class="c-danger">{{ alarmName }}</span>{{ ' (' + $t('control.smokeAttention') + alarmName + ',' + $t('control.smokeSecondAttention') +')' }}</el-col>
    <el-col class="box">
      <el-col class="tc primary-wrap">
        <i class="primary-icon iconfont icon-shezhi c-info"></i>
        <p class="primary-title c-info">{{ $t('table.configuration') }}</p>
      </el-col>
    </el-col>
    <el-col class="box-wrap">
      <el-row>
        <span class="box-right">
          <el-col  class="pointer grid-content grid-content-open">
            <img src="../../assets/image/signal.png" alt="Mantunsci">
            <span>
              <p>{{ $t('stralsund.signalIntensity') + '：' + (signal ? signal + '%' : '-- %') }}</p>
            </span>
          </el-col>
        </span>
        <span class="box-right" v-if="typeof voltage !== 'undefined'">
          <el-col class="pointer grid-content grid-content-open">
            <img src="../../assets/image/voltage.png" alt="Mantunsci">
            <span>
              <p>{{ $t('main.volt') + '：' + (typeof voltage !== 'undefined' ? voltage + 'V' : '-- V') }}</p>
            </span>
          </el-col>
        </span>
        <span class="box-right" v-if="typeof concentration !== 'undefined'">
          <el-col class="pointer grid-content grid-content-open">
            <i class="iconfont icon-keranqiti"></i>
            <span>
              <p>{{ $t('stralsund.concentration') + '：' + (typeof concentration !== 'undefined' ? concentration > 0 ? concentration + '%' : 0 + '%' : '-- %') }}</p>
            </span>
          </el-col>
        </span>
      </el-row>
    </el-col>
  </div>
</template>

<script>
/* global config */
import store from '@/store'
import { queryZacChannelMac } from '@/api/api'
export default {
  props: {
    mac: {
      type: String
    }
  },
  data () {
    return {
      alarmName: '',
      datas: {},
      signal: '',
      voltage: '',
      concentration: ''
    }
  },
  created () {
    this.init()
  },
  activated () {
    this.setTimer(this.queryChannelByMac, config.pollingInterval.queryZacChnlHistory * 1000)
  },
  deactivated () {
    clearTimeout(this.timerID)
  },
  methods: {
    init () {
      this.queryChannelByMac()
      this.setTimer(this.queryChannelByMac, config.pollingInterval.queryZacChnlHistory * 1000)
    },
    queryChannelByMac () {
      let params = {
        mac: this.mac
      }
      queryZacChannelMac(params)
        .then(res => {
          if (res.success) {
            if (res.data) {
              this.datas = res.data
              this.alarmName = this.datas.others.alarmName
              this.signal = this.datas.others.signal
              this.voltage = this.datas.others.voltage
              this.concentration = this.datas.others.concentration
              store.commit('smokeAlarmObj', this.datas)
            } else {
              store.commit('smokeAlarmObj', [])
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
    clearTimeout(this.timerID)
  }
}
</script>

<style lang="stylus" scoped>
#smokeAlarm
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
  border 1px solid #909399
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
  img
    padding-left 60px
    padding-top 45px
    float left
    width 20%
    vertical-align middle
  i
    padding-left 60px
    padding-top 45px
    float left
    font-size 80px
    vertical-align middle
  span
    vertical-align middle
    font-size 22px
    float left
    line-height 140px
    margin-left 40px
    width calc(100% - 194px)
  .grid-content-open
    border 1px solid #fff
  .grid-content-unavailable
    border 1px solid #999
    color #999
</style>
