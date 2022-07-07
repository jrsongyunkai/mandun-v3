<template>
  <div>
    <div :id="uniqueID" class="line-area" :style="baseStyle"></div>
  </div>
</template>
<script>
import uuid from 'uuid/v1'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
export default {
  name: 'line-area-chart',
  props: {
    title: String,
    refreshFlag: Boolean,
    lineAreaChartFlag: Boolean,
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
      const options = {
        tooltip: {
          trigger: 'axis'
        },
        title: {
          show: this.options.title.show,
          text: this.options.title.text ? this.options.title.text : '',
          textStyle: {
            color: '#fff',
            fontSize: 14
          },
          left: 0,
          top: 10
        },
        legend: {
          orient: 'vertical',
          align: 'left',
          top: 10,
          x: 'right',
          icon: 'circle',
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
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
          top: '20%',
          bottom: '20%'
        },
        series: this.options.series
      }
      let chart = echarts.init(document.getElementById(this.uniqueID))
      this.echart = chart
      chart.clear()
      chart.setOption(options)
      window.addEventListener('resize', function () {
        if (document.getElementById(_this.uniqueID)) document.getElementById(_this.uniqueID).style.width = (window.innerWidth * 0.2083333 - 22) + 'px'
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
        } else {
          this.options = oldVal
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
    },
    '$store.state.systemFlag': {
      handler (newVal, oldVal) {
        if (newVal && this.$store.state.toPath !== '') this.echart.resize()
      }
    },
    '$store.state.toPath': {
      handler (newVal, oldVal) {
        document.getElementById(this.uniqueID).style.width = (window.innerWidth * 0.2083333 - 22) + 'px'
        if (newVal) this.echart.resize()
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.line-area
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
