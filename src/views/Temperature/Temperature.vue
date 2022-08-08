<template>
    <div id="temperature">
      <el-row class="pickDate">
      <template>
        <div class="block">
          <el-form ref="form" :model="form" size="small" @submit.native.prevent>
            <el-form-item class="mb-0">
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
      <bar-charts v-if="flag" :options="options" v-on:passIndex="getIndex"></bar-charts>
      <div class="bar-label"><span class="safe-badge"></span>{{ $t('main.safe') }}<span class="warn-badge"></span>{{ $t('home.warning') }}<span class="alert-badge"></span>{{ $t('home.alarm') }}</div>
      <el-col>
        <el-table
          :data="tableData"
          size="small"
          :height="tableComponentHeight"
          :max-height="tableComponentHeight"
          @sort-change="sortChange"
          v-el_scrollBar:scrollBar
          style="width: 100%;margin-top: 10px">
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
            prop="address"
            align="center"
            :label="$t('table.location')">
          </el-table-column>

          <el-table-column
            prop="number1"
            align="center"
            sortable="number1"
            :label="$t('table.temperatureA')">
          </el-table-column>
          <el-table-column
            prop="number2"
            align="center"
            sortable="number2"
            :label="$t('table.temperatureB')">
          </el-table-column>
          <el-table-column
            prop="number3"
            align="center"
            sortable="number3"
            :label="$t('table.temperatureC')">
          </el-table-column>
          <el-table-column
            width="80px"
            align="center"
            :label="$t('table.operating')">
            <template slot-scope="scope">
              <el-tooltip :content="$t('table.lineDetail')" placement="top">
                <el-button class="left-padding-right top-padding-bottom" type="text" size="small" @click="temperatureDetail(scope.row.address,scope.row.mac)"><i class="iconfont icon-mingxi"></i></el-button>
              </el-tooltip>
              <el-tooltip :content="$t('table.historicalTrend')" placement="top">
                <el-button class="left-padding-right top-padding-bottom" type="text" size="small" @click.stop="temperatureTrend(scope.row.address,scope.row.mac)"><i class="iconfont icon-qushi"></i></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-col :span="24" class="tc">
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
      <el-dialog :title="addr" width="40%" :visible.sync="dialogTableVisible" :modal="false">
        <el-table :data="lineDetail">
          <el-table-column prop="title" :label="$t('table.lineName')"></el-table-column>
          <el-table-column prop="aT" :label="$t('table.temperatureACelsius')"></el-table-column>
          <el-table-column :label="$t('table.temperatureBCelsius')">
            <template slot-scope="scope">
              {{scope.row.lineType === '180' || scope.row.lineType === '380' ? scope.row.bT : '--'}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.temperatureCCelsius')">
            <template slot-scope="scope">
                {{scope.row.lineType === '180' || scope.row.lineType === '380' ? scope.row.cT : '--'}}
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.temperatureNCelsius')">
            <template slot-scope="scope">
                {{scope.row.lineType === '180' || scope.row.lineType === '380' ? scope.row.nT : '--'}}
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog :title="addr" width="40%" :visible.sync="trendDialog" :modal="false" @closed="handleCloseTrend">
        <el-row class="pickDate">
        <template>
          <div class="block" v-show="trendPicker === 'day'">
            <span class="demonstration">{{ $t('main.date')}}</span>
            <el-date-picker
            v-model="value2"
            type="date"
            size="small"
            :editable="false"
            value-format="yyyy-MM-dd"
            @change="handleTrendDayPicker">
            </el-date-picker>
          </div>
          <div class="block" v-show="trendPicker === 'month'">
            <span class="demonstration">{{ $t('main.date')}}</span>
            <el-date-picker
            v-model="month2"
            value-format="yyyy-MM"
            type="month"
            size="small"
            :editable="false"
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
        <bar-charts v-if="trendFlag" :options="trendOptions" :onGetEchartsInstance="onGetEchartsInstance" ></bar-charts>
        <div class="bar-label"><span class="safe-badge"></span>{{ $t('main.safe') }}<span class="warn-badge"></span>{{ $t('home.warning') }}<span class="alert-badge"></span>{{ $t('home.alarm') }}</div>
        <el-table :data="trendData">
          <el-table-column prop="title" :label="$t('table.line')"></el-table-column>
          <el-table-column prop="aT" :label="$t('table.temperatureACelsius')"></el-table-column>
          <el-table-column prop="bT" :label="$t('table.temperatureBCelsius')"></el-table-column>
          <el-table-column prop="cT" :label="$t('table.temperatureCCelsius')"></el-table-column>
          <el-table-column prop="nT" :label="$t('table.temperatureNCelsius')"></el-table-column>
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
import { rangeTemperatureStats, temperatureDetail, queryChannels, tempOfRealtimeOrStatistic, queryBoxDetails, modifyMacRate } from '@/api/api'
import store from '@/store'
import Details from '../Control/Details'
import BarCharts from '../Common/Bars'
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
      date: '',
      timeFlag: '',
      tempFlag: '',
      tempType: '',
      trendDateType: 1,
      trendDate: '',
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
      mac: '',
      dialogTableVisible: false,
      trendDialog: false,
      addr: '',
      lineDetail: [],
      trendData: [],
      options: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('main.allDay') + this.$t('echarts.temperatureSituation')
        },
        tooltip: {
          trigger: 'item',
          formatter: ''
        },
        monitor: true,
        dateType: ''
      },
      trendOptions: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('main.allDay') + this.$t('echarts.temperatureSituation')
        },
        tooltip: {
          trigger: 'item',
          formatter: ''
        }
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
      this.$nextTick(function () {
        let that = this
        let params = {
          dateType: this.dateType,
          date: this.date ? this.date : this.$func.getNowFormatDate(),
          mac: this.form.mac.trim(),
          projectCode: this.$store.state.projectCode
        }
        // 温度看板
        rangeTemperatureStats(params)
          .then(res => {
            if (res.success) {
              let Data = []
              res.data.forEach(function (item, index) {
                Data.push({value: item.number1, itemStyle: {color: ''}})
                that.options.xAxis.push(item.time)
                if (item.number1 < 50) {
                  Data[index].itemStyle.color = '#87CF86'
                } else if (item.number1 >= 50 && item.number1 <= 70) {
                  Data[index].itemStyle.color = '#E79C27'
                } else {
                  Data[index].itemStyle.color = '#F26665'
                }
              })
              this.options.series.push({type: 'bar', barMaxWidth: '30', name: this.$t('table.temperatureValueA'), data: Data, itemStyle: {normal: {color: {}, label: {show: true, position: 'top'}}}})
              this.flag = true
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
      })
    },
    queryList (e) {
      this.$nextTick(function () {
        this.loading = true
        let params = {
          page: this.pageNo,
          rows: this.pageSize,
          mac: this.form.mac.trim(),
          projectCode: this.$store.state.projectCode,
          dateType: this.dateType,
          date: this.date ? this.date : this.$func.getNowFormatDate(),
          timeFlag: this.timeFlag,
          tempFlag: this.tempFlag,
          tempType: this.tempType
        }
        temperatureDetail(params)
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
    queryChannels (addr, mac) {
      let params = {
        mac: mac
      }
      queryChannels(params)
        .then(res => {
          if (res.success) {
            this.lineDetail = res.datas
            this.addr = '【' + addr + '】' + this.$t('main.of') + this.$t('table.line') + ' ' + this.$t('echarts.temperatureDetail')
            this.dialogTableVisible = true
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
    initTrend () {
      let that = this
      this.$nextTick(function () {
        this.trendLoading = true
        let params = {
          page: 1,
          limit: 31,
          dateType: this.trendDateType,
          date: this.trendDate ? this.trendDate : this.$func.getNowFormatDate(),
          projectCode: this.$store.state.projectCode,
          mac: this.mac
        }
        // 温度弹出层
        rangeTemperatureStats(params)
          .then(res => {
            this.trendOptions.xAxis = []
            this.trendOptions.series = []
            if (res.success) {
              let Datamax = []
              res.data.forEach(function (item, index) {
                Datamax.push({value: item.number1, itemStyle: {color: ''}})
                that.trendOptions.xAxis.push(item.time)
                if (item.number1 < 50) {
                  Datamax[index].itemStyle.color = '#87CF86'
                } else if (item.number1 >= 50 && item.number1 <= 70) {
                  Datamax[index].itemStyle.color = '#E79C27'
                } else {
                  Datamax[index].itemStyle.color = '#F26665'
                }
              })
              this.trendOptions.series.push({type: 'bar', barMaxWidth: '30', name: this.$t('table.temperatureValueA'), data: Datamax, itemStyle: {normal: {color: {}, label: {show: true, position: 'top'}}}})
              this.trendFlag = true
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
            this.trendLoading = false
          })
      })
    },
    getIndex (index) {
      this.timeFlag = index
      this.queryList()
    },
    sortChange (obj) {
      if (obj.order === 'descending') {
        this.tempFlag = 'DESC'
      } else if (obj.order === 'ascending') {
        this.tempFlag = 'ASC'
      }
      this.tempType = obj.prop
      this.queryList()
    },
    temperatureDetail (addr, mac) {
      this.queryChannels(addr, mac)
    },
    temperatureTrend (addr, mac) {
      this.mac = mac
      this.trendDialog = true
      this.addr = '【' + addr + '】' + this.$t('main.of') + this.$t('menu.temperature') + ' ' + this.$t('table.historicalTrend')
      this.initTrend()
      this.statisticsTemperatureValue()
    },
    statisticsTemperatureValue (timeFlag) {
      let params = {
        projectCode: this.$store.state.projectCode,
        mac: this.mac,
        date: this.trendDate ? this.trendDate : this.$func.getNowFormatDate(),
        dateType: this.trendDateType,
        timeFlag: timeFlag
      }
      tempOfRealtimeOrStatistic(params)
        .then(res => {
          if (res.success) {
            this.trendData = res.data
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
      this.queryList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.queryList()
    },
    handleDayPicker (val) {
      this.timeFlag = ''
      this.tempFlag = ''
      this.dateType = 1
      this.options.dateType = 1
      this.date = val
      this.value = val
      this.options.title.text = this.$t('main.allDay') + this.$t('echarts.temperatureSituation')
      this.init()
      this.queryList()
    },
    handleMonthPicker (val) {
      this.timeFlag = ''
      this.tempFlag = ''
      this.dateType = 2
      this.options.dateType = 2
      this.date = val
      this.month = val
      this.options.title.text = this.$func.getMonthText(val) + this.$t('echarts.temperatureSituation')
      this.init()
      this.queryList()
    },
    handleDatePicker (val) {
      if (val === 'day') {
        this.dateType = 1
        this.date = this.value
        this.options.title.text = this.$t('main.allDay') + this.$t('echarts.temperatureSituation')
      } else if (val === 'month') {
        this.dateType = 2
        this.date = this.month
        this.options.title.text = this.$func.getMonthText(this.month) + this.$t('echarts.temperatureSituation')
      }
      this.datePicker = val
      this.timeFlag = ''
      this.tempFlag = ''
      this.init()
      this.queryList()
    },
    handleTrendDayPicker (val) {
      this.trendDateType = 1
      this.trendDate = val
      this.value2 = val
      this.trendOptions.title.text = this.$t('main.allDay') + this.$t('echarts.temperatureSituation')
      this.initTrend()
    },
    handleTrendMonthPicker (val) {
      this.trendDateType = 2
      this.trendDate = val
      this.month2 = val
      this.trendOptions.title.text = this.$func.getMonthText(val) + this.$t('echarts.temperatureSituation')
      this.initTrend()
    },
    handleTrendPicker (val) {
      if (val === 'day') {
        this.trendDateType = 1
        this.trendDate = this.value2
        this.trendOptions.title.text = this.$t('main.allDay') + this.$t('echarts.temperatureSituation')
      } else if (val === 'month') {
        this.trendDateType = 2
        this.trendDate = this.month2
        this.trendOptions.title.text = this.$func.getMonthText(this.month2) + this.$t('echarts.temperatureSituation')
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
    },
    // 点击柱状图事件
    onGetEchartsInstance (echart) {
      echart.off('click')
      echart.on('click', (params) => {
        this.statisticsTemperatureValue(params.dataIndex + '')
      })
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
    BarCharts,
    Details
  }
}
</script>
<style lang="stylus" scoped>
.el-dialog__wrapper >>> .el-dialog
  background: #1b2250
.el-dialog__wrapper >>> .el-dialog__title,.el-dialog__wrapper >>> .el-dialog__close
  color: #fff
.bar-label
  text-align: center
  margin: -20px 0 20px 0
.bar-label .safe-badge,.bar-label .warn-badge,.bar-label .alert-badge
  position: relative
  top: 3px
  display: inline-block
  width: 30px
  height: 16px
  margin: 0 5px 0 15px
  border-radius: 3px
.bar-label .safe-badge
  background-color: #87CF86
.bar-label .warn-badge
  background-color: #E79C27
.bar-label .alert-badge
  background-color: #F26665
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
