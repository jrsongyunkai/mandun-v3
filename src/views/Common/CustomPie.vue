<template>
    <div :id="uniqueID" class="custom-pie" :style="baseStyle"></div>
</template>
<script>
import uuid from 'uuid/v1'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
export default {
  name: 'custom-pie',
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
      let i = 0
      const options = {
        backgroundColor: 'transparent',
        title: {
          text: this.options.title,
          textStyle: {
            color: '#fff',
            fontSize: 16
          },
          left: 30,
          top: 0
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        visualMap: {
          show: false,
          min: 10,
          max: 500,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: this.options.title,
            type: 'pie',
            minAngle: 10,
            radius: '80%',
            center: ['50%', '50%'],
            data: this.options.data,
            roseType: 'radius',
            label: {
              color: 'rgba(255, 255, 255, .8)'
            },
            labelLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, .8)'
              },
              smooth: 0.6,
              length: 5,
              length2: 10
            },
            itemStyle: {
              normal: {
                color: (params) => {
                  let colorList = [
                    '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'
                  ]
                  if (i === (colorList.length - 1)) {
                    i = 0
                  }
                  return colorList[i++]
                }
              }
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: (idx) => {
              return Math.random() * 500
            }
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
.custom-pie
  width 100%
</style>
