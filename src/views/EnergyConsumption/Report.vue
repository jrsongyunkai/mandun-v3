<template>
    <div id="EnergyReport">
      <el-row class="energy ml-10" :style="{height: height}">
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
              <el-button type="primary" @click="handleTimeQruey(1)" :plain="timeType !== 1" circle>时</el-button>
              <el-button type="primary" @click="handleTimeQruey(2)" :plain="timeType !== 2" circle>日</el-button>
              <el-button type="primary" @click="handleTimeQruey(3)" :plain="timeType !== 3" circle>月</el-button>
            </el-form-item>
            <el-form-item label="日期">
              <el-date-picker
                v-show="timeType === 1"
                key="aa"
                style="width:160px"
                v-model="date"
                type="datetime"
                value-format="yyyy-MM-dd HH"
                format="yyyy-MM-dd HH"
                placeholder="请选择">
              </el-date-picker>
              <el-date-picker
                v-show="timeType === 2"
                key="bb"
                style="width:160px"
                v-model="month"
                type="date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                placeholder="请选择">
              </el-date-picker>
              <el-date-picker
                v-show="timeType === 3"
                key="cc"
                style="width:160px"
                v-model="year"
                type="month"
                value-format="yyyy-MM"
                format="yyyy-MM"
                placeholder="请选择">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :disabled="formInline.hierarchy.length === 0" @click="onSubmit">查询</el-button>
              <el-dropdown trigger="click" @command="handleCommand">
                <el-button class="ml-10">
                  {{ $t('home.export') }}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="current">{{ $t('btns.exportCurrent') }}</el-dropdown-item>
                  <el-dropdown-item command="all">{{ $t('btns.exportAll') }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              align="center"
              prop="areaName"
              label="监测点"
              width="180">
            </el-table-column>
            <el-table-column
              align="center"
              prop="others.power"
              label="能耗(KW.H)">
            </el-table-column>
            <el-table-column
              align="center"
              prop="others.standardCoal"
              label="折标煤(Kgce)">
            </el-table-column>
            <el-table-column
              align="center"
              prop="others.carbonEmission"
              label="碳排放(KG)">
            </el-table-column>
            <el-table-column
              align="center"
              prop="others.sameRatio"
              label="指标值同比(%)">
            </el-table-column>
            <el-table-column
              align="center"
              prop="others.ringRatio"
              label="指标值环比(%)">
            </el-table-column>
          </el-table>
        </el-row>
      <el-row>
        <el-col :span="24" class="tc mt-5">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30]"
            :page-size="pageSize"
            :small="true"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </el-col>
      </el-row>
      </el-row>
    </div>
</template>
<script>
/* global ctxPaths */
import { seekAreaListTreeByProject, reportPage } from '@/api/api'
export default {
  components: {},
  data () {
    return {
      height: this.$store.state.asideTowHeight,
      formInline: {
        hierarchy: []
      },
      date: this.$func.getFuTime(new Date(), 'hour'),
      month: this.$func.getFuTime(new Date(), 'date'),
      year: this.$func.getFuTime(new Date(), 'month'),
      timeType: 3,
      time: {
        startTime: '',
        endTime: ''
      },
      areaOptions: [],
      pageNo: 1,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      tableData: []
    }
  },
  created () {},
  mounted () {
    this.handleSeekAreaListTree()
  },
  methods: {
    onSubmit () {
      this.queryList()
    },
    handleTimeQruey (num) {
      if (num === 1 && this.date === null) {
        this.date = this.$func.getFuTime(new Date(), 'hour')
      }
      if (num === 2 && this.month === null) {
        this.month = this.$func.getFuTime(new Date(), 'date')
      }
      if (num === 3 && this.year === null) {
        this.year = this.$func.getFuTime(new Date(), 'month')
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
    queryList () {
      if (this.timeType === 1) {
        this.time = {
          startTime: this.date.split(' ').join('').split('-').join(''),
          endTime: this.date.split(' ').join('').split('-').join('')
        }
      }
      if (this.timeType === 2) {
        this.time = {
          startTime: this.month.split('-').join(''),
          endTime: this.month.split('-').join('')
        }
      }
      if (this.timeType === 3) {
        this.time = {
          startTime: this.year.split('-').join(''),
          endTime: this.year.split('-').join('')
        }
      }
      let startTime = this.time.startTime
      let endTime = this.time.endTime
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        params: {
          areaId: this.formInline.hierarchy.length === 0 ? null : this.formInline.hierarchy[this.formInline.hierarchy.length - 1],
          dateType: this.timeType,
          startTime: startTime,
          endTime: endTime
        }
      }
      reportPage(params)
        .then(res => {
          if (res.success) {
            this.tableData = res.datas
            if (this.tableData != null && this.tableData.length > 0) {
              this.tableData.forEach(item => {
                if (item.sameRatio < 0) {
                  item.sameRatio = -1 * item.sameRatio
                }
                if (item.ringRatio < 0) {
                  item.ringRatio = -1 * item.ringRatio
                }
              })
            }
            this.total = res.total
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
    handleSizeChange (val) {
      this.pageSize = val
      this.queryList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.queryList()
    },
    handleCommand (command) {
      if (this.timeType === 1) {
        this.time = {
          startTime: this.date.split(' ').join('').split('-').join(''),
          endTime: this.date.split(' ').join('').split('-').join('')
        }
      }
      if (this.timeType === 2) {
        this.time = {
          startTime: this.month.split('-').join(''),
          endTime: this.month.split('-').join('')
        }
      }
      if (this.timeType === 3) {
        this.time = {
          startTime: this.year.split('-').join(''),
          endTime: this.year.split('-').join('')
        }
      }
      let startTime = this.time.startTime
      let endTime = this.time.endTime
      let areaId = this.formInline.hierarchy.length === 0 ? null : this.formInline.hierarchy[this.formInline.hierarchy.length - 1]
      this.$func.windowCountDown(ctxPaths + '/energyReport/export.as?projectCode=' + this.$store.state.projectCode + '&pageNo=' + this.currentPage + '&areaId=' + areaId + '&pageSize=' + this.pageSize + '&startTime=' + startTime + '&endTime=' + endTime + '&dateType=' + this.timeType + '&exportType=' + (command === 'current' ? 'exportCurrent' : ''))
    }
  },
  watch: {
    '$store.state.asideTowHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.height = newVal
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.energy
  border 2px solid #303a5ecc
  box-shadow 3px 3px 6px 1px rgba(0, 0, 0, .2)
  -webkit-border-radius 10px
  -moz-border-radius 10px
  border-radius 10px
.border-clc
  padding 5px
  border-radius 10px
  border 1px solid #ccc
</style>
