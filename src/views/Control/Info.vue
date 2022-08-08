<template>
  <div id="info">
    <el-row>
      <el-col class="info mt-7" :span="16">
        <el-popover
          placement="top"
          width="250"
          trigger="click"
          :append-to-body="false"
          v-model="aliasFlag"
          @hide="aliasFlag = false; aliasName = $store.state.aliasName">
            <el-input class="input" size="small" maxlength="20" show-word-limit v-model.trim="aliasName" :placeholder="$t('table.pleaseEnter') + $t('dialog.deviceAlias')"></el-input>
            <div style="text-align: right; margin: 5px 0 0">
              <el-button type="primary" size="mini" @click="handleInfo(mac, aliasName, 'alias')">{{ $t('btns.ok') }}</el-button>
              <el-button size="mini" type="plain" @click="aliasName = $store.state.aliasName;aliasFlag = false">{{ $t('btns.cancel') }}</el-button>
            </div>
            <div slot="reference" @mouseover="aliasIndex = mac" @mouseout="aliasIndex = -1" class="pointer pRelative">
              <div class="ellipsis" :title="aliasName">
                <span class="label" :class="$i18n.locale === 'zh' ? 'normal-label' : ''">{{ $t('dialog.deviceAlias') + '：' }}</span>
                <span>{{ aliasName }}</span>
              </div>
              <i slot="reference" v-if="aliasIndex === mac || aliasName === ''" class="el-icon-edit pointer" :class="$i18n.locale === 'zh' ? 'normal-icon' : 'unusual-icon'"></i>
            </div>
        </el-popover>
        <p class="mt-7">{{ $t('dialog.deviceNo') + '：' + info.mac }} <span class="ml-20" v-show="others.version !== undefined">{{ $t('table.version') + '：' + others.version }}</span></p>
        <p class="mt-7" style="margin-bottom: 0;">{{ $t('table.online') + $t('table.status') + '：' }}
          <span v-show="onlineStatus === 1" class="c-success">{{ $t('table.online') }}</span>
          <span v-show="onlineStatus === 0"><span class="c-danger">{{ $t('control.offline') }}</span><span class="ml-20 c-danger" v-show="onlineTime !== ''">{{ onlineTime }}</span></span>
          <span v-show="onlineStatus === -1" class="c-danger">{{ $t('table.offLine') }}</span>
        </p>
        <el-row class="mt-7" :gutter="10">
          <el-col :span="14">
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              :append-to-body="false"
              v-model="linkmanFlag"
              @hide="linkmanFlag = false; linkman = info.linkman">
                <el-input class="input" size="small" maxlength="20" show-word-limit v-model.trim="linkman" :placeholder="$t('table.pleaseEnter') + $t('table.contact') + '1'"></el-input>
                <div style="text-align: right; margin: 5px 0 0">
                  <el-button type="primary" size="mini" @click="handleInfo(mac, linkman, 'linkman')">{{ $t('btns.ok') }}</el-button>
                  <el-button size="mini" type="plain" @click="linkmanFlag = false">{{ $t('btns.cancel') }}</el-button>
                </div>
                <div slot="reference" @mouseover="linkmanIndex = mac" @mouseout="linkmanIndex = -1" class="pointer pRelative">
                  <div class="ellipsis" :title="info.linkman">
                    <span class="label" :class="$i18n.locale === 'zh' ? 'normal-label' : ''">{{ $t('table.contact') + '：' }}</span>
                    <span>{{ info.linkman !== undefined ? info.linkman : '' }}</span>
                  </div>
                  <i slot="reference" v-if="linkmanIndex === mac  || $func.checkDataType(linkman)" class="el-icon-edit pointer" :class="$i18n.locale === 'zh' ? 'normal-linkman' : 'unusual-linkman'"></i>
                </div>
            </el-popover>
          </el-col>
          <el-col :span="10">
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              :append-to-body="false"
              v-model="linkmanTelFlag"
              @hide="linkmanTelFlag = false; linkmanTel = info.linkmanTel">
                <el-input class="input" size="small" maxlength="20" show-word-limit v-model="linkmanTel" :placeholder="$t('table.pleaseEnter') + $t('table.contactNumber') + '1'"></el-input>
                <div style="text-align: right; margin: 5px 0 0">
                  <el-button type="primary" size="mini" @click="handleInfo(mac, linkmanTel, 'linkmanTel')">{{ $t('btns.ok') }}</el-button>
                  <el-button size="mini" type="plain" @click="linkmanTelFlag = false">{{ $t('btns.cancel') }}</el-button>
                </div>
                <div slot="reference" @mouseover="linkmanTelIndex = mac" @mouseout="linkmanTelIndex = -1" class="pointer pRelative">
                  <div class="ellipsis" :title="info.linkmanTel">
                    <span>{{ info.linkmanTel }}</span>
                  </div>
                  <i slot="reference" v-if="linkmanTelIndex === mac || $func.checkDataType(info.linkmanTel)" class="el-icon-edit pointer unit-icon"></i>
                </div>
            </el-popover>
          </el-col>
          <el-col class="mt-7" :span="14">
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              :append-to-body="false"
              v-model="linkman2Flag"
              @hide="linkman2Flag = false; linkman2 = info.linkman2">
                <el-input class="input" size="small" maxlength="20" show-word-limit v-model.trim="linkman2" :placeholder="$t('table.pleaseEnter') + $t('table.contact') + '2'"></el-input>
                <div style="text-align: right; margin: 5px 0 0">
                  <el-button type="primary" size="mini" @click="handleInfo(mac, linkman2, 'linkman2')">{{ $t('btns.ok') }}</el-button>
                  <el-button size="mini" type="plain" @click="linkman2Flag = false">{{ $t('btns.cancel') }}</el-button>
                </div>
                <div slot="reference" @mouseover="linkman2Index = mac" @mouseout="linkman2Index = -1" class="pointer pRelative">
                  <div class="ellipsis" style="margin-top: 0;" :title="info.linkman2">
                    <span class="label" style="color: transparent" :class="$i18n.locale === 'zh' ? 'normal-label' : ''">{{ $t('table.contact') + '：' }}</span>
                    <span>{{ info.linkman2 !== undefined ? info.linkman2 : '' }}</span>
                  </div>
                  <i slot="reference" v-if="linkman2Index === mac || $func.checkDataType(linkman2)" class="el-icon-edit pointer" :class="$i18n.locale === 'zh' ? 'normal-linkman' : 'unusual-linkman'"></i>
                </div>
            </el-popover>
          </el-col>
          <el-col class="mt-7" :span="10">
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              :append-to-body="false"
              v-model="linkmanTel2Flag"
              @hide="linkmanTel2Flag = false; linkmanTel2 = info.linkmanTel2">
                <el-input class="input" size="small" maxlength="20" show-word-limit v-model="linkmanTel2" :placeholder="$t('table.pleaseEnter') + $t('table.contactNumber') + '2'"></el-input>
                <div style="text-align: right; margin: 5px 0 0">
                  <el-button type="primary" size="mini" @click="handleInfo(mac, linkmanTel2, 'linkmanTel2')">{{ $t('btns.ok') }}</el-button>
                  <el-button size="mini" type="plain" @click="linkmanTel2Flag = false">{{ $t('btns.cancel') }}</el-button>
                </div>
                <div slot="reference" @mouseover="linkmanTel2Index = mac" @mouseout="linkmanTel2Index = -1" class="pointer pRelative">
                  <div class="ellipsis" style="margin-top: 0;" :title="info.linkmanTel2">
                    <span>{{ info.linkmanTel2 }}</span>
                  </div>
                  <i slot="reference" v-if="linkmanTel2Index === mac || $func.checkDataType(info.linkmanTel2)" class="el-icon-edit pointer unit-icon"></i>
                </div>
            </el-popover>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="8" class="upload-wrapper">
        <el-upload class="upload"
        v-if="flag"
        :action="uploadUrl"
        name="imgFile"
        :data="imgData"
        :show-file-list="false"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        @mouseover.native="flag = true"
        >
          <el-button size="mini">{{ $t('home.image') + $t('btns.upload') }}</el-button>
        </el-upload>
        <div class="demo-image__preview">
          <el-image
            fit="cover"
            @mouseover.native="flag = true"
            @mouseout.native="flag = false"
            style="width: 140px; height: 140px;border: 1px solid #485661"
            :src="url"
            :preview-src-list="srcList">
          </el-image>
        </div>
        <el-col v-if="others.imsi" class="ml-20">
            <div class="bottom" style="margin-top: 8px">
              <el-col>
                <el-popover
                  placement="bottom-start"
                  width="220"
                  trigger="hover">
                  <div>
                    <el-row>
                      <el-col :span="21">{{ 'IMSI' + ':' + '\xa0\xa0' }}<span>{{ others.imsi }}</span></el-col>
                      <el-col :span="3"><span class="ellipsis pointer default" @click="simRefresh">{{ $t('btns.refresh') }}</span></el-col>
                    </el-row>
                    <el-row class="mt-10">
                      <el-col :span="24">{{ 'ICCID' + ':' + '\xa0\xa0' }}<span v-if="others.iccid">{{ others.iccid }}</span></el-col>
                    </el-row>
                    <el-row class="mt-10">
                      <el-col :span="24">{{ $t('table.overdue') + $t('dialog.time') + ':' + '\xa0\xa0' }}<span v-if="others.expireDate">{{ others.expireDate }}</span></el-col>
                    </el-row>
                    <el-row class="mt-10">
                      <el-col :span="24">{{ $t('table.update') + $t('dialog.time') + ':' + '\xa0\xa0' }}<span v-if="others.simUpdateDate">{{ others.simUpdateDate }}</span></el-col>
                    </el-row>
                  </div>
                  <el-button class="SIMBtn" style="line-height: 100%" type="info" size="mini" slot="reference"><i class="iconfont icon-sim" style="margin-right: 8px;font-size:13px"></i>SIM{{ $t('table.information') }}</el-button>
                </el-popover>
             </el-col>
           </div>
          </el-col>
      </el-col>
      <el-col class="position mt-7" v-if="others.address" :span="24">
        <p class="ellipsis" :title="customDeviceAdress">{{ $t('table.position')  + '：' +customDeviceAdress}} <i class="el-icon-edit-outline" @click="openDeviceDialog"></i></p>

      </el-col>
    </el-row>
    <el-dialog  :visible.sync="dialogVisible"
      :modal="false"
      width="80vw"
        @closed="handleCloseMap"
      id="map-wraps"><div slot="title" >
         <span v-if="!searchFlag">{{
          $t('statistics.deviceAddress') + '：' + customDeviceAdress
        }}</span>
        <span v-if="searchFlag" id="suggest-wrap">
          <el-form ref="form" size="small" :model="form" :rules="rules" label-width="5px">
            <el-row>
              <el-col :span="$i18n.locale === 'zh' ? 2 : 3">
                <el-form-item>
                  {{ $t('statistics.deviceAddress') + '：' }}
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
              <el-col :span="24" style="margin:20px 0">
               <el-col :span="2" style="margin-left:125px">
                <el-form-item prop="build">
                  <el-input  v-model="form.build" maxlength="50"
                    :placeholder="$t('control.building')"></el-input>
                </el-form-item>
               </el-col>
               <el-col :span="2">
                <el-form-item prop="unit">
                  <el-input  v-model="form.unit"  maxlength="50"
                    :placeholder="$t('control.unit')"></el-input>
                </el-form-item>
               </el-col>
                <el-col :span="2" >
                <el-form-item prop="room" >
                  <el-input  v-model="form.room"  maxlength="50"
                    :placeholder="$t('control.room')"></el-input>
                </el-form-item>
               </el-col>
                 <el-col :span="2">
                <el-form-item>
                  <el-button
                    :disabled="form.longitude === '' || form.latitude === ''"
                    @click="saveDeviceAdress"
                    type="primary"
                    >{{ $t('btns.save') }}</el-button
                  >
                </el-form-item>
               </el-col>
              </el-col>
              <el-col class="auto-address" v-if="cfg.useMap === 'BAIDU'" style="margin-top:10px">
                <el-col :span="$i18n.locale === 'zh' ? 2 : 3" class="fs-14">{{
                  $t('statistics.map') +
                    ($i18n.locale === 'zh' ? '' : '\xa0') +
                    $t('btns.query') +
                    '：'
                }}</el-col>
                <el-autocomplete
                  v-model="form.address"
                  size="small"
                  style="margin-left:5px"
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
  </div>
</template>
<script>
/* global ctxPaths */
/* global config */
/* global BMap */
/* global google */
import { Map } from '../../map'
import mapStyleJson from '../../assets/js/custom_map_config.json'
import myIcon1 from '../../assets/image/nIcon.png'
import Custom from '../Common/Custom.vue'
import store from '@/store'
import { queryBoxDetails, checkMacOnlineStatus, macAlias, refreshSim, findBoxByMac, queryHomeMapInfo, getGblinfo } from '@/api/api'
export default {
  props: {
    mac: {
      type: String
    }
  },
  components: {
    Custom
  },
  data () {
    return {
      customDeviceAdress: '',
      customFlag: false,
      customDatas: [],
      rePoint: { lng: 0, lat: 0 },
      obj: null,
      rules: {
        build: [ { required: true, message: '请输入楼栋', trigger: 'blur' } ],
        room: [ { required: true, message: '请输入楼栋', trigger: 'blur' } ],
        unit: [ { required: true, message: '请输入楼栋', trigger: 'blur' } ]
      },
      cfg: config,
      form: {
        address: '',
        province: '',
        city: '',
        district: '',
        street: '',
        build: '',
        unit: '',
        room: '',
        longitude: '',
        latitude: ''
      },
      searchFlag: false,
      dialogVisible: false,
      info: [],
      others: {
        imsi: '',
        iccid: '',
        expireDate: '',
        simUpdateDate: ''
      },
      formInline: {},
      expireDay: '',
      url: '',
      srcList: [''],
      timerID: null,
      flag: false,
      uploadUrl: ctxPaths + '/box/icon/upload.as?v=' + new Date().getTime(),
      imgData: {
        name: 'imgFile',
        mac: ''
      },
      onlineStatus: '',
      onlineTime: '',
      input: '',
      aliasName: this.$store.state.aliasName,
      aliasFlag: false,
      aliasIndex: -1,
      linkman: '',
      linkmanFlag: false,
      linkmanIndex: -1,
      linkmanTel: '',
      linkmanTelFlag: false,
      linkmanTelIndex: -1,
      linkman2: '',
      linkman2Flag: false,
      linkman2Index: -1,
      linkmanTel2: '',
      linkmanTel2Flag: false,
      linkmanTel2Index: -1
    }
  },
  activated () {
    this.setTimer(this.queryStatus, config.pollingInterval.checkMacOnlineStatus * 1000)
  },
  deactivated () {
    clearTimeout(this.timerID)
  },
  mounted () {
    this.$nextTick(function () {
      this.init()
      this.setTimer(this.queryStatus, config.pollingInterval.checkMacOnlineStatus * 1000)
    })
  },
  methods: {
    init () {
      this.queryInfo()
      this.queryStatus()
      this.getGblinfos()
      this.getDeviceAdress()
    },
    queryInfo () {
      let params = {
        'mac': this.mac
      }
      queryBoxDetails(params)
        .then(res => {
          if (res.success) {
            this.info = res.data
            this.linkman = res.data.linkman
            this.linkmanTel = res.data.linkmanTel
            this.linkman2 = res.data.linkman2
            this.linkmanTel2 = res.data.linkmanTel2
            this.imgData.mac = res.data.mac
            this.aliasName = res.data.name
            // store.commit('aliasName', res.data.name)
            // store.commit('customAlarm', res.data.others.customAlarm)
            // store.commit('classifyLabel', res.data.others.classifyLabel)
            // store.commit('sortBUR', {build: res.data.build, unit: res.data.unit, room: res.data.room, linkman: res.data.linkman, linkman2: res.data.linkman2, linkmanTel: res.data.linkmanTel, linkmanTel2: res.data.linkmanTel2})
            this.others = {
              imsi: res.data.others.imsi,
              iccid: res.data.others.iccid,
              expireDate: res.data.others.expireDate,
              simUpdateDate: res.data.others.simUpdateDate,
              address: res.data.others.address,
              version: res.data.others.version,
              online: res.data.others.online
            }
            if (this.info.equipmentType === 1 || this.info.equipmentType === 19) {
              if (this.others.online === 1) {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/Airopen-online.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/Airopen-online.png']
              } else {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/Airopen-offline.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/Airopen-offline.png']
              }
            } else if (this.info.equipmentType === 2) {
              if (this.others.online === 1) {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/ElectricalFire-Online.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/ElectricalFire-Online.png']
              } else {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/ElectricalFire-Offline.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/ElectricalFire-Offline.png']
              }
            } else if (this.info.equipmentType === 3) {
              if (this.others.online === 1) {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/Stralsund-online.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/Stralsund-online.png']
              } else {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/Stralsund-offline.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/Stralsund-offline.png']
              }
            } else if (this.info.equipmentType === 4 || this.info.equipmentType === 5 || this.info.equipmentType === 18) {
              if (this.others.online === 1) {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/PressureLevel-online.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/PressureLevel-online.png']
              } else {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/PressureLevel-offline.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/PressureLevel-offline.png']
              }
            } else if (this.info.equipmentType === 6) {
              if (this.others.online === 1) {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/Smoke-online.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/Smoke-online.png']
              } else {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/Smoke-offline.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/Smoke-offline.png']
              }
            } else if (this.info.equipmentType === 7) {
              if (this.others.online === 1) {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/FlammableGas-online.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/FlammableGas-online.png']
              } else {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/FlammableGas-offline.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/FlammableGas-offline.png']
              }
            } else if (this.info.equipmentType === 8) {
              if (this.others.online === 1) {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/Airopen-online.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/Airopen-online.png']
              } else {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/FlammableGas-offline.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/FlammableGas-offline.png']
              }
            } else if (this.info.equipmentType === 10) {
              if (this.others.online === 1) {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/zac-online.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/zac-online.png']
              } else {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/zac-offline.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/zac-offline.png']
              }
            } else if (this.info.equipmentType === 11) {
              if (this.others.online === 1) {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/renke-wsd-online.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/renke-wsd-online.png']
              } else {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/renke-wsd-offline.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/renke-wsd-offline.png']
              }
            } else if (this.info.equipmentType === 12) {
              if (this.others.online === 1) {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/emeter-online.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/emeter-online.png']
              } else {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/emeter-offline.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/emeter-offline.png']
              }
            } else if (this.info.equipmentType === 13) {
              if (this.others.online === 1) {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/zac-gas-online.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/zac-gas-online.png']
              } else {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/zac-gas-offline.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/zac-gas-offline.png']
              }
            } else if (this.info.equipmentType === 14) {
              if (this.others.online === 1) {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/renke-gzd-online.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/renke-gzd-online.png']
              } else {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/zac-gas-offline.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/renke-gzd-offline.png']
              }
            } else if (this.info.equipmentType === 15) {
              if (this.others.online === 1) {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/common-water-online.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/common-water-online.png']
              } else {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/common-water-offline.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/common-water-offline.png']
              }
            } else if (this.info.equipmentType === 16) {
              if (this.others.online === 1) {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/chaobiaomao-water-online.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/chaobiaomao-water-online.png']
              } else {
                this.url = this.info.imgUrl ? this.info.imgUrl : '/static/images/chaobiaomao-water-offline.png'
                this.srcList = [this.info.imgUrl ? this.info.imgUrl : '/static/images/chaobiaomao-water-offline.png']
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
    },
    queryStatus () {
      let params = {
        'mac': this.mac
      }
      checkMacOnlineStatus(params)
        .then(res => {
          if (res.success) {
            this.onlineStatus = res.data.online
            this.onlineTime = res.data.onlineTime
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
    handleSelect (item) {
      this.form.address = item.address + item.title
      this.rePoint = item.point
      this.obj = item
    },
    handleCloseMap () {
      this.searchFlag = false
      this.customFlag = false
      // this.form.address = this.address
      this.getGblinfos()
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
            // this.longitude = res.DEF_PRJ_LOCATION.longitude
            // this.latitude = res.DEF_PRJ_LOCATION.latitude
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
            // this.form.province = res.DEF_PRJ_LOCATION.provinceName
            // this.form.city = res.DEF_PRJ_LOCATION.cityName
            // this.form.district = res.DEF_PRJ_LOCATION.countyName
            // this.form.street = res.DEF_PRJ_LOCATION.street
            // this.form.longitude = res.DEF_PRJ_LOCATION.longitude
            // this.form.latitude = res.DEF_PRJ_LOCATION.latitude
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
    getDeviceAdress () {
      let parmas = {
        mac: this.mac
      }
      findBoxByMac(parmas).then(res => {
        if (res.success) {
          // console.log(res, '======info设备地址')

          this.form.build = res.data.build
          this.form.room = res.data.room
          this.form.unit = res.data.unit
          this.form.province = res.data.provinceName
          this.form.city = res.data.cityName
          this.form.district = res.data.countyName
          this.form.street = res.data.street
          this.form.longitude = res.data.longitude
          this.form.latitude = res.data.latitude
          this.longitude = res.data.longitude
          this.latitude = res.data.latitude
          this.form.address = res.data.provinceName + res.data.cityName + res.data.countyName + res.data.street + res.data.build + res.data.unit + res.data.room
          this.customDeviceAdress = res.data.provinceName + res.data.cityName + res.data.countyName + res.data.street + res.data.build + res.data.unit + res.data.room
        } else if (res.code === '-1') {
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
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
    setTimer (fn, delay) {
      let _this = this
      function timer () {
        _this.timerID = setTimeout(function () {
          timer()
          fn()
        }, delay)
      }
      timer()
    },
    beforeUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message({
          message: this.$t('message.exceedSize'),
          type: 'error'
        })
      }
      return isLt1M
    },
    handleSuccess (res, file) {
      if (res.success) {
        this.queryInfo()
        this.queryStatus()
      } else if (res.code === '-1') {
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    handleInfo (mac, value, type) {
      let params = {
        mac: mac
      }
      if (type === 'linkmanTel' || type === 'linkmanTel2') {
        if (!this.$func.checkPhone(value)) {
          this.$message({
            message: this.$t('message.numberFormatError'),
            type: 'error'
          })
          return false
        }
      }
      if (type === 'alias') params.name = value
      if (type === 'linkman') params.linkman = value
      if (type === 'linkmanTel') params.linkmanTel = value
      if (type === 'linkman2') params.linkman2 = value
      if (type === 'linkmanTel2') params.linkmanTel2 = value
      macAlias(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: (type === 'alias' ? this.$t('dialog.deviceAlias') : '') + this.$t('message.successfulModified') + '！',
              type: 'success'
            })
            if (type === 'alias') {
              store.commit('aliasName', value)
              this.aliasFlag = false
            } else if (type === 'linkman') {
              this.info.linkman = value
              this.linkmanFlag = false
            } else if (type === 'linkmanTel') {
              this.info.linkmanTel = value
              this.linkmanTelFlag = false
            } else if (type === 'linkman2') {
              this.info.linkman2 = value
              this.linkman2Flag = false
            } else if (type === 'linkmanTel2') {
              this.info.linkmanTel2 = value
              this.linkmanTel2Flag = false
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
    simRefresh () {
      try {
        let params = {
          mac: this.mac,
          imsi: this.others.imsi ? this.others.imsi : ''
        }
        refreshSim(params)
          .then(res => {
            if (res.success) {
              if (res.data) {
                this.others = {
                  imsi: res.data.imsi,
                  iccid: res.data.iccid,
                  expireDate: res.data.expireDate,
                  simUpdateDate: res.data.simUpdateData
                }
                this.$message({
                  message: res.message,
                  type: 'success'
                })
              } else {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
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
      } catch (error) {
        this.$message({
          message: this.$t('btns.refresh') + this.$t('system.failure'),
          type: 'error'
        })
      }
    },
    openDeviceDialog () {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.renderMap()
      })
    },

    handleMapEdit () {
      this.searchFlag = true
      // this.form.address = this.others.address
    },
    saveDeviceAdress () {
      let params = {
        mac: this.mac,
        longitude: this.form.longitude ? this.form.longitude : '',
        latitude: this.form.latitude ? this.form.latitude : '',
        provinceName: this.form.province ? this.form.province : '',
        cityName: this.form.city ? this.form.city : '',
        countyName: this.form.district ? this.form.district : '',
        street: this.form.street ? this.form.street : '',
        build: this.form.build,
        unit: this.form.unit,
        room: this.form.room
      }
      if (!this.form.build || !this.form.unit || !this.form.room) {
        this.$message({
          message: '请输入必填项楼栋单元房号',
          type: 'error'
        })
        return false
      }
      macAlias(params).then(res => {
        if (res.success) {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.searchFlag = false
          this.init()
        } else if (res.code === '-1') {
        } else {
          this.$message({
            message: res.message,
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
        let bmap = new BMap.Map('map')
        this.bamp = bmap
        let point = new BMap.Point(this.longitude, this.latitude)
        let marker = new BMap.Marker(point, { enalbeDragging: true })
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
              // console.log(res, '===zheshismditu')
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
    }
  },
  destroyed () {
    clearTimeout(this.timerID)
  },
  watch: {
    '$route' (to, from) {
      if (from.path === '/ConfigurationList') this.queryInfo()
    }
  }
}
</script>
<style lang="stylus" scoped>
.info
  p
    margin 15px 0
  i
    outline none
.position
  p
    margin 0
.upload-wrapper
  position relative
#map
    width 100%
    height 500px
#map-wraps >>> .el-dialog
    background #474d59
#map-wraps >>> .el-dialog__headerbtn .el-dialog__close, #map-wraps >>> .el-dialog__title
    color #fffeff
#map-wraps >>> .el-form-item--small.el-form-item
  margin-bottom 0
.upload
  width 140px
  left 1px
  position absolute
  z-index 999
  text-align center
  >>> .el-upload
        width 100%
  .el-button
    width 100%
    background rgba(0, 0, 0, .3)
    border none
    color #fff
    font-weight 600
    font-size 14px
.ellipsis
  margin 15px 0
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
.pRelative
  position relative
  i
    position absolute
    top 1px
  .normal-icon
    left 63px
  .normal-linkman
    left 50px
  .unusual-icon
    left 85px
  .unusual-linkman
    left 57px
  .unit-icon
    left -12px
.SIMBtn
 background-color transparent
 border none
 border 1px solid #fffffc
.mt-7
 margin-top 7px
.default
  &:hover
    color #409EFF
.auto-address
  position absolute
  top 93px
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
</style>
