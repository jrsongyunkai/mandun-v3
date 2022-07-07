<template>
  <div id="alarms">
    <el-row :gutter="20" style="margin: 0; padding:20px">
      <el-col>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="pointer" @click.native="$router.go(-1)">{{ $t('btns.back') }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $t('home.alarm') + '/' + $t('home.warning') + $t('table.list') }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row>
          <el-col :span="24">
            <el-form
              :inline="true"
              size="small"
              :model="quantityForm"
              class="demo-form-inline tr mt-20"
              @submit.native.prevent>
              <el-form-item class="fl">
                <span class="ml-20 fs-18" v-if="alarmData.currentMonthAlarmNum">{{ $t('table.thisMonth') + $t('statistics.numberOfAlarms') + '：' + alarmData.currentMonthAlarmNum }}</span>
                <span class="ml-20 fs-18" v-if="alarmData.lastMonthAlarmNum">{{ $t('table.lastmonth') + $t('statistics.numberOfAlarms') + '：' + alarmData.lastMonthAlarmNum }}</span>
                <span class="ml-20 fs-18" v-if="alarmData.totalAlarmNum">{{ $t('statistics.cumulative') + $t('statistics.numberOfAlarms') + '：' + alarmData.totalAlarmNum }}</span>
              </el-form-item>
              <el-form-item>
                <span v-if="$store.state.toPath !== '/Home' && $store.state.toPath !== ''" class="mr-20 fw">
                </span>
                  <span class="block">
                    <el-date-picker
                      :disabled="jobFlag"
                      v-model="quantityForm.month"
                      value-format="yyyy-MM-dd"
                      type="daterange"
                      :editable="false"
                      :clearable="false"
                      :range-separator="$t('table.to')"
                      :start-placeholder="$t('table.startDate')"
                      :end-placeholder="$t('table.endDate')"
                      @change="handleChangeDate">
                    </el-date-picker>
                  </span>
              </el-form-item>
              <el-form-item>
                <el-input
                  :disabled="jobFlag"
                  v-model="quantityForm.mac"
                  :onkeyup="quantityForm.mac = quantityForm.mac.replace(/[, ]/g,'')"
                  @keyup.enter.native="queryQuantity"
                  :placeholder="$t('placeholder.enterDeviceNo')"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="quantityForm.jobNumber"
                  :onkeyup="quantityForm.jobNumber = quantityForm.jobNumber.replace(/[^\d]/g,'')"
                  @keyup.enter.native="queryQuantity"
                  :placeholder="$t('placeholder.enterJobNumber')"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="quantityForm.type" :disabled='jobFlag' @change="handleChange" @visible-change="handleFocus" :style="quantityForm.type.length > 1 ? 'width: 390px' : ''" multiple multiple-limit="3" :placeholder="$t('table.alarmTypes')">
                  <el-option
                    v-for="item in alarmTypes"
                    :key="item.typeNumber"
                    :label="item.info"
                    :value="item.typeNumber"
                    :disabled="item.disabled"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select v-model="quantityForm.oqp1"  :disabled='jobFlag' class="w-100" :placeholder="$t('table.status')">
                  <el-option
                    v-for="item in status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="queryQuantity">{{ $t('btns.query') }}</el-button>
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
          </el-col>
        </el-row>
        <div
          v-loading="loading"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0)"
          :element-loading-text="$t('message.loading')"
        >
          <el-table  :data="quantityData" @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              align="center"
              width="55">
            </el-table-column>
            <el-table-column
              property="id"
              :label="$t('table.jobNumber')"
              align="center"
              width="150">
            </el-table-column>
            <el-table-column :label="$t('dialog.deviceNo')" align="center">
              <template slot-scope="scope">
                <span @click="handleSwitch(scope.row)" class="pointer">{{ scope.row.mac }}</span>
                <div>{{ scope.row.name }}</div>
              </template>
            </el-table-column>
            <el-table-column property="projectName" :label="$t('table.project')" align="center">
              <template slot-scope="scope">
                <span @click="handleSwitch(scope.row, 'project')" class="pointer">{{ scope.row.projectName }}</span>
              </template>
            </el-table-column>
            <el-table-column property="address" :label="$t('table.position')" align="center"></el-table-column>
            <el-table-column property="channel" :label="$t('table.line')" align="center" width="60"></el-table-column>
            <el-table-column
              property="info"
              :label="$t('home.alarm') + '/' + $t('home.warning') + $t('table.type')"
              align="center"
              width="180"
            >
            <template slot-scope="scope">
              <el-tooltip effect="dark" :content="scope.row['info']" placement="right">
                <span>{{scope.row.info}}</span>
              </el-tooltip>
            </template>
            </el-table-column>
            <el-table-column property="time" :label="$t('dialog.time')" align="center" width="160"></el-table-column>
            <el-table-column :label="$t('home.value')" align="center" width="120">
              <template slot-scope="scope">
                <el-popover placement="top" width="250" trigger="click">
                  <slot>
                    <div >
                      {{ alarmInfo }}
                    </div>
                  </slot>
                  <i
                    class="el-icon-news"
                    slot="reference"
                    v-show="scope.row.valueDescribe !== '' && JSON.stringify(scope.row.valueDescribe) !== '{}'"
                    @click="handleValue(scope.row.valueDescribe)"
                  ></i>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.status')" align="center" width="120">
              <template slot-scope="scope">
                <el-button type="text" v-if="scope.row.processStatus === 0" @click="handleUrge(scope.row.id)">{{ $t('table.urge') }}</el-button>
                <span
                  @click="queryMaintenance(scope.row)"
                  class="pointer" :class="scope.row.processStatus === 0 ? 'c-danger' : 'c-success'"
                >{{ scope.row.processStatus === 0 ? $t('home.unprocessed') : $t('home.processed') }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="block tc mt-10">
            <el-button size="small" :disabled="ids.length === 0" @click="handleBatchEdit(ids)">{{ $t('table.batchEditStatusProcessed') }}</el-button>
          <el-pagination
            @size-change="handleSizeChange"
            :page-sizes="[20, 50, 100, 500]"
            :page-size="quantityPageSize"
            layout="sizes">
          </el-pagination>
          <el-button-group>
            <el-button size="small" @click="handlePage('home')">{{ $t('system.home') }}</el-button>
            <el-button size="small" icon="el-icon-arrow-left" :disabled="page.length < 1" @click="handlePage('prev')">{{ $t('btns.prev') }}</el-button>
            <el-button size="small" @click="handlePage('next')" :disabled="quantityData.length < quantityPageSize">{{ $t('btns.next') }}<i class="el-icon-arrow-right el-icon--right"></i></el-button>
          </el-button-group>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :title="$t('control.maintenance') + $t('control.edit')"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible" append-to-body :modal="false" @close="closeMaintenance">
      <MaintenanceBox
      v-if="dialogVisible"
      :maintenanceBoxObj="maintenanceBoxObj"
      v-on:close-maintenance="closeMaintenance"
      ></MaintenanceBox>
    </el-dialog>
  </div>
</template>
<script>
/* global ctxPaths */
import store from '@/store'
import MaintenanceBox from './MaintenanceBox'
import { queryAlarmListOfPageById, findMaintenance, switchHover, alarmHandling, alarmHistoryStatisticalNumber, alarmUrgePush, queryAlarmForConfig } from '@/api/api'
export default {
  data () {
    return {
      loading: false,
      quantityType: '',
      quantityForm: {
        mac: '',
        jobNumber: '',
        type: '',
        oqp1: this.$route.params.status,
        month: this.$route.params.type === '2' ? [this.$func.formatDate('yyyy-MM-dd', new Date(new Date().getFullYear(), new Date().getMonth(), 1)), this.$func.getNowFormatDate()] : [this.$route.params.oqp2 === 2 ? this.$func.formatDate('yyyy-MM-dd', new Date(new Date().getFullYear(), new Date().getMonth(), 1)) : this.$func.formatDate('yyyy-MM-dd', new Date(new Date().getFullYear(), new Date().getMonth(), 1)), this.$func.getNowFormatDate()],
        lastId: ''
      },
      exportId: 0,
      page: [],
      prevId: '',
      quantityData: [],
      alarmData: [],
      quantityPageSize: 20,
      alarmInfo: [],
      status: [
        {
          value: '',
          label: this.$t('placeholder.all')
        },
        {
          value: '0',
          label: this.$t('home.unprocessed')
        },
        {
          value: '2',
          label: this.$t('home.processed')
        }
      ],
      alarmTypes: [],
      ids: [],
      alarmHistory: {},
      maintenanceBoxObj: {},
      dialogVisible: false,
      jobFlag: false
    }
  },
  mounted () {
    this.init()
    this.queryConfig()
  },
  methods: {
    init () {
      this.quantityForm.jobNumber = ''
      this.quantityForm.type = this.$route.params.typeNumber.split(',')
      this.queryAlarm()
      this.queryAlarmHistoryStatisticalNumber()
    },
    queryConfig () {
      queryAlarmForConfig({})
        .then(res => {
          this.alarmTypes = res.data.alarms.concat(res.data.warns)
          this.alarmTypes.unshift(
            {typeNumber: '-100', info: this.$t('menu.allAlarms')},
            {typeNumber: '-200', info: this.$t('placeholder.all') + this.$t('home.warning')}
          )
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
    queryAlarm (type) {
      this.quantityData = []
      this.quantityType = type
      let params = {}
      if (this.jobFlag) {
        params = {
          provinceId: this.$store.state.provinceId,
          cityId: this.$store.state.cityId,
          countryId: this.$store.state.countyId,
          lastId: this.quantityForm.lastId,
          rows: this.quantityPageSize,
          projectCode: this.$route.params.projectCode,
          typeNumbers: this.quantityForm.type ? this.quantityForm.type.join(',') : '',
          mac: this.quantityForm.mac ? this.quantityForm.mac : '',
          jobNumber: this.quantityForm.jobNumber ? this.quantityForm.jobNumber : '',
          oqp1: this.quantityForm.oqp1,
          startTime: this.quantityForm.month[0],
          endTime: this.quantityForm.month[1]
        }
      } else {
        params = {
          provinceId: this.$store.state.provinceId,
          cityId: this.$store.state.cityId,
          countryId: this.$store.state.countyId,
          lastId: this.quantityForm.lastId,
          rows: this.quantityPageSize,
          projectCode: this.$route.params.projectCode,
          typeNumbers: this.quantityForm.type ? this.quantityForm.type.join(',') : '',
          mac: this.quantityForm.mac ? this.quantityForm.mac : '',
          jobNumber: this.quantityForm.jobNumber ? this.quantityForm.jobNumber : '',
          oqp1: this.quantityForm.oqp1,
          startTime: this.quantityForm.month[0],
          endTime: this.quantityForm.month[1]
        }
      }
      if (this.$func.checkDateThreeMonths(params.startTime, params.endTime) === 'false') {
        this.$message({
          message: this.$t('message.limitThreeMonths'),
          type: 'error'
        })
        return false
      }
      queryAlarmListOfPageById(params)
        .then(res => {
          if (res.success) {
            this.quantityData = res.data
            if (res.data.length > 0) {
              this.quantityForm.lastId = res.lastId
              this.prevId = res.data[0].id + 1
              this.exportId = res.data[0].id
            } else {
              this.quantityForm.lastId = res.lastId
              this.exportId = 0
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
        .finally(() => {
          this.loading = false
        })
    },
    handleChange (val) {
      this.alarmTypes.forEach(v => {
        if (val.indexOf('-100') > -1) {
          if (v.typeNumber === '1' || v.typeNumber === '2' || v.typeNumber === '3' || v.typeNumber === '4' || v.typeNumber === '5' || v.typeNumber === '6' || v.typeNumber === '7' || v.typeNumber === '8' || v.typeNumber === '11' || v.typeNumber === '17' || v.typeNumber === '18' || v.typeNumber === '19' || v.typeNumber === '53' || v.typeNumber === '54' || v.typeNumber === '56' || v.typeNumber === '57' || v.typeNumber === '62' || v.typeNumber === '63' || v.typeNumber === '1001' || v.typeNumber === '1002' || v.typeNumber === '1005' || v.typeNumber === '2002' || v.typeNumber === '2003' || v.typeNumber === '2004' || v.typeNumber === '2006' || v.typeNumber === '9000' || v.typeNumber === '9001') {
            v.disabled = true
          }
        } else {
          if (v.typeNumber === '1' || v.typeNumber === '2' || v.typeNumber === '3' || v.typeNumber === '4' || v.typeNumber === '5' || v.typeNumber === '6' || v.typeNumber === '7' || v.typeNumber === '8' || v.typeNumber === '11' || v.typeNumber === '17' || v.typeNumber === '18' || v.typeNumber === '19' || v.typeNumber === '53' || v.typeNumber === '54' || v.typeNumber === '56' || v.typeNumber === '57' || v.typeNumber === '62' || v.typeNumber === '63' || v.typeNumber === '1001' || v.typeNumber === '1002' || v.typeNumber === '1005' || v.typeNumber === '2002' || v.typeNumber === '2003' || v.typeNumber === '2004' || v.typeNumber === '2006' || v.typeNumber === '9000' || v.typeNumber === '9001') {
            v.disabled = false
          }
        }
        if (val.indexOf('-200') > -1) {
          if (v.typeNumber === '9' || v.typeNumber === '10' || v.typeNumber === '12' || v.typeNumber === '13' || v.typeNumber === '14' || v.typeNumber === '15' || v.typeNumber === '16' || v.typeNumber === '55' || v.typeNumber === '58' || v.typeNumber === '1003' || v.typeNumber === '1004' || v.typeNumber === '1006') {
            v.disabled = true
          }
        } else {
          if (v.typeNumber === '9' || v.typeNumber === '10' || v.typeNumber === '12' || v.typeNumber === '13' || v.typeNumber === '14' || v.typeNumber === '15' || v.typeNumber === '16' || v.typeNumber === '55' || v.typeNumber === '58' || v.typeNumber === '1003' || v.typeNumber === '1004' || v.typeNumber === '1006') {
            v.disabled = false
          }
        }
      })
      let arr = ['1', '2', '3', '4', '5', '6', '7', '8', '11', '17', '18', '19', '53', '54', '56', '57', '62', '63', '1001', '1002', '1005', '2002', '2003', '2004', '2006', '9000', '9001']
      if (val.indexOf('-100') > -1) {
        arr.forEach(item => {
          val.forEach((items, index) => {
            if (items === item) {
              val.splice(index, 1)
            }
          })
        })
      }
      let arr1 = ['9', '10', '12', '13', '14', '15', '16', '55', '58', '1003', '1004', '1006']
      if (val.indexOf('-200') > -1) {
        arr1.forEach(item => {
          val.forEach((items, index) => {
            if (items === item) {
              val.splice(index, 1)
            }
          })
        })
      }
    },
    handleFocus () {
      this.alarmTypes.forEach(v => {
        if (this.quantityForm.type.indexOf('-100') > -1) {
          if (v.typeNumber === '1' || v.typeNumber === '2' || v.typeNumber === '3' || v.typeNumber === '4' || v.typeNumber === '5' || v.typeNumber === '6' || v.typeNumber === '7' || v.typeNumber === '8' || v.typeNumber === '11' || v.typeNumber === '17' || v.typeNumber === '18' || v.typeNumber === '19' || v.typeNumber === '53' || v.typeNumber === '54' || v.typeNumber === '56' || v.typeNumber === '57' || v.typeNumber === '62' || v.typeNumber === '63' || v.typeNumber === '1001' || v.typeNumber === '1002' || v.typeNumber === '1005' || v.typeNumber === '2002' || v.typeNumber === '2003' || v.typeNumber === '2004' || v.typeNumber === '2006' || v.typeNumber === '9000' || v.typeNumber === '9001') {
            v.disabled = true
          }
        } else {
          if (v.typeNumber === '1' || v.typeNumber === '2' || v.typeNumber === '3' || v.typeNumber === '4' || v.typeNumber === '5' || v.typeNumber === '6' || v.typeNumber === '7' || v.typeNumber === '8' || v.typeNumber === '11' || v.typeNumber === '17' || v.typeNumber === '18' || v.typeNumber === '19' || v.typeNumber === '53' || v.typeNumber === '54' || v.typeNumber === '56' || v.typeNumber === '57' || v.typeNumber === '62' || v.typeNumber === '63' || v.typeNumber === '1001' || v.typeNumber === '1002' || v.typeNumber === '1005' || v.typeNumber === '2002' || v.typeNumber === '2003' || v.typeNumber === '2004' || v.typeNumber === '2006' || v.typeNumber === '9000' || v.typeNumber === '9001') {
            v.disabled = false
          }
        }
        if (this.quantityForm.type.indexOf('-200') > -1) {
          if (v.typeNumber === '9' || v.typeNumber === '10' || v.typeNumber === '12' || v.typeNumber === '13' || v.typeNumber === '14' || v.typeNumber === '15' || v.typeNumber === '16' || v.typeNumber === '55' || v.typeNumber === '58' || v.typeNumber === '1003' || v.typeNumber === '1004' || v.typeNumber === '1006') {
            v.disabled = true
          }
        } else {
          if (v.typeNumber === '9' || v.typeNumber === '10' || v.typeNumber === '12' || v.typeNumber === '13' || v.typeNumber === '14' || v.typeNumber === '15' || v.typeNumber === '16' || v.typeNumber === '55' || v.typeNumber === '58' || v.typeNumber === '1003' || v.typeNumber === '1004' || v.typeNumber === '1006') {
            v.disabled = false
          }
        }
      })
    },
    queryAlarmHistoryStatisticalNumber () {
      let params = this.alarmHistory
      alarmHistoryStatisticalNumber(params)
        .then(res => {
          if (res.data) {
            this.alarmData = res.data
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
    queryQuantity () {
      this.page = []
      this.quantityForm.lastId = ''
      this.queryAlarm(this.quantityType)
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
        this.alarmInfo = `${type}: ${obj.value + 'Lux'} ${'(' + this.$t('table.threshold') + ':' + obj.threshold + ')'}`
      } else if (obj.elecType === 14) {
        this.alarmInfo = `${type}: ${obj.value1 + obj.unit1}`
      } else {
        this.alarmInfo = `${type}: ${obj.value}${obj.unit} ${'(' + this.$t('table.threshold') + ':' + obj.threshold + ')'}`
      }
    },
    handleChangeDate () {
      this.page = []
      this.quantityForm.lastId = ''
    },
    handlePage (e) {
      if (e === 'home') {
        this.quantityForm.lastId = ''
        this.page = []
      } else if (e === 'prev') {
        this.quantityForm.lastId = this.page.pop()
      } else if (e === 'next') {
        this.page.push(this.prevId)
      }
      store.commit('quantityPage', this.page)
      this.queryAlarm()
    },
    handleSizeChange (val) {
      this.page = []
      this.quantityForm.lastId = ''
      this.quantityPageSize = val
      store.commit('quantityPageSize', val)
      this.queryAlarm()
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
            if (this.page.length === 0) {
              this.quantityForm.lastId = ''
            } else {
              this.quantityForm.lastId = this.prevId
            }
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
    handleCommand (command) {
      if (this.$func.checkDateThreeMonths(this.quantityForm.month[0], this.quantityForm.month[1]) === 'false') {
        this.$message({
          message: this.$t('message.limitThreeMonths'),
          type: 'error'
        })
        return false
      }
      this.$func.windowCountDown(ctxPaths + '/project/main/v3/xls/exportAlarmListOfPage.as?projectCode=' + (this.$route.params.projectCode ? this.$route.params.projectCode : '') + '&provinceId=' + (this.$store.state.provinceId ? this.$store.state.provinceId : '') + '&cityId=' + (this.$store.state.cityId ? this.$store.state.cityId : '') + '&countyId=' + (this.$store.state.countyId ? this.$store.state.countyId : '') + '&mac=' + this.quantityForm.mac + '&typeNumbers=' + (this.quantityForm.type ? this.quantityForm.type.join(',') : 0) + '&lastId=' + this.exportId + '&rows=' + this.quantityPageSize + '&oqp1=' + (this.quantityForm.oqp1 ? this.quantityForm.oqp1 : '') + '&startTime=' + String(this.quantityForm.month[0]) + '&endTime=' + String(this.quantityForm.month[1]) + '&exportType=' + (command === 'current' ? 'exportCurrent' : ''))
    },
    handleSwitch (obj, type) {
      let params = {
        projectCode: obj.projectCode
      }
      switchHover(params)
        .then(res => {
          if (res.success) {
            store.commit('projectCode', obj.projectCode)
            store.commit('fullName', obj.projectName)
            store.commit('distributionDateType', 1)
            if (type !== 'project') {
              store.commit('equipmentType', obj.equipmentType)
              store.commit('overviewMac', obj.mac)
            } else {
              store.commit('equipmentType', 1)
              store.commit('overviewMac', '')
            }
            this.$router.push({path: '/InnerMain/Overview'})
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
    handleSelectionChange (val) {
      this.ids = []
      val.forEach((item) => {
        this.ids.push(item.id)
      })
    },
    handleBatchEdit (ids) {
      alarmHandling({id: ids.join(','), isSolve: 1})
        .then(res => {
          if (res.success) {
            this.quantityForm.lastId = ''
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.queryAlarm()
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
    '$store.state.location': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.queryAlarm()
        }
      },
      deep: true
    },
    '$route': {
      handler (to, from) {
        if (to.path === '/Alarm') {
          if (from.path === '/Home') {
            this.quantityForm.jobNumber = ''
            this.alarmHistory = {}
          } else if (from.path === '/InnerMain/Overview') {
            this.alarmHistory = {
              projectCode: this.$route.params.projectCode
            }
          }
          if (from.path === '/MaintenanceBox') return false
          this.quantityForm.lastId = ''
          this.quantityForm.oqp1 = this.$route.params.status
          this.quantityForm.jobNumber = ''
          this.quantityForm.mac = this.$route.params.mac ? this.$route.params.mac : ''
          if (this.$route.params.type === '2') {
            this.quantityForm.month = [this.$func.formatDate('yyyy-MM-dd', new Date(new Date().getFullYear(), new Date().getMonth(), 1)), this.$func.getNowFormatDate()]
          } else {
            if (this.$route.params.oqp2 === 2) {
              this.quantityForm.month = [this.$route.params.oqp2 === 2 ? this.$func.formatDate('yyyy-MM-dd', new Date(new Date().getFullYear(), new Date().getMonth(), 1)) : this.$func.getNowFormatDate(), this.$func.getNowFormatDate()]
            } else {
              this.quantityForm.month = [this.$func.getNowFormatDate(), this.$func.getNowFormatDate()]
            }
          }
          this.queryAlarm()
          this.queryAlarmHistoryStatisticalNumber()
        }
      }
    },
    '$route.params.typeNumber': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.quantityForm.type = newVal.split(',')
          this.queryAlarm()
        }
      },
      deep: true
    },
    'quantityForm.jobNumber': {
      handler (newVal, oldVal) {
        if (newVal.length > 0) {
          this.jobFlag = true
        } else {
          this.jobFlag = false
        }
      },
      deep: true
    }
  },
  components: {
    MaintenanceBox
  }
}
</script>
<style lang="stylus" scoped>
#alarms >>> .el-form-item__label
  color #fff
.el-button--small
  font-size 14px
.el-pagination
  padding 0 5px
  margin-top 0
  display inline-block
  vertical-align middle
  .el-pagination__sizes, >>> span:not([class*=suffix]), >>> .el-input__inner
    margin-right 0
    height 34px
.block
  .el-pagination
    height 34px
    line-height 34px
  .el-date-editor.el-input__inner
    width 250px
.w-100
  width 100px
</style>
