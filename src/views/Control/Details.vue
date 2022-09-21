<template>
  <div id="details">
    <el-row>
      <el-col :span="24">
        <el-col class="info">
          <Info :mac="param.mac"></Info>
        </el-col>
        <el-col class="mantunsci" v-if="(param.equipmentType === 1||param.equipmentType === 19)&& ocDevice !== 'IO'">
            <LineChart :options="residualCurrent" :onGetEchartsInstance="onGetEchartsInstance"></LineChart>
        </el-col>
        <el-col class="mantunsci" v-if="param.equipmentType === 1&& ocDevice === 'IO'">
          <TcequipmentLine
            :options="residuals"
            ref="residuals"
            :title="residualsTitle"
            :onGetEchartsInstance="onGetEchartsInstance"
          ></TcequipmentLine>
        </el-col>
        <el-col class="mantunsci" v-if="(param.equipmentType === 1||param.equipmentType === 19)&& ocDevice !== 'IO'">
            <LineChart :options="temperature" :onGetEchartsInstance="onGetEchartsInstance"></LineChart>
        </el-col>
        <el-col  class="mantunsci" v-if="param.equipmentType === 1&& ocDevice === 'IO'">
           <TcequipmentLine
            :options="temPeraTure"
            :title="temPeraTureTitle"
            :onGetEchartsInstance="onGetEchartsInstance"
          > wendu</TcequipmentLine>
        </el-col>
        <el-col
          class="mantunsci"
          v-if="param.equipmentType === 2 || param.equipmentType === 8"
        >
          <LineChart
            :options="residualCurrent"
            :onGetEchartsInstance="onGetEchartsInstance"
          ></LineChart>
        </el-col>
        <el-col
          class="mantunsci"
          v-if="param.equipmentType === 2 || param.equipmentType === 8"
        >
          <LineChart
            :options="temperature"
            :onGetEchartsInstance="onGetEchartsInstance"
          ></LineChart>
        </el-col>
        <el-col class="stralsund" v-else-if="param.equipmentType === 3">
          <LineChart :options="stralsund"></LineChart>
        </el-col>
        <el-col class="stralsund" v-else-if="param.equipmentType === 4">
          <LineChart :options="level"></LineChart>
        </el-col>
        <el-col class="stralsund" v-else-if="param.equipmentType === 5">
          <LineChart :options="pressure"></LineChart>
        </el-col>
        <el-col class="stralsund" v-else-if="param.equipmentType === 6">
          <LineChart :options="smoke"></LineChart>
        </el-col>
        <el-col class="stralsund" v-else-if="param.equipmentType === 7">
          <LineChart :options="flammableGas"></LineChart>
        </el-col>
        <el-col class="mantunsci" v-else-if="param.equipmentType === 10">
          <LineChart :options="smokeAlarm"></LineChart>
        </el-col>
        <el-col class="mantunsci" v-if="param.equipmentType === 10">
          <LineChart :options="smokeVoltage"></LineChart>
        </el-col>
        <el-col class="mantunsci" v-if="param.equipmentType === 11">
          <LineChart :options="temperatureSensor"></LineChart>
        </el-col>
        <el-col class="mantunsci" v-if="param.equipmentType === 11">
          <LineChart :options="humiditySensor"></LineChart>
        </el-col>
        <el-col class="mantunsci" v-if="param.equipmentType === 12">
          <LineChart :options="smartMeterVoltage"></LineChart>
        </el-col>
        <el-col class="mantunsci" v-if="param.equipmentType === 12">
          <LineChart :options="smartMeterAmpere"></LineChart>
        </el-col>
        <el-col class="mantunsci" v-if="param.equipmentType === 13">
          <LineChart :options="smokeAlarm"></LineChart>
        </el-col>
        <el-col class="mantunsci" v-if="param.equipmentType === 13">
          <LineChart :options="combustibleGas"></LineChart>
        </el-col>
        <el-col class="stralsund" v-if="param.equipmentType === 14">
          <LineChart :options="Illuminance"></LineChart>
        </el-col>
        <el-col class="stralsund" v-if="param.equipmentType === 15">
          <LineChart :options="IntelligentWaterMeter"></LineChart>
        </el-col>
        <el-col class="stralsund" v-if="param.equipmentType === 17">
          <Greenbird  :param="param"></Greenbird>
        </el-col>
         <el-col class="stralsund" v-if="param.equipmentType === 18">
         <div>
           <el-select v-model="formInline.line"  @change="changeNodesChart" class="custom-input" style="margin-bottom: 2px;width: 100px;margin-left: 150px;" popper-class="auto-complete" size="mini" :placeholder="$t('placeholder.pleaseChoose')">
            <el-option
              v-for="item in optionNode"
              :key="item.nodeId"
              :label="item.nodeName"
              :value="item.nodeId">
            </el-option>
          </el-select>
         </div>
          <LineChart :options="watermoreChart"></LineChart>
        </el-col>
      </el-col>
      <!-- 808空开 -->
      <el-col :span="24" v-if="param.equipmentType === 1 && ocDevice === 'IO'">
        <el-col class="info"
          ><LineConfiggur
            :param="param"
            @updateData="updateData(arguments)"
          ></LineConfiggur
        ></el-col>
          <el-col class="mantunsci">
           <TcequipmentLine
            :options="volTage"
            :title="volTageTitle"
            :onGetEchartsInstance="onGetEchartsInstance"
          ></TcequipmentLine>
        </el-col>
         <el-col class="mantunsci">
           <TcequipmentLine
            :options="curRents"
            :title="curRentsTitle"
            :onGetEchartsInstance="onGetEchartsInstance"
          ></TcequipmentLine>
        </el-col>
      </el-col>
       <el-col :span="24" v-if="(param.equipmentType === 1||param.equipmentType === 19) && ocDevice !== 'IO'">
        <el-col class="info"
          ><LineConfiggur
            :param="param"
            @updateData="updateData(arguments)"
          ></LineConfiggur
        ></el-col>
        <el-col class="mantunsci">
          <LineChart :options="voltage"  :onGetEchartsInstance="onGetEchartsInstance"></LineChart>
        </el-col>
        <el-col class="mantunsci">
          <LineChart :options="current"  :onGetEchartsInstance="onGetEchartsInstance"></LineChart>
        </el-col>
      </el-col>
      <el-col :span="24"
                  v-if="param.equipmentType === 2 || param.equipmentType === 8"
      >
        <el-col class="info">
          <LineConfiguration :param="param"></LineConfiguration>
        </el-col>
        <el-col class="mantunsci">
          <LineChart
            :options="voltage"
            :onGetEchartsInstance="onGetEchartsInstance"
          ></LineChart>
        </el-col>
        <el-col class="mantunsci">
          <LineChart
            :options="current"
            :onGetEchartsInstance="onGetEchartsInstance"
          ></LineChart>
        </el-col>
      </el-col>
      <el-col :span="24" v-else-if="param.equipmentType === 3">
        <Stralsund :param="param"></Stralsund>
      </el-col>
      <el-col :span="24" v-else-if="param.equipmentType === 4">
        <Level :mac="param.mac"></Level>
      </el-col>
      <el-col :span="24" v-else-if="param.equipmentType === 5">
        <Pressure :mac="param.mac"></Pressure>
      </el-col>
      <el-col :span="24" v-else-if="param.equipmentType === 6">
        <Smoke :mac="param.mac"></Smoke>
      </el-col>
      <el-col :span="24" v-else-if="param.equipmentType === 7">
        <FlammableGas :mac="param.mac"></FlammableGas>
      </el-col>
      <el-col :span="24" v-else-if="param.equipmentType === 10">
        <smokeAlarm :mac="param.mac"></smokeAlarm>
      </el-col>
      <el-col :span="24" v-else-if="param.equipmentType === 11">
        <TemperatureHumiditySensor
          :param="param"
          :online="param.others.online"
        ></TemperatureHumiditySensor>
      </el-col>
      <el-col :span="24" v-else-if="param.equipmentType === 12">
        <SmartMeter
          :mac="param.mac"
          :model="param.model"
          :online="param.others.online"
        ></SmartMeter>
      </el-col>
      <el-col :span="24" v-else-if="param.equipmentType === 13">
        <smokeAlarm :mac="param.mac"></smokeAlarm>
      </el-col>
      <el-col :span="24" v-else-if="param.equipmentType === 14">
        <IlluminanceSensing :param="param"></IlluminanceSensing>
      </el-col>
      <el-col :span="24" v-else-if="param.equipmentType === 15">
        <IntelligentWaterMeter :param="param"></IntelligentWaterMeter>
      </el-col>
      <el-col :span="24" v-else-if="param.equipmentType === 16">
        <MeterReadingCat :param="param"></MeterReadingCat>
      </el-col>
      <el-col
        :span="24"
        v-if="param.equipmentType !== 12 && param.equipmentType !== 16"
      >
        <AlarmRecordList
          @clickAlarm="clickAlarm"
          :mac="param.mac"
          :equipmentType="param.equipmentType"
        ></AlarmRecordList>
      </el-col>
      <el-col
        :span="24"
        v-if="param.equipmentType !== 12 && param.equipmentType !== 16"
      >
        <MaintenanceRecords
          ref="MaintenanceRecords"
          :mac="param.mac"
          :equipmentType="param.equipmentType"
        ></MaintenanceRecords>
      </el-col>
    </el-row>
    <el-dialog
      :modal="false"
      :close-on-click-modal="false"
      custom-class="details-dialog"
      width="1323px"
      lock-scroll="false"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <el-row>
        <el-col :span="5">
          <template>
            <el-table
              :data="tableData"
              height="750"
              v-el_scrollBar:scrollBar
              :cell-style="{ padding: '2px' }"
              style="width: 100%"
            >
              <el-table-column align="center" :label="$t('dialog.channelList')">
                <template slot-scope="scope">
                  <el-button
                    class="c-default"
                    :class="index === scope.$index ? 'listBtn' : ''"
                    @click="handleClick(scope.row, scope.$index)"
                    type="text"
                    >{{ scope.row.title }}</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-col>
        <el-col :span="19" class="tr routeList">
          <el-row>
            <el-row>
              <el-col>
                <span>{{ $t('main.date') + $t('dialog.range') + ':' }}</span>
                <span id="details-popper">
                  <el-date-picker
                    v-model="value1"
                    type="daterange"
                    size="small"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :range-separator="$t('table.to')"
                    :start-placeholder="$t('table.startDate')"
                    :end-placeholder="$t('table.endDate')"
                  >
                  </el-date-picker>
                </span>
                <el-button
                  class="qureyBtn"
                  type="primary"
                  size="small"
                  @click="onSubmit"
                  >{{ $t('btns.query') }}</el-button
                >
              </el-col>
            </el-row>
            <el-row>
              <div style="height: 750px">
                <el-scrollbar style="height: 100%">
                  <div v-if="ocDevice === 'IO'">
                    <!-- 双击进去的图表 -->
                    <el-row  v-if="param.equipmentType === 1">
                      <TcequipmentLine
                        :options="residuals"
                        ref="residuals"
                        :title="residualsTitle"

                      ></TcequipmentLine>
                    </el-row>
                    <el-row  v-if="param.equipmentType === 1">
                      <TcequipmentLine
                        :options="temPeraTure"
                        :title="temPeraTureTitle"

                      ></TcequipmentLine>
                    </el-row>
                    <el-row >
                      <TcequipmentLine
                        :options="volTage"
                        :title="volTageTitle"

                      ></TcequipmentLine>
                    </el-row>
                    <el-row >
                      <TcequipmentLine
                        :options="curRents"
                        :title="curRentsTitle"

                      ></TcequipmentLine>
                    </el-row>
                  </div>
                 <div v-if="ocDevice !== 'IO'">
                    <el-col>
                    <LineChart :options="electricCurrent"></LineChart>
                  </el-col>
                  <el-col>
                    <LineChart :options="lineTemperature"></LineChart>
                  </el-col>
                  <el-col>
                    <LineChart :options="lineVoltage"></LineChart>
                  </el-col>
                  <el-col>
                    <LineChart :options="power"></LineChart>
                  </el-col>
                  <el-col>
                    <LineChart :options="powerFactor"></LineChart>
                  </el-col>
                  <el-col>
                    <LineChart :options="leakageCurrent"></LineChart>
                  </el-col>
                 </div>
                </el-scrollbar>
              </div>
            </el-row>
          </el-row>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
/* global config */
import store from '@/store'
import Info from './Info'
import LineConfiguration from './LineConfiguration'
import AlarmRecordList from './AlarmRecordList'
import MaintenanceRecords from './MaintenanceRecords'
import IntelligentWaterMeter from './IntelligentWaterMeter'
import MeterReadingCat from './MeterReadingCat'
import Stralsund from './Stralsund'
import Pressure from './Pressure'
import Level from './Level'
import Greenbird from './GreenBirdDevice.vue'
import LineConfiggur from './lineConfiggura.vue'
import Smoke from './Smoke'
import FlammableGas from './FlammableGas'
import smokeAlarm from './smokeAlarm'
import TemperatureHumiditySensor from './TemperatureHumiditySensor'
import IlluminanceSensing from './IlluminanceSensing'
import SmartMeter from './SmartMeter'
import LineChart from '../Common/Line'
import TcequipmentLine from '../Common/TcequipmentLine.vue'

import {
  channelHistory,
  norChannelHistory,
  queryForsafeChnllHistory,
  queryTlinkChnlHistory,
  winextlora,
  querySmokeHistory,
  getEffectAddr,
  queryRenkeChnlHistory,
  queryChtqdqMeterReadingDataHistory,
  queryHuaxuChnlHistory
} from '@/api/api'
export default {
  props: {
    param: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      formInline: {
        line: ''
      },
      optionNode: [],
      ocDevice: '',
      watermoreChart: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: '模拟量'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      residualsTitle: '',
      temPeraTureTitle: '',
      volTageTitle: '',
      curRentsTitle: '',
      index: 0,
      dialogVisible: false,
      highlightFalg: false,
      rowAddr: '',
      value1: [this.$func.getNowFormatDate(), this.$func.getNowFormatDate()],
      tableData: [],
      tableDatatitle: '',
      residualCurrent: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text:
            (this.param.equipmentType === 8
              ? this.$t('menu.leakageCurrent')
              : this.$t('system.remaining') + this.$t('main.ampere')) + '(mA)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: this.$store.state.windowHeight / 4 + 'px'
      },
      residuals: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: ''
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: this.$store.state.windowHeight / 4 + 'px'
      },
      voltage: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('main.volt') + '(V)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: this.$store.state.windowHeight / 4 + 'px'
      },
      volTage: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('main.volt') + '(V)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: this.$store.state.windowHeight / 4 + 'px'
      },
      temperature: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('menu.temperature') + '(℃)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: this.$store.state.windowHeight / 4 + 'px'
      },
      temPeraTure: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('menu.temperature') + '(℃)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: this.$store.state.windowHeight / 4 + 'px'
      },
      current: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('main.ampere') + '(A)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: this.$store.state.windowHeight / 4 + 'px'
      },
      curRents: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('main.ampere') + '(A)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: this.$store.state.windowHeight / 4 + 'px'
      },
      stralsund: {
        xAxis: [],
        series: [],
        title: {
          show: true
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      pressure: {
        xAxis: [],
        series: [],
        title: {
          show: true
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      level: {
        xAxis: [],
        series: [],
        title: {
          show: true
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      smoke: {
        xAxis: [],
        series: [],
        title: {
          show: true
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      flammableGas: {
        xAxis: [],
        series: [],
        title: {
          show: true
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      smokeAlarm: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('stralsund.signalIntensity') + '(%)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      smokeVoltage: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('main.volt') + '(V)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      combustibleGas: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('stralsund.concentration') + '(%)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      temperatureSensor: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('menu.temperature') + '(℃)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      humiditySensor: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('menu.humidity') + '(%RH)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      smartMeterVoltage: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('main.volt') + '(V)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      smartMeterAmpere: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('main.ampere') + '(A)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      leakageCurrent: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('menu.leakageCurrent') + '(mA)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      electricCurrent: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('main.ampere') + '(A)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      lineTemperature: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('menu.temperature') + '(℃)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      lineVoltage: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('main.volt') + '(V)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      power: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('main.watt') + '(W)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      powerFactor: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: this.$t('control.powerFactor')
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      Illuminance: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text:
            this.$t('echarts.illumination') +
            this.$t('echarts.celsius') +
            '(Lux)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      IntelligentWaterMeter: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: '吨(t)'
        },
        grid: 40,
        legendDisplay: false,
        splitLine: true,
        time: true,
        height: '213px'
      },
      timerID: null,
      mac: this.$store.state.mac
    }
  },
  mounted () {
    this.init()
    // if (this.param.equipmentType === 18) {
    //   this.queryRenkeChnl()
    // }
    this.$nextTick(() => {
      this.setTimer(this.init, config.pollingInterval.channelHistory * 1000)
      if (this.param.equipmentType === 11 || this.param.equipmentType === 14 || this.param.equipmentType === 18) {
        this.queryRouteList()
        this.setTimer(
          this.queryRenkeChnl,
          config.pollingInterval.queryRenkeChnlHistory * 1000
        )
      } else if (this.param.equipmentType === 15) {
        this.queryHuaxuChnl()
        this.setTimer(
          this.queryHuaxuChnl,
          config.pollingInterval.findHuaxuChannelByMac * 1000
        )
      }
    })
  },
  methods: {
    init () {
      if (
        this.param.equipmentType === 1 ||
         this.param.equipmentType === 19 ||
        this.param.equipmentType === 2 ||
        this.param.equipmentType === 8
      ) {
        if (this.$store.state.detailsAddr === '') {
          return false
        } else {
          if (this.param.equipmentType === 8) {
            this.queryWinextlora()
          } else {
            this.queryChannelHistory()
          }
        }
      } else if (this.param.equipmentType === 6) {
        this.querySmoke()
      } else if (this.param.equipmentType === 12) {
        this.queryChtqdqMeterReadingData()
      }
    },
    updateData (val) {
      // console.log(this.$refs.residuals, val, '======updateData')
      this.residualsTitle = val[0]
      this.temPeraTureTitle = val[1]
      this.volTageTitle = val[2]
      this.curRentsTitle = val[3]
      this.ocDevice = val[4]
    },
    clickAlarm () {
      this.$refs.MaintenanceRecords.init()
    },
    onGetEchartsInstance (echart) {
      if (this.param.equipmentType === 1 || this.param.equipmentType === 2 || this.param.equipmentType === 19) {
        echart.getZr().off('dblclick')
        echart.getZr().on('dblclick', () => {
          this.dialogVisible = true

          this.queryRouteList()
        })
      }
    },
    changeNodesChart (val) {
      // console.log(val, '=======节点')
      store.commit('nodeId', val)
      this.queryRenkeChnl()
    },
    queryRouteList () {
      let params = {
        mac: this.mac
      }
      getEffectAddr(params).then(res => {
        if (res.success) {
          // console.log(res, '=========nodeID')
          if (res.datas.length > 0) {
            this.tableData = res.datas
            this.tableDatatitle = this.tableData[0].title
            this.formInline.line = res.datas[0].nodeName
            this.optionNode = res.datas
            // console.log(this.tableDatatitle)
            // console.log(res.datas, '=====res.datas')
            if (this.param.equipmentType === (1 || 2 || 19)) {
              this.queryLineListData(this.tableData[0].addr)
            } else if (
              this.param.equipmentType === 11 ||
              this.param.equipmentType === 18 ||
              this.param.equipmentType === 14
            ) {
              store.commit('nodeId', this.tableData[0].nodeId)
              this.queryRenkeChnl()
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
    },
    handleClick (row, rowindex) {
      this.index = rowindex
      this.queryLineListData(row.addr)
      this.rowAddr = row.addr
    },
    onSubmit () {
      // this.value1 ? store.commit('historyDate', this.value1) : store.commit('historyDate', [this.$func.getNowFormatDate(), this.$func.getNowFormatDate()])
      // console.log(this.$store.state.historyDate, '====this.$store.state.historyDate')
      console.log(this.value1)
      if (!this.value1) {
        this.$message({
          message: '请先选择时间',
          type: 'error'
        })
        return false
      }
      let addr = this.rowAddr !== '' ? this.rowAddr : this.tableData[0].addr
      this.queryLineListData(addr)
    },
    queryLineListData (addr) {
      let params = {
        mac: this.mac,
        startTime: this.value1[0],
        endTime: this.value1[1],
        addr: addr
      }
      channelHistory(params)
        .then(res => {
          if (res.success) {
            let xAxis = res.data.xAxis
            // console.log(res, '===dierge')
            if (res.data.analogIn1) {
              // this.ocDevice = 'IO'
            } else {
              this.electricCurrent.xAxis = xAxis
              this.lineTemperature.xAxis = xAxis
              this.lineVoltage.xAxis = xAxis
              this.power.xAxis = xAxis
              this.powerFactor.xAxis = xAxis
              this.leakageCurrent.xAxis = xAxis
            }

            if (res.data.lstGLd) {
              this.leakageCurrent.series = [
                {
                  name: this.$t('menu.leakageCurrent'),
                  type: 'line',
                  data: res.data.lstGLd,
                  smooth: true,
                  showAllSymbol: true,
                  symbolSize: 2
                }
              ]
            } else {
              this.leakageCurrent.series = []
            }
            if (res.data.lstGV) {
              if (!res.data.lstAV) {
                this.lineVoltage.series = [
                  {
                    name: this.$t('main.volt'),
                    type: 'line',
                    data: res.data.lstGV,
                    color: '#71e1e4',
                    lineStyle: { color: '#71e1e4' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  }
                ]
                // console.log(res.data.lstGV, '======== this.lineVoltage')
              } else {
                this.lineVoltage.series = [
                  {
                    name: this.$t('main.volt'),
                    type: 'line',
                    data: res.data.lstGV,
                    color: '#e062ea',
                    lineStyle: { color: '#e062ae' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name: 'A' + this.$t('control.phase') + this.$t('main.volt'),
                    type: 'line',
                    data: res.data.lstAV,
                    color: '#71e1e4',
                    lineStyle: { color: '#71e1e4' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name: 'B' + this.$t('control.phase') + this.$t('main.volt'),
                    type: 'line',
                    data: res.data.lstBV,
                    color: '#ffdb5c',
                    lineStyle: { color: '#ffdb5c' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name: 'C' + this.$t('control.phase') + this.$t('main.volt'),
                    type: 'line',
                    data: res.data.lstCV,
                    color: '#c23531',
                    lineStyle: { color: '#c23531' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  }
                ]
              }
            } else {
              this.lineVoltage.series = []
            }
            if (res.data.lstGA) {
              if (!res.data.lstAA) {
                this.electricCurrent.series = [
                  {
                    name: this.$t('main.ampere'),
                    type: 'line',
                    data: res.data.lstGA,
                    color: '#71e1e4',
                    lineStyle: { color: '#71e1e4' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  }
                ]
                // console.log(this.electricCurrent, '====== this.electricCurrent')
              } else {
                this.electricCurrent.series = [
                  {
                    name: this.$t('main.ampere'),
                    type: 'line',
                    data: res.data.lstGA,
                    color: '#e062ea',
                    lineStyle: { color: '#e062ae' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name:
                      'A' + this.$t('control.phase') + this.$t('main.ampere'),
                    type: 'line',
                    data: res.data.lstAA,
                    color: '#71e1e4',
                    lineStyle: { color: '#71e1e4' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name:
                      'B' + this.$t('control.phase') + this.$t('main.ampere'),
                    type: 'line',
                    data: res.data.lstBA,
                    color: '#ffdb5c',
                    lineStyle: { color: '#ffdb5c' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name:
                      'C' + this.$t('control.phase') + this.$t('main.ampere'),
                    type: 'line',
                    data: res.data.lstCA,
                    color: '#c23531',
                    lineStyle: { color: '#c23531' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  }
                ]
              }
            } else {
              this.electricCurrent.series = []
            }
            if (res.data.lstGT) {
              if (!res.data.lstAT) {
                this.lineTemperature.series = [
                  {
                    name: this.$t('menu.temperature'),
                    type: 'line',
                    data: res.data.lstGT,
                    color: '#71e1e4',
                    lineStyle: { color: '#71e1e4' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  }
                ]
                // console.log(res.data.lstGT, '==========温度')
              } else {
                this.lineTemperature.series = [
                  {
                    name: this.$t('menu.temperature'),
                    type: 'line',
                    data: res.data.lstGT,
                    color: '#e062ea',
                    lineStyle: { color: '#e062ae' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name:
                      'A' +
                      this.$t('control.phase') +
                      this.$t('menu.temperature'),
                    type: 'line',
                    data: res.data.lstAT,
                    color: '#71e1e4',
                    lineStyle: { color: '#71e1e4' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name:
                      'B' +
                      this.$t('control.phase') +
                      this.$t('menu.temperature'),
                    type: 'line',
                    data: res.data.lstBT,
                    color: '#ffdb5c',
                    lineStyle: { color: '#ffdb5c' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name:
                      'C' +
                      this.$t('control.phase') +
                      this.$t('menu.temperature'),
                    type: 'line',
                    data: res.data.lstCT,
                    color: '#c23531',
                    lineStyle: { color: '#c23531' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  }
                ]
              }
            } else {
              this.lineTemperature.series = []
            }
            if (res.data.lstGW) {
              if (!res.data.lstAT) {
                this.power.series = [
                  {
                    name: this.$t('main.watt'),
                    type: 'line',
                    data: res.data.lstGW,
                    color: '#71e1e4',
                    lineStyle: { color: '#71e1e4' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  }
                ]
              } else {
                this.power.series = [
                  {
                    name: this.$t('main.watt'),
                    type: 'line',
                    data: res.data.lstGW,
                    color: '#e062ea',
                    lineStyle: { color: '#e062ae' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name: 'A' + this.$t('control.phase') + this.$t('main.watt'),
                    type: 'line',
                    data: res.data.lstAW,
                    color: '#71e1e4',
                    lineStyle: { color: '#71e1e4' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name: 'B' + this.$t('control.phase') + this.$t('main.watt'),
                    type: 'line',
                    data: res.data.lstBW,
                    color: '#ffdb5c',
                    lineStyle: { color: '#ffdb5c' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name: 'C' + this.$t('control.phase') + this.$t('main.watt'),
                    type: 'line',
                    data: res.data.lstCW,
                    color: '#c23531',
                    lineStyle: { color: '#c23531' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  }
                ]
              }
            } else {
              this.power.series = []
            }
            if (res.data.lstGPF) {
              if (!res.data.lstAPF) {
                this.powerFactor.title.text = this.$t('control.powerFactor')
                this.powerFactor.series = [
                  {
                    name: this.$t('control.powerFactor'),
                    type: 'line',
                    data: res.data.lstGPF,
                    color: '#71e1e4',
                    lineStyle: { color: '#71e1e4' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  }
                ]
              } else {
                this.powerFactor.title.text = this.$t(
                  'control.combinedPowerFactor'
                )
                this.powerFactor.series = [
                  {
                    name: this.$t('control.combinedPowerFactor'),
                    type: 'line',
                    data: res.data.lstGPF,
                    color: '#e062ea',
                    lineStyle: { color: '#e062ae' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name:
                      'A' +
                      this.$t('control.phase') +
                      this.$t('control.combinedPowerFactor'),
                    type: 'line',
                    data: res.data.lstAPF,
                    color: '#71e1e4',
                    lineStyle: { color: '#71e1e4' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name:
                      'B' +
                      this.$t('control.phase') +
                      this.$t('control.combinedPowerFactor'),
                    type: 'line',
                    data: res.data.lstBPF,
                    color: '#ffdb5c',
                    lineStyle: { color: '#ffdb5c' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name:
                      'C' +
                      this.$t('control.phase') +
                      this.$t('control.combinedPowerFactor'),
                    type: 'line',
                    data: res.data.lstCPF,
                    color: '#c23531',
                    lineStyle: { color: '#c23531' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  }
                ]
              }
            } else {
              this.powerFactor.title.text = this.$t('control.powerFactor')
              this.powerFactor.series = ['']
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
    queryChannelHistory () {
      let params = {
        mac: this.param.mac,
        addr: this.$store.state.detailsAddr,
        startTime: this.$store.state.historyDate
          ? this.$store.state.historyDate
          : this.$func.getNowFormatDate(),
        endTime: this.$store.state.historyDate
          ? this.$store.state.historyDate
          : this.$func.getNowFormatDate()
      }
      // console.log(this.$store.state.historyDate, '========params')
      channelHistory(params)
        .then(res => {
          if (res.success) {
            let xAxis = res.data.xAxis.map(function (str) {
              return str.split(' ')[1]
            })
            // console.log(res, '=================res')
            this.residualCurrent.xAxis = xAxis
            this.residuals.xAxis = xAxis
            this.voltage.xAxis = xAxis
            this.volTage.xAxis = xAxis
            this.temperature.xAxis = xAxis
            this.temPeraTure.xAxis = xAxis
            this.current.xAxis = xAxis
            this.curRents.xAxis = xAxis
            if (res.data.analogIn1) {
              // this.ocDevice = 'IO'
            }
            if (res.data.lstGLd || res.data.analogIn1) {
              this.residualCurrent.series = [
                {
                  name: this.$t('system.remaining') + this.$t('main.ampere'),
                  type: 'line',
                  data: res.data.lstGLd,
                  smooth: true,
                  showAllSymbol: true,
                  symbolSize: 2
                },
                {
                  name: this.$t('table.status'),
                  type: 'line',
                  data: res.data.ocList,
                  color: '#909399',
                  smooth: false,
                  showAllSymbol: false,
                  symbolSize: 0,
                  lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                }
              ]
              this.residuals.series = [
                {
                  name: '输入模拟量1',
                  type: 'line',
                  data: res.data.analogIn1,
                  smooth: true,
                  showAllSymbol: true,
                  symbolSize: 2
                }

              ]
            } else {
              this.residuals.series = []
            }
            if (res.data.lstGV || res.data.analogIn3) {
              if (!res.data.lstAV) {
                this.voltage.series = [
                  {
                    name: this.$t('main.volt'),
                    type: 'line',
                    data: res.data.lstGV,
                    color: '#71e1e4',
                    lineStyle: { color: '#71e1e4' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name: this.$t('table.status'),
                    type: 'line',
                    data: res.data.ocList,
                    color: '#909399',
                    smooth: false,
                    showAllSymbol: false,
                    symbolSize: 0,
                    lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                  }
                ]
                this.volTage.series = [
                  {
                    name: '模拟输入量3',
                    type: 'line',
                    data: res.data.analogIn2,
                    color: '#71e1e4',
                    lineStyle: { color: '#71e1e4' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  }
                  // {
                  //   name: this.$t('table.status'),
                  //   type: 'line',
                  //   data: res.data.ocList,
                  //   color: '#909399',
                  //   smooth: false,
                  //   showAllSymbol: false,
                  //   symbolSize: 0,
                  //   lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                  // }
                ]
              } else {
                this.voltage.series = [
                  {
                    name: this.$t('main.volt'),
                    type: 'line',
                    data: res.data.lstGV,
                    color: '#e062ea',
                    lineStyle: { color: '#e062ae' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name: 'A' + this.$t('control.phase') + this.$t('main.volt'),
                    type: 'line',
                    data: res.data.lstAV,
                    color: '#71e1e4',
                    lineStyle: { color: '#71e1e4' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name: 'B' + this.$t('control.phase') + this.$t('main.volt'),
                    type: 'line',
                    data: res.data.lstBV,
                    color: '#ffdb5c',
                    lineStyle: { color: '#ffdb5c' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name: 'C' + this.$t('control.phase') + this.$t('main.volt'),
                    type: 'line',
                    data: res.data.lstCV,
                    color: '#c23531',
                    lineStyle: { color: '#c23531' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name: this.$t('table.status'),
                    type: 'line',
                    data: res.data.ocList,
                    color: '#909399',
                    smooth: false,
                    showAllSymbol: false,
                    symbolSize: 0,
                    lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                  }
                ]
                this.volTage.series = [
                  {
                    name: '模拟输入量3',
                    type: 'line',
                    data: res.data.analogIn3,
                    color: '#e062ea',
                    lineStyle: { color: '#e062ae' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  }
                  // {
                  //   name: 'A' + this.$t('control.phase') + this.$t('main.volt'),
                  //   type: 'line',
                  //   data: res.data.lstAV,
                  //   color: '#71e1e4',
                  //   lineStyle: { color: '#71e1e4' },
                  //   smooth: true,
                  //   showAllSymbol: true,
                  //   symbolSize: 2
                  // },
                  // {
                  //   name: 'B' + this.$t('control.phase') + this.$t('main.volt'),
                  //   type: 'line',
                  //   data: res.data.lstBV,
                  //   color: '#ffdb5c',
                  //   lineStyle: { color: '#ffdb5c' },
                  //   smooth: true,
                  //   showAllSymbol: true,
                  //   symbolSize: 2
                  // },
                  // {
                  //   name: 'C' + this.$t('control.phase') + this.$t('main.volt'),
                  //   type: 'line',
                  //   data: res.data.lstCV,
                  //   color: '#c23531',
                  //   lineStyle: { color: '#c23531' },
                  //   smooth: true,
                  //   showAllSymbol: true,
                  //   symbolSize: 2
                  // },
                  // {
                  //   name: this.$t('table.status'),
                  //   type: 'line',
                  //   data: res.data.ocList,
                  //   color: '#909399',
                  //   smooth: false,
                  //   showAllSymbol: false,
                  //   symbolSize: 0,
                  //   lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                  // }
                ]
              }
            } else {
              this.voltage.series = []
              this.volTage.series = []
            }
            if (res.data.lstGT || res.data.analogIn2) {
              if (!res.data.lstAT) {
                this.temperature.series = [
                  {
                    name: this.$t('menu.temperature'),
                    type: 'line',
                    data: res.data.lstGT,
                    color: '#71e1e4',
                    lineStyle: { color: '#71e1e4' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name: this.$t('table.status'),
                    type: 'line',
                    data: res.data.ocList,
                    color: '#909399',
                    smooth: false,
                    showAllSymbol: false,
                    symbolSize: 0,
                    lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                  }
                ]
                this.temPeraTure.series = [
                  {
                    name: '模拟输入量2',
                    type: 'line',
                    data: res.data.analogIn2,
                    color: '#71e1e4',
                    lineStyle: { color: '#71e1e4' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  }
                  // {
                  //   name: this.$t('table.status'),
                  //   type: 'line',
                  //   data: res.data.ocList,
                  //   color: '#909399',
                  //   smooth: false,
                  //   showAllSymbol: false,
                  //   symbolSize: 0,
                  //   lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                  // }
                ]
              } else {
                this.temperature.series = [
                  {
                    name: this.$t('menu.temperature'),
                    type: 'line',
                    data: res.data.lstGT,
                    color: '#e062ea',
                    lineStyle: { color: '#e062ae' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name:
                      'A' +
                      this.$t('control.phase') +
                      this.$t('menu.temperature'),
                    type: 'line',
                    data: res.data.lstAT,
                    color: '#71e1e4',
                    lineStyle: { color: '#71e1e4' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name:
                      'B' +
                      this.$t('control.phase') +
                      this.$t('menu.temperature'),
                    type: 'line',
                    data: res.data.lstBT,
                    color: '#ffdb5c',
                    lineStyle: { color: '#ffdb5c' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name:
                      'C' +
                      this.$t('control.phase') +
                      this.$t('menu.temperature'),
                    type: 'line',
                    data: res.data.lstCT,
                    color: '#c23531',
                    lineStyle: { color: '#c23531' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name: this.$t('table.status'),
                    type: 'line',
                    data: res.data.ocList,
                    color: '#909399',
                    smooth: false,
                    showAllSymbol: false,
                    symbolSize: 0,
                    lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                  }
                ]
                this.temPeraTure.series = [
                  {
                    name: '模拟输入量2',
                    type: 'line',
                    data: res.data.analogIn2,
                    color: '#e062ea',
                    lineStyle: { color: '#e062ae' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  }
                  // {
                  //   name:
                  //     'A' +
                  //     this.$t('control.phase') +
                  //     this.$t('menu.temperature'),
                  //   type: 'line',
                  //   data: res.data.lstAT,
                  //   color: '#71e1e4',
                  //   lineStyle: { color: '#71e1e4' },
                  //   smooth: true,
                  //   showAllSymbol: true,
                  //   symbolSize: 2
                  // },
                  // {
                  //   name:
                  //     'B' +
                  //     this.$t('control.phase') +
                  //     this.$t('menu.temperature'),
                  //   type: 'line',
                  //   data: res.data.lstBT,
                  //   color: '#ffdb5c',
                  //   lineStyle: { color: '#ffdb5c' },
                  //   smooth: true,
                  //   showAllSymbol: true,
                  //   symbolSize: 2
                  // },
                  // {
                  //   name:
                  //     'C' +
                  //     this.$t('control.phase') +
                  //     this.$t('menu.temperature'),
                  //   type: 'line',
                  //   data: res.data.lstCT,
                  //   color: '#c23531',
                  //   lineStyle: { color: '#c23531' },
                  //   smooth: true,
                  //   showAllSymbol: true,
                  //   symbolSize: 2
                  // },
                  // {
                  //   name: this.$t('table.status'),
                  //   type: 'line',
                  //   data: res.data.ocList,
                  //   color: '#909399',
                  //   smooth: false,
                  //   showAllSymbol: false,
                  //   symbolSize: 0,
                  //   lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                  // }
                ]
              }
            } else {
              this.temperature.series = []
              this.temPeraTure.series = []
            }
            if (res.data.lstGA || res.data.analogIn4) {
              if (!res.data.lstAA) {
                this.current.series = [
                  {
                    name: this.$t('control.current'),
                    type: 'line',
                    data: res.data.lstGA,
                    color: '#71e1e4',
                    lineStyle: { color: '#71e1e4' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name: this.$t('table.status'),
                    type: 'line',
                    data: res.data.ocList,
                    color: '#909399',
                    smooth: false,
                    showAllSymbol: false,
                    symbolSize: 0,
                    lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                  }
                ]
                this.curRents.series = [
                  {
                    name: '模拟输入量4',
                    type: 'line',
                    data: res.data.analogIn4,
                    color: '#71e1e4',
                    lineStyle: { color: '#71e1e4' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name: this.$t('table.status'),
                    type: 'line',
                    data: res.data.ocList,
                    color: '#909399',
                    smooth: false,
                    showAllSymbol: false,
                    symbolSize: 0,
                    lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                  }
                ]
              } else {
                this.current.series = [
                  {
                    name: this.$t('control.current'),
                    type: 'line',
                    data: res.data.lstGA,
                    color: '#e062ea',
                    lineStyle: { color: '#e062ae' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name:
                      'A' +
                      this.$t('control.phase') +
                      this.$t('control.current'),
                    type: 'line',
                    data: res.data.lstAA,
                    color: '#71e1e4',
                    lineStyle: { color: '#71e1e4' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name:
                      'B' +
                      this.$t('control.phase') +
                      this.$t('control.current'),
                    type: 'line',
                    data: res.data.lstBA,
                    color: '#ffdb5c',
                    lineStyle: { color: '#ffdb5c' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name:
                      'C' +
                      this.$t('control.phase') +
                      this.$t('control.current'),
                    type: 'line',
                    data: res.data.lstCA,
                    color: '#c23531',
                    lineStyle: { color: '#c23531' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  },
                  {
                    name: this.$t('table.status'),
                    type: 'line',
                    data: res.data.ocList,
                    color: '#909399',
                    smooth: false,
                    showAllSymbol: false,
                    symbolSize: 0,
                    lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                  }
                ]
                this.curRents.series = [
                  {
                    name: '模拟输入量4',
                    type: 'line',
                    data: res.data.analogIn4,
                    color: '#e062ea',
                    lineStyle: { color: '#e062ae' },
                    smooth: true,
                    showAllSymbol: true,
                    symbolSize: 2
                  }
                  // {
                  //   name:
                  //     'A' +
                  //     this.$t('control.phase') +
                  //     this.$t('control.current'),
                  //   type: 'line',
                  //   data: res.data.lstAA,
                  //   color: '#71e1e4',
                  //   lineStyle: { color: '#71e1e4' },
                  //   smooth: true,
                  //   showAllSymbol: true,
                  //   symbolSize: 2
                  // },
                  // {
                  //   name:
                  //     'B' +
                  //     this.$t('control.phase') +
                  //     this.$t('control.current'),
                  //   type: 'line',
                  //   data: res.data.lstBA,
                  //   color: '#ffdb5c',
                  //   lineStyle: { color: '#ffdb5c' },
                  //   smooth: true,
                  //   showAllSymbol: true,
                  //   symbolSize: 2
                  // },
                  // {
                  //   name:
                  //     'C' +
                  //     this.$t('control.phase') +
                  //     this.$t('control.current'),
                  //   type: 'line',
                  //   data: res.data.lstCA,
                  //   color: '#c23531',
                  //   lineStyle: { color: '#c23531' },
                  //   smooth: true,
                  //   showAllSymbol: true,
                  //   symbolSize: 2
                  // },
                  // {
                  //   name: this.$t('table.status'),
                  //   type: 'line',
                  //   data: res.data.ocList,
                  //   color: '#909399',
                  //   smooth: false,
                  //   showAllSymbol: false,
                  //   symbolSize: 0,
                  //   lineStyle: { width: 0, color: 'rgba(0, 0, 0, 0)' }
                  // }
                ]
              }
            } else {
              this.current.series = []
              this.curRents.series = []
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
        .finally(() => {})
    },
    queryStralsund () {
      if (this.$store.state.stralsundObj.length === 0) return false
      let params = {
        mac: this.$store.state.stralsundObj.mac,
        dataCategory: this.$store.state.stralsundObj.dataCategory,
        loopType: this.$store.state.stralsundObj.loopType,
        loopAddr: this.$store.state.stralsundObj.loopAddr,
        startTime: this.$store.state.historyDate
          ? this.$store.state.historyDate
          : this.$func.getNowFormatDate(),
        endTime: this.$store.state.historyDate
          ? this.$store.state.historyDate
          : this.$func.getNowFormatDate()
      }
      norChannelHistory(params)
        .then(res => {
          if (res.success) {
            let xAxis = res.data.xAxis.map(function (str) {
              return str.split(' ')[1]
            })
            this.stralsund.xAxis = xAxis
            this.stralsund.series = [
              {
                type: 'line',
                data: res.data[this.$store.state.stralsundObj.loopAddr]
              }
            ]
            if (this.$store.state.stralsundObj.loopType === 0) {
              this.stralsund.series[0].name =
                this.$t('control.smoke') + this.$t('control.loop')
              this.stralsund.title.text =
                this.$t('control.smoke') + this.$t('control.loop')
            } else if (this.$store.state.stralsundObj.loopType === 1) {
              this.stralsund.series[0].name =
                this.$t('main.volt') + this.$t('control.loop')
              this.stralsund.title.text =
                this.$t('main.volt') + this.$t('control.loop')
            } else if (this.$store.state.stralsundObj.loopType === 2) {
              this.stralsund.series[0].name =
                this.$t('control.leakage') + this.$t('control.loop')
              this.stralsund.title.text =
                this.$t('control.leakage') + this.$t('control.loop')
            } else if (this.$store.state.stralsundObj.loopType === 4) {
              this.stralsund.series[0].name =
                this.$t('menu.temperature') + this.$t('control.loop')
              this.stralsund.title.text =
                this.$t('menu.temperature') + this.$t('control.loop')
            } else if (this.$store.state.stralsundObj.loopType === 8) {
              this.stralsund.series[0].name =
                this.$t('control.current') + this.$t('control.loop')
              this.stralsund.title.text =
                this.$t('control.current') + this.$t('control.loop')
            } else if (this.$store.state.stralsundObj.loopType === 17) {
              this.stralsund.series[0].name =
                this.$t('control.pressure') + this.$t('control.loop')
              this.stralsund.title.text =
                this.$t('control.pressure') + this.$t('control.loop')
            } else if (this.$store.state.stralsundObj.loopType === 18) {
              this.stralsund.series[0].name =
                this.$t('control.level') + this.$t('control.loop')
              this.stralsund.title.text =
                this.$t('control.level') + this.$t('control.loop')
            } else if (this.$store.state.stralsundObj.loopType === 32) {
              this.stralsund.series[0].name =
                this.$t('control.ratedCurrent') + this.$t('control.loop')
              this.stralsund.title.text =
                this.$t('control.ratedCurrent') + this.$t('control.loop')
            } else if (this.$store.state.stralsundObj.loopType === 33) {
              this.stralsund.series[0].name =
                this.$t('control.electricity') + this.$t('control.loop')
              this.stralsund.title.text =
                this.$t('control.electricity') + this.$t('control.loop')
            } else if (this.$store.state.stralsundObj.loopType === 34) {
              this.stralsund.series[0].name =
                this.$t('control.activePower') + this.$t('control.loop')
              this.stralsund.title.text =
                this.$t('control.activePower') + this.$t('control.loop')
            } else if (this.$store.state.stralsundObj.loopType === 35) {
              this.stralsund.series[0].name =
                this.$t('control.powerFactor') + this.$t('control.loop')
              this.stralsund.title.text =
                this.$t('control.powerFactor') + this.$t('control.loop')
            } else if (this.$store.state.stralsundObj.loopType === 40) {
              this.stralsund.series[0].name =
                this.$t('control.battery') +
                this.$t('menu.electricity') +
                this.$t('control.loop')
              this.stralsund.title.text =
                this.$t('control.battery') +
                this.$t('menu.electricity') +
                this.$t('control.loop')
            } else if (this.$store.state.stralsundObj.loopType === 41) {
              this.stralsund.series[0].name =
                this.$t('control.signal') + this.$t('control.loop')
              this.stralsund.title.text =
                this.$t('control.signal') + this.$t('control.loop')
            } else {
              this.stralsund.series[0].name = ''
              this.stralsund.title.text = ''
            }
            if (this.stralsund.series[0].name !== '') {
              this.stralsund.series[0].name += this.$store.state.stralsundObj.loopAddr
              this.stralsund.title.text += this.$store.state.stralsundObj.loopAddr
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
        .finally(() => {})
    },
    queryPressure () {
      let params = {
        mac: this.$store.state.pressureObj.mac,
        time: this.$store.state.historyDate
          ? this.$store.state.historyDate
          : this.$func.getNowFormatDate()
      }
      queryTlinkChnlHistory(params)
        .then(res => {
          if (res.success) {
            let xAxis = []
            if (JSON.stringify(res.data) !== '{}') {
              xAxis = res.data.timeAxis.map(function (str) {
                return str.split(' ')[1]
              })
              this.pressure.xAxis = xAxis
              if (this.$store.state.pressureObj.type === 't') {
                this.pressure.series = [
                  { type: 'line', data: res.data['t-yAxis'] }
                ]
                this.pressure.series[0].name = this.$t('menu.temperature')
                this.pressure.title.text = this.$t('menu.temperature')
              } else if (this.$store.state.pressureObj.type === 'f') {
                this.pressure.series = [
                  { type: 'line', data: res.data['f-yAxis'] }
                ]
                this.pressure.series[0].name = this.$t('control.pressure')
                this.pressure.title.text = this.$t('control.pressure')
              } else {
                this.pressure.series = [
                  { type: 'line', data: res.data['t-yAxis'] }
                ]
                this.pressure.series[0].name = this.$t('menu.temperature')
                this.pressure.title.text = this.$t('menu.temperature')
              }
            } else {
              this.pressure.xAxis = []
              this.pressure.series = [{ type: 'line', data: [] }]
              if (this.$store.state.pressureObj.type === 't') {
                this.pressure.series[0].name = this.$t('menu.temperature')
                this.pressure.title.text = this.$t('menu.temperature')
              } else {
                this.pressure.series[0].name = this.$t('control.pressure')
                this.pressure.title.text = this.$t('control.pressure')
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
        .finally(() => {})
    },
    queryLevel () {
      let params = {
        mac: this.$store.state.levelObj.mac,
        time: this.$store.state.historyDate
          ? this.$store.state.historyDate
          : this.$func.getNowFormatDate()
      }
      queryTlinkChnlHistory(params)
        .then(res => {
          if (res.success) {
            if (JSON.stringify(res.data) !== '{}') {
              let xAxis = res.data.timeAxis.map(function (str) {
                return str.split(' ')[1]
              })
              this.level.xAxis = xAxis
              if (this.$store.state.levelObj.type === 't') {
                this.level.series = [
                  { type: 'line', data: res.data['t-yAxis'] }
                ]
                this.level.series[0].name = this.$t('menu.temperature')
                this.level.title.text = this.$t('menu.temperature')
              } else if (this.$store.state.levelObj.type === 'f') {
                this.level.series = [
                  { type: 'line', data: res.data['f-yAxis'] }
                ]
                this.level.series[0].name = this.$t('control.level')
                this.level.title.text = this.$t('control.level')
              } else {
                this.level.series = [
                  { type: 'line', data: res.data['t-yAxis'] }
                ]
                this.level.series[0].name = this.$t('menu.temperature')
                this.level.title.text = this.$t('menu.temperature')
              }
            } else {
              this.level.xAxis = []
              this.level.series = [{ type: 'line', data: [] }]
              if (this.$store.state.levelObj.type === 't') {
                this.level.series[0].name = this.$t('menu.temperature')
                this.level.title.text = this.$t('menu.temperature')
              } else {
                this.level.series[0].name = this.$t('control.level')
                this.level.title.text = this.$t('control.level')
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
        .finally(() => {})
    },
    querySmoke () {
      if (!this.$store.state.smokeObj.mac) return false
      let params = {
        mac: this.$store.state.smokeObj.mac,
        msgType: this.$store.state.smokeObj.msgType,
        yearMonth: this.$store.state.historyDate
          ? this.$store.state.historyDate
          : this.$func.getCurrentYearMonth()
      }
      queryForsafeChnllHistory(params)
        .then(res => {
          if (res.success) {
            this.smoke.xAxis = res.data.timeAxis
            this.smoke.series = [
              {
                type: 'line',
                name: this.$t('menu.electricity'),
                data: res.data.yAxis
              }
            ]
            this.smoke.title.text = this.$t('menu.electricity')
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
        .finally(() => {})
    },
    querysmokeAlarm () {
      let params = {
        mac: this.$store.state.smokeAlarmObj.mac,
        time: this.$store.state.historyDate
          ? this.$store.state.historyDate
          : this.$func.getNowFormatDate()
      }
      querySmokeHistory(params)
        .then(res => {
          if (res.success) {
            if (JSON.stringify(res.data) !== '{}') {
              let xAxis = res.data.timeList.map(function (str) {
                return str.split(' ')[1]
              })
              this.smokeAlarm.xAxis = xAxis
              this.smokeVoltage.xAxis = xAxis
              this.combustibleGas.xAxis = xAxis
              this.smokeAlarm.series = [
                {
                  type: 'line',
                  name: this.$t('stralsund.signalIntensity'),
                  data: res.data.signalList
                }
              ]
              this.smokeAlarm.title.text =
                this.$t('stralsund.signalIntensity') + '(%)'
              this.smokeVoltage.series = [
                {
                  type: 'line',
                  name: this.$t('main.volt'),
                  data: res.data.voltageList
                }
              ]
              this.smokeVoltage.title.text = this.$t('main.volt') + '(V)'
              this.combustibleGas.series = [
                {
                  type: 'line',
                  name: this.$t('stralsund.concentration'),
                  data: res.data.concentrationList
                }
              ]
              this.combustibleGas.title.text =
                this.$t('stralsund.concentration') + '(%)'
            } else {
              this.smokeAlarm.xAxis = []
              this.smokeVoltage.xAxis = []
              this.combustibleGas.xAxis = []
              this.smokeAlarm.series = [{ type: 'line', data: [] }]
              this.smokeVoltage.series = [{ type: 'line', data: [] }]
              this.combustibleGas.series = [{ type: 'line', data: [] }]
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
    queryRenkeChnl () {
      let parmas = {
        mac: this.$store.state.mac,
        nodeId: this.$store.state.nodeId
          ? this.$store.state.nodeId
          : this.tableData[0].nodeId,
        time: this.$store.state.historyDate
          ? this.$store.state.historyDate
          : this.$func.getCurrentYearMonth()
      }
      queryRenkeChnlHistory(parmas)
        .then(res => {
          if (res.success) {
            let xAxis = []
            if (JSON.stringify(res.data) !== '{}') {
              xAxis = res.data.timeList.map(function (str) {
                return str.split(' ')[1]
              })
            }
            this.watermoreChart.xAxis = xAxis
            this.temperatureSensor.xAxis = xAxis
            this.humiditySensor.xAxis = xAxis
            this.Illuminance.xAxis = xAxis
            this.watermoreChart.series = [
              {
                name: '模拟量',
                type: 'line',
                data: res.data.humList,
                smooth: true
              }
            ]
            this.temperatureSensor.series = [
              {
                name: this.$t('menu.temperature'),
                type: 'line',
                data: res.data.temList,
                smooth: true
              }
            ]
            this.humiditySensor.series = [
              {
                name: this.$t('menu.humidity'),
                type: 'line',
                data: res.data.humList,
                smooth: true
              }
            ]
            this.Illuminance.series = [
              {
                name:
                  this.$t('echarts.illumination') + this.$t('echarts.celsius'),
                type: 'line',
                data: res.data.temList,
                smooth: true
              }
            ]
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
        .finally(() => {})
    },
    queryFlammableGas () {
      let params = {
        mac: this.$store.state.flammableGasObj.mac,
        msgType: this.$store.state.flammableGasObj.msgType,
        yearMonth: this.$store.state.historyDate
          ? this.$store.state.historyDate
          : this.$func.getCurrentYearMonth()
      }
      queryForsafeChnllHistory(params)
        .then(res => {
          if (res.success) {
            this.flammableGas.xAxis = res.data.timeAxis
            this.flammableGas.series = [
              {
                type: 'line',
                name: this.$t('stralsund.concentration'),
                data: res.data.yAxis
              }
            ]
            this.flammableGas.title.text = this.$t('stralsund.concentration')
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
        .finally(() => {})
    },
    queryWinextlora () {
      let params = {
        mac: this.param.mac,
        addr: this.$store.state.detailsAddr,
        time: this.$store.state.historyDate
          ? this.$store.state.historyDate
          : this.$func.getNowFormatDate()
      }
      winextlora(params)
        .then(res => {
          if (res.success) {
            let xAxis = []
            if (JSON.stringify(res.data) !== '{}') {
              xAxis = res.data.xAxis.map(function (str) {
                return str.split(' ')[1]
              })
            }
            this.residualCurrent.xAxis = xAxis
            this.voltage.xAxis = xAxis
            this.temperature.xAxis = xAxis
            this.current.xAxis = xAxis
            this.residualCurrent.series = [
              {
                name: this.$t('menu.leakageCurrent'),
                type: 'line',
                data: res.data.lstLki,
                smooth: true
              }
            ]
            this.voltage.series = [
              {
                name: this.$t('main.volt'),
                type: 'line',
                data: res.data.lstVol,
                smooth: true
              }
            ]
            this.temperature.series = [
              {
                name: this.$t('menu.temperature'),
                type: 'line',
                data: res.data.lstTmp,
                smooth: true
              }
            ]
            this.current.series = [
              {
                name: this.$t('main.ampere'),
                type: 'line',
                data: res.data.lstCur,
                smooth: true
              }
            ]
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
        .finally(() => {})
    },
    queryChtqdqMeterReadingData () {
      let params = {
        mac: this.param.mac,
        time: this.$store.state.historyDate
          ? this.$store.state.historyDate
          : this.$func.getNowFormatDate()
      }
      queryChtqdqMeterReadingDataHistory(params)
        .then(res => {
          if (res.success) {
            if (Object.keys(res.data).length > 0) {
              let xAxis = []
              if (res.data && res.data.timeList) {
                xAxis = res.data.timeList.map(function (str) {
                  return str.split(' ')[1]
                })
              }
              this.smartMeterVoltage.xAxis = xAxis
              this.smartMeterAmpere.xAxis = xAxis
              this.smartMeterVoltage.series = [
                {
                  name: this.$t('main.volt'),
                  type: 'line',
                  data: res.data.lstGV,
                  color: '#e062ea',
                  lineStyle: { color: '#e062ae' },
                  smooth: true
                },
                {
                  name: 'A' + this.$t('control.phase') + this.$t('main.volt'),
                  type: 'line',
                  data: res.data.volA,
                  color: '#71e1e4',
                  lineStyle: { color: '#71e1e4' },
                  smooth: true
                },
                {
                  name: 'B' + this.$t('control.phase') + this.$t('main.volt'),
                  type: 'line',
                  data: res.data.volB,
                  color: '#ffdb5c',
                  lineStyle: { color: '#ffdb5c' },
                  smooth: true
                },
                {
                  name: 'C' + this.$t('control.phase') + this.$t('main.volt'),
                  type: 'line',
                  data: res.data.volC,
                  color: '#c23531',
                  lineStyle: { color: '#c23531' },
                  smooth: true
                }
              ]
              this.smartMeterAmpere.series = [
                {
                  name: this.$t('menu.temperature'),
                  type: 'line',
                  data: res.data.lstGT,
                  color: '#e062ea',
                  lineStyle: { color: '#e062ae' },
                  smooth: true
                },
                {
                  name: 'A' + this.$t('control.phase') + this.$t('main.ampere'),
                  type: 'line',
                  data: res.data.curA,
                  color: '#71e1e4',
                  lineStyle: { color: '#71e1e4' },
                  smooth: true
                },
                {
                  name: 'B' + this.$t('control.phase') + this.$t('main.ampere'),
                  type: 'line',
                  data: res.data.curB,
                  color: '#ffdb5c',
                  lineStyle: { color: '#ffdb5c' },
                  smooth: true
                },
                {
                  name: 'C' + this.$t('control.phase') + this.$t('main.ampere'),
                  type: 'line',
                  data: res.data.curC,
                  color: '#c23531',
                  lineStyle: { color: '#c23531' },
                  smooth: true
                }
              ]
            } else {
              // this.$message({
              //   message: '数据为空',
              //   type: 'error'
              // })
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
        .finally(() => {})
    },
    queryHuaxuChnl () {
      let params = {
        mac: this.param.mac,
        time: this.$store.state.historyDate
          ? this.$store.state.historyDate
          : this.$func.formatDate(
            'yyyy-MM-dd',
            new Date(new Date().setDate(new Date().getDate() - 1))
          )
      }
      queryHuaxuChnlHistory(params)
        .then(res => {
          if (res.success) {
            let xAxis = []
            if (JSON.stringify(res.data) !== '{}') {
              xAxis = res.data.timeList.map(function (str) {
                return str.split(' ')[1]
              })
            }
            this.IntelligentWaterMeter.xAxis = xAxis
            this.IntelligentWaterMeter.series = [
              {
                name: '用水量(吨)',
                type: 'line',
                data: res.data.waterVolumeList,
                color: '#e062ea',
                lineStyle: { color: '#e062ae' },
                smooth: true
              }
            ]
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
    }
  },
  destroyed () {
    clearTimeout(this.timerID)
  },
  watch: {
    '$store.state.detailsAddr': {
      handler (newVal, oldVal) {
        clearTimeout(this.timerID)
        this.init()
        this.setTimer(this.init, config.pollingInterval.channelHistory * 1000)
      }
    },
    '$store.state.stralsundObj': {
      handler (newVal, oldVal) {
        this.queryStralsund()
      }
    },
    '$store.state.pressureObj': {
      handler (newVal, oldVal) {
        this.queryPressure()
      },
      deep: true
    },
    '$store.state.levelObj': {
      handler (newVal, oldVal) {
        this.queryLevel()
      },
      deep: true
    },
    '$store.state.smokeObj': {
      handler (newVal, oldVal) {
        if (newVal.mac || oldVal.mac) this.querySmoke()
      }
    },
    '$store.state.nodeId': {
      handler (newVal, oldVal) {
        if (newVal || oldVal) this.queryRenkeChnl()
      }
    },
    '$store.state.smokeAlarmObj': {
      handler (newVal, oldVal) {
        if (newVal.mac || oldVal.mac) this.querysmokeAlarm()
      }
    },
    '$store.state.flammableGasObj': {
      handler (newVal, oldVal) {
        if (newVal.mac || oldVal.mac) this.queryFlammableGas()
      }
    },
    '$store.state.historyDate': {
      handler (newVal, oldVal) {
        if (newVal) {
          if (
            this.param.equipmentType === 1 ||
            this.param.equipmentType === 19 ||
            this.param.equipmentType === 2
          ) {
            if (this.$store.state.detailsAddr === '') return false
            this.queryChannelHistory()
          } else if (this.param.equipmentType === 3) {
            this.queryStralsund()
          } else if (this.param.equipmentType === 4) {
            this.queryLevel()
          } else if (this.param.equipmentType === 5) {
            this.queryPressure()
          } else if (this.param.equipmentType === 6) {
            this.querySmoke()
          } else if (this.param.equipmentType === 7) {
            this.queryFlammableGas()
          } else if (this.param.equipmentType === 8) {
            this.queryWinextlora()
          } else if (
            this.param.equipmentType === 10 ||
            this.param.equipmentType === 13
          ) {
            this.querysmokeAlarm()
          } else if (
            this.param.equipmentType === 11 ||
            this.param.equipmentType === 14
          ) {
            this.queryRenkeChnl()
          } else if (this.param.equipmentType === 12) {
            this.queryChtqdqMeterReadingData()
          } else if (this.param.equipmentType === 15) {
            this.queryHuaxuChnl()
          }
        }
      }
    },
    $route (to, from) {
      if (to.path) clearTimeout(this.timerID)
    }
  },
  components: {
    LineConfiggur,
    Greenbird,
    TcequipmentLine,
    Info,
    AlarmRecordList,
    LineConfiguration,
    MaintenanceRecords,
    LineChart,
    Stralsund,
    Pressure,
    Level,
    Smoke,
    FlammableGas,
    smokeAlarm,
    TemperatureHumiditySensor,
    SmartMeter,
    IlluminanceSensing,
    IntelligentWaterMeter,
    MeterReadingCat
  }
}
</script>
<style lang="stylus" scoped>
#details
  color #fff
.info
  width 509px
.stralsund, .lora
  width 760px
.mantunsci
  width 380px
#details-popper .el-date-editor.el-input__inner
  width 260px
.qureyBtn
  margin-right 40px
.routeList
  font-size 18px
  color #fff
.listBtn
  color #409EFF !important
  &:hover
    color #409EFF !important
</style>
