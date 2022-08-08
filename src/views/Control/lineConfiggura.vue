<template>
  <div id="line-details">
    <el-col class="mt-20">
      <el-divider class="el-divider" content-position="right">
        {{
          details.acqTime !== undefined
            ? details.acqTime
            : $func.getNowFormatDateTime()
        }}
      </el-divider>
    </el-col>
    <el-form
      :inline="true"
      size="small"
      :model="formInline"
      class="form-inline mt-5"
    >
      <el-form-item :label="$t('dialog.lineChoose') + '：'">
        <el-select v-model="formInline.line" @change="handleLine">
          <el-option
            v-for="(item, index) in lines"
            :key="index"
            :label="item.title"
            :value="item.addr"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="!configuruation">
        <div style="display:flex">
          <div class="radius-box"></div>
          <span style="color:#CB3325">808 TC</span>
          <span style="margin-left:15px;" @click="editNameUnit"
            ><i class="el-icon-edit pointer"></i
          ></span></div
      ></el-form-item>
      <el-form-item v-if="configuruation">
        {{ $t('table.status') + '：' }}
        <span
          v-if="param.equipmentType === 1 && details.oc !== undefined"
          :class="details.oc ? 'c-success' : 'c-danger'"
          >{{
            details.oc ? $t('table.beenClosed') : $t('table.beenOpend')
          }}</span
        >
      </el-form-item>
      <el-form-item v-if="configuruation">
        <el-popover
          placement="bottom"
          :width="
            $i18n.locale === 'zh'
              ? param.equipmentType === 1
                ? 300
                : 200
              : param.equipmentType === 1
              ? 450
              : 260
          "
          trigger="click"
        >
          <div v-if="param.equipmentType === 1 || param.equipmentType == 19">
            <el-row>
              <el-col :span="15">{{ $t('message.refreshStatus') }}</el-col>
              <el-col :span="9">
                <span
                  class="pointer hoverBtn"
                  style="margin-left: 1px;"
                  @click="queryChannel('refresh')"
                  ><i class="custom-icon icon-query"></i
                  >{{ $t('btns.refresh') }}</span
                >
              </el-col>
            </el-row>
            <el-row class="mt-15">
              <el-col :span="15">{{
                $t('message.currentIs') +
                  (details.oc ? $t('table.closing') : $t('table.opening'))
              }}</el-col>
              <el-col :span="9">
                <span
                  class="custom-button hoverBtn pointer"
                  style="margin-left: 1px;"
                  :class="details.oc ? 'allowed' : ''"
                  @click="handleBrake(true)"
                  ><i class="custom-icon icon-close"></i
                  >{{ $t('table.closing') }}</span
                >
                <span
                  class="custom-button hoverBtn pointer"
                  :class="details.oc ? '' : 'allowed'"
                  @click="handleBrake(false)"
                  ><i class="custom-icon icon-open"></i
                  >{{ $t('table.opening') }}</span
                >
              </el-col>
            </el-row>
            <el-row
              class="mt-15"
              style="margin-bottom: 14px;"
              v-if="details.localLockEnable && details.localLock"
            >
              <el-col :span="15">{{ $t('message.lockedLocally') }}</el-col>
              <el-col :span="9" class="not-allowed"
                ><span
                  class="custom-button not-allowed"
                  style="margin-left: 1px;"
                  ><i
                    class="iconfont icon-jinzhi"
                    style="font-weight: 600;"
                  ></i></span
              ></el-col>
            </el-row>
            <el-row
              style="margin-top: 2px"
              v-if="details.abnormalUnlockEnable && !details.enableNetCtrl && param.equipmentType !== 19"
            >
              <el-col :span="15">{{ $t('message.abnormalLocked') }}</el-col>
              <el-col :span="9">
                <template v-if="abnormal ===true">
                         <span
                  class="custom-button hoverBtn pointer"
                  @click="handleUnlock"
                  ><i
                    class="iconfont el-icon-unlock"
                    style="font-weight: 600;"
                  ></i
                  >{{ $t('table.unlock') }}</span
                >
                </template>
                <template v-if="abnormal ===false">
                         <span
                  class="custom-button hoverBtn not-allowed"
                  @click="handleJurisdiction"
                  ><i
                    class="iconfont el-icon-unlock not-allowed"
                    style="font-weight: 600;"
                  ></i
                  >{{ $t('table.unlock') }}</span
                >
                </template>
              </el-col>
            </el-row>
            <!--下个版本放开
               <el-row v-if="param.equipmentType === 19">
            <el-col :span="15">{{$t('message.remoteVoice')}}</el-col>
            <el-col :span="9">
             <span
                  class="custom-button hoverBtn"
                  @click="getCancelVoice"
                  >
                  {{ $t('table.cancelVoice') }}</span
                >
            </el-col>
           </el-row> -->
            <el-row class="mt-15" v-if="details.remoteLockAndUnlockEnable && param.equipmentType !== 19">
              <el-col :span="15">{{
                details.remoteLock
                  ? $t('message.remotelyLocked')
                  : $t('message.notRemotelyLocked')
              }}</el-col>
              <el-col :span="9">
                <template v-if="remote === true">
                    <span class="custom-button hoverBtn pointer" :class="details.remoteLock ? 'allowed' : ''" @click="handleLocking('true')"><i class="iconfont el-icon-lock"  style="font-weight: 600;"></i>{{ $t('table.locking') }}</span>
                    <span class="custom-button hoverBtn pointer" :class="details.remoteLock ? '' : 'allowed'" @click="handleLocking('false')"><i class="iconfont el-icon-unlock"  style="font-weight: 600;"></i>{{ $t('table.unlock') }}</span>
                </template>
                 <template v-if="remote === false">
                    <span class="custom-button hoverBtn not-allowed"  @click="handleJurisdiction"><i class="iconfont el-icon-lock not-allowed"  style="font-weight: 600;"></i>{{ $t('table.locking') }}</span>
                    <span class="custom-button hoverBtn not-allowed"  @click="handleJurisdiction"><i class="iconfont el-icon-unlock not-allowed"  style="font-weight: 600;"></i>{{ $t('table.unlock') }}</span>
                  </template>
              </el-col>
            </el-row>

          </div>
          <div class="tc" v-else>
            {{ $t('control.nothing') }}
          </div>
          <el-button
            circle
            size="mini"
            :title="$t('table.operating')"
            slot="reference"
            class="btn"
            icon="iconfont icon-shoudong"
          ></el-button>
        </el-popover>
        <el-button
          circle
          size="mini"
          :title="$t('table.configuration')"
          class="btn"
          @click="handleConfigurationList(param, formInline.line)"
          icon="iconfont icon-weixiubanshou"
        ></el-button>
        <el-button
          circle
          size="mini"
          :title="$t('table.instruction') + $t('table.history')"
          class="btn"
          @click="handleInstructions"
          style="margin-left: 0;font-size: 16px"
          icon="iconfont icon-qianshou"
        ></el-button>
      </el-form-item>
    </el-form>
    <div
      class="details-wrap"
      @dblclick="handleLineList"
      v-if="configuruation && param.equipmentType !== 8"
    >
      <el-row>
        <el-col :span="8">{{
          typeof details.ba === 'undefined' && typeof details.ca === 'undefined'
            ? $t('main.ampere') +
              '：' +
              (typeof details.aa !== 'undefined' ? details.aa + 'A' : '')
            : 'A' +
              $t('control.phase') +
              $t('main.ampere') +
              '：' +
              (typeof details.aa !== 'undefined' ? details.aa + 'A' : '')
        }}</el-col>
        <el-col
          :span="8"
          v-show="
            Object.prototype.toString.call(details.ba) !== '[object Undefined]'
          "
          >{{
            'B' +
              $t('control.phase') +
              $t('main.ampere') +
              '：' +
              (typeof details.ba !== 'undefined' ? details.ba + 'A' : '')
          }}</el-col
        >
        <el-col
          :span="8"
          v-show="
            Object.prototype.toString.call(details.ca) !== '[object Undefined]'
          "
          >{{
            'C' +
              $t('control.phase') +
              $t('main.ampere') +
              '：' +
              (typeof details.ca !== 'undefined' ? details.ca + 'A' : '')
          }}</el-col
        >
      </el-row>
      <el-row>
        <el-col :span="8">{{
          typeof details.bv === 'undefined' && typeof details.cv === 'undefined'
            ? $t('main.volt') +
              '：' +
              (typeof details.av !== 'undefined' ? details.av + 'V' : '')
            : 'A' +
              $t('control.phase') +
              $t('main.volt') +
              '：' +
              (typeof details.av !== 'undefined' ? details.av + 'V' : '')
        }}</el-col>
        <el-col
          :span="8"
          v-show="
            Object.prototype.toString.call(details.bv) !== '[object Undefined]'
          "
          >{{
            'B' +
              $t('control.phase') +
              $t('main.volt') +
              '：' +
              (typeof details.bv !== 'undefined' ? details.bv + 'V' : '')
          }}</el-col
        >
        <el-col
          :span="8"
          v-show="
            Object.prototype.toString.call(details.cv) !== '[object Undefined]'
          "
          >{{
            'C' +
              $t('control.phase') +
              $t('main.volt') +
              '：' +
              (typeof details.cv !== 'undefined' ? details.cv + 'V' : '')
          }}</el-col
        >
      </el-row>
      <el-row>
        <el-col :span="8"
          >{{
            typeof details.bt === 'undefined' &&
            typeof details.ct === 'undefined'
              ? $t('menu.temperature') +
                '：' +
                (typeof details.asd !== 'undefined'
                  ? details.asd > -38
                    ? details.asd + '℃'
                    : ''
                  : '')
              : 'A' +
                $t('control.phase') +
                $t('menu.temperature') +
                '：' +
                (typeof details.asd !== 'undefined'
                  ? details.asd > -38
                    ? details.asd + '℃'
                    : ''
                  : '')
          }}<i
            class="iconfont icon-jieruguanli"
            :title="$t('table.missedProbe')"
            v-show="details.asd < -38"
          ></i
        ></el-col>
        <el-col
          :span="8"
          v-show="
            Object.prototype.toString.call(details.bt) !== '[object Undefined]'
          "
          >{{
            'B' +
              $t('control.phase') +
              $t('menu.temperature') +
              '：' +
              (typeof details.bt !== 'undefined'
                ? details.bt > -38
                  ? details.bt + '℃'
                  : ''
                : '')
          }}<i
            class="iconfont icon-jieruguanli"
            :title="$t('table.missedProbe')"
            v-show="details.bt < -38"
          ></i
        ></el-col>
        <el-col
          :span="8"
          v-show="
            Object.prototype.toString.call(details.ct) !== '[object Undefined]'
          "
          >{{
            'C' +
              $t('control.phase') +
              $t('menu.temperature') +
              '：' +
              (typeof details.ct !== 'undefined'
                ? details.ct > -38
                  ? details.ct + '℃'
                  : ''
                : '')
          }}<i
            class="iconfont icon-jieruguanli"
            :title="$t('table.missedProbe')"
            v-show="details.ct < -38"
          ></i
        ></el-col>
      </el-row>
      <el-row v-if="details.groundFlag === 1">
        <el-col :span="8"
          >{{
            $t('control.zeroLine') +
              $t('menu.temperature') +
              '：' +
              (typeof details.nt !== 'undefined'
                ? details.nt > -38
                  ? details.nt + '℃'
                  : ''
                : '')
          }}<i
            class="iconfont icon-jieruguanli"
            :title="$t('table.missedProbe')"
            v-show="details.nt < -38"
          ></i
        ></el-col>
        <el-col :span="8">{{
          $t('control.zeroLine') +
            $t('main.ampere') +
            '：' +
            (typeof details.na !== 'undefined' ? details.na + 'A' : '0A')
        }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8">{{
          $t('main.totalPower') +
            '：' +
            (typeof details.gwp !== 'undefined' ? details.gwp + 'W' : '')
        }}</el-col>
        <el-col :span="8">{{
          $t('system.remaining') +
            $t('main.ampere') +
            '：' +
            (typeof details.gld !== 'undefined' ? details.gld + 'mA' : '')
        }}</el-col>
      </el-row>
    </div>
    <div v-if="!configuruation">
      <el-col :span="10">
        <el-col :span="12"  style="margin-top:10px;line-height:45px">
          <div
            v-for="(item, index) in pushList"
            :key="index"
            style="margin-top:20px;"
          >
            <span>{{ item.name }}:</span
            ><span :class="item.value === 0 ? 'reds' : 'greens'">{{
              item.value === 0 ? 'OFF' : 'ON'
            }}</span>
          </div>
        </el-col>
        <el-col :span="12" style="margin-top:10px;line-height:45px">
          <div
            v-for="(item, index) in outputList"
            :key="index"
            style="margin-top:20px"
          >
            <span style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden">{{ item.name }}:</span>
            <span :class="item.value === 0 ? 'reds' : 'greens'">{{
              item.value === 0 ? 'OFF' : 'ON'
            }}</span>
          </div>
        </el-col>
      </el-col>
      <el-col :span="14">
        <div v-for="(item, index) in AnalogList" :key="index">
          <el-col :span="9" style="margin-top:40px; text-overflow:ellipsis;white-space:nowrap;overflow:hidden">{{ item.name }}:</el-col>
          <el-col :span="12">
            <el-row class="analogList-bac" style="margin-top:20px;">
              <el-col >
                <span>采集值：{{ item.value +item.unit}} </span></el-col
              >
            </el-row>
            <el-row class="analogList-bac">
              <el-col
                ><span>显示值：{{ item.convertValue  +  item.convertUnit }} </span></el-col
              >
            </el-row>
          </el-col>
        </div>
      </el-col>
    </div>
    <el-dialog
      title="设置数据名称/单位换算"
      :close-on-click-modal="false"
      :modal="false"
      :visible.sync="editNameUnitFlag"
      custom-class="details-dialog"
      v-if="editNameUnitFlag"
    >
      <h3 style="margin-bottom:-5px;padding-top:10px">名称修改</h3>
      <el-row>
        <el-col :span="8">
          <el-row
            v-for="(item, index) in digitalInsList"
            :key="index"
            style="margin:20px 0px"
          >
            <el-col :span="5">输入量{{ index + 1 }}:</el-col>
            <el-col :span="12"
              ><el-input
                v-model="item.name"
                size="mini"
                style="width:150px"
                :placeholder="$t('placeholder.content')"
              ></el-input
            ></el-col>
          </el-row>
        </el-col>
        <el-col :span="8">
          <el-row
            v-for="(item, index) in digitalOutsList"
            :key="index"
            style="margin:20px 0px"
          >
            <el-col :span="5">输出量{{ index + 1 }}:</el-col>
            <el-col :span="12"
              ><el-input
                v-model="item.name"
                size="mini"
                style="width:150px"
                :placeholder="$t('placeholder.content')"
              ></el-input
            ></el-col> </el-row
        ></el-col>
        <el-col :span="8">
          <el-row
            v-for="(item, index) in analoginsList"
            :key="`analogInsList-${index}`"
            style="margin:20px 0px"
          >
            <el-col :span="5">模拟输入量{{ index + 1 }}:</el-col>
            <el-col :span="12"
              ><el-input
                v-model="item.name"
                size="mini"
                style="width:150px"
                :placeholder="$t('placeholder.content')"
              ></el-input
            ></el-col>
          </el-row>
        </el-col>
      </el-row>
      <h3>单位换算</h3>
      <el-row
        v-for="(item, index) in analoginsList"
        :key="`analogIns-${index}`"
      >
        <el-col :span="24">
          <el-row style="margin-top:5px">

            <el-col :span="10"
              >   <span style="color: #999999;" > 模拟输入量{{ index + 1 }}:</span>   <span>显示值 = </span
              ><span style="margin-left:10px"
                ><el-input
                  v-model="item.factorX"
                  type="number"
                  oninput ="value =value.replace(^[0-9]+(.[0-9]{1,3})?$,'')"
                  size="mini"
                  style="width:100px"
                  placeholder="修正系数"
                ></el-input></span
              ><span style="margin-left:10px">*采集值 +</span>
              <span style="margin-left:10px"
                ><el-input
                  v-model="item.factorY"
                  size="mini"
                  type="number"
                  oninput ="value =value.replace(^[0-9]+(.[0-9]{2})?$,'')"
                  style="width:100px"
                  placeholder="修正参数"
                ></el-input
              ></span>
            </el-col>
            <el-col :span="8"
              >显示值单位
              <span
                ><el-input
                  v-model="item.convertUnit"
                  size="mini"
                  style="width:100px"
                  placeholder="请输入"
                ></el-input
              ></span>
                 <span  style="margin-left:30px">采集值单位<el-input
                  v-model="item.unit"
                  size="mini"
                  style="width:100px;"
                  placeholder="请输入"
                ></el-input
              ></span>
               </el-col
          ></el-row>
        </el-col>
      </el-row>
      <el-row style="margin:10px 0" type="flex" justify="end">
        <el-col :span="3"
          ><el-button size="mini" @click="editNameUnitFlag = false">{{
            $t('btns.cancel')
          }}</el-button>
          <el-button size="mini" type="primary" @click="addEditNameUnits">{{
            $t('btns.ok')
          }}</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      :title="
        $t('table.instruction') + $t('table.history') + $t('control.recording')
      "
      :close-on-click-modal="false"
      :modal="false"
      v-if="instructionsFlag"
      :visible.sync="instructionsFlag"
      custom-class="custom-select-dialog"
      width="1323px"
    >
      <CommandFeedback
        class="mt-10"
        :classFlag="true"
        :instructionsData="param"
        :operateAt="1"
      ></CommandFeedback>
    </el-dialog>
    <el-dialog
      :title="$t('dialog.equipmentParameterAdjustment')"
      :close-on-click-modal="false"
      custom-class="details-dialog"
      :modal="false"
      width="1323px"
      lock-scroll="false"
      :visible.sync="equipmentFlag"
      :before-close="handleEquipmentClose"
    >
      <el-scrollbar style="height: 100%;">
        <ConfigurationList
          v-if="equipmentFlag"
          :param="param"
        ></ConfigurationList>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
/* global config */
import store from '@/store'
import ConfigurationList from './ConfigurationList'
import CommandFeedback from '../Common/CommandFeedback'
import {
  getEffectAddr,
  verifyAuthCode,
  queryChannelDetailsByBoxAndAddr,
  modifyBoxsChnlClearAlarm,
  modifyBoxsChnlRemoteMute,
  winextloraQueryChannelDetails,
  remotectrl,
  winextloraCmd,
  abnormalSwitchUnlock,
  remoteSwitchLock,
  getChannelInOutConfig,
  setChannelInOutConfig,
  queryPageAuth
} from '@/api/api'
export default {
  props: {
    param: {
      type: Object
    }
  },
  data () {
    return {
      formInline: {
        line: ''
      },
      config: config,
      lines: [],
      details: [],
      equipmentFlag: false,
      value: true,
      group: false,
      timerID: null,
      iccid: this.$store.state.iccid,
      instructionsFlag: false,
      configuruation: true,
      pushList: [],
      outputList: [],
      AnalogList: [],
      editNameUnitFlag: false,
      digitalInNum: '',
      digitalInsList: [],
      digitalOutsList: [],
      digitalOutNum: '',
      analoginsList: [],
      analogInNum: '',
      remote: false,
      abnormal: false
    }
  },
  created () {
    this.init()
  },
  activated () {
    this.setTimer(
      this.queryChannel,
      config.pollingInterval.queryChannelDetailsByBoxAndAddr * 1000
    )
  },
  deactivated () {
    clearTimeout(this.timerID)
  },
  methods: {
    init () {
      this.handleQueryPageAuth()
      this.getAddrs()
    },
    getAddrs () {
      let params = {
        mac: this.param.mac
      }
      getEffectAddr(params)
        .then(res => {
          if (res.success) {
            // console.log(res, '====res')
            this.lines = res.datas
            if (res.datas.length === 0) {
              store.commit('detailsAddr', '')
              return false
            }
            this.formInline.line = res.datas[0].addr
            store.commit('detailsAddr', this.formInline.line)
            this.queryChannel()
            this.setTimer(
              this.queryChannel,
              config.pollingInterval.queryChannelDetailsByBoxAndAddr * 1000
            )
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
    editNameUnit () {
      let params = {
        mac: this.param.mac,
        addr: this.formInline.line
      }
      getChannelInOutConfig(params).then(res => {
        if (res.success) {
          this.digitalInNum = res.data.digitalInNum
          this.digitalOutNum = res.data.digitalOutNum
          this.analogInNum = res.data.analogInNum
          // 输入量
          if (
            res.data.digitalIns &&
            this.digitalInNum <= res.data.digitalIns.length
          ) {
            this.digitalInsList = res.data.digitalIns.filter(
              (item, index) => index + 1 <= this.digitalInNum
            )
          } else {
            let newDigitalInsList = res.data.digitalIns
              ? res.data.digitalIns
              : []
            for (let i = 0; i < this.digitalInNum; i++) {
              if (i > newDigitalInsList.length - 1) {
                newDigitalInsList[i] = { name: '' }
              }
            }
            this.digitalInsList = newDigitalInsList
          }
          // 输出量
          if (
            res.data.digitalOuts &&
            this.digitalOutNum <= res.data.digitalOuts.length
          ) {
            this.digitalOutsList = res.data.digitalOuts.filter(
              (item, index) => index + 1 <= this.digitalOutNum
            )
          } else {
            let newDigitalOutsList = res.data.digitalOuts
              ? res.data.digitalOuts
              : []
            for (let i = 0; i < this.digitalOutNum; i++) {
              if (i > newDigitalOutsList.length - 1) {
                newDigitalOutsList[i] = { name: '' }
              }
            }
            this.digitalOutsList = newDigitalOutsList
          }
          // 模拟输入量
          if (
            res.data.analogIns &&
            this.analogInNum <= res.data.analogIns.length
          ) {
            this.analoginsList = res.data.analogIns.filter(
              (item, index) => index + 1 <= this.analogInNum
            )
          } else {
            let newAnaloginsList = res.data.analogIns ? res.data.analogIns : []
            for (let i = 0; i < this.analogInNum; i++) {
              if (i > newAnaloginsList.length - 1) {
                newAnaloginsList[i] = {
                  name: '',
                  factorX: 1,
                  convertUnit: '',
                  unit: '',
                  factorY: 0
                }
              }
            }
            this.analoginsList = newAnaloginsList
          }
          this.editNameUnitFlag = true
        }
      })
      // this.editNameUnitFlag = true
    },
    getCancelVoice () {
      let params = {
        cmd: 'REMOTE_MUTE',
        macs: this.param.mac,
        nodeNo: this.formInline.line
      }
      modifyBoxsChnlRemoteMute(params).then(res => {
        if (res.success) {
          this.$message({
            message: res.message,
            type: 'success'
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
    queryChannel (val) {
      let params = {
        mac: this.param.mac,
        addrs: this.formInline.line
      }
      let param = {
        mac: this.param.mac,
        addr: this.formInline.line
      }
      store.commit('detailsAddr', this.formInline.line)
      if (this.param.equipmentType === 8) {
        winextloraQueryChannelDetails(param)
          .then(res => {
            if (res.success) {
              if (res.data.length > 0) this.details = res.data[0]
              if (typeof this.details.at !== 'undefined') {
                this.details.asd = this.details.at
              }
              store.commit('dateFlag', false)
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
      } else {
        queryChannelDetailsByBoxAndAddr(params)
          .then(res => {
            if (res.success) {
              //  console.log(res, '====res')
              if (res.data.length <= 0) {
                return false
              }
              if (res.data[0].lineType && res.data[0].lineType === 'IO') {
                // console.log(res)
                // console.log(11111111111)
                this.AnalogList = res.data[0].analogIns && res.data[0].analogIns.length > 0 ? res.data[0].analogIns : []
                this.pushList = res.data[0].digitalIns && res.data[0].digitalIns.length > 0 ? res.data[0].digitalIns : []
                this.outputList = res.data[0].digitalOuts && res.data[0].digitalOuts.length > 0 ? res.data[0].digitalOuts : []
                this.configuruation = false
                store.commit('lineType', 'IO')
                let lineType = 'IO'
                //  console.log(this.$store.state.lineType, '====this.$store.state.lineType')
                // console.log(this.AnalogList)
                this.$emit(
                  'updateData',
                  this.AnalogList.length > 0 ? this.AnalogList[0].name : '',
                  this.AnalogList.length > 0 ? this.AnalogList[1].name : '',
                  this.AnalogList.length > 0 ? this.AnalogList[2].name : '',
                  this.AnalogList.length > 0 ? this.AnalogList[3].name : '',
                  lineType
                )
              } else {
                if (res.data.length > 0) this.details = res.data[0]
                if (typeof this.details.at !== 'undefined') {
                  this.details.asd = this.details.at
                }
                this.configuruation = true
                store.commit('dateFlag', false)
                // store.commit('Tcequipment', '剩余电流毫安(mA)')
                this.$emit('updateData', '剩余电流(mA)', '温度℃', '电压(V)', '电流(A)')
                if (val === 'refresh') {
                  this.$message({
                    message:
                      this.$t('btns.refresh') + this.$t('system.success'),
                    type: 'success'
                  })
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
    handleLine (val) {
      // console.log(val, '======val')
      this.queryChannel()
    },
    handleLineList () {
      this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.handleDblLineList(
        this.param
      )
    },
    handleBrake (type) {
      if (this.config.authority.CTL_AUTHORITY === 'false') {
        this.$func.controlAuthority(this.config.authority.CTL_AUTHORITY)
        return false
      }
      if (this.lines.length === 0) return false
      // let title
      // this.lines.forEach((item, index) => {
      //   if (item.addr === this.formInline.line) title = item.title
      // })
      if (this.param.equipmentType === 8) {
        this.$confirm(
          this.$t('message.confirmYouWant') +
            (type ? this.$t('table.closing') : this.$t('table.opening')) +
            '?',
          this.$t('dialog.prompt'),
          {
            confirmButtonText: this.$t('btns.ok'),
            cancelButtonText: this.$t('btns.cancel'),
            type: 'warning'
          }
        )
          .then(() => {
            if (this.config.authority.CTL_REQ_AUTHCODE === 'true') {
              this.$prompt(
                this.$t('message.enterAuthCode'),
                this.$t('dialog.prompt'),
                {
                  confirmButtonText: this.$t('btns.ok'),
                  cancelButtonText: this.$t('btns.cancel'),
                  inputPattern: /^[0-9a-zA-Z]{4,16}$/,
                  inputErrorMessage: this.$t('message.authCodeRule')
                }
              )
                .then(({ value }) => {
                  let params = {
                    authCode: value
                  }
                  verifyAuthCode(params)
                    .then(res => {
                      if (res.success) {
                        if (res.data === true) {
                          let param = {
                            cmd: 'WINEXT_LORA_SWITCH_OPEN',
                            mac: this.param.mac,
                            addr: this.formInline.line
                          }
                          winextloraCmd(param)
                            .then(res => {
                              if (res.success) {
                                if (res.code === '0') {
                                  this.$message({
                                    type: 'success',
                                    message: this.$t('message.controlSuccess')
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
                        } else {
                          this.$message({
                            message: this.$t('message.authCodeInvalid'),
                            type: 'error'
                          })
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
                      return false
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
                    message: this.$t('message.cancelInput')
                  })
                })
            } else {
              let _param = {
                cmd: 'WINEXT_LORA_SWITCH_CLOSE',
                mac: this.param.mac,
                addr: this.formInline.line
              }
              winextloraCmd(_param)
                .then(res => {
                  if (res.success) {
                    if (res.code === '0') {
                      this.$message({
                        type: 'success',
                        message: this.$t('message.controlSuccess')
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
            }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('message.cancelled')
            })
          })
      } else {
        this.switcherCtlEvent(this.param.mac, this.formInline.line, type)
      }
    },
    switcherCtlEvent (mac, addr, opr, lineList) {
      this.$confirm(
        this.$t('message.confirmYouWant') +
          (opr ? this.$t('table.closing') : this.$t('table.opening')) +
          '?',
        this.$t('dialog.prompt'),
        {
          confirmButtonText: this.$t('btns.ok'),
          cancelButtonText: this.$t('btns.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          if (this.config.authority.CTL_REQ_AUTHCODE === 'true') {
            this.$prompt(
              this.$t('message.enterAuthCode'),
              this.$t('dialog.prompt'),
              {
                confirmButtonText: this.$t('btns.ok'),
                cancelButtonText: this.$t('btns.cancel'),
                inputPattern: /^[0-9a-zA-Z]{4,16}$/,
                inputErrorMessage: this.$t('message.authCodeRule')
              }
            )
              .then(({ value }) => {
                let params = {
                  authCode: value
                }
                verifyAuthCode(params)
                  .then(res => {
                    if (res.success) {
                      if (res.data === true) {
                        let param = {
                          cmd: 'OCSWITCH',
                          mac: mac,
                          value1: opr ? 'open' : 'close',
                          value2: addr,
                          _operate_at: lineList ? '2' : '1'
                        }
                        remotectrl(param)
                          .then(res => {
                            if (res.success) {
                              if (res.code === '0') {
                                this.$message({
                                  type: 'success',
                                  message: this.$t('message.controlSuccess')
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
                      } else {
                        this.$message({
                          message: this.$t('message.authCodeInvalid'),
                          type: 'error'
                        })
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
                    return false
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
                  message: this.$t('message.cancelInput')
                })
              })
          } else {
            let _param = {
              cmd: 'OCSWITCH',
              mac: mac,
              value1: opr ? 'open' : 'close',
              value2: addr,
              _operate_at: lineList ? '2' : '1'
            }
            remotectrl(_param)
              .then(res => {
                if (res.success) {
                  if (res.code === '0') {
                    this.$message({
                      type: 'success',
                      message: this.$t('message.controlSuccess')
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
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('message.cancelled')
          })
        })
    },
    handleUnlock () {
      if (this.config.authority.CTL_AUTHORITY === 'false') {
        this.$func.controlAuthority(this.config.authority.CTL_AUTHORITY)
        return false
      }
      if (this.lines.length === 0 || this.details.localLock) return false
      if (!this.details.enableNetCtrl && this.details.localLock) {
        this.$message({
          message: this.$t('message.lockDevice'),
          type: 'error'
        })
        return
      }
      this.$confirm(this.$t('message.promptUnlock'), this.$t('dialog.prompt'), {
        confirmButtonText: this.$t('btns.ok'),
        cancelButtonText: this.$t('btns.cancel'),
        type: 'warning'
      })
        .then(() => {
          let params = {
            cmd: 'ABNORMAL_SWITCH_UNLOCK',
            mac: this.param.mac,
            addr: this.formInline.line
          }
          abnormalSwitchUnlock(params)
            .then(res => {
              if (res.success) {
                if (res.code === '0') {
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
        })
        .catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.cancelled'),
              type: 'info'
            })
          }
        })
    },
    handleLocking (val) {
      if (this.config.authority.CTL_AUTHORITY === 'false') {
        this.$func.controlAuthority(this.config.authority.CTL_AUTHORITY)
        return false
      }
      if (this.lines.length === 0) return false
      let params = {
        cmd: 'REMOTE_SWITCH_LOCK',
        mac: this.param.mac,
        addr: this.formInline.line,
        lockStatus: val
      }
      if (val === 'false') {
        this.$confirm(
          this.$t('message.remoteUnlock'),
          this.$t('dialog.prompt'),
          {
            confirmButtonText: this.$t('btns.ok'),
            cancelButtonText: this.$t('btns.cancel'),
            type: 'warning'
          }
        )
          .then(() => {
            this.remoteSwitchLock(params)
          })
          .catch(err => {
            if (err) {
              this.$message({
                message: this.$t('message.cancelled'),
                type: 'info'
              })
            }
          })
      } else {
        this.remoteSwitchLock(params)
      }
    },
    remoteSwitchLock (params) {
      remoteSwitchLock(params)
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
    handleControl (mac, cmd, addr) {
      this.$confirm(
        this.$t('message.confirmYouWant') +
          (cmd === 'REMOTE_MUTE'
            ? this.$t('control.mute')
            : this.$t('control.clearAlarm')) +
          '?',
        this.$t('dialog.prompt'),
        {
          confirmButtonText: this.$t('btns.ok'),
          cancelButtonText: this.$t('btns.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          if (this.config.authority.CTL_REQ_AUTHCODE === 'true') {
            this.$prompt(
              this.$t('message.enterAuthCode'),
              this.$t('dialog.prompt'),
              {
                confirmButtonText: this.$t('btns.ok'),
                cancelButtonText: this.$t('btns.cancel'),
                inputPattern: /^[0-9a-zA-Z]{4,16}$/,
                inputErrorMessage: this.$t('message.authCodeRule')
              }
            )
              .then(({ value }) => {
                let params = {
                  authCode: value
                }
                verifyAuthCode(params)
                  .then(res => {
                    if (res.success) {
                      if (res.data === true) {
                        let params = {
                          macs: mac,
                          cmd: cmd,
                          nodeNo: addr
                        }
                        if (cmd === 'CLEAR_ALARM') {
                          modifyBoxsChnlClearAlarm(params)
                            .then(res => {
                              if (res.success) {
                                this.$message({
                                  type: 'success',
                                  message: this.$t('message.controlSuccess')
                                })
                              } else if (res.code === '-1') {
                              } else {
                                this.$message({
                                  message: res.data[0].errorMsg,
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
                        } else if (cmd === 'REMOTE_MUTE') {
                          modifyBoxsChnlRemoteMute(params)
                            .then(res => {
                              if (res.success) {
                                this.$message({
                                  type: 'success',
                                  message: this.$t('message.controlSuccess')
                                })
                              } else if (res.code === '-1') {
                              } else {
                                this.$message({
                                  message: res.data[0].errorMsg,
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
                      } else {
                        this.$message({
                          message: this.$t('message.authCodeInvalid'),
                          type: 'error'
                        })
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
                    return false
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
                  message: this.$t('message.cancelInput')
                })
              })
          } else {
            let params = {
              macs: mac,
              cmd: cmd,
              nodeNo: addr
            }
            if (cmd === 'CLEAR_ALARM') {
              modifyBoxsChnlClearAlarm(params)
                .then(res => {
                  if (res.success) {
                    this.$message({
                      type: 'success',
                      message: this.$t('message.controlSuccess')
                    })
                  } else if (res.code === '-1') {
                  } else {
                    this.$message({
                      message: res.data[0].errorMsg,
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
            } else if (cmd === 'REMOTE_MUTE') {
              modifyBoxsChnlRemoteMute(params)
                .then(res => {
                  if (res.success) {
                    this.$message({
                      type: 'success',
                      message: this.$t('message.controlSuccess')
                    })
                  } else if (res.code === '-1') {
                  } else {
                    this.$message({
                      message: res.data[0].errorMsg,
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
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('message.cancelled')
          })
        })
    },
    handleConfigurationList () {
      this.equipmentFlag = true
    },
    handleEquipmentClose () {
      this.equipmentFlag = false
    },
    handleInstructions () {
      this.instructionsFlag = true
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
    addEditNameUnits () {
      console.log(this.analoginsList, '====analoginsList')
      console.log(this.digitalOutsList, '=====digitalOutsList')
      console.log(this.digitalInsList, '=======digitalInsList')
      // let digitalIns = { name: '' }
      // this.digitalOutsList.forEach((item, index) => {

      // })
      // console.log(digitalIns, '====digitalIns')
      let params = {
        mac: this.param.mac,
        addr: this.formInline.line,
        analogIns: this.analoginsList,
        digitalOuts: this.digitalOutsList,
        digitalIns: this.digitalInsList
      }
      // console.log(params, '=======params')
      setChannelInOutConfig(params)
        .then(res => {
          console.log(res)
          if (res.success) {
            this.$message({
              type: 'success',
              message: this.$t('message.successfulModified')
            })
            this.editNameUnitFlag = false
            this.queryChannel()
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.data[0].errorMsg,
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
    handleQueryPageAuth () {
      let params = {
        resKeys: 'AUTH_PROJECT_USE,AUTH_PROJECT_USE',
        operKeys: 'REMOTE_SWITCH_LOCK,ABNORMAL_SWITCH_UNLOCK'
      }
      queryPageAuth(params)
        .then(res => {
          if (res.success) {
            // console.log(res.data, 333)
            this.remote = res.data[0].result
            this.abnormal = res.data[1].result
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
    },
    handleJurisdiction () {
      this.$message({
        message: '当前账号没有权限',
        type: 'warning'
      })
    }
  },

  destroyed () {
    clearTimeout(this.timerID)
  },
  components: {
    ConfigurationList,
    CommandFeedback
  }
}
</script>
<style lang="stylus" scoped>
.analogList-bac
   color #D8DEE2
   margin-top 3px
   padding 4px
   border-radius 4px
   font-size:10px;
   background #293544
.reds
   margin-left 5px
   padding 2px 6px
   font-size 12px
   color #D83524
   border-radius 4px
   background  rgba(216, 53, 36, 0.2)
.greens
   margin-left 5px
   padding 2px 7px
   font-size 12px
   border-radius 4px
   color #6CB483
   background rgba(108, 180, 131, 0.2)
.radius-box
  margin-top 12px
  margin-right 5px
  height 6px
  width 6px
  border-radius 3px
  background #CB3325
.details-wrap
  padding 0 15px
  .el-row
    padding 10px 0
.el-divider
  position absolute
  width 509px
  top 215px
.el-divider__text
  background #0c1e32
  color #fff
  font-size 13px
.el-form--inline >>> .el-form-item__label
  color #fff
.btn
  background transparent
  color #fff
.icon-close
  background url('../../assets/image/close.png') no-repeat center
.icon-open
  background url('../../assets/image/open.png') no-repeat center
.icon-mute
  background url('../../assets/image/mute.png') no-repeat center
.icon-reset
  background url('../../assets/image/reset.png') no-repeat center
.icon-query
  background url('../../assets/image/reset.png') no-repeat center
.custom-icon
  font-family element-icons!important
  speak none
  font-style normal
  font-weight 400
  font-variant normal
  text-transform none
  line-height 1
  vertical-align baseline
  display inline-block
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  width 14px
  height 14px
  background-size cover
  vertical-align middle
  margin-right 2px
.custom-button
  display inline-block
.not-allowed
  cursor not-allowed
  color #999
#line-details >>> .custom-device-dialog
  .el-dialog__title, .el-dialog__headerbtn .el-dialog__close
    color #303133
.allowed
  color #999
.details-dialog
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
      color #fff
      padding 0 17px
      overflow auto
      overflow-y hidden
    .el-dialog__headerbtn
      top 10px
      right 5px
.hoverBtn
  border 1px solid #dcdfe6
  padding 0 3px 2px
  border-radius 4px
  background-color: #fff
  &:hover
    border 1px solid #409EFF
    background-color: #ecf5ff
</style>
