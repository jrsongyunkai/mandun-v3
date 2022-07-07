<template>
    <div id="EnergyAnalysis">
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
              <el-button type="primary" @click="timeType = 1" :plain="timeType !== 1" circle>日</el-button>
              <el-button type="primary" @click="timeType = 2" :plain="timeType !== 2" circle>月</el-button>
              <el-button type="primary" @click="timeType = 3" :plain="timeType !== 3" circle>年</el-button>
            </el-form-item>
            <el-form-item label="基准">
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
            <el-form-item label="同比">
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
              <el-button type="primary" :disabled="formInline.hierarchy.length === 0 || nodeAddr.length === 0" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-form>
        </el-row>
        <el-col :span="5" :style="{height: formulaHeight}">
          <div class="box-inner" style="height: 100%">
            <el-col :md="24" class="boundary left-padding-right" style="height: 100%;">
              <el-row class="chart-title">
                <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">支路名称</el-col>
              </el-row>
              <el-row>
                <el-scrollbar class="scroll-wrap" :style="{height: $store.state.channelsTableHeight}">
                  <el-tree
                    class="leftTreeView"
                    ref="tree"
                    :default-expand-all="true"
                    :data="Treedata"
                    :props="{label: 'name', children: 'children'}">
                    <div style="width:100%" class="custom-tree-node" slot-scope="{ data, node }" >
                      <div style="width:100%" :title="data.mac" @click="handleNodeClick(data, node)">{{ data.name }}</div>
                    </div>
                  </el-tree>
                </el-scrollbar>
              </el-row>
            </el-col>
          </div>
        </el-col>
        <el-col :span="19" :style="{height: formulaHeight}">
          <div class="box-inner ml-20" style="height: 45%">
            <el-col :md="24" class="boundary left-padding-right" style="height: 100%;">
              <el-row class="chart-title">
                <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">能耗同比</el-col>
              </el-row>
              <el-row>
                <div class="fr box-border mt-10 mr-20">同比: <span :class="compareRatio > 0 ? 'iconfont icon-web-icon-1 c-danger' : 'iconfont icon-web-icon- c-success'">{{Math.abs(compareRatio)}}%</span></div>
                <div class="fr box-border mt-10 mr-20">基准能耗: {{basePower}}kwh</div>
                <div class="fr box-border mt-10 mr-20">同比能耗: {{comparePower}}kwh</div>
                <manage-Line-Area :options="statisticsAreaOptions"></manage-Line-Area>
              </el-row>
            </el-col>
          </div>
          <div class="box-inner ml-20 mt-20" style="height: 52%">
            <el-col :md="24" class="boundary" style="height: 100%;">
              <el-row class="chart-title">
                <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">
                  <el-col :span="12">数据报表(kwh)</el-col>
                  <el-col :span="12" class="tr">
                    <el-tooltip class="item" effect="dark" content="导出" placement="top">
                      <i @click="handlesExport" class="iconfont icon-dayinji mr-30"></i>
                    </el-tooltip>
                  </el-col>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-table
                    :data="powerOfTimeList"
                    height="340"
                    v-el_scrollBar:scrollBar
                    style="width: 100%">
                    <el-table-column
                      align="center"
                      prop="time"
                      label="时间"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="number"
                      :label="'基准能耗' + benchmark"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="number1"
                      :label="'同比能耗' + samePeriod">
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="compareIncrement"
                      label="同比增量">
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="compareRatio"
                      label="同比百分比">
                      <template slot-scope="scope">
                        <span>{{ scope.row.compareRatio }}%</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-col>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
/* global ctxPaths */
import { seekAreaListTreeByProject, queryBoxByArea, queryChannelOfLevel, energyAnalysis } from '@/api/api'
import manageLineArea from '../Common/ManageLineArea'
export default {
  components: {manageLineArea},
  data () {
    return {
      height: this.$store.state.asideTowHeight,
      formulaHeight: this.$store.state.formulaHeight,
      formInline: {
        hierarchy: []
      },
      areaName: '',
      mac: '',
      areaOptions: [],
      date: this.$func.getFuTime(new Date(), 'date'),
      month: this.$func.getFuTime(new Date(), 'month'),
      year: this.$func.getFuTime(new Date(), 'year'),
      secondDate: this.$func.getFuTime(new Date(), 'date'),
      secondMonth: this.$func.getFuTime(new Date(), 'month'),
      secondYear: this.$func.getFuTime(new Date(), 'year'),
      timeType: 3,
      basePower: 0,
      comparePower: 0,
      compareRatio: 0,
      nodeResId: '',
      nodeAddr: '',
      timeOne: {
        startTime: '',
        endTime: ''
      },
      timeSecond: {
        startTime: '',
        endTime: ''
      },
      benchmark: '',
      samePeriod: '',
      Treedata: [],
      powerOfTimeList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      statisticsAreaOptions: {
        title: {
          show: true,
          text: '单位/kw.h'
        },
        xAxis: [],
        series: [],
        height: this.$store.state.manageTowHeight
      },
      flag: true
    }
  },
  created () {},
  mounted () {
    this.handleSeekAreaListTree()
  },
  methods: {
    handleTotal () {
    },
    handleSeekAreaListTree () {
      seekAreaListTreeByProject()
        .then(res => {
          if (res.success) {
            if (res.data.length > 0) {
              this.areaOptions = res.data
              this.formInline.hierarchy.push(res.data[0].id)
              this.$nextTick(() => {
                this.handleQueryBoxByArea()
              })
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
    handleQueryBoxByArea () {
      if (this.formInline.hierarchy.length === 0) {
        return
      }
      let parmas = {
        areaId: this.formInline.hierarchy[this.formInline.hierarchy.length - 1]
      }
      queryBoxByArea(parmas)
        .then(res => {
          if (res.success) {
            this.Treedata = res.data
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
    handleNodeClick (data, node) {
      if (node.data.resId) {
        this.mac = data.mac
        this.nodeResId = this.nodeAddr = ''
        queryChannelOfLevel({resId: node.data.resId})
          .then(res => {
            if (res.success && res.data.length > 0) {
              this.Treedata.forEach(item => {
                item.children = []
                if (item.resId === node.data.resId) {
                  item.children.push(res.data[0])
                }
              })
              this.nodeResId = node.data.resId
              this.Treedata = JSON.parse(JSON.stringify(this.Treedata))
              this.Treedata = JSON.parse(JSON.stringify(this.Treedata))
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
      } else {
        this.nodeAddr = node.data.addr
        this.nodeName = node.data.name
      }
    },
    getEnergyAnalysis () {
      let parmas = {
        dateType: this.timeType,
        firstStartTime: this.timeOne.startTime,
        firstEndTime: this.timeOne.endTime,
        lastStartTime: this.timeSecond.startTime,
        lastEndTime: this.timeSecond.endTime,
        resId: this.nodeResId,
        addr: +this.nodeAddr
      }
      energyAnalysis(parmas)
        .then(res => {
          if (res.success) {
            this.statisticsAreaOptions.series = []
            this.statisticsAreaOptions.xAxis = []
            // this.Treedata = res.data
            if (res.data.powerOfTimeList) {
              this.powerOfTimeList = res.data.powerOfTimeList
            }
            this.basePower = res.data.compareValue.basePower
            this.comparePower = res.data.compareValue.comparePower
            this.compareRatio = res.data.compareValue.compareRatio
            let data1 = []
            let data2 = []
            res.data.powerOfTimeList.forEach(item => {
              this.statisticsAreaOptions.xAxis.push(item.time)
              data1.push(item.number)
              data2.push(item.number1)
            })
            if (this.timeType === 1) {
              this.statisticsAreaOptions.series.push(
                {name: this.date, type: 'line', data: data1, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(65, 105, 225, .4)'}, {offset: 1, color: 'rgba(65, 105, 225, .1)'}], global: false}}, itemStyle: {color: '#34ACE7'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true},
                {name: this.secondDate, type: 'line', data: data2, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(65, 105, 225, .4)'}, {offset: 1, color: 'rgba(65, 105, 225, .1)'}], global: false}}, itemStyle: {color: '#67C23A'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true}
              )
            } else if (this.timeType === 2) {
              this.statisticsAreaOptions.series.push(
                {name: this.month, type: 'line', data: data1, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(65, 105, 225, .4)'}, {offset: 1, color: 'rgba(65, 105, 225, .1)'}], global: false}}, itemStyle: {color: '#34ACE7'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true},
                {name: this.secondMonth, type: 'line', data: data2, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(65, 105, 225, .4)'}, {offset: 1, color: 'rgba(65, 105, 225, .1)'}], global: false}}, itemStyle: {color: '#67C23A'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true}
              )
            } else if (this.timeType === 3) {
              this.statisticsAreaOptions.series.push(
                {name: this.year, type: 'line', data: data1, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(65, 105, 225, .4)'}, {offset: 1, color: 'rgba(65, 105, 225, .1)'}], global: false}}, itemStyle: {color: '#34ACE7'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true},
                {name: this.secondYear, type: 'line', data: data2, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(65, 105, 225, .4)'}, {offset: 1, color: 'rgba(65, 105, 225, .1)'}], global: false}}, itemStyle: {color: '#67C23A'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true}
              )
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
        this.timeOne = {
          startTime: this.date.split('-').join('') + '00',
          endTime: this.date.split('-').join('') + '23'
        }
        this.timeSecond = {
          startTime: this.secondDate.split('-').join('') + '00',
          endTime: this.secondDate.split('-').join('') + '23'
        }
        this.benchmark = '(' + this.date + ')'
        this.samePeriod = '(' + this.secondDate + ')'
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
        this.benchmark = '(' + this.month + ')'
        this.samePeriod = '(' + this.secondMonth + ')'
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
        this.benchmark = '(' + this.year + ')'
        this.samePeriod = '(' + this.secondYear + ')'
      }
      this.getEnergyAnalysis()
    },
    setName (datas, id) {
      for (let i in datas) {
        if (datas[i].id === id) {
          this.areaName = datas[i].areaName
          return datas
        } else {
          if (datas[i].children) {
            this.setName(datas[i].children, id)
          } else {
            return datas
          }
        }
      }
    },
    handlesExport () {
      if (this.nodeName === '') {
        this.$message({
          message: '请选择线路',
          type: 'error'
        })
        return
      }
      if (this.timeSecond.startTime === '') {
        this.$message({
          message: '请查询同比时间',
          type: 'error'
        })
        return
      }
      if (this.timeOne.startTime === '') {
        this.$message({
          message: '请查询基准时间',
          type: 'error'
        })
        return
      }
      let name = this.formInline.hierarchy[this.formInline.hierarchy.length - 1]
      this.setName(this.areaOptions, name)
      this.$func.windowCountDown(ctxPaths + '/energyReport/analysis/export.as?dateType=' + this.timeType + '&firstStartTime=' + this.timeOne.startTime + '&firstEndTime=' + this.timeOne.endTime + '&lastStartTime=' + this.timeSecond.startTime + '&lastEndTime=' + this.timeSecond.endTime + '&resId=' + this.nodeResId + '&addr=' + this.nodeAddr + '&areaName=' + this.areaName + '&mac=' + this.mac + '&addrName=' + this.nodeName)
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
    '$store.state.channelsTableHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.$store.state.analysispieHeight = newVal
        }
      }
    },
    'formInline.hierarchy': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.mac = ''
          this.areaName = ''
          this.nodeName = ''
          this.formInline.hierarchy = newVal
          this.$nextTick(() => {
            this.handleQueryBoxByArea()
          })
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
#EnergyAnalysis
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
.leftTreeView
  margin-bottom 20px
  background none
  color #fff
#EnergyAnalysis >>> .el-tree-node__content:hover
  background-color transparent
  border-radius 5px
  border 1px solid #fff
#EnergyAnalysis >>> .el-tree-node:focus > .el-tree-node__content
  background-color transparent
  border-radius 5px
  border 1px solid #fff
#EnergyAnalysis >>> .el-tree-node:focus > .el-tree-node__expand-icon .is-leaf
    color transparent
#EnergyAnalysis >>> .el-tree-node.is-expanded > .el-tree-node__children
  display inline
.scroll-wrap
  > .el-scrollbar__wrap
    overflow-x auto
.icon-dayinji
  color #fff
  font-size 18px
.box-border
  font-size 14px
  box-sizing border-box
  padding 5px 10px
  border 1px solid #ccc
  border-radius 5px
</style>
