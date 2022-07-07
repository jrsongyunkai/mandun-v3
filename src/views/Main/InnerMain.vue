<template>
  <div
    id="inner-main"
    :class="
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
      ].indexOf($route.path) === -1
        ? 'inner-main'
        : ''
    "
    :style="baseStyle"
  >
    <i class="iconfont icon-fanhui-copy" @click.self="backToHome"
      >{{ $t('system.home')
      }}<i class="el-icon-arrow-right ml-5" style="margin-right: 5px"></i
      ><span>{{ cfg.DEF_PRJ_NAME }}</span>
    </i>
    <el-header
      height="100px"
      v-if="
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
        ].indexOf($route.path) === -1
      "
    >
      <el-col :span="10" class="basic-info left-padding-right pr-10">
        <el-row>
          <el-col :span="12" class="ellipsis" :title="industryName">{{
            $t('statistics.industryName') + '：' + industryName
          }}</el-col>
          <el-col :span="12" class="ellipsis" :title="prjManager + prjTel">
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              @hide="contact = prjManager"
              v-model="contactVisible"
            >
              <el-input
                size="small"
                maxlength="20"
                show-word-limit
                v-model.trim="contact"
                :placeholder="
                  $t('table.pleaseEnter') + $t('table.contact') + '1'
                "
              ></el-input>
              <div style="text-align: right; margin: 5px 0 0">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleInfo(prjId, contact, 'contact')"
                  >{{ $t('btns.ok') }}</el-button
                >
                <el-button
                  size="mini"
                  type="plain"
                  @click="contactVisible = false"
                  >{{ $t('btns.cancel') }}</el-button
                >
              </div>
              <span slot="reference" class="pointer">{{
                $t('statistics.prjManager') + '1：' + prjManager
              }}</span>
            </el-popover>
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              @hide="contactNumber = prjTel"
              v-model="contactNumberVisible"
            >
              <el-input
                size="small"
                maxlength="20"
                show-word-limit
                v-model="contactNumber"
                :placeholder="
                  $t('table.pleaseEnter') + $t('table.contactNumber') + '1'
                "
              ></el-input>
              <div style="text-align: right; margin: 5px 0 0">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleInfo(prjId, contactNumber, 'contactNumber')"
                  >{{ $t('btns.ok') }}</el-button
                >
                <el-button
                  size="mini"
                  type="plain"
                  @click="contactNumberVisible = false"
                  >{{ $t('btns.cancel') }}</el-button
                >
              </div>
              <span slot="reference" class="pointer">{{
                '\xa0\xa0\xa0\xa0' + prjTel
              }}</span>
            </el-popover>
          </el-col>
          <el-col
            :span="12"
            class="ellipsis"
            :title="linkman2 + '\xa0\xa0\xa0\xa0' + prjTel2"
          >
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              @hide="contact2 = linkman2"
              v-model="contact2Visible"
            >
              <el-input
                size="small"
                maxlength="20"
                show-word-limit
                v-model.trim="contact2"
                :placeholder="
                  $t('table.pleaseEnter') + $t('table.contact') + '2'
                "
              ></el-input>
              <div style="text-align: right; margin: 5px 0 0">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleInfo(prjId, contact2, 'contact2')"
                  >{{ $t('btns.ok') }}</el-button
                >
                <el-button
                  size="mini"
                  type="plain"
                  @click="contact2Visible = false"
                  >{{ $t('btns.cancel') }}</el-button
                >
              </div>
              <span slot="reference" class="pointer">{{
                $t('statistics.prjManager') + '2：' + linkman2
              }}</span>
            </el-popover>
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              @hide="contact2Number = prjTel2"
              v-model="contactNumber2Visible"
            >
              <el-input
                size="small"
                maxlength="20"
                show-word-limit
                v-model="contactNumber2"
                :placeholder="
                  $t('table.pleaseEnter') + $t('table.contactNumber') + '2'
                "
              ></el-input>
              <div style="text-align: right; margin: 5px 0 0">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleInfo(prjId, contactNumber2, 'contactNumber2')"
                  >{{ $t('btns.ok') }}</el-button
                >
                <el-button
                  size="mini"
                  type="plain"
                  @click="contactNumber2Visible = false"
                  >{{ $t('btns.cancel') }}</el-button
                >
              </div>
              <span slot="reference" class="pointer">{{
                '\xa0\xa0\xa0\xa0' + prjTel2
              }}</span>
            </el-popover>
          </el-col>
          <el-col
            :span="12"
            class="ellipsis"
            :title="linkman3 + '\xa0\xa0\xa0\xa0' + prjTel3"
          >
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              @hide="contact3 = linkman3"
              v-model="contact3Visible"
            >
              <el-input
                size="small"
                maxlength="20"
                show-word-limit
                v-model.trim="contact3"
                :placeholder="
                  $t('table.pleaseEnter') + $t('table.contact') + '3'
                "
              ></el-input>
              <div style="text-align: right; margin: 5px 0 0">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleInfo(prjId, contact3, 'contact3')"
                  >{{ $t('btns.ok') }}</el-button
                >
                <el-button
                  size="mini"
                  type="plain"
                  @click="contact3Visible = false"
                  >{{ $t('btns.cancel') }}</el-button
                >
              </div>
              <span slot="reference" class="pointer">{{
                $t('statistics.prjManager') + '3：' + linkman3
              }}</span>
            </el-popover>
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              @hide="contact3Number = prjTel3"
              v-model="contactNumber3Visible"
            >
              <el-input
                size="small"
                maxlength="20"
                show-word-limit
                v-model="contactNumber3"
                :placeholder="
                  $t('table.pleaseEnter') + $t('table.contactNumber') + '3'
                "
              ></el-input>
              <div style="text-align: right; margin: 5px 0 0">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handleInfo(prjId, contactNumber3, 'contactNumber3')"
                  >{{ $t('btns.ok') }}</el-button
                >
                <el-button
                  size="mini"
                  type="plain"
                  @click="contactNumber3Visible = false"
                  >{{ $t('btns.cancel') }}</el-button
                >
              </div>
              <span slot="reference" class="pointer">{{
                '\xa0\xa0\xa0\xa0' + prjTel3
              }}</span>
            </el-popover>
          </el-col>
          <el-col :span="23" class="basic-address ellipsis" :title="address">{{
            $t('statistics.projectAddress') + '：' + address
          }}</el-col>
          <el-col :span="1" class="tr">
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="c-default pointer el-icon-menu"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-map-location" command="map">{{
                  $t('statistics.map')
                }}</el-dropdown-item>
                <el-dropdown-item
                  v-if="
                    cfg.DEF_PRJ_LOCATION.serverPointLeak === 1 &&
                      cfg.authority.AUTH_PROJECT_USE__SET_SERVER_POINT ===
                        'true'
                  "
                  icon="el-icon-link"
                  command="orientation"
                  >{{
                    $t('table.configuration') + $t('home.serviceOrientation')
                  }}</el-dropdown-item
                >
                <el-dropdown-item icon="iconfont icon-alarm" command="alarm">{{
                  $t('system.alarmNameModification')
                }}</el-dropdown-item>
                <el-dropdown-item
                  v-if="false"
                  icon="el-icon-folder-checked"
                  style="margin-left: 2px"
                  command="platform"
                  >{{ $t('home.useProjectNewPlatform') }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="14" class="project-info">
        <Statistics></Statistics>
      </el-col>
    </el-header>
    <el-container>
      <el-aside
        style="width: 200px;position:relative;border-right: 1px solid #303a5ecc"
        :class="
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
          ].indexOf($route.path) === -1
            ? 'aside-right'
            : 'aside-energy'
        "
      >
        <aside :class="collapsed" class="menuAni">
          <el-scrollbar
            :style="
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
              ].indexOf($route.path) === -1
                ? asideStyle
                : asideTowStyle
            "
          >
            <el-menu
              class="menubar"
              :default-active="$route.path"
              @close="cleseMenu"
              :collapseTransition="true"
              :collapsed="$store.state.collapsed"
              unique-opened
              text-color="#fff"
              active-text-color="#409EFF"
              background-color="transparent"
            >
              <el-menu-item
                index="/InnerMain/Overview"
                @click="toSecondMenu('/InnerMain/Overview')"
                class="el-submenu"
              >
                <i
                  class="iconfont icon-wulianwangshebei"
                  style="font-size: 20px; margin-left: 2px;"
                ></i>
                <span slot="title" style="margin-left: 3px;">{{
                  $t('control.device') + $t('table.overview')
                }}</span>
              </el-menu-item>
              <template v-for="(item, index) in menu">
                <template>
                  <el-submenu :key="index" :index="index.toString()">
                    <template slot="title">
                      <i :class="item.icon" style="color: #fff"></i>
                      <span
                        slot="title"
                        :style="
                          item.text === $t('menu.safetySupervision')
                            ? 'margin-left: -4px'
                            : 'margin-left: 2px'
                        "
                        >{{ item.text }}</span
                      >
                    </template>
                    <el-menu-item
                      class="ml-10"
                      v-for="(child, key) in item.children"
                      :index="child.url"
                      :key="key"
                      v-show="child.show !== false"
                      @click="toSecondMenu(child.url)"
                    >
                      {{ child.text }}
                    </el-menu-item>
                  </el-submenu>
                </template>
              </template>
              <el-menu-item
                v-if="orviboFlag"
                class="el-submenu"
                index="/InnerMain/Wisefamily"
                @click="toSecondMenu('/InnerMain/Wisefamily')"
              >
                <template slot="title">
                  <i class="iconfont icon-zhinengjiaju"></i>
                  <span slot="title" class="wiseFamily">智家365</span>
                </template>
              </el-menu-item>
            </el-menu>
          </el-scrollbar>
        </aside>
      </el-aside>
      <router-view></router-view>
      <div class="clearfix"></div>
    </el-container>
    <el-dialog
      :visible.sync="dialogVisible"
      :modal="false"
      @closed="handleCloseMap"
      width="80vw"
      id="map-wrap"
    >
      <div slot="title">
        <span v-if="!searchFlag">{{
          $t('statistics.projectAddress') + '：' + address
        }}</span>
        <span v-if="searchFlag" id="suggest-wrap">
          <el-form ref="form" size="small" :model="form" label-width="5px">
            <el-row>
              <el-col :span="$i18n.locale === 'zh' ? 2 : 3">
                <el-form-item>
                  {{ $t('statistics.projectAddress') + '：' }}
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item>
                  <el-input
                    v-model="form.province"
                    :placeholder="$t('placeholder.province')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item>
                  <el-input
                    v-model="form.city"
                    :placeholder="$t('placeholder.city')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item>
                  <el-input
                    v-model="form.district"
                    :placeholder="$t('placeholder.district')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item>
                  <el-input
                    v-model="form.street"
                    :placeholder="$t('placeholder.street')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" :offset="1" v-if="cfg.useMap !== 'CUSTOM_MAP'">
                <el-form-item>
                  <el-input
                    @input="
                      val => {
                        form.longitude = val
                          .replace(/[^0-9.]/g, '')
                          .replace('.', '#*')
                          .replace(/\./g, '')
                          .replace('#*', '.')
                      }
                    "
                    v-model.number="form.longitude"
                    :placeholder="$t('placeholder.longitude')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" v-if="cfg.useMap !== 'CUSTOM_MAP'">
                <el-form-item>
                  <el-input
                    @input="
                      val => {
                        form.latitude = val
                          .replace(/[^0-9.]/g, '')
                          .replace('.', '#*')
                          .replace(/\./g, '')
                          .replace('#*', '.')
                      }
                    "
                    v-model.number="form.latitude"
                    :placeholder="$t('placeholder.latitude')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item>
                  <el-button
                    :disabled="form.longitude === '' || form.latitude === ''"
                    @click="handleSaveLocate"
                    type="primary"
                    >{{ $t('btns.save') }}</el-button
                  >
                </el-form-item>
              </el-col>
              <el-col class="auto-address" v-if="cfg.useMap === 'BAIDU'">
                <el-col :span="$i18n.locale === 'zh' ? 2 : 3" class="fs-14">{{
                  $t('statistics.map') +
                    ($i18n.locale === 'zh' ? '' : '\xa0') +
                    $t('btns.query') +
                    '：'
                }}</el-col>
                <el-autocomplete
                  v-model="form.address"
                  size="small"
                  popper-class="autoAddressClass"
                  :fetch-suggestions="querySearchAsync"
                  :trigger-on-focus="false"
                  :placeholder="$t('placeholder.content')"
                  @select="handleSelect"
                >
                  <template slot-scope="{ item }">
                    <div class="name">
                      <i class="el-icon-search" />{{ item.title }}
                    </div>
                    <span class="addr ellipsis">{{ item.address }}</span>
                  </template>
                </el-autocomplete>
                <el-button size="small" @click="handleReLocate(rePoint)">{{
                  $t('btns.query')
                }}</el-button>
              </el-col>
            </el-row>
          </el-form>
        </span>
        <i
          v-if="!searchFlag"
          class="el-icon-edit pointer"
          @click="handleMapEdit"
        ></i>
      </div>
      <div id="map" v-if="cfg.useMap !== 'CUSTOM_MAP'"></div>
      <Custom
        v-if="cfg.useMap === 'CUSTOM_MAP' && customFlag"
        source="inner"
        :datas="customDatas"
      ></Custom>
    </el-dialog>
    <!-- 弹窗告警 -->
    <el-dialog
      width="770px"
      top="30vh"
      @closed="handleAlarms"
      :visible.sync="alarmFlag"
      :close-on-click-modal="false"
      :modal="false"
      class="d-alm-wrap"
    >
      <span slot="title"
        ><i class="iconfont icon-jinggao"></i>{{ $t('home.newAlarm') }}</span
      >
      <div class="d-alm-content d-alm-content-show">
        <div
          v-for="(item, index) in alarms"
          :key="index"
          style="margin-bottom: 2px"
        >
          <span>{{ '[' + item.datetime + ']' }}</span>
          <span class="c-warning">{{
            item.build
              ? item.build + ',' + item.unit + ',' + item.room
              : $t('dialog.unknownLocation')
          }}</span>
          <span class="c-warning">{{ '(' + item.mac + ')' }}</span>
          <span class="fw"
            >{{ item.node }}
            {{
              item.status === true ? $t('dialog.happen') : $t('dialog.cleanup')
            }}</span
          >
          <span class="c-danger jump" @click="handleRoute(item.typeNo)">{{
            item.info
          }}</span>
          <!-- span添加联系人 -->
          <span class="contacts"
            >{{ '(' + '\xa0\xa0' + $t('table.contact') + ':' }}
            <i v-if="item.linkman">{{ item.linkman }}</i>
            <i v-if="item.linkman_tel">{{ item.linkman_tel }}</i>
            <i v-if="item.linkman2">{{ item.linkman2 }}</i>
            <i v-if="item.linkman_tel2">{{ item.linkman_tel2 }}</i
            >)
          </span>
        </div>
        <div class="c-danger mt-20">
          <span v-show="offlineAttention && !abnormalAttention">{{
            $t('control.caution') +
              '：' +
              $t('control.offlineAttention') +
              $t('control.treatmentPlan')
          }}</span>
          <span v-show="abnormalAttention && !offlineAttention">{{
            $t('control.caution') +
              '：' +
              $t('control.abnormalAttention') +
              $t('control.treatmentPlan')
          }}</span>
          <span v-show="abnormalAttention && offlineAttention">
            <div class="treatment">{{ $t('control.caution') + '：' }}</div>
            <div class="treatment">{{ $t('control.offlineAttention') }}</div>
            <div class="treatment">{{ $t('control.abnormalAttention') }}</div>
            <div class="treatment">{{ $t('control.treatmentPlan') }}</div>
          </span>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="
        $t('home.equipmentInProject', ['HTTP', 'UDP']) +
          $t('home.serviceOrientation')
      "
      :close-on-click-modal="false"
      :visible.sync="orientationVisible"
      @closed="orientationVisible = false"
      width="680px"
    >
      <Orientation
        @handleSeverDialog="handleCloseServerDialog"
        :id="prjId"
        v-if="orientationVisible"
      ></Orientation>
    </el-dialog>
    <el-dialog
      :title="$t('system.projectAlarmNameModification')"
      :close-on-click-modal="false"
      :visible.sync="ProjectAlarmVisible"
      @closed="ProjectAlarmVisible = false"
      width="1000px"
    >
      <ProjectAlarmModification
        @handleAlarmDialog="handleCloseProjectAlarmDialog"
        v-if="ProjectAlarmVisible"
      ></ProjectAlarmModification>
    </el-dialog>
    <span v-if="audioFlag">
      <span v-if="$store.state.muted">
        <audio
          muted
          :src="
            AlarmSoundList[audioKey]
              ? cdnPaths + AlarmSoundList[audioKey]
              : cdnPaths + '/static/audio/pelic.mp3'
          "
        ></audio>
      </span>
      <span v-else>
        <audio
          autoplay
          :src="
            AlarmSoundList[audioKey]
              ? cdnPaths + AlarmSoundList[audioKey]
              : cdnPaths + '/static/audio/pelic.mp3'
          "
        ></audio>
      </span>
    </span>
  </div>
</template>
<script>
/* global config */
/* global ctxPaths */
/* global BMap */
/* global google */
import { Map } from '../../map'
import store from '@/store'
import mapStyleJson from '../../assets/js/custom_map_config.json'
import myIcon1 from '../../assets/image/nIcon.png'
import {
  statisticalNumber,
  getGblinfo,
  lastAlarm4tip,
  globalAlarmSound,
  updateProjectInfo,
  queryHomeMapInfo,
  queryPageAuth,
  switchToNewPlatform
} from '@/api/api'
import Custom from '../Common/Custom'
import Statistics from '../Home/Statistics'
import Orientation from '../Orientation/Orientation.vue'
import ProjectAlarmModification from '../ProjectAlarmModification/ProjectAlarmModification.vue'
export default {
  data () {
    return {
      cdnPaths: (document.location.host.indexOf('snd02.com') >= 0 || document.location.host.indexOf('snd01.com') >= 0) ? `${document.location.protocol}//v3cdn5.snd02.com` : ctxPaths,
      ctxPaths: ctxPaths,
      dialogVisible: false,
      longitude: '',
      latitude: '',
      bmap: null,
      geoc: null,
      rePoint: { lng: 0, lat: 0 },
      obj: null,
      form: {
        address: '',
        province: '',
        city: '',
        district: '',
        street: '',
        longitude: '',
        latitude: ''
      },
      cfg: config,
      AlarmSoundList: {},
      asideStyle: {
        width: '320px',
        height: this.$store.state.asideHeight
      },
      asideTowStyle: {
        width: '320px',
        height: this.$store.state.asideTowHeight
      },
      clrCache: true,
      gainType: 1,
      excId: [],
      popTxt: [],
      audioKey: 0,
      alarmFlag: false,
      audioFlag: false,
      alarms: [],
      menu: [
        {
          text: this.$t('menu.safetySupervision'),
          icon: 'el-icon-data-line',
          children: [
            {
              text: this.$t('menu.allAlarms'),
              url: '/InnerMain/Warn'
            },
            {
              text: this.$t('menu.leakageCurrent'),
              url: '/InnerMain/Leakage'
            },
            {
              text: this.$t('menu.temperature'),
              url: '/InnerMain/Temperature'
            },
            {
              text: this.$t('types.leakageA'),
              url: '/InnerMain/LeakageW'
            },
            {
              text: this.$t('types.temperatureA'),
              url: '/InnerMain/TemperatureW'
            },
            {
              text: this.$t('menu.leakedSelfTest'),
              url: '/InnerMain/ShortC'
            },
            {
              text: this.$t('types.shortCircuitA'),
              url: '/InnerMain/ShortW'
            },
            {
              text: this.$t('menu.overvoltage'),
              url: '/InnerMain/OUvoltage'
            },
            {
              text: this.$t('menu.overcurrentOverload'),
              url: '/InnerMain/Overload'
            },
            {
              text: this.$t('types.fireA'),
              url: '/InnerMain/SparkingW'
            },
            {
              text: this.$t('types.threePhaseA'),
              url: '/InnerMain/ThreephaseW'
            },
            {
              text: this.$t('control.abnormal') + this.$t('table.status'),
              url: '/InnerMain/Alarm'
            },
            {
              text: this.$t('menu.openingAndClosingWarning'),
              url: '/InnerMain/OpenCloseWarning'
            }
          ]
        },
        {
          text: this.$t('menu.energyManagement'),
          icon: 'iconfont icon-nengyuan1',
          children: [
            {
              text: this.$t('menu.electricity'),
              url: '/InnerMain/Power'
            },
            {
              text: this.$t('menu.powerLoad'),
              url: '/InnerMain/Load'
            },
            {
              text: this.$t('menu.analysisReport'),
              url: '/InnerMain/AnalysisReport',
              show: false
            },
            {
              text: '节能方案',
              url: '/InnerMain/SavingScheme',
              show: false
            },
            {
              text: this.$t('menu.energyOverview'),
              url: '/InnerMain/EnergyOverview',
              show: false
            },
            {
              text: this.$t('menu.energyReport'),
              url: '/InnerMain/EnergyReport',
              show: false
            },
            {
              text: this.$t('menu.energyConsumptionManagement'),
              url: '/InnerMain/EnergyManagement',
              show: false
            },
            {
              text: this.$t('menu.energyFormula'),
              url: '/InnerMain/EnergyFormula',
              show: false
            },
            {
              text: this.$t('menu.energyTrend'),
              url: '/InnerMain/EnergyTrend',
              show: false
            },
            {
              text: this.$t('menu.energyComparison'),
              url: '/InnerMain/EnergyComparison',
              show: false
            },
            {
              text: this.$t('menu.energyConsumption'),
              url: '/InnerMain/EnergyConsumption',
              show: false
            },
            {
              text: this.$t('menu.energyStatistics'),
              url: '/InnerMain/EnergyStatistics',
              show: false
            },
            {
              text: this.$t('menu.energyAnalysis'),
              url: '/InnerMain/EnergyAnalysis',
              show: false
            }
          ]
        },
        {
          text: this.$t('menu.integratedManagement'),
          icon: 'iconfont icon-zonghe',
          children: [
            {
              text: this.$t('control.sceneControl'),
              url: '/InnerMain/Control'
            },
            {
              text:
                this.$t('control.builtIn') +
                this.$t('control.timing') +
                this.$t('table.configuration'),
              url: '/InnerMain/BuiltInTiming'
            },
            {
              text:
                this.$t('control.builtIn') +
                this.$t('table.LongitudeLatitude') +
                this.$t('control.timing'),
              url: '/InnerMain/LatitudeLongitudeTiming'
            },
            {
              text: this.$t('table.batch') + this.$t('table.configuration'),
              url: '/InnerMain/BatchConfiguration'
            },
            {
              text:
                this.$t('control.abnormal') +
                this.$t('table.status') +
                this.$t('control.detectionConfiguration'),
              url: '/InnerMain/DetectionRules'
            },
            {
              text: this.$t('control.linkage') + this.$t('table.configuration'),
              url: '/InnerMain/LinkageScene'
            },
            {
              text: '设置区域关系',
              url: '/InnerMain/RegionalRelations',
              show: false
            }
          ]
        }
      ],
      projectCode: '',
      address: '',
      industryName: '',
      prjManager: '',
      prjTel: '',
      linkman2: '',
      prjTel2: '',
      linkman3: '',
      prjTel3: '',
      statistics: [],
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
      offlineAttention: false,
      abnormalAttention: false,
      timerID: null,
      wsData: '',
      prjId: '',
      contact: '',
      contactVisible: false,
      contactNumber: '',
      contactNumberVisible: false,
      contact2: '',
      contact2Visible: false,
      contactNumber2: '',
      contactNumber2Visible: false,
      contact3: '',
      contact3Visible: false,
      contactNumber3: '',
      contactNumber3Visible: false,
      orientationAuth: false,
      orientationVisible: false,
      ProjectAlarmVisible: false,
      searchFlag: false,
      baiduOfflinemapMaxzoom:
        config.baiduOfflinemapMaxzoom === undefined
          ? 16
          : config.baiduOfflinemapMaxzoom,
      customFlag: false,
      orviboFlag: false,
      customDatas: [],
      baseStyle: {
        height: this.$store.state.innerMainHeight
      }
    }
  },
  created () {
    // console.log(this.cdnPaths, '=====cdnPaths')
    // console.log(process.env.NODE_ENV, '=====process.env.NODE_ENV')
    // let cdnPaths =
    //   process.env.NODE_ENV !== 'production' ? 'v3cdn5.snd02.com' : `${ctxPaths}`
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.initNumbers()
      if ('WebSocket' in window) {
        window.addEventListener('onmessageWS', this.getsocketData, false)
      }
      this.getGblinfos()
      this.getGlobalAlarmSound()
      this.queryTreePageAuth()
    },
    queryTreePageAuth () {
      let params = {
        resKeys:
          'AUTH_PROJECT_MENU_USE,AUTH_PROJECT_MENU_USE,AUTH_PROJECT_USE,AUTH_PROJECT_USE',
        operKeys: 'ANALYSIS_REPORT_MENUITEM,ORVIBO,ENERGY_REPORT,ENERGY_AREA'
      }
      queryPageAuth(params)
        .then(res => {
          if (res.success) {
            this.menu[1].children[2].show = res.data[0].result
            this.menu[2].children[6].show = res.data[3].result
            this.menu[1].children[3].show = this.menu[1].children[4].show = this.menu[1].children[5].show = this.menu[1].children[6].show = this.menu[1].children[7].show = this.menu[1].children[8].show = this.menu[1].children[9].show = this.menu[1].children[10].show = this.menu[1].children[11].show = this.menu[1].children[12].show =
              res.data[2].result
            this.orviboFlag = res.data[1].result
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
    getsocketData (e) {
      this.wsData = JSON.parse(e && e.detail.data)
      if (!this.wsData.data) return false
      this.audioKey = ''
      this.audioFlag = false
      this.socketStatsNumber(this.wsData)
    },
    socketStatsNumber (wsData) {
      this.$nextTick(() => {
        if (wsData.data.dataList.length > 0) {
          this.gainType = 2
          let curTxt = []
          let types = []
          if (wsData.data.dataList[0] && wsData.data.dataList.length > 0) {
            wsData.data.dataList.forEach((v, i) => {
              this.excId.push(v.id)
              if (v.mac && v.projectCode === this.$store.state.projectCode) {
                this.alarms.unshift(v)
                curTxt.push(v)
                this.audioKey = String(v.typeNo)
              }
            })
            if (curTxt.length > 0) {
              this.popTxt = curTxt.concat(this.popTxt)
              if (this.popTxt.length > 100) {
                this.gainType = 1
                this.excId = []
                this.alarms.splice(100, this.alarms.length - 100)
              }
              if (this.popTxt.length > 0) {
                this.showAlarmTip()
                this.alarms.forEach((item, index) => {
                  types.unshift(item.typeNo)
                })
                if (types.indexOf(1002) > -1 && types.indexOf(1005) > -1) {
                  this.offlineAttention = true
                  this.abnormalAttention = true
                } else {
                  types.indexOf(1002) > -1
                    ? (this.offlineAttention = true)
                    : (this.offlineAttention = false)
                  types.indexOf(1005) > -1
                    ? (this.abnormalAttention = true)
                    : (this.abnormalAttention = false)
                }
              }
            }
          }
        }
      })
    },
    getGlobalAlarmSound () {
      globalAlarmSound()
        .then(res => {
          if (res.success) {
            this.AlarmSoundList = res.data
            this.audioFlag = true
            this.$nextTick(() => {
              this.audioFlag = false
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
    initNumbers () {
      store.commit('statisticsFlag', false)
      let params = {
        projectCode: this.$store.state.projectCode,
        date: this.$store.state.projectCode ? this.$func.getNowFormatDate() : ''
      }
      this.$nextTick(function () {
        statisticalNumber(params)
          .then(res => {
            if (res.success) {
              store.commit('totalAlarm', res.data.totalAlarm)
              store.commit('totalMac', res.data.totalMac)
              store.commit('totalOnline', res.data.totalOnline)
              store.commit('allTotalAlarm', res.data.allTotalAlarm)
              store.commit('totalProject', res.data.totalProject)
              store.commit('totalAddr', res.data.totalAddr)
              store.commit('totalOnlineAddr', res.data.totalOnlineAddr)
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
            store.commit('statisticsFlag', true)
          })
      })
    },
    getGblinfos () {
      let params = {
        rf: 'json'
      }
      this.$nextTick(function () {
        getGblinfo(params)
          .then(res => {
            this.address = res.DEF_PRJ_LOCATION.address
            this.industryName = res.DEF_PRJ_LOCATION.industryName
            this.prjManager = res.DEF_PRJ_LOCATION.prjManager
            this.prjTel = res.DEF_PRJ_LOCATION.prjTel
            this.longitude = res.DEF_PRJ_LOCATION.longitude
            this.latitude = res.DEF_PRJ_LOCATION.latitude
            this.linkman2 = res.DEF_PRJ_LOCATION.linkMan2
            this.prjTel2 = res.DEF_PRJ_LOCATION.linkTel2
            this.linkman3 = res.DEF_PRJ_LOCATION.linkMan3
            this.prjTel3 = res.DEF_PRJ_LOCATION.linkTel3
            this.prjId = res.DEF_PRJ_LOCATION.prjId
            this.contact = res.DEF_PRJ_LOCATION.prjManager
            this.contactNumber = res.DEF_PRJ_LOCATION.prjTel
            this.contact2 = res.DEF_PRJ_LOCATION.linkMan2
            this.contactNumber2 = res.DEF_PRJ_LOCATION.linkTel2
            this.contact3 = res.DEF_PRJ_LOCATION.linkMan3
            this.contactNumber3 = res.DEF_PRJ_LOCATION.linkTel3
            this.form.province = res.DEF_PRJ_LOCATION.provinceName
            this.form.city = res.DEF_PRJ_LOCATION.cityName
            this.form.district = res.DEF_PRJ_LOCATION.countyName
            this.form.street = res.DEF_PRJ_LOCATION.street
            this.form.longitude = res.DEF_PRJ_LOCATION.longitude
            this.form.latitude = res.DEF_PRJ_LOCATION.latitude
            this.cfg = res
            store.commit('projectName', res.DEF_PRJ_TITLE)
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
    backToHome () {
      store.commit('projectCode', '')
      store.commit('fullName', '')
      store.commit('equipmentType', 1)
      store.dispatch('resetOverviewMac')
      store.commit('distributionDateType', '')
      this.$nextTick(() => {
        clearTimeout(this.timerID)
        this.$router.push({ path: '/Home' })
      })
    },
    toSecondMenu (path) {
      this.$router.push({ path: path })
      if (
        path === '/InnerMain/EnergyOverview' ||
        path === '/InnerMain/EnergyReport' ||
        path === '/InnerMain/EnergyManagement' ||
        path === '/InnerMain/EnergyFormula' ||
        path === '/InnerMain/EnergyTrend' ||
        path === '/InnerMain/EnergyComparison' ||
        path === '/InnerMain/EnergyConsumption' ||
        path === '/InnerMain/EnergyStatistics' ||
        path === '/InnerMain/EnergyAnalysis'
      ) {
        store.commit('rightView', true)
      }
    },
    handleMap () {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.renderMap()
      })
    },
    handleCloseMap () {
      this.searchFlag = false
      this.customFlag = false
      this.form.address = this.address
      this.getGblinfos()
    },
    handleMapEdit () {
      this.searchFlag = true
      this.form.address = this.address
    },
    handleSelect (item) {
      this.form.address = item.address + item.title
      this.rePoint = item.point
      this.obj = item
    },
    handleReLocate (point) {
      if (JSON.stringify(point) !== '{"lng":0,"lat":0}') {
        this.geoc.getLocation(point, rs => {
          if (rs) {
            let ac = rs.addressComponents
            this.form.province = ac.province
            this.form.city = ac.city
            this.form.district = ac.district
            this.form.street =
              ac.street + (this.obj !== null ? this.obj.title : '')
            this.form.longitude = point.lng
            this.form.latitude = point.lat
          }
        })
        this.bmap.clearOverlays()
        this.bmap.addOverlay(new BMap.Marker(point))
        this.bmap.panTo(point)
      }
    },
    handleSaveLocate () {
      let params = {
        updateType: 1,
        prjId: this.prjId,
        longitude: this.form.longitude,
        latitude: this.form.latitude,
        provinceName: this.form.province,
        cityName: this.form.city,
        countyName: this.form.district,
        street: this.form.street
      }
      this.searchFlag = false
      this.address = this.form.address
      updateProjectInfo(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('message.successfulModified'),
              type: 'success'
            })
            this.longitude = this.form.longitude
            this.latitude = this.form.latitude
            if (config.useMap !== 'BAIDU') {
              this.address =
                this.form.province +
                this.form.city +
                this.form.district +
                this.form.street
            }
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
    querySearchAsync (str, cb) {
      var options = {
        onSearchComplete: function (res) {
          let s = []
          cb(s)
          if (local.getStatus() === 0) {
            for (let i = 0; i < res.getCurrentNumPois(); i++) {
              s.push(res.getPoi(i))
            }
            cb(s)
          } else {
            s = res.suggestions
            cb(s)
          }
        }
      }
      var local = new BMap.LocalSearch(this.bmap, options)
      local.search(str)
    },
    async renderMap () {
      if (config.useMap === 'BAIDU') {
        if (typeof BMap === 'undefined') {
          await Map(config.baiduKey, config.useMap)
        }
        let bmap = new BMap.Map('map')
        let geoc = new BMap.Geocoder()
        let point = new BMap.Point(this.longitude, this.latitude)
        let marker = new BMap.Marker(point, { enalbeDragging: true })
        bmap.centerAndZoom(point, 16)
        if (!config.mapStyle || config.mapStyle !== 'normal') {
          bmap.setMapStyleV2({ styleJson: mapStyleJson })
        }
        bmap.enableScrollWheelZoom(true)
        bmap.addOverlay(marker)
        bmap.addEventListener('click', e => {
          if (this.searchFlag) {
            this.obj = null
            this.handleReLocate(e.point)
            geoc.getLocation(e.point, res => {
              this.form.address = res.address
              this.rePoint = res.point
            })
          }
        })
        this.bmap = bmap
        this.geoc = geoc
      } else if (config.useMap === 'BAIDU_OFFLINE') {
        let bmap = new window.BMap.Map('map')
        this.bamp = bmap
        let point = new window.BMap.Point(this.longitude, this.latitude)
        let marker = new window.BMap.Marker(point, { enalbeDragging: true })
        bmap.centerAndZoom(point, this.baiduOfflinemapMaxzoom)
        bmap.setMaxZoom(this.baiduOfflinemapMaxzoom)
        bmap.enableScrollWheelZoom(true)
        bmap.addOverlay(marker)
        bmap.addEventListener('click', e => {
          if (this.searchFlag) {
            this.obj = null
            bmap.clearOverlays()
            bmap.addOverlay(new BMap.Marker(e.point))
            bmap.panTo(e.point)
            this.form.province = ''
            this.form.city = ''
            this.form.district = ''
            this.form.street = ''
            this.form.longitude = e.point.lng
            this.form.latitude = e.point.lat
          }
        })
      } else if (config.useMap === 'GOOGLE') {
        if (typeof google === 'undefined') {
          await Map(config.googleKey, config.useMap)
        }
        let myLatLng = this.$func.BD09_To_GCJ02(this.latitude, this.longitude)
        let map = new google.maps.Map(document.getElementById('map'), {
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
        google.maps.event.addListener(map, 'click', event => {
          if (this.searchFlag) {
            let latLng = this.$func.GCJ02_To_BD09(
              event.latLng.lat(),
              event.latLng.lng()
            )
            marker.setMap(null)
            marker = new google.maps.Marker({
              position: event.latLng,
              map: map,
              icon: icon
            })
            marker.setMap(map)
            this.form.province = ''
            this.form.city = ''
            this.form.district = ''
            this.form.street = ''
            this.form.longitude = latLng.lng
            this.form.latitude = latLng.lat
          }
        })
      } else if (config.useMap === 'CUSTOM_MAP') {
        queryHomeMapInfo({ projectCode: this.$store.state.projectCode })
          .then(res => {
            if (res.success) {
              this.customFlag = true
              this.customDatas = res
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
              this.customFlag = false
            }
          })
          .catch(err => {
            if (err) {
              this.$message({
                message: this.$t('message.unknown'),
                type: 'error'
              })
            }
            this.customFlag = false
          })
      }
    },
    getLastAlarms () {
      let that = this
      if (this.$store.state.projectCode) {
        lastAlarm4tip({
          projectCode: this.$store.state.projectCode,
          gainType: this.gainType,
          excId: this.excId.join(',')
        })
          .then(res => {
            if (res.success) {
              this.gainType = 2
              let curTxt = []
              let types = []
              if (res.data && res.data.length > 0) {
                res.data.forEach((v, i) => {
                  that.excId.push(v.id)
                  if (v.mac) {
                    that.alarms.unshift(v)
                    curTxt.push(v)
                    this.audioKey = String(v.typeNo)
                  }
                })
                if (curTxt.length > 0) {
                  that.popTxt = curTxt.concat(that.popTxt)
                  if (that.popTxt.length > 100) {
                    that.gainType = 1
                    that.excId = []
                    that.alarms.splice(100, that.alarms.length - 100)
                  }
                  if (that.popTxt.length > 0) {
                    that.showAlarmTip()
                    that.alarms.forEach((item, index) => {
                      types.unshift(item.typeNo)
                    })
                    if (types.indexOf(1002) > -1 && types.indexOf(1005) > -1) {
                      that.offlineAttention = true
                      that.abnormalAttention = true
                    } else {
                      types.indexOf(1002) > -1
                        ? (that.offlineAttention = true)
                        : (that.offlineAttention = false)
                      types.indexOf(1005) > -1
                        ? (that.abnormalAttention = true)
                        : (that.abnormalAttention = false)
                    }
                  }
                }
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
      }
    },
    showAlarmTip () {
      this.audioFlag = true
      this.alarmFlag = true
    },
    handleAlarms () {
      this.gainType = 1
      this.excId = []
      this.popText = []
      this.alarms = []
      this.alarmFlag = false
      this.audioFlag = false
    },
    handleRoute (type) {
      let path = ''
      if (type === 1) {
        path = '/InnerMain/ShortW'
      } else if (type === 2) {
        path = '/InnerMain/LeakageW'
      } else if (type === 3 || type === 4) {
        path = '/InnerMain/Overload'
      } else if (type === 5 || type === 6) {
        path = '/InnerMain/OUvoltage'
      } else if (type === 7) {
        path = '/InnerMain/TemperatureW'
      } else if (type === 11) {
        path = '/InnerMain/SparkingW'
      } else if (type === 17) {
        path = '/InnerMain/ThreephaseW'
      } else {
        path = '/InnerMain/Warn'
      }
      this.$router.push({ path: `${path}` })
      this.alarmFlag = false
      this.audioFlag = false
    },
    handleInfo (code, value, type) {
      if (type === 'location') {
        // console.info('location')
      } else {
        if (
          type === 'contactNumber' ||
          type === 'contactNumber2' ||
          type === 'contactNumber3'
        ) {
          if (!this.$func.checkPhone(value)) {
            this.$message({
              message: this.$t('message.numberFormatError'),
              type: 'error'
            })
            return false
          }
        }
        let params = {
          updateType: 0,
          prjId: code
        }
        if (type === 'contact') params.prjManager = value
        if (type === 'contactNumber') params.prjTel = value
        if (type === 'contact2') params.linkMan2 = value
        if (type === 'contactNumber2') params.linkTel2 = value
        if (type === 'contact3') params.linkMan3 = value
        if (type === 'contactNumber3') params.linkTel3 = value
        updateProjectInfo(params)
          .then(res => {
            if (res.success) {
              this.$message({
                message: this.$t('message.successfulModified') + '！',
                type: 'success'
              })
              if (type === 'contact') {
                this.prjManager = value
                this.contactVisible = false
              } else if (type === 'contactNumber') {
                this.prjTel = value
                this.contactNumberVisible = false
              } else if (type === 'contact2') {
                this.linkman2 = value
                this.contact2Visible = false
              } else if (type === 'contactNumber2') {
                this.prjTel2 = value
                this.contactNumber2Visible = false
              } else if (type === 'contact3') {
                this.linkman3 = value
                this.contact3Visible = false
              } else if (type === 'contactNumber3') {
                this.prjTel3 = value
                this.contactNumber3Visible = false
              }
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
      }
    },
    handleCommand (command) {
      if (command === 'map') this.handleMap()
      if (command === 'orientation') this.handleOrientation()
      if (command === 'alarm') this.handleAlarmModification()
      if (command === 'platform') this.handleUseProjectNewPlatform()
    },
    handleOrientation () {
      this.orientationVisible = true
    },
    handleAlarmModification () {
      this.ProjectAlarmVisible = true
    },
    handleUseProjectNewPlatform () {
      let parmas = {
        projectCode: this.$store.state.projectCode
      }
      this.$confirm(
        this.$t('home.confirmUseProjectNewPlatform'),
        this.$t('dialog.prompt'),
        {
          confirmButtonText: this.$t('btns.ok'),
          cancelButtonText: this.$t('btns.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          switchToNewPlatform(parmas)
            .then(res => {
              if (res.success) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
                this.$router.push({ path: '/Home' })
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('message.cancelled')
          })
        })
    },
    handleCloseServerDialog () {
      this.orientationVisible = false
    },
    handleCloseProjectAlarmDialog () {
      this.ProjectAlarmVisible = false
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
  beforeDestroy () {
    clearTimeout(this.timerID)
    window.removeEventListener('onmessageWS', this.getsocketData)
  },
  watch: {
    '$store.state.projectCode': {
      handler (newVal, oldVal) {
        if (newVal) this.init()
      }
    },
    '$store.state.innerMainHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.baseStyle.height = newVal
        }
      }
    },
    '$store.state.asideHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.asideStyle.height = newVal
        }
      }
    },
    '$store.state.asideTowHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.asideTowStyle.height = newVal
        }
      }
    },
    $route: {
      handler (to, from) {
        if ('WebSocket' in window) {
          if (to.path === '/InnerMain/Overview') {
            window.removeEventListener('onmessageWS', this.getsocketData)
            window.addEventListener('onmessageWS', this.getsocketData)
          }
          if (to.path === '/Home') {
            window.removeEventListener('onmessageWS', this.getsocketData)
          }
        } else {
          clearTimeout(this.timerID)
          this.setTimer(
            this.getLastAlarms,
            config.pollingInterval.lastAlarm4tip * 1000
          )
        }
      },
      immediate: true
    }
  },
  computed: {
    collapsed: function () {
      return {
        'menu-collapsed': this.$store.state.collapsed === true,
        'menu-expanded': this.$store.state.collapsed === false
      }
    }
  },
  components: {
    Custom,
    Statistics,
    Orientation,
    ProjectAlarmModification
  }
}
</script>
<style lang="stylus" scoped>
#inner-main
    position relative
    margin 0 10px
.inner-main
    border 2px solid #303a5ecc
    box-shadow 3px 3px 6px 1px rgba(0, 0, 0, .2)
    -webkit-border-radius 10px
    -moz-border-radius 10px
    border-radius 10px
.aside-right
    border-right: 1px solid #303a5ecc
.aside-energy
    border 2px solid #303a5ecc
    box-shadow 3px 3px 6px 1px rgba(0, 0, 0, .2)
    -webkit-border-radius 10px
    -moz-border-radius 10px
    border-radius 10px
aside
    flex 0 0 200px
    float left
    width 200px
    overflow hidden
    box-sizing border-box
#inner-main .el-header
    padding-left 10px
    border-bottom 2px solid #303a5ecc
.el-header .el-col
    height 100%
.el-main
    padding 0
    border-left 1px solid #303a5ecc
.basic-info
    padding-top 10px
    font-size 13px
    border-right 1px solid #303a5ecc
    .el-row div
      height 26px
      line-height 26px
.basic-address
    max-height 38px
    display -webkit-box
    -webkit-box-orient vertical
    -webkit-line-clamp 2
    overflow hidden
.el-header div.basic-title
    height 30px
    line-height 30px
.project-info
    padding 20px 0
    text-align center
.grid-content, .numbers
    border 1px solid #303a5ecc
.project-info .grid-content
    border-top-left-radius 10px
    border-top-right-radius 10px
    padding 0
    height 33px
    line-height 33px
    border-bottom none
    overflow hidden
    text-overflow ellipsis
    display -webkit-box
    -webkit-line-clamp 1
    /*! autoprefixer: off */
    -webkit-box-orient vertical
    /* autoprefixer: on */
.project-info .numbers
    padding 0 0 5px
    border-top none
    font-size 20px
    height 23px
    line-height 23px
    border-bottom-left-radius 10px
    border-bottom-right-radius 10px
.menubar:not(.el-menu--collapse)
    width 199px
.menubar
    border-right none
.menuAni
    transition all 0.3s ease-in
.menu-expanded
    flex 0 0 200px
    width 200px
.main .menu-collapsed
    width 65px
.main .menu-collapsed
    -ms-flex 0 0 1.1854rem
    flex 0 0 1.1854rem
    width 1.1854rem
.el-menu
    height 100%
.el-submenu >>> li
    padding-left 50px !important
    border-top 1px solid #303a5ecc
.el-submenu
    border-bottom 1px solid #303a5ecc
.icon-fanhui-copy
    position absolute
    top -25px
    height 20px
    cursor pointer
    &:before
      color #cb4431
#map
    width 100%
    height 500px
#map-wrap >>> .el-dialog
    background #474d59
#map-wrap >>> .el-dialog__headerbtn .el-dialog__close, #map-wrap >>> .el-dialog__title
    color #fffeff
#map-wrap >>> .el-form-item--small.el-form-item
  margin-bottom 0
.ditu-btn
    cursor pointer
.ditu
    margin-left 3px
.d-alm-wrap >>> .el-dialog
    border-top-left-radius 4px
    border-top-right-radius 4px
.d-alm-wrap >>> .el-dialog__header
    background-color #ee1705
    color #fff
    border-top-left-radius 4px
    border-top-right-radius 4px
    .el-dialog__close
      color #fff
.d-alm-wrap >>> .el-dialog__header
    padding 8px 15px
    span
      font-size 14px
.d-alm-wrap >>> .el-dialog__headerbtn
    top 10px
.d-alm-content
  max-height 30vh
.d-alm-content::-webkit-scrollbar
  width 7px
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
.d-alm-content div span
    padding-right 7px
    font-size 12px
.d-alm-content div .contacts
    color #858689
    padding 7px
.d-alm-content div .contacts i
    font-style: normal
    margin-right 3px
.device-table
  .el-table, .el-table__expanded-cell, .el-table >>> th, .el-table >>> tr
      background-color transparent
      color #909399
  .el-table, .el-table >>> th, .el-table >>> td
      border 1px solid #ebeef5
  .el-table >>> td, .el-table >>> th.is-leaf
      border-bottom 1px solid #ebeef5
  .el-table--border::after,.el-table--group::after,.el-table::before
      background-color #ebeef5
.block
  >>> .el-pagination__total, >>> .el-pagination__jump
    color #909399
.ellipsis
  height 19px
  overflow hidden
  text-overflow ellipsis
  white-space nowrap
.treatment
  padding 5px 0
.icon-nengyuan1
  font-size 22px
  margin-left 1px
  margin-right -1px
.icon-zonghe
  margin-left 4px
  margin-right 1px
.icon-zhinengjiaju
  font-size 18px
  margin-left 3px
  margin-right 1px
.el-menu-item i
  color #fff
.el-menu-item.is-active i
  color inherit
.wiseFamily
  margin-left 2px
#suggest-wrap
  position relative
.auto-address
  position absolute
  top 52px
  left -10px
  width calc(80vw - 20px)
  padding 5px 5px 5px 15px
  z-index 9999
  background rgba(0, 0, 0, .3)
  .fs-14
    line-height 32px
  >>> .el-autocomplete
        width 30vw
.autoAddressClass
  li
    padding 0 10px
    line-height normal
    padding 7px
    .name
      line-height 24px
      text-overflow ellipsis
      overflow hidden
      .el-icon-search
        margin-right 5px
    .addr
      margin-left 19px
      font-size 12px
      color #b4b4b4
      line-height 24px
    .highlighted .addr
      color #ddd
.d-alm-content-show
  overflow-y hidden
  &:hover
    overflow-y scroll
</style>
