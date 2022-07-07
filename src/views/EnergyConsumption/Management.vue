<template>
    <div id="EnergyManagement">
      <el-row :style="{height: height}">
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
        <el-row class="ml-10">
          <el-col class="box-inner left-bottom" :span="8">
            <div class="box-inner" :style="{height: manageHeight}">
              <el-col :md="24" class="boundary left-padding-right statistics" style="height: 100%;">
                <el-row class="chart-title">
                  <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">用能总概</el-col>
                </el-row>
                <el-row  class="wrap">
                  <el-col :md="12" :xs="12" :sm="12" class="wrap-item">
                    <div class="left-borde"></div>
                    <div class="inco-size"><i class="el-icon-s-data el-icon"></i></div>
                    <div class="wrap-item-right">
                      <div class="fs-14">综合能耗</div>
                      <div class="fs-20" style="">{{totalEnergy ? totalEnergy : 0}}<span class="fs-12 ml-5">tce</span></div>
                    </div>
                  </el-col>
                  <el-col :md="12" :xs="12" :sm="12" class="wrap-item">
                    <div class="left-borde"></div>
                    <div class="inco-size"><i class="iconfont icon-fengshi el-icon"></i></div>
                    <div class="wrap-item-right">
                      <div class="fs-14">峰时能耗</div>
                      <div class="fs-20" style="">{{highEnergy ? highEnergy : 0}}<span class="fs-12 ml-5">kwh</span></div>
                    </div>
                  </el-col>
                  <el-col :md="12" :xs="12" :sm="12" class="wrap-item">
                    <div class="left-borde"></div>
                    <div class="inco-size"><i class="iconfont icon-chatou el-icon"></i></div>
                    <div class="wrap-item-right">
                      <div class="fs-14">总用电量</div>
                      <div class="fs-20" style="">{{totalElectric ? totalElectric : 0}}<span class="fs-12 ml-5">kwh</span></div>
                    </div>
                  </el-col>
                  <el-col :md="12" :xs="12" :sm="12" class="wrap-item">
                    <div class="left-borde"></div>
                    <div class="inco-size"><i class="iconfont icon-pingshi el-icon"></i></div>
                    <div class="wrap-item-right">
                      <div class="fs-14">平时能耗</div>
                      <div class="fs-20" style="">{{midEnergy ? midEnergy : 0}}<span class="fs-12 ml-5">kwh</span></div>
                    </div>
                  </el-col>
                  <el-col :md="12" :xs="12" :sm="12" class="wrap-item">
                    <div class="left-borde"></div>
                    <div class="inco-size"><i class="iconfont icon-danweiGDPeryanghuatanpaifangjiangdi el-icon"></i></div>
                    <div class="wrap-item-right">
                      <div class="fs-14">综合碳排放</div>
                      <div class="fs-20" style="">{{totalCarbon ? totalCarbon : 0}}<span class="fs-12 ml-5">t</span></div>
                    </div>
                  </el-col>
                  <el-col :md="12" :xs="12" :sm="12" class="wrap-item">
                    <div class="left-borde"></div>
                    <div class="inco-size"><i class="iconfont icon-gushi el-icon"></i></div>
                    <div class="wrap-item-right">
                      <div class="fs-14">谷时能耗</div>
                      <div class="fs-20" style="">{{lowerEnergy ? lowerEnergy : 0}}<span class="fs-12 ml-5">kwh</span></div>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
            </div>
          </el-col>
          <el-col class="box-inner left-bottom" :span="10">
            <div class="box-inner ml-10" :style="{height: manageHeight}">
              <el-col :md="24" class="boundary left-padding-right statistics" style="height: 100%;">
                <el-row class="chart-title">
                  <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">用能水平</el-col>
                </el-row>
                <el-row>
                  <el-row>
                    <el-col :span="7" class="box-border ml-20 mt-10">最大值： {{ energyMax }} kw.h</el-col>
                    <el-col :span="7" class="box-border ml-20 mt-10">最小值： {{ energyMin }} kw.h</el-col>
                    <el-col :span="7" class="box-border ml-20 mt-10">平均值： {{ energyAverage }} kw.h</el-col>
                  </el-row>
                  <el-row class="area">
                    <div class="area-child" v-for="(v,f) in energyAreaList.slice(0, 3)" :key="f">
                      <el-col :span="24" class=" mb-5 fs-14"><span class="mr-10"
                      style="font-size: 16px;color: #3884d5">{{f + 1}}</span>{{v.areaName}}</el-col>
                      <el-col :span="18">
                        <el-progress stroke-width="8" :percentage="v.electricRate"></el-progress>
                      </el-col>
                      <el-col :span="6" class="tc">{{v.electric}} kw.h/m²</el-col>
                    </div>
                  </el-row>
                </el-row>
              </el-col>
            </div>
          </el-col>
          <el-col class="box-inner left-bottom" :span="6">
            <div class="box-inner ml-10" :style="{height: manageHeight}">
              <el-col :md="24" class="boundary left-padding-right statistics" style="height: 100%;">
                <el-row class="chart-title">
                  <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">分项用能</el-col>
                </el-row>
                <el-row>
                  <manage-pie-chart :options="manageOptions"></manage-pie-chart>
                </el-row>
              </el-col>
            </div>
          </el-col>
          <el-col class="box-inner mt-20" :span="24">
            <div class="box-inner" :style="{height: manageHeight}">
              <el-col :md="24" class="boundary left-padding-right statistics" style="height: 100%;">
                <el-row class="chart-title">
                  <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">用能趋势</el-col>
                </el-row>
                <el-row>
                  <el-button @click="handleTotal" type="primary" class="box-btn" :plain="lineAreaType !== 'all'" style="right: 8%" size="small">总量</el-button>
                  <el-button @click="handleItem" type="primary" class="box-btn" :plain="lineAreaType !== 'item'" style="right: 3%" size="small">分项</el-button>
                  <manage-Line-Area :options="manageAreaOptions"></manage-Line-Area>
                </el-row>
              </el-col>
            </div>
          </el-col>
        </el-row>
      </el-row>
    </div>
</template>

<script>
import { seekAreaListTreeByProject, energyGeneral, energyArea, energyCategory, energyGeneralArea, energyGeneralCategory } from '@/api/api'
import managePieChart from '../Common/ManagePic'
import manageLineArea from '../Common/ManageLineArea'
export default {
  components: { managePieChart, manageLineArea },
  data () {
    return {
      height: this.$store.state.asideTowHeight,
      manageHeight: this.$store.state.manageHeight,
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
      lineAreaType: 'item',
      manageOptions: [],
      manageAreaOptions: {
        title: {
          show: true,
          text: '单位/kw.h'
        },
        xAxis: [],
        series: [],
        height: this.$store.state.overTowHeight
      },
      highEnergy: '',
      lowerEnergy: '',
      midEnergy: '',
      totalCarbon: '',
      totalElectric: '',
      totalEnergy: '',
      energyMax: '',
      energyMin: '',
      energyAverage: '',
      energyAreaList: []
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
      this.lineAreaType = 'all'
      this.getEnergyGeneral()
      this.getEnergyArea()
      this.getEnergyCategory()
      this.getEnergyGeneralArea()
    },
    handleSeekAreaListTree () {
      seekAreaListTreeByProject()
        .then(res => {
          if (res.success) {
            if (res.data.length > 0) {
              this.options = res.data
              this.formInline.hierarchy.push(res.data[0].id)
              this.onSubmit()
              this.handleTotal()
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
    getEnergyGeneral () {
      const params = {}
      if (this.formInline.hierarchy.length) {
        params.areaId = this.formInline.hierarchy[this.formInline.hierarchy.length - 1]
      } else {
        params.areaId = -1
      }
      params.dataType = this.timeType
      params.startTime = this.time.startTime
      params.endTime = this.time.endTime
      energyGeneral(params)
        .then(res => {
          if (res.success) {
            this.highEnergy = res.data.highEnergy
            this.lowerEnergy = res.data.lowerEnergy
            this.midEnergy = res.data.midEnergy
            this.totalCarbon = res.data.totalCarbon
            this.totalElectric = res.data.totalElectric
            this.totalEnergy = res.data.totalEnergy
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
    getEnergyArea () {
      let params = {
        dataType: this.timeType,
        startTime: this.time.startTime,
        endTime: this.time.endTime
      }
      if (this.formInline.hierarchy.length) {
        params.areaId = this.formInline.hierarchy[this.formInline.hierarchy.length - 1]
      } else {
        params.areaId = -1
      }
      energyArea(params)
        .then(res => {
          if (res.success) {
            this.energyMax = res.data.max.toFixed(2)
            this.energyMin = res.data.min.toFixed(2)
            this.energyAverage = res.data.average.toFixed(2)
            this.energyAreaList = res.data.list
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
            this.manageOptions = []
            arr.push(
              res.data.special,
              res.data.ac,
              res.data.turbo,
              res.data.lamp
            )
            arr.forEach(v => {
              this.manageOptions.push({
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
    },
    getEnergyGeneralArea () {
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
            this.manageAreaOptions.series = []
            this.manageAreaOptions.xAxis = []
            Object.keys(res.data).forEach(key => {
              this.manageAreaOptions.xAxis.push(key)
              arr.push(res.data[key])
            })
            this.manageAreaOptions.series.push(
              {name: '用电量', type: 'line', data: arr, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(0, 201, 78, .6)'}, {offset: 1, color: 'rgba(65, 105, 225, .1)'}], global: false}}, itemStyle: {color: '#34ACE7'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true}
            )
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
      let params = {
        dataType: this.timeType
      }
      if (this.formInline.hierarchy.length) {
        params.areaId = this.formInline.hierarchy[this.formInline.hierarchy.length - 1]
      } else {
        params.areaId = -1
      }
      if (this.timeType === 3) {
        params.dataStr = this.year.split('-').join('')
      } else if (this.timeType === 2) {
        params.dataStr = this.month.split('-').join('')
      } else if (this.timeType === 1) {
        params.dataStr = this.date.split('-').join('')
      }
      energyGeneralCategory(params)
        .then(res => {
          if (res.success) {
            let special = []
            let ac = []
            let turbo = []
            let lamp = []
            Object.keys(res.data).forEach(key => {
              this.manageAreaOptions.xAxis.push(key)
              special.push(res.data[key]['特殊用电'])
              ac.push(res.data[key]['空调用电'])
              turbo.push(res.data[key]['动力用电'])
              lamp.push(res.data[key]['照明用电'])
            })
            this.manageAreaOptions.series.push(
              {name: '空调用电', type: 'line', data: ac, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(184, 36, 100, .5)'}, {offset: 1, color: 'rgba(184, 36, 100, .1)'}], global: false}}, itemStyle: {color: '#fac858'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true},
              {name: '照明插座', type: 'line', data: lamp, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(0, 189, 135, .5)'}, {offset: 1, color: 'rgba(0, 189, 135, .1)'}], global: false}}, itemStyle: {color: '#5470c6'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true},
              {name: '特殊用电', type: 'line', data: special, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(14, 164, 192, .5)'}, {offset: 1, color: 'rgba(14, 164, 192, .1)'}], global: false}}, itemStyle: {color: '#ee6666'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true},
              {name: '动力用电', type: 'line', data: turbo, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(119, 123, 133, .5)'}, {offset: 1, color: 'rgba(119, 123, 133, .1)'}], global: false}}, itemStyle: {color: '#73c0de'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true}
            )
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
    handleItem () {
      this.lineAreaType = 'item'
      this.manageAreaOptions.series = []
      this.manageAreaOptions.xAxis = []
      this.getEnergyGeneralCategory()
    },
    handleTotal () {
      this.lineAreaType = 'all'
      this.manageAreaOptions.series = []
      this.manageAreaOptions.xAxis = []
      this.getEnergyGeneralArea()
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
    '$store.state.manageHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.manageHeight = newVal
        }
      }
    },
    '$store.state.overTowHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.manageAreaOptions.height = newVal
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
#EnergyManagement
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
.statistics
  display flex
  flex-direction column
.chart-title
  border-bottom 2px solid #303a5ecc
.wrap
  flex 1
.wrap-item
  height 33.3%
  display flex
  align-items center
  padding-left 5%
.left-borde
  line-height 100%
  width 3px
  height 60%
  border-left 1px solid #ccc
.inco-size
  line-height 100%
  width 25%
  height 60%
  background-color #28374e
  display flex
  align-items center
  justify-content center
.el-icon
  font-size 30px
.wrap-item-right
  margin-left 7%
  height 60%
  display flex
  flex-direction column
  justify-content space-between
.area
  display flex
  flex 1
  flex-direction column
  justify-content space-between
  padding 10px 10px
.area-child
  padding 25px 0
.area-child >>> .el-progress__text
      color #3884d5
.box-border
  font-size 14px
  box-sizing border-box
  padding 10px 5px
  border 1px solid #ccc
  border-radius 5px
.box-btn
  position absolute
  z-index 999
  right 0
  top 2%
</style>
