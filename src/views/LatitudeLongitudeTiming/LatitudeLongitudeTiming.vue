<template>
  <div id="LatitudeLongitudeTiming">
    <el-col :span="7" class="mt-10">
      <el-button type="text" class="pointer c-default" @click="handleAdd"><i class="el-icon-plus"></i>{{ $t('system.add') + $t('control.timing') }}</el-button>
      <el-button type="text" :class="multipleSelection.length <= 0 ? 'c-info pointer' : 'c-default pointer'" :disabled="multipleSelection.length <= 0" @click="handleforceDel"><i class="el-icon-close"></i>{{ $t('table.batch') + $t('system.delete') }}</el-button>
    </el-col>
    <el-col :span="17" class="tr mt-10">
      <el-form :inline="true" :model="formInline" ref="formInline" size="small" class="form-wrap" @submit.native.prevent>
        <el-form-item>
          <el-input v-model="formInline.mac" :placeholder="$t('placeholder.enterDeviceNo')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('formInline')">{{ $t('btns.query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-dropdown trigger="click" size="small" @command="handleCommand">
            <el-button>
              {{ $t('btns.more') }}<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="all">{{ $t('btns.ExtractFromDevice')}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24">
      <el-table
        :data="latitudeData"
        size="small"
        :height="BuiltInTimingHeight"
        :max-height="BuiltInTimingHeight"
        v-el_scrollBar:scrollBar
        @selection-change="handleSelectionChange"
        style="width: 100%;">
        <el-table-column type="selection" align="center" width="50"></el-table-column>
        <el-table-column prop="others.address" align="center" :label="$t('table.location')"></el-table-column>
        <el-table-column prop="mac" align="center" :label="$t('table.deviceNo')">
          <template slot-scope="scope">
            <div>{{ scope.row.mac }}</div>
            <div>{{ scope.row.others.name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="others.titles" align="center" :label="$t('table.line')"></el-table-column>
        <el-table-column prop="weekday" align="center" :label="$t('table.cycle')"></el-table-column>
        <el-table-column align="center" :label="$t('dialog.time')">
          <template slot-scope="scope">
            <div>{{ scope.row.type === 2 ? $t('table.sunrise') : scope.row.type === 3 ? $t('table.sunset') : '' }}</div>
            <div>{{ scope.row.time }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" align="center" width="200" :label="$t('control.action')">
          <template slot-scope="scope">
            <div>{{ scope.row.status === 'true' ? $t('table.closing') : $t('table.opening') }}</div>
            <div v-if="scope.row.monitorTime !== 0">{{ scope.row.monitorTime ? (86400 > scope.row.monitorTime > 0) ? ($t('table.monitor') + '\xa0' + scope.row.monitorTime) : (($t('placeholder.LastExecutionTime') + '\xa0' + new Date(parseInt(scope.row.monitorTime) * 1000).toLocaleString().replace(/:\d{1,2}$/,' '))) : '' }}</div>
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
              <el-button class="c-default" @click="handleLatitudeLongitude(scope.row)" type="text" size="small">{{ $t('control.setting') + $t('table.LongitudeAndLatitude') }}</el-button>
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
        <el-button size="mini" @click="handleCurrentChange('next')" :disabled="latitudeData === undefined || latitudeData.length !== pageSize">{{ $t('btns.next') }}</el-button>
      </el-button-group>
    </el-col>
    <el-dialog :title="timingTitle" :close-on-click-modal="false" :modal="false" :visible.sync="timingFlag" width="680px">
      <Edit :options="timing" v-if="timingFlag" @queryList="init" @closeEdit="timingFlag = false" @handleLatitudeLongitude="handleLatitudeLongitude"></Edit>
    </el-dialog>
    <el-dialog
      :title="this.$t('dialog.prompt')"
      :visible.sync="delVisible"
      width="420px"
      top="45vh"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
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
    <el-dialog :title="$t('control.setting') + $t('table.LongitudeAndLatitude')" :close-on-click-modal="false" :modal="false" @close="handlelatitudeClose" :visible.sync="latitudeFlag" width="680px">
      <el-form :model="setupForm" label-width="120px" size="small">
        <el-form-item :label="$t('dialog.deviceNo') + '：'">
          <el-input style="width: 199px" :disabled="true" v-model="setupForm.mac"></el-input>
        </el-form-item>
        <el-form-item :label="$t('placeholder.longitudeVal') + '：'">
          <el-input style="width: 199px" v-model="setupForm.longitude"></el-input>
          <span class="pointer c-primary ml-20 mr-20" @click="handleRefresh">{{ $t('btns.refresh') }}</span>
          <span class="pointer c-primary" @click="handleExtract(setupForm.mac)">{{ $t('btns.ExtractFromDevice') }}</span>
        </el-form-item>
        <el-form-item :label="$t('placeholder.latitudeVal') + '：'">
          <el-input style="width: 199px" v-model="setupForm.latitude"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :disabled="setupForm.mac === '' || setupForm.longitude === '' || setupForm.latitude === ''">{{ $t('btns.save') }}</el-button>
        </el-form-item>
      </el-form>
      <div>
        <div class="description-title">{{ $t('control.explanation') + '：'}}</div>
        <div class="description">{{ '1. ' + $t('control.description1') }}</div>
        <div class="description">{{ '2. ' + $t('control.description3') }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { timeingList, findById, delTiming, longitudeAndLatitude, refreshLongitudeLatitude, setLongitudeLatitude, downGetTime } from '@/api/api'
import Edit from './Edit'
export default {
  components: {
    Edit
  },
  data () {
    return {
      formInline: {
        mac: ''
      },
      setupForm: {
        mac: '',
        longitude: '',
        latitude: ''
      },
      multipleSelection: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      rowList: {},
      latitudeData: [],
      timingTitle: '',
      checked: false,
      timingFlag: false,
      msgboxFlag: false,
      delVisible: false,
      latitudeFlag: false,
      returnFlag: false,
      forceDelData: [],
      BuiltInTimingHeight: this.$store.state.BuiltInTimingHeight,
      timing: {
        mac: '',
        autoid: '',
        channel: '',
        weekday: '',
        time: '',
        type: '',
        monitorTime: '',
        status: '',
        tags: ''
      }
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
    queryList () {
      let params = {
        projectCode: this.$store.state.projectCode,
        mac: this.formInline.mac,
        type: '2,3',
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      timeingList(params)
        .then(res => {
          if (res.success) {
            this.total = res.total
            this.latitudeData = res.datas
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
    handleAdd () {
      this.timing = {
        mac: '',
        autoid: '',
        channel: '',
        weekday: '',
        time: '',
        type: '',
        monitorTime: '',
        status: '',
        tags: ''
      }
      this.timingTitle = this.$t('btns.add') + this.$t('control.builtIn') + this.$t('table.LongitudeLatitude') + this.$t('control.timing')
      this.timingFlag = true
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.currentPage = 1
          this.queryList()
        } else {
          return false
        }
      })
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
              type: data.type,
              monitorTime: data.monitorTime,
              status: data.status,
              tags: tags
            }
            this.timingTitle = this.$t('control.edit') + this.$t('control.builtIn') + this.$t('table.LongitudeLatitude') + this.$t('control.timing')
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
    handleLatitudeLongitude (row) {
      this.rowList = row
      this.setupForm.mac = row.mac
      if (row.flag === 'ture') {
        this.returnFlag = true
      } else {
        this.returnFlag = false
      }
      this.setLatitudeLongitude()
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
    },
    setLatitudeLongitude () {
      this.timingFlag = false
      this.latitudeFlag = true
    },
    handleRefresh () {
      refreshLongitudeLatitude({mac: this.setupForm.mac})
        .then(res => {
          if (res.success) {
            this.setupForm = {
              mac: this.setupForm.mac,
              longitude: res.data.longitude,
              latitude: res.data.latitude
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
    handleExtract (mac) {
      longitudeAndLatitude({mac: mac})
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
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
    handleSubmit () {
      setLongitudeLatitude(this.setupForm)
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.handlelatitudeClose()
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
    handleCommand (command) {
      if (command === 'all') {
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
      }
    },
    handlelatitudeClose () {
      if (this.returnFlag) {
        this.latitudeFlag = false
        this.timingFlag = true
        this.timing = {
          mac: this.rowList.mac,
          autoid: this.rowList.autoid,
          weekday: this.rowList.week,
          time: this.rowList.time,
          type: this.rowList.type,
          monitorTime: this.rowList.monitorTime,
          status: this.rowList.action,
          tags: this.rowList.tags
        }
      } else {
        this.latitudeFlag = false
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
  }
}
</script>

<style lang="stylus" scoped>
#LatitudeLongitudeTiming >>> .el-form-item__label, .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner, .el-breadcrumb__item:last-child .el-breadcrumb__inner a, .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover, .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover, .el-breadcrumb__inner a, .el-breadcrumb__inner.is-link, .el-breadcrumb__separator, .el-breadcrumb__inner.is-link:hover
              color #333
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
</style>
