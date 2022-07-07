<template>
    <div class="loading" :style="baseStyle" v-if="!barChartFlag"><i class="el-icon-loading"></i></div>
    <div v-else :id="uniqueID" class="bar" :style="baseStyle"></div>
</template>
<script>
import uuid from 'uuid/v1'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
export default {
  name: 'bar-chart',
  props: {
    title: String,
    barChartFlag: Boolean,
    options: {
      type: Object,
      default () {
        return {}
      }
    },
    onGetEchartsInstance: {
      type: Function,
      require: false
    }
  },
  data () {
    return {
      uniqueID: '',
      echart: '',
      baseStyle: {
        height: this.$store.state.heightOne + 'px'
      }
    }
  },
  created () {
    this.uniqueID = uuid()
  },
  mounted () {},
  activated () {
    if (this.echart !== '') this.echart.resize()
  },
  methods: {
    init () {
      let _this = this
      let tenThousand = this.$t('echarts.tenThousand')
      let tenMillion = this.$t('echarts.tenMillion')
      const options = {
        title: {
          text: this.options.processRatio ? (this.$t('home.processed') + this.$t('control.rate') + '：' + this.options.processRatio + '%') : '',
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          bottom: '40%',
          right: 0
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          textStyle: {
            color: '#fff'
          },
          orient: 'vertical',
          top: 10,
          right: 0,
          icon: 'circle',
          formatter: function (name) {
            let value = 0
            _this.options.series.forEach((item, index) => {
              if (item.name === name) {
                value = item.data[0]
              }
            })
            return name + '：' + value
          }
        },
        barWidth: 20,
        xAxis: {
          type: 'category',
          name: this.title,
          nameLocation: 'middle',
          nameTextStyle: {
            color: '#fff'
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            margin: 2,
            formatter: function (value, index) {
              if (value >= 10000 && value < 10000000) {
                value = value / 10000 + tenThousand
              } else if (value >= 10000000) {
                value = value / 10000000 + tenMillion
              }
              return value
            }
          }
        },
        grid: {
          left: '15%',
          right: '40%',
          top: '20%',
          bottom: '15%'
        },
        series: this.options.series
      }
      let chart = echarts.init(document.getElementById(this.uniqueID))
      this.echart = chart
      chart.clear()
      chart.setOption(options, true)
      this.onGetEchartsInstance && this.onGetEchartsInstance(chart)
      window.addEventListener('resize', function () {
        setTimeout(function () {
          chart.resize()
        }, 100)
      })
    }
  },
  watch: {
    options: {
      handler (newVal, oldVal) {
        if (newVal) {
          this.options = newVal
          setTimeout(this.init, 500)
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
.bar
  width 100%
.loading
  position relative
.el-icon-loading
  position absolute
  left 43%
  top 39%
  font-size 50px
  opacity 0.5
</style>
