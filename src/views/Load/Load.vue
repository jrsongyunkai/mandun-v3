<template>
    <div id="load">
        <el-form ref="form" :model="form" size="small" id="query-form" @submit.native.prevent>
          <el-form-item>
            <el-input class="short-input" v-model="form.mac" @keyup.enter.native="init" :placeholder="$t('placeholder.enterDeviceNo')"></el-input>
            <el-button type="primary" @click="init">{{ $t('btns.query') }}</el-button>
          </el-form-item>
        </el-form>
        <el-row v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, .2)" :element-loading-text="$t('message.loading')">
          <el-col :span="12">
              <line-charts :options="firstLineOptions" v-if="firstLine"></line-charts>
          </el-col>
          <el-col :span="12">
              <line-charts :options="secondLineOptions" v-if="secondLine"></line-charts>
          </el-col>
          <el-col :span="24">
              <bar-charts :options="thirdBarOptions" v-if="thirdBar"></bar-charts>
          </el-col>
        </el-row>
    </div>
</template>
<script>
import { last2xLoadStats } from '@/api/api'
import BarCharts from '../Common/Bars'
import LineCharts from '../Common/Line'
export default {
  data () {
    return {
      firstLine: false,
      secondLine: false,
      thirdBar: false,
      firstLineOptions: {
        series: [],
        xAxis: [],
        title: {
          show: true,
          text: this.$t('echarts.loadSituationPastTwoDays')
        },
        legendSelect: false,
        tooltip: {
          trigger: 'axis',
          formatter: '{b}' + this.$t('echarts.hour') + '<br/>' + this.$t('echarts.yesterdayLoad') + '：{c0}<br/>' + this.$t('echarts.todayLoad') + '：{c1}'
        }
      },
      secondLineOptions: {
        series: [],
        xAxis: [],
        title: {
          show: true,
          text: this.$t('echarts.loadSituationPastTwoWeeks')
        },
        legendSelect: false,
        tooltip: {
          trigger: 'axis',
          formatter: ''
        }
      },
      thirdBarOptions: {
        legendStatus: true,
        xAxisType: '',
        yAxisType: '',
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('echarts.loadSituationThisYearLastMonth')
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: '{b}<br/>' + this.$t('echarts.loadLastYear') + '：{c0}<br/>' + this.$t('echarts.loadThisYear') + '：{c1}'
        }
      },
      form: {
        mac: ''
      },
      loading: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loading = true
      this.initFirstLine()
      this.initSecondLine()
      this.initBars()
    },
    initFirstLine () {
      this.firstLineOptions.series = []
      this.firstLineOptions.xAxis = []
      let params = {
        statsType: 1,
        mac: this.form.mac.trim(),
        projectCode: this.$store.state.projectCode
      }
      this.$nextTick(function () {
        last2xLoadStats(params)
          .then(res => {
            if (res.success) {
              let linedata1 = {yesterday: [], today: [], legend: []}
              res.data.forEach((v, i) => {
                linedata1.yesterday[i] = v.number1
                linedata1.today[i] = v.number2
                linedata1.legend[i] = v.time
              })
              this.firstLineOptions.xAxis = linedata1.legend
              this.firstLineOptions.series.push({name: this.$t('echarts.yesterdayLoadKWh'), type: 'line', data: linedata1.yesterday, smooth: true, itemStyle: {normal: {color: '#08BEC1'}}, symbol: 'emptyCircle'})
              this.firstLineOptions.series.push({name: this.$t('echarts.todayLoadKWh'), type: 'line', data: linedata1.today, smooth: true, itemStyle: {normal: {color: '#B8A5DD'}}, symbol: 'emptyCircle'})
              this.firstLine = true
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
      })
    },
    initSecondLine () {
      this.secondLineOptions.series = []
      this.secondLineOptions.xAxis = []
      let params = {
        statsType: 2,
        mac: this.form.mac.trim(),
        projectCode: this.$store.state.projectCode
      }
      this.$nextTick(function () {
        last2xLoadStats(params)
          .then(res => {
            if (res.success) {
              let linedata2 = {lastweek: [], thisweek: [], legend: [this.$t('echarts.Monday'), this.$t('echarts.Tuesday'), this.$t('echarts.Wednesday'), this.$t('echarts.Thursday'), this.$t('echarts.Friday'), this.$t('echarts.Saturday'), this.$t('echarts.Sunday')]}
              res.data.forEach((v, i) => {
                linedata2.lastweek[i] = v.number1
                linedata2.thisweek[i] = v.number2
              })
              this.secondLineOptions.xAxis = linedata2.legend
              this.secondLineOptions.series.push({name: this.$t('echarts.lastWeekLoadKWh'), type: 'line', data: linedata2.lastweek, smooth: true, itemStyle: {normal: {color: '#08BEC1'}}, symbol: 'emptyCircle'})
              this.secondLineOptions.series.push({name: this.$t('echarts.thisWeekLoadKWh'), type: 'line', data: linedata2.thisweek, smooth: true, itemStyle: {normal: {color: '#B8A5DD'}}, symbol: 'emptyCircle'})
              this.secondLine = true
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
      })
    },
    initBars () {
      let that = this
      this.thirdBarOptions.series = []
      this.thirdBarOptions.xAxis = []
      let params = {
        statsType: 3,
        mac: this.form.mac.trim(),
        projectCode: this.$store.state.projectCode
      }
      this.$nextTick(function () {
        last2xLoadStats(params)
          .then(res => {
            if (res.success) {
              let bardata = {lastyear: [], thisyear: [], legend: [that.$t('echarts.January'), that.$t('echarts.February'), that.$t('echarts.March'), that.$t('echarts.April'), that.$t('echarts.May'), that.$t('echarts.June'), that.$t('echarts.July'), that.$t('echarts.August'), that.$t('echarts.September'), that.$t('echarts.October'), that.$t('echarts.November'), that.$t('echarts.December')]}
              res.data.forEach((v, i) => {
                bardata.lastyear[i] = v.number1
                bardata.thisyear[i] = v.number2
              })
              this.thirdBarOptions.xAxis = bardata.legend
              this.thirdBarOptions.series.push({name: that.$t('echarts.loadLastYearKWh'), type: 'bar', barMaxWidth: '30', data: bardata.lastyear, itemStyle: {emphasis: {barBorderRadius: 5}, normal: {color: '#08BEC1', barBorderRadius: 5}}})
              this.thirdBarOptions.series.push({name: that.$t('echarts.loadThisYearKWh'), type: 'bar', barMaxWidth: '30', data: bardata.thisyear, itemStyle: {emphasis: {barBorderRadius: 5}, normal: {color: '#B8A5DD', barBorderRadius: 5}}})
              this.thirdBar = true
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
            this.loading = false
          })
      })
    }
  },
  watch: {
    '$store.state.projectCode': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.init()
        }
      }
    }
  },
  components: {
    BarCharts,
    LineCharts
  }
}
</script>
<style lang="stylus" scoped>
#load
  padding-top 49px
#query-form
  position absolute
  top 5px
  right 10px
</style>
