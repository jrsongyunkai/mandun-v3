<template>
  <div id="wiseList">
        <el-col :span="24">
          <el-form ref="form" :model="form" size="small" :inline="true">
            <el-form-item label="家庭:">
              <el-select
                v-model="family"
                class="en-unit"
                @change="handleFamily"
                style="width: 140px"
              >
                <el-option
                  v-for="item in familysList"
                  :key="item.familysId"
                  :label="item.familyName"
                  :value="item.familyId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="房间:">
              <el-select
                v-model="rooms"
                class="en-unit"
                clearable
                style="width: 140px"
              >
                <el-option
                  v-for="item in roomList"
                  :key="item.roomId"
                  :label="item.roomName"
                  :value="item.roomId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态:">
              <el-select
                v-model="status"
                class="en-unit"
                @change="handleStatus"
                style="width: 80px"
              >
                <el-option
                  v-for="item in stats"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-input
                style="width: 140px"
                v-model="form.mac"
                @keyup.enter.native="handleKeyWords"
                placeholder="设备号/设备名称"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="getOrviboData">{{ $t('btns.query') }}</el-button>
            </el-form-item>
          </el-form>
          <el-col
            :style="{'padding': '0'}"
            v-loading="loading"
            element-loading-spinner="el-icon-loading"
            :element-loading-text="$t('message.loading')">
            <div :style="orviboTableHeight" v-el_scrollBar>
              <el-row :gutter="8" style="margin: 0">
                <el-col :lg="6" :md="8" v-for="(v, k) in orviboData" :key="k" class="device-wrap">
                  <div class="grid-content">
                    <div class="device">
                      <el-row class="device-header">
                        <el-col :span="9" v-show="v.onlineStatus === 'online'" class="c-success">
                          <span class="iconfont icon-zaixian"></span>
                          <span class="status-name">{{ $t('table.online') }}</span>
                        </el-col>
                        <el-col :span="9" v-show="v.onlineStatus === 'offline'" class="c-danger">
                          <span class="iconfont icon-lixian"></span>
                          <span class="status-name">{{ $t('control.offline') }}</span>
                        </el-col>
                      </el-row>
                      <el-row class="device-container">
                        <a href="javascript:void(0);" @click="macClick(v)">
                          <div class="device-img">
                            <span v-show="v.deviceTypeName === 'switchs'">
                              <img
                                src="../../assets/image/lamp.png"
                                alt="Orvibo"
                              />
                            </span>
                            <span v-show="v.deviceTypeName === 'outlet'">
                              <img
                                src="../../assets/image/socket.png"
                                alt="Orvibo"
                              />
                            </span>
                            <span v-show="v.deviceTypeName === 'ac_panel'">
                              <img
                                src="../../assets/image/airConditioner.png"
                                alt="Orvibo"
                              />
                            </span>
                            <span v-show="v.deviceTypeName === 'curtain'">
                              <img
                                src="../../assets/image/curtains.png"
                                alt="Orvibo"
                              />
                            </span>
                            <span v-show="v.deviceTypeName === 'scene_panel'">
                              <img
                                src="../../assets/image/scenarioPanel.png"
                                alt="Orvibo"
                              />
                            </span>
                            <span v-show="v.deviceTypeName === 'ir_transponder'">
                              <img
                                src="../../assets/image/launcher.png"
                                alt="Orvibo"
                              />
                            </span>
                          </div>
                          <div class="device-desc">
                            <el-tooltip :content="v.deviceId" placement="top-start" open-delay="1000" effect="light">
                              <p>{{v.deviceId}}</p>
                            </el-tooltip>
                            <el-tooltip :content="v.deviceName" placement="top-start" open-delay="1000" effect="light">
                              <p>{{v.deviceName}}</p>
                            </el-tooltip>
                            <el-tooltip
                              :content="v.roomName"
                              placement="top-start"
                              open-delay="1000"
                              effect="light"
                            >
                              <p>{{v.roomName}}</p>
                            </el-tooltip>
                          </div>
                        </a>
                        <el-col
                          :span="24"
                          class="alarmInfo"
                        >
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="block tc">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNo"
                :page-size="pageSize"
                :small="true"
                background
                layout="prev, pager, next"
                :total="total"
             ></el-pagination>
            </div>
          </el-col>
        </el-col>
        <el-dialog
          :visible.sync="outerVisible"
          :close-on-click-modal="false"
          width="1323px"
          :modal="false"
          :before-close="handleClose"
          custom-class="dialogStyle"
        >
          <div class="dialogTitle" >{{dialogTitle}}
            <i class="iconfont icon-cha" @click="closeDialog" ></i>
          </div>
          <div class="dialogMain" v-if="isShow">
            <div class="dialogLeft" >
              <el-form  label-width="100px">
                <el-form-item label="设备名称:">
                  <el-popover
                    placement="top"
                    width="250"
                    trigger="click"
                    v-model="deviceFlag"
                    @hide="dialogData.deviceName = deviceName">
                      <el-input size="small" minlength="1" maxlength="20" show-word-limit v-model="dialogData.deviceName" :placeholder="$t('placeholder.content')"></el-input>
                      <div style="text-align: right; margin: 5px 0 0">
                        <el-button type="primary" size="mini" @click="hangdleDeviceChange">{{ $t('btns.ok') }}</el-button>
                        <el-button size="mini" type="plain" @click="deviceFlag = false">{{ $t('btns.cancel') }}</el-button>
                      </div>
                      <span slot="reference" @mouseover="deviceIndex = dialogData.deviceName" @mouseout="deviceIndex = -1" class=" pRelative">
                        <i slot="reference" v-if="deviceIndex === dialogData.deviceName || dialogData.deviceName === undefined" class="el-icon-edit normal-icon"></i>
                        <span class="deviceName" :title="dialogData.deviceName">
                          <span >{{ deviceName }}</span>
                        </span>
                      </span>
                  </el-popover>
                </el-form-item>
                <el-form-item label="设备标识:">
                  <el-tooltip effect="light" :content="dialogData.deviceId" placement="bottom">
                  <span class="deviceId">
                    {{ dialogData.deviceId }}
                  </span>
                  </el-tooltip>
                </el-form-item>
                <el-form-item label="在线状态:">
                  <div :class="dialogData.onlineStatus === 'online' ? 'c-success' : 'c-info'" >{{ dialogData.onlineStatus === 'online' ? '在线' : '离线' }}</div>
                </el-form-item>
                <el-form-item label="设备类型:">
                  <span v-if="this.dialogData.deviceTypeName === 'outlet'">插座类</span>
                  <span v-else-if="this.dialogData.deviceTypeName === 'switchs'">灯光类</span>
                  <span v-else-if="this.dialogData.deviceTypeName === 'scene_panel'">情景面板</span>
                  <span v-else-if="this.dialogData.deviceTypeName === 'ac_panel'">空调面板</span>
                  <span v-else-if="this.dialogData.deviceTypeName === 'curtain'">窗帘</span>
                  <span v-else-if="this.dialogData.deviceTypeName === 'ir_transponder'">红外转发器</span>
                </el-form-item>
                <el-form-item label="型号:">
                  {{ jsonInfo.subDeviceType }}
                </el-form-item>
                <el-form-item label="硬件版本:">
                  {{ jsonInfo.hardwareVersion }}
                </el-form-item>
                <el-form-item label="软件版本:">
                  {{ jsonInfo.softwareVersion }}
                </el-form-item>
                <el-form-item label="位置:">
                  {{ dialogData.roomName }}
                </el-form-item>
               </el-form>
               <div class="leftLine" ></div>
               <div class="leftTime" >{{dialogData.updateTime}}</div>
            </div>
            <div class="dialogRight">
                <div class="dialogImg" v-show="dialogData.deviceTypeName === 'switchs'">
                  <img
                    src="../../assets/image/lamp.png"
                    alt="Orvibo"
                  />
                </div>
                <div class="dialogImg" v-show="dialogData.deviceTypeName === 'outlet'">
                  <img
                    src="../../assets/image/socket.png"
                    alt="Orvibo"
                  />
                </div>
                <div class="dialogImg" v-show="dialogData.deviceTypeName === 'ac_panel'">
                  <img
                    src="../../assets/image/airConditioner.png"
                    alt="Orvibo"
                  />
                </div>
                <div class="dialogImg" v-show="dialogData.deviceTypeName === 'curtain'">
                  <img
                    src="../../assets/image/curtains.png"
                    alt="Orvibo"
                  />
                </div>
                <div class="dialogImg" v-show="dialogData.deviceTypeName === 'scene_panel'">
                  <img
                    src="../../assets/image/scenarioPanel.png"
                    alt="Orvibo"
                  />
                </div>
                <div class="dialogImg" v-show="dialogData.deviceTypeName === 'ir_transponder'">
                  <img
                    src="../../assets/image/launcher.png"
                    alt="Orvibo"
                  />
                </div>
              <div class="temperature tc" >
                <div v-show="queryState.remotestatus">
                  <div  :class="queryState.remotestatus === 'on' ? 'c-success' : 'c-info'" >{{ queryState.remotestatus === 'on' ? '已开' : '已关' }}</div>
                  <div class="mt-20" v-if="dialogData.deviceTypeName === 'ac_panel'">
                    <div v-if="queryState.mode === 'AUTO'" >自动</div>
                    <div v-else-if="queryState.mode === 'COOL'" >
                      <img src="../../assets/image/refrigeration.png" alt="Orvibo">
                    </div>
                    <div v-else-if="queryState.mode === 'HEAT'" >
                      <img src="../../assets/image/heating.png" alt="Orvibo">
                    </div>
                    <div class="mt-10">{{ queryState.temperature }}℃</div>
                    <div class="mt-10" style="font-size: 24px" >环境温度</div>
                    <div style="font-size: 24px" >{{ queryState.roomTemperature }}℃</div>
                  </div>
                </div>
              </div>
              <div class="dialogRightBottom">
                <div class="c-default timing dottiming" @click="openTiming" >...</div>
                <div class="timing" v-if="timingData.length !== 0" >
                  <div v-for="(item, index) in timingData.slice(0,1)" :key="index">
                    {{ item.active ? '有效定时':'无效定时' }}:
                    <span class="ml-5">{{ item.executeTime.cycle + '\xa0'  }}</span>
                    <span>{{ item.executeTime.time + '\xa0' }}</span>
                    <span>执行【{{ item.properties.remotestatus === 'on' ? '开启' : '关闭' }}】</span>
                  </div>
                </div>
                <!-- <div class="timing" v-else-if="timingData.length === 0 && countDownsData.length !== 0" >
                  <div v-for="(item, index) in countDownsData.slice(0,1)" :key="index">
                    {{ item.active ? '有效倒计时':'无效倒计时' }}:
                    <span class="ml-5">{{ item.executeTime.countdownTime + '\xa0'  }}</span>
                     <span>执行【{{ item.properties.remotestatus === 'on' ? '开启' : '关闭' }}】</span>
                  </div>
                </div> -->
                <div class="timing" v-else >新增、编辑定时</div>
              </div>
            </div>
            <div class="tc">
            <button class="mainBtn orviboBtn" style="margin-right: 20px" @click="orviboDeviceControl('TurnOn')">
              <img src="../../assets/image/switch.png" alt="Orvibo">
              开启</button>
            <button class="mainBtn orviboBtn" style="margin-right: 20px" @click="orviboDeviceControl('Pause')" v-if="dialogData.deviceTypeName === 'curtain'">
              <img src="../../assets/image/switch.png" alt="Orvibo">
              暂停</button>
            <button class="mainBtn orviboBtn" @click="orviboDeviceControl('TurnOff')">
              <img src="../../assets/image/oClose.png" alt="Orvibo">
              关闭</button>
            </div>
            <div class="tc " v-if="dialogData.deviceTypeName === 'ac_panel' && queryState.remotestatus === 'on'">
              <img class="temperatureImg" src="../../assets/image/temperature.png" alt="Orvibo">
              <select v-model="temperatureValue" @change="handleTemperture"  class="temperatureselect selectBtn">
                <option class="secondBtnText" v-for="(v, f) in selectNum" :key="f" :value ="v" >{{v}}</option>
              </select>
              <button class="temperatureBtn orviboBtn" style="margin-right: -5px;" @click="handleReduce">
                <span class="secondBtnText" >-</span>
              </button>
              <button class="temperatureBtn orviboBtn" @click="handleIncrease">
                <span class="secondBtnText" >+</span>
              </button>
              <span class="shu" ></span>
              <button class="secondBtn orviboBtn" style="margin-right: -2px" @click="orviboDeviceControl('SetMode', 'mode', 'COOL')">
                <img src="../../assets/image/refrigeration.png" alt="Orvibo">
                <span class="secondBtnText" >制冷</span>
              </button>
              <button class="secondBtn orviboBtn" @click="orviboDeviceControl('SetMode', 'mode', 'HEAT')">
                <img src="../../assets/image/heating.png" alt="Orvibo">
                <span class="secondBtnText" >制热</span>
              </button>
              <span class="shu" ></span>
              <button class="secondBtn orviboBtn" v-for="(item, index) in ac_panel" :key="index" @click="orviboDeviceControl(item.type, item.attribute, item.value)">
                <img :src="item.src" alt="Orvibo">
                <span class="secondBtnText" >{{ item.text }}</span>
              </button>
            </div>
          </div>
          <div class="dialogMain" v-if="!isShow">
            <div class="addTiming mb-20">
              <i class="el-icon-plus pointer c-default" @click="addOrviboTiming()">添加定时</i>
              <template>
                <el-table
                :data="timingData"
                height="500"
                v-el_scrollBar:scrollBar
                style="width: 100%">
                  <el-table-column label="状态" width="200" align="center">
                    <template slot-scope="scope">
                      {{ scope.row.active ? '有效': '无效'}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="executeTime.time" label="定时时间" width="200" align="center"></el-table-column>
                  <el-table-column label="动作" width="250" align="center">
                    <template slot-scope="scope">
                      {{ scope.row.properties.remotestatus === 'on' ? '开启': '关闭'}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="executeTime.cycle" label="执行频率"></el-table-column>
                  <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                      <el-button @click="handleClick(scope.row)" class="c-default" type="text" size="small">编辑</el-button>
                      <el-button class="c-default" @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </div>
            <!-- 添加倒计时 -->
            <!-- <div class="addCountdown" v-if="false">
              <i class="el-icon-plus pointer c-default" @click="addOrviboTiming('countdowns')">添加倒计时</i>
              <template>
                <el-table
                :data="countDownsData"
                height="500"
                v-el_scrollBar:scrollBar
                style="width: 100%">
                  <el-table-column label="状态" width="100" align="center">
                    <template slot-scope="scope">
                      {{ scope.row.active === 'on' ? '激活': '未激活'}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="executeTime.countdownTime" label="倒计时时长" width="150" align="center"></el-table-column>
                  <el-table-column label="动作" width="100" align="center">
                    <template slot-scope="scope">
                      {{ scope.row.properties.remotestatus === 'on' ? '开启': '关闭'}}
                    </template>
                  </el-table-column>
                  <el-table-column prop="executeTime.countdownEndTime" label="倒计时剩余时间"></el-table-column>
                  <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                      <el-button class="c-default" @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
                      <el-button class="c-default" @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </div> -->
          </div>
        </el-dialog>
        <el-dialog :title="addTitle" :close-on-click-modal="false" :modal="false" :visible.sync="timingFlag" width="35%" top="30vh" id="timing-form" @close="handleCancel">
        <el-form :model="addData" size="small">
            <el-form-item label="设备远程状态:" label-width="120px">
              <el-select
                v-model="addData.remoteStatus"
                class="en-unit"
              >
                <el-option
                  v-for="v in remoteStatus"
                  :key="v.value"
                  :label="v.text"
                  :value="v.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="定时:" label-width="120px">
              <template>
                <el-time-picker
                  style="width: 199px"
                  v-model="value1"
                  format="HH:mm"
                  value-format="HH:mm"
                  placeholder="请选择定时时间">
                </el-time-picker>
              </template>
            </el-form-item>
            <el-form-item label="定时周期:" label-width="120px">
              <el-checkbox-group v-model="addData.week" @change="handleCheckedWeekChange">
                <el-checkbox v-for="week in weekList" :label="week.value" :key="week.value" >{{ week.text }}</el-checkbox>
              </el-checkbox-group>
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"  @change="handleCheckAllChange">{{'全选'}}</el-checkbox>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="handleSave">确定</el-button>
          <el-button size="small" @click="handleCancel">取消</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="countDownTitle" :close-on-click-modal="false" :modal="false" :visible.sync="countDownFlag" width="35%" top="30vh" id="timing-form" @close="handleCancel" >
        <el-form :model="countDownData" size="small">
          <el-form-item label="设备远程状态:" label-width="120px">
            <el-select
              v-model="countDownData.countDownstatus"
              class="en-unit"
            >
              <el-option
                v-for="v in countDownStatus"
                :key="v.value"
                :label="v.text"
                :value="v.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="倒计时:" label-width="120px">
            <template>
              <el-time-picker
                style="width: 199px"
                v-model="value1"
                format="HH:mm"
                placeholder="请选择倒计时时间">
              </el-time-picker>
            </template>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="handleSave">确定</el-button>
          <el-button size="small" @click="handleCancel">取消</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import { getOrviboList, modifyDeviceName, queryTimer, addTiming, queryStatus, deviceControl, modifyOrviboTiming, delOrviboTiming, getOrvibofamilyList, getOrviboRoomList, discoveryOrvibo } from '@/api/api'
export default {
  data () {
    return {
      timer: null,
      timerID: null,
      isShow: true,
      dialogTitle: '',
      familysList: [],
      roomList: [],
      family: '',
      rooms: '',
      childValue: false,
      temperatureValue: '',
      dialogData: [],
      jsonInfo: {},
      outerVisible: false,
      selectNum: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
      form: {
        mac: ''
      },
      timingData: [],
      queryState: [],
      countDownsData: [],
      countDownData: {
        countDownstatus: ''
      },
      orviboData: [],
      addTitle: '新增、编辑定时',
      countDownTitle: '新增、编辑倒计时',
      addData: {
        week: [],
        remoteStatus: ''
      },
      addTime: false,
      timeID: '',
      isIndeterminate: false,
      checkAll: false,
      selectData: [],
      deviceName: '',
      deviceFlag: false,
      timingFlag: false,
      countDownFlag: false,
      deviceIndex: -1,
      pageNo: 1,
      pageSize: 24,
      currentPage: 1,
      total: 0,
      status: '',
      value1: '',
      stats: [
        {
          value: '',
          text: this.$t('placeholder.all')
        },
        {
          value: 'online',
          text: this.$t('table.online')
        },
        {
          value: 'offline',
          text: this.$t('control.offline')
        }
      ],
      weekList: [
        {
          value: 'Sun',
          text: '周日'
        },
        {
          value: 'Mon',
          text: '周一'
        },
        {
          value: 'Tue',
          text: '周二'
        },
        {
          value: 'Wed',
          text: '周三'
        },
        {
          value: 'Thur',
          text: '周四'
        },
        {
          value: 'Fri',
          text: '周五'
        },
        {
          value: 'Sat',
          text: '周六'
        }
      ],
      remoteStatus: [
        {
          value: 'on',
          text: '开启'
        },
        {
          value: 'off',
          text: '关闭'
        }
      ],
      countDownStatus: [
        {
          value: 'TurnOn',
          text: '开启'
        },
        {
          value: 'TurnOff',
          text: '关闭'
        }
      ],
      orviboTableHeight: {
        position: 'relative',
        height: this.$store.state.orviboTableHeight
      },
      ac_panel: [
        {
          src: require('../../assets/image/auto.png'),
          text: '自动',
          type: 'SetFanSpeed',
          attribute: 'fanSpeed',
          value: '0'
        },
        {
          src: require('../../assets/image/lowWind.png'),
          text: '低风',
          type: 'SetFanSpeed',
          attribute: 'fanSpeed',
          value: '1'
        },
        {
          src: require('../../assets/image/midWind.png'),
          text: '中风',
          type: 'SetFanSpeed',
          attribute: 'fanSpeed',
          value: '2'
        },
        {
          src: require('../../assets/image/highWind.png'),
          text: '高风',
          type: 'SetFanSpeed',
          attribute: 'fanSpeed',
          value: '3'
        }
      ]
    }
  },
  mounted () {
    this.getOrvibofamily()
  },
  methods: {
    getOrvibofamily () {
      getOrvibofamilyList()
        .then(res => {
          if (res.success) {
            this.familysList = res.data.familys
            if (this.familysList.length > 0) {
              this.family = this.familysList[0].familyId
              this.getOrviboRoom(this.family)
              this.getOrviboData()
              this.discoveryOrviboList()
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
    discoveryOrviboList () {
      discoveryOrvibo()
        .then(res => {
          if (res.success) {
            this.getOrviboData()
            this.$message({
              message: '同步成功',
              type: 'success'
            })
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: '同步失败',
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
    getOrviboRoom (val) {
      let params = {
        familyId: val
      }
      getOrviboRoomList(params)
        .then(res => {
          if (res.success) {
            this.roomList = res.data
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
    getOrviboData () {
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        params: {
          familyId: this.family,
          roomId: this.rooms,
          onlineStatus: this.status,
          keyword: this.form.mac
        }
      }
      getOrviboList(params)
        .then(res => {
          if (res.success) {
            this.orviboData = res.datas
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
    },
    queryDeviceStatus (val) {
      let params = {
        deviceId: this.dialogData.deviceId,
        queryName: val
      }
      queryStatus(params)
        .then(res => {
          if (res.success) {
            this.queryState = res.data.properties
            this.temperatureValue = this.queryState.temperature
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
            if (res.message === '用户没有绑定该设备') {
              this.getOrvibofamily()
              clearInterval(this.timerID)
              this.timerID = null
              this.timer = setTimeout(() => {
                this.outerVisible = false
              }, 2000)
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
    queryTimerData (data) {
      let params = {
        deviceId: data.deviceId
      }
      queryTimer(params)
        .then(res => {
          if (res.success) {
            this.timingData = res.data.timingTask.timings
            this.countDownsData = res.data.timingTask.countdowns
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
    handleSizeChange (val) {
      this.pageSize = val
      this.getOrviboData()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.getOrviboData()
    },
    macClick (v) {
      let _this = this
      this.outerVisible = true
      this.dialogTitle = '设备详情'
      this.isShow = true
      this.dialogData = v
      this.deviceName = v.deviceName
      this.jsonInfo = JSON.parse(v.jsonInfo)
      this.queryTimerData(this.dialogData)
      if (v.deviceTypeName === 'scene_panel' || v.deviceTypeName === 'ir_transponder') {
      } else {
        this.queryDeviceStatus('QueryAll')
        this.timerID = setInterval(function () {
          _this.queryDeviceStatus('QueryAll')
        }, 5000)
      }
    },
    handleTemperture () {
      this.orviboDeviceControl('SetTemperature', 'temperature', this.temperatureValue)
    },
    handleReduce () {
      if (this.temperatureValue <= 16) {
        return false
      }
      this.temperatureValue--
      this.orviboDeviceControl('SetTemperature', 'temperature', this.temperatureValue)
    },
    handleIncrease () {
      if (this.temperatureValue >= 30) {
        return false
      }
      this.temperatureValue++
      this.orviboDeviceControl('SetTemperature', 'temperature', this.temperatureValue)
    },
    orviboDeviceControl (type, attribute, value) {
      let params = {
        deviceId: this.dialogData.deviceId,
        action: type,
        attribute: attribute,
        value: value
      }
      deviceControl(params)
        .then(res => {
          if (res.success) {
            if (res.data.status === 0) {
              this.$message({
                message: '命令已提交，生效中..',
                type: 'success'
              })
              this.deviceFlag = false
              this.deviceIndex = -1
              this.queryState.temperature = this.temperatureValue
              // if (type === 'TurnOn') {
              //   this.queryState.remotestatus = 'on'
              // } else if (type === 'TurnOff') {
              //   this.queryState.remotestatus = 'off'
              // }
              // if (value === 'COOL') {
              //   this.queryState.mode = 'COOL'
              // } else if (value === 'HEAT') {
              //   this.queryState.mode = 'HEAT'
              // }
              this.timer = setTimeout(() => {
                this.queryDeviceStatus('QueryAll')
              }, 1000)
            } else {
              this.$message({
                message: res.data.errorMsg,
                type: 'error'
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
    },
    handleKeyWords (event) {
      this.form.mac = event.target.value
      this.pageNo = 1
      this.getOrviboData()
    },
    handleStatus (val) {
      this.pageNo = 1
      this.status = val
      this.getOrviboData()
    },
    handleFamily (val) {
      this.rooms = ''
      this.getOrviboRoom(val)
    },
    hangdleDeviceChange () {
      if (this.dialogData.deviceName.length <= 0) {
        return false
      }
      let params = {
        deviceId: this.dialogData.deviceId,
        deviceName: this.dialogData.deviceName
      }
      modifyDeviceName(params)
        .then(res => {
          if (res.success) {
            if (res.data.status === 0) {
              this.$message({
                message: this.$t('message.successfulModified') + '！',
                type: 'success'
              })
              this.deviceName = this.dialogData.deviceName
              this.deviceFlag = false
              this.deviceIndex = -1
            } else {
              this.$message({
                message: res.data.errorMsg,
                type: 'error'
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
    },
    closeDialog () {
      if (!this.isShow) {
        this.dialogTitle = '设备详情'
        this.isShow = true
      } else {
        this.outerVisible = false
        clearInterval(this.timerID)
        this.timerID = null
        this.discoveryOrviboList()
        this.queryState = []
      }
    },
    handleClose () {
      this.outerVisible = false
      clearInterval(this.timerID)
      this.timerID = null
    },
    openTiming () {
      this.isShow = false
      this.dialogTitle = '定时列表'
      this.deviceFlag = false
    },
    addOrviboTiming () {
      this.timingFlag = true
      this.addTime = true
    },
    handleCheckedWeekChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.weekList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.weekList.length
    },
    handleCheckAllChange (val) {
      let weekData = this.weekList.map(item => {
        return item.value
      })
      this.addData.week = val ? weekData : []
      this.isIndeterminate = false
    },
    handleSave () {
      if ((this.value1.length && this.addData.remoteStatus.length) <= 0) {
        this.$message({
          message: '设备状态与定时时间不能为空',
          type: 'error'
        })
        return false
      }
      if (this.addTime) {
        let params = {
          deviceId: this.dialogData.deviceId,
          timing: {
            properties: {
              remotestatus: this.addData.remoteStatus
            },
            executeTime: {
              time: this.value1,
              cycle: this.addData.week.length > 0 ? this.addData.week : []
            }
          }
        }
        let repeatTime = ''
        this.timingData.map(item => {
          if (this.value1 === item.executeTime.time) {
            repeatTime = false
          }
        })
        if (repeatTime === false) {
          this.$message({
            message: '当前时间已存在定时任务',
            type: 'error'
          })
          return false
        }
        addTiming(params)
          .then(res => {
            if (res.success) {
              this.$message({
                message: '命令已提交，生效中..',
                type: 'success'
              })
              this.timingFlag = false
              this.addData.week = []
              this.isIndeterminate = false
              this.checkAll = false
              this.timer = setTimeout(() => {
                this.queryTimerData(this.dialogData)
              }, 1000)
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
      } else {
        let params = {
          timing: {
            timingId: this.timeID,
            properties: {
              remotestatus: this.addData.remoteStatus
            },
            executeTime: {
              time: this.value1,
              cycle: this.addData.week.length > 0 ? this.addData.week : []
            }
          }
        }
        modifyOrviboTiming(params)
          .then(res => {
            if (res.success) {
              this.$message({
                message: '命令已提交，生效中..',
                type: 'success'
              })
              this.timingFlag = false
              this.addData.week = []
              this.isIndeterminate = false
              this.checkAll = false
              this.timer = setTimeout(() => {
                this.queryTimerData(this.dialogData)
              }, 1000)
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
    handleClick (row) {
      this.addTime = false
      this.timeID = row.timingId
      this.timingFlag = true
      this.addData.remoteStatus = row.properties.remotestatus
      this.addData.week = []
      this.weekList.forEach(item => {
        row.executeTime.cycle.forEach((value) => {
          if (item.text === value) this.addData.week.push(item.value)
        })
      })
      let _length = this.addData.week.length
      if (_length > 0 && _length < this.weekList.length) this.isIndeterminate = true
      if (_length === this.weekList.length) this.checkAll = true
      this.value1 = row.executeTime.time
    },
    deleteClick (row) {
      let params = {}
      if (row.timingId) {
        params = {
          deviceId: this.dialogData.deviceId,
          timing: {
            timingId: row.timingId
          }
        }
      } else if (row.countdownId) {
        params = {
          deviceId: this.dialogData.deviceId,
          countdown: {
            countdownId: row.countdownId
          }
        }
      }
      delOrviboTiming(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: '命令已提交，生效中..',
              type: 'success'
            })
            this.queryTimerData(this.dialogData)
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
    handleCancel () {
      this.timingFlag = false
      this.addData.week = []
      this.addData.remoteStatus = ''
      this.value1 = ''
      this.checkAll = false
      this.isIndeterminate = false
    }
  },
  watch: {
    '$store.state.orviboTableHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.orviboTableHeight.height = newVal
        }
      }
    }
  },
  destroyed () {
    this.timerID = null
    clearInterval(this.timerID)
    this.timer = null
    clearInterval(this.timer)
  }
}
</script>

<style lang="stylus" scoped>
.el-form .el-form-item
    margin-bottom 10px
  >>> .el-form-item__label
    color #fff
.el-button.is-round
    padding 12px
.device-wrap
    padding 0
    margin-top 1%
    font-size 13px
    -webkit-box-sizing border-box
    -moz-box-sizing border-box
    box-sizing border-box
.device-header
    padding 0 5px
    height 40px
    line-height 40px
    background-color #303c54
    -webkit-border-top-left-radius 5px
    -webkit-border-top-right-radius 5px
    -moz-border-top-left-radius 5px
    -moz-border-top-right-radius 5px
    border-top-left-radius 5px
    border-top-right-radius 5px
    _zoom 1
.device-container
    padding 5px
    background-color #242f44
    -webkit-border-bottom-left-radius 5px
    -webkit-border-bottom-right-radius 5px
    -moz-border-bottom-left-radius 5px
    -moz-border-bottom-right-radius 5px
    border-bottom-left-radius 5px
    border-bottom-right-radius 5px
    a
      display table
      width 100%
      display table
      table-layout fixed
      word-wrap break-word
      overflow hidden
      text-decoration none
.device-desc
    display table-cell
    *display inline-block
    vertical-align middle
    color #fff
  p
    width 95%
    margin-left 6px
    font-size 12px
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
    height 15px
    _zoom 1
.alarmInfo
    padding 3px 0
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
.device-img
    width 30%
    display table-cell
    vertical-align middle
    text-align center
    font-size 0
    img
      display inline-block
      max-width 100%
.el-pagination >>> .el-pagination__total
    margin-left 10px
.device
    -webkit-transition all .2s linear
    -moz-transition all .2s linear
    transition all .2s linear
    -webkit-box-shadow -5px 5px 10px -4px #3a3635
    -moz-box-shadow -5px 5px 10px -4px #3a3635
    box-shadow -5px 5px 10px -4px #3a3635
    &:hover
        -webkit-box-shadow -5px 6px 10px -3px #3a3635
        -moz-box-shadow -5px 6px 10px -3px #3a3635
        box-shadow -5px 6px 10px -3px #3a3635
.device-wrap
    -webkit-transition all .2s linear
    -moz-transition all .2s linear
    transition all .2s linear
    &:hover
      -webkit-transform translate3d(0, -2px, 0)
      transform translate3d(0, -2px, 0)
.icon-zaixian, .icon-lixian, .status-name
  vertical-align middle
.dialogStyle
  max-height calc(100% - 116px)
  max-width calc(100% - 20px)
  min-width 1323px
  box-sizing border-box
.dialogTitle
  box-sizing border-box
  position absolute
  left 0
  top 0
  width 100%
  background-color #000
  height 40px
  line-height 40px
  text-indent 10px
  color #fff
  border 1px solid #fff
  border-bottom none
.icon-cha
  float right
  margin-right 10px
  font-size 14px
  color #6c6c6c
.dialogMain
  position absolute
  width 100%
  height 600px
  left 0
  top 40px
  box-sizing border-box
  padding 10px 10px 20px
  background-color #0c1e32
  border 1px solid #fff
  border-top none
.dialogLeft
  float left
  width 35%
  height 75%
  color #fff
.leftLine
  width 60%
  height 10px
  border-bottom 2px solid #fff
.leftTime
  width 35%
  float right
  margin-right 5px
  margin-top -8px
.dialogRight
  float left
  height 75%
  width 62%
  margin 0 10px 10px
  border 1px solid #223244
.dialogImg
  float left
  height 80%
  box-sizing border-box
  width 70%
  padding 5% 10% 0
.dialogImg > img
  width 80%
.temperature
  float left
  margin-left -7%
  width 30%
  height 85%
  box-sizing border-box
  padding 10% 0
  font-size 36px
  color #fff
.dialogRightBottom
  width 100%
  height 15%
  box-sizing border-box
  color #fff
.timing
  float right
  margin-top 30px
  cursor pointer
  margin-right 10px
.dottiming
  margin-right 20%
.mainBtn
  width 120px
  height 40px
  line-height 30px
  margin 20px auto
.temperatureImg
  width 23.5px
  height 23.5px
  vertical-align: middle
.secondBtn
  width 100px
  height 35px
  line-height 20px
  margin 0 2px 10px
.secondBtnText
  padding-left 2px
  font-size 12px
.selectBtn
  position relative
  border 2px solid #fff
  outline none
  background-color #0c1e32
  color #fff
.temperatureselect
  width 80px
  height 35px
  padding 1px 6px
  vertical-align: middle
.temperatureBtn
  width 30px
  height 35px
  line-height 20px
  margin-bottom 10px
  margin-top 10px
  vertical-align: middle
.orviboBtn
  position: relative
  border 2px solid #fff
  outline none
  background-color #0c1e32
  color #fff
.orviboBtn:active
  top 2px
.orviboBtn img
  width 28%
  vertical-align: middle
.dialogLeft
  >>> span
        margin-right 15px
.dialogLeft
  >>> .el-input
        width 130px
.adjustment-alias
  cursor pointer
  .el-icon-edit
    margin-left 2px
    font-size 16px
#timing-form .el-form-item >>> .el-form-item__label
    color #333
.el-scrollbar__wrap
  overflow-x hidden
.pRelative
  position relative
  i
    position absolute
    top 3px
  .normal-icon
    left -10px
.deviceName
  position absolute
  top -10px
  left 2px
  width 150px
  overflow hidden
  white-space nowrap
  text-overflow ellipsis
.deviceId
  position absolute
  width 150px
  overflow hidden
  white-space nowrap
  text-overflow ellipsis
.shu
  display inline-block
  width 1px
  height 35px
  margin 0 15px 0 15px
  border-left 1px solid #fff
  vertical-align: middle
</style>
