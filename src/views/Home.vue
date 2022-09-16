<template>
  <div id="home">
    <el-container>
      <el-header height="50px">
        <el-col :md="$i18n.locale === 'zh' ? 7 : 9">
          <el-col :span="1" v-if="$i18n.locale === 'zh' && mapType === 'BAIDU'">
            <i class="el-icon-location" v-if="$route.path === '/Home'"></i>
          </el-col>
          <el-col
            :span="$i18n.locale === 'zh' ? 4 : 5"
            v-if="mapType === 'BAIDU'"
          >
            <span class="location" v-if="$route.path === '/Home'">
              <el-cascader
                size="small"
                :options="options"
                v-model="selectedOptions"
                separator=""
                filterable
                :placeholder="$t('placeholder.all')"
                @change="handleChange"
              >
              </el-cascader>
            </span>
            <span v-else class="fs-14">{{
              $t('btns.search') +
                ($i18n.locale === 'zh' ? '' : '\xa0') +
                $t('table.project') +
                ':'
            }}</span>
          </el-col>
          <el-col :span="12">
            <el-autocomplete
              :span="12"
              class="custom-input"
              popper-class="auto-complete"
              v-model="keyword"
              size="small"
              :fetch-suggestions="querySearchAsync"
              :placeholder="$t('table.pleaseEnter') + $t('table.projectName')"
              @select="handleSelect"
              id="auto-complete"
            >
              <i class="el-icon-search el-input__icon" slot="suffix"> </i>
              <template slot-scope="{ item }">
                <div>{{ item.projectName }}</div>
              </template>
            </el-autocomplete>
          </el-col>
        </el-col>
        <el-col
          :md="$i18n.locale === 'zh' ? 10 : 6"
          class="project-name"
          :title="
            $store.state.pageCustom.main !== undefined
              ? $store.state.pageCustom.main.title !== undefined
                ? $store.state.pageCustom.main.title
                : ''
              : ''
          "
          v-if="
            [
              '/Home',
              '/Logs',
              '/system',
              '/Overview',
              '/Device',
              '/Device',
              '/Alarm',
              '/News',
              '/MaintenanceRecords',
              '/MaintenanceBox',
              '/ConfigurationList',
              '/TemperatureHumidityConfiguration',
              '/StralsundConfiguration',
              '/LHydrologicalConfiguration',
              '/PHydrologicalConfiguration',
              '/SmokeConfiguration',
              '/FlammableGasConfiguration',
              '/ChannelList'
            ].indexOf($route.path) !== -1
          "
        >
          <img
            :src="
              $store.state.pageCustom.main !== undefined
                ? $store.state.pageCustom.main.logo_top !== undefined
                  ? $store.state.pageCustom.main.logo_top.image
                  : ''
                : ''
            "
            :width="
              $store.state.pageCustom.main.logo_top.width !== undefined
                ? $store.state.pageCustom.main.logo_top.width
                : 'auto'
            "
            :height="
              $store.state.pageCustom.main.logo_top.height !== undefined
                ? $store.state.pageCustom.main.logo_top.height
                : 'auto'
            "
            v-if="
              $store.state.pageCustom.main !== undefined &&
                $store.state.pageCustom.main.logo_top !== undefined
            "
            style="vertical-align:text-top;margin-right:6px;"
          />
          {{
            $store.state.pageCustom.main !== undefined
              ? $store.state.pageCustom.main.title !== undefined
                ? $store.state.pageCustom.main.title
                : ''
              : ''
          }}
        </el-col>
        <el-col
          :md="$i18n.locale === 'zh' ? 10 : 6"
          class="project-name"
          :title="$store.state.projectName"
          v-else
          >{{ $store.state.projectName }}</el-col
        >
        <el-col :md="$i18n.locale === 'zh' ? 7 : 9" class="header-right">
          <span
            @click="handleSystemPage"
            class="setting iconfont icon-shezhi"
          ></span>
          <span
            @click="handleMute"
            class="iconfont mute"
            :class="{
              'icon-mute': $store.state.muted,
              'icon-soundsize': !$store.state.muted
            }"
          ></span>
          <span
            @click="handleNewsPage"
            :class="
              innerMessage === 'true'
                ? 'notice iconfont icon-tongzhi blink'
                : 'notice iconfont icon-tongzhi'
            "
          >
            <i
              class="spot iconfont icon-spot"
              v-if="innerMessage === 'true'"
            ></i>
          </span>
          <el-dropdown
            trigger="click"
            v-if="
              [
                '/Home',
                '/Logs',
                '/system',
                '/Overview',
                '/Device',
                '/Device',
                '/Alarm',
                '/News',
                '/MaintenanceRecords',
                '/MaintenanceBox',
                '/ConfigurationList',
                '/TemperatureHumidityConfiguration',
                '/StralsundConfiguration',
                '/LHydrologicalConfiguration',
                '/PHydrologicalConfiguration',
                '/SmokeConfiguration',
                '/FlammableGasConfiguration',
                '/ChannelList'
              ].indexOf($route.path) !== -1
            "
            @command="handleExportCommand"
          >
            <span class="el-dropdown-link">{{ $t('home.export') }}</span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="current">{{
                $t('home.alarmClassificationStatisticsTable')
              }}</el-dropdown-item>
              <el-dropdown-item command="all">{{
                $t('home.alarmHistoryDetailsTable')
              }}</el-dropdown-item>
              <!-- <el-dropdown-item command="electric">{{
                $t('home.projectelectricStatisticalTable')
              }}</el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              <el-tooltip
                class="item"
                effect="light"
                :content="$store.state.realName"
                placement="bottom"
              >
                <el-button type="text" id="user-name">{{
                  $store.state.realName
                }}</el-button>
              </el-tooltip>
              <i class="el-icon-arrow-down el-icon--right user-name-icon"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logs">{{
                $t('home.operationLog')
              }}</el-dropdown-item>
              <el-dropdown-item command="changePassword">{{
                $t('statistics.basicsInformation')
              }}</el-dropdown-item>
              <el-dropdown-item divided command="signOut">{{
                $t('home.signOut')
              }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-header>
      <el-col :span="24" class="bg-img">
        <img
          src="../assets/image/bg.png"
          style="max-width:100%;display:block"
        />
      </el-col>
      <el-row :gutter="20" style="margin: 0; padding:20px 0">
        <i
          class="right-view"
          @click="handleView"
          v-show="
            [
              '/Home',
              '/Logs',
              '/system',
              '/Overview',
              '/Device',
              '/Device',
              '/Alarm',
              '/News',
              '/MaintenanceRecords',
              '/MaintenanceBox',
              '/ConfigurationList',
              '/TemperatureHumidityConfiguration',
              '/StralsundConfiguration',
              '/LHydrologicalConfiguration',
              '/PHydrologicalConfiguration',
              '/SmokeConfiguration',
              '/FlammableGasConfiguration',
              '/ChannelList',
              '/InnerMain/EnergyOverview',
              '/InnerMain/EnergyReport',
              '/InnerMain/EnergyManagement',
              '/InnerMain/EnergyFormula',
              '/InnerMain/EnergyTrend',
              '/InnerMain/EnergyComparison',
              '/InnerMain/EnergyConsumption',
              '/InnerMain/EnergyStatistics',
              '/InnerMain/EnergyAnalysis',
              '/InnerMain/RegionalRelations',
              '/InnerMain/SavingScheme'
            ].indexOf($route.path) === -1
          "
          :class="{
            'iconfont icon-caidanzhankai': !rightView,
            'iconfont icon-caidanzhankai-copy': rightView
          }"
        ></i>
        <el-col
          :md="
            [
              '/Logs',
              '/system',
              '/Overview',
              '/Device',
              '/Device',
              '/Alarm',
              '/News',
              '/MaintenanceRecords',
              '/MaintenanceBox',
              '/ConfigurationList',
              '/TemperatureHumidityConfiguration',
              '/StralsundConfiguration',
              '/LHydrologicalConfiguration',
              '/PHydrologicalConfiguration',
              '/SmokeConfiguration',
              '/FlammableGasConfiguration',
              '/ChannelList',
              '/InnerMain/EnergyOverview',
              '/InnerMain/EnergyReport',
              '/InnerMain/EnergyManagement',
              '/InnerMain/EnergyFormula',
              '/InnerMain/EnergyTrend',
              '/InnerMain/EnergyComparison',
              '/InnerMain/EnergyConsumption',
              '/InnerMain/EnergyStatistics',
              '/InnerMain/EnergyAnalysis',
              '/InnerMain/RegionalRelations',
              '/InnerMain/SavingScheme'
            ].indexOf($route.path) !== -1 ||
            rightView ||
            fullScreen
              ? 24
              : 19
          "
          class="left-padding-right"
        >
          <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </el-col>
        <el-col
          :md="5"
          v-show="
            [
              '/InnerMain/EnergyOverview',
              '/InnerMain/EnergyReport',
              '/InnerMain/EnergyManagement',
              '/InnerMain/EnergyFormula',
              '/InnerMain/EnergyTrend',
              '/InnerMain/EnergyComparison',
              '/InnerMain/EnergyConsumption',
              '/InnerMain/EnergyStatistics',
              '/InnerMain/EnergyAnalysis',
              '/InnerMain/RegionalRelations',
              '/InnerMain/SavingScheme'
            ].indexOf($route.path) === -1 && !rightView
          "
          class="left-padding-right"
        >
          <router-view name="rightSidebar"></router-view>
        </el-col>
      </el-row>
    </el-container>
    <el-dialog
      :title="$t('statistics.basicsInformation') + $t('btns.edit')"
      custom-class="custom-password"
      :modal="false"
      :close-on-click-modal="false"
      :visible.sync="informationFlag"
      width="30%"
      :before-close="handleBeforeClose"
    >
      <el-form
        :model="informationForm"
        :rules="informationRules"
        size="small"
        :label-width="$i18n.locale === 'zh' ? '100px' : '140px'"
        ref="informationForm"
      >
        <el-form-item :label="$t('btns.login') + $t('system.account') + ':'">
          {{ informationForm.loginName }}
        </el-form-item>
        <el-form-item :label="$t('btns.login') + $t('control.password') + ':'">
          <span>*****</span>
          <el-button
            :disabled="config.authority.AUTH_PROJECT_USE__SET_PWD !== 'true'"
            type="text"
            style="margin-left: 40px"
            @click="handleChangePassword"
            >{{ $t('btns.edit') }}</el-button
          >
        </el-form-item>
        <el-form-item :label="$t('dialog.realName') + ':'" prop="realName">
          <el-input
            v-model="informationForm.realName"
            :placeholder="$t('table.pleaseEnter') + $t('dialog.realName')"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('placeholder.phoneNumber') + ':'"
          prop="mobile"
        >
          <el-input
            v-model="informationForm.mobile"
            :placeholder="
              $t('table.pleaseEnter') + $t('placeholder.phoneNumber')
            "
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('placeholder.fixedTelephone') + ':'">
          <el-input
            v-model="informationForm.telephone"
            :placeholder="
              $t('table.pleaseEnter') + $t('placeholder.fixedTelephone')
            "
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('placeholder.email') + ':'">
          <el-input
            v-model="informationForm.email"
            :placeholder="$t('table.pleaseEnter') + $t('placeholder.email')"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          size="small"
          @click="handleInformationClose('informationForm')"
          >{{ $t('btns.cancel2') }}</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="submitInformation('informationForm')"
          >{{ $t('btns.ok2') }}</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('system.changePassword')"
      custom-class="custom-password"
      :close-on-click-modal="false"
      :modal="false"
      :visible.sync="passFlag"
      @closed="handleCancel('passForm')"
      width="25vw"
      top="30vh"
    >
      <el-form
        :model="passForm"
        :rules="rules"
        size="small"
        :label-width="$i18n.locale === 'zh' ? '60px' : '120px'"
        ref="passForm"
      >
        <el-form-item :label="$t('system.oldPassword')" prop="oldPass">
          <el-input
            type="password"
            v-model="passForm.oldPass"
            :placeholder="$t('system.oldPassword')"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('system.newPassword')" prop="newPass">
          <el-input
            type="password"
            v-model="passForm.newPass"
            :placeholder="$t('system.newPasswordRule')"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCancel('passForm')">{{
          $t('btns.cancel2')
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="submitPass('passForm')"
          >{{ $t('btns.ok2') }}</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :title="exportTitle"
      :close-on-click-modal="false"
      :modal="false"
      :visible.sync="exportFlag"
      custom-class="export-popper"
      top="30vh"
    >
      <el-date-picker
        ref="export"
        size="small"
        v-model="exportDate"
        type="daterange"
        value-format="yyyy-MM-dd"
        align="center"
        :editable="false"
        :start-placeholder="$t('table.startDate')"
        :end-placeholder="$t('table.endDate')"
      >
      </el-date-picker>
      <el-button size="small" @click="handleHomeExport">{{
        $t('home.export')
      }}</el-button>
    </el-dialog>
    <el-dialog
      :title="$t('dialog.prompt')"
      :close-on-click-modal="false"
      :modal="false"
      custom-class="tips-dialog"
      :visible.sync="forTipFlag"
      top="30vh"
    >
      <el-row v-for="(item, index) in tipsData" :key="index">
        <el-col class="result-list-title">{{
          '【' + item.projectName + '】'
        }}</el-col>
        <el-col
          v-for="(value, key) in item.resultList"
          class="result-list"
          :key="key"
        >
          <el-col
            >{{
              '[' +
                value.errTime.split('-')[1] +
                '-' +
                value.errTime.split('-')[2] +
                ']\r'
            }}
            <span class="fw">{{ value.onBur }}</span>
            {{ '\r(' + value.mac + ')\r' }}
            <span class="fw">{{ value.chnlName }}</span>
            <span class="c-danger">{{ '\r' + value.errDesc }}</span
            >{{ '\r' + value.linkInfo }}</el-col
          >
        </el-col>
        <el-button
          type="text"
          class="view-more"
          @click="handleViewMore(item)"
          >{{ $t('btns.view') + $t('btns.more') }}</el-button
        >
      </el-row>
    </el-dialog>
    <el-dialog
      :title="$t('dialog.versionUpdate')"
      :visible.sync="NotifyVisible"
      :close-on-click-modal="false"
      :modal="false"
      width="1000px"
      top="20vh"
    >
      <div style="height:500px">
        <el-scrollbar class="scroll-wrap">
          <el-timeline>
            <el-timeline-item
              :timestamp="versionHistory.current.deploy_time"
              placement="top"
            >
              <el-card>
                <h4 style="margin-top: 0px">
                  {{ versionHistory.current.version_no }}
                </h4>
                <p
                  v-for="(item, index) in versionHistory.current.content"
                  :key="index"
                >
                  {{ item }}
                </p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item
              v-for="(hislistItem, hislistIndex) in versionHistory.hislist"
              :key="hislistIndex"
              :timestamp="hislistItem.deploy_time"
              placement="top"
            >
              <el-card>
                <h4 style="margin-top: 0px">{{ hislistItem.version_no }}</h4>
                <p v-for="(Item, Index) in hislistItem.content" :key="Index">
                  {{ Item }}
                </p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-scrollbar>
      </div>
    </el-dialog>
    <el-dialog
      :title="$t('home.projectelectricStatisticalTable') + $t('home.export')"
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
        <el-form-item :label="$t('dialog.time') + $t('dialog.range')">
          <el-date-picker
            v-model="rangeExportForm.value"
            type="daterange"
            style="width:280px"
            value-format="yyyyMMdd"
            :clearable="false"
            :editable="false"
            :range-separator="$t('table.to')"
            :start-placeholder="$t('table.startDate')"
            :end-placeholder="$t('table.endDate')"
          >
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
import store from '@/store'
import screenfull from 'screenfull'
import pkg from '../../package.json'
import { versionHistory } from '../../static/js/version-history'
import {
  signOut,
  loadAllProject,
  switchHover,
  loadMetadata,
  chgPwd,
  forTip,
  updateStaffInfo,
  portalGblbpk,
  findStaffInfo
} from '@/api/api'
import { wsClose } from '@/untils/websocket'
import { regionDataPlus } from 'element-china-area-data'
export default {
  data () {
    let validateOldPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('system.oldPasswordRule')))
      } else {
        callback()
      }
    }
    let validateNewPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('system.newPasswordRules')))
      } else {
        callback()
      }
    }
    return {
      rangeExportForm: {
        value: ''
      },
      exportRangeFlags: false,
      config: config,
      versionHistory: versionHistory,
      options: regionDataPlus,
      selectedOptions: [],
      provinceId: '',
      cityId: '',
      countyId: '',
      mapType: config.useMap,
      keyword: '',
      passFlag: false,
      passForm: {
        newPass: '',
        oldPass: ''
      },
      informationFlag: false,
      informationForm: {
        loginName: '',
        realName: '',
        mobile: '',
        telephone: '',
        email: ''
      },
      rules: {
        oldPass: [{ validator: validateOldPass, trigger: 'blur' }],
        newPass: [{ validator: validateNewPass, trigger: 'blur' }]
      },
      informationRules: {
        realName: [
          {
            required: true,
            message: this.$t('table.pleaseEnter') + this.$t('dialog.realName'),
            trigger: 'blur'
          },
          {
            min: 2,
            max: 30,
            message: this.$t('system.pleaseEnterCharacters'),
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: this.$t('system.mobilePhoneRule'),
            trigger: 'blur'
          },
          {
            pattern: /^(\+?[0-9]{2,4})?(-?[0-9]{2,15})+$/,
            message: this.$t('system.mobilePhoneRule')
          }
        ]
      },
      exportFlag: false,
      exportTitle: '',
      exportCommand: '',
      exportDate: [
        this.$func.getNowFormatDate(),
        this.$func.getNowFormatDate()
      ],
      timerID: null,
      forTipFlag: false,
      tipsData: [],
      rightView: false,
      fullScreen: false,
      innerMessage: this.$store.state.innerMessage,
      NotifyVisible: false,
      notifyValue: false,
      devicePasswordValue: false
    }
  },
  created () {
    this.getModulus()
  },
  inject: ['getReload'],
  mounted () {
    this.init()
    this.setTimer(this.forTip, config.pollingInterval.forTip * 1000)
    screenfull.on('change', e => {
      this.fullScreen = screenfull.isFullscreen
    })
  },
  methods: {
    init () {
      this.initAllProjects()
      this.initMetaData()
      this.$nextTick(() => {
        setTimeout(() => {
          if (
            this.$func.getDaysBetween(
              Date.parse(new Date(versionHistory.current.deploy_time)),
              new Date()
            ) <= 7
          ) {
            if (document.cookie.indexOf('notify') === -1) {
              this.openNotifyInstance()
            } else {
              if (!this.$func.getCookie(`notify-${pkg.version}`)) {
                this.openNotifyInstance()
              }
            }
          }
        }, 3000)
        setTimeout(() => {
          if (document.cookie.indexOf('devicePassword') === -1) {
            this.openDevicePasswordInstance()
          } else {
            if (!this.$func.getCookie(`devicePassword-${pkg.version}`)) {
              this.openDevicePasswordInstance()
            }
          }
        }, 3100)
      })
    },
    initMetaData () {
      let params = {
        projectCode: this.$store.state.projectCode,
        provinceId: this.provinceId ? this.provinceId : '',
        cityId: this.cityId ? this.cityId : '',
        countyId: this.countyId ? this.countyId : ''
      }
      this.$nextTick(function () {
        loadMetadata(params)
          .then(res => {
            if (res.success) {
              store.commit('industryTypes', res.data.industryTypes)
              let localTo = res.data.localTo
              if (JSON.stringify(localTo) !== '{}') {
                store.commit('location', res.data.localTo)
                store.commit('provinceId', localTo.provinceId)
                store.commit('cityId', localTo.cityId)
                store.commit('countyId', localTo.countryId)
                if (localTo.cityId !== undefined) {
                  this.selectedOptions = [
                    localTo.provinceId !== undefined ? localTo.provinceId : '',
                    localTo.cityId !== undefined ? localTo.cityId : '',
                    localTo.countryId !== undefined ? localTo.countryId : ''
                  ]
                } else {
                  this.selectedOptions = [
                    localTo.provinceId !== undefined ? localTo.provinceId : '',
                    localTo.cityId !== undefined ? localTo.cityId : ''
                  ]
                }
              } else {
                store.commit('provinceId', '')
                store.commit('cityId', '')
                store.commit('countyId', '')
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
      })
    },
    initAllProjects () {
      let params = {
        provinceId: this.provinceId ? this.provinceId : '',
        cityId: this.cityId ? this.cityId : '',
        countyId: this.countyId ? this.countyId : ''
      }
      loadAllProject(params)
        .then(res => {
          store.commit('allProjects', res)
        })
        .catch(res => {
          this.$message({
            type: 'error',
            message: this.$t('message.unknown')
          })
        })
    },
    handleCloseRange () {
      this.rangeExportForm.value = []
    },
    handleExportRange () {
      // console.log(
      //   Number(this.rangeExportForm.value[0]),
      //   Number(this.rangeExportForm.value[1]),
      //   '=====this.rangeExportForm.value'
      // )
      if (
        Number(this.rangeExportForm.value[1]) -
          Number(this.rangeExportForm.value[0]) >
        31
      ) {
        this.$message({
          message: this.$t('message.limitMonth'),
          type: 'error'
        })
        return false
      }
      if (
        new Date(this.rangeExportForm.value[0]).getTime() >=
          new Date(this.$func.getNowFormatDate()).getTime() ||
        new Date(this.rangeExportForm.value[1]).getTime() >=
          new Date(this.$func.getNowFormatDate()).getTime()
      ) {
        this.$message({
          message: this.$t('message.rangeLimitation'),
          type: 'error'
        })
        return false
      }
      this.$func.windowCountDown(
        ctxPaths +
          '/project/main/v5/xls/userPrjPowerStats.as?startYm=' +
          this.rangeExportForm.value[0] +
          '&endYm=' +
          this.rangeExportForm.value[1]
      )
    },
    getModulus () {
      if (!this.$store.state.modulus || !this.$store.state.exponent) {
        //  console.log(1111)
        portalGblbpk({fk: ''}).then(res => {
          console.log(22222)
          if (res.success) {
            store.commit('exponent', res.data.exponent)
            store.commit('modulus', res.data.modulus)
          }
          // console.log(res, '===========portalGblbpk')
        })
      }
      // console.log(3333)
    },
    querySearchAsync (queryString, cb) {
      let allProjects = this.$store.state.allProjects.data
      let results = queryString
        ? allProjects.filter(this.createFilter(queryString))
        : allProjects
      cb(results)
    },
    createFilter (queryString) {
      return project => {
        return (
          project.projectName.toLowerCase().indexOf(queryString.toLowerCase()) >
          -1
        )
      }
    },
    handleSelect (item) {
      let params = {
        projectCode: item.projectCode
      }
      switchHover(params)
        .then(res => {
          if (res.success) {
            store.commit('projectCode', item.projectCode)
            store.commit('fullName', item.projectName)
            store.commit('equipmentType', 1)
            store.commit('overviewMac', '')
            store.commit('distributionDateType', 1)
            this.$router.push({ path: '/InnerMain/Overview' })
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
    handleChange (value) {
      store.commit('provinceId', value[0])
      store.commit('cityId', value[1])
      store.commit('countyId', value[2])
      store.commit('location', [value[0], value[1], value[2]])
      this.provinceId = value[0]
      this.cityId = value[1]
      this.countyId = value[2]
      this.initAllProjects()
    },
    handleMute () {
      store.commit('muted', !this.$store.state.muted)
    },
    handleSystemPage () {
      if (this.$route.name === 'System') {
        this.$router.push({ path: '/Home' })
      } else {
        this.$router.push({ name: 'System' })
      }
    },
    handleNewsPage () {
      if (this.$route.name === 'News') {
        this.$router.push({ path: '/Home' })
      } else {
        this.$router.push({ name: 'News' })
      }
    },
    handleExportCommand (command) {
      if (command === 'current') {
        this.exportTitle =
          this.$t('home.alarmClassificationStatisticsTable') +
          this.$t('home.export')
        this.exportFlag = true
        this.exportCommand = command
      } else if (command === 'all') {
        this.exportFlag = true
        this.exportCommand = command
        this.exportTitle =
          this.$t('home.alarmHistoryDetailsTable') + this.$t('home.export')
      } else if (command === 'electric') {
        this.exportRangeFlags = true
      }
      // this.exportFlag = true
      // this.exportCommand = command
    },
    handleCommand (command) {
      if (command === 'logs') {
        this.$router.push({ path: '/Logs' })
      } else if (command === 'changePassword') {
        this.handlePassword()
      } else if (command === 'signOut') {
        this.signOut()
      }
    },
    handleHomeExport (val) {
      let diff = this.$func.checkDateThreeMonths(
        this.exportDate[0],
        this.exportDate[1]
      )
      if (this.exportCommand === 'current') {
        if (diff === 'true') {
          this.$func.windowCountDown(
            ctxPaths +
              '/project/main/v2/xls/statisticalOfBoxAlarmClassified.as?oqp1=' +
              this.exportDate[0] +
              '&oqp2=' +
              this.exportDate[1]
          )
        } else {
          this.$message({
            message:
              this.$t('home.export') + this.$t('message.limitThreeMonths'),
            type: 'error'
          })
        }
      } else if (this.exportCommand === 'all') {
        if (diff === 'true') {
          this.$func.windowCountDown(
            ctxPaths +
              '/project/main/v2/xls/detailOfBoxAlarmHistory.as?oqp1=' +
              this.exportDate[0] +
              '&oqp2=' +
              this.exportDate[1]
          )
        } else {
          this.$message({
            message:
              this.$t('home.export') + this.$t('message.limitThreeMonths'),
            type: 'error'
          })
        }
      }
    },
    handleView () {
      this.rightView = !this.rightView
      store.commit('rightView', this.rightView)
    },
    listenFullScreen (flag) {},
    handlePassword () {
      findStaffInfo()
        .then(res => {
          if (res.success) {
            this.informationForm = res.data
            this.informationFlag = true
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
    handleChangePassword () {
      this.informationFlag = false
      this.passFlag = true
    },
    handleInformationClose (formName) {
      this.informationFlag = false
      this.informationForm = {
        realName: '',
        mobile: '',
        telephone: '',
        email: ''
      }
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
    handleBeforeClose (done) {
      this.$refs['informationForm'].resetFields()
      done()
    },
    handleCancel (formName) {
      this.passFlag = false
      this.informationFlag = true
      this.passForm = {
        newPass: '',
        oldPass: ''
      }
      this.$refs[formName].resetFields()
    },
    submitPass (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            oriPwd: this.passForm.oldPass,
            newPwd: this.passForm.newPass
          }
          chgPwd(params).then(res => {
            if (res.success) {
              this.$message({
                message: this.$t('message.passwordUpdated'),
                type: 'success'
              })
              this.passFlag = false
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
        } else {
          return false
        }
      })
    },
    submitInformation (formName) {
      if (this.config.authority.AUTH_PROJECT_USE__SET_STAFF_INFO !== 'true') {
        this.$message({
          message: this.$t('message.noOperatingRights'),
          type: 'error'
        })
        return false
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = this.informationForm
          updateStaffInfo(params).then(res => {
            if (res.success) {
              this.$message({
                message: this.$t('message.successfulModified'),
                type: 'success'
              })
              store.commit('realName', this.informationForm.realName)
              this.informationFlag = false
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
        }
      })
    },
    signOut () {
      this.$confirm(
        this.$t('dialog.confirmSignOut'),
        this.$t('dialog.prompt'),
        {
          confirmButtonText: this.$t('btns.ok'),
          cancelButtonText: this.$t('btns.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          signOut({})
            .then(res => {
              if (res.data.authLoginFlag && res.data.authLoginFlag === 'V3') {
                if (
                  window.location.host === 'v3.sndtest.com' ||
                  window.location.host === 'localhost:8080'
                ) {
                  window.location.href = 'https://v5.sndtest.com'
                } else {
                  window.location.href = 'https://v5.snd02.com'
                }
              } else {
                clearTimeout(this.timerID)
                if (res.data.backurl) {
                  window.location.href = res.data.backurl
                } else {
                  this.$router.replace({ path: '/login' })
                  this.$message({
                    message: res.message,
                    type: 'success'
                  })
                }
                wsClose()
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
              this.getReload()
              // console.log('这里清理了缓存')
            })
        })
        .catch(() => {
          this.$message({
            message: this.$t('message.cancelSignOut'),
            type: 'info'
          })
        })
    },
    forTip () {
      forTip({ projectCode: this.$store.state.projectCode })
        .then(res => {
          if (res.success) {
            if (res.data.length > 0) {
              this.tipsData = res.data
              this.forTipFlag = true
            } else {
              this.tipsData = []
              this.forTipFlag = false
            }
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
    handleViewMore (item) {
      this.forTipFlag = false
      store.commit('projectCode', item.projectCode)
      switchHover({ projectCode: item.projectCode })
        .then(res => {
          if (res.success) {
            store.commit('projectName', item.projectName)
            store.commit('fullName', '')
            store.commit('projectCode', item.projectCode)
            this.$router.push({
              path: '/InnerMain/Alarm'
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
    openNotifyInstance () {
      let _that = this
      let newData = []
      const h = this.$createElement
      versionHistory.current.content.forEach(item =>
        newData.push(h('p', null, item))
      )
      this.notifyInstance = this.$notify({
        title: versionHistory.current.version_no,
        position: 'bottom-right',
        duration: 15000,
        dangerouslyUseHTMLString: true,
        onClose: function () {
          if (_that.notifyValue) {
            _that.$func.setCookie(`notify-${pkg.version}`, _that.notifyValue)
          }
        },
        message: h(
          'div',
          {
            style: 'padding-top: 10px;height: 90px;color: #fff;'
          },
          [
            h(
              'div',
              {
                class: 'd-alm-content d-alm-content-show',
                style: 'height: 70px;width: 280px;color: #fff;'
              },
              newData
            ),
            h('div', { style: 'margin-top: 5px;color: #fff;' }, [
              h(
                'el-checkbox',
                {
                  style: 'color: #fff;',
                  on: { change: this.changeCheckbox }
                },
                this.$t('btns.notShow')
              ),
              h(
                'button',
                {
                  class: 'notifyMore',
                  on: { click: this.clickBtn }
                },
                this.$t('btns.showMore')
              )
            ])
          ]
        )
      })
    },
    openDevicePasswordInstance () {
      let _that = this
      let newData = []
      const H = this.$createElement
      newData.push(
        H('div', { class: 'fs-20 tc' }, '注意修改设备初始密码哦~'),
        H(
          'div',
          { class: 'fs-12 tc mt-10', style: 'color: #999' },
          '进入设备归属项目>综合管理>批量配置'
        )
      )
      this.DevicePasswordInstance = this.$notify({
        title: '提示',
        position: 'bottom-right',
        duration: 15000,
        dangerouslyUseHTMLString: true,
        onClose: function () {
          if (_that.devicePasswordValue) {
            _that.$func.setCookie(
              `devicePassword-${pkg.version}`,
              _that.devicePasswordValue
            )
          }
        },
        message: H(
          'div',
          {
            style: 'padding-top: 10px;height: 90px;color: #fff;'
          },
          [
            H(
              'div',
              {
                class: 'd-alm-content',
                style: 'height: 70px;width: 280px;color: #fff;'
              },
              newData
            ),
            H('div', { style: 'margin-top: 5px;color: #fff;' }, [
              H(
                'el-checkbox',
                {
                  style: 'color: #fff;',
                  on: { change: this.changeCheckbox1 }
                },
                this.$t('btns.notShow')
              ),
              H(
                'button',
                {
                  class: 'notifyMore '
                },
                ''
              )
            ])
          ]
        )
      })
    },
    clickBtn () {
      this.NotifyVisible = true
    },
    changeCheckbox (e) {
      this.notifyValue = e
    },
    changeCheckbox1 (e) {
      this.devicePasswordValue = e
    },
    setTimer (fn, delay) {
      let _this = this
      function timer () {
        clearTimeout(_this.timerID)
        _this.timerID = setTimeout(function () {
          timer()
          fn()
        }, delay)
      }
      timer()
    }
  },
  computed: {},
  watch: {
    $route (to, from) {
      if (to.path === '/Home') this.rightView = false
      if (to.path === '/News') this.innerMessage = 'false'
      if ('WebSocket' in window) {
        if (to.path === '/InnerMain/Overview') {
          window.removeEventListener('onmessageWS', this.getsocketData)
        }
        if (to.path === '/Home') {
          window.removeEventListener('onmessageWS', this.getsocketData)
        }
      }
    },
    '$store.state.innerMessage': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.innerMessage = newVal
        }
      }
    },
    '$store.state.rightView': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.rightView = newVal
        }
      }
    }
  },
  components: {}
}
</script>
<style lang="stylus" scoped>
.el-header
  position relative
  div
    height 50px
    line-height 50px
  .project-name
      text-align center
      font-size 24px
      line-height 70px
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
.bg-img
    height 50px
    overflow hidden
.location
    margin-right 10px
.header-right
    text-align right
    span
      cursor pointer
      font-size 12px
      margin-right 5px
    .mute,.setting
      vertical-align middle
      margin-right 5px
      font-size 22px
.left-padding-right
    padding-left 0 !important
    padding-right 0 !important
.el-cascader
    line-height 50px
.el-cascader >>> .el-input__inner
    padding 0 5px
    border none
    color #fff
    background transparent
.el-cascader >>> .el-input__suffix
    display none
.el-cascader >>> .el-cascader__label, .el-cascader >>> .el-cascader__label span
    padding 0 0 0 5px
    color #fff
.right-view
    position absolute
    top -5px
    right 15px
    font-size 16px
    cursor pointer
.el-dropdown
    color #fff
#user-name
    max-width 158px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    color #fff
    font-size 12px
  .user-name-icon
    margin-left 0
.export-popper .el-date-editor.el-input__inner
    width 250px
#home
  >>> .tips-dialog
        width 40vw
.result-list-title
  margin-bottom 5px
.result-list
  padding 0 5px
  .el-col
    padding 4px 0
.view-more
  padding 5px 0 10px 3px
/deep/ .custom-password .el-form-item__label
          color #606266
@media screen and (max-width: 1366px)
  #home
    >>> .tips-dialog
          width 60vw
.notice
  vertical-align middle
  font-size 15px !important
  position relative
.spot
  position absolute
  top -24px
  margin-left -7px
  font-size 13px
  color #ff6a00
.custom-input
        >>> .el-input__inner
              background-color #19254d
              border 1px solid #2a3558
.scroll-wrap
  height 100%
.notifyMore
  color #409EFF
  cursor pointer
  position absolute
  right 10px
  border none
  background-color transparent
.d-alm-content::-webkit-scrollbar
  width 5px
.d-alm-content::-webkit-scrollbar-track
  background-color #fff
  -webkit-border-radius 2em
  -moz-border-radius 2em
  border-radius 2em
.d-alm-content::-webkit-scrollbar-thumb
  background rgba(0, 0, 0,0.2)
  -webkit-border-radius 2em
  -moz-border-radius 2em
  border-radius 2em
.d-alm-content-show
  overflow-y hidden
  &:hover
    width 285px !important
    overflow-y scroll
@keyframes blink
  0%{opacity: 1;}
  100%{opacity: 0;}
@-webkit-keyframes blink
  0%{ opacity: 1;}
  100%{ opacity: 0;}
.blink
  color #fff
  animation blink 1s linear infinite
  -webkit-animation blink 1s linear infinite
</style>
