<template>
    <div id="EnergyTrend">
      <el-row class="ml-10" :style="{height: height}">
        <el-row class="ml-10 mt-10">
          <el-form :inline="true" :model="formInline" size="small">
            <el-form-item label="区域层级：">
              <el-cascader
                :show-all-levels="false"
                v-model="formInline.hierarchy"
                :options="options"
                :props="{ value: 'id', label: 'areaName', checkStrictly: true }"
                clearable>
              </el-cascader>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleTimeQruey(1)" :plain="timeType !== 1" circle>日</el-button>
              <el-button type="primary" @click="handleTimeQruey(2)" :plain="timeType !== 2" circle>月</el-button>
              <el-button type="primary" @click="handleTimeQruey(3)" :plain="timeType !== 3" circle>年</el-button>
            </el-form-item>
            <el-form-item label="日期">
              <el-date-picker
                v-show="timeType === 1"
                key="aa"
                style="width:160px"
                v-model="date"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="请选择">
              </el-date-picker>
              <el-date-picker
                v-show="timeType === 2"
                key="bb"
                style="width:160px"
                v-model="month"
                type="month"
                value-format="yyyy-MM"
                format="yyyy-MM"
                placeholder="请选择">
              </el-date-picker>
              <el-date-picker
                v-show="timeType === 3"
                key="cc"
                style="width:160px"
                v-model="year"
                type="year"
                value-format="yyyy"
                format="yyyy"
                placeholder="请选择">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="formInline.hierarchy.length === 0" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-col :span="12" :style="{height: formulaHeight}">
          <div class="box-inner ml-10" style="height: 49%">
            <el-col :md="24" class="boundary left-padding-right" style="height: 100%;">
              <el-row class="chart-title">
                <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">能耗趋势</el-col>
              </el-row>
              <el-row>
                <el-row :span="24">
                  <!-- <div class="fl box-border mt-10" style="margin-left: 120px">费用: 1234567元</div> -->
                  <el-button @click="handleOne" type="primary" class="box-btn" :plain="active !== 1" style="right: 200px" size="small">综合碳排放</el-button>
                  <el-button @click="handleTwo" type="primary" class="box-btn" :plain="active !== 2" style="right: 110px" size="small">总用电量</el-button>
                  <el-button @click="handleThree" type="primary" class="box-btn" :plain="active !== 3" style="right: 20px" size="small">综合能耗</el-button>
                  <!-- <el-button @click="handleItemThr" type="primary" class="box-btn" :plain="lineAreaType !== 'item'" style="right: 20px" size="small">费用</el-button> -->
                  <trend-bar :options="BarOptions"></trend-bar>
                </el-row>
              </el-row>
            </el-col>
          </div>
          <div class="box-inner ml-10 mt-20" style="height: 49%">
            <el-col :md="24" class="boundary" style="height: 100%;">
              <el-row class="chart-title">
                <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">
                  <el-col :span="12">分项能耗</el-col>
                </el-col>
              </el-row>
              <el-row>
                <manage-Line-Area :options="TrendBrokenAreaOptions"></manage-Line-Area>
              </el-row>
            </el-col>
          </div>
        </el-col>
        <el-col :span="12" :style="{height: formulaHeight}">
          <div class="box-inner ml-10" style="height: 49%">
            <el-col :md="24" class="boundary left-padding-right" style="height: 100%;">
              <el-row class="chart-title">
                <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">分时能耗</el-col>
              </el-row>
              <el-row>
                <div class="fr box-border mt-10 mr-20">峰时能耗: {{highEnergySum}}kwh</div>
                <div class="fr box-border mt-10 mr-20">谷时能耗: {{lowerEnergySum}}kwh</div>
                <div class="fr box-border mt-10 mr-20">平时能耗: {{midEnergySum}}kwh</div>
                <manage-Line-Area :options="TrendAreaOptions"></manage-Line-Area>
              </el-row>
            </el-col>
          </div>
          <div class="box-inner ml-10 mt-20" style="height: 49%">
            <el-col :md="24" class="boundary" style="height: 100%;">
              <el-row class="chart-title">
                <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">
                  <el-col :span="12">分项占比</el-col>
                </el-col>
              </el-row>
              <el-row>
                <trend-pic :options="TrendPicOptions"></trend-pic>
              </el-row>
            </el-col>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
import { seekAreaListTreeByProject, energyGeneralByMonth, energyCategory, energyGeneralCategory } from '@/api/api'
import TrendBar from '../Common/TrendBar'
import manageLineArea from '../Common/ManageLineArea'
import TrendPic from '../Common/TrendPic'
export default {
  components: {TrendBar, manageLineArea, TrendPic},
  data () {
    return {
      height: this.$store.state.asideTowHeight,
      formulaHeight: this.$store.state.formulaHeight,
      formInline: {
        hierarchy: [],
        contrastVal: ''
      },
      highEnergySum: 0,
      lowerEnergySum: 0,
      midEnergySum: 0,
      options: [],
      date: this.$func.getFuTime(new Date(), 'date'),
      month: this.$func.getFuTime(new Date(), 'month'),
      year: this.$func.getFuTime(new Date(), 'year'),
      timeType: 3,
      time: {
        startTime: '',
        endTime: ''
      },
      BarOptions: {
        legendStatus: true,
        xAxisType: '',
        yAxisType: '',
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: ''
        },
        tooltip: {
          show: true,
          trigger: 'axis'
        }
      },
      TrendAreaOptions: {
        title: {
          show: true,
          text: '   kwh'
        },
        xAxis: [],
        series: [],
        height: this.$store.state.overTowHeight
      },
      TrendBrokenAreaOptions: {
        title: {
          show: true,
          text: '   kwh'
        },
        xAxis: [],
        series: [],
        height: this.$store.state.overTowHeight
      },
      TrendPicOptions: [],
      totalCarbon: [],
      totalElectric: [],
      totalEnergy: [],
      active: 1
    }
  },
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.handleSeekAreaListTree()
    },
    handleTimeQruey (num) {
      if (this.formInline.hierarchy === []) {
        this.$message({
          message: '请选择区域层级',
          type: 'error'
        })
        return
      }
      if (num === 1 && this.date === null) {
        this.date = this.$func.getFuTime(new Date(), 'date')
      }
      if (num === 2 && this.month === null) {
        this.month = this.$func.getFuTime(new Date(), 'month')
      }
      if (num === 3 && this.year === null) {
        this.year = this.$func.getFuTime(new Date(), 'year')
      }
      this.timeType = num
      this.onSubmit()
    },
    handleOne () {
      this.active = 1
      this.BarOptions.title.text = 'KG'
      this.BarOptions.series = []
      this.BarOptions.series.push({name: '综合碳排放', type: 'bar', data: this.totalCarbon})
    },
    handleTwo () {
      this.active = 2
      this.BarOptions.title.text = 'kW.h'
      this.BarOptions.series = []
      this.BarOptions.series.push({name: '总用电量', type: 'bar', data: this.totalElectric})
    },
    handleThree () {
      this.active = 3
      this.BarOptions.title.text = 'kWh'
      this.BarOptions.series = []
      this.BarOptions.series.push({name: '综合能耗', type: 'bar', data: this.totalEnergy})
    },
    onSubmit () {
      if (this.timeType === 1) {
        this.time = {
          startTime: this.date.split('-').join('') + '00',
          endTime: this.date.split('-').join('') + '23'
        }
      }
      if (this.timeType === 2) {
        let month = this.month.split('-').join('').substring(this.month.split('-').join('').length - 2, this.month.split('-').join('').length)
        if (['04', '06', '09', '11'].indexOf(month) !== -1) {
          this.time = {
            startTime: this.month.split('-').join('') + '01',
            endTime: this.month.split('-').join('') + '30'
          }
        } else if (['01', '03', '05', '07', '08', '10', '12'].indexOf(month) !== -1) {
          this.time = {
            startTime: this.month.split('-').join('') + '01',
            endTime: this.month.split('-').join('') + '31'
          }
        } else {
          let years = this.month.split('-').join('').substring(0, 4)
          if ((years % 4 === 0 && years % 100 !== 0) || years % 400 === 0) {
            this.time = {
              startTime: this.month.split('-').join('') + '01',
              endTime: this.month.split('-').join('') + '29'
            }
          } else {
            this.time = {
              startTime: this.month.split('-').join('') + '01',
              endTime: this.month.split('-').join('') + '28'
            }
          }
        }
      }
      if (this.timeType === 3) {
        this.time = {
          startTime: this.year + '01',
          endTime: this.year + '12'
        }
      }
      this.getEnergyGeneralCategory()
      this.getEnergyCategory()
      this.getEnergyGeneralByMonth()
    },
    handleSeekAreaListTree () {
      seekAreaListTreeByProject()
        .then(res => {
          if (res.success) {
            if (res.data.length > 0) {
              this.options = res.data
              this.formInline.hierarchy.push(res.data[0].id)
              this.onSubmit()
            }
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }).catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    },
    getEnergyGeneralByMonth () {
      this.highEnergySum = this.lowerEnergySum = this.midEnergySum = 0
      this.TrendAreaOptions.xAxis = []
      this.TrendAreaOptions.series.data = []
      this.BarOptions.xAxis = []
      this.BarOptions.series = []
      let params = {
        dataType: this.timeType
      }
      if (this.timeType === 3) {
        params.dataStr = this.year.split('-').join('')
      } else if (this.timeType === 2) {
        params.dataStr = this.month.split('-').join('')
      } else if (this.timeType === 1) {
        params.dataStr = this.date.split('-').join('')
      }
      if (this.formInline.hierarchy.length) {
        params.areaId = this.formInline.hierarchy[this.formInline.hierarchy.length - 1]
      } else {
        params.areaId = -1
      }
      energyGeneralByMonth(params)
        .then(res => {
          if (res.success) {
            let highEnergy = []
            let lowerEnergy = []
            let midEnergy = []
            this.totalCarbon = []
            this.totalElectric = []
            this.totalEnergy = []
            Object.keys(res.data).forEach(key => {
              this.TrendAreaOptions.xAxis.push(key)
              this.BarOptions.xAxis.push(key)
              highEnergy.push(res.data[key]['highEnergy'])
              lowerEnergy.push(res.data[key]['lowerEnergy'])
              midEnergy.push(res.data[key]['midEnergy'])
              this.totalCarbon.push(res.data[key]['totalCarbon'])
              this.totalElectric.push(res.data[key]['totalElectric'])
              this.totalEnergy.push(res.data[key]['totalEnergy'])
            })
            this.TrendAreaOptions.series = [
              {name: '峰时能耗', type: 'line', data: highEnergy, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(65, 105, 225, .4)'}, {offset: 1, color: 'rgba(65, 105, 225, .1)'}], global: false}}, itemStyle: {color: '#34ACE7'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true},
              {name: '谷时能耗', type: 'line', data: lowerEnergy, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(65, 105, 225, .4)'}, {offset: 1, color: 'rgba(65, 105, 225, .1)'}], global: false}}, itemStyle: {color: '#F56C6C'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true},
              {name: '平时能耗', type: 'line', data: midEnergy, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(65, 105, 225, .4)'}, {offset: 1, color: 'rgba(65, 105, 225, .1)'}], global: false}}, itemStyle: {color: '#67C23A'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true}
            ]
            highEnergy.forEach(item => { this.highEnergySum = this.highEnergySum + item })
            lowerEnergy.forEach(item => { this.lowerEnergySum = this.lowerEnergySum + item })
            midEnergy.forEach(item => { this.midEnergySum = this.midEnergySum + item })
            if (this.highEnergySum > 0) this.highEnergySum = (this.highEnergySum).toFixed(2)
            if (this.lowerEnergySum > 0) this.lowerEnergySum = (this.lowerEnergySum).toFixed(2)
            if (this.midEnergySum > 0) this.midEnergySum = (this.midEnergySum).toFixed(2)
            if (this.active === 1) {
              this.handleOne()
            } else if (this.active === 2) {
              this.handleTwo()
            } else {
              this.handleThree()
            }
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }).catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    },
    getEnergyGeneralCategory () {
      this.TrendBrokenAreaOptions.xAxis = []
      let params = {
        dataType: this.timeType
      }
      if (this.timeType === 3) {
        params.dataStr = this.year.split('-').join('')
      } else if (this.timeType === 2) {
        params.dataStr = this.month.split('-').join('')
      } else if (this.timeType === 1) {
        params.dataStr = this.date.split('-').join('')
      }
      if (this.formInline.hierarchy.length) {
        params.areaId = this.formInline.hierarchy[this.formInline.hierarchy.length - 1]
      } else {
        params.areaId = -1
      }
      energyGeneralCategory(params)
        .then(res => {
          if (res.success) {
            let special = []
            let ac = []
            let turbo = []
            let lamp = []
            Object.keys(res.data).forEach(key => {
              this.TrendBrokenAreaOptions.xAxis.push(key)
              special.push(res.data[key]['特殊用电'])
              ac.push(res.data[key]['空调用电'])
              turbo.push(res.data[key]['动力用电'])
              lamp.push(res.data[key]['照明用电'])
            })
            this.TrendBrokenAreaOptions.series = [
              {name: '空调用电', type: 'line', data: ac, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(184, 36, 100, .5)'}, {offset: 1, color: 'rgba(184, 36, 100, .1)'}], global: false}}, itemStyle: {color: '#fac858'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true},
              {name: '照明插座', type: 'line', data: lamp, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(0, 189, 135, .5)'}, {offset: 1, color: 'rgba(0, 189, 135, .1)'}], global: false}}, itemStyle: {color: '#5470c6'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true},
              {name: '特殊用电', type: 'line', data: special, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(14, 164, 192, .5)'}, {offset: 1, color: 'rgba(14, 164, 192, .1)'}], global: false}}, itemStyle: {color: '#ee6666'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true},
              {name: '动力用电', type: 'line', data: turbo, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(119, 123, 133, .5)'}, {offset: 1, color: 'rgba(119, 123, 133, .1)'}], global: false}}, itemStyle: {color: '#73c0de'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true}
            ]
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }).catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    },
    getEnergyCategory () {
      let params = {
        projectCode: this.$store.state.projectCode,
        dataType: this.timeType,
        startTime: this.time.startTime,
        endTime: this.time.endTime
      }
      if (this.formInline.hierarchy.length) {
        params.areaId = this.formInline.hierarchy[this.formInline.hierarchy.length - 1]
      } else {
        params.areaId = -1
      }
      energyCategory(params)
        .then(res => {
          if (res.success) {
            let arr = []
            this.TrendPicOptions = []
            arr.push(
              res.data.special,
              res.data.ac,
              res.data.turbo,
              res.data.lamp
            )
            arr.forEach(v => {
              this.TrendPicOptions.push({
                value: v.categoryEnergy,
                name: v.categoryName
              })
            })
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }).catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    }
  },
  watch: {
    '$store.state.asideTowHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.height = newVal
        }
      }
    },
    '$store.state.formulaHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.formulaHeight = newVal
        }
      }
    },
    '$store.state.overTowHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.TrendAreaOptions.height = newVal
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
#EnergyTrend
  height 100%
  font-size 14px
.box-inner
  box-sizing border-box
.energy
  border 2px solid #303a5ecc
  box-shadow 3px 3px 6px 1px rgba(0, 0, 0, .2)
  -webkit-border-radius 10px
  -moz-border-radius 10px
  border-radius 10px
.boundary
  border 2px solid #303a5ecc
  box-shadow 3px 3px 6px 1px rgba(0, 0, 0, .2)
.chart-title
  border-bottom 2px solid #303a5ecc
.box-btn
  position absolute
  z-index 999
  right 0
  top 2%
.box-border
  font-size 14px
  box-sizing border-box
  padding 5px 10px
  border 1px solid #ccc
  border-radius 5px
</style>
