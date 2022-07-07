<template>
    <div :id="uniqueID" class="bar" :style="baseStyle"></div>
</template>
<script>
import uuid from 'uuid/v1'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
export default {
  name: 'bar-charts',
  props: {
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
      chart: '',
      baseStyle: {
        height: this.$store.state.innerComponentHeight
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
      const options = {
        title: {
          show: this.options.title.show,
          text: this.options.title.text,
          textStyle: {
            color: '#fff',
            fontSize: 16
          },
          left: 30,
          top: 0
        },
        grid: {
          x: 60,
          y: 50,
          x2: 20,
          y2: 80,
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
            type: this.options.xAxisType ? this.options.xAxisType : 'category',
            data: this.options.xAxis,
            max: this.options.xAxis.max ? this.options.xAxis.max : null,
            axisLabel: {
              interval: 0,
              textStyle: {
                color: '#fff'
              },
              formatter: function (value, index) {
                let ret = ''
                let maxLength = 8
                let valLength = value.length
                let row = Math.ceil(valLength / maxLength)
                if (row > 1) {
                  for (let i = 0; i < row; i++) {
                    let tmp = ''
                    let start = i * maxLength
                    let end = start + maxLength
                    tmp = value.substring(start, end) + '\n'
                    ret += tmp
                  }
                  return ret
                } else {
                  return value
                }
              }
            },
            axisTick: {
              onGap: 0,
              lineStyle: {
                color: '#767d8f'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#767d8f'
              }
            },
            splitLine: {
              show: false
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
      chart.clear()
      chart.setOption(options, true)
      if (this.options.monitor) {
        chart.on('click', function (params) {
          if (_this.options.dateType === 2) {
            _this.$emit('passIndex', params.dataIndex + 1)
          } else {
            _this.$emit('passIndex', params.dataIndex)
          }
        })
      }
      this.onGetEchartsInstance && this.onGetEchartsInstance(chart)
      window.addEventListener('resize', function () {
        chart.resize()
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
    '$store.state.innerComponentHeight': {
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
.bar
  width: 100%
</style>
