<template>
  <div id="devices">
    <el-row :gutter="20" style="margin: 0; padding:20px">
      <el-col>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="pointer" @click.native="$router.go(-1)">{{ $t('btns.back') }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $t('dialog.deviceList') }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline tr mt-20">
          <el-form-item>
            <el-select
              v-model="formInline.projectCode"
              clearable
              filterable
              :placeholder="$t('table.pleaseEnter') + $t('table.projectName')"
            >
              <el-option
                v-for="item in projectNames"
                :key="item.projectCode"
                :label="item.projectName"
                :value="item.projectCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="formInline.mac"
              @keyup.enter.native="onSubmit"
              :placeholder="$t('placeholder.enterDeviceNo')"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="formInline.aliasName"
              @keyup.enter.native="onSubmit"
              :placeholder="$t('table.pleaseEnter') + $t('dialog.deviceAlias')"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="formInline.addr"
              @keyup.enter.native="onSubmit"
              :placeholder="$t('placeholder.enterPosition')"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="formInline.status"
              multiple
              clearable
              collapse-tags
              :style="{width: '130px'}"
              :placeholder="$t('dialog.equipmentStatus')"
            >
              <el-option
                v-for="item in stats"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">{{ $t('btns.query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-dropdown trigger="click" @command="handleCommand">
              <el-button>
                {{ $t('home.export') }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="current">{{ $t('btns.exportCurrent') }}</el-dropdown-item>
                <el-dropdown-item command="all">{{ $t('btns.exportAll') }}</el-dropdown-item>
                 <el-dropdown-item command="electric">{{
              $t('home.export') + $t('home.DevicelectricStatistical')
              }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
          <el-form-item>
            <el-button type="text" class="c-default" @click="toChannelList()" style="font-size: 14px" >{{ $t('dialog.channelList') }}</el-button>
          </el-form-item>
        </el-form>
        <div
          v-loading="loading"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0)"
          :element-loading-text="$t('message.loading')"
        >
          <el-table :data="devicesData">
            <el-table-column property="mac" :label="$t('dialog.deviceNo')" align="center">
              <template slot-scope="scope">
                <div @click="handleSwitch(scope.row)" class="pointer">{{ scope.row.mac }}</div>
                <div>{{ scope.row.name }}</div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.projectName')" align="center">
              <template slot-scope="scope">
                <div @click="handleSwitch(scope.row, 'project')" class="pointer">{{ scope.row.projectName }}</div>
              </template>
            </el-table-column>
            <el-table-column property="projectAddress" :label="$t('table.position')" align="center"></el-table-column>
            <el-table-column :label="$t('table.status')" align="center" width="100">
              <template slot-scope="scope">
                <span v-show="scope.row.stats === -1" class="c-info">{{ $t('table.offLine') }}</span>
                <span v-show="scope.row.stats === 0" class="c-danger">{{ $t('control.offline') }}</span>
                <span v-show="scope.row.stats === 1" class="c-success">{{ $t('table.online') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              property="offlineTime"
              :label="$t('control.offline') + $t('dialog.time')"
              align="center"
              width="180"
            ></el-table-column>
            <el-table-column property="linkman" :label="$t('table.contact')" align="center" width="120"></el-table-column>
            <el-table-column
              property="linktel"
              :label="$t('table.contactNumber')"
              align="center"
              width="180"
            ></el-table-column>
            <el-table-column
              :label="$t('table.inspection')"
              align="center"
              width="120">
              <template slot-scope="scope">
                <el-button type="text" class="fs-14" @click="handleInspection(scope.row)">{{ $t('table.conductPatrolInspection') }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('table.inspection') + $t('control.recording')"
              align="center"
              width="120">
              <template slot-scope="scope">
                <el-button type="text" class="fs-14" @click="handleViewInspection(scope.row)">{{ $t('btns.view') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block tc mt-10">
            <el-pagination
              background
              small
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[20, 50, 100, 500]"
              :page-size="pageSize"
              layout="sizes, prev, pager, next"
              :total="devicesTotal"
            ></el-pagination>
          </div>
        </div>

      </el-col>
    </el-row>
    <el-dialog
      :title="titleFlag ? $t('control.device') + $t('table.inspection') : $t('control.device') + $t('table.inspection') + $t('control.recording')"
      :close-on-click-modal="false"
      :modal="false"
      width="1000px"
      top="20vh"
      :visible.sync="inspectionFlag"
      :before-close="handleInspectionClose"
    >
      <div style="margin: 10px 20px">
        <InspectionDevice ref="inspection" v-if="inspectionFlag" @handleInspectionClose="handleInspectionClose" :inspectionData="inspectionData" :titleFlag="titleFlag"></InspectionDevice>
      </div>
      <div slot="footer" class="tc" v-if="titleFlag">
        <el-button size="small" @click="handleInspectionClose">{{ $t('btns.cancel2') }}</el-button>
        <el-button size="small" type="primary" @click="submitInformation">{{ $t('btns.ok2') }}</el-button>
      </div>
    </el-dialog>
     <el-dialog
      :title="$t('home.DevicelectricStatistical')+$t('home.StatisticsTable') + $t('home.export')"
      :close-on-click-modal="false"
      :visible.sync="exportRangeFlags"
      custom-class="export-range"
      @closed="handleCloseRange"
    >
      <el-form
        :inline="true"
        ref="rangeExportForm"
        :model="rangeExportForm"
        label-width="40px"
      >
      <el-form-item>
        <el-button  :type="buttonColor" circle @click="getMonthValue">月</el-button>
        <el-button :type="yearColor" circle @click="getYearValue">年</el-button>
      </el-form-item>
        <el-form-item :label="$t('dialog.time') + $t('dialog.range')" v-if ="!dateValue">
          <el-date-picker
            v-model="valueYear"
            type="year"
             value-format="yyyy"
            placeholder="选择年"
          >
          </el-date-picker>
        </el-form-item>
         <el-form-item :label="$t('dialog.time') + $t('dialog.range')"  v-if ="dateValue">
          <el-date-picker
      v-model="valueMonth"
      value-format="yyyyMM"
      type="month"
      placeholder="选择月">
    </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleExportRange">{{
            $t('home.export')
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
/* global ctxPaths */
import store from '@/store'
import InspectionDevice from '../Common/InspectionDevice'
import { queryProjectMacDetails, switchHover } from '@/api/api'
export default {
  props: {
    queryType: {
      type: String
    }
  },
  data () {
    return {
      valueYear: '2022',
      valueMonth: '2022' + ((new Date().getMonth() + 1) > 9 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)),
      dateValue: true,
      buttonColor: 'success',
      yearColor: 'info',
      exportRangeFlags: false,
      stats: [
        {
          value: '0',
          label: this.$t('control.offline')
        },
        {
          value: '1',
          label: this.$t('table.online')
        },
        {
          value: '-1',
          label: this.$t('table.offLine')
        }
      ],
      projectNames: [],
      devicesData: [],
      devicesTotal: 0,
      currentPage: 1,
      pageSize: 20,
      formInline: {
        projectCode: this.$route.params.projectCode ? this.$route.params.projectCode : this.$store.state.projectCode,
        status: this.$route.params.status === '100' ? '' : this.$route.params.status,
        mac: '',
        aliasName: '',
        addr: ''
      },
      loading: false,
      inspectionFlag: false,
      titleFlag: false,
      inspectionData: {
        projectCode: '',
        macs: ''
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.queryDevices()
    },
    queryDevices () {
      if (this.$route.params.status && this.$route.params.status !== '100') {
        this.formInline.status = this.$route.params.status.split(',')
        this.$route.params.status = ''
      }
      this.devicesData = []
      this.loading = true
      let params = {
        projectCode: this.formInline.projectCode,
        mac: this.formInline.mac,
        macName: this.formInline.aliasName,
        address: this.formInline.addr,
        provinceId: this.$store.state.provinceId,
        cityId: this.$store.state.cityId,
        countyId: this.$store.state.countyId,
        onlineStats: this.formInline.status.toString(),
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      queryProjectMacDetails(params)
        .then(res => {
          if (res.success) {
            this.devicesData = res.datas
            this.devicesTotal = res.total
            this.projectNames = this.$store.state.allProjects.data
            this.deviceFlag = true
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
    onSubmit () {
      this.currentPage = 1
      this.queryDevices()
    },
    handleCloseRange () {
      this.valueYear = ''
      this.valueMonth = ''
    },
    getMonthValue () {
      this.buttonColor = 'success'
      this.yearColor = 'info'
      this.dateValue = true
    },
    getYearValue () {
      this.buttonColor = 'info'
      this.yearColor = 'success'
      this.dateValue = false
    },
    handleExportRange () {
      console.log(this.valueYear + '01')
      if (this.dateValue) {
        this.$func.windowCountDown(
          ctxPaths +
          '/project/main/v5/xls/userBoxPowerStats.as?startYm=' +
          this.valueMonth +
          '&endYm=' +
          this.valueMonth
        )
      } else if (!this.dateValue) {
        this.$func.windowCountDown(
          ctxPaths +
          '/project/main/v5/xls/userBoxPowerStats.as?startYm=' +
          this.valueYear + '01' +
          '&endYm=' +
          this.valueYear + '12'
        )
      }
    },
    handleSizeChange (val) {
      this.currentPage = 1
      this.pageSize = val
      this.queryDevices()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.queryDevices()
    },
    handleCommand (command) {
      if (command === 'electric') {
        this.exportRangeFlags = true
      } else {
        this.$func.windowCountDown(ctxPaths + '/project/main/v3/xls/exportProjectMacDetails.as?projectCode=' + this.formInline.projectCode + '&provinceId=' + (this.$store.state.provinceId ? this.$store.state.provinceId : '') + '&cityId=' + (this.$store.state.cityId ? this.$store.state.cityId : '') + '&countyId=' + (this.$store.state.countyId ? this.$store.state.countyId : '') + '&mac=' + this.formInline.mac + '&address=' + this.formInline.addr + '&macName=' + this.formInline.aliasName + '&pageSize=' + this.pageSize + '&pageNo=' + this.currentPage + '&onlineStats=' + this.formInline.status + '&exportType=' + (command === 'current' ? 'exportCurrent' : ''))
      }
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
    toChannelList () {
      this.$router.push({name: 'ChannelList', query: {mac: this.formInline.mac, status: this.formInline.status, projectCode: this.formInline.projectCode}})
    },
    handleInspection (row) {
      this.titleFlag = this.inspectionFlag = true
      this.inspectionData = {
        projectCode: row.projectCode,
        macs: row.mac
      }
    },
    handleViewInspection (row) {
      this.titleFlag = false
      this.inspectionFlag = true
      this.inspectionData = {
        projectCode: row.projectCode,
        macs: row.mac
      }
    },
    submitInformation () {
      this.$refs.inspection.submitForm()
    },
    handleInspectionClose () {
      this.inspectionFlag = false
    }
  },
  watch: {
    '$store.state.location': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.queryDevices()
        }
      },
      deep: true
    }
  },
  components: {
    InspectionDevice
  }
}
</script>
<style lang="stylus" scoped>
.block
  >>> .el-pagination .btn-prev, >>> .el-pagination .btn-next, >>> .el-pager li
    background transparent
    color #fff
  &:disabled
    background transparent
  >>> .el-pager li.active
    color #409EFF
  >>> .el-pagination__jump
    color #fff
</style>
