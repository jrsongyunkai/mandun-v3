<template>
    <div id="EnergyStatistics">
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
                <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">能耗趋势</el-col>
              </el-row>
              <el-row>
                <div class="fr box-border mt-10 mr-20">最大值: {{calculationQuota.maxValue}}kwh</div>
                <div class="fr box-border mt-10 mr-20">最小值: {{calculationQuota.minValue}}kwh</div>
                <div class="fr box-border mt-10 mr-20">平均值: {{calculationQuota.avgValue}}kwh</div>
                <div class="fr box-border mt-10 mr-20">总耗能: {{calculationQuota.sumValue}}kwh</div>
                <manage-Line-Area :options="statisticsAreaOptions"></manage-Line-Area>
              </el-row>
            </el-col>
          </div>
          <div class="box-inner ml-20 mt-20" style="height: 52%">
            <el-col :md="24" class="boundary" style="height: 100%;">
              <el-row class="chart-title">
                <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">
                  <el-col :span="12">能耗列表</el-col>
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
                    :data="tableData"
                    height="340"
                    v-el_scrollBar:scrollBar
                    style="width: 100%">
                    <el-table-column
                      align="center"
                      prop="time"
                      label="时间">
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="name"
                      label="回路名称">
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="number"
                      label="能耗(KW.H)">
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="number1"
                      label="折标煤(Kgce)">
                    </el-table-column>
                    <el-table-column
                      align="center"
                      prop="number2"
                      label="碳排放(KG)">
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
import { seekAreaListTreeByProject, queryBoxByArea, queryChannelOfLevel, statistics } from '@/api/api'
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
      timeType: 3,
      time: {
        startTime: '',
        endTime: ''
      },
      Treedata: [],
      tableData: [],
      nodeResId: '',
      nodeAddr: '',
      nodeName: '',
      calculationQuota: {
        avgValue: '',
        maxValue: '',
        minValue: '',
        sumValue: ''
      },
      statisticsAreaOptions: {
        title: {
          show: true,
          text: '能耗/kw.h'
        },
        xAxis: [],
        series: [],
        height: this.$store.state.manageTowHeight
      }
    }
  },
  created () {},
  mounted () {
    this.handleSeekAreaListTree()
  },
  methods: {
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
    handleSeekAreaListTree () {
      seekAreaListTreeByProject()
        .then(res => {
          if (res.success) {
            if (res.data.length > 0) {
              this.areaOptions = res.data
              this.formInline.hierarchy.push(res.data[0].id)
              this.areaName = this.areaOptions[0].areaName
              this.handleQueryBoxByArea()
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
      let parmas = {
        dateType: this.timeType,
        startTime: this.time.startTime,
        endTime: this.time.endTime,
        resId: this.nodeResId,
        addr: +this.nodeAddr
      }
      statistics(parmas)
        .then(res => {
          if (res.success) {
            this.calculationQuota = res.data.calculationQuota
            this.tableData = []
            this.statisticsAreaOptions.series = []
            this.statisticsAreaOptions.xAxis = []
            let data1 = []
            let data2 = []
            let data3 = []
            if (res.data.powerOfTimeList !== []) {
              res.data.powerOfTimeList.forEach(item => {
                this.statisticsAreaOptions.xAxis.push(item.time)
                data1.push(item.number)
                data2.push(item.number1)
                data3.push(item.number2)
                this.tableData.push({
                  time: item.time,
                  number: item.number,
                  number1: item.number1,
                  number2: item.number2,
                  name: this.nodeName
                })
              })
              this.statisticsAreaOptions.series.push(
                {name: '能耗', type: 'line', data: data1, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(65, 105, 225, .4)'}, {offset: 1, color: 'rgba(65, 105, 225, .1)'}], global: false}}, itemStyle: {color: '#34ACE7'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true},
                {name: '折标煤(KGce)', type: 'line', data: data2, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(65, 105, 225, .4)'}, {offset: 1, color: 'rgba(65, 105, 225, .1)'}], global: false}}, itemStyle: {color: '#67C23A'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true},
                {name: '碳排放(KG)', type: 'line', data: data3, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(65, 105, 225, .4)'}, {offset: 1, color: 'rgba(65, 105, 225, .1)'}], global: false}}, itemStyle: {color: '#F56C6C'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true}
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
      if (this.time.startTime === '') {
        this.$message({
          message: '请查询基准时间',
          type: 'error'
        })
        return
      }
      let name = this.formInline.hierarchy[this.formInline.hierarchy.length - 1]
      this.setName(this.areaOptions, name)
      this.$func.windowCountDown(ctxPaths + '/energyReport/statistics/export.as?dateType=' + this.timeType + '&startTime=' + this.time.startTime + '&endTime=' + this.time.endTime + '&resId=' + this.nodeResId + '&addr=' + this.nodeAddr + '&areaName=' + this.areaName + '&mac=' + this.mac + '&addrName=' + this.nodeName)
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
          this.formInline.hierarchy = newVal
          this.mac = ''
          this.areaName = ''
          this.nodeName = ''
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
#EnergyStatistics
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
#EnergyStatistics >>> .el-tree-node__content:hover
  background-color transparent
  border-radius 5px
  border 1px solid #fff
#EnergyStatistics >>> .el-tree-node:focus > .el-tree-node__content
  background-color transparent
  border-radius 5px
  border 1px solid #fff
#EnergyStatistics >>> .el-tree-node:focus > .el-tree-node__expand-icon .is-leaf
    color transparent
#EnergyStatistics >>> .el-tree-node.is-expanded > .el-tree-node__children
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
