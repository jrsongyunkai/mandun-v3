<template>
    <div :id="uniqueID" class="consum-bar" :style="baseStyle"></div>
</template>
<script>
import uuid from 'uuid/v1'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
export default {
  name: 'consum-bar-charts',
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
      uniqueID: '',
      chart: '',
      baseStyle: {
        height: this.$store.state.consumHeight
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
      const options = {
        title: {
          show: this.options.title.show,
          text: this.options.title.text,
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          left: 10,
          top: 0
        },
        grid: {
          x: 60,
          y: 50,
          x2: 20,
          y2: 50,
          borderWidth: 0
        },
        tooltip: {
          show: this.options.tooltip.show,
          trigger: this.options.tooltip.trigger ? this.options.tooltip.trigger : 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: this.options.tooltip.formatter ? this.options.tooltip.formatter : '{b} <br/>{c}'
        },
        legend: {
          selectedMode: false,
          show: this.options.legendStatus,
          y: 'bottom',
          data: this.legend,
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: [
          {
            type: 'category',
            offset: 2,
            data: this.options.xAxis,
            axisPointer: {
              type: 'shadow'
            },
            boundaryGap: true,
            axisLine: {
              lineStyle: {
                color: '#fff',
                width: 2
              }
            }
          }
        ],
        yAxis: [
          {
            type: this.options.yAxisType ? this.options.yAxisType : 'value',
            data: this.options.yAxisType ? [this.$t('echarts.thisYear'), this.$t('echarts.lastYear')] : [],
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#767d8f'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            }
          }
        ],
        series: this.options.series
      }
      let chart = echarts.init(document.getElementById(this.uniqueID))
      this.echart = chart
      chart.clear()
      chart.setOption(options, true)
      window.addEventListener('resize', () => {
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
          this.options.xAxis = newVal.xAxis
          this.options.series = newVal.series
          this.init()
        }
      },
      deep: true
    },
    '$store.state.consumHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.baseStyle.height = newVal
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.consum-bar
  width 100%
</style>
