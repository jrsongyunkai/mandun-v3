<template>
  <div>
    <el-col :md="24">
      <el-col :md="24" class="boundary left-padding-right">
        <el-row class="chart-title">
          <el-col :md="23" :xs="23" :sm="23" class="el-padding-left-20">{{$t('home.theLast2DaysOfAlarmSituation')}}</el-col>
          <el-col :md="1" :xs="1" :sm="1"><i class="el-icon-refresh refresh" @click="initClassifiedAlarm"></i></el-col>
        </el-row>
        <el-col :md="8" class="el-margin">
          <div class="loading" :style="baseStyle" v-if="!gaugeChartFlag"><i class="el-icon-loading"></i></div>
          <gauge-chart  :options="todayAlarmOptions" v-if="classifiedAlarm && gaugeChartFlag" :axisColor="alarmColor"></gauge-chart>
        </el-col>
        <el-col :md="8" class="el-margin">
          <div class="loading" :style="baseStyle" v-if="!gaugeChartFlag"><i class="el-icon-loading"></i></div>
          <gauge-chart :options="yesterdayAlarmOptions" v-if="classifiedAlarm && gaugeChartFlag" :axisColor="alarmColor"></gauge-chart>
        </el-col>
        <el-col :md="8" class="compare el-margin" :style="compareStyle">
          <el-col :span="18" class="compare-percent" :class="$store.state.toPath !=='' ? 'compare-percent-other' : ''" :style="compareStyle">{{ alarmProportion }}</el-col>
          <el-col :span="6" class="compare-icon" :class="$store.state.toPath !=='' ? 'compare-icon-other' : ''" :style="compareStyle">
            <i class="iconfont icon-web-icon-1" alt="increase" v-if="alarmUp" :key="key"></i>
            <i class="iconfont icon-web-icon-" alt="reduce" v-if="alarmDown" :key="key"></i>
            <span v-if="!alarmUp && !alarmDown" :key="key">-</span>
          </el-col>
          <div class="compare-msg">{{ $t('home.YearOnYear') }}</div>
        </el-col>
        <el-col :md="8" class="el-margin">
          <div class="loading" :style="baseStyle" v-if="!gaugeChartFlag"><i class="el-icon-loading"></i></div>
          <gauge-chart :options="todayWarnOptions" v-if="classifiedAlarm && gaugeChartFlag" :axisColor="earlyWarnColor"></gauge-chart>
        </el-col>
        <el-col :md="8" class="el-margin">
          <div class="loading" :style="baseStyle" v-if="!gaugeChartFlag"><i class="el-icon-loading"></i></div>
          <gauge-chart :options="yesterdayWarnOptions" v-if="classifiedAlarm && gaugeChartFlag" :axisColor="earlyWarnColor"></gauge-chart>
        </el-col>
        <el-col :md="8" class="compare el-margin" :style="compareStyle">
          <el-col :span="18" class="compare-percent" :class="$store.state.toPath !=='' ? 'compare-percent-other' : ''" :style="compareStyle">{{ warnProportion }}</el-col>
          <el-col :span="6" class="compare-icon" :class="$store.state.toPath !=='' ? 'compare-icon-other' : ''" :style="compareStyle">
            <i class="iconfont icon-web-icon-1" alt="increase" v-if="warnUp"></i>
            <i class="iconfont icon-web-icon-" alt="reduce" v-if="warnDown"></i>
            <span v-if="!warnUp && !warnDown">-</span>
          </el-col>
          <div class="compare-msg">{{ $t('home.YearOnYear') }}</div>
        </el-col>
      </el-col>
      <el-col :md="24" class="type-distribution alarmTypeDistribution">
        <div style='position: relative'>
          <el-tabs v-model="activePie" type="card">
            <el-tab-pane
              :label="($store.state.toPath === '/Home' || $store.state.toPath === '' ? this.$t('home.alarmTypeDistribution') : this.$t('home.todayAlarmTypeDistribution'))"
              name="first"
            >
              <div class="loading boundary" :style="nestPieChartStyle" v-if="!nestPieChartFlag"><i class="el-icon-loading"></i></div>
              <nest-pie-chart :options="typeAlarmTypes" class="boundary" v-if="('first' === activePie)  && nestPieChartFlag"></nest-pie-chart>
            </el-tab-pane>
            <el-tab-pane
              :label="($store.state.toPath === '/Home' || $store.state.toPath === '' ? this.$t('home.warningTypeDistribution') : this.$t('home.todayWarningTypeDistribution'))"
              name="second"
            >
              <div class="loading boundary" :style="nestPieChartStyle" v-if="!nestPieChartFlag"><i class="el-icon-loading"></i></div>
              <nest-pie-chart
                :options="typeAlarmTypes2"
                class="boundary"
                v-if="('second' === activePie) && nestPieChartFlag"
              ></nest-pie-chart>
            </el-tab-pane>
          </el-tabs>
          <i class="el-icon-refresh tab-refresh" @click="initDistribution"></i>
        </div>
      </el-col>
      <el-col :md="24" class="boundary mt-20 left-padding-right">
        <el-row class="chart-title">
          <el-col :md="23" :xs="23" :sm="23" class="el-padding-left-20">{{ $t('home.alarmWarningTrend') }}</el-col>
          <el-col :md="1" :xs="1" :sm="1"><i class="el-icon-refresh refresh" @click="initAlarmTrend"></i></el-col>
        </el-row>
        <div class="loading boundary" :style="nestPieChartStyle" v-if="!lineAreaChartFlag"><i class="el-icon-loading"></i></div>
        <line-area-chart :options="trendOptions" v-if="lineAreaChartFlag"></line-area-chart>
      </el-col>
    </el-col>
  </div>
</template>
<script>
import store from '@/store'
import { classifiedAlarm, queryAlarmTrend } from '@/api/api'
import GaugeChart from '../Common/Gauge'
import NestPieChart from '../Common/NestPie'
import LineAreaChart from '../Common/LineArea'
export default {
  data () {
    return {
      provinceId: '',
      cityId: '',
      countyId: '',
      todayAlarmOptions: [],
      yesterdayAlarmOptions: [],
      todayWarnOptions: [],
      yesterdayWarnOptions: [],
      classifiedAlarm: false,
      alarmProportion: '',
      alarmColor: [[0.2, '#00ffaa'], [0.8, '#ffa42c'], [1, '#ff3939']],
      earlyWarnColor: [[0.2, '#00ffaa'], [0.8, '#7f7f7f'], [1, '#ff3939']],
      alarmUp: false,
      alarmDown: false,
      warnUp: false,
      warnDown: false,
      compareStyle: {
        height: this.$store.state.heightThird,
        lineHeight: this.$store.state.heightThird
      },
      activePie: 'first',
      typeAlarmTypes: {
        legend: [],
        series: []
      },
      typeAlarmTypes2: {
        legend: [],
        series: []
      },
      trendOptions: {
        title: {
          show: false
        },
        xAxis: [],
        series: []
      },
      baseStyle: {
        height: this.$store.state.heightThird
      },
      nestPieChartStyle: {
        height: this.$store.state.heightOne + 'px'
      },
      gaugeChartFlag: false,
      nestPieChartFlag: false,
      lineAreaChartFlag: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      setTimeout(() => {
        this.initClassifiedAlarm()
      }, Math.random() * 2000)
      setTimeout(() => {
        this.initDistribution()
      }, Math.random() * 2000)
      setTimeout(() => {
        this.initAlarmTrend()
      }, Math.random() * 2000)
    },
    initClassifiedAlarm () {
      this.gaugeChartFlag = false
      this.todayAlarmOptions = []
      this.yesterdayAlarmOptions = []
      this.todayWarnOptions = []
      this.yesterdayWarnOptions = []
      let params = {
        oqp1: '',
        projectCode: this.$store.state.projectCode,
        typeNumbers: '1,2,3,4,5,6,7,8,11,17',
        provinceId: this.provinceId,
        cityId: this.cityId,
        countyId: this.countyId
      }
      this.$nextTick(function () {
        params.oqp1 = 2
        classifiedAlarm(params)
          .then(res => {
            store.commit('l2dCompare', res)
            if (res.success) {
              this.todayAlarmOptions.push({value: res.data.l2dCompare.alarm[0], name: this.$t('home.todayAlarm'), gaugeMax: 100})
              this.yesterdayAlarmOptions.push({value: res.data.l2dCompare.alarm[1], name: this.$t('home.yesterdayAlarm'), gaugeMax: 100})
              this.todayWarnOptions.push({value: res.data.l2dCompare.warn[0], name: this.$t('home.todayWarning'), gaugeMax: 100})
              this.yesterdayWarnOptions.push({value: res.data.l2dCompare.warn[1], name: this.$t('home.yesterdayWarning'), gaugeMax: 100})
              if (res.data.l2dCompare.alarm[0] + res.data.l2dCompare.alarm[1] > 0) {
                if (res.data.l2dCompare.alarm[0] - res.data.l2dCompare.alarm[1] > 0) {
                  this.alarmUp = true
                  this.alarmDown = false
                } else if (res.data.l2dCompare.alarm[0] - res.data.l2dCompare.alarm[1] < 0) {
                  this.alarmDown = true
                  this.alarmUp = false
                }
                if (res.data.l2dCompare.alarm[1] !== 0) {
                  this.alarmProportion = Math.floor((Math.abs(res.data.l2dCompare.alarm[0] - res.data.l2dCompare.alarm[1]) / res.data.l2dCompare.alarm[1]) * 10000) / 100 + '%'
                } else {
                  this.alarmProportion = '100%'
                }
              } else {
                this.alarmUp = false
                this.alarmDown = false
                this.alarmProportion = '0%'
              }
              if (res.data.l2dCompare.warn[0] + res.data.l2dCompare.warn[1] > 0) {
                if (res.data.l2dCompare.warn[0] - res.data.l2dCompare.warn[1] > 0) {
                  this.warnUp = true
                  this.warnDown = false
                } else if (res.data.l2dCompare.warn[0] - res.data.l2dCompare.warn[1] < 0) {
                  this.warnDown = true
                  this.warnUp = false
                }
                if (res.data.l2dCompare.warn[1] !== 0) {
                  this.warnProportion = Math.floor((Math.abs(res.data.l2dCompare.warn[0] - res.data.l2dCompare.warn[1]) / res.data.l2dCompare.warn[1]) * 10000) / 100 + '%'
                } else {
                  this.warnProportion = '100%'
                }
              } else {
                this.warnUp = false
                this.warnDown = false
                this.warnProportion = '0%'
              }
              let alarmGaugeMax = 0
              let warnGaugeMax = 0
              if (res.data.l2dCompare.alarm[0] + res.data.l2dCompare.alarm[1] > 0) {
                if ((res.data.l2dCompare.alarm[0] - res.data.l2dCompare.alarm[1]) > 0) {
                  alarmGaugeMax = res.data.l2dCompare.alarm[0] * this.$store.state.gaugeMax
                } else {
                  alarmGaugeMax = res.data.l2dCompare.alarm[1] * this.$store.state.gaugeMax
                }
                if (alarmGaugeMax > 100) {
                  this.todayAlarmOptions[0].gaugeMax = alarmGaugeMax
                  this.yesterdayAlarmOptions[0].gaugeMax = alarmGaugeMax
                }
              }
              if (res.data.l2dCompare.warn[0] + res.data.l2dCompare.warn[1] > 0) {
                if ((res.data.l2dCompare.warn[0] - res.data.l2dCompare.warn[1]) > 0) {
                  warnGaugeMax = res.data.l2dCompare.warn[0] * this.$store.state.gaugeMax
                } else {
                  warnGaugeMax = res.data.l2dCompare.warn[1] * this.$store.state.gaugeMax
                }
                if (warnGaugeMax > 100) {
                  this.todayWarnOptions[0].gaugeMax = warnGaugeMax
                  this.yesterdayWarnOptions[0].gaugeMax = warnGaugeMax
                }
              }
              this.gaugeChartFlag = true
              this.classifiedAlarm = true
            } else {
              this.alarmUp = this.alarmDown = this.warnUp = this.warnDown = false
              this.todayAlarmOptions = []
              this.yesterdayAlarmOptions = []
              this.todayWarnOptions = []
              this.yesterdayWarnOptions = []
              this.alarmProportionNumber = 0
              this.alarmProportion = '0%'
              this.warnProportionNumber = 0
              this.warnProportion = '0%'
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
          })
      })
    },
    initDistribution () {
      this.nestPieChartFlag = false
      let params = {
        oqp1: '',
        projectCode: this.$store.state.projectCode,
        typeNumbers: '1,2,3,4,5,6,7,8,11,17',
        dateType: this.$store.state.distribution.dateType,
        date: this.$store.state.distribution.date,
        provinceId: this.provinceId,
        cityId: this.cityId,
        countyId: this.countyId
      }
      this.typeAlarmTypes.series = []
      this.typeAlarmTypes2.series = []
      this.$nextTick(function () {
        params.oqp1 = 4
        classifiedAlarm(params)
          .then(res => {
            store.commit('ratioOfAlert', res)
            if (res.success) {
              let data = []
              let _data = []
              res.data.ratioOfAlert.forEach(function (v, i) {
                if ([1, 2, 3, 4, 5, 6, 7, 8, 11, 17, 18, 19, 53, 54, 56, 57, 62, 63, 1001, 1002, 1005, 1007, 1008, 1009, 1010, 2002, 2006, 2003, 2004, 9000, 9001].indexOf(v.typeNumber) !== -1) {
                  data.push({name: v.info, value: v.number, tno: v.typeNumber})
                } else if ([9, 10, 12, 13, 14, 15, 16, 55, 58, 1003, 1004, 1006].indexOf(v.typeNumber) !== -1) {
                  _data.push({name: v.info, value: v.number, tno: v.typeNumber})
                }
              })
              let legend = this.legendData(data)
              let _legend = this.legendData(_data)
              this.typeAlarmTypes.series.push({type: 'pie', data: data, radius: ['30%', '50%'], center: [this.$i18n.locale === 'en' || this.$store.state.toPath !== '' ? '25%' : '25%', '50%'], avoidLabelOverlap: false, label: {normal: {show: false, position: 'center'}, emphasis: {show: true, textStyle: {fontSize: this.$i18n.locale === 'en' ? '12' : '20', fontWeight: 'bold'}}}, labelLine: {normal: {show: false}}})
              this.typeAlarmTypes2.series.push({type: 'pie', data: _data, radius: ['30%', '50%'], center: [this.$i18n.locale === 'en' || this.$store.state.toPath !== '' ? '25%' : '25%', '50%'], avoidLabelOverlap: false, label: {normal: {show: false, position: 'center'}, emphasis: {show: true, textStyle: {fontSize: this.$i18n.locale === 'en' ? '12' : '20', fontWeight: 'bold'}}}, labelLine: {normal: {show: false}}})
              this.typeAlarmTypes.legend.data = legend
              this.typeAlarmTypes2.legend.data = _legend
            } else {
              this.typeAlarmTypes.series = []
              this.typeAlarmTypes2.series = []
            }
            this.nestPieChartFlag = true
          })
          .catch(err => {
            if (err) {
              this.$message({
                message: this.$t('message.unknown'),
                type: 'error'
              })
            }
          })
      })
    },
    initAlarmTrend () {
      this.lineAreaChartFlag = false
      let params = {
        projectCode: this.$store.state.projectCode,
        provinceId: this.provinceId,
        cityId: this.cityId,
        countyId: this.countyId
      }
      this.$nextTick(function () {
        queryAlarmTrend(params)
          .then(res => {
            if (res.success) {
              let _height
              if (window.innerHeight < 969) {
                _height = 969
              } else {
                _height = window.innerHeight
              }
              store.commit('heightOne', (_height - 309) / 3)
              this.trendOptions.xAxis = []
              this.trendOptions.series = []
              this.trendOptions.xAxis = res.data.xAxis
              this.trendOptions.series.push({name: this.$t('home.alarm'), type: 'line', data: res.data.alarm, itemStyle: {color: '#F80759'}, showSymbol: true, symbol: 'circle', symbolSize: 4, smooth: true}, {name: this.$t('home.warning'), type: 'line', data: res.data.warn, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: '#6FB1FC'}, {offset: 1, color: '#0052D4'}], global: false}}, itemStyle: {color: '#34ACE7'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true})
              this.lineAreaChartFlag = true
            } else if (res.code === '-1') {
            } else {
              this.trendOptions.xAxis = []
              this.trendOptions.series = []
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
      })
    },
    legendData (data) {
      let total = 0
      let legend = []
      data.forEach((v, i) => {
        legend[i] = v.name + ' ' + v.value + ' '
        total += v.value
      })
      legend.forEach((v, i) => {
        if (document.documentElement.clientWidth > 1366) {
          legend[i] = v + '(' + (total === 0 ? 0 : (data[i].value / total * 100).toFixed(2)) + '%)'
        } else {
          legend[i] = v.split(' ')[0]
        }
        data[i].name = legend[i]
      })
      return legend
    }
  },
  watch: {
    '$store.state.projectCode': {
      handler (newVal, oldVal) {
        if (newVal || newVal === '') this.init()
      }
    },
    '$store.state.location': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.provinceId = newVal[0]
          this.cityId = newVal[1]
          this.countyId = newVal[2]
          this.init()
        }
      }
    },
    '$store.state.heightThird': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.compareStyle.height = this.compareStyle.lineHeight = newVal
        }
      }
    }
  },
  components: {
    GaugeChart,
    NestPieChart,
    LineAreaChart
  }
}
</script>
<style lang="stylus" scoped>
.compare
    position relative
.compare img
    display inline-block
    max-width 60%
.compare-icon-other img
    max-width 100%
.compare-percent,.compare-icon img
    padding 0 !important
    vertical-align middle
.compare-icon
    padding-left 5px !important
    padding-right 5px !important
.compare-percent
    font-size 20px
    text-align right
.compare-percent-other
    font-size 22px
.compare-msg
    position absolute
    left 0
    bottom 0
    width 100%
    height 20px
    line-height 20px
    font-size 15px
    text-align center
.el-margin
    margin 7px 0
.icon-web-icon-, .icon-web-icon-1
    font-size 22px
.icon-web-icon-1
    color #d81e06
.icon-web-icon-
    color #8dc0a9
.type-distribution
    margin-top 20px
    padding 0 !important
.el-tabs >>> .el-tabs__header
    margin-bottom 0
    border 2px solid #303a5ecc
    border-bottom none
    border-top-left-radius 10px
    border-top-right-radius 10px
.el-tabs >>> .el-tabs__header .el-tabs__item
    border-left none
    color #fff
.el-tabs >>> .el-tabs__item.is-active
    border-bottom none
    color #c23531
.el-tabs .boundary
    border-top-left-radius 0
    border-top-right-radius 0
.el-tabs >>> .el-tabs__nav
    border none
    border-radius none
.boundary
    border 2px solid #303a5ecc
    box-shadow 3px 3px 6px 1px rgba(0, 0, 0, .2)
.chart-title, .real-time-alarm-title
    border-bottom 2px solid #303a5ecc
.alarmTypeDistribution
    box-shadow 3px 3px 6px 1px rgba(0, 0, 0, .2)
.refresh
    position absolute
    top 12px
    right 12px
    cursor pointer
    opacity 0
    z-index 2002
    &:hover
      opacity 1
.third-pane
    right 0
.tab-refresh
    position absolute
    right 14px
    top 13px
    cursor pointer
    font-size 16px
    opacity 0
    &:hover
      opacity 1
.loading
  position relative
.el-icon-loading
  position absolute
  left 43%
  top 39%
  font-size 50px
  opacity 0.5
.trend-title
  border-bottom 2px solid #303a5ecc
</style>
