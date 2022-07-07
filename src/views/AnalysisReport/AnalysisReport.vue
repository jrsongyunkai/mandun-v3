<template>
  <div id="AnalysisReport">
    <el-row>
      <el-col :span="24"  class="mt-10">
        <el-form :inline="true" size="small" class="demo-form-inline tr" :model="formInline">
          <el-form-item>
            <div class="block">
              <el-button size="small" :type="datePicker === 'month' ? 'success' : 'info'" circle @click="handleDateLinePicker('month')">{{ $t('main.month') }}</el-button>
              <el-button size="small" :type="datePicker === 'quarter' ? 'success' : 'info'" circle @click="handleDateLinePicker('quarter')">{{ $t('main.quarter') }}</el-button>
              <el-button size="small" :type="datePicker === 'year' ? 'success' : 'info'" circle @click="handleDateLinePicker('year')">{{ $t('main.year') }}</el-button>
            </div>
          </el-form-item>
          <el-form-item>
              <el-date-picker
                style="width: 120px"
                :editable="false"
                :clearable="false"
                v-model="analysisDate"
                :type="datePicker === 'month' ? 'month' : 'year'"
                :placeholder="datePicker === 'month' ? $t('btns.select') + $t('main.month') : $t('btns.select') + $t('main.year')">
              </el-date-picker>
          </el-form-item>
          <el-form-item v-show="datePicker === 'quarter'">
            <el-select style="width: 120px" v-model="quarterVal" :placeholder="$t('placeholder.pleaseChoose')">
              <el-option
                v-for="item in quarterOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formInline.mac" :placeholder="$t('placeholder.enterDeviceNo')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">{{ $t('btns.query') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div :style="analysispieHeight" v-el_scrollBar>
    <el-row :style="powerTableHeight" v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, .2)" :element-loading-text="$t('message.loading')">
      <el-col :span="12">
        <custom-pie :options="typeAlarmCondition"></custom-pie>
      </el-col>
      <el-col :span="12">
        <custom-pie :options="typeWarnCondition"></custom-pie>
      </el-col>
      <el-col :span="12">
        <bar-charts :options="inspectionOptions"></bar-charts>
      </el-col>
      <el-col :span="12">
        <bar-charts :options="maintenanceOptions"></bar-charts>
      </el-col>
      <el-col :span="24">
        <line-charts :options="energyConsumptionOptions"></line-charts>
      </el-col>
    </el-row>
    </div>
  </div>
</template>

<script>
import CustomPie from '../Common/CustomPie'
import BarCharts from '../Common/Bars'
import LineCharts from '../Common/Line'
import { analysisReportAlarm, analysisReportMaintenance, analysisReportPower, analysisReportInspection } from '@/api/api'
export default {
  data () {
    return {
      analysispieHeight: {
        position: 'relative',
        height: this.$store.state.analysispieHeight
      },
      formInline: [],
      datePicker: 'month',
      analysisDate: new Date(),
      quarterVal: '',
      quarterOptions: [{
        value: 1,
        label: this.$t('echarts.firstQuarter')
      }, {
        value: 2,
        label: this.$t('echarts.secondQuarter')
      }, {
        value: 3,
        label: this.$t('echarts.thirdQuarter')
      }, {
        value: 4,
        label: this.$t('echarts.fourthQuarter')
      }],
      typeAlarmCondition: {
        data: [],
        title: ''
      },
      typeWarnCondition: {
        data: [],
        title: ''
      },
      inspectionOptions: {
        legendStatus: true,
        xAxisType: '',
        yAxisType: '',
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('echarts.equipmentPatrolInspection')
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: '{b}<br/>' + this.$t('echarts.equipmentPatrolInspection') + '：{c0}'
        }
      },
      maintenanceOptions: {
        legendStatus: true,
        xAxisType: '',
        yAxisType: '',
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('echarts.equipmentMaintenanceHandling')
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter: '{b}<br/>' + this.$t('echarts.equipmentMaintenanceHandling') + '：{c0}'
        }
      },
      energyConsumptionOptions: {
        series: [],
        xAxis: [],
        title: {
          show: true,
          text: this.$t('echarts.energyConsumptionUsage')
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
      this.queryAnalysisReportAlarm()
    },
    onSubmit () {
      this.queryAnalysisReportAlarm()
    },
    queryAnalysisReportAlarm () {
      let params = {
        projectCode: this.$store.state.projectCode,
        mac: this.formInline.mac
      }
      if (this.datePicker === 'month') {
        params.startTime = this.$func.getYearMonth(this.analysisDate, 'all')
        params.endTime = this.$func.getYearMonth(this.analysisDate, 'all')
      } else if (this.datePicker === 'quarter') {
        if (this.quarterVal === 1) {
          params.startTime = this.$func.getYearMonth(this.analysisDate, 'year') + '-01'
          params.endTime = this.$func.getYearMonth(this.analysisDate, 'year') + '-03'
        } else if (this.quarterVal === 2) {
          params.startTime = this.$func.getYearMonth(this.analysisDate, 'year') + '-04'
          params.endTime = this.$func.getYearMonth(this.analysisDate, 'year') + '-06'
        } else if (this.quarterVal === 3) {
          params.startTime = this.$func.getYearMonth(this.analysisDate, 'year') + '-07'
          params.endTime = this.$func.getYearMonth(this.analysisDate, 'year') + '-09'
        } else if (this.quarterVal === 4) {
          params.startTime = this.$func.getYearMonth(this.analysisDate, 'year') + '-10'
          params.endTime = this.$func.getYearMonth(this.analysisDate, 'year') + '-12'
        }
      } else if (this.datePicker === 'year') {
        params.startTime = this.$func.getYearMonth(this.analysisDate, 'year') + '-01'
        params.endTime = this.$func.getYearMonth(this.analysisDate, 'year') + '-12'
      }
      this.handleAnalysisReportAlarm(params)
      this.handleAnalysisReportMaintenance(params)
      this.handleAnalysisReportPower(params)
      this.handleAnalysisReportInspection(params)
    },
    handleAnalysisReportAlarm (params) {
      this.typeAlarmCondition.title = this.$t('main.safe') + this.$t('home.alarm') + this.$t('echarts.situation')
      this.typeWarnCondition.title = this.$t('main.safe') + this.$t('home.warning') + this.$t('echarts.situation')
      this.typeAlarmCondition.data = []
      this.typeWarnCondition.data = []
      analysisReportAlarm(params)
        .then(res => {
          if (res.success) {
            res.data.alarmList.forEach(item => { this.typeAlarmCondition.data.push({value: item.number, name: item.info}) })
            this.typeAlarmCondition.data.sort((a, b) => { return a.value - b.value })
            res.data.warnList.forEach(item => { this.typeWarnCondition.data.push({value: item.number, name: item.info}) })
            this.typeWarnCondition.data.sort((a, b) => { return a.value - b.value })
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
        .catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    },
    handleAnalysisReportMaintenance (params) {
      let arr = Array(31).fill(0)
      this.maintenanceOptions.series = []
      this.maintenanceOptions.xAxis = []
      analysisReportMaintenance(params)
        .then(res => {
          if (res.success) {
            if (this.datePicker === 'month') {
              if (['04', '06', '09', '11'].indexOf(this.$func.getYearMonth(this.analysisDate, 'month')) !== -1) {
                this.maintenanceOptions.xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
              } else if (['01', '03', '05', '07', '08', '10', '12'].indexOf(this.$func.getYearMonth(this.analysisDate, 'month')) !== -1) {
                this.maintenanceOptions.xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
              } else {
                if ((this.analysisDate.getFullYear() % 4 === 0 && this.analysisDate.getFullYear() % 100 !== 0) || this.analysisDate.getFullYear() % 400 === 0) {
                  this.maintenanceOptions.xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
                } else {
                  this.maintenanceOptions.xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
                }
              }
            } else if (this.datePicker === 'quarter') {
              if (this.quarterVal === 1) {
                this.maintenanceOptions.xAxis = [1, 2, 3]
              } else if (this.quarterVal === 2) {
                this.maintenanceOptions.xAxis = [4, 5, 6]
              } else if (this.quarterVal === 3) {
                this.maintenanceOptions.xAxis = [7, 8, 9]
              } else if (this.quarterVal === 4) {
                this.maintenanceOptions.xAxis = [10, 11, 12]
              }
            } else if (this.datePicker === 'year') {
              this.maintenanceOptions.xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            }
            res.data.forEach(number => {
              this.maintenanceOptions.xAxis.filter((item, index) => {
                if (number.time === item) {
                  arr[index] = number.number
                }
              })
            })
            this.maintenanceOptions.series.push({name: this.$t('echarts.equipmentMaintenanceHandling'), type: 'bar', barMaxWidth: '30', data: arr, itemStyle: {normal: {color: '#08BEC1', label: {show: true, position: 'top'}}}})
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
        .catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    },
    handleAnalysisReportPower (params) {
      let arr = Array(31).fill(0)
      this.energyConsumptionOptions.series = []
      this.energyConsumptionOptions.xAxis = []
      analysisReportPower(params)
        .then(res => {
          if (res.success) {
            if (this.datePicker === 'month') {
              if (['04', '06', '09', '11'].indexOf(this.$func.getYearMonth(this.analysisDate, 'month')) !== -1) {
                this.energyConsumptionOptions.xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
              } else if (['01', '03', '05', '07', '08', '10', '12'].indexOf(this.$func.getYearMonth(this.analysisDate, 'month')) !== -1) {
                this.energyConsumptionOptions.xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
              } else {
                if ((this.analysisDate.getFullYear() % 4 === 0 && this.analysisDate.getFullYear() % 100 !== 0) || this.analysisDate.getFullYear() % 400 === 0) {
                  this.energyConsumptionOptions.xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
                } else {
                  this.energyConsumptionOptions.xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
                }
              }
            } else if (this.datePicker === 'quarter') {
              if (this.quarterVal === 1) {
                this.energyConsumptionOptions.xAxis = [1, 2, 3]
              } else if (this.quarterVal === 2) {
                this.energyConsumptionOptions.xAxis = [4, 5, 6]
              } else if (this.quarterVal === 3) {
                this.energyConsumptionOptions.xAxis = [7, 8, 9]
              } else if (this.quarterVal === 4) {
                this.energyConsumptionOptions.xAxis = [10, 11, 12]
              }
            } else if (this.datePicker === 'year') {
              this.energyConsumptionOptions.xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            }
            res.data.forEach(number => {
              this.energyConsumptionOptions.xAxis.filter((item, index) => {
                if (number.time === item) {
                  arr[index] = number.number
                }
              })
            })
            this.energyConsumptionOptions.series.push({name: this.$t('echarts.energyConsumptionUsage'), type: 'line', smooth: true, data: arr, itemStyle: {normal: {color: '#B8A5DD'}}, symbol: 'emptyCircle', areaStyle: {}})
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
        .catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    },
    handleAnalysisReportInspection (params) {
      let arr = Array(31).fill(0)
      this.inspectionOptions.series = []
      this.inspectionOptions.xAxis = []
      analysisReportInspection(params)
        .then(res => {
          if (res.success) {
            if (this.datePicker === 'month') {
              if (['04', '06', '09', '11'].indexOf(this.$func.getYearMonth(this.analysisDate, 'month')) !== -1) {
                this.inspectionOptions.xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
              } else if (['01', '03', '05', '07', '08', '10', '12'].indexOf(this.$func.getYearMonth(this.analysisDate, 'month')) !== -1) {
                this.inspectionOptions.xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
              } else {
                if ((this.analysisDate.getFullYear() % 4 === 0 && this.analysisDate.getFullYear() % 100 !== 0) || this.analysisDate.getFullYear() % 400 === 0) {
                  this.inspectionOptions.xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
                } else {
                  this.inspectionOptions.xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
                }
              }
            } else if (this.datePicker === 'quarter') {
              if (this.quarterVal === 1) {
                this.inspectionOptions.xAxis = [1, 2, 3]
              } else if (this.quarterVal === 2) {
                this.inspectionOptions.xAxis = [4, 5, 6]
              } else if (this.quarterVal === 3) {
                this.inspectionOptions.xAxis = [7, 8, 9]
              } else if (this.quarterVal === 4) {
                this.inspectionOptions.xAxis = [10, 11, 12]
              }
            } else if (this.datePicker === 'year') {
              this.inspectionOptions.xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            }
            res.data.forEach(number => {
              this.inspectionOptions.xAxis.filter((item, index) => {
                if (number.time === item) {
                  arr[index] = number.number
                }
              })
            })
            this.inspectionOptions.series.push({name: this.$t('echarts.equipmentPatrolInspection'), type: 'bar', barMaxWidth: '30', data: arr, itemStyle: {normal: {color: '#08BEC1', label: {show: true, position: 'top'}}}})
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
        .catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    },
    handleDateLinePicker (val) {
      this.analysisDate = new Date()
      if (val === 'quarter') {
        if (['01', '02', '03'].indexOf(this.$func.getYearMonth(this.analysisDate, 'month')) !== -1) {
          this.quarterVal = 1
        } else if (['04', '05', '06'].indexOf(this.$func.getYearMonth(this.analysisDate, 'month')) !== -1) {
          this.quarterVal = 2
        } else if (['07', '08', '09'].indexOf(this.$func.getYearMonth(this.analysisDate, 'month')) !== -1) {
          this.quarterVal = 3
        } else if (['10', '11', '12'].indexOf(this.$func.getYearMonth(this.analysisDate, 'month')) !== -1) {
          this.quarterVal = 4
        }
      }
      this.datePicker = val
      this.queryAnalysisReportAlarm()
    }
  },
  watch: {
    '$store.state.analysispieHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.analysispieHeight.height = newVal
        }
      }
    },
    '$store.state.projectCode': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.init()
        }
      }
    }
  },
  components: {
    BarCharts,
    CustomPie,
    LineCharts
  }
}
</script>

<style lang="stylus" scoped>
</style>
