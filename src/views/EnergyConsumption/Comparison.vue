<template>
    <div id="EnergyComparison">
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
            <el-form-item  label="对比对象：">
              <el-cascader
                :show-all-levels="false"
                v-model="formInline.contrastVal"
                :options="areaOptions"
                collapse-tags
                :props="{ value: 'id', label: 'areaName', multiple: true, checkStrictly: true }"
                clearable>
              </el-cascader>
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
                    :data="analysisMapList"
                    style="width: 100%">
                    <el-table-column
                      align="center"
                      label="排名"
                      type="index">
                    </el-table-column>
                    <el-table-column
                      prop="areaName"
                      align="center"
                      label="区域层级">
                    </el-table-column>
                    <el-table-column
                      prop="power"
                      align="center"
                      label="用电(kW.h)">
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-col>
          </div>
          <div class="box-inner ml-10 mt-20" style="height: 30%">
            <el-col :md="24" class="boundary" style="height: 100%;">
              <el-row class="chart-title">
                <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">单位面积排名</el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-table
                    size="small"
                    :data="powerOfAreaMapList"
                    style="width: 100%">
                    <el-table-column
                      align="center"
                      label="排名"
                      type="index">
                      <template slot-scope="scope">
                        <span><i :class="scope.$index === 0 ? 'custom-icon icon-gold' : scope.$index === 1 ? 'custom-icon icon-silver' : 'custom-icon icon-bronze'" ></i></span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="areaName"
                      align="center"
                      label="区域层级">
                    </el-table-column>
                    <el-table-column
                      prop="area"
                      align="center"
                      label="总面积(m²)">
                    </el-table-column>
                    <el-table-column
                      prop="areaPower"
                      align="center"
                      label="单位面积能耗">
                    </el-table-column>
                    <el-table-column
                      prop="standardQuota"
                      align="center"
                      label="标准指标">
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-col>
          </div>
        </el-col>
        <el-col :span="15" :style="{height: formulaHeight}">
          <div class="box-inner ml-20" style="height: 60.7%">
            <el-col :md="24" class="boundary left-padding-right statistics" style="height: 100%">
              <el-row class="chart-title">
                <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">分析对比</el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <comparison-bar :options="BarOptions"></comparison-bar>
                </el-col>
              </el-row>
            </el-col>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
import { seekAreaListTreeByProject, energyContrast } from '@/api/api'
import ComparisonBar from '../Common/ComparisonBar'
export default {
  components: {ComparisonBar},
  data () {
    return {
      height: this.$store.state.asideTowHeight,
      formulaHeight: this.$store.state.formulaHeight,
      formInline: {
        hierarchy: [],
        contrastVal: []
      },
      areaOptions: [],
      date: this.$func.getFuTime(new Date(), 'date'),
      month: this.$func.getFuTime(new Date(), 'month'),
      year: this.$func.getFuTime(new Date(), 'year'),
      timeType: 3,
      time: {
        startTime: '',
        endTime: ''
      },
      analysisMapList: [],
      powerOfAreaMapList: [],
      powerOfTimeMapList: [],
      BarOptions: {
        legendStatus: true,
        xAxisType: '',
        yAxisType: '',
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: 'kWh'
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
      this.BarOptions.series = []
      this.BarOptions.xAxis = []
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
              this.areaOptions = res.data
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
    queryEnergyContrast () {
      this.BarOptions.series = []
      if (this.timeType === 1) {
        this.BarOptions.xAxis = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
      }
      if (this.timeType === 2) {
        this.BarOptions.xAxis = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31']
      }
      if (this.timeType === 3) {
        this.BarOptions.xAxis = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
      }
      if (this.formInline.hierarchy.length === 0 || this.formInline.contrastVal.length === 0) {
        return
      }
      let arr = []
      arr.push(this.formInline.hierarchy.length === 0 ? null : this.formInline.hierarchy[this.formInline.hierarchy.length - 1])
      for (let i in this.formInline.contrastVal) {
        arr.push(this.formInline.contrastVal[i][this.formInline.contrastVal[i].length - 1])
      }
      let params = {
        areaIds: arr.join(','),
        dateType: this.timeType,
        startTime: this.time.startTime,
        endTime: this.time.endTime
      }
      energyContrast(params)
        .then(res => {
          if (res.success) {
            if (res.data.analysisMapList != null) {
              this.analysisMapList = res.data.analysisMapList
            }
            if (res.data.powerOfAreaMapList != null) {
              this.powerOfAreaMapList = res.data.powerOfAreaMapList
            }
            if (res.data.powerOfAreaMapList != null) {
              this.powerOfTimeMapList = res.data.powerOfTimeMapList
              for (let item of this.powerOfTimeMapList) {
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
                if (item.powerOfTimeList !== null) {
                  item.powerOfTimeList.forEach(powerOfTime => {
                    this.BarOptions.xAxis.filter((item, index) => {
                      if (powerOfTime.time === item) {
                        data[index] = (powerOfTime.number).toFixed(2)
                      }
                    })
                  })
                }
                let name = item.areaName
                this.BarOptions.series.push({name: name, type: 'bar', barMaxWidth: '30', data: data, itemStyle: {emphasis: {barBorderRadius: 5}, normal: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(0, 189, 135, .8)'}, {offset: 1, color: 'rgba(0, 189, 135, .2)'}], globalCoord: false}, barBorderRadius: 5}}})
              }
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
      this.queryEnergyContrast()
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
    'formInline.contrastVal': {
      handler (newVal, oldVal) {
        if (newVal.length > 2) {
          this.$message({
            message: '最多只支持选两项',
            duraion: 1000,
            type: 'error'
          })
          this.$nextTick(() => {
            this.formInline.contrastVal = oldVal
          })
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
#EnergyComparison
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
.icon-gold
  background url('../../assets/image/gold.png') no-repeat center
.icon-silver
  background url('../../assets/image/silver.png') no-repeat center
.icon-bronze
  background url('../../assets/image/bronze.png') no-repeat center
.custom-icon
  font-family element-icons!important
  speak none
  font-style normal
  font-weight 400
  font-variant normal
  text-transform none
  line-height 1
  vertical-align baseline
  display inline-block
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  width 22px
  height 30px
  background-size cover
  vertical-align middle
  margin-right 2px
</style>
