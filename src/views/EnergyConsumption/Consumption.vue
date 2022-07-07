<template>
    <div id="EnergyConsumption">
      <el-row class="ml-10" :style="{height: height}">
        <el-row class="ml-10 mt-10">
          <el-form :inline="true" :model="formInline" size="small">
            <el-form-item label="区域层级：">
              <el-cascader
                :show-all-levels="false"
                v-model="formInline.hierarchy"
                :options="areaOptions"
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
            <el-form-item  label="同比">
              <el-date-picker
                v-show="timeType === 1"
                key="dd"
                style="width:160px"
                v-model="secondDate"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="请选择">
              </el-date-picker>
              <el-date-picker
                v-show="timeType === 2"
                key="ee"
                style="width:160px"
                v-model="secondMonth"
                type="month"
                value-format="yyyy-MM"
                format="yyyy-MM"
                placeholder="请选择">
              </el-date-picker>
              <el-date-picker
                v-show="timeType === 3"
                key="ff"
                style="width:160px"
                v-model="secondYear"
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
        <el-col :span="9" :style="{height: formulaHeight}">
          <div class="box-inner ml-10" style="height: 28%">
            <el-col :md="24" class="boundary left-padding-right statistics" style="height: 100%">
              <el-row class="chart-title">
                <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">分析概览</el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-table
                    size="small"
                    :data="analysisOverviewList"
                    style="width: 100%">
                    <el-table-column
                      align="center"
                      label="类别"
                      prop="category">
                    </el-table-column>
                    <el-table-column
                      prop="value1"
                      align="center"
                      :label="time1">
                      <template slot="header" slot-scope="{}">
                        <span>{{ time1 }}</span>
                      </template>
                      <template slot-scope="scope">
                        <span>{{ scope.row.value1 + (scope.$index === 0 ? 'tce' : scope.$index === 1 ? 't' : scope.$index === 2 ? 'kw.h' : '') }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="value2"
                      align="center"
                      :label="time2">
                      <template slot="header" slot-scope="{}">
                        <span>{{ time2 }}</span>
                      </template>
                      <template slot-scope="scope">
                        <span>{{ scope.row.value2 + (scope.$index === 0 ? 'tce' : scope.$index === 1 ? 't' : scope.$index === 2 ? 'kw.h' : '') }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center"
                      label="同比">
                      <template slot-scope="scope">
                        <span :class="(scope.row.value1 > scope.row.value2) ? 'iconfont icon-web-icon-1 c-danger' : 'iconfont icon-web-icon- c-success'">{{ (Math.abs(1 - ( (scope.row.value1 === 0 && scope.row.value2 === 0) ? 1 : (scope.row.value1 === 0 || scope.row.value2 === 0) ? 0 : (scope.row.value1 / scope.row.value2) )) * 100).toFixed(2) }}%</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-col>
          </div>
          <div class="box-inner ml-10 mt-20" style="height: 33%">
            <el-col :md="24" class="boundary" style="height: 100%;">
              <el-row class="chart-title">
                <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">分项同比</el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-table
                    size="small"
                    :data="categorySameCompareList"
                    style="width: 100%">
                    <el-table-column
                      align="center"
                      label="类别"
                      prop="categoryName">
                    </el-table-column>
                    <el-table-column
                      align="center">
                      <template slot="header" slot-scope="{}">
                        <span>{{ time1 }}</span>
                      </template>
                      <template slot-scope="scope">
                        <span>{{ scope.row.value1 + 'kW.h' }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      align="center">
                      <template slot="header" slot-scope="{}">
                        <span>{{ time2 }}</span>
                      </template>
                      <template slot-scope="scope">
                        <span>{{ scope.row.value2 + 'kW.h' }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="sameCompare"
                      align="center"
                      label="同比">
                      <template slot-scope="scope">
                        <span :class="(scope.row.value1 > scope.row.value2) ? 'iconfont icon-web-icon-1 c-danger' : 'iconfont icon-web-icon- c-success'">{{ (Math.abs(1 - ( (scope.row.value1 === 0 && scope.row.value2 === 0) ? 1 : (scope.row.value1 === 0 || scope.row.value2 === 0) ? 0 : (scope.row.value1 / scope.row.value2) )) * 100).toFixed(2) }}%</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-col>
          </div>
        </el-col>
        <el-col :span="15" :style="{height: formulaHeight}">
          <div class="box-inner ml-20" style="height: 63.7%">
            <el-col :md="24" class="boundary left-padding-right statistics" style="height: 100%">
              <el-row class="chart-title">
                <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">同步分析</el-col>
              </el-row>
              <el-row>
                <el-row :span="24">
                  <!-- <el-button @click="handleTotal" type="primary" class="box-btn" :plain="lineAreaType !== 'all'" style="right: 405px" size="small">总量</el-button> -->
                  <el-button @click="handleItemOne" type="primary" class="box-btn" :plain="lineAreaType !== 'item'" style="right: 290px" size="small">空调用电</el-button>
                  <el-button @click="handleItemTow" type="primary" class="box-btn" :plain="lineAreaType !== 'all'" style="right: 200px" size="small">照明用电</el-button>
                  <el-button @click="handleItemThr" type="primary" class="box-btn" :plain="lineAreaType !== 'item'" style="right: 110px" size="small">特殊用电</el-button>
                  <el-button @click="handleItemFour" type="primary" class="box-btn" :plain="lineAreaType !== 'all'" style="right: 20px" size="small">动力用电</el-button>
                  <consum-bar :options="BarOptions"></consum-bar>
                </el-row>
              </el-row>
            </el-col>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
import { seekAreaListTreeByProject, sameCompare, energyGeneral } from '@/api/api'
import ConsumBar from '../Common/ConsumBar'
export default {
  components: {ConsumBar},
  data () {
    return {
      height: this.$store.state.asideTowHeight,
      formulaHeight: this.$store.state.formulaHeight,
      formInline: {
        hierarchy: [],
        area: ''
      },
      areaOptions: [],
      categorySameCompareList: [
        {
          categoryId: 1,
          categoryName: '空调用电',
          value1: 0,
          value2: 0,
          sameCompare: 0
        },
        {
          categoryId: 2,
          categoryName: '照明用电',
          value1: 0,
          value2: 0,
          sameCompare: 0
        },
        {
          categoryId: 3,
          categoryName: '特殊用电',
          value1: 0,
          value2: 0,
          sameCompare: 0
        },
        {
          categoryId: 4,
          categoryName: '动力用电',
          value1: 0,
          value2: 0,
          sameCompare: 0
        }
      ], // 分项同比数据
      date: this.$func.getFuTime(new Date(), 'date'),
      month: this.$func.getFuTime(new Date(), 'month'),
      year: this.$func.getFuTime(new Date(), 'year'),
      secondDate: this.$func.getFuTime(new Date(), 'date'),
      secondMonth: this.$func.getFuTime(new Date(), 'month'),
      secondYear: this.$func.getFuTime(new Date(), 'year'),
      time1: this.date,
      time2: this.secondDate,
      timeType: 3,
      timeOne: {
        startTime: '',
        endTime: ''
      },
      timeSecond: {
        startTime: '',
        endTime: ''
      },
      lastMonth: '',
      analysisOverviewList: [{
        category: '综合能耗',
        value1: 0,
        value2: 0
      }, {
        category: '综合碳排放',
        value1: 0,
        value2: 0
      }, {
        category: '总用电量',
        value1: 0,
        value2: 0
      }],
      barxAxis: [],
      category1Data: [],
      category2Data: [],
      category3Data: [],
      category4Data: [],
      category5Data: [],
      category6Data: [],
      category7Data: [],
      category8Data: [],
      BarOptions: {
        legendStatus: true,
        xAxisType: '',
        yAxisType: '',
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: '单位/kWh'
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: '{b}<br/>' + '{c0}<br/>' + '{c1}'
        }
      }
    }
  },
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.handleSeekAreaListTree()
      if (this.timeType === 1) {
        this.time1 = this.date
        this.time2 = this.secondDate
      }
      if (this.timeType === 2) {
        this.time1 = this.month
        this.time2 = this.secondMonth
      }
      if (this.timeType === 3) {
        this.time1 = this.year
        this.time2 = this.secondYear
      }
      // let bardata = [48, 174.05, 4328.288, 0, 1.17, 289.74, 141.4, 184.33, 1448.233, 4.208, 2.768, 76.304]
      this.BarOptions.series = []
      this.BarOptions.xAxis = []
      // this.BarOptions.xAxis = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      // this.BarOptions.series.push({name: '2021', type: 'bar', barMaxWidth: '30', data: bardata, itemStyle: {emphasis: {barBorderRadius: 5}, normal: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(0, 189, 135, .8)'}, {offset: 1, color: 'rgba(0, 189, 135, .2)'}], globalCoord: false}}}})
      // this.BarOptions.series.push({name: '2020', type: 'bar', barMaxWidth: '30', data: bardata, itemStyle: {emphasis: {barBorderRadius: 5}, normal: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(14, 164, 192, .8)'}, {offset: 1, color: 'rgba(14, 164, 192, .2)'}], globalCoord: false}}}})
    },
    handleSeekAreaListTree () {
      seekAreaListTreeByProject()
        .then(res => {
          if (res.success) {
            if (res.data.length > 0) {
              this.areaOptions = res.data
              this.formInline.hierarchy = []
              this.formInline.hierarchy.push(res.data[0].id)
            }
            // this.queryEnergyContrast()
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
    handlesameCompare () {
      if (this.timeType === 1) {
        this.BarOptions.xAxis = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
      }
      if (this.timeType === 2) {
        this.BarOptions.xAxis = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
      }
      if (this.timeType === 3) {
        this.BarOptions.xAxis = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
      }
      let params = {
        dateType: this.timeType,
        startTime: this.timeOne.startTime,
        endTime: this.timeOne.endTime,
        areaId: this.formInline.hierarchy.length === 0 ? null : this.formInline.hierarchy[this.formInline.hierarchy.length - 1]
      }
      sameCompare(params)
        .then(res => {
          if (res.success) {
            // 遍历分项数据
            if (res.data.sameCompareMapList != null) {
              res.data.sameCompareMapList.forEach(sameCompareMap => {
                this.categorySameCompareList.filter((item, index) => {
                  if (sameCompareMap.categoryId === item.categoryId) {
                    item.value1 = sameCompareMap.power
                  }
                })
              })
            }
            if (res.data.categoryOfTimeMapList == null) {
              return
            }
            res.data.categoryOfTimeMapList.forEach(categoryOfTimeMap => {
              let data = null
              if (this.timeType === 1) {
                data = Array(24).fill(0)
              }
              if (this.timeType === 2) {
                data = Array(31).fill(0)
              }
              if (this.timeType === 3) {
                data = Array(12).fill(0)
              }
              if (categoryOfTimeMap.categoryId === 1 && categoryOfTimeMap.powerOfTimeList != null) {
                categoryOfTimeMap.powerOfTimeList.forEach(powerOfTime => {
                  this.BarOptions.xAxis.filter((item, index) => {
                    if (powerOfTime.time === item) {
                      data[index] = powerOfTime.number
                    }
                  })
                })
                this.category1Data = data
              }
              if (categoryOfTimeMap.categoryId === 2 && categoryOfTimeMap.powerOfTimeList != null) {
                categoryOfTimeMap.powerOfTimeList.forEach(powerOfTime => {
                  this.BarOptions.xAxis.filter((item, index) => {
                    if (powerOfTime.time === item) {
                      data[index] = powerOfTime.number
                    }
                  })
                })
                this.category2Data = data
              }
              if (categoryOfTimeMap.categoryId === 3 && categoryOfTimeMap.powerOfTimeList != null) {
                categoryOfTimeMap.powerOfTimeList.forEach(powerOfTime => {
                  this.BarOptions.xAxis.filter((item, index) => {
                    if (powerOfTime.time === item) {
                      data[index] = powerOfTime.number
                    }
                  })
                })
                this.category3Data = data
              }
              if (categoryOfTimeMap.categoryId === 4 && categoryOfTimeMap.powerOfTimeList != null) {
                categoryOfTimeMap.powerOfTimeList.forEach(powerOfTime => {
                  this.BarOptions.xAxis.filter((item, index) => {
                    if (powerOfTime.time === item) {
                      data[index] = powerOfTime.number
                    }
                  })
                })
                this.category4Data = data
              }
            })
            // this.queryEnergyContrast()
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
      // 第二次遍历
      params.startTime = this.timeSecond.startTime
      params.endTime = this.timeSecond.endTime
      sameCompare(params)
        .then(res => {
          if (res.success) {
            // 遍历分项数据
            if (res.data.sameCompareMapList != null) {
              res.data.sameCompareMapList.forEach(sameCompareMap => {
                this.categorySameCompareList.filter((item, index) => {
                  if (sameCompareMap.categoryId === item.categoryId) {
                    item.value2 = sameCompareMap.power
                  }
                })
              })
            }
            if (res.data.categoryOfTimeMapList == null) {
              return
            }
            res.data.categoryOfTimeMapList.forEach(categoryOfTimeMap => {
              let data = null
              if (this.timeType === 1) {
                data = Array(24).fill(0)
              }
              if (this.timeType === 2) {
                data = Array(31).fill(0)
              }
              if (this.timeType === 3) {
                data = Array(12).fill(0)
              }
              if (categoryOfTimeMap.categoryId === 1 && categoryOfTimeMap.powerOfTimeList != null) {
                categoryOfTimeMap.powerOfTimeList.forEach(powerOfTime => {
                  this.BarOptions.xAxis.filter((item, index) => {
                    if (powerOfTime.time === item) {
                      data[index] = powerOfTime.number
                    }
                  })
                })
                this.category5Data = data
              }
              if (categoryOfTimeMap.categoryId === 2 && categoryOfTimeMap.powerOfTimeList != null) {
                categoryOfTimeMap.powerOfTimeList.forEach(powerOfTime => {
                  this.BarOptions.xAxis.filter((item, index) => {
                    if (powerOfTime.time === item) {
                      data[index] = powerOfTime.number
                    }
                  })
                })
                this.category6Data = data
              }
              if (categoryOfTimeMap.categoryId === 3 && categoryOfTimeMap.powerOfTimeList != null) {
                categoryOfTimeMap.powerOfTimeList.forEach(powerOfTime => {
                  this.BarOptions.xAxis.filter((item, index) => {
                    if (powerOfTime.time === item) {
                      data[index] = powerOfTime.number
                    }
                  })
                })
                this.category7Data = data
              }
              if (categoryOfTimeMap.categoryId === 4 && categoryOfTimeMap.powerOfTimeList != null) {
                categoryOfTimeMap.powerOfTimeList.forEach(powerOfTime => {
                  this.BarOptions.xAxis.filter((item, index) => {
                    if (powerOfTime.time === item) {
                      data[index] = powerOfTime.number
                    }
                  })
                })
                this.category8Data = data
              }
            })
            // this.queryEnergyContrast()
            this.handleItemOne()
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
    getEnergyGeneral () {
      let params = {}
      if (this.formInline.hierarchy.length) {
        params.areaId = this.formInline.hierarchy[this.formInline.hierarchy.length - 1]
      } else {
        params.areaId = -1
      }
      params.dataType = this.timeType
      params.startTime = this.timeOne.startTime
      params.endTime = this.timeOne.endTime
      energyGeneral(params)
        .then(res => {
          if (res.success) {
            this.analysisOverviewList[0].value1 = res.data.totalEnergy
            this.analysisOverviewList[1].value1 = res.data.totalCarbon
            this.analysisOverviewList[2].value1 = res.data.totalElectric
            let params2 = {
            }
            if (this.formInline.hierarchy.length) {
              params2.areaId = this.formInline.hierarchy[this.formInline.hierarchy.length - 1]
            } else {
              params2.areaId = -1
            }
            params2.dataType = this.timeType
            params2.startTime = this.timeSecond.startTime
            params2.endTime = this.timeSecond.endTime
            energyGeneral(params2)
              .then(res => {
                if (res.success) {
                  this.analysisOverviewList[0].value2 = res.data.totalEnergy
                  this.analysisOverviewList[1].value2 = res.data.totalCarbon
                  this.analysisOverviewList[2].value2 = res.data.totalElectric
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
    handleItemOne () {
      this.BarOptions.series = []
      this.BarOptions.series.push({name: this.time1, type: 'bar', barMaxWidth: '30', data: this.category1Data, itemStyle: {emphasis: {barBorderRadius: 5}, normal: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(0, 189, 135, .8)'}, {offset: 1, color: 'rgba(0, 189, 135, .2)'}], globalCoord: false}}}})
      this.BarOptions.series.push({name: this.time2, type: 'bar', barMaxWidth: '30', data: this.category5Data, itemStyle: {emphasis: {barBorderRadius: 5}, normal: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(14, 164, 192, .8)'}, {offset: 1, color: 'rgba(14, 164, 192, .2)'}], globalCoord: false}}}})
    },
    handleItemTow () {
      this.BarOptions.series = []
      this.BarOptions.series.push({name: this.time1, type: 'bar', barMaxWidth: '30', data: this.category2Data, itemStyle: {emphasis: {barBorderRadius: 5}, normal: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(0, 189, 135, .8)'}, {offset: 1, color: 'rgba(0, 189, 135, .2)'}], globalCoord: false}}}})
      this.BarOptions.series.push({name: this.time2, type: 'bar', barMaxWidth: '30', data: this.category6Data, itemStyle: {emphasis: {barBorderRadius: 5}, normal: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(14, 164, 192, .8)'}, {offset: 1, color: 'rgba(14, 164, 192, .2)'}], globalCoord: false}}}})
    },
    handleItemThr () {
      this.BarOptions.series = []
      this.BarOptions.series.push({name: this.time1, type: 'bar', barMaxWidth: '30', data: this.category3Data, itemStyle: {emphasis: {barBorderRadius: 5}, normal: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(0, 189, 135, .8)'}, {offset: 1, color: 'rgba(0, 189, 135, .2)'}], globalCoord: false}}}})
      this.BarOptions.series.push({name: this.time2, type: 'bar', barMaxWidth: '30', data: this.category7Data, itemStyle: {emphasis: {barBorderRadius: 5}, normal: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(14, 164, 192, .8)'}, {offset: 1, color: 'rgba(14, 164, 192, .2)'}], globalCoord: false}}}})
    },
    handleItemFour () {
      this.BarOptions.series = []
      this.BarOptions.series.push({name: this.time1, type: 'bar', barMaxWidth: '30', data: this.category4Data, itemStyle: {emphasis: {barBorderRadius: 5}, normal: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(0, 189, 135, .8)'}, {offset: 1, color: 'rgba(0, 189, 135, .2)'}], globalCoord: false}}}})
      this.BarOptions.series.push({name: this.time2, type: 'bar', barMaxWidth: '30', data: this.category8Data, itemStyle: {emphasis: {barBorderRadius: 5}, normal: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(14, 164, 192, .8)'}, {offset: 1, color: 'rgba(14, 164, 192, .2)'}], globalCoord: false}}}})
    },
    onSubmit () {
      if (this.timeType === 1) {
        this.time1 = this.date
        this.time2 = this.secondDate
      }
      if (this.timeType === 2) {
        this.time1 = this.month
        this.time2 = this.secondMonth
      }
      if (this.timeType === 3) {
        this.time1 = this.year
        this.time2 = this.secondYear
      }
      if (this.timeType === 1) {
        this.timeOne = {
          startTime: this.date.split('-').join('') + '00',
          endTime: this.date.split('-').join('') + '23'
        }
        this.timeSecond = {
          startTime: this.secondDate.split('-').join('') + '00',
          endTime: this.secondDate.split('-').join('') + '23'
        }
      }
      if (this.timeType === 2) {
        let month = this.month.split('-').join('').substring(this.month.split('-').join('').length - 2, this.month.split('-').join('').length)
        if (['04', '06', '09', '11'].indexOf(month) !== -1) {
          this.timeOne = {
            startTime: this.month.split('-').join('') + '01',
            endTime: this.month.split('-').join('') + '30'
          }
          this.timeSecond = {
            startTime: this.secondMonth.split('-').join('') + '01',
            endTime: this.secondMonth.split('-').join('') + '30'
          }
        } else if (['01', '03', '05', '07', '08', '10', '12'].indexOf(month) !== -1) {
          this.timeOne = {
            startTime: this.month.split('-').join('') + '01',
            endTime: this.month.split('-').join('') + '31'
          }
          this.timeSecond = {
            startTime: this.secondMonth.split('-').join('') + '01',
            endTime: this.secondMonth.split('-').join('') + '31'
          }
        } else {
          let years = this.month.split('-').join('').substring(0, 4)
          if ((years % 4 === 0 && years % 100 !== 0) || years % 400 === 0) {
            this.timeOne = {
              startTime: this.month.split('-').join('') + '01',
              endTime: this.month.split('-').join('') + '29'
            }
            this.timeSecond = {
              startTime: this.secondMonth.split('-').join('') + '01',
              endTime: this.secondMonth.split('-').join('') + '29'
            }
          } else {
            this.timeOne = {
              startTime: this.month.split('-').join('') + '01',
              endTime: this.month.split('-').join('') + '28'
            }
            this.timeSecond = {
              startTime: this.secondMonth.split('-').join('') + '01',
              endTime: this.secondMonth.split('-').join('') + '28'
            }
          }
        }
      }
      if (this.timeType === 3) {
        this.timeOne = {
          startTime: this.year + '01',
          endTime: this.year + '12'
        }
        this.timeSecond = {
          startTime: this.secondYear + '01',
          endTime: this.secondYear + '12'
        }
      }
      this.handlesameCompare()
      this.getEnergyGeneral()
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
    'time1': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.time1 = newVal
        }
      }
    },
    'time2': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.time2 = newVal
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
#EnergyConsumption
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
</style>
