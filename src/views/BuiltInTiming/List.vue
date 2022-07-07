<template>
  <div id="BuiltInTiming">
    <el-col :span="7" class="mt-10">
      <el-button type="text" class="pointer c-default" @click="handleAdd"><i class="el-icon-plus"></i>{{ $t('system.add') + $t('control.timing') }}</el-button>
      <el-button type="text" :class="multipleSelection.length <= 0 ? 'c-info pointer' : 'c-default pointer'" :disabled="multipleSelection.length <= 0" @click="handleforceDel"><i class="el-icon-close"></i>{{ $t('table.batch') + $t('system.delete') }}</el-button>
      <el-button type="text" :class="multipleSelection.length <= 0 ? 'c-info pointer' : 'c-default pointer'" :disabled="multipleSelection.length <= 0" @click="handleforceEdit"><i class="el-icon-edit-outline"></i>{{ $t('table.batch') + $t('control.edit') }}</el-button>
    </el-col>
    <el-col :span="17" class="tr mt-10">
      <el-form :inline="true" :model="formInline" ref="formInline" size="small" class="form-wrap" @submit.native.prevent>
        <el-form-item>
          <el-button type="text" class="pointer c-default fs-14" @click="viewAllInstruction">{{ $t('btns.view') + $t('placeholder.all') + $t('table.instruction') + $t('table.history') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.mac" :placeholder="$t('placeholder.enterDeviceNo')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="formInline.action" clearable class="w-100" :placeholder="$t('control.action')">
            <el-option
              v-for="item in actionTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('formInline')">{{ $t('btns.query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-dropdown trigger="click" @command="handleCommand">
            <el-button>
              {{ $t('btns.more') }}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="all">{{ $t('btns.exportAll') }}</el-dropdown-item>
              <el-dropdown-item command="current">{{ $t('btns.exportCurrent') }}</el-dropdown-item>
              <el-dropdown-item command="extract">{{ $t('btns.ExtractFromDevice') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24">
      <el-table
        :data="data"
        ref="sort"
        size="small"
        :height="BuiltInTimingHeight"
        :max-height="BuiltInTimingHeight"
        v-el_scrollBar:scrollBar
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
        style="width: 100%;">
        <el-table-column type="selection" align="center" width="50"></el-table-column>
        <el-table-column prop="others.address" align="center" :label="$t('table.location')"></el-table-column>
        <el-table-column prop="mac" sortable align="center" :label="$t('table.deviceNo')">
          <template slot-scope="scope">
            <div>{{ scope.row.mac }}</div>
            <div>{{ scope.row.others.name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="others.titles" align="center" :label="$t('table.line')"></el-table-column>
        <el-table-column prop="weekday" sortable align="center" :label="$t('table.cycle')"></el-table-column>
        <el-table-column prop="time" sortable align="center" :label="$t('dialog.time')"></el-table-column>
        <el-table-column prop="status" sortable align="center" width="80" :label="$t('control.action')">
          <template slot-scope="scope">
            <span>{{ scope.row.status === 'true' ? $t('table.closing') : $t('table.opening') }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operating"
          align="center"
          width="200"
          :label="$t('table.operating')">
            <template slot-scope="scope">
              <el-button class="c-default" @click="handleEdit(scope.row)" type="text" size="small">{{ $t('control.edit') }}</el-button>
              <el-button class="c-default" @click="handleDelete(scope.row)" type="text" size="small">{{ $t('system.delete') }}</el-button>
              <el-button class="c-default" @click="handleExecute(scope.row.mac, scope.row.channelAddrs, scope.row.status === 'true' ? true : false, scope.row, scope.row.autoId)" :disabled="config.authority.CTL_AUTHORITY === 'false'" type="text" size="small">{{ $t('btns.execute') }}</el-button>
              <el-button class="c-default" @click="handleInstructions(scope.row)" type="text" size="small">{{ $t('table.instruction') + $t('table.history') }}</el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col class="tc mt-5">
      <el-pagination
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 30]"
        :page-size="pageSize"
        small
        layout="sizes">
      </el-pagination>
      <el-button-group>
        <el-button size="mini" @click="handleCurrentChange('home')">{{ $t('system.home') }}</el-button>
        <el-button size="mini" @click="handleCurrentChange('prev')" :disabled="currentPage === 1">{{ $t('btns.prev') }}</el-button>
        <el-button size="mini" @click="handleCurrentChange('next')" :disabled="data === undefined || data.length !== pageSize">{{ $t('btns.next') }}</el-button>
      </el-button-group>
    </el-col>
    <el-dialog :title="timingTitle" :close-on-click-modal="false" :visible.sync="timingFlag" width="680px">
      <Edit :options="timing" v-if="timingFlag" @closeEdit="timingFlag = false"></Edit>
    </el-dialog>
    <el-dialog :title="$t('table.instruction') + $t('table.history') + $t('control.recording')" :close-on-click-modal="false" :modal="false" v-if="instructionsFlag" :visible.sync="instructionsFlag" custom-class="custom-select-dialog"   style="height:900px;overflow: hidden" width="1323px">
      <CommandFeedback :classFlag="true" :instructionsData="instructionsData" :operateAt="4" :allInstructions="allInstructions" ></CommandFeedback>
    </el-dialog>
    <el-dialog :title="$t('table.batch') + $t('control.edit') + $t('control.builtIn') + $t('control.timing')" :close-on-click-modal="false" :modal="false" :visible.sync="batchEditFlag" width="1000px">
      <BatchEdit :options="batchEditData" v-if="batchEditFlag" @closeBatchEdit="batchEditFlag = false"></BatchEdit>
    </el-dialog>
    <el-dialog
      :title="this.$t('dialog.prompt')"
      :visible.sync="delVisible"
      width="420px"
      top="45vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClose">
      <el-row>
        <el-col :span="24"  class="ml-20">
          <div class="el-message-box__status el-icon-warning" ></div>
        </el-col>
        <el-col :span="24" style="margin-left:50px">
          <div class="el-message-box__message">{{ $t('message.confirmDeleteTimer') }}</div>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-col :span="12" class="tl mt-10" v-show="msgboxFlag">
          <el-checkbox v-model="checked">{{ this.$t('message.deletePlatform') }}</el-checkbox>
        </el-col>
        <el-col :span="12" class="fr">
          <el-button size="small" @click="handleCancel">{{ $t('btns.cancel2') }}</el-button>
          <el-button size="small" type="primary" @click="handleOk">{{ $t('btns.ok2') }}</el-button>
        </el-col>
      </div>
    </el-dialog>
  </div>
</template>
<script>
/* global config */
/* global ctxPaths */
import { timeingList, delTiming, findById, verifyAuthCode, remotectrl, downGetTime } from '@/api/api'
import Edit from './Edit'
import BatchEdit from './BatchEdit'
import CommandFeedback from '../Common/CommandFeedback'
export default {
  data () {
    return {
      config: config,
      formInline: {
        mac: '',
        action: ''
      },
      data: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      timingFlag: false,
      timingTitle: '',
      timing: null,
      instructionsFlag: false,
      allInstructions: false,
      instructionsData: [],
      multipleSelection: [],
      forceDelData: [],
      BuiltInTimingHeight: this.$store.state.BuiltInTimingHeight,
      msgboxFlag: false,
      delVisible: false,
      checked: false,
      batchEditFlag: false,
      batchEditData: [],
      rowData: {},
      actionTypes: [
        {
          label: this.$t('table.closing'),
          value: true
        },
        {
          label: this.$t('table.opening'),
          value: false
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.$route.params.mac) {
        this.formInline.mac = this.$route.params.mac
      }
      this.queryList()
    },
    queryList (prop, order) {
      let params = {
        projectCode: this.$store.state.projectCode,
        mac: this.formInline.mac,
        status: this.formInline.action,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      if (prop) {
        params.sortName = prop
        if (order === 'ascending') {
          params.order = 'asc'
        } else if (order === 'descending') {
          params.order = 'desc'
        }
      }
      timeingList(params)
        .then(res => {
          if (res.success) {
            this.total = res.total
            this.data = res.datas
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
    sortChange ({column, prop, order}) {
      this.queryList(prop, order)
    },
    onSubmit (formName) {
      this.$refs.sort.clearSort()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.currentPage = 1
          this.queryList()
        } else {
          return false
        }
      })
    },
    handleAdd () {
      this.timing = {
        mac: '',
        autoid: '',
        channel: '',
        weekday: '',
        time: '',
        status: 'true',
        tags: []
      }
      this.timingTitle = this.$t('btns.add') + this.$t('control.builtIn') + this.$t('control.timing')
      this.timingFlag = true
    },
    handleEdit (row) {
      findById({id: row.id})
        .then(res => {
          if (res.success) {
            let data = res.data
            let titles = data.others.titles.split(',')
            let tags = []
            data.channelAddrs.split(',').map((item, index) => {
              tags.push({addr: item, title: titles[index]})
            })
            this.timing = {
              mac: data.mac,
              autoid: data.autoId,
              channel: data.channelAddrs,
              weekday: data.weekday ? data.weekday.replace(/,/g, '') : '',
              time: data.time,
              status: data.status,
              tags: tags
            }
            this.timingTitle = this.$t('control.edit') + this.$t('control.builtIn') + this.$t('control.timing')
            this.timingFlag = true
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
    handleDelete (row) {
      this.delVisible = true
      this.msgboxFlag = row.others.forceDeleteEnable
      this.rowData = row
    },
    handleforceDel () {
      this.msgboxFlag = this.delVisible = true
      this.rowData = {}
    },
    handleforceEdit () {
      this.batchEditFlag = true
    },
    handleBatchClose () {
      this.batchEditFlag = false
    },
    handleCancel () {
      this.$message({
        message: this.$t('message.undelete'),
        type: 'info'
      })
      this.checked = this.delVisible = false
    },
    handleOk () {
      let arr = []
      let params = {}
      if (Object.keys(this.rowData).length > 0) {
        params = {
          mac_autoids: this.rowData.mac ? [this.rowData.mac, this.rowData.autoId].join('_') : this.multipleSelection.join(','),
          _operate_at: 4
        }
      } else {
        params = {
          mac_autoids: this.multipleSelection.join(','),
          _operate_at: 4
        }
      }
      this.forceDelData.forEach(item => {
        if (!item.forceDel) arr.push(item.mac)
      })
      arr = Array.from(new Set(arr))
      if (this.checked && arr.length > 0 && Object.keys(this.rowData).length === 0) {
        this.checked = this.delVisible = false
        let errMsg = `<div style="color: #F56C6C">${this.$t('control.device') + '\xa0\xa0' + arr.join('\n') + '\xa0\xa0' + this.$t('message.notSupportedDelRecords')}</div>`
        this.$alert(errMsg, '', {
          dangerouslyUseHTMLString: true,
          showConfirmButton: false,
          callback: action => {}
        })
      } else {
        params.delFlag = this.checked ? 'Y' : ''
        delTiming(params)
          .then(res => {
            this.checked = this.delVisible = false
            if (res.success) {
              this.$message({
                message: res.message,
                type: 'success'
              })
            } else if (res.code === '-1') {
            } else {
              let errMsg = (res.data !== undefined && res.data.length > 0) ? res.data.map((item) => {
                if (item.errorMsg === '0') {
                  return `<div style="color: #67C23A">${item.mac + ':\xa0' + this.$t('message.controlSuccess')}</div>`
                } else {
                  return `<div style="color: #F56C6C">${item.mac + ':\xa0' + item.errorMsg}</div>`
                }
              }) : res.message
              this.$alert((res.data !== undefined && res.data.length > 0) ? errMsg.join('\n') : errMsg, '', {
                dangerouslyUseHTMLString: true,
                showConfirmButton: false,
                callback: action => {}
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
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val.map((item) => {
        return item.mac + '_' + item.autoId
      })
      this.forceDelData = val.map((item) => {
        return {
          mac: item.mac,
          forceDel: item.others.forceDeleteEnable
        }
      })
      this.batchEditData = val.map((item) => {
        return {
          autoId: item.autoId,
          channelAddrs: item.channelAddrs.split(','),
          mac: item.mac,
          others: {
            address: item.others.address,
            name: item.others.name,
            titles: item.others.titles.split(',')
          },
          weekday: item.weekday ? item.weekday.split('') : ''
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.queryList()
    },
    handleCurrentChange (e) {
      if (e === 'home') {
        this.currentPage = 1
      } else if (e === 'prev') {
        if (this.currentPage !== 1) {
          this.currentPage -= 1
        } else {
          return false
        }
      } else if (e === 'next') {
        this.currentPage += 1
      }
      this.queryList()
    },
    handleCommand (command) {
      if (command === 'extract') {
        if (this.formInline.mac === '') {
          this.$message({
            message: this.$t('table.pleaseEnter') + this.$t('dialog.deviceNo'),
            type: 'error'
          })
          return false
        }
        downGetTime({mac: this.formInline.mac})
          .then(res => {
            if (res.success) {
              if (res.code === '0') {
                this.$message({
                  type: 'success',
                  message: this.$t('message.controlSuccess')
                })
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
      } else {
        this.$func.windowCountDown(ctxPaths + '/timing/export.as?projectCode=' + this.$store.state.projectCode + '&mac=' + this.formInline.mac + '&pageNo=' + this.currentPage + '&timingType=' + '1' + '&pageSize=' + this.pageSize + '&type=' + (command === 'all' ? 'exportAll' : ''))
      }
    },
    handleExecute (mac, addr, opr, row, autoId) {
      if (this.config.authority.CTL_AUTHORITY === 'false') {
        this.$func.controlAuthority(this.config.authority.CTL_AUTHORITY)
        return false
      }
      this.$confirm(this.$t('message.confirmYouWant') + (opr ? this.$t('table.closing') : this.$t('table.opening')) + '?', this.$t('dialog.prompt'), {
        confirmButtonText: this.$t('btns.ok'),
        cancelButtonText: this.$t('btns.cancel'),
        type: 'warning'
      }).then(() => {
        if (this.config.authority.CTL_REQ_AUTHCODE === 'true') {
          this.$prompt(this.$t('message.enterAuthCode'), this.$t('dialog.prompt'), {
            confirmButtonText: this.$t('btns.ok'),
            cancelButtonText: this.$t('btns.cancel'),
            inputPattern: /^[0-9a-zA-Z]{4,16}$/,
            inputErrorMessage: this.$t('message.authCodeRule')
          }).then(({ value }) => {
            let params = {
              authCode: value
            }
            verifyAuthCode(params)
              .then(res => {
                if (res.success) {
                  if (res.data === true) {
                    let param = {
                      'cmd': 'OCSWITCH',
                      'mac': mac,
                      'value1': opr ? 'open' : 'close',
                      'value2': addr,
                      '_operate_at': 4 + ':' + autoId
                    }
                    remotectrl(param)
                      .then(res => {
                        if (res.success) {
                          if (res.code === '0') {
                            this.$message({
                              type: 'success',
                              message: this.$t('message.controlSuccess')
                            })
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
                  } else {
                    this.$message({
                      message: this.$t('message.authCodeInvalid'),
                      type: 'error'
                    })
                  }
                } else {
                  if (res.message) {
                    this.$message({
                      message: res.message,
                      type: 'error'
                    })
                  } else {
                    this.$message({
                      message: this.$t('message.unknown'),
                      type: 'error'
                    })
                  }
                }
                return false
              })
              .catch(err => {
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
              message: this.$t('message.cancelInput')
            })
          })
        } else {
          let _param = {
            'cmd': 'OCSWITCH',
            'mac': mac,
            'value1': opr ? 'open' : 'close',
            'value2': addr,
            '_operate_at': 4 + ':' + autoId
          }
          remotectrl(_param)
            .then(res => {
              if (res.success) {
                if (res.code === '0') {
                  this.$message({
                    type: 'success',
                    message: this.$t('message.controlSuccess')
                  })
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
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.cancelled')
        })
      })
    },
    handleInstructions (row) {
      this.allInstructions = false
      this.instructionsFlag = true
      this.instructionsData = row
      this.instructionsData.projectCode = this.$store.state.projectCode
    },
    viewAllInstruction () {
      this.allInstructions = this.instructionsFlag = true
      this.instructionsData = {
        projectCode: this.$store.state.projectCode
      }
    }
  },
  watch: {
    '$store.state.projectCode': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.init()
        }
      }
    },
    '$store.state.BuiltInTimingHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.BuiltInTimingHeight.height = newVal
        }
      }
    }
  },
  components: {
    Edit,
    BatchEdit,
    CommandFeedback
  }
}
</script>
<style lang="stylus" scoped>
.el-tabs__header, .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item
  margin-bottom 15px
.el-pagination
  padding 0
  margin-top 0
  display inline-block
  vertical-align middle
  .el-pagination__sizes, >>> span:not([class*=suffix]), >>> .el-input__inner
    margin-right 0
    height 28px
.dialog-footer
  height 20px
.w-100
  width 100px
</style>
