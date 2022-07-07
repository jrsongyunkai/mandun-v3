<template>
  <div>
    <div :id="uniqueID" class="manage-line-area" :style="baseStyle"></div>
  </div>
</template>
<script>
import uuid from 'uuid/v1'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
export default {
  name: 'manage-line-area',
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
      echart: '',
      uniqueID: '',
      baseStyle: {
        height: this.options.height ? this.options.height : this.$store.state.manageTowHeight
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
          trigger: 'axis'
        },
        title: {
          show: this.options.title.show,
          text: this.options.title.text,
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          left: 0,
          top: 2
        },
        legend: {
          orient: 'horizontal',
          align: 'left',
          bottom: 5,
          x: 'center',
          icon: 'circle',
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          boundaryGap: ['5%', '5%'],
          data: this.options.xAxis
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          splitLine: {
            show: false
          }
        },
        grid: {
          left: 50,
          right: 40,
          top: '15%',
          bottom: '15%'
        },
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
          this.options = newVal
          this.init()
        } else {
          this.options = oldVal
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
.manage-line-area
  width 100%
</style>
