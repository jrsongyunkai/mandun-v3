<template>
  <div>
    <div :id="uniqueID" class="nest-pie" :style="baseStyle"></div>
  </div>
</template>
<script>
import uuid from 'uuid/v1'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legendScroll'
export default {
  name: 'nest-pie-chart',
  props: {
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      echart: '',
      uniqueID: '',
      legendLeft: '70%',
      baseStyle: {
        height: this.$store.state.heightOne + 'px'
      }
    }
  },
  created () {
    this.uniqueID = uuid()
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let _this = this
      let lang = this.$i18n.locale
      let _len = this.options.series.length > 0 ? this.options.series[0].data.length : 0
      if (lang === 'en') {
        if (_len < 8) {
          this.legendLeft = '45%'
        } else {
          this.legendLeft = '55%'
        }
      } else {
        if (document.documentElement.clientWidth > 1366) {
          this.legendLeft = '45%'
        } else {
          this.legendLeft = '55%'
        }
      }
      const options = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          align: 'left',
          top: '7%',
          left: this.legendLeft,
          icon: 'circle',
          itemHeight: '10',
          textStyle: {
            color: '#fff'
          },
          data: this.options.legend.data
        },
        color: [
          '#f47920',
          '#2a5caa',
          '#7fb80e',
          '#d71345',
          '#ffc20e',
          '#33a3dc',
          '#ffe600',
          '#45b97c',
          '#f3715c',
          '#0000FF',
          '#2E64FE',
          '#00FF80',
          '#FE9A2E'
        ],
        series: this.options.series
      }
      let chart = echarts.init(document.getElementById(this.uniqueID))
      this.echart = chart
      window.addEventListener('resize', function () {
        if (document.getElementById(_this.uniqueID)) document.getElementById(_this.uniqueID).style.width = (window.innerWidth * 0.2083333 - 22) + 'px'
        chart.resize()
      })
      chart.clear()
      chart.setOption(options, true)
      chart.off('legendselectchanged')
      chart.on('legendselectchanged', function (params) {
        _this.options.series[0].data.forEach((v, i) => {
          if (v.name === params.name) {
            if (v.tno === 3) {
              _this.handleQuantity(v.tno + ',' + '4')
            } else if (v.tno === 17) {
              _this.handleQuantity(v.tno + ',' + '18' + ',' + '19')
            } else {
              _this.handleQuantity(v.tno)
            }
            chart.dispatchAction({
              type: 'legendSelect',
              name: params.name
            })
          }
        })
      })
    },
    handleQuantity (type) {
      this.$router.push({
        name: 'Alarms',
        params: {
          projectCode: this.$store.state.projectCode,
          typeNumber: type.toString(),
          status: '',
          oqp2: this.$route.path === '/Home' ? 2 : ''
        }
      })
    }
  },
  watch: {
    options: {
      handler (newVal, oldVal) {
        if (newVal) {
          this.options.series = newVal.series
          this.init()
        }
      },
      deep: true
    },
    '$store.state.heightOne': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.baseStyle.height = newVal + 'px'
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.nest-pie
  width 100%
.device-table
  .el-table, .el-table__expanded-cell, .el-table >>> th, .el-table >>> tr
      background-color transparent
      color #909399
  .el-table, .el-table >>> th, .el-table >>> td
      border 1px solid #ebeef5
  .el-table >>> td, .el-table >>> th.is-leaf
      border-bottom 1px solid #ebeef5
  .el-table--border::after,.el-table--group::after,.el-table::before
      background-color #ebeef5
  .block
    >>> .el-pagination__total, >>> .el-pagination__jump
      color #909399
</style>
