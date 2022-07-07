<template>
    <div id="SavingScheme">
      <el-row class="energy ml-10" :style="{height: height}">
        <el-col :span="24">
          <el-button type="text" class="ml-10 c-default" icon="el-icon-plus" @click="handleAddScheme">新增计划用能</el-button>
        </el-col>
        <el-col :span="24">
          <el-table
            :data="tableData"
            :height="tableComponentHeight"
            :max-height="tableComponentHeight"
            v-el_scrollBar:scrollBar
            style="width: 100%">
            <el-table-column
              align="center"
              lable="排序"
              type="index"
              width="50">
            </el-table-column>
            <el-table-column
              align="center"
              property="areaName"
              label="区域层级"
              width="120">
            </el-table-column>
            <el-table-column
              property="years"
              align="center"
              label="年份"
              width="120">
            </el-table-column>
            <el-table-column
              align="center"
              property="electricPlan"
              label="年度计划用能(KWh)">
            </el-table-column>
            <el-table-column
              align="center"
              property="electricReal"
              label="实际用能(KWh)">
            </el-table-column>
            <el-table-column
              align="center"
              property=""
              label="实际/计划占比">
              <template slot-scope="scope">
                <span>{{ scope.row.elecricRate + '%' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="状态">
              <template slot-scope="scope">
                <span>{{ scope.row.cstatus === 1 ? '正常' : '不正常' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              label="操作">
              <template slot-scope="scope">
                <el-button class="c-default" @click="hangleDecompose(scope.row)" type="text">分解计划</el-button>
                <el-button class="c-default" type="text" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button class="c-default" type="text" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
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
        </el-col>
      </el-row>
      <el-dialog
        :title="schemeTitle"
        custom-class="custom-class"
        :close-on-click-modal="false"
        :modal="false"
        width="1000px"
        :visible.sync="schemeFlag">
        <div style="margin: 5px 20px">
          <el-row>
            <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
              <el-form-item label="年份" required>
                <el-date-picker
                  v-model="formInline.year"
                  type="year"
                  value-format="yyyy"
                  format="yyyy"
                  placeholder="选择年">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="选择层级" required>
                <el-cascader
                  :show-all-levels="false"
                  v-model="formInline.hierarchy"
                  :options="options"
                  :props="{ value: 'id', label: 'areaName', checkStrictly: true }"
                  clearable>
                </el-cascader>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :disabled="formInline.hierarchy.length === 0" @click="onSubmit">查询</el-button>
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-table
              class="device-wrap"
              :data="yearData"
              height="500px"
              v-el_scrollBar:scrollBar
              style="width: 100%">
              <el-table-column
                align="center"
                label="日期">
                <template slot-scope="scope">{{ scope.row.month + '月' }}</template>
              </el-table-column>
              <el-table-column
                align="center"
                label="设置计划用能(kwh)">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.num" size="small" :min="0"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                prop="energy"
                align="center"
                label="去年同比实际用能(kwh)">
              </el-table-column>
            </el-table>
            <div v-show="total > 0">总计计划用能：{{ total + 'kwh'}}</div>
            <el-col :span="24" class="tr mt-10">
              <el-button type="primary" size="small" plain @click="handleClose">取消</el-button>
              <el-button type="primary" size="small" @click="handleConfirm">确认</el-button></el-col>
          </el-row>
        </div>
      </el-dialog>
      <el-dialog
        title="分解年计划用能"
        custom-class="custom-class"
        :close-on-click-modal="false"
        :modal="false"
        width="1000px"
        :visible.sync="decomposeFlag">
        <div style="margin: 5px 5px">
          <el-row>
            <el-col :span="9">年份：{{ decomposeList.years }}</el-col>
            <el-col :span="9" class="title" :title="decomposeList.areaName">层级：{{ decomposeList.areaName }}</el-col>
            <el-col :span="6" class="title" :title="decomposeList.electricPlan + 'kwh'">总计计划用能： {{ decomposeList.electricPlan }}kwh</el-col>
          </el-row>
          <el-row>
            <el-col :span="3" class="tc">
              <div class="fs-18 mt-20">月份:</div>
            </el-col>
            <el-col :span="21">
              <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
                <el-menu-item v-for="(item, index) in 12" :index="index" :key="index">{{item + '月'}}</el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
          <el-row style="border: 1px solid #ccc;padding: 5px 5px" v-show="false">
            <el-col :span="12" style="margin-top: 8px">
              <div>月度总计划用能: -- kwh</div>
            </el-col>
            <el-col :span="12" class="tr">
              <el-button type="primary" disabled size="small">平均分配</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-table
              class="device-wrap mt-10"
              :data="energyYearData"
              height="500px"
              v-el_scrollBar:scrollBar
              style="width: 100%;margin-bottom: 20px;"
              row-key="id"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
              <el-table-column
                prop="areaName"
                label="区域层级">
              </el-table-column>
              <el-table-column
                align="center"
                label="设置计划用能(kwh)">
                <template slot-scope="scope">
                  <el-input-number v-model="scope.row.num" size="small" :min="0"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="energy"
                label="去年同期用能">
              </el-table-column>
            </el-table>
            <el-col :span="24" class="tr mt-10">
              <el-button type="primary" size="small" plain @click="handlesetClose">取消</el-button>
              <el-button type="primary" size="small" @click="handkeOk">确认</el-button></el-col>
          </el-row>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import { seekAreaEnergyPlanList, seekAreaEnergyPlanByYear, seekAreaListTreeByProject, addAreaEnergyPlan, delAreaEnergyPlan } from '@/api/api'
export default {
  components: {},
  data () {
    return {
      height: this.$store.state.asideTowHeight,
      schemeTitle: '',
      tableData: [],
      yearData: [],
      schemeFlag: false,
      seachFlag: 'add',
      decomposeFlag: false,
      decomposeList: {},
      formInline: {
        year: new Date().getFullYear() + '',
        hierarchy: ''
      },
      options: [],
      electricPlans: [],
      energyYearData: [],
      pageNo: 1,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      activeIndex: 0,
      tableComponentHeight: this.$store.state.asideHeight
    }
  },
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.seekAreaEnergyPlan()
    },
    seekAreaEnergyPlan () {
      let params = {
        projectCode: this.$store.state.projectCode,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
      seekAreaEnergyPlanList(params)
        .then(res => {
          if (res.success) {
            this.total = res.total
            this.tableData = res.datas
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
      this.total = []
      let params = {
        areaId: this.formInline.hierarchy[this.formInline.hierarchy.length - 1] ? this.formInline.hierarchy[this.formInline.hierarchy.length - 1] : this.formInline.hierarchy,
        year: this.formInline.year
      }
      if (this.seachFlag === 'add') {
        seekAreaEnergyPlanByYear(params)
          .then(res => {
            if (res.success) {
              this.yearData = []
              for (let i = 1; i < 13; i++) {
                this.yearData.push({
                  month: i,
                  energy: 0,
                  num: 0
                })
              }
              if (res.data.length > 0) {
                res.data[0].energys.split(',').forEach((item, index) => {
                  this.yearData.forEach(f => {
                    if (f.month === (index + 1)) {
                      f.energy = item
                    }
                  })
                })
                res.data[0].energySet.split(',').forEach((item, index) => {
                  this.yearData.forEach(f => {
                    if (f.month === (index + 1)) {
                      f.num = item
                    }
                  })
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
      } else if (this.seachFlag === 'edit') {
        seekAreaEnergyPlanByYear(params)
          .then(res => {
            if (res.success) {
              this.yearData = []
              for (let i = 1; i < 13; i++) {
                this.yearData.push({
                  month: i,
                  num: 0,
                  energy: 0
                })
              }
              this.total = res.data.total
              if (res.data.length > 0) {
                res.data[0].energys.split(',').forEach((item, index) => {
                  this.yearData.forEach(f => {
                    if (f.month === (index + 1)) {
                      f.energy = item
                    }
                  })
                })
                res.data[0].energySet.split(',').forEach((item, index) => {
                  this.yearData.forEach(f => {
                    if (f.month === (index + 1)) {
                      f.num = item
                    }
                  })
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
      }
    },
    handleAddScheme () {
      this.seachFlag = 'add'
      this.schemeTitle = '新增计划用能'
      this.handleSeekAreaListTree()
      this.$nextTick(() => {
        this.schemeFlag = true
      })
    },
    handleSeekAreaListTree (areaId) {
      let params = {
        areaId: areaId
      }
      seekAreaListTreeByProject(params)
        .then(res => {
          if (res.success) {
            this.options = res.data
            if (res.data.length > 0) {
              this.formInline.hierarchy = res.data[0].id
            }
            this.onSubmit()
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
      this.seekAreaEnergyPlan()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.seekAreaEnergyPlan()
    },
    handleConfirm () {
      let energyPlans = []
      this.yearData.forEach(element => {
        energyPlans.push({
          areaId: this.formInline.hierarchy[this.formInline.hierarchy.length - 1] ? this.formInline.hierarchy[this.formInline.hierarchy.length - 1] : this.formInline.hierarchy,
          years: +this.formInline.year,
          months: element.month,
          electricPlan: element.num
        })
      })
      let parmas = energyPlans
      addAreaEnergyPlan(parmas)
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.init()
            this.schemeFlag = false
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
    handleClose () {
      this.schemeFlag = false
    },
    hangleDecompose (row) {
      this.seachFlag = ''
      this.decomposeList = row
      this.handleSeekAreaListTree(row.areaId)
      this.hanldeseekAreaEnergyPlanByYear(row)
      this.$nextTick(() => {
        this.handleSelect(0)
      })
      this.decomposeFlag = true
    },
    handleEdit (row) {
      this.schemeTitle = '编辑计划用能'
      this.seachFlag = 'edit'
      this.formInline = {
        year: row.years + '',
        hierarchy: row.areaId
      }
      this.handleSeekAreaListTree(row.areaId)
      this.$nextTick(() => {
        this.schemeFlag = true
      })
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除该计划用能, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let parmas = {
          areaId: row.areaId,
          year: row.years
        }
        delAreaEnergyPlan(parmas)
          .then(res => {
            if (res.success) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.seekAreaEnergyPlan()
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    hanldeseekAreaEnergyPlanByYear (row) {
      let params = {
        areaId: row.areaId,
        year: row.years
      }
      seekAreaEnergyPlanByYear(params)
        .then(res => {
          if (res.success) {
            this.energyYearData = res.data
            this.setName(this.energyYearData, this.activeIndex)
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
    setName (datas, activeIndex) {
      for (let i in datas) {
        datas[i].energy = datas[i].energys.split(',')[activeIndex]
        datas[i].num = datas[i].energySet.split(',')[activeIndex]
        if (datas[i].children) {
          this.setName(datas[i].children, activeIndex)
        } else {
          return datas
        }
      }
    },
    setElectric (arr) {
      for (let i in arr) {
        this.electricPlans.push({
          areaId: arr[i].id,
          years: this.decomposeList.years,
          months: this.activeIndex + 1,
          electricPlan: +(arr[i].num)
        })
        if (arr[i].children) {
          this.setElectric(arr[i].children)
        } else {
        }
      }
    },
    handleSelect (val) {
      this.activeIndex = val
      this.electricPlans = []
      this.setName(this.energyYearData, this.activeIndex)
      let dataArrTemp = JSON.stringify(this.energyYearData)
      this.energyYearData = JSON.parse(dataArrTemp)
    },
    handkeOk () {
      this.electricPlans = []
      this.setElectric(this.energyYearData)
      let parmas = this.electricPlans
      addAreaEnergyPlan(parmas)
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.decomposeFlag = false
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
    handlesetClose () {
      this.decomposeFlag = false
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
    '$store.state.asideHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.tableComponentHeight = newVal
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
/deep/ .custom-class .el-form-item__label
          color #606266
.device-wrap
  border none
  border-top 1px solid #EBEEF5
  border-left 1px solid #EBEEF5
  color #606266
  >>> .el-table__header-wrapper, >>> .el-table__body-wrapper
      th, tr, td
        color #606266
        border-right 1px solid #EBEEF5
      td, th.is-leaf
        border-bottom 1px solid #EBEEF5
.el-button--text
  color #409EFF
.title
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
</style>
