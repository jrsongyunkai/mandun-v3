<template>
  <div>
    <div :id="uniqueID" class="fu-pie" :style="baseStyle"></div>
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
  name: 'fu-pie-chart',
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
      legendLeft: '55%',
      baseStyle: {
        height: this.$store.state.manageTowHeight
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
        color: ['rgb(0, 189, 135)', 'rgb(184, 36, 100)', 'rgb(14, 164, 192)', 'rgb(119, 123, 133)'],
        tooltip: {
          formatter: '行业：\n' + '{b}'
        },
        legend: {
          orient: 'vertical',
          right: '10%',
          top: '42%',
          icon: 'circle',
          itemHeight: '10',
          align: 'left',
          textStyle: {
            color: '#fff'
          },
          data: _this.options,
          formatter: function (name) {
            return name + '  ' + '100%'
          }
        },
        series: [
          {
            name: '行业',
            type: 'pie',
            radius: ['50%', '70%'],
            center: ['30%', '42%'],
            avoidLabelOverlap: false,
            legendHoverLink: true,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              scale: false,
              label: {
                show: true,
                color: '#fff',
                fontSize: '20',
                fontWeight: 'bold',
                formatter: '本月用能\n\n' + '{c}'
              }
            },
            labelLine: {
              show: false
            },
            data: _this.options
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
          this.options = newVal
          this.init()
        }
      },
      deep: true
    },
    '$store.state.manageTowHeight': {
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
.fu-pie
  width 100%
</style>
