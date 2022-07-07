<template>
  <div id="overview">
    <el-row :gutter="20" style="margin: 0; padding:20px">
      <el-col>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="pointer" @click.native="$router.go(-1)">{{ $t('btns.back') }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $t('table.project') + $t('table.overview') }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
          :inline="true"
          size="small"
          :model="form"
          class="demo-form-inline tr mt-20"
          @submit.native.prevent
        >
          <el-form-item class="fl" v-if="JSON.parse(config.PROJECT_GROUP)">
            <i class="iconfont pointer fs-14" :class="foldFlag ? 'icon-unzhedie' : 'icon-zhedie'" @click="foldFlag = !foldFlag"></i>
            <i v-if="foldFlag" :class="setupFlag ? 'el-icon-s-tools pointer ml-10' : 'el-icon-s-tools setupInfo ml-10'" style="color: #fff;font-size:14px" @click="handleConfigure"></i>
          </el-form-item>
          <el-form-item class="nodeTreeGrouping" v-if="foldFlag && nodeTreeData.length > 0">
            {{ $t('footer.packetPath') + '：'}} <span v-for="(v, f) in nodeTreeData" :key="f">{{ v.label }}</span><span v-if="nodeTreeData.length > 0" @click="closeLeftGroup"><i class="pointer ml-10 c-default fs-14 el-icon-close"></i></span>
          </el-form-item>
          <el-form-item>
            <span
              v-if="$store.state.toPath !== '/Home' && $store.state.toPath !== ''"
              class="mr-20 fw"
            ></span>
          </el-form-item>
          <el-form-item>
            <el-select @change="handleKeyword" v-model="form.projectName" clearable filterable :placeholder="$t('table.pleaseEnter') + $t('table.projectName')">
              <el-option
                v-for="item in projectNames"
                :key="item.projectCode"
                :label="item.projectName"
                :value="item.projectName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="queryOverview">{{ $t('btns.query') }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-dropdown trigger="click" @command="handleCommand">
              <el-button>
                {{ $t('home.export') }} <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="current">{{ $t('btns.exportCurrent') }}</el-dropdown-item>
                <el-dropdown-item command="all">{{ $t('btns.exportAll') }}</el-dropdown-item>
                 <el-dropdown-item command="electric">{{
                $t('home.projectelectricStatistical')
              }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-form-item>
        </el-form>
        <div v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0)" :element-loading-text="$t('message.loading')">
          <el-row>
          <!-- 树形控件 -->
        <el-col :span="foldFlag ? 5 : 0">
          <el-scrollbar class="scroll-wrap">
            <el-tree
              class="leftTreeView"
              :default-expand-all="true"
              :expand-on-click-node="false"
              :data="treeData"
              :node-key="treeData.id"
              :props="defaultProps"
              @node-click="handleNodeClick">
            </el-tree>
          </el-scrollbar>
        </el-col>
        <el-col :span="foldFlag ? 19 : 24" >
          <el-table :data="overviewDatas">
            <el-table-column :label="$t('table.projectName')" align="center" min-width="150">
              <template slot-scope="scope">
                <span class="pointer" @click="handleSelect(scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column property="createTime" :label="$t('table.build') + $t('dialog.time')" align="center" min-width="100"></el-table-column>
            <el-table-column :label="$t('table.location')" align="center" min-width="200">
              <template slot-scope="scope">
                <span class="pointer" @click="handleMap(scope.row)">{{ scope.row.others.address }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('statistics.totalMac')" align="center">
              <template slot-scope="scope">
                <span class="pointer" @click="handleDevices(scope.row, '100')">{{ scope.row.others.totalBoxNum }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('statistics.online')" align="center">
              <template slot-scope="scope">
                <span class="pointer" @click="handleDevices(scope.row, '1')">{{ scope.row.others.totalBoxOnlineNum }}</span>
              </template>
            </el-table-column>
            <el-table-column property="others.boxOnlineRate" :label="$t('table.online') + $t('control.rate')" align="center">
              <template slot-scope="scope">
                <span class="pointer">{{ scope.row.others.boxOnlineRate }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.thisMonth') + $t('home.alarm') + $t('control.number')" align="center">
              <template slot-scope="scope">
                <span class="pointer" @click="handleAlarm(scope.row, '')">{{ scope.row.others.totalAlarmNum }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('home.processed') + $t('control.number')" align="center">
              <template slot-scope="scope">
                <span class="pointer" @click="handleAlarm(scope.row, '2')">{{ scope.row.others.alarmProcessedNum }}</span>
              </template>
            </el-table-column>
            <el-table-column property="others.alarmProcessedRate" :label="$t('home.processed') + $t('control.rate')" align="center">
              <template slot-scope="scope">
                <span class="pointer">{{ scope.row.others.alarmProcessedRate }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('home.unprocessed') + $t('control.number')" align="center">
              <template slot-scope="scope">
                <span class="pointer" @click="handleAlarm(scope.row, '0')">{{ scope.row.others.alarmUnprocessedNum }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('control.maintenance') + $t('control.recording') + $t('control.number')" align="center">
              <template slot-scope="scope">
                <span class="pointer" @click="handleMore(scope.row)">{{ scope.row.others.maintainNum }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.thisMonth') + $t('main.energyUsed') +'(度)'" align="center">
              <template slot-scope="scope">
                <span class="pointer">{{ scope.row.others.thisMonthPower }}</span>
              </template>
            </el-table-column>
          </el-table>
          </el-col>
          </el-row>
          <div class="block tc mt-10">
            <el-pagination
              background
              small
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[20, 50, 100, 500]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :title="$t('statistics.map')"
      :visible.sync="dialogVisible"
      :modal="false"
      width="60%" id="map-wrap">
      <div id="maps"></div>
    </el-dialog>
    <el-dialog
      :title="$t('table.project') + $t('dialog.structureTree')"
      :visible.sync="projectVisible"
      :close-on-click-modal="false"
      :modal="false"
      width="1000px"
      @close="handleCloseProject"
      top="20vh">
      <div style="height: 440px">
        <el-container style="height: 440px; border: 1px solid #eee">
          <el-aside width="300px" style="border-right: 1px solid #eee">
            <el-button class="ml-10" type="text" @click="append('1', nodeData)"><i class="el-icon-plus c-hover pointer">{{ $t('system.add') + $t('table.projectTeam') }}</i></el-button>
            <el-scrollbar class="treeBox">
              <el-tree ref="customTree" :default-expand-all="true" :data="customData" :expand-on-click-node="false" :node-key="id" :props="defaultProps" @node-click="handleNodeCustom">
                <span class="custom-tree-node" slot-scope="{ node, data }" >
                  <span>{{ node.label }}</span>
                  <span class="ml-10" style="display: inline-block" v-show="flag_index === data.id">
                    <i @click="() => append('2', data)" class="el-icon-plus c-primary"></i>
                    <i @click="() => deletes(data)" class="el-icon-delete c-primary"></i>
                    <i @click="() => rename(node, data)" class="el-icon-edit c-primary"></i>
                  </span>
                </span>
              </el-tree>
            </el-scrollbar>
          </el-aside>
          <el-container>
            <el-header style="height: 80px;padding: 10px 10px 0">
              <el-col :span="24" class="mb-20">{{ $t('footer.packetPath') + '：'}} <span v-for="(v, f) in nodeData" :key="f">{{ v.label }}</span><span v-if="nodeData.length > 0" @click="closeNodeTree"><i class="pointer ml-10 c-hover fs-14 el-icon-close"></i></span></el-col>
              <el-col :span="24">
                <el-form :inline="true" class="tree-form-inline">
                  <el-form-item :label="$t('placeholder.keyword') + '：'">
                    <el-input size="small" v-model="treeKeyWrod" @keyup.enter.native="handleSearch" style="width: 260px"  :placeholder="$t('table.projectName') + '、' + $t('table.projectNumber')"></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size="small" @click="handleSearch">{{ $t('btns.search') }}</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button plain :disabled="!treeGroupId" size="small" @click="handleConfiguration">{{ $t('table.configuration') }}</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-header>
            <el-main style="padding-bottom: 0">
              <el-table height="300px" stripe class="overviewTable" v-el_scrollBar:scrollBar :data="groupData">
                <el-table-column prop="prjCode" :label="$t('table.projectNumber')" align="center">
                </el-table-column>
                <el-table-column prop="prjName" :label="$t('table.projectName')" align="center">
                </el-table-column>
                <el-table-column prop="groupName" :label="$t('footer.current') + $t('footer.grouping')" align="center">
                </el-table-column>
                <el-table-column :label="$t('table.operating')" align="center">
                  <template slot-scope="scope">
                    <span class="pointer c-primary" @click="handleRemove(scope.row)">{{ $t('btns.remove') }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                class="tc"
                :page-size="10"
                :pager-count="7"
                :current-page.sync="firstCurrentPage"
                @current-change="handleCustomPage"
                layout="prev, pager, next"
                :total="customTotal">
              </el-pagination>
            </el-main>
          </el-container>
        </el-container>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('footer.grouping') + $t('table.configuration')"
      :visible.sync="configurationVisible"
      :close-on-click-modal="false"
      :modal="false"
      width="1000px"
      @close="handleCloseConfiguration"
      top="20vh">
      <div style="height: 440px">
        <el-col :span="24" class="mb-10">{{ $t('footer.packetPath') + '：'}}<span v-for="(v, f) in nodeData" :key="f">{{ v.label }}</span></el-col>
        <el-col :span="24">
          <el-form :inline="true" class="tree-form-inline">
            <el-form-item>
              <el-input size="small" @keyup.enter.native="handleConfigurationSearch" v-model="configurationVal" style="width: 260px" :placeholder="$t('table.projectName') + '、' + $t('table.projectNumber')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" @click="handleConfigurationSearch">{{ $t('btns.search') }}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button plain size="small" :disabled="multipleSelection.length <= 0" @click="handleOperation('add')">{{ $t('btns.distribution') }}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button plain size="small" :disabled="multipleSelection.length <= 0" @click="handleOperation('del')">{{ $t('btns.removeFromGroup') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col>
          <el-table height="300px" @selection-change="handleConfigurationSelect" stripe class="overviewTable" v-el_scrollBar:scrollBar :data="configurationData">
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>
            <el-table-column prop="code" :label="$t('table.projectNumber')" align="center">
            </el-table-column>
            <el-table-column prop="name" :label="$t('table.projectName')" align="center">
            </el-table-column>
            <el-table-column :label="$t('system.status')" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.others.assign === "N" ? $t('btns.unassigned') : $t('btns.assigned') }}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="tc"
            :page-size="10"
            :pager-count="7"
            :current-page.sync="secondCurrentPage"
            @current-change="handleConfigurationPage"
            layout="prev, pager, next"
            :total="configurationTotal">
          </el-pagination>
        </el-col>
      </div>
    </el-dialog>
     <el-dialog
      :title="$t('home.projectelectricStatisticalTable') + $t('home.export')+''"
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
         <el-form-item :label="$t('dialog.time') + $t('dialog.range')"  v-show ="dateValue">
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
/* global config */
/* global ctxPaths */
/* global BMap */
/* global google */
import { Map } from '../../map'
import store from '@/store'
import { getLeftTreeView, queryProjectDetails, switchHover, loadTree, saveProjectGroup, delProjectGroup, pageRsOfProject, pageProject4SelectOfGroup, saveProjectOfGroup, queryPageAuth } from '@/api/api'
import mapStyle from '../../assets/js/custom_map_config.json'
import myIcon1 from '../../assets/image/nIcon.png'
export default {
  data () {
    return {
      valueYear: '2022', // new Date().getFullYear(),
      valueMonth: '2022' + ((new Date().getMonth() + 1) > 9 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)),
      dateValue: true,
      buttonColor: 'success',
      yearColor: 'info',
      exportRangeFlags: false,
      setupFlag: false,
      groupData: [],
      arrData: [],
      leftArrData: [],
      treeData: [],
      nodeTreeData: [],
      customData: [],
      nodeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      form: {
        projectName: this.$store.state.fullName ? this.$store.state.fullName : this.$route.params.projectName,
        projectCode: this.$store.state.projectCode,
        mac: ''
      },
      groupId: '',
      loading: false,
      overviewDatas: [],
      projectNames: this.$store.state.allProjects.data,
      dialogVisible: false,
      longitude: '',
      latitude: '',
      currentPage: 1,
      firstCurrentPage: 1,
      secondCurrentPage: 1,
      pageSize: 20,
      total: 0,
      timerID: null,
      config: config,
      foldFlag: false,
      projectVisible: false,
      configurationVisible: false,
      flag_index: -1,
      customTotal: 0,
      treeGroupId: '',
      treeKeyWrod: '',
      configurationVal: '',
      configurationData: [],
      configurationTotal: '',
      multipleSelection: ''
    }
  },
  mounted () {
    this.init()
    this.queryTreePageAuth()
    this.handleGetLeftTree()
  },
  methods: {
    handleGetLeftTree () {
      getLeftTreeView()
        .then(res => {
          if (res.success) {
            this.leftArrData = res.data
            this.treeData = this.arraytoTree(res.data)
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
    arraytoTree (arr) {
      let dataArray = []
      arr.forEach((item) => {
        let parentId = item.parentId
        if (parentId === 0) {
          let objTemp = {
            floorNo: item.floorNo,
            id: item.id,
            label: item.name,
            parentId: parentId,
            sortNo: item.sortNo
          }
          dataArray.push(objTemp)
        }
      })
      return this.childrenTree(arr, dataArray)
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
      // console.log(this.valueMonth, '===== this.valueMonth')
      if (this.dateValue) {
        this.$func.windowCountDown(
          ctxPaths +
          '/project/main/v5/xls/userPrjPowerStats.as?startYm=' +
          this.valueMonth +
          '&endYm=' +
          this.valueMonth
        )
      } else if (!this.dateValue) {
        this.$func.windowCountDown(
          ctxPaths +
          '/project/main/v5/xls/userPrjPowerStats.as?startYm=' +
          this.valueYear + '01' +
          '&endYm=' +
          this.valueYear + '12'
        )
      }
    },
    childrenTree (arr, dataArray) {
      if (dataArray !== []) {
        for (let j = 0; j < dataArray.length; j++) {
          let dataArrayItem = dataArray[j]
          let childrenArr = []
          let Id = dataArrayItem.id
          for (let i = 0; i < arr.length; i++) {
            let Arr = arr[i]
            if (Arr.parentId === Id) {
              let childTemp = {
                floorNo: Arr.floorNo,
                id: Arr.id,
                label: Arr.name,
                parentId: Arr.parentId,
                sortNo: Arr.sortNo
              }
              childrenArr.push(childTemp)
            }
          }
          dataArrayItem.children = childrenArr
          if (childrenArr.length > 0) {
            this.childrenTree(arr, childrenArr)
          }
        }
      } else {
        dataArray = arr
      }
      return dataArray
    },
    init () {
      this.queryOverview()
      this.setTimer(this.queryOverview, config.pollingInterval.queryProjectDetails * 1000)
    },
    queryTreePageAuth () {
      let params = {
        resKeys: 'AUTH_PROJECT_USE',
        operKeys: 'PROJECT_GROUP'
      }
      queryPageAuth(params)
        .then(res => {
          if (res.success) {
            this.setupFlag = res.data[0].result
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
    handleNodeClick (data, node) {
      this.groupId = data.id
      let recurArr = [data]
      this.nodeTreeData = []
      this.nodeTreeData = this.handleRecursion(data, this.leftArrData, recurArr)
      if (this.nodeTreeData.length > 1 && this.nodeTreeData.length <= 3) {
        this.nodeTreeData.forEach((item) => {
          if (item.id !== data.id) {
            if (item.label && item.label.indexOf('>') === -1) {
              item.label = item.label + ' > '
            } else if (item.name.indexOf('>') === -1) {
              item.label = item.name + ' > '
            }
          }
        })
        this.nodeTreeData.reverse()
      } else if (this.nodeTreeData.length > 3) {
        this.nodeTreeData = [{label: '... > ' + data.label}]
      } else {
        this.nodeTreeData = [{label: data.label}]
      }
      this.queryOverview()
    },
    closeLeftGroup () {
      this.nodeTreeData = []
      this.groupId = ''
      this.queryOverview()
    },
    closeNodeTree () {
      this.nodeData = this.groupData = []
      this.treeGroupId = this.treeKeyWrod = ''
      this.flag_index = -1
      this.handleSearch()
    },
    handleCloseProject () {
      this.handleGetLeftTree()
      if (this.projectVisible === false && this.configurationVisible === false) {
        this.treeKeyWrod = this.treeGroupId = ''
        this.nodeData = []
        this.flag_index = -1
      }
    },
    handleNodeCustom (data, node) {
      let recurArr = [data]
      this.nodeData = []
      this.nodeData = this.handleRecursion(data, this.arrData, recurArr)
      if (this.nodeData.length > 1 && this.nodeData.length <= 3) {
        this.nodeData.forEach((item) => {
          if (item.id !== data.id) {
            if (item.label && item.label.indexOf('>') === -1) {
              item.label = item.label + ' > '
            } else if (item.name.indexOf('>') === -1) {
              item.label = item.name + ' > '
            }
          }
        })
        this.nodeData.reverse()
      } else if (this.nodeData.length > 3) {
        this.nodeData = [{label: '... > ' + data.label}]
      } else {
        this.nodeData = [{label: data.label}]
      }
      this.flag_index = this.treeGroupId = data.id
      this.handleSearch()
    },
    handleRecursion (data, arr, recurArr) {
      if (data.parentId !== 0) {
        arr.filter(item => {
          if (item.id === data.parentId) return recurArr.push(item)
        })
        this.handleRecursion(recurArr[recurArr.length - 1], arr, recurArr)
      } else {
        recurArr = data
      }
      return recurArr
    },
    queryOverview () {
      this.loading = true
      let params = {
        projectName: this.form.projectName,
        provinceId: this.$store.state.provinceId,
        cityId: this.$store.state.cityId,
        countyId: this.$store.state.countyId,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        groupId: this.groupId
      }
      queryProjectDetails(params)
        .then(res => {
          if (res.success) {
            // console.log(res.datas, '=======res.datas')
            this.overviewDatas = res.datas
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
    },
    handleDevices (obj, state) {
      this.$router.push({
        name: 'Devices',
        params: {
          projectCode: obj.code,
          status: state
        }
      })
    },
    handleAlarm (obj, state) {
      this.$router.push({
        name: 'Alarms',
        params: {
          projectCode: obj.code,
          typeNumber: '-100',
          status: state
        }
      })
    },
    handleSelect (obj) {
      let params = {
        projectCode: obj.code
      }
      switchHover(params)
        .then(res => {
          if (res.success) {
            store.commit('projectCode', obj.code)
            store.commit('fullName', obj.name)
            store.commit('distributionDateType', 1)
            store.commit('equipmentType', 1)
            store.commit('overviewMac', '')
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
    handleMap (obj) {
      this.longitude = obj.longitude
      this.latitude = obj.latitude
      this.dialogVisible = true
      this.renderMap()
    },
    renderMap () {
      this.$nextTick(function () {
        if (config.useMap === 'BAIDU' || config.useMap === 'BAIDU_OFFLINE') {
          if (typeof BMap === 'undefined') {
            Map(config.baiduKey, config.useMap)
              .then(BMap => {
                let bmap = new BMap.Map('maps')
                let point = new BMap.Point(this.longitude, this.latitude)
                let marker = new BMap.Marker(point)
                bmap.centerAndZoom(point, 17)
                if (config.useMap === 'BAIDU') {
                  bmap.setMapStyleV2({styleJson: mapStyle})
                } else {
                  bmap.setMapStyle({style: 'midnight'})
                }
                bmap.enableScrollWheelZoom(true)
                bmap.addOverlay(marker)
              })
          } else {
            let bmap = new BMap.Map('maps')
            let point = new BMap.Point(this.longitude, this.latitude)
            let marker = new BMap.Marker(point)
            bmap.centerAndZoom(point, 17)
            if (config.useMap === 'BAIDU') {
              bmap.setMapStyleV2({styleJson: mapStyle})
            } else {
              bmap.setMapStyle({style: 'midnight'})
            }
            bmap.enableScrollWheelZoom(true)
            bmap.addOverlay(marker)
          }
        } else if (config.useMap === 'GOOGLE') {
          if (typeof google === 'undefined') {
            Map(config.googleKey, config.useMap)
              .then(google => {
                let myLatLng = this.$func.BD09_To_GCJ02(this.latitude, this.longitude)
                let map = new google.maps.Map(document.getElementById('maps'), {
                  center: myLatLng,
                  mapTypeControl: false,
                  streetViewControl: false,
                  zoom: 15
                })
                let icon = {
                  url: myIcon1,
                  size: new google.maps.Size(21, 34),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(21, 34),
                  scaledSize: new google.maps.Size(21, 34)
                }
                let marker = new google.maps.Marker({
                  position: myLatLng,
                  map: map,
                  icon: icon
                })
                marker.setMap(map)
              })
          } else {
            let myLatLng = this.$func.BD09_To_GCJ02(this.latitude, this.longitude)
            let map = new google.maps.Map(document.getElementById('maps'), {
              center: myLatLng,
              mapTypeControl: false,
              streetViewControl: false,
              zoom: 15
            })
            let icon = {
              url: myIcon1,
              size: new google.maps.Size(21, 34),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(21, 34),
              scaledSize: new google.maps.Size(21, 34)
            }
            let marker = new google.maps.Marker({
              position: myLatLng,
              map: map,
              icon: icon
            })
            marker.setMap(map)
          }
        }
      })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.queryOverview()
    },
    handleSizeChange (val) {
      this.currentPage = 1
      this.pageSize = val
      this.queryOverview()
    },
    handleMore (obj) {
      this.$router.push({
        name: 'MaintenanceRecords',
        params: {
          projectCode: obj.code
        }
      })
    },
    handleCommand (command) {
      if (command === 'current') {
        this.$func.windowCountDown(ctxPaths + '/project/main/v3/xls/exportProjectDetails.as?projectCode=' + this.form.projectCode + '&provinceId=' + (this.$store.state.provinceId ? this.$store.state.provinceId : '') + '&cityId=' + (this.$store.state.cityId ? this.$store.state.cityId : '') + '&countyId=' + (this.$store.state.countyId ? this.$store.state.countyId : '') + '&mac=' + this.form.mac + '&pageSize=' + this.pageSize + '&pageNo=' + this.currentPage + '&exportType=exportCurrent')
      } else if (command === 'electric') {
        this.exportRangeFlags = true
      } else {
        this.$func.windowCountDown(ctxPaths + '/project/main/v3/xls/exportProjectDetails.as?projectCode=' + this.form.projectCode + '&provinceId=' + (this.$store.state.provinceId ? this.$store.state.provinceId : '') + '&cityId=' + (this.$store.state.cityId ? this.$store.state.cityId : '') + '&countyId=' + (this.$store.state.countyId ? this.$store.state.countyId : '') + '&mac=' + this.form.mac + '&pageSize=' + this.pageSize + '&pageNo=' + this.currentPage + '&exportType=')
      }
    },
    handleKeyword (val) {
      if (val) {
        this.projectNames.map(item => {
          if (item.projectName === val) {
            this.form.projectCode = item.projectCode
          }
        })
      } else {
        this.form.projectCode = ''
      }
    },
    handleLoadTree () {
      loadTree()
        .then(res => {
          if (res.success) {
            this.customData = this.arraytoTree(res.data)
            this.arrData = res.data
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
    handleConfigure () {
      if (!this.setupFlag) return false
      this.handleLoadTree()
      this.handleSelectOfGroup()
      this.projectVisible = true
    },
    handleCloseConfiguration () {
      this.handleLoadTree()
      this.handleSearch()
      this.configurationVisible = false
      this.projectVisible = true
    },
    handleSelectOfGroup (params) {
      pageRsOfProject(params)
        .then(res => {
          if (res.success) {
            this.groupData = res.datas
            this.customTotal = res.total
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
    handleSearch () {
      let params = {
        pageNo: 1,
        params: {
          groupId: this.treeGroupId,
          keyword: this.treeKeyWrod
        }
      }
      this.firstCurrentPage = 1
      this.handleSelectOfGroup(params)
    },
    handleConfigurationSearch () {
      let params = {
        pageNo: 1,
        params: {
          groupId: this.treeGroupId,
          keyword: this.configurationVal
        }
      }
      this.secondCurrentPage = 1
      this.handlePageProject4SelectOfGroup(params)
    },
    handleConfiguration () {
      this.projectVisible = false
      this.handlePageProject4SelectOfGroup({params: {groupId: this.treeGroupId}})
      this.configurationVal = ''
      this.configurationVisible = true
    },
    handlePageProject4SelectOfGroup (parmas) {
      pageProject4SelectOfGroup(parmas)
        .then(res => {
          if (res.success) {
            this.configurationData = res.datas
            this.configurationTotal = res.total
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
    handleCustomPage (val) {
      let params = {
        pageNo: val,
        params: {
          groupId: this.treeGroupId,
          keyword: this.treeKeyWrod
        }
      }
      this.handleSelectOfGroup(params)
    },
    handleConfigurationPage (val) {
      let params = {
        pageNo: val,
        params: {
          groupId: this.treeGroupId,
          keyword: this.configurationVal
        }
      }
      this.handlePageProject4SelectOfGroup(params)
    },
    append (num, data) {
      let arr = []
      let params = {}
      if (num === '2') {
        this.arrData.filter(item => {
          if (item.parentId === data.id) return arr.push(item)
        })
        params = {floorNo: (data.floorNo) + 1, parentId: data.id, name: `new group${arr.length + 1}`, sortNo: arr.length + 1}
      } else {
        this.arrData.filter(item => {
          if (item.parentId === 0) return arr.push(item)
        })
        params = {
          floorNo: 2,
          parentId: 0,
          name: `new group${arr.length + 1}`,
          sortNo: arr.length + 1
        }
      }
      saveProjectGroup(params)
        .then(res => {
          this.$message({
            message: res.code === '0' ? this.$t('system.add') + this.$t('system.success') : res.message,
            type: res.code === '0' ? 'success' : 'error'
          })
          this.handleLoadTree()
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
    deletes (data) {
      delProjectGroup({ groupId: data.id })
        .then(res => {
          this.$message({
            message: res.message,
            type: res.code === '0' ? 'success' : 'error'
          })
          this.handleLoadTree()
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
    rename (node, data) {
      this.$prompt(this.$t('placeholder.customName'), this.$t('dialog.prompt'), {
        inputValue: data.label,
        confirmButtonText: this.$t('btns.ok'),
        cancelButtonText: this.$t('btns.cancel'),
        inputValidator: (val) => {
          if (val) {
            return true
          } else {
            return this.$t('message.emptyInput')
          }
        }
      })
        .then(({ value }) => {
          saveProjectGroup({ id: data.id, name: value })
            .then(res => {
              this.$message({
                message: res.message,
                type: res.code === '0' ? 'success' : 'error'
              })
              this.handleLoadTree()
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
        .catch(() => {
          return false
        })
    },
    handleConfigurationSelect (val) {
      this.multipleSelection = val
    },
    handleOperation (val) {
      let code = []
      this.multipleSelection.filter(item => {
        code.push(item.code)
      })
      let params = {
        projectCodes: code.toString(),
        groupId: this.treeGroupId,
        oper: val
      }
      saveProjectOfGroup(params)
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
    },
    handleRemove (row) {
      let params = {
        projectCodes: row.prjCode,
        groupId: row.id,
        oper: 'del'
      }
      saveProjectOfGroup(params)
        .then(res => {
          this.$message({
            message: res.message,
            type: res.code === '0' ? 'success' : 'error'
          })
          this.handleSearch()
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
    setTimer (fn, delay) {
      let _this = this
      function timer () {
        _this.timerID = setTimeout(function () {
          timer()
          fn()
        }, delay)
      }
      timer()
    }
  },
  destroyed () {
    clearTimeout(this.timerID)
  },
  watch: {
    '$store.state.location': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.queryOverview()
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="stylus">
.leftTreeView
  margin-bottom 20px
  background none
  color #fff
.el-tree-node__content:hover
  background-color transparent
  border-radius 10px
  color #409EFF
.el-tree-node:focus > .el-tree-node__content
  background-color transparent
  border-radius 10px
  color #409EFF
.el-tree-node:focus > .el-tree-node__expand-icon .is-leaf
    color transparent
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
#maps
    width 100%
    height 433px
#map-wrap >>> .el-dialog
    background #474d59
#map-wrap >>> .el-dialog__headerbtn .el-dialog__close, #map-wrap >>> .el-dialog__title
    color #fffeff
.overviewTable
  border none
  border-top 1px solid #EBEEF5
  border-left 1px solid #EBEEF5
  color #606266
  .el-table__header-wrapper, .el-table__body-wrapper
    th, tr, td
      color #606266
      border-right 1px solid #EBEEF5
    td, th.is-leaf
      border-bottom 1px solid #EBEEF5
.c-hover
  color #606266 !important
  &:hover
    color #409EFF !important
.treeBox
  border-top 1px solid #EBEEF5
  height 395px
  > .el-scrollbar__wrap
      overflow-x hidden
.tree-form-inline .el-form-item__label
  color #606266
.custom-tree-node
  flex 1
  display flex
  align-items center
  justify-content space-between
  font-size 14px
  padding-right 8px
.el-tree-node.is-expanded > .el-tree-node__children
  display inline
.scroll-wrap
  > .el-scrollbar__wrap
    overflow-x auto
.setupInfo
  color #909399 !important
  cursor not-allowed
.nodeTreeGrouping
  position absolute
  left 21%
.el-tree-node > .el-tree-node__children
  overflow visible !important
</style>
