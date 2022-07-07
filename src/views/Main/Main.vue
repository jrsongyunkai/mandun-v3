<template>
  <div id="main">
    <el-col :md="7">
      <pie-chart
        :options="options"
        :title="$t('home.industryAlarmAnalysis')"
        :refreshFlag="true"
        :pieChartFlag="pieChartFlag"
        :initRatioOfIndustry="initRatioOfIndustry"
        class="boundary"
      ></pie-chart>
      <el-col :md="24" class="boundary warn-info-title">
        <el-row class="chart-title">
          <el-col
            :md="23"
            :xs="23"
            :sm="23"
            class="el-padding-left-20"
          >{{$t('home.alarmInformationProcessingSituation')}}(月度)</el-col>
          <el-col :md="1" :xs="1" :sm="1"><i class="el-icon-refresh" style="right: 12px" @click="barRefresh"></i></el-col>
        </el-row>
        <el-col :md="24">
          <dashboard-chart :options="alarmOptions" :barChartFlag="barChartFlag"></dashboard-chart>
        </el-col>
      </el-col>
    </el-col>
    <el-col :md="fullSize" class="full-screen">
      <i class="iconfont icon-icon-" @click="handleFullScreen"></i>
      <i class="el-icon-refresh" style="top: 20px" @click="mapRefresh"></i>
      <map-chart ref="mapChart" class="boundary" :options="mapOptions"></map-chart>
    </el-col>
    <el-col :md="24" class="real-time-alarm">
      <el-row :gutter="20" class="realtimeAlarmList">
        <el-col :md="24" :xs="24" :sm="24" class="real-time-alarm-title el-padding-left-20">
          <el-col :span="4">{{ $t('home.realtimeAlarmList') }}</el-col>
          <el-col :span="12">
            <el-checkbox-group v-model="filterType" class="filterType" @change="handleFilterType">
              <el-checkbox :label="$t('control.includeWarning')"></el-checkbox>
              <el-checkbox :label="$t('control.showOnlyOfflineAlarms')"></el-checkbox>
            </el-checkbox-group>
            <i class="el-icon-refresh" @click="tableRefresh"></i>
          </el-col>
        </el-col>
        <el-col :span="24">
          <div class="loading" :style="{height: tableHeight}" v-if="!tableDataFlag"><i class="el-icon-loading"></i></div>
          <el-table
            v-else
            :data="tableData"
            size="mini"
            :height="tableHeight"
            style="width: 100%;"
            :cell-class-name="tableRowClassName"
            v-el_scrollBar:scrollBar
          >
            <el-table-column prop="projectName" :label="$t('table.project')">
              <template slot-scope="scope">
                <span
                  :class="scope.row.classify === -100 ? 'alarm' : 'warn'"
                >{{ scope.row.classify === -100 ? $t('table.tagA') : $t('table.tagW')}}</span>
                <span @click="handleSwitch(scope.row, 'project')" class="state-icon-mr pointer">{{ scope.row.projectName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="address" :label="$t('table.location')">
              <template slot-scope="scope">
                <div @click="handleSwitch(scope.row)" class="pointer">{{ scope.row.address }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="address" :label="$t('dialog.deviceAlias')">
              <template slot-scope="scope">
                <div @click="handleDetails(scope.row)" class="pointer">{{ scope.row.macName }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="channelTitle" :label="$t('table.line')"></el-table-column>
            <el-table-column prop="info" :label="$t('table.alarmType')"></el-table-column>
            <el-table-column prop="time" :label="$t('table.alarmTime')"></el-table-column>
            <el-table-column prop="progress" :label="$t('table.schedule')">
              <template slot-scope="scope">
                <el-progress
                  :text-inside="true"
                  :stroke-width="18"
                  :show-text="false"
                  :class="scope.row.stage === 2 ? 'solved' : 'rejected'"
                  :percentage="100"
                  v-if="scope.row.progress > 100"
                ></el-progress>
                <el-progress
                  v-else
                  :text-inside="true"
                  :stroke-width="18"
                  :show-text="false"
                  :class="scope.row.stage === 2 ? 'solved' : 'rejected'"
                  :percentage="scope.row.progress"
                ></el-progress>
              </template>
            </el-table-column>
            <el-table-column prop="passTime" width="100" :label="$t('table.timeConsuming')">
              <template slot-scope="scope">
                <span
                  :class="scope.row.passTime === '48' ? 'danger-text' : 'warning-text'"
                >{{scope.row.passTime + $t('table.hour') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="stage" width="100" :label="$t('table.status')">
              <template slot-scope="scope">
                <span
                  class="pointer"
                  :class="scope.row.stage === 0 ? 'c-danger' : 'c-success'"
                  @click="queryMaintenance(scope.row)"
                >{{ scope.row.stage === 0 ? $t('home.unprocessed') : $t('home.processed') }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-col>
    <el-dialog
      :title="$t('control.maintenance') + $t('control.edit')" :close-on-click-modal="false"
      :visible.sync="dialogVisible" append-to-body :modal="false" @close="closeMaintenance">
      <MaintenanceBox
      v-if="dialogVisible"
      :maintenanceBoxObj="maintenanceBoxObj"
      v-on:close-maintenance="closeMaintenance"
      ></MaintenanceBox>
    </el-dialog>
    <el-dialog title="报警详情" :close-on-click-modal="false" append-to-body :modal="false" :visible.sync="detailsVisible" custom-class="custom-password">
      <div style="height:520px">
        <el-col :span="12">
          <el-form :model="form" class="ml-20" size="small" label-position="right">
            <el-form-item label="工单号：" prop="id" :label-width="80">{{form.id}}</el-form-item>
            <el-form-item label="项目：" prop="projectName" :label-width="80">{{form.projectName}}</el-form-item>
            <el-form-item label="设备号：" prop="mac" :label-width="80">{{form.mac}}</el-form-item>
            <el-form-item label="联系人：" prop="linkman" :label-width="80">{{form.linkman}}</el-form-item>
            <el-form-item label="预警类型：" prop="info" :label-width="80">{{form.info}}</el-form-item>
            <el-form-item label="线路：" prop="channelTitle" :label-width="80">{{form.channelTitle}}</el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :model="form" size="small" label-position="right">
            <el-form-item label="设备别名：" prop="macName" :label-width="80">{{form.macName}}</el-form-item>
            <el-form-item label="地点：" prop="porjectAddress" :label-width="80">
              <div class="no_wrap" :title="form.projectAddress">{{form.projectAddress}}</div>
            </el-form-item>
            <el-form-item label="在线状态：" prop="onlineStatus" :label-width="80">
              <span :class="form.onlineStatus === 1 ? 'c-success' : form.onlineStatus === 0 ? 'c-danger' : 'c-info'">{{form.onlineStatus === 1 ? '在线' : form.onlineStatus === 0 ? '离线' : '脱线'}}<span class="fs-12" v-if="form.offLineTime">{{'(' + form.offLineTime + ')'}}</span></span>
            </el-form-item>
            <el-form-item label="联系电话：" prop="linkmanTel" :label-width="80">{{form.linkmanTel}}</el-form-item>
            <el-form-item label="报警时间：" prop="time" :label-width="80">{{form.time}}</el-form-item>
            <el-form-item label="线路状态：" :label-width="80">
               <span v-if="typeof form.oc !== 'undefined'" :class="form.oc ? 'c-success' : 'c-danger'">{{form.oc ? '已通' : '已断'}}</span>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="24">
           <el-table
              class="device-wrap"
              :data="electricData"
              border
              style="width: 100%">
              <el-table-column
                align="center"
                prop="name">
              </el-table-column>
              <el-table-column
                align="center"
                prop="A"
                :label="typeof form.bA !== 'undefined' ? 'A相' : '单相'">
                <template slot-scope="scope">
                  <span v-if="scope.$index === 2 && form.aT < -38"><i class="iconfont icon-jieruguanli" :title="$t('table.missedProbe')"></i></span>
                  <span v-else>{{scope.row.A}}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="B"
                :label="typeof form.bA !== 'undefined' ? 'B相' : ''">
                <template slot-scope="scope">
                  <span v-if="scope.$index === 2 && form.bT < -38"><i class="iconfont icon-jieruguanli" :title="$t('table.missedProbe')"></i></span>
                  <span v-else>{{scope.row.B}}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="C"
                :label="typeof form.bA !== 'undefined' ? 'C相' : ''">
                <template slot-scope="scope">
                  <span v-if="scope.$index === 2 && form.cT < -38"><i class="iconfont icon-jieruguanli" :title="$t('table.missedProbe')"></i></span>
                  <span v-else>{{scope.row.C}}</span>
                </template>
              </el-table-column>
            </el-table>
        </el-col>
        <el-col :span="12" class="mt-30 ml-10 fs-16">总功率: {{typeof form.gWp !== 'undefined' ? form.gWp + 'w' : '--'}}</el-col>
        <el-col :span="11" class="mt-30 ml-5 fs-16">剩余电流: {{typeof form.gLd !== 'undefined' ? form.gLd + 'mA' : '--'}} </el-col>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import store from '@/store'
import screenfull from 'screenfull'
import { queryRealtimeAlarm, findMaintenance, switchHover, classifiedAlarm, getClosestRealTimeByAlarmTime } from '@/api/api'
import MapChart from '../Common/Map'
import PieChart from '../Common/Pie'
import DashboardChart from '../Common/Dashboard'
import MaintenanceBox from '../Home/MaintenanceBox'
export default {
  data () {
    return {
      options: {
        colorList: [],
        series: [
          {
            name: this.$t('home.industryAlarmAnalysis'),
            type: 'pie',
            radius: ['0%', '60%'],
            center: ['50%', '50%'],
            label: {
              formatter: '{b}\n{c}'
            },
            labelLine: {
              smooth: 0.2
            },
            startAngle: '140',
            data: []
          }
        ]
      },
      form: [],
      electricData: [],
      alarmOptions: {
        data: [],
        processRatio: ''
      },
      mapOptions: {
        fullScreen: false
      },
      fullSize: 17,
      fullScreen: false,
      flag: false,
      tableFlag: true,
      loadMore: true,
      tablePage: 0,
      lastTime: '',
      lastId: '',
      tableData: [],
      datas: [],
      intervalId: '',
      provinceId: '',
      cityId: '',
      countyId: '',
      filterType: [],
      filterTypeParam: '',
      maintenanceBoxObj: {},
      dialogVisible: false,
      tableHeight: this.$store.state.heightSecond,
      pieChartFlag: false,
      barChartFlag: false,
      tableDataFlag: false,
      detailsVisible: false
    }
  },
  mounted () {
    this.initMap()
    screenfull.on('change', (e) => {
      this.fullScreen = screenfull.isFullscreen
      this.fullSize = screenfull.isFullscreen ? 24 : 17
    })
  },
  methods: {
    initMap () {
      this.flag = true
      setTimeout(() => {
        this.initNumberOfHandling()
      }, Math.random() * 2000)
      setTimeout(() => {
        this.initRatioOfIndustry()
      }, Math.random() * 2000)
      setTimeout(() => {
        this.initQueryRealtimeAlarm()
      }, Math.random() * 2000)
    },
    initRatioOfIndustry () {
      this.pieChartFlag = false
      let params = {
        oqp1: 1,
        projectCode: this.$store.state.projectCode,
        typeNumbers: '1,2,3,4,5,6,7,8,11,17',
        provinceId: this.provinceId,
        cityId: this.cityId,
        countyId: this.countyId
      }
      classifiedAlarm(params)
        .then(res => {
          store.commit('ratioOfIndustry', res)
          this.loadRationOfIndustry()
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
          this.pieChartFlag = true
        })
    },
    initNumberOfHandling () {
      this.barChartFlag = false
      let params = {
        oqp1: 3,
        projectCode: this.$store.state.projectCode,
        typeNumbers: '1,2,3,4,5,6,7,8,11,17',
        provinceId: this.provinceId,
        cityId: this.cityId,
        countyId: this.countyId
      }
      classifiedAlarm(params)
        .then(res => {
          store.commit('numberOfHandling', res)
          this.loadNumberOfHandling()
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
          this.barChartFlag = true
        })
    },
    loadRationOfIndustry () {
      let ratioOfIndustry = this.$store.state.classifiedAlarm.ratioOfIndustry
      if (ratioOfIndustry.success) {
        this.options.series[0].data = []
        ratioOfIndustry.data.ratioOfIndustry.forEach((v, i) => {
          this.options.colorList = ['#00ffaa', '#a4ffd1', '#00dfff', '#00ff00', '#ff1d79', '#ffa68a', '#ff3939', '#a4a4a5', '#ffa42c', '#061a23']
          this.options.series[0].center = ['50%', '60%']
          this.options.series[0].labelLine.length = 5
          this.options.series[0].labelLine.length2 = 5
          this.options.series[0].data.push({value: v.others.number, name: v.name})
        })
      } else {
        this.options.series[0].data = []
      }
    },
    loadNumberOfHandling () {
      let numberOfHandling = this.$store.state.classifiedAlarm.numberOfHandling
      if (numberOfHandling.success) {
        this.alarmOptions.data = []
        this.alarmOptions.processRatio = ''
        this.alarmOptions.processRatio = numberOfHandling.data.numberOfHandling.processRatio
        numberOfHandling.data.numberOfHandling.alarmProcess.forEach((v, i) => {
          if (i === 0) {
            this.alarmOptions.data.push({data: [v]})
          } else if (i === 1) {
            this.alarmOptions.data.push({data: [v]})
          } else if (i === 2) {
            this.alarmOptions.data.push({data: [v]})
          }
        })
      } else {
        this.alarmOptions.data = []
        this.alarmOptions.processRatio = ''
      }
    },
    initQueryRealtimeAlarm () {
      this.tableDataFlag = false
      let params = {
        projectCode: '',
        lastTime: '',
        lastId: 0,
        provinceId: this.provinceId,
        cityId: this.cityId,
        countyId: this.countyId,
        typeNumbers: this.filterTypeParam
      }
      queryRealtimeAlarm(params)
        .then(res => {
          this.tableData = res.data.datalist
          this.datas = res
          this.loadingMore()
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
          this.tableDataFlag = true
        })
    },
    loadingMore () {
      let that = this
      const selectWrap = document.querySelector('.el-table__body-wrapper')
      if (selectWrap) {
        selectWrap.addEventListener('scroll', function () {
          const sign = 100
          const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
          if (scrollDistance <= sign && that.loadMore) {
            that.loadMore = false
            that.getNewData()
          }
        })
      }
    },
    getNewData () {
      let that = this
      this.tablePage++
      let datas = this.datas
      if (this.tableFlag) {
        if (this.tablePage === 1) {
          let params = {
            projectCode: '',
            lastTime: datas.data.lastTime,
            lastId: datas.data.lastId,
            provinceId: this.provinceId,
            cityId: this.cityId,
            countyId: this.countyId,
            typeNumbers: this.filterTypeParam
          }
          this.$nextTick(function () {
            queryRealtimeAlarm(params)
              .then(res => {
                if (res.success) {
                  that.tableData = that.tableData.concat(res.data.datalist)
                  that.lastId = res.data.lastId
                  that.lastTime = res.data.lastTime
                  that.loadMore = true
                } else if (res.code === '-1') {
                } else {
                  that.loadMore = false
                }
              })
              .catch(res => {
                that.$message({
                  message: this.$('message.noMoreData'),
                  type: 'error'
                })
              })
          })
        } else {
          if (that.lastTime === '') {
            return false
          }
          let params = {
            projectCode: '',
            lastTime: that.lastTime,
            lastId: that.lastId,
            provinceId: that.provinceId,
            cityId: that.cityId,
            countyId: that.countyId,
            typeNumbers: that.filterTypeParam
          }
          queryRealtimeAlarm(params)
            .then(res => {
              if (res.success) {
                that.tableData = that.tableData.concat(res.data.datalist)
                that.lastId = res.data.lastId
                that.lastTime = res.data.lastTime
                that.loadMore = true
              } else if (res.code === '-1') {
              } else {
                that.loadMore = false
              }
            })
            .catch(res => {
              that.$message({
                message: this.$('message.noMoreData'),
                type: 'error'
              })
            })
        }
      }
    },
    queryRealtimeAlarm (e) {
      let res = this.$store.state.realtimeAlarm
      if (res.success) {
        this.tableData = res.data.datalist
      } else if (res.code === '-1') {
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    tableRowClassName ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4) {
        if (row.classify === 1) {
          if (columnIndex === 0) {
            return 'danger-row start-column'
          } else if (columnIndex === 4) {
            return 'danger-row end-column'
          } else {
            return 'danger-row'
          }
        } else if (row.classify === 2) {
          if (columnIndex === 0) {
            return 'warning-row start-column'
          } else if (columnIndex === 4) {
            return 'warning-row end-column'
          } else {
            return 'warning-row'
          }
        }
      }
      return ''
    },
    requestFullscreen (element) {
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
      }
    },
    handleFullScreen () {
      if (!screenfull.isEnabled) {
        this.$message({
          message: this.$t('message.full'),
          type: 'warning'
        })
        return false
      }
      this.fullScreen = !this.fullScreen
      let ele = document.querySelector('.full-screen')
      if (this.fullScreen) {
        this.requestFullscreen(ele)
      } else {
        screenfull.exit()
      }
      this.mapOptions.fullScreen = this.fullScreen
    },
    barRefresh () {
      this.initNumberOfHandling()
    },
    mapRefresh () {
      this.$refs.mapChart.statisticalNumber()
    },
    tableRefresh () {
      this.initQueryRealtimeAlarm()
    },
    handleFilterType (val) {
      this.tableData = []
      if (val.length > 0) {
        if (val.length === 1 && val[0] === this.$t('control.includeWarning')) {
          this.filterTypeParam = 0
        } else {
          this.filterTypeParam = 1002
        }
      } else {
        this.filterTypeParam = ''
      }
      this.initQueryRealtimeAlarm()
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
    handleSwitch (obj, type) {
      let params = {
        projectCode: obj.projectCode
      }
      switchHover(params)
        .then(res => {
          if (res.success) {
            store.commit('projectCode', obj.projectCode)
            store.commit('fullName', obj.projectName)
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
    handleDetails (row) {
      let params = {
        mac: row.mac,
        resId: row.resId,
        addr: row.chnlAddr,
        alarmTime: row.time
      }
      getClosestRealTimeByAlarmTime(params)
        .then(res => {
          if (res.success) {
            this.form = Object.assign(res.data, row)
            if (typeof this.form.bA !== 'undefined') {
              this.electricData = [{
                name: '电流',
                A: typeof this.form.aA !== 'undefined' ? this.form.aA + 'A' : '--',
                B: typeof this.form.bA !== 'undefined' ? this.form.bA + 'A' : '--',
                C: typeof this.form.cA !== 'undefined' ? this.form.cA + 'A' : '--'
              }, {
                name: '电压',
                A: typeof this.form.aV !== 'undefined' ? this.form.aV + 'V' : '--',
                B: typeof this.form.bV !== 'undefined' ? this.form.bV + 'V' : '--',
                C: typeof this.form.cV !== 'undefined' ? this.form.cV + 'V' : '--'
              }, {
                name: '温度',
                A: typeof this.form.aT !== 'undefined' ? this.form.aT + '℃' : '--',
                B: typeof this.form.bT !== 'undefined' ? this.form.bT + '℃' : '--',
                C: typeof this.form.cT !== 'undefined' ? this.form.cT + '℃' : '--'
              }]
            } else {
              this.electricData = [{
                name: '电流',
                A: typeof this.form.aA !== 'undefined' ? this.form.aA + 'A' : '--'
              }, {
                name: '电压',
                A: typeof this.form.aV !== 'undefined' ? this.form.aV + 'V' : '--'
              }, {
                name: '温度',
                A: typeof this.form.aT !== 'undefined' ? this.form.aT + '℃' : '--'
              }]
            }
            this.detailsVisible = true
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
      this.initQueryRealtimeAlarm()
    }
  },
  watch: {
    '$store.state.location': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.provinceId = newVal[0]
          this.cityId = newVal[1]
          this.countyId = newVal[2]
          this.initMap()
        }
        this.loadMore = true
        this.tablePage = 0
        if (document.querySelector('.el-table__body-wrapper')) {
          document.querySelector('.el-table__body-wrapper').scrollTop = 0
        }
      },
      deep: true
    },
    '$route' (to, from) {
      if (from.path === '/MaintenanceBox' && to.path === '/Home') this.initQueryRealtimeAlarm()
    },
    '$store.state.heightSecond': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.tableHeight = newVal
        }
      }
    }
  },
  components: {
    PieChart,
    DashboardChart,
    MapChart,
    MaintenanceBox
  }
}
</script>
<style lang="stylus" scoped>
.warn-info-title
    margin-top 20px
    padding 0 !important
.el-table >>> table
    border-collapse separate
    border-spacing 0px 5px
.el-table >>> .cell,.boundary >>> .grid-content
    /*! autoprefixer off */
    /* autoprefixer on */
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
.el-table, .el-table__expanded-cell, .el-table >>> th, .el-table >>> tr
    border none
    background-color transparent
    color #fff
.el-table >>> td, .el-table >>> th.is-leaf
    border none
.el-table--striped .el-table__body >>> tr.el-table__row--striped >>> td
    background-color transparent
.el-table >>> .warning-row
  background #5A5C5B
.el-table >>> .danger-row
    background #544558
.el-progress.el-progress--line.el-progress--without-text.el-progress--text-inside
    width 100%
.solved >>> .el-progress-bar__outer
    background rgba(32, 180, 252, .8)
.el-table >>> .el-progress-bar__inner
    background -webkit-linear-gradient(left, #caaa31 , #ba5984)
    background -o-linear-gradient(right, #caaa31, #ba5984)
    background -moz-linear-gradient(right, #caaa31, #ba5984)
    background linear-gradient(to right, #caaa31 , #ba5984)
.el-table .danger-text
    color #F56C6C
.el-table .warning-text
    color #E6A23C
.real-time-alarm .el-row
    margin 20px 0 0 !important
    padding-bottom 20px
    -webkit-border-radius 10px
    -moz-border-radius 10px
    border-radius 10px
.alarm, .warn
    width 30px
    height 32px
    text-align center
    line-height 32px
    border-radius 50%
    position absolute
    left 0
    top 50%
    margin-top -16px
    -webkit-border-radius 50%
    -moz-border-radius 50%
    border-radius 50%
.alarm
    background #F56C6C
.warn
    background #E6A23C
.el-table >>> .start-column
    border-top-left-radius 18px
    border-bottom-left-radius 18px
.el-table >>> .end-column
    border-top-right-radius 18px
    border-bottom-right-radius 18px
.el-table >>> .state-icon-mr
    margin-left 26px
.full-screen
    position relative
.icon-icon-
    position absolute
    top 20px
    left 20px
    cursor pointer
    z-index 2002
.el-icon-refresh
    position absolute
    top 12px
    right 20px
    cursor pointer
    opacity 0
    z-index 2002
    &:hover
      opacity 1
.filterType >>> .el-checkbox__label
    color #fff
.boundary
    border 2px solid #303a5ecc
    box-shadow 3px 3px 6px 1px rgba(0, 0, 0, .2)
.chart-title, .real-time-alarm-title
    border-bottom 2px solid #303a5ecc
.realtimeAlarmList
    border 2px solid #303a5ecc
    box-shadow 3px 3px 6px 1px rgba(0, 0, 0, .2)
.loading
  position relative
.el-icon-loading
  position absolute
  left 50%
  top 42%
  font-size 50px
  opacity 0.5
/deep/ .custom-password .el-form-item__label
          color #606266
.no_wrap
  width 250px
  text-overflow ellipsis
  overflow hidden
  white-space nowrap
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
/deep/ .custom-password .el-form-item__label
    line-height 20px
/deep/ .custom-password .el-form-item__content
    line-height 20px
</style>
