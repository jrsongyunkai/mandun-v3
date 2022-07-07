<template>
    <div :id="uniqueID" class="gauge" :style="baseStyle"></div>
</template>
<script>
import uuid from 'uuid/v1'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/gauge'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
export default {
  name: 'gauge-chart',
  props: {
    title: String,
    axisColor: {
      type: Array,
      default () {
        return [[0.2, '#f8605f'], [0.8, '#fadc62'], [1, '#749f83']]
      }
    },
    options: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      echart: '',
      uniqueID: '',
      baseStyle: {
        height: this.$store.state.heightThird
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
        tooltip: {
          formatter: '{b} : {c}'
        },
        series: [
          {
            type: 'gauge',
            max: this.options.length > 0 ? this.options[0].gaugeMax : 100,
            name: '',
            title: {
              offsetCenter: [0, '85%'],
              color: '#fff',
              fontSize: 12
            },
            startAngle: '210',
            endAngle: '-30',
            pointer: {
              width: 2
            },
            axisLine: {
              lineStyle: {
                color: this.axisColor,
                width: 4,
                shadowColor: '#fff',
                shadowBlur: 2
              }
            },
            splitLine: {
              show: true,
              length: 10,
              lineStyle: {
                color: '#172450'
              }
            },
            axisTick: {
              length: 5,
              lineStyle: {
                color: '#172450'
              }
            },
            axisLabel: {
              show: false
            },
            radius: '100%',
            detail: {
              offsetCenter: [0, '40%'],
              padding: 20,
              fontSize: 13,
              color: 'rgb(255,255,255)',
              formatter: '{value}'
            },
            data: this.options
          }
        ]
      }
      let chart = echarts.init(document.getElementById(this.uniqueID))
      this.echart = chart
      chart.clear()
      chart.setOption(options)
      window.addEventListener('resize', function () {
        chart.resize()
      })
    }
  },
  watch: {
    options: {
      handler (newVal, oldVal) {
        if (newVal) {
          this.options = newVal
          this.init()
        }
      },
      deep: true
    },
    '$store.state.heightThird': {
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
.gauge
    margin 0 10px
    width 100%
</style>
