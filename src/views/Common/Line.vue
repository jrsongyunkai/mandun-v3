<template>
    <div :id="uniqueID" class="line" :style="baseStyle"></div>
</template>
<script>
import uuid from 'uuid/v1'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
export default {
  name: 'line-chart',
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
      echart: '',
      baseStyle: {
        height: this.options.height ? this.options.height : this.$store.state.innerComponentHeight
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
      let that = this
      const options = {
        title: {
          show: this.options.title.show,
          text: this.options.title.text ? this.options.title.text : '',
          textStyle: {
            color: '#fff',
            fontSize: 16
          },
          left: 30,
          top: 0
        },
        grid: {
          x: 60,
          y: 30,
          x2: 20,
          y2: this.options.grid ? this.options.grid : 80,
          borderWidth: 0
        },
        tooltip: {
          trigger: 'axis',
          confine: true,
          formatter: function (datas) {
            let res = ''
            for (let i = 0, length = datas.length; i < length; i++) {
              if (that.options.time && i === 0) res = that.$t('dialog.time') + ': ' + datas[i].axisValue + '<br/>'
              res += datas[i].marker + datas[i].seriesName + '：' + (datas[i].value !== undefined ? datas[i].value === true ? that.$t('table.closing') : datas[i].value === false ? that.$t('table.opening') : datas[i].value : '') + '<br/>'
            }
            return res
          }
        },
        legend: {
          show: this.options.legendDisplay === false ? this.options.legendDisplay : true,
          y: 'bottom',
          data: this.options.series.name,
          padding: 10,
          selectedMode: this.options.legendSelect ? this.options.legendSelect : false,
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: [
          {
            type: 'category',
            data: this.options.xAxis,
            axisLabel: {
              show: true,
              rotate: 0,
              textStyle: {
                color: '#fff'
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
            type: 'value',
            splitArea: {
              show: true,
              areaStyle: {
                color: [
                  'transparent',
                  'transparent'
                ]
              }
            },
            splitLine: {
              show: this.options.splitLine ? this.options.splitLine : false,
              lineStyle: {
                color: '#274473'
              }
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
      chart.setOption(options, true)
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
          // setTimeout(this.init, 500)
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
.line
    width: 100%
</style>
