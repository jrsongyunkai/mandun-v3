<template>
    <div id="EnergyFormula">
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
        <el-col :span="6" :style="{height: formulaHeight}">
          <div class="box-inner" style="height: 100%">
            <el-col :md="24" class="boundary left-padding-right" style="height: 100%;">
              <el-row class="chart-title">
                <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">区域排名</el-col>
              </el-row>
              <el-row>
                <el-table
                  :data="tableData"
                  @row-click="rowClick"
                  highlight-current-row
                  style="width: 100%">
                  <el-table-column
                    align="center"
                    label="排名"
                    type="index"
                    :index="indexMethod">
                  </el-table-column>
                  <el-table-column
                    prop="areaName"
                    align="center"
                    label="区域层级">
                  </el-table-column>
                  <el-table-column
                    align="center"
                    label="和去年同比">
                    <template slot-scope="scope">
                      <span :class="scope.row.rate > 0 ? 'iconfont icon-web-icon-1 c-success' : 'iconfont icon-web-icon- c-danger'">{{ Math.abs(scope.row.rate) }}%</span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
            </el-col>
          </div>
        </el-col>
        <el-col :span="18" :style="{height: formulaHeight}">
          <div class="box-inner ml-20" style="height: 50%">
            <el-col :md="24" class="boundary left-padding-right statistics" style="height: 100%">
              <el-row class="chart-title">
                <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">信息趋势</el-col>
              </el-row>
              <el-row>
                <formula-line-bar :options="formulaAreaOptions"></formula-line-bar>
              </el-row>
            </el-col>
          </div>
          <div class="box-inner ml-20 mt-10" style="height: 30%">
            <el-col :md="24" class="boundary" style="height: 100%;">
              <el-row class="chart-title">
                <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">基本信息</el-col>
              </el-row>
              <el-row>
                <el-col :span="6" :offset="2" class="mt-30 mb-20">
                  <el-col :span="11">公示期间</el-col>
                  <el-col :span="12">{{base_info.year}}</el-col>
                </el-col>
                <el-col :span="8" :offset="0" class="mt-30 mb-20">
                  <el-col :span="10">公示期单位面积能耗</el-col>
                  <el-col :span="12">{{base_info.energyArea}}kW.h/m²</el-col>
                </el-col>
                <el-col :span="8" :offset="0" class="mt-30 mb-20">
                  <el-col :span="10">公示期总能耗</el-col>
                  <el-col :span="12">{{base_info.energyTotal}}kW.h</el-col>
                </el-col>
                <el-col :span="6" :offset="2" class="mt-20 mb-20">
                  <el-col :span="11">区域名称</el-col>
                  <el-col :span="12">{{base_info.areaName}}</el-col>
                </el-col>
                <el-col :span="8" :offset="0" class="mt-20 mb-20">
                  <el-col :span="10">公示期月计划能耗</el-col>
                  <el-col :span="12">{{base_info.energyPlanArea}}kW.h</el-col>
                </el-col>
                <el-col :span="8" :offset="0" class="mt-20 mb-20">
                  <el-col :span="10">计划能耗状况占比</el-col>
                  <el-col :span="12">{{base_info.energyRate}}<span class="ml-20 success">{{ base_info.cstatus==0?'正常':'不正常' }}</span></el-col>
                </el-col>
                <el-col :span="6" :offset="2" class="mt-20 mb-20">
                  <el-col :span="11">总面积</el-col>
                  <el-col :span="12">{{base_info.area}}m²</el-col>
                </el-col>
              </el-row>
            </el-col>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
import formulaLineBar from '../Common/FormulaLineBar'
import { seekAreaListTreeByProject, energyAreaBaseInfo, energyAreaOrder, energyGeneralArea } from '@/api/api'
export default {
  components: {formulaLineBar},
  data () {
    return {
      height: this.$store.state.asideTowHeight,
      formulaHeight: this.$store.state.formulaHeight,
      formInline: {
        hierarchy: []
      },
      options: [],
      date: this.$func.getFuTime(new Date(), 'date'),
      month: this.$func.getFuTime(new Date(), 'month'),
      year: this.$func.getFuTime(new Date(), 'year'),
      timeType: 3,
      time: {
        startTime: '',
        endTime: ''
      },
      tableData: [],
      formulaAreaOptions: {
        title: {
          show: true,
          text: 'kwh'
        },
        xAxis: [],
        barSeries: []
      },
      base_info: {
        year: '',
        energyArea: '',
        energyTotal: '',
        areaName: '',
        energyPlanArea: '',
        energyRate: '',
        cstatus: '',
        area: ''
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
    getAreaBaseInfo () {
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
      energyAreaBaseInfo(params)
        .then(res => {
          if (res.success) {
            this.base_info.area = res.data.area
            this.base_info.areaName = res.data.areaName
            this.base_info.cstatus = res.data.cstatus
            this.base_info.energyArea = res.data.energyArea
            this.base_info.energyPlanArea = res.data.energyPlanArea
            this.base_info.energyTotal = res.data.energyTotal
            if (this.timeType === 3) {
              this.base_info.year = this.year
            } else if (this.timeType === 2) {
              this.base_info.year = this.month
            } else if (this.timeType === 1) {
              this.base_info.year = this.date
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
    getAreaOrder () {
      const params = {}
      if (this.formInline.hierarchy) {
        params.areaId = this.formInline.hierarchy[this.formInline.hierarchy.length - 1]
      } else {
        params.areaId = -1
      }
      params.dataStr = this.year
      energyAreaOrder(params)
        .then(res => {
          if (res.success) {
            this.tableData = res.data
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
    getEnergyGeneralArea (areaId) {
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
      energyGeneralArea(params)
        .then(res => {
          if (res.success) {
            let arr = []
            this.formulaAreaOptions.xAxis = []
            if (this.timeType === 3) {
              Object.keys(res.data).forEach(key => {
                this.formulaAreaOptions.xAxis.push(key + '月')
                arr.push(res.data[key])
              })
            } else if (this.timeType === 2) {
              Object.keys(res.data).forEach(key => {
                this.formulaAreaOptions.xAxis.push(key + '日')
                arr.push(res.data[key])
              })
            } else if (this.timeType === 1) {
              Object.keys(res.data).forEach(key => {
                this.formulaAreaOptions.xAxis.push(key + '时')
                arr.push(res.data[key])
              })
            }
            this.formulaAreaOptions.barSeries = arr
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
    rowClick (row, column, event) {
      this.getEnergyGeneralArea(row.areaId)
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
      this.getAreaBaseInfo()
      this.getAreaOrder()
      this.getEnergyGeneralArea(this.formInline.hierarchy[this.formInline.hierarchy.length - 1])
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
    }
  }
}
</script>

<style lang="stylus" scoped>
#EnergyFormula
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
#EnergyFormula >>> .el-table td, .el-table th.is-leaf
    border-bottom none
#EnergyFormula >>> .el-table--enable-row-hover .el-table__body tr
  &:hover>td
    border 1px solid #fff
#EnergyFormula >>> .el-table--enable-row-hover .el-table__body tr
  &:hover>td:nth-child(1)
    border-right none
    border-radius 10px 0 0 10px
#EnergyFormula >>> .el-table--enable-row-hover .el-table__body tr
  &:hover>td:nth-child(2)
    border-left none
    border-right none
#EnergyFormula >>> .el-table--enable-row-hover .el-table__body tr
  &:hover>td:nth-child(3)
    border-left none
    border-radius 0 10px 10px 0
#EnergyFormula >>> .el-table__body tr.current-row>td
    border 1px solid #fff
    background-color transparent
#EnergyFormula >>> .el-table__body tr.current-row>td:nth-child(1)
    border-right none
    border-radius 10px 0 0 10px
#EnergyFormula >>> .el-table__body tr.current-row>td:nth-child(2)
    border-left none
    border-right none
#EnergyFormula >>> .el-table__body tr.current-row>td:nth-child(3)
    border-left none
    border-radius 0 10px 10px 0
.success
  background #67C23A
  color #fff
  border-radius 5px
.statistics
  display flex
  flex-direction column
</style>
