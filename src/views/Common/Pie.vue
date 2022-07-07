<template>
    <div id="pie">
      <el-row class="chart-title">
        <el-col :md="22" :xs="22" :sm="22" class="el-padding-left-20">{{title}}</el-col>
        <el-col :md="2" :xs="2" :sm="2" v-if="refreshFlag">
          <i class="el-icon-refresh" @click="childMethod"></i>
        </el-col>
      </el-row>
      <div class="loading" :style="baseStyle" v-if="!pieChartFlag"><i class="el-icon-loading"></i></div>
      <div v-else :id="uniqueID" class="pie" :style="baseStyle"></div>
    </div>
</template>
<script>
import uuid from 'uuid/v1'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
export default {
  name: 'pie-chart',
  props: {
    title: String,
    refreshFlag: Boolean,
    pieChartFlag: Boolean,
    options: {
      type: Object,
      default () {
        return {}
      }
    },
    initRatioOfIndustry: {
      type: Function,
      default: null
    }

  },
  data () {
    return {
      uniqueID: '',
      echart: '',
      baseStyle: {
        height: this.$store.state.heightOne + 'px'
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
        color: this.options.colorList,
        title: {
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        calculable: true,
        textStyle: {
          color: 'rgba(255, 255, 255, 1)'
        },
        labelLine: {
          lineStyle: {
            color: 'rgba(255,255,255,.6)'
          }
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
    },
    childMethod () {
      this.initRatioOfIndustry()
    }
  },
  watch: {
    options: {
      handler (newVal, oldVal) {
        if (newVal) {
          this.options.series = newVal.series
          setTimeout(this.init, 500)
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
    }
  }
}
</script>
<style lang="stylus" scoped>
#pie, .pie
  width 100%
  overflow hidden
.chart-title
  border-bottom 2px solid #303a5ecc
.el-icon-refresh
  cursor pointer
  opacity 0
  &:hover
    opacity 1
.loading
  position relative
.el-icon-loading
  position absolute
  left 43%
  top 39%
  font-size 50px
  opacity 0.5
</style>
