<template>
    <div id="temperature">
      <el-row class="pickDate">
      <template>
        <div class="block">
          <el-form ref="form" :model="form" size="small" @submit.native.prevent>
            <el-form-item>
              <el-input class="short-input" v-model="form.mac" @keyup.enter.native="onSubmit" :placeholder="$t('placeholder.enterDeviceNo')"></el-input>
              <el-button type="primary" @click="onSubmit">{{ $t('btns.query') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="block" v-show="datePicker === 'day'">
          <span class="demonstration">{{ $t('main.date') }}</span>
          <el-date-picker
          v-model="value"
          type="date"
          size="small"
          :editable="false"
          value-format="yyyy-MM-dd"
          @change="handleDayPicker">
          </el-date-picker>
        </div>
        <div class="block" v-show="datePicker === 'month'">
          <span class="demonstration">{{ $t('main.date') }}</span>
          <el-date-picker
          v-model="month"
          value-format="yyyy-MM"
          @change="handleMonthPicker"
          type="month"
          size="small"
          :editable="false">
          </el-date-picker>
        </div>
      </template>
        <div class="block">
          <el-button size="small" :type="datePicker === 'day' ? 'success' : 'info'" circle @click="handleDatePicker('day')">{{ $t('main.day') }}</el-button>
          <el-button size="small" :type="datePicker === 'month' ? 'success' : 'info'" circle @click="handleDatePicker('month')">{{ $t('main.month') }}</el-button>
        </div>
      </el-row>
      <el-row v-loading="loading" element-loading-spinner="el-icon-loading" class="padding-10-lr" element-loading-background="rgba(255, 255, 255, .2)" :element-loading-text="$t('message.loading')">
      <line-chart :options="options" v-if="flag"></line-chart>
      <el-col>
        <el-table
          :data="tableData"
          size="small"
          :height="tableComponentHeight"
          :max-height="tableComponentHeight"
          v-el_scrollBar:scrollBar
          style="width: 100%;">
          <el-table-column
            align="center"
            :label="$t('dialog.deviceAlias')"
           >
            <template slot-scope="scope">
              <span class="c-default pointer">{{scope.row.boxName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('table.deviceNo')"
           >
            <template slot-scope="scope">
              <span class="c-default pointer" @click="handle(scope.row)">{{scope.row.mac}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="id"
            align="center"
            :label="$t('table.jobNumber')">
          </el-table-column>
          <el-table-column
            prop="address"
            align="center"
            :label="$t('table.location')">
          </el-table-column>

          <el-table-column
            prop="channel"
            align="center"
            :label="$t('table.line')">
          </el-table-column>
          <el-table-column
            prop="time"
            align="center"
            :label="$t('home.alarm') + '/' + $t('home.warning') + $t('dialog.time')">
          </el-table-column>
          <el-table-column
            width="80px"
            align="center"
            :label="$t('table.operating')">
            <template slot-scope="scope">
              <el-tooltip :content="$t('table.historicalTrend')" placement="top">
                <el-button type="text" class="top-padding-bottom" size="small" @click.stop="historicalTrend(scope.row.address, scope.row.mac)"><i class="iconfont icon-qushi"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="tc mt-10">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30]"
            :page-size="pageSize"
            small
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </el-col>
      </el-col>
      </el-row>
      <el-dialog :title="addr" width="40%" :modal="false" :visible.sync="trendDialog" @closed="handleCloseTrend">
        <el-row class="pickDate">
        <template>
          <div class="block" v-show="trendPicker === 'day'">
            <span class="demonstration">{{ $t('main.date') }}</span>
            <el-date-picker
            v-model="value2"
            type="date"
            size="small"
            value-format="yyyy-MM-dd"
            @change="handleTrendDayPicker">
            </el-date-picker>
          </div>
          <div class="block" v-show="trendPicker === 'month'">
            <span class="demonstration">{{ $t('main.date') }}</span>
            <el-date-picker
            v-model="month2"
            value-format="yyyy-MM"
            type="month"
            size="small"
            @change="handleTrendMonthPicker">
            </el-date-picker>
          </div>
        </template>
          <div class="block">
          <el-button size="small" :type="trendPicker === 'day' ? 'success' : 'info'" circle @click="handleTrendPicker('day')">{{ $t('main.day') }}</el-button>
          <el-button size="small" :type="trendPicker === 'month' ? 'success' : 'info'" circle @click="handleTrendPicker('month')">{{ $t('main.month') }}</el-button>
          </div>
        </el-row>
        <el-row v-loading="trendLoading" element-loading-spinner="el-icon-loading" :element-loading-text="$t('message.loading')">
        <line-chart v-if="trendFlag" :options="trendOptions"></line-chart>
        <el-table :data="trendData">
          <el-table-column prop="time" :label="$t('dialog.time')"></el-table-column>
          <el-table-column prop="number2" :label="$t('table.leakageAlarmNumber')"></el-table-column>
          <el-table-column prop="number12" :label="$t('table.leakageWarningNumber')"></el-table-column>
        </el-table>
        </el-row>
      </el-dialog>
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
import { leakageAW, leakageWDetail, queryBoxDetails, modifyMacRate } from '@/api/api'
import store from '@/store'
import Details from '../Control/Details'
import LineChart from '../Common/Line'
export default {
  data () {
    return {
      flag: false,
      trendFlag: false,
      loading: false,
      trendLoading: false,
      datePicker: 'day',
      trendPicker: 'day',
      dateType: 1,
      trendDateType: 1,
      date: '',
      trendDate: '',
      mac: '',
      value: this.$func.getNowFormatDate(),
      value2: this.$func.getNowFormatDate(),
      month: this.$func.getCurrentYearMonth(),
      month2: this.$func.getCurrentYearMonth(),
      form: {
        mac: ''
      },
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      addr: '',
      trendDialog: false,
      trendData: [],
      options: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('main.allDay') + this.$t('types.leakageA') + this.$t('echarts.situation')
        },
        tooltip: '{a}{c}<br/>{a1}{c1}',
        legendSelect: true
      },
      trendOptions: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('main.allDay') + this.$t('types.leakageA') + this.$t('echarts.situation')
        },
        tooltip: '{a}{c}<br/>{a1}{c1}',
        legendSelect: true
      },
      detailsFlag: false,
      detailsObj: {
        'others': {
          'version': '',
          'online': ''
        }
      },
      detailsValue: '',
      tableComponentHeight: this.$store.state.innerTableHeight
    }
  },
  mounted () {
    this.init()
    this.queryList()
  },
  methods: {
    init () {
      this.loading = true
      this.options.xAxis = []
      this.options.series = []
      let params = {
        typeNumbers: '2,12',
        dateType: this.dateType,
        date: this.date ? this.date : this.$func.getNowFormatDate(),
        mac: this.form.mac.trim(),
        projectCode: this.$store.state.projectCode
      }
      this.$nextTick(function () {
        let data = []
        let _data = []
        let that = this
        leakageAW(params)
          .then(res => {
            res.data.forEach(function (item, index) {
              that.options.xAxis.push(item.time)
              data.push(item.number2)
              _data.push(item.number12)
            })
            console.log(res)
            this.options.series[0] = {name: that.$t('echarts.numberOfLeakageAlarms'), type: 'line', data: data, smooth: true, itemStyle: {normal: {areaStyle: {type: 'default'}, color: '#f26665'}}, symbol: 'emptyCircle'}
            this.options.series[1] = {name: that.$t('echarts.numberOfLeakageWarnings'), type: 'line', data: _data, smooth: true, itemStyle: {normal: {areaStyle: {type: 'default'}, color: '#08BEC1'}}, symbol: 'emptyCircle'}
            this.flag = true
          })
          .catch(err => {
            if (err) {
              this.$message({
                message: this.$t('message.unknown'),
                type: 'error'
              })
            }
          })
      })
    },
    queryList (e) {
      this.$nextTick(function () {
        this.loading = true
        let params = {
          page: this.pageNo,
          rows: this.pageSize,
          typeNumbers: '2,12',
          dateType: this.dateType,
          date: this.date ? this.date : this.$func.getNowFormatDate(),
          mac: this.form.mac.trim(),
          projectCode: this.$store.state.projectCode
        }
        leakageWDetail(params)
          .then(res => {
            if (res.success) {
              this.tableData = res.datas
              this.total = res.total
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
          .finally(() => {
            this.loading = false
          })
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
    initTrend (mac) {
      this.trendLoading = true
      this.trendOptions.xAxis = []
      this.trendOptions.series = []
      let params = {
        typeNumbers: '2,12',
        dateType: this.trendDateType,
        date: this.trendDate ? this.trendDate : this.$func.getNowFormatDate(),
        projectCode: this.$store.state.projectCode,
        mac: mac
      }
      this.$nextTick(function () {
        let data = []
        let _data = []
        let that = this
        leakageAW(params)
          .then(res => {
            this.trendData = res.data
            res.data.forEach(function (item, index) {
              that.trendOptions.xAxis.push(item.time)
              data.push(item.number2)
              _data.push(item.number12)
            })
            this.trendOptions.series[0] = {name: that.$t('echarts.numberOfLeakageAlarms'), type: 'line', data: data, smooth: true, itemStyle: {normal: {areaStyle: {type: 'default'}, color: '#f26665'}}, symbol: 'emptyCircle'}
            this.trendOptions.series[1] = {name: that.$t('echarts.numberOfLeakageWarnings'), type: 'line', data: _data, smooth: true, itemStyle: {normal: {areaStyle: {type: 'default'}, color: '#08BEC1'}}, symbol: 'emptyCircle'}
            this.trendFlag = true
          })
          .catch(err => {
            if (err) {
              this.$message({
                message: this.$t('message.unknown'),
                type: 'error'
              })
            }
          })
          .finally(() => {
            this.trendLoading = false
          })
      })
    },
    historicalTrend (addr, mac) {
      this.addr = '【' + addr + '】' + this.$t('main.of') + this.$t('types.leakageA') + ' ' + this.$t('table.historicalTrend')
      this.trendDialog = true
      this.mac = mac
      this.initTrend(mac)
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.queryList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.queryList()
    },
    handleDayPicker (val) {
      this.dateType = 1
      this.date = val
      this.value = val
      this.options.title.text = this.$t('main.allDay') + this.$t('types.leakageA') + this.$t('echarts.situation')
      this.init()
      this.queryList()
    },
    handleMonthPicker (val) {
      this.dateType = 2
      this.date = val
      this.month = val
      this.options.title.text = this.$func.getMonthText(val) + this.$t('types.leakageA') + this.$t('echarts.situation')
      this.init()
      this.queryList()
    },
    handleDatePicker (val) {
      if (val === 'day') {
        this.dateType = 1
        this.date = this.value
        this.options.title.text = this.$t('main.allDay') + this.$t('types.leakageA') + this.$t('echarts.situation')
      } else if (val === 'month') {
        this.dateType = 2
        this.date = this.month
        this.options.title.text = this.$func.getMonthText(this.month) + this.$t('types.leakageA') + this.$t('echarts.situation')
      }
      this.datePicker = val
      this.init()
      this.queryList()
    },
    handleTrendDayPicker (val) {
      this.trendDateType = 1
      this.trendDate = val
      this.value2 = val
      this.trendOptions.title.text = this.$t('main.allDay') + this.$t('types.leakageA') + this.$t('echarts.trend')
      this.initTrend(this.mac)
    },
    handleTrendMonthPicker (val) {
      this.trendDateType = 2
      this.trendDate = val
      this.month2 = val
      this.trendOptions.title.text = this.$func.getMonthText(val) + this.$t('types.leakageA') + this.$t('echarts.trend')
      this.initTrend(this.mac)
    },
    handleTrendPicker (val) {
      if (val === 'day') {
        this.trendDateType = 1
        this.trendDate = this.value2
        this.trendOptions.title.text = this.$t('main.allDay') + this.$t('types.leakageA') + this.$t('echarts.trend')
      } else if (val === 'month') {
        this.trendDateType = 2
        this.trendDate = this.month2
        this.trendOptions.title.text = this.$func.getMonthText(this.month2) + this.$t('types.leakageA') + this.$t('echarts.trend')
      }
      this.trendPicker = val
      this.initTrend(this.mac)
    },
    handleCloseTrend () {
      this.trendPicker = 'day'
      this.value2 = this.$func.getNowFormatDate()
      this.month2 = this.$func.getCurrentYearMonth()
    },
    onSubmit () {
      this.init()
      this.queryList()
    }
  },
  watch: {
    '$store.state.projectCode': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.init()
          this.queryList()
        }
      },
      deep: true
    },
    '$store.state.innerTableHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.tableComponentHeight = newVal
        }
      }
    }
  },
  components: {
    LineChart,
    Details
  }
}
</script>
<style lang="stylus" scoped>
.el-dialog__wrapper >>> .el-dialog
  background #1b2250
.el-dialog__wrapper >>> .el-dialog__title,.el-dialog__wrapper >>> .el-dialog__close
  color #fff
#temperature >>> .details-dialog
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
