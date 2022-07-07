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
        <p class="ellipsis" :title="others.address">{{ $t('table.position')  + '：' + others.address }}</p>
      </el-col>
    </el-row>
  </div>
</template>
<script>
/* global ctxPaths */
/* global config */
import store from '@/store'
import { queryBoxDetails, checkMacOnlineStatus, macAlias, refreshSim } from '@/api/api'
export default {
  props: {
    mac: {
      type: String
    }
  },
  data () {
    return {
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
            store.commit('aliasName', res.data.name)
            store.commit('customAlarm', res.data.others.customAlarm)
            store.commit('classifyLabel', res.data.others.classifyLabel)
            store.commit('sortBUR', {build: res.data.build, unit: res.data.unit, room: res.data.room, linkman: res.data.linkman, linkman2: res.data.linkman2, linkmanTel: res.data.linkmanTel, linkmanTel2: res.data.linkmanTel2})
            this.others = {
              imsi: res.data.others.imsi,
              iccid: res.data.others.iccid,
              expireDate: res.data.others.expireDate,
              simUpdateDate: res.data.others.simUpdateDate,
              address: res.data.others.address,
              version: res.data.others.version,
              online: res.data.others.online
            }
            if (this.info.equipmentType === 1) {
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
            } else if (this.info.equipmentType === 4 || this.info.equipmentType === 5) {
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
</style>
