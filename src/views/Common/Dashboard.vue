<template>
    <div class="loading" :style="baseStyle1" v-if="!barChartFlag"><i class="el-icon-loading"></i></div>
    <div v-else>
        <div :id="uniqueID" class="gauge" :style="baseStyle"></div>
        <div class="screen tc">
            <div class="mt-10 pointer" @click="onGetEchartsInstance(0)">
                <div class="screen-item fs-18">{{options.data[0].data[0]}}</div>
                <div class="fs-14">报警数</div>
            </div>
            <div class="mt-10 pointer" @click="onGetEchartsInstance(1)">
                <div class="screen-item fs-18">{{options.data[2].data[0]}}</div>
                <div class="fs-14">未处理</div>
            </div>
            <div class="mt-10 pointer" @click="onGetEchartsInstance(2)">
                <div class="screen-item fs-18">{{options.data[1].data[0]}}</div>
                <div class="fs-14">已处理</div>
            </div>
        </div>
    </div>
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
    barChartFlag: Boolean,
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
      echart: '',
      baseStyle: {
        height: this.$store.state.heightGauge + 'px'
      },
      baseStyle1: {
        height: (this.$store.state.heightGauge + 100) + 'px'
      }
    }
  },
  created () {
    this.uniqueID = uuid()
  },
  mounted () {},
  activated () {
    if (this.echart !== '') this.echart.resize()
  },
  methods: {
    init () {
      const options = {
        title: {
          show: true,
          text: '已处理率',
          textStyle: {
            color: '#fff',
            fontStyle: 'normal',
            fontWeight: 'lighter',
            fontSize: 14
          },
          top: '80%',
          left: 'center'
        },
        series: [
          {
            name: 'Pressure',
            type: 'gauge',
            radius: '150%',
            startAngle: 180,
            endAngle: 0,
            splitNumber: 10,
            progress: {
              show: true,
              roundCap: true,
              width: 30
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                color: [[(this.options.processRatio / 100), '#fac858'], [1, 'rgba(230, 235, 248,0.2)']],
                width: 20
              }
            },
            center: ['50%', '80%'],
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            pointer: {
              show: false
            },
            title: {
              show: false
            },
            detail: {
              valueAnimation: true,
              width: '100%',
              lineHeight: 40,
              borderRadius: 8,
              offsetCenter: [0, '-15%'],
              fontSize: 20,
              show: true,
              formatter: '{value}%',
              color: '#fff'
            },
            data: [{
              value: this.options.processRatio
            }],
            animation: true
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
    },
    onGetEchartsInstance (Params) {
      if (Params === 0) {
        this.$router.push({name: 'Alarms', params: {status: '', typeNumber: '-100', projectCode: '', type: '2'}})
      } else if (Params === 1) {
        this.$router.push({name: 'Alarms', params: {status: String(Params - 1), typeNumber: '-100', projectCode: '', type: '2'}})
      } else if (Params === 2) {
        this.$router.push({name: 'Alarms', params: {status: String(Params), typeNumber: '-100', projectCode: '', type: '2'}})
      }
    }
  },
  watch: {
    options: {
      handler (newVal, oldVal) {
        if (newVal) {
          this.options = newVal
          setTimeout(this.init, 500)
        }
      },
      deep: true
    },
    '$store.state.heightGauge': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.baseStyle.height = newVal + 'px'
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.gauge
  width 100%
.loading
  position relative
.el-icon-loading
  position absolute
  left 43%
  top 39%
  font-size 50px
  opacity 0.5
.screen
  height 100px
  display grid
  display -ms-grid
  display -moz-grid
  grid-template-columns 1fr 1fr 1fr
.screen-item
  line-height 40px
  font-weight bold
</style>
