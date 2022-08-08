<template>
    <div id="warn" v-show="flag">
      <el-row class="pickDate">
      <template>
        <div class="block">
          <i @click="handleExport" class="el-icon-printer export-icon" :class="$i18n.locale === 'en' ? 'en-export' : '' "></i>
        </div>
        <div class="block">
          <el-form ref="form" :model="form" size="small" @submit.native.prevent>
            <el-form-item>
              <el-input class="short-input" v-model="form.mac" @keyup.enter.native="onSubmit" :placeholder="$t('placeholder.enterDeviceNo')"></el-input>
              <el-button type="primary" @click="onSubmit">{{ $t('btns.query') }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="block" v-show="datePicker === 'day'" :class="$i18n.locale === 'en' ? 'en-datePicker' : ''">
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
        <div class="block" v-show="datePicker === 'month'" :class="$i18n.locale === 'en' ? 'en-datePicker' : ''">
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
      <el-tabs v-model="activeName" id="power-alarm-wrap" @tab-click="handleClick">
        <el-tab-pane :label="$t('home.powerAlarm')" name="first">
          <bar-charts :options="alarmOption" class="power-alarm" v-if="'first' === activeName && $route.path === '/InnerMain/Warn'"></bar-charts>
        </el-tab-pane>
        <el-tab-pane :label="$t('home.powerWarning')" name="second">
          <bar-charts :options="warnOption" class="power-alarm" v-if="'second' === activeName && $route.path === '/InnerMain/Warn'"></bar-charts>
        </el-tab-pane>
      </el-tabs>
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
            width="120px">
            <template slot-scope="scope">
              <span class="c-default pointer">{{scope.row.boxName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            :label="$t('table.deviceNo')"
            width="120px">
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
            align="center"
            :label="$t('table.deviceNo')"
            width="120px">
            <template slot-scope="scope">
              <span class="c-default pointer" @click="handle(scope.row)">{{scope.row.mac}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="channel"
            align="center"
            :label="$t('table.line')"
            width="60px">
          </el-table-column>
          <el-table-column
            prop="info"
            align="center"
            :label="$t('table.alarmType')">
            <template slot-scope="scope">
              <el-tooltip effect="dark" :content="scope.row['info']" placement="right">
                <span>{{scope.row.info}}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="time"
            align="center"
            :label="$t('table.alarmTime')"
            width="140px">
          </el-table-column>
          <el-table-column
            :label="$t('table.schedule')">
              <template slot-scope="scope">
                <el-progress
                  :text-inside="true"
                  :stroke-width="18"
                  :show-text="false"
                  :class="scope.row.processStatus === 2 ? 'solved' : 'rejected'"
                  :percentage="100"
                  v-if="scope.row.progress > 100"
                ></el-progress>
                <el-progress
                  v-else
                  :text-inside="true"
                  :stroke-width="18"
                  :show-text="false"
                  :class="scope.row.processStatus === 2 ? 'solved' : 'rejected'"
                  :percentage="scope.row.progress"
                ></el-progress>
              </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.timeConsuming')"
            align="center">
              <template slot-scope="scope">
                <span
                  :class="scope.row.passTime === '48' ? 'danger-text' : 'warning-text'"
                >{{scope.row.passTime + $t('table.hour')}}</span>
              </template>
          </el-table-column>
          <el-table-column
            prop="processStatus"
            :label="$t('table.status')"
            align="center"
            width="100">
            <template slot-scope="scope">
              <el-button type="text" class="fs-12" v-if="scope.row.processStatus === 0" @click="handleUrge(scope.row.id)">{{ $t('table.urge') }}</el-button>
              <span @click="queryMaintenance(scope.row)" class="pointer"
              :class="scope.row.processStatus === 0 ? 'c-danger' : 'c-success'"
            >{{ scope.row.processStatus === 0 ? $t('home.unprocessed') : $t('home.processed') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('home.value')" align="center" width="60px">
              <template slot-scope="scope">
                <el-popover placement="top" width="250" trigger="click" :content="alarmInfo">
                  <i class="el-icon-news" v-show="scope.row.valueDescribe !== '' && JSON.stringify(scope.row.valueDescribe) !== '{}'" @click="handleValue(scope.row.valueDescribe)" slot="reference"></i>
                </el-popover>
              </template>
            </el-table-column>
        </el-table>
        <el-col :span="24" class="mt-10 tc">
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
        :title="$t('control.maintenance') + $t('control.edit')" :close-on-click-modal="false"
        :visible.sync="dialogVisible" append-to-body :modal="false" @close="closeMaintenance">
        <MaintenanceBox
        v-if="dialogVisible"
        :maintenanceBoxObj="maintenanceBoxObj"
        v-on:close-maintenance="closeMaintenance"
        ></MaintenanceBox>
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
/* global ctxPaths */
import store from '@/store'
import { powerAlarm, alarmDetail, findMaintenance, alarmUrgePush, modifyMacRate, queryBoxDetails } from '@/api/api'
import Details from '../Control/Details'
import BarCharts from '../Common/Bars'
import MaintenanceBox from '../Home/MaintenanceBox'
export default {
  data () {
    return {
      datePicker: 'day',
      dateType: 1,
      date: '',
      value: this.$func.getNowFormatDate(),
      month: this.$func.getCurrentYearMonth(),
      form: {
        mac: ''
      },
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      flag: true,
      loading: false,
      activeName: 'first',
      alarmOption: {
        legendStatus: false,
        xAxis: [],
        series: [],
        title: {
          show: false
        },
        tooltip: {
          show: false
        }
      },
      warnOption: {
        legendStatus: false,
        xAxis: [],
        series: [],
        title: {
          show: false
        },
        tooltip: {
          show: false
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
      alarmInfo: [],
      maintenanceBoxObj: {},
      dialogVisible: false,
      tableComponentHeight: this.$store.state.innerTableHeight
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.activeName = this.$store.state.warnTab
      this.form.mac = this.$store.state.warnMac
      this.datePicker = this.$store.state.warnDatePicker
      this.dateType = this.$store.state.warnDateType
      this.pageNo = this.$store.state.warnPageNo
      this.value = this.$store.state.warnDay === '' ? this.$func.getNowFormatDate() : this.$store.state.warnDay
      this.month = this.$store.state.warnMonth === '' ? this.$func.getCurrentYearMonth() : this.$store.state.warnMonth
      this.dateType === 1 ? this.date = this.value : this.date = this.month
      this.queryPowerAlarm()
      this.queryList()
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
    queryPowerAlarm () {
      this.loading = true
      let params = {
        typeNumbers: this.activeName === 'first' ? -100 : -200,
        dateType: this.dateType,
        date: this.date ? this.date : this.$func.getNowFormatDate(),
        mac: this.form.mac.trim(),
        projectCode: this.$store.state.projectCode
      }
      powerAlarm(params)
        .then(res => {
          this.flag = true
          if (res.success) {
            let that = this
            this.alarmOption.xAxis = []
            this.alarmOption.series = []
            this.warnOption.xAxis = []
            this.warnOption.series = []
            let bardata = {value: [], legend: [], typeNos: []}
            let _bardata = {value: [], legend: [], typeNos: []}
            res.data.forEach(function (item, index) {
              if ([1, 2, 3, 4, 5, 6, 7, 8, 11, 17, 18, 19, 1007, 1008, 1009].indexOf(item.typeNumber) !== -1) {
                if (item.typeNumber === 4 || item.typeNumber === 1008) {
                  bardata.typeNos.forEach(function (v, i) {
                    if (v === 3) {
                      bardata.value[i] += item.number
                      that.alarmOption.xAxis[i] = that.$t('types.overloadOvercurrent')
                    }
                  })
                } else if (item.typeNumber === 18 || item.typeNumber === 19) {
                  bardata.typeNos.forEach(function (_v, _i) {
                    if (_v === 17) {
                      bardata.value[_i] += item.number
                      that.alarmOption.xAxis[_i] = that.$t('types.threePhaseA')
                    }
                  })
                } else if (item.typeNumber === 1009) {
                  bardata.typeNos.forEach(function (_v, _i) {
                    if (_v === 7) {
                      bardata.value[_i] += item.number
                      that.alarmOption.xAxis[_i] = that.$t('types.temperatureA')
                    }
                  })
                } else if (item.typeNumber === 1007) {
                  bardata.typeNos.forEach(function (_v, _i) {
                    if (_v === 5) {
                      bardata.value[_i] += item.number
                      that.alarmOption.xAxis[_i] = that.$t('types.overpressureA')
                    }
                  })
                } else {
                  if (item.info === '短路报警') {
                    item.info = that.$t('types.shortCircuitA')
                  } else if (item.info === '漏电报警') {
                    item.info = that.$t('types.leakageA')
                  } else if (item.info === '过压报警') {
                    item.info = that.$t('types.overpressureA')
                  } else if (item.info === '欠压报警') {
                    item.info = that.$t('types.undervoltageA')
                  } else if (item.info === '温度报警') {
                    item.info = that.$t('types.temperatureA')
                  } else if (item.info === '浪涌报警') {
                    item.info = that.$t('types.surgeA')
                  } else if (item.info === '电弧报警') {
                    item.info = that.$t('types.fireA')
                  }
                  bardata.value.push(item.number)
                  bardata.typeNos.push(item.typeNumber)
                  that.alarmOption.xAxis.push(item.info)
                }
              } else {
                if (item.info === '漏保功能正常') {
                  item.info = that.$t('types.leakageProtectionNormal')
                } else if (item.info === '漏保自检未完成' || item.info === '漏电保护自检未完成') {
                  item.info = that.$t('types.leakageProtectionSelfTestNotCompleted')
                } else if (item.info === '漏电预警') {
                  item.info = that.$t('types.leakageW')
                } else if (item.info === '电流预警') {
                  item.info = that.$t('types.currentW')
                } else if (item.info === '过压预警') {
                  item.info = that.$t('types.overpressureW')
                } else if (item.info === '欠压预警') {
                  item.info = that.$t('types.undervoltageW')
                } else if (item.info === '通讯预警') {
                  item.info = that.$t('types.communicationA')
                }
                if (item.typeNumber !== 1001) {
                  _bardata.value.push(item.number)
                  _bardata.typeNos.push(item.typeNumber)
                  that.warnOption.xAxis.push(item.info)
                }
              }
            })
            this.alarmOption.series.push({
              type: 'bar',
              barMaxWidth: '30',
              data: bardata.value,
              itemStyle: {
                normal: {
                  color: function (params) {
                    let colorList = [
                      '#cb3f40', '#f26665', '#f2a5a6', '#9a39b4', '#c077cd',
                      '#d19edc', '#e79c28', '#f0c647 ', '#fee7a2'
                    ]
                    return colorList[params.dataIndex]
                  },
                  label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      color: '#fff'
                    }
                  }
                }
              }
            })
            this.warnOption.series.push({
              type: 'bar',
              barMaxWidth: '30',
              data: _bardata.value,
              itemStyle: {
                normal: {
                  color: function (params) {
                    let colorList = [
                      '#cb3f40', '#f26665', '#f2a5a6', '#9a39b4', '#c077cd',
                      '#d19edc', '#e79c28', '#f0c647 ', '#fee7a2'
                    ]
                    return colorList[params.dataIndex]
                  },
                  label: {
                    show: true,
                    position: 'top',
                    textStyle: {
                      color: '#fff'
                    }
                  }
                }
              }
            })
            this.flag = true
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
        .catch(res => {
          this.$message({
            message: this.$t('message.unknown'),
            type: 'error'
          })
        })
    },
    queryList (e) {
      this.loading = true
      let params = {
        page: this.pageNo,
        rows: this.pageSize,
        dateType: this.dateType,
        date: this.date ? this.date : this.$func.getNowFormatDate(),
        mac: this.form.mac.trim(),
        typeNumbers: this.activeName === 'first' ? -100 : -200,
        projectCode: this.$store.state.projectCode
      }
      this.$nextTick(function () {
        alarmDetail(params)
          .then(res => {
            if (res.success) {
              this.tableData = res.datas
              this.total = res.total
              this.currentPage = this.pageNo
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
    handleSizeChange (val) {
      this.pageSize = val
      this.queryList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      store.commit('warnPageNo', val)
      this.queryList()
    },
    handleDayPicker (val) {
      store.commit('warnDateType', 1)
      store.commit('warnDay', val)
      store.commit('warnPageNo', 1)
      this.dateType = 1
      this.date = val
      this.value = val
      this.init()
    },
    handleMonthPicker (val) {
      store.commit('warnDateType', 2)
      store.commit('warnMonth', val)
      store.commit('warnPageNo', 1)
      this.dateType = 2
      this.date = val
      this.month = val
      this.init()
    },
    handleDatePicker (val) {
      if (val === 'day') {
        this.dateType = 1
        store.commit('warnDateType', 1)
        this.date = this.value
      } else if (val === 'month') {
        this.dateType = 2
        store.commit('warnDateType', 2)
        this.date = this.month
      }
      this.datePicker = val
      store.commit('warnPageNo', 1)
      store.commit('warnDatePicker', val)
      this.init()
    },
    handleExport () {
      this.$func.windowCountDown(ctxPaths + '/project/main/v2/xls/alarmDetailOfProject.as?' + 'typeNumbers=0&dateType=' + this.dateType + '&date=' + (this.dateType === 1 ? this.value : this.month) + '&projectCode=' + this.$store.state.projectCode + '&oqp1=' + this.$store.state.projectName + '&mac=' + this.form.mac.trim())
    },
    onSubmit () {
      store.commit('warnMac', this.form.mac)
      this.init()
    },
    handleValue (obj) {
      let type = ''
      let signal = ''
      if (obj.elecType === 1) {
        type = this.$t('main.watt')
      } else if (obj.elecType === 2) {
        type = this.$t('main.ampere')
      } else if (obj.elecType === 3) {
        type = this.$t('menu.leakageCurrent')
      } else if (obj.elecType === 4) {
        type = this.$t('menu.temperature')
      } else if (obj.elecType === 5) {
        type = this.$t('main.volt')
      } else if (obj.elecType === 8) {
        type = this.$t('main.lightningCurrent')
      } else if (obj.elecType === 9) {
        signal = this.$t('control.signal')
        type = this.$t('main.volt')
      } else if (obj.elecType === 10) {
        type = this.$t('menu.humidity')
      } else if (obj.elecType === 11) {
        type = this.$t('stralsund.concentration')
      } else if (obj.elecType === 12) {
        type = this.$t('echarts.illumination') + this.$t('echarts.celsius')
      } else if (obj.elecType === 14) {
        type = this.$t('table.waterVolume')
      }
      if (obj.elecType === 9) {
        this.alarmInfo = [`${type}(${obj.unit1}): ${obj.value1},\xa0${signal}(${obj.unit2}): ${obj.value2}`]
      } else if (obj.elecType === 8) {
        this.alarmInfo = [`${type}(${obj.unit}): ${obj.value} ${obj.elecType === 8 ? '' : ('(' + this.$t('table.threshold') + ':' + obj.threshold + ')')}`,
          `${obj.groundWire !== undefined ? this.$t('main.groundState') + ': ' + (obj.groundWire === 0 ? this.$t('control.normal') : this.$t('control.abnormal')) : ''}`,
          `${obj.spd !== undefined ? 'SPD: ' + (obj.spd === 0 ? this.$t('control.normal') : this.$t('control.abnormal')) : ''}`,
          `${obj.occurTime ? this.$t('main.surgeTime') + ': ' + (obj.occurTime ? obj.occurTime : '') : ''}`]
      } else if (obj.elecType === 10) {
        this.alarmInfo = `${type}: ${obj.value}${obj.unit + 'RH'} ${'(' + this.$t('table.threshold') + ':' + obj.threshold + ')'}`
      } else if (obj.elecType === 11) {
        this.alarmInfo = `${type}: ${obj.value}${obj.unit} ${'(' + this.$t('table.threshold') + ':' + obj.threshold + ')'}`
      } else if (obj.elecType === 12) {
        this.alarmInfo = `${type}: ${obj.value + 'Lux'}${'(' + this.$t('table.threshold') + ':' + obj.threshold + ')'}`
      } else if (obj.elecType === 14) {
        this.alarmInfo = `${type}: ${obj.value1 + obj.unit1}`
      } else {
        this.alarmInfo = `${type}: ${obj.value}${obj.unit} ${'(' + this.$t('table.threshold') + ':' + obj.threshold + ')'}`
      }
    },
    handleClick (tab, event) {
      store.commit('warnTab', tab.name)
      this.init()
    },
    queryMaintenance (obj) {
      let params = {
        mac: obj.mac,
        alarmId: obj.id,
        id: ''
      }
      findMaintenance(params)
        .then(res => {
          if (res.success) {
            store.commit('maintenanceObj', res.data)
            store.commit('alarmId', obj.id)
            this.maintenanceBoxObj = obj
            this.dialogVisible = true
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
        .catch(res => {
          this.$message({
            message: this.$('message.unknown'),
            type: 'error'
          })
        })
    },
    closeMaintenance () {
      store.dispatch('resetMaintenanceObj')
      this.dialogVisible = false
      this.init()
    },
    handleUrge (id) {
      alarmUrgePush({ id: id })
        .then(res => {
          this.$message({
            message: res.message,
            type: res.code === '0' ? 'success' : 'error'
          })
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
  watch: {
    '$store.state.projectCode': {
      handler (newVal, oldVal) {
        if (newVal) {
          if (this.$route.path === '/InnerMain/Warn') this.init()
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
    Details,
    MaintenanceBox
  }
}
</script>
<style lang="stylus" scoped>
.power-alarm
  width: 100%
  height: 370px
#power-alarm-wrap
  width: 100%
  position relative
  >>> .el-tabs__item
    padding 0 10px
    &:nth-child(2)
      padding-left 0
#power-alarm-wrap >>> .el-tabs__header
  position absolute
  left 5px
  top -40px
#power-alarm-wrap >>> .el-tabs__active-bar
  background-color #c23531
#power-alarm-wrap >>> .el-tabs__header .el-tabs__item
  color #fff
.el-progress.el-progress--line.el-progress--without-text.el-progress--text-inside
    width: 100%
.solved >>> .el-progress-bar__outer
    background:rgba(32, 180, 252, .8)
.el-table >>> .el-progress-bar__inner
    background: -webkit-linear-gradient(left, #caaa31 , #ba5984)
    background: -o-linear-gradient(right, #caaa31, #ba5984)
    background: -moz-linear-gradient(right, #caaa31, #ba5984)
    background: linear-gradient(to right, #caaa31 , #ba5984)
.el-table .danger-text
    color: #F56C6C
.el-table .warning-text
    color: #E6A23C
.en-datePicker >>> .el-input
    width 140px
.en-export
    padding 12px 10px
.export-icon
    height  32px
    line-height 32px
    font-size 20px
#warn >>> .details-dialog
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
</style>
