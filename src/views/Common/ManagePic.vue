<template>
  <div>
    <div :id="uniqueID" class="manage-pie" :style="baseStyle"></div>
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
  name: 'manage-pie-chart',
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
      let _this = this
      const options = {
        color: ['rgb(0, 189, 135)', 'rgb(184, 36, 100)', 'rgb(14, 164, 192)', 'rgb(119, 123, 133)'],
        tooltip: {
          trigger: 'item'
        },
        legend: {
          left: 'center',
          bottom: '2%',
          icon: 'circle',
          itemHeight: '10',
          align: 'left',
          textStyle: {
            color: '#fff'
          },
          data: _this.options,
          formatter: function (name) {
            let value = 0
            let total = 0
            _this.options.forEach((item, index) => {
              total += item.value
              if (item.name === name) {
                value = item.value
              }
            })
            if (total === 0) {
              return name + ' ' + value + ' ' + '0%'
            }
            return name + ' ' + value + ' ' + '(' + ((value / total) * 100).toFixed(2) + '%' + ')' + '  '
          }
        },
        series: [
          {
            name: '分项用能',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            legendHoverLink: true,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '20',
                fontWeight: 'bold'
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
          this.options.series = newVal.series
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
<style lang="stylus" scoped>
.manage-pie
  width 100%
</style>
