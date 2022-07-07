<template>
  <div>
    <div :id='uniqueID' class='formula-line-bar' :style='baseStyle'></div>
  </div>
</template>
<script>
import uuid from 'uuid/v1'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
export default {
  name: 'formula-line-bar',
  props: {
    title: String,
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
        height: this.$store.state.overTowHeight
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
          left: 40,
          top: 5
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          show: true,
          borderWidth: 0,
          left: 60,
          right: 40,
          top: '10%',
          bottom: '15%'
        },
        legend: {
          data: ['能耗'],
          right: '2%',
          orient: 'horizontal',
          align: 'left',
          bottom: 5,
          x: 'center',
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
            type: 'value',
            name: '',
            min: 0,
            position: 'left',
            axisLine: {
              lineStyle: {
                width: 2,
                color: '#fff'
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '能耗',
            type: 'bar',
            barMaxWidth: '50',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                  offset: 0,
                  color: 'rgba(0, 197, 137, .1)'
                }, {
                  offset: 1,
                  color: 'rgba(0, 197, 137, 1)'
                }], false),
                label: {
                  show: false
                }
              }
            },
            data: this.options.barSeries,
            barWidth: 30
          }
        ]
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
          this.options.barSeries = newVal.barSeries
          this.init()
        }
      },
      deep: true
    },
    '$store.state.overTowHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.baseStyle.height = newVal
        }
      }
    }
  }
}
</script>
<style lang='stylus' scoped>
.formula-line-bar
  width 100%
</style>
