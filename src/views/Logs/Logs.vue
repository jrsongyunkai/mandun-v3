<template>
  <el-row :gutter="20" style="margin: 0; padding:20px">
    <el-col>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item class="pointer" @click.native="$router.go(-1)">{{ $t('btns.back') }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $t('home.operationLog') }}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col class="mt-20">
      <el-form :inline="true" class="tr" :model="logsForm">
        <el-form-item :label="$t('main.date')">
          <div class="block" id="logs-popper">
            <el-date-picker
              v-model="logsForm.date"
              type="daterange"
              size="small"
              popper-class="logs-popper"
              value-format="yyyy-MM-dd"
              :clearable="false"
              :editable="false"
              :range-separator="$t('table.to')"
              :start-placeholder="$t('table.startDate')"
              :end-placeholder="$t('table.endDate')"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item>
          <el-autocomplete
            v-model="logsForm.member"
            suffix-icon="el-icon-user"
            size="small"
            :fetch-suggestions="querySearch"
            :debounce="0"
            :placeholder="$t('system.associatedMember')"
            @input="handleInput"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="logsForm.keyword"
            size="small"
            :placeholder="$t('placeholder.inputKeySign')"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="logsOnSubmit">{{ $t('btns.query') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-dropdown trigger="click" @command="handleExportLogsCommand">
            <el-button size="small">
              {{ $t('home.export') }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="current">{{ $t('btns.exportCurrent') }}</el-dropdown-item>
              <el-dropdown-item command="all">{{ $t('btns.exportAll') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
      <el-table :data="logsData" style="width: 100%">
        <el-table-column prop="staffName" :label="$t('table.oper_name')" align="center" width="120"></el-table-column>
        <el-table-column prop="keyId" :label="$t('table.key_sign')" align="center"></el-table-column>
        <el-table-column
          prop="loginChannel"
          :label="$t('table.login_channel')"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column prop="operateTime" :label="$t('table.operate_time')" align="center"></el-table-column>
        <el-table-column prop="remark" :label="$t('table.descript')" align="center"></el-table-column>
        <el-table-column prop="clientIp" :label="$t('table.client_ip')" align="center"></el-table-column>
        <el-table-column :label="$t('table.parameter')" align="center">
          <template slot-scope="scope">
            <el-popover placement="bottom" width="200" trigger="click">
              <json-viewer v-if="logsView" :value="logsView"></json-viewer>
              <i class="el-icon-view pointer" slot="reference" @click="handleViewLogs(scope.row)"></i>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col class="tc mt-10">
      <el-pagination
        @size-change="handleSizeChange"
        :page-sizes="[20, 50, 100, 500]"
        :page-size="logsPageSize"
        layout="sizes">
      </el-pagination>
      <el-button-group>
        <el-button size="small" @click="handleLogsPage('home')">{{ $t('system.home') }}</el-button>
        <el-button
          size="small"
          @click="handleLogsPage('prev')"
          :disabled="logsPageNo === 1"
        >{{ $t('btns.prev') }}</el-button>
        <el-button
          size="small"
          @click="handleLogsPage('next')"
          :disabled="logsData === undefined || logsData.length !== 20"
        >{{ $t('btns.next') }}</el-button>
      </el-button-group>
    </el-col>
  </el-row>
</template>
<script>
/* global ctxPaths */
import JsonViewer from 'vue-json-viewer'
import { queryOperateLog, findParamsById, queryFollwerByStaff } from '@/api/api'
export default {
  data () {
    return {
      logsData: [],
      logsForm: {
        keyword: '',
        member: '',
        staffId: '',
        date: [this.$func.getNowFormatDate(), this.$func.getNowFormatDate()]
      },
      logsPageNo: 1,
      logsPageSize: 20,
      logsView: '',
      members: []
    }
  },
  mounted () {
    this.logsOnSubmit()
    this.handleLoadAll()
  },
  methods: {
    logsOnSubmit () {
      if (!this.logsForm.date) {
        this.$message({
          message: this.$t('message.dateRequired'),
          type: 'error'
        })
        return false
      }
      this.logsPageNo = 1
      this.queryOperateLogs()
    },
    queryOperateLogs () {
      let params = {
        pageNo: this.logsPageNo,
        pageSize: this.logsPageSize,
        order: 'desc',
        startTime: this.logsForm.date[0],
        endTime: this.logsForm.date[1],
        keyword: this.logsForm.keyword,
        staffId: this.logsForm.staffId
      }
      queryOperateLog(params)
        .then(res => {
          if (res.success) {
            this.logsData = res.datas
          } else if (res.code === '-1') {
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
    handleViewLogs (obj) {
      findParamsById({id: obj.id})
        .then(res => {
          this.logsView = ''
          this.logsView = res
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
    handleLogsPage (e) {
      if (e === 'home') {
        this.logsPageNo = 1
      } else if (e === 'prev') {
        if (this.logsPageNo !== 1) {
          this.logsPageNo -= 1
        } else {
          return false
        }
      } else if (e === 'next') {
        this.logsPageNo += 1
      }
      this.queryOperateLogs()
    },
    handleExportLogsCommand (command) {
      if (command === 'current') {
        if (this.$func.checkDateOneYear(this.logsForm.date[0], this.logsForm.date[1]) === 'true') {
          this.$func.windowCountDown(ctxPaths + '/operateLog/exportPageList.as?keyword=' + this.logsForm.keyword + '&startTime=' + this.logsForm.date[0] + '&endTime=' + this.logsForm.date[1] + '&staffId=' + this.logsForm.staffId + '&pageNo=' + this.logsPageNo + '&pageSize=' + this.logsPageSize + '&order=desc&export=' + command)
        } else {
          this.$message({
            message: this.$t('btns.exportCurrent') + this.$t('message.limitYear'),
            type: 'error'
          })
        }
      }
      if (command === 'all') {
        if (this.$func.checkDateOneMonth(this.logsForm.date[0], this.logsForm.date[1]) === 'true') {
          this.$func.windowCountDown(ctxPaths + '/operateLog/exportPageList.as?keyword=' + this.logsForm.keyword + '&startTime=' + this.logsForm.date[0] + '&endTime=' + this.logsForm.date[1] + '&staffId=' + this.logsForm.staffId + '&pageNo=' + this.logsPageNo + '&pageSize=' + this.logsPageSize + '&order=desc&export=' + command)
        } else {
          this.$message({
            message: this.$t('btns.exportAll') + this.$t('message.limitMonth'),
            type: 'error'
          })
        }
      }
    },
    handleSizeChange (val) {
      this.logsPageSize = val
      this.logsOnSubmit()
    },
    querySearch (queryString, cb) {
      let members = this.members
      let results = queryString ? members.filter(this.createFilter(queryString)) : members
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (member) => {
        return (member.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
      }
    },
    handleLoadAll () {
      queryFollwerByStaff({})
        .then(res => {
          this.members = res.data
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
    handleInput (val) {
      this.logsForm.staffId = val ? -2 : ''
    },
    handleSelect (item) {
      this.logsForm.staffId = item.staffId
    }
  },
  components: {
    JsonViewer
  }
}
</script>
<style lang="stylus" scoped>
#logs-popper .el-date-editor.el-input__inner
  width 300px
.el-pagination
  padding 0 5px
  margin-top 0
  display inline-block
  vertical-align middle
  .el-pagination__sizes, >>> span:not([class*=suffix]), >>> .el-input__inner
    margin-right 0
    height 34px
</style>
