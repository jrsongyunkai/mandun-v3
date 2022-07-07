<template>
  <div id="alarm">
    <el-form :inline="true" :model="formInline" ref="formInline" size="small" class="form-wrap">
      <el-form-item>
        <el-date-picker
          v-model="formInline.rangeDate"
          type="daterange"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :editable="false"
          :range-separator="$t('table.to')"
          :start-placeholder="$t('table.startDate')"
          :end-placeholder="$t('table.endDate')">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input v-model="formInline.mac" :placeholder="$t('placeholder.enterDeviceNo')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('formInline')">{{ $t('btns.query') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-dropdown trigger="click" @command="handleCommand">
          <el-button>
            {{ $t('home.export') }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="current">{{ $t('btns.exportCurrent') }}</el-dropdown-item>
            <el-dropdown-item command="all">{{ $t('btns.exportAll') }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>
    <el-col :style="alarmTableHeight" v-el_scrollBar>
      <el-table
        :data="tableData"
        size="small"
        style="width: calc(100% - 20px);position: absolute;overflow: hidden;">
        <el-table-column
          prop="id"
          align="center"
          :label="$t('table.jobNumber')">
        </el-table-column>
        <el-table-column
          prop="onBur"
          align="center"
          :label="$t('table.location')">
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('table.deviceNo')">
          <template slot-scope="scope">
            <span class="c-default pointer" @click="handle(scope.row)">{{scope.row.mac}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="80"
          align="center"
          prop="chnlName"
          :label="$t('table.line')">
        </el-table-column>
        <el-table-column
          prop="ruleDesc"
          align="center"
          :label="$t('table.inspectionRules')">
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('table.exceptionDescription')">
          <template slot-scope="scope">
            {{ scope.row.errTime + '\xa0' + scope.row.errDesc }}
          </template>
        </el-table-column>
        <el-table-column
          prop="linkInfo"
          align="center"
          :label="$t('table.contact')">
          <template slot-scope="scope">
            <div>{{ scope.row.linkInfo.split(',')[0] }}</div>
            <div>{{ scope.row.linkInfo.split(',')[1] }}</div>
            <div>{{ scope.row.linkInfo.split(',')[2] }}</div>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col class="tc mt-20">
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
        <el-button size="mini" @click="handleCurrentChange('next')" :disabled="tableData === undefined || tableData.length !== pageSize">{{ $t('btns.next') }}</el-button>
      </el-button-group>
    </el-col>
    <el-dialog
      :title="$t('control.device') + $t('control.details')"
      :close-on-click-modal="false"
      custom-class="details-dialog"
      :modal="false"
      width="1323px"
      lock-scroll="false"
      :visible.sync="detailsFlag"
      :before-close="handleDetailsClose">
        <span class="offline-attention c-danger" :class="this.$i18n.locale === 'zh' ? '' : 'en-offline-attention'" v-show="detailsObj.others.online !== 1">{{ $t('control.offlineAttention') }}</span>
        <div class="date-picker">
          <el-button type="success" circle size="mini">{{ detailsObj.equipmentType === 6 || detailsObj.equipmentType === 7 ? $t('main.month') : $t('main.day') }}</el-button>
          <span>{{ $t('main.date') }}</span>
          <el-date-picker
            style="width: 135px"
            v-model="detailsValue"
            :type="detailsObj.equipmentType === 6 || detailsObj.equipmentType === 7 ? 'month' : 'date'"
            size="small"
             :clearable="false"
            @change="handleDateChange"
            :disabled="$store.state.dateFlag"
            :editable="false"
            :value-format="detailsObj.equipmentType === 6 || detailsObj.equipmentType === 7 ? 'yyyy-MM' : 'yyyy-MM-dd'"
            :placeholder="$t('placeholder.pleaseChoose') + $t('main.date')">
          </el-date-picker>
        </div>
      <el-scrollbar style="height: 100%;">
        <Details v-if="detailsFlag" :param="detailsObj"></Details>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>
<script>
/* global ctxPaths */
import { deStatuscanPage, queryBoxDetails, modifyMacRate } from '@/api/api'
import store from '@/store'
import Details from '../Control/Details'
export default {
  data () {
    return {
      formInline: {
        rangeDate: [this.$func.getNowFormatDate(), this.$func.getNowFormatDate()],
        mac: ''
      },
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      detailsFlag: false,
      detailsObj: {
        'others': {
          'version': '',
          'online': ''
        }
      },
      detailsValue: '',
      alarmTableHeight: {
        position: 'relative',
        height: this.$store.state.alarmTableHeight
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.queryList()
    },
    queryList () {
      let params = {
        projectCode: this.$store.state.projectCode,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        mac: this.formInline.mac,
        startTime: this.formInline.rangeDate[0],
        endTime: this.formInline.rangeDate[1]
      }
      if (this.$func.checkDateThreeMonths(params.startTime, params.endTime) === 'false') {
        this.$message({
          message: this.$t('message.limitThreeMonths'),
          type: 'error'
        })
        return false
      }
      deStatuscanPage(params)
        .then(res => {
          if (res.success) {
            this.currentPage = res.page
            this.total = res.total
            this.tableData = res.datas
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
    handle (row) {
      queryBoxDetails({'mac': row.mac})
        .then(res => {
          if (res.success) {
            this.detailsObj = res.data
            store.commit('mac', this.detailsObj.mac)
            store.commit('equipmentType', this.detailsObj.equipmentType)
            if (this.detailsObj.equipmentType === 6 || this.detailsObj.equipmentType === 7) {
              this.detailsValue = this.$func.getCurrentYearMonth()
            } else {
              this.detailsValue = this.$func.getNowFormatDate()
            }
            store.commit('historyDate', this.detailsValue)
            this.detailsFlag = true
            this.handleModifyMacRate(this.detailsObj.mac, true)
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
    handleDateChange (val) {
      this.value = val
      store.commit('historyDate', val)
    },
    handleDetailsClose () {
      if (this.detailsObj.equipmentType === 6 || this.detailsObj.equipmentType === 7) {
        this.detailsValue = this.$func.getCurrentYearMonth()
        store.commit('historyDate', this.$func.getCurrentYearMonth())
      } else {
        this.detailsValue = this.$func.getNowFormatDate()
        store.commit('historyDate', this.$func.getNowFormatDate())
      }
      store.commit('detailsAddr', '')
      this.handleModifyMacRate(this.$store.state.mac, false)
      store.dispatch('resetMac')
      this.detailsFlag = false
    },
    handleModifyMacRate (mac, flag) {
      if (!mac) return false
      modifyMacRate({'fastMac': (flag === true ? mac : ''), 'slowMac': (flag === true ? '' : mac)})
    },
    handleCommand (command) {
      this.$func.windowCountDown(ctxPaths + '/deStatuscan/result/export.as?mac=' + this.formInline.mac + '&pageSize=' + this.pageSize + '&pageNo=' + this.currentPage + '&startTime=' + this.formInline.rangeDate[0] + '&endTime=' + this.formInline.rangeDate[1] + '&projectCode=' + this.$store.state.projectCode + '&projectName=' + this.$store.state.projectName + '&export=' + (command === 'all' ? command.toUpperCase() : ''))
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
    handleSizeChange (val) {
      this.pageSize = val
      this.queryList()
    }
  },
  watch: {
    '$store.state.alarmTableHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.alarmTableHeight.height = newVal
        }
      }
    },
    '$store.state.projectCode': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.init()
        }
      }
    }
  },
  components: {
    Details
  }
}
</script>
<style lang="stylus" scoped>
#alarm
  width 100%
.form-wrap
  padding-top 18px
  width 100%
  text-align right
.el-date-editor.el-input__inner
  width 270px
.el-pagination
  padding 0
  margin-top 0
  display inline-block
  vertical-align middle
  .el-pagination__sizes, >>> span:not([class*=suffix]), >>> .el-input__inner
    margin-right 0
    height 28px
#alarm >>> .details-dialog
    background-color #0c1e32
    position: absolute
    top 96px
    left 50%
    margin-left -661.5px
    bottom 0
    margin-top 0 !important
    max-height calc(100% - 116px)
    max-width calc(100% - 20px)
    min-width 1323px
    display flex
    flex-direction column
    border 1px solid #fff
    .el-dialog__title, .el-dialog__headerbtn .el-dialog__close
      color #fff
      font-size 18px
    .el-dialog__header
      padding 14px 17px 0
      height 19px
    .el-dialog__body
      padding 0 17px
      overflow auto
      overflow-y hidden
      color #fff
    .el-dialog__headerbtn
      top 10px
      right 5px
.date-picker
  position absolute
  right 40px
  top 14px
  z-index 999
  span
    color #fff
  .el-date-editor.el-input
    width 130px
.offline-attention
  position absolute
  top 10px
  left 120px
  width 940px
.en-offline-attention
  left 135px
  top 2px
</style>
