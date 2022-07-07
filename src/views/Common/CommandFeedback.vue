<template>
  <div id="CommandFeedback">
    <el-row>
      <el-col class="mt-5" v-if="classFlag" :span="24">
        <el-col :span="6" class="left-padding-right ml-5">
          <el-date-picker
            size="small"
            v-model="value1"
            type="daterange"
            :range-separator="$t('table.to')"
            :start-placeholder="$t('table.startDate')"
            :end-placeholder="$t('table.endDate')">
          </el-date-picker>
        </el-col>
        <el-col :span="4" class="left-padding-right ml-5" v-if="allInstructions">
          <el-input size="small" v-model="allInstructionsMac" :placeholder="$t('table.pleaseEnter') + $t('table.deviceNo')"></el-input>
        </el-col>
        <el-col :span="4" class="left-padding-right ml-5">
          <el-button size="small" type="primary" @click="searchList">{{ $t('btns.query') }}</el-button>
        </el-col>
      </el-col>
      <el-col class="mt-5" :span="24">
          <div>
            <el-table
              :class="classFlag ? 'device-wrap' : ''"
              v-el_scrollBar:scrollBar
              :height="classFlag ? '69vh' : '63vh'"
              :data="tableData"
              style="width: 100%">
              <el-table-column
                align="center"
                prop="location"
                :label="$t('table.position')">
              </el-table-column>
              <el-table-column
                align="center"
                prop="mac"
                :label="$t('dialog.deviceNo')">
              </el-table-column>
              <el-table-column
                align="center"
                prop="createTime"
                :label="$t('table.startTime')">
              </el-table-column>
              <el-table-column
                align="center"
                min-width="150"
                :label="$t('table.instructionDescription')">
                <template slot-scope="scope">
                  <div style="white-space: pre-line;">{{ scope.row.paramDesc }}</div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :label="$t('footer.current') + $t('btns.execute') + $t('table.status')">
                <template slot-scope="scope">
                  <span>{{ scope.row.stage === 0 ? $t('table.launched') : scope.row.stage === 1 ? $t('table.hasIssued') : scope.row.stage === 2 ? $t('table.deviceCommand') : scope.row.stage === 3 ? $t('table.queryResults') : scope.row.stage === 4 ? $t('table.responseReceivedDevice') : $t('table.notIssued') }}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                width="70"
                :label="$t('table.detailed')">
                <template slot-scope="scope">
                    <el-button style="color: #409eff" type="text" @click="handleView(scope.row)" >{{ $t('btns.view') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
      </el-col>
      <el-col class="tc mt-5">
        <el-col :span="11" class="tr">
          <el-pagination
            @size-change="handleSizeChange"
            :page-sizes="[10, 20, 30]"
            :page-size="pageSize"
            small
            layout="sizes">
          </el-pagination>
        </el-col>
        <el-col :span="13" class="tl">
          <el-button-group class="mt-5">
            <el-button size="mini" @click="handleCurrentChange('home')" :disabled="currentPage === 1 && (typeof tableData === 'undefined' || tableData.length === 0)">{{ $t('system.home') }}</el-button>
            <el-button size="mini" @click="handleCurrentChange('prev')" :disabled="currentPage === 1">{{ $t('btns.prev') }}</el-button>
            <el-button size="mini" @click="handleCurrentChange('next')" :disabled="typeof tableData === 'undefined' || tableData.length !== pageSize">{{ $t('btns.next') }}</el-button>
          </el-button-group>
        </el-col>
      </el-col>
      <el-dialog
      :modal="false"
      style="height:800px;overflow: hidden"
      :title="$t('table.instruction') + $t('table.detailed') + $t('control.recording')"
      custom-class="custom-select-dialog"
      :visible.sync="commandViewFlag">
        <el-table
          v-el_scrollBar:scrollBar
          height="60vh"
          class="device-wrap mt-10"
          :data="viewData"
          style="width: 100%">
          <el-table-column
            align="center"
            prop="stageTime"
            :label="$t('dialog.time')">
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('table.commandPhase')">
            <template slot-scope="scope">
              <span v-if="scope.row.stage === 0">{{ $t('table.launched') }}</span>
              <span v-else-if="scope.row.stage === 1">{{ $t('table.hasIssued') }}</span>
              <span v-else-if="scope.row.stage === 2">{{ $t('table.deviceCommand') }}</span>
              <span v-else-if="scope.row.stage === 3">{{ $t('table.queryResults') }}</span>
              <span v-else-if="scope.row.stage === 4">{{ $t('table.responseReceivedDevice') }}</span>
              <span v-else-if="scope.row.stage === 9">{{ $t('table.notIssued') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('control.result') + $t('table.descript')">
            <template slot-scope="scope">
              <span v-if="scope.row.stage === 0">{{ $t('control.normal') }}</span>
              <span v-else-if="scope.row.stage === 1">{{ $t('control.normal') }}</span>
              <span v-else-if="scope.row.stage === 2">{{ $t('control.normal') }}</span>
              <span v-else-if="scope.row.stage === 3">{{ $t('control.normal') }}</span>
              <span v-else style="white-space: pre-line;">{{ scope.row.responseDesc }}</span>
            </template>
          </el-table-column>
        </el-table>
        </el-dialog>
    </el-row>
  </div>
</template>

<script>
import { cmdFeedBack, cmdQueryHistory } from '@/api/api'
export default {
  components: {},
  props: {
    instructionsData: {
      type: Object,
      default () {
        return {}
      }
    },
    operateAt: {
      type: Number
    },
    classFlag: {
      type: Boolean
    },
    allInstructions: {
      type: Boolean
    },
    feedbackTime: {
      type: Array
    }
  },
  data () {
    return {
      tableData: [],
      viewData: [],
      commandViewFlag: false,
      allInstructionsMac: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      lastId: '',
      prevId: [''],
      value1: ''
    }
  },
  created () {},
  mounted () {
    this.value1 = this.feedbackTime ? this.feedbackTime : [this.$func.formatDate('yyyy-MM-dd HH:mm:ss', new Date() - 86400000 * 7), this.$func.getNowFormatDateTime()]
    this.init()
  },
  methods: {
    init () {
      this.queryList()
    },
    searchList () {
      if (this.allInstructions) {
        this.instructionsData.mac = this.allInstructionsMac
      }
      this.lastId = ''
      this.queryList()
    },
    queryList () {
      let params = {
        lastId: this.lastId,
        pageSize: this.pageSize,
        operateAt: this.operateAt,
        mac: this.instructionsData.mac,
        projectCode: this.instructionsData.projectCode,
        operateParam: this.operateAt === 4 ? this.instructionsData.autoId : this.instructionsData.sceneId,
        startTime: this.value1 ? this.$func.formatDate('yyyy-MM-dd', this.value1[0]) : '',
        endTime: this.value1 ? this.$func.formatDate('yyyy-MM-dd', this.value1[1]) : ''
      }
      cmdFeedBack(params)
        .then(res => {
          if (res.success) {
            this.total = res.total
            this.tableData = res.data
            if (res.data.length > 0 && res.data.length === this.pageSize) {
              this.lastId = res.data[res.data.length - 1].id
            } else {
              this.lastId = ''
            }
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
    handleSizeChange (val) {
      this.pageSize = val
      this.prevId = ['']
      this.lastId = ''
      this.currentPage = 1
      this.queryList()
    },
    handleCurrentChange (e) {
      if (e === 'home') {
        this.prevId = ['']
        this.lastId = ''
        this.currentPage = 1
      } else if (e === 'prev') {
        if (this.currentPage !== 1) {
          this.currentPage -= 1
          this.prevId.pop()
          this.lastId = this.prevId[this.prevId.length - 1]
        } else {
          return false
        }
      } else if (e === 'next') {
        this.currentPage += 1
        this.prevId.push(this.tableData[this.tableData.length - 1].id)
      }
      this.queryList()
    },
    handleView (row) {
      this.commandViewFlag = true
      let params = {
        feedBackId: row.id
      }
      cmdQueryHistory(params)
        .then(res => {
          if (res.success) {
            this.viewData = res.data
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
    handleFeedBackList () {
      this.lastId = ''
      this.queryList()
    }
  },
  watch: {
    'feedbackTime': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.value1 = newVal
        }
        if (newVal === null) {
          this.value1 = ''
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.device-wrap
  border none
  border 1px solid #EBEEF5
  color #606266
  >>> .el-table__header-wrapper, >>> .el-table__body-wrapper
      th, tr, td
        color #606266
        border-right 1px solid #EBEEF5
      td, th.is-leaf
        border-bottom 1px solid #EBEEF5
.el-button--text
  color #409EFF
#CommandFeedback
  >>> .block .el-date-editor.el-input, .el-date-editor.el-input__inner, .short-input
        width 100%
</style>
