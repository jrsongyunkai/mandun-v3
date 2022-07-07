<template>
  <el-col :span="24" class="batch-wrap">
    <el-col>
      <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>{{ $t('system.home') }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $store.state.projectName }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('menu.integratedManagement') }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $t('table.batch') + $t('table.configuration') }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="divided"></div>
      <el-button type="text" class="c-default" @click.native.prevent="handleSelectDevice">+ {{ $t('btns.select') + $t('control.device') }}</el-button>
      <el-button type="text" class="c-default" style="float: right;margin-right: 30px" @click.native.prevent="handleEmpty">{{ $t('placeholder.all') + $t('placeholder.empty') }}</el-button>
      <div :style="batchHeight" v-el_scrollBar>
      <div :style="innerComponentHeight" v-el_scrollBar>
        <el-table
          :data="devices"
          size="small"
          style="width: 100%;">
          <el-table-column
            :label="$t('dialog.deviceNo')"
            align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.mac }}</div>
              <div>{{ scope.row.name }}</div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.position')"
            align="center">
            <template slot-scope="scope">
              <div>{{ scope.row.build + '\xa0\xa0\xa0' + scope.row.unit + '\xa0\xa0\xa0' + scope.row.room }}</div>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            :label="$t('table.status')"
            align="center">
            <template slot-scope="scope">
                <span v-show="scope.row.others.online === -1" class="c-info">{{ $t('table.offLine') }}</span>
                <span v-show="scope.row.others.online === 0" class="c-danger">{{ $t('control.offline') }}</span>
                <span v-show="scope.row.others.online === 1" class="c-success">{{ $t('table.online') }}</span>
              </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.operating')"
            width="120"
            align="center">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="deleteRow(scope.$index, devices)"
                class="top-padding-bottom"
                type="text"
                size="small">
                {{ $t('btns.remove') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="divided"></div>
      <el-row class="select-wrap">
        <el-form ref="form" :model="cmd" size="small" class="form-wrap" label-width="120px">
          <el-form-item :label="$t('table.operate_type') + '：'">
            <el-select v-model="cmd.value" :placeholder="$t('placeholder.pleaseChoose')" class="w100">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div class="dotted-devided"></div>
        <el-col v-if="cmd.value === 'SET_TITLE'">
          <el-form ref="titleForm" :model="titleForm" size="small" :rules="titleRules" class="form-wrap" label-width="120px">
            <el-form-item :label="$t('table.line') + '：'" prop="line">
              <el-select v-model="titleForm.line" :placeholder="$t('placeholder.pleaseChoose')"  class="w100">
                <el-option key="" label="--" value=""></el-option>
                <el-option
                  v-for="n in 29"
                  :key="n"
                  :label="(n - 1 === 0) ? $t('control.mainRoad') : ($t('table.line') + (n - 1))"
                  :value="n">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('table.lineName')" prop="name">
              <el-input v-model="titleForm.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('titleForm')" :disabled="permission === 'false'">{{ $t('btns.save') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="cmd.value === 'LIMIT_POWER'">
          <el-form ref="powerForm" :model="powerForm" size="small" :rules="powerRules" class="form-wrap" label-width="120px">
            <el-form-item :label="$t('table.line') + '：'" prop="line">
              <el-select v-model="powerForm.line" :placeholder="$t('placeholder.pleaseChoose')"  class="w100">
                <el-option key="" label="--" value=""></el-option>
                <el-option
                  v-for="n in 29"
                  :key="n"
                  :label="(n - 1 === 0) ? $t('control.mainRoad') : ($t('table.line') + (n - 1))"
                  :value="n">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('dialog.powerLimit')" prop="limit">
              <el-input v-model="powerForm.limit"></el-input><label class="power-unit">W</label>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('powerForm')" :disabled="permission === 'false'">{{ $t('btns.save') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="cmd.value === 'LIMIT_CURRENT'">
          <el-form ref="currentForm" :model="currentForm" size="small" :rules="currentRules" class="form-wrap" label-width="120px">
            <el-form-item :label="$t('table.line') + '：'" prop="line">
              <el-select v-model="currentForm.line" :placeholder="$t('placeholder.pleaseChoose')"  class="w100">
                <el-option key="" label="--" value=""></el-option>
                <el-option
                  v-for="n in 29"
                  :key="n"
                  :label="(n - 1 === 0) ? $t('control.mainRoad') : ($t('table.line') + (n - 1))"
                  :value="n">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('dialog.currentLimit')" prop="limit">
              <el-input v-model="currentForm.limit"></el-input><label class="power-unit">A</label>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('currentForm')" :disabled="permission === 'false'">{{ $t('btns.save') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="cmd.value === 'LIMIT_LEAKAGE_CURRENT'">
          <el-form ref="leakageCurrentForm" :model="leakageCurrentForm" size="small" :rules="leakageCurrentRules" class="form-wrap" label-width="120px">
            <el-form-item :label="$t('table.line') + '：'" prop="line">
              <el-select v-model="leakageCurrentForm.line" :placeholder="$t('placeholder.pleaseChoose')"  class="w100">
                <el-option key="" label="--" value=""></el-option>
                <el-option
                  v-for="n in 29"
                  :key="n"
                  :label="(n - 1 === 0) ? $t('control.mainRoad') : ($t('table.line') + (n - 1))"
                  :value="n">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('dialog.leakageLimit')" prop="limit">
              <el-input v-model="leakageCurrentForm.limit"></el-input><label class="power-unit">mA</label>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('leakageCurrentForm')" :disabled="permission === 'false'">{{ $t('btns.save') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="cmd.value === 'LIMIT_TEMPERATURE'">
          <el-form ref="temperatureForm" :model="temperatureForm" size="small" :rules="temperatureRules" class="form-wrap" label-width="120px">
            <el-form-item :label="$t('table.line') + '：'" prop="line">
              <el-select v-model="temperatureForm.line" :placeholder="$t('placeholder.pleaseChoose')"  class="w100">
                <el-option key="" label="--" value=""></el-option>
                <el-option
                  v-for="n in 29"
                  :key="n"
                  :label="(n - 1 === 0) ? $t('control.mainRoad') : ($t('table.line') + (n - 1))"
                  :value="n">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('dialog.temperatureLimit')" prop="limit">
              <el-input v-model="temperatureForm.limit"></el-input><label class="power-unit">℃</label>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('temperatureForm')" :disabled="permission === 'false'">{{ $t('btns.save') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="cmd.value === 'LIMIT_VOLTAGE'">
          <el-form ref="voltageForm" :model="voltageForm" size="small" :rules="voltageRules" class="form-wrap" label-width="120px">
            <el-form-item :label="$t('table.line') + '：'" prop="line">
              <el-select v-model="voltageForm.line" :placeholder="$t('placeholder.pleaseChoose')"  class="w100">
                <el-option key="" label="--" value=""></el-option>
                <el-option
                  v-for="n in 29"
                  :key="n"
                  :label="(n - 1 === 0) ? $t('control.mainRoad') : ($t('table.line') + (n - 1))"
                  :value="n">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('dialog.voltageLimit')" prop="voltageH">
              <el-input v-model="voltageForm.voltageH"></el-input><label class="power-unit">V</label>
            </el-form-item>
            <el-form-item :label="$t('dialog.voltageLowerLimit')" prop="voltageL">
              <el-input v-model="voltageForm.voltageL"></el-input><label class="power-unit">V</label>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('voltageForm')" :disabled="permission === 'false'">{{ $t('btns.save') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="cmd.value === 'SETWIRING'">
          <el-form ref="wiringForm" :model="wiringForm" size="small" :rules="wiringRules" class="form-wrap" label-width="120px">
            <el-form-item :label="$t('table.line') + '：'" prop="line">
              <el-select v-model="wiringForm.line" :placeholder="$t('placeholder.pleaseChoose')"  class="w100">
                <el-option key="" label="--" value=""></el-option>
                <el-option
                  v-for="n in 29"
                  :key="n"
                  :label="(n - 1 === 0) ? $t('control.mainRoad') : ($t('table.line') + (n - 1))"
                  :value="n">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('control.wiring')" prop="wiring">
              <el-select v-model="wiringForm.wiring" :placeholder="$t('placeholder.pleaseChoose')"  class="w100">
                <el-option key="-1" :label="$t('control.directConnection')" value="-1"></el-option>
                <el-option
                  v-for="n in 29"
                  :key="n"
                  :label="(n - 1 === 0) ? $t('control.mainRoad') : ($t('table.line') + (n - 1))"
                  :value="n">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('wiringForm')" :disabled="permission === 'false'">{{ $t('btns.save') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="cmd.value === 'SETLOGINPWD'">
          <el-form ref="passwordForm" :model="passwordForm" size="small" :rules="passwordRules" class="form-wrap" label-width="120px">
            <el-form-item :label="$t('system.newPassword')" prop="newPassword">
              <el-input v-model="passwordForm.newPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item :label="$t('system.confirmNewPassword')" prop="confirmNewPassword">
              <el-input v-model="passwordForm.confirmNewPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('passwordForm')" :disabled="permission === 'false'">{{ $t('btns.save') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="cmd.value === 'SETWIRELESS'">
          <el-form ref="wirelessForm" :model="wirelessForm" size="small" :rules="wirelessRules" class="form-wrap" label-width="120px">
            <el-form-item label="SSID" prop="ssid">
              <el-input v-model="wirelessForm.ssid" type="password"></el-input>
            </el-form-item>
            <el-form-item :label="$t('control.password')" prop="password">
              <el-input v-model="wirelessForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('wirelessForm')" :disabled="permission === 'false'">{{ $t('btns.save') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="cmd.value === 'UPDATETIMER'">
          <el-form ref="timerForm" :model="timerForm" size="small" :rules="timerRules" label-width="120px">
            <el-form-item :label="$t('table.line') + '：'" prop="checkedLines">
              <label slot="label" class="slot-label pointer" @click="handleTimerLines">{{ '+' + $t('dialog.lineChoose') }}</label>
              <el-tag
                :key="tag"
                v-for="tag in timerForm.checkedLines"
                closable
                :disable-transitions="false"
                @close="handleTimerClose(tag)">
                {{(tag === 1) ? $t('control.mainRoad') : $t('table.line') + (tag - 1) }}
              </el-tag>
            </el-form-item>
            <el-form-item :label="$t('table.type') + '：'">
              <el-select v-model="timerForm.type" @change="handleTypeChange">
                  <el-option
                    v-for="item in types"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('dialog.time') + '：'" prop="time">
              <el-col :span="24" v-if="timerForm.type === 'single' ">
                <el-date-picker
                  v-model="timerForm.time"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  :placeholder="$t('placeholder.pleaseChoose') + $t('main.date') + $t('dialog.time')">
                </el-date-picker>
              </el-col>
              <el-col :span="24" v-if="timerForm.type === 'cycle' ">
                <el-time-picker
                  v-model="timerForm.time"
                  format="HH:mm"
                  value-format="HH:mm"
                  :placeholder="$t('placeholder.pleaseChoose') + $t('main.date') + $t('dialog.time')">
                </el-time-picker>
              </el-col>
            </el-form-item>
            <el-form-item v-if="timerForm.type === 'cycle'" prop="week">
              <label slot="label" class="slot-label pointer" @click="handleRepeat">{{ '+' + $t('btns.select') + $t('dialog.repeat') }}</label>
              <el-tag
                :key="tag"
                v-for="tag in timerForm.week"
                closable
                :disable-transitions="false"
                @close="handleRepeatClose(tag)">
                <span v-show="$i18n.locale === 'zh'">{{ $t('dialog.week') + tag }}</span>
                <span v-show="$i18n.locale !== 'zh' && tag === '日'">{{ $t('echarts.Sunday') }}</span>
                <span v-show="$i18n.locale !== 'zh' && tag === '一'">{{ $t('echarts.Monday') }}</span>
                <span v-show="$i18n.locale !== 'zh' && tag === '二'">{{ $t('echarts.Tuesday') }}</span>
                <span v-show="$i18n.locale !== 'zh' && tag === '三'">{{ $t('echarts.Wednesday') }}</span>
                <span v-show="$i18n.locale !== 'zh' && tag === '四'">{{ $t('echarts.Thursday') }}</span>
                <span v-show="$i18n.locale !== 'zh' && tag === '五'">{{ $t('echarts.Friday') }}</span>
                <span v-show="$i18n.locale !== 'zh' && tag === '六'">{{ $t('echarts.Saturday') }}</span>
              </el-tag>
            </el-form-item>
            <el-form-item :label="$t('control.action') + '：'" prop="action">
              <el-select v-model="timerForm.action">
                  <el-option
                    v-for="item in actions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('timerForm')" :disabled="permission === 'false'">{{ $t('btns.save') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="cmd.value === 'SET_ENABLE_ALARM'">
          <el-form ref="enableAlarmForm" size="small" :model="enableAlarmForm" :rules="enableAlarmRules" class="" label-width="120px">
            <el-form-item :label="$t('table.line') + '：'" prop="checkedLines">
              <label slot="label" class="slot-label pointer" @click="handleLines">{{ '+' + $t('dialog.lineChoose') }}</label>
              <el-tag
                :key="tag"
                v-for="tag in enableAlarmForm.checkedLines"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{(tag === 1) ? $t('control.mainRoad') : $t('table.line') + (tag - 1) }}
              </el-tag>
            </el-form-item>
            <el-form-item :label="$t('control.enableBitSetting') + '：'">
              <el-checkbox-group v-model="enableAlarmForm.enableBits" @change="handleCheckedBitsChange">
                <el-checkbox-button v-for="(bit, index) in bits" :label="bit" :key="index" :disabled="bit === $t('types.reserved')">{{ bit }}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('enableAlarmForm')" :disabled="permission === 'false'">{{ $t('btns.save') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col v-if="cmd.value === 'SET_ENABLE_TRIP'">
          <el-form ref="enableTripForm" size="small" :model="enableTripForm" :rules="enableTripRules" class="" label-width="120px">
            <el-form-item :label="$t('table.line') + '：'" prop="checkedLines">
              <label slot="label" class="slot-label pointer" @click="handleTripLines">{{ '+' + $t('dialog.lineChoose') }}</label>
              <el-tag
                :key="tag"
                v-for="tag in enableTripForm.checkedLines"
                closable
                :disable-transitions="false"
                @close="handleTripClose(tag)">
                {{(tag === 1) ? $t('control.mainRoad') : $t('table.line') + (tag - 1) }}
              </el-tag>
            </el-form-item>
            <el-form-item :label="$t('control.enableBitSetting') + '：'">
              <el-checkbox-group v-model="enableTripForm.enableBits" @change="handleCheckedTripsChange">
                <el-checkbox-button v-for="(bit, index) in trips" :label="bit" :key="index" :disabled="bit === $t('types.reserved')">{{ bit }}</el-checkbox-button>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('enableTripForm')" :disabled="permission === 'false'">{{ $t('btns.save') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col>
          <div class="description-title">{{ $t('control.explanation') + '：'}}</div>
          <div class="description">{{ '1. ' + $t('control.description1') }}</div>
          <div class="description">{{ '2. ' + $t('control.description2') }}</div>
        </el-col>
      </el-row>
      </div>
    </el-col>
    <el-dialog :title="$t('btns.select') + $t('control.device')" :close-on-click-modal="false" custom-class="custom-select-dialog" :before-close="handleCancel" :visible.sync="selectFlag" width="75%">
        <div>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="rule-form" size="small">
            <el-form-item>
              <el-col :span="4" class="left-padding-right">
                <el-input v-model="ruleForm.build" :placeholder="$t('control.building')"></el-input>
              </el-col>
              <el-col :span="4" class="left-padding-right ml-5">
                <el-input v-model="ruleForm.unit" :placeholder="$t('control.unit')"></el-input>
              </el-col>
              <el-col :span="4" class="left-padding-right ml-5">
                <el-input v-model="ruleForm.mac" :placeholder="$t('table.deviceNo')"></el-input>
              </el-col>
              <el-col :span="8">
                <el-button type="primary" @click="handleSearch">{{ $t('btns.query') }}</el-button>
              </el-col>
              <el-col :span="3" class="tr" style="padding-right: 0">
                  <el-button type="primary" :disabled="selectionFalg" @click="handleOk">{{ $t('btns.save2') + $t('placeholder.select') }}</el-button>
              </el-col>
            </el-form-item>
          </el-form>
          <el-table
            class="mt-20 device-wrap"
            v-el_scrollBar:scrollBar
            height="61vh"
            :data="boxesData"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              align="center"
              width="55">
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('dialog.deviceNo')">
              <template slot-scope="scope">
                <div>{{ scope.row.mac }}</div>
                <div>{{ scope.row.name }}</div>
            </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('table.position')">
              <template slot-scope="scope">
                <div>{{ scope.row.build + '\xa0\xa0\xa0' + scope.row.unit + '\xa0\xa0\xa0' + scope.row.room }}</div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="100"
              :label="$t('table.status')">
              <template slot-scope="scope">
                <span v-show="scope.row.others.online === -1" class="c-info">{{ $t('table.offLine') }}</span>
                <span v-show="scope.row.others.online === 0" class="c-danger">{{ $t('control.offline') }}</span>
                <span v-show="scope.row.others.online === 1" class="c-success">{{ $t('table.online') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              width="120"
              :label="$t('table.operating')">
              <template slot-scope="scope">
                <el-button style="color: #409eff" type="text" @click="handleMac(scope.row)">{{ $t('btns.select') + $t('control.device') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" style="height: 60px;">
          <el-row>
            <el-col :span="24" class="tc">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-sizes="[20, 50, 100]"
                :page-size="20"
                layout="sizes, prev, pager, next"
                :total="total">
              </el-pagination>
            </el-col>
          </el-row>
        </span>
    </el-dialog>
    <el-dialog :title="$t('dialog.channelList')" :visible.sync="linesFlag" custom-class="channel-list">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAllLines" @change="handleCheckAllLinesChange">{{ $t('system.Indeterminate') }}</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="enableAlarmForm.checkedLines" @change="handleCheckedLinesChange">
        <el-checkbox v-for="o in 29" :label="o" :key="o">{{ (o - 1 === 0) ? $t('control.mainRoad') : $t('table.line') + (o - 1)}}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="linesFlag = false">{{ $t('btns.ok2') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('dialog.channelList')" :visible.sync="tripLinesFlag" custom-class="channel-list">
      <el-checkbox :indeterminate="tripIsIndeterminate" v-model="checkAllTripLines" @change="handleCheckAllTripLinesChange">{{ $t('system.Indeterminate') }}</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="enableTripForm.checkedLines" @change="handleCheckedTripLinesChange">
        <el-checkbox v-for="o in 29" :label="o" :key="o">{{ (o - 1 === 0) ? $t('control.mainRoad') : $t('table.line') + (o - 1)}}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tripLinesFlag = false">{{ $t('btns.ok2') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('dialog.channelList')" :visible.sync="timerLinesFlag" custom-class="channel-list">
      <el-checkbox :indeterminate="timerIsIndeterminate" v-model="checkAllTimerLines" @change="handleCheckAllTimerLinesChange">{{ $t('system.Indeterminate') }}</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="timerForm.checkedLines" @change="handleCheckedTimerLinesChange">
        <el-checkbox v-for="o in 29" :label="o" :key="o">{{ (o - 1 === 0) ? $t('control.mainRoad') : $t('table.line') + (o - 1)}}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="timerLinesFlag = false">{{ $t('btns.ok2') }}</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="$t('btns.select') + $t('dialog.repeat')" :visible.sync="repeatFlag">
      <el-checkbox :indeterminate="repeatIsIndeterminate" v-model="checkAllRepeat" @change="handleCheckAllRepeatChange">{{ $t('system.Indeterminate') }}</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="timerForm.week" @change="handleCheckedWeekChange">
        <el-checkbox v-for="item in week" :label="item.value" :key="item.value">{{ item.label }}</el-checkbox>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="repeatFlag = false">{{ $t('btns.ok2') }}</el-button>
      </div>
    </el-dialog>
  </el-col>
</template>
<script>
/* global config */
import { queryBoxes, modifyBoxsChnlTitle, modifyBoxsChnlPower, modifyBoxsChnlCurrent, modifyBoxsChnlLeakageCurrent, modifyBoxsChnlTemperature, modifyBoxsChnlVoltage, modifyBoxsChnlWiring, modifyBoxsWireless, modifyBoxsLoginPasswrod, modifyBoxsChnlAlarmEbable, modifyBoxsChnlTripEnable, modifyBoxsChnlTimer } from '@/api/api'
export default {
  data () {
    return {
      devices: [],
      selectData: [],
      selectFlag: false,
      selectionFalg: true,
      macs: [],
      linesFlag: false,
      tripLinesFlag: false,
      timerLinesFlag: false,
      repeatFlag: false,
      isIndeterminate: false,
      tripIsIndeterminate: false,
      timerIsIndeterminate: false,
      repeatIsIndeterminate: false,
      datetime: '',
      time: '',
      permission: config.authority.BOX_ATTR_MODIFY,
      enableAlarmForm: {
        checkedLines: [],
        enableBits: [],
        enableBitsObj: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].reverse().join('')
      },
      enableTripForm: {
        checkedLines: [],
        enableBits: [],
        enableBitsObj: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].reverse().join('')
      },
      timerForm: {
        checkedLines: [],
        week: [],
        action: '',
        type: 'single',
        time: ''
      },
      boxesData: [],
      ruleForm: {
        mac: '',
        build: '',
        unit: ''
      },
      currentPage: 1,
      pageSize: 20,
      total: 0,
      bits: [this.$t('types.shortCircuitA'), this.$t('types.surgeA'), this.$t('types.overloadA'), this.$t('types.temperatureW'), this.$t('types.leakageA'), this.$t('types.overcurrentA'), this.$t('types.overpressureA'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.missingPhaseA'), this.$t('types.fireA'), this.$t('types.undervoltageA'), this.$t('types.overpressureW'), this.$t('types.undervoltageW'), this.$t('types.leakageW'), this.$t('types.currentW'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.temperatureA'), this.$t('types.unbalancedA'), this.$t('types.wrongPhaseA'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved')],
      trips: [this.$t('types.shortCircuitA') + this.$t('btns.trip'), this.$t('types.surgeA') + this.$t('btns.trip'), this.$t('types.overloadA') + this.$t('btns.trip'), this.$t('types.temperatureW') + this.$t('btns.trip'), this.$t('types.leakageA') + this.$t('btns.trip'), this.$t('types.overcurrentA') + this.$t('btns.trip'), this.$t('types.overpressureA') + this.$t('btns.trip'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.missingPhaseA') + this.$t('btns.trip'), this.$t('types.fireA') + this.$t('btns.trip'), this.$t('types.undervoltageA') + this.$t('btns.trip'), this.$t('types.overpressureW') + this.$t('btns.trip'), this.$t('types.undervoltageW') + this.$t('btns.trip'), this.$t('types.leakageW') + this.$t('btns.trip'), this.$t('types.currentW') + this.$t('btns.trip'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.temperatureA') + this.$t('btns.trip'), this.$t('types.unbalancedA') + this.$t('btns.trip'), this.$t('types.wrongPhaseTrip'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved')],
      actions: [
        {
          value: '',
          label: this.$t('placeholder.pleaseChoose')
        },
        {
          value: true,
          label: this.$t('table.closing')
        },
        {
          value: false,
          label: this.$t('table.opening')
        }
      ],
      types: [
        {
          value: 'single',
          label: this.$t('dialog.singleTiming')
        },
        {
          value: 'cycle',
          label: this.$t('dialog.cycleTiming')
        }
      ],
      cmd: {
        value: ''
      },
      options: [
        {
          value: '',
          label: this.$t('placeholder.pleaseChoose')
        },
        {
          value: 'SET_TITLE',
          label: this.$t('table.line') + this.$t('control.rename')
        },
        {
          value: 'LIMIT_POWER',
          label: this.$t('table.line') + this.$t('dialog.powerLimit') + this.$t('control.setting')
        },
        {
          value: 'LIMIT_CURRENT',
          label: this.$t('table.line') + this.$t('dialog.currentLimit') + this.$t('control.setting')
        },
        {
          value: 'LIMIT_LEAKAGE_CURRENT',
          label: this.$t('table.line') + this.$t('dialog.leakageLimit') + this.$t('control.setting')
        },
        {
          value: 'LIMIT_TEMPERATURE',
          label: this.$t('table.line') + this.$t('dialog.temperatureLimit') + this.$t('control.setting')
        },
        {
          value: 'LIMIT_VOLTAGE',
          label: this.$t('table.line') + this.$t('dialog.voltage') + this.$t('control.setting')
        },
        {
          value: 'SETWIRING',
          label: this.$t('table.line') + this.$t('control.wiring') + this.$t('control.setting')
        },
        {
          value: 'SETLOGINPWD',
          label: this.$t('control.device') + this.$t('control.password') + this.$t('control.setting')
        },
        {
          value: 'SETWIRELESS',
          label: this.$t('control.device') + this.$t('control.network') + this.$t('control.setting')
        },
        {
          value: 'UPDATETIMER',
          label: this.$t('control.device') + this.$t('control.timing') + this.$t('control.setting')
        },
        {
          value: 'SET_ENABLE_ALARM',
          label: this.$t('control.enableAlarm') + this.$t('control.setting')
        },
        {
          value: 'SET_ENABLE_TRIP',
          label: this.$t('control.enableTrip') + this.$t('control.setting')
        }
      ],
      week: [
        {
          value: '日',
          label: this.$t('echarts.Sunday')
        },
        {
          value: '一',
          label: this.$t('echarts.Monday')
        },
        {
          value: '二',
          label: this.$t('echarts.Tuesday')
        },
        {
          value: '三',
          label: this.$t('echarts.Wednesday')
        },
        {
          value: '四',
          label: this.$t('echarts.Thursday')
        },
        {
          value: '五',
          label: this.$t('echarts.Friday')
        },
        {
          value: '六',
          label: this.$t('echarts.Saturday')
        }
      ],
      titleForm: {
        line: '',
        name: ''
      },
      titleRules: {
        line: [{ required: true, message: this.$t('placeholder.pleaseChoose') + this.$t('table.line') + '!', trigger: 'change' }],
        name: [{ required: true, message: this.$t('table.pleaseEnter') + this.$t('table.lineName') + '!', trigger: 'blur' }]
      },
      powerForm: {
        line: '',
        limit: ''
      },
      powerRules: {
        line: [{ required: true, message: this.$t('placeholder.pleaseChoose') + this.$t('table.line') + '!', trigger: 'change' }],
        limit: [{ required: true, message: this.$t('table.pleaseEnter') + this.$t('dialog.powerLimit') + '!', trigger: 'blur' }]
      },
      currentForm: {
        line: '',
        limit: ''
      },
      currentRules: {
        line: [{ required: true, message: this.$t('placeholder.pleaseChoose') + this.$t('table.line') + '!', trigger: 'change' }],
        limit: [{ required: true, message: this.$t('table.pleaseEnter') + this.$t('dialog.powerLimit') + '!', trigger: 'blur' }]
      },
      leakageCurrentForm: {
        line: '',
        limit: ''
      },
      leakageCurrentRules: {
        line: [{ required: true, message: this.$t('placeholder.pleaseChoose') + this.$t('table.line') + '!', trigger: 'change' }],
        limit: [{ required: true, message: this.$t('table.pleaseEnter') + this.$t('dialog.leakageLimit') + '!', trigger: 'blur' }]
      },
      temperatureForm: {
        line: '',
        limit: ''
      },
      temperatureRules: {
        line: [{ required: true, message: this.$t('placeholder.pleaseChoose') + this.$t('table.line') + '!', trigger: 'change' }],
        limit: [{ required: true, message: this.$t('table.pleaseEnter') + this.$t('dialog.temperatureLimit') + '!', trigger: 'blur' }]
      },
      voltageForm: {
        line: '',
        voltageH: '',
        voltageL: ''
      },
      voltageRules: {
        line: [{ required: true, message: this.$t('placeholder.pleaseChoose') + this.$t('table.line') + '!', trigger: 'change' }],
        voltageH: [{ required: true, message: this.$t('table.pleaseEnter') + this.$t('dialog.voltageLimit') + '!', trigger: 'blur' }],
        voltageL: [{ required: true, message: this.$t('table.pleaseEnter') + this.$t('dialog.voltageLowerLimit') + '!', trigger: 'blur' }]
      },
      wiringForm: {
        line: '',
        wiring: ''
      },
      wiringRules: {
        line: [{ required: true, message: this.$t('placeholder.pleaseChoose') + this.$t('table.line') + '!', trigger: 'change' }],
        wiring: [{ required: true, message: this.$t('placeholder.pleaseChoose') + this.$t('control.wiring') + '!', trigger: 'blur' }]
      },
      passwordForm: {
        newPassword: '',
        confirmNewPassword: ''
      },
      passwordRules: {
        newPassword: [{ required: true, message: this.$t('message.enterElectricBoxPassword'), trigger: 'blur' }],
        confirmNewPassword: [{ required: true, message: this.$t('message.newPasswordValidate') + '!', trigger: 'blur' }]
      },
      wirelessForm: {
        ssid: '',
        password: ''
      },
      wirelessRules: {
        ssid: [{ required: true, message: this.$t('message.enterSSID'), trigger: 'blur' }],
        password: [{ required: true, message: this.$t('placeholder.password') + '!', trigger: 'blur' }]
      },
      enableAlarmRules: {
        checkedLines: [
          { type: 'array', required: true, message: this.$t('placeholder.pleaseChoose') + this.$t('table.line'), trigger: 'change' }
        ]
      },
      enableTripRules: {
        checkedLines: [
          { type: 'array', required: true, message: this.$t('placeholder.pleaseChoose') + this.$t('table.line'), trigger: 'change' }
        ]
      },
      timerRules: {
        checkedLines: [
          { type: 'array', required: true, message: this.$t('placeholder.pleaseChoose') + this.$t('table.line'), trigger: 'change' }
        ],
        action: [
          { required: true, message: this.$t('placeholder.pleaseChoose') + this.$t('control.action'), trigger: 'change' }
        ],
        time: [
          { required: true, message: this.$t('placeholder.pleaseChoose') + this.$t('dialog.time'), trigger: 'change' }
        ],
        week: [
          { required: true, message: this.$t('placeholder.pleaseChoose') + this.$t('dialog.repeat') + this.$t('dialog.time'), trigger: 'change' }
        ]
      },
      batchHeight: {
        position: 'relative',
        height: this.$store.state.batchHeight
      },
      innerComponentHeight: {
        position: 'relative',
        height: this.$store.state.innerComponentHeight
      }
    }
  },
  mounted () {
    this.cmd.value = this.$route.params.value ? this.$route.params.value : ''
  },
  methods: {
    handleSelectDevice () {
      this.queryList()
      this.selectFlag = true
    },
    handleSearch () {
      this.currentPage = 1
      this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
    },
    queryList (build, unit, mac) {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        projectCode: this.$store.state.projectCode
      }
      if (build) params.build = build
      if (unit) params.unit = unit
      if (mac) params.key = mac
      queryBoxes(params)
        .then(res => {
          if (res.success) {
            this.total = res.total
            this.boxesData = res.datas
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
      this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
    },
    handleCurrentChange (val) {
      if (this.selectData.length > 0) {
        this.$confirm(this.$t('control.saveTheSelectedDevice'), this.$t('dialog.prompt'), {
          confirmButtonText: this.$t('btns.ok'),
          cancelButtonText: this.$t('btns.cancel'),
          type: 'warning'
        }).then(() => {
          if (this.devices.length > 0) {
            this.devices.forEach(item => {
              this.selectData = this.selectData.filter(keyItem => keyItem.mac !== item.mac)
            })
            this.devices = this.devices.concat(this.selectData)
          } else {
            this.devices = this.selectData
          }
          this.$message({
            type: 'success',
            message: this.$t('btns.save2') + this.$t('system.success') + '！'
          })
          this.currentPage = val
          this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('message.cancelled') + this.$t('btns.save2')
          })
          this.currentPage = val
          this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
        })
      } else {
        this.currentPage = val
        this.queryList(this.ruleForm.build, this.ruleForm.unit, this.ruleForm.mac)
      }
    },
    handleSelectionChange (val) {
      if (val.length === 0) {
        this.selectionFalg = true
      } else {
        this.selectionFalg = false
      }
      this.selectData = val
    },
    handleMac (row) {
      if (this.devices.length > 0) {
        this.devices = this.devices.filter(item => item.mac !== row.mac)
        this.devices.push(row)
      } else {
        this.devices.push(row)
      }
      this.selectFlag = false
    },
    handleOk () {
      if (this.devices.length > 0) {
        this.devices.forEach(item => {
          this.selectData = this.selectData.filter(keyItem => keyItem.mac !== item.mac)
        })
        this.devices = this.devices.concat(this.selectData)
      } else {
        this.devices = this.selectData
      }
      this.selectFlag = false
    },
    handleEmpty () {
      this.devices = []
    },
    handleCancel () {
      this.ruleForm = {
        mac: '',
        build: '',
        unit: ''
      }
      this.currentPage = 1
      this.selectFlag = false
    },
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    submitForm (formName) {
      let that = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.devices.length === 0) {
            this.$message({
              message: this.$t('message.pleaseTickRoom'),
              type: 'error'
            })
            return false
          }
          this.macs = []
          for (let elem of this.devices) {
            this.macs.push(elem.mac)
          }
          let params = {
            macs: this.macs.join(','),
            cmd: this.cmd.value
          }
          this.$nextTick(function () {
            if (formName === 'titleForm') {
              params.nodeNo = this.titleForm.line
              params.title = this.titleForm.name
              modifyBoxsChnlTitle(params)
                .then(res => {
                  if (res.success) {
                    that.$message({
                      message: this.$t('message.controlSuccess'),
                      type: 'success'
                    })
                  } else {
                    let message = ''
                    if (res.data) {
                      for (let elem of res.data) {
                        if (elem.errorMsg === '0') {
                          message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('message.processing') + '</div>'
                        } else {
                          message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                        }
                      }
                    } else {
                      message = res.message
                    }
                    that.$alert(message, '', {
                      dangerouslyUseHTMLString: true,
                      showConfirmButton: false,
                      customClass: 'alert-content',
                      callback: action => {}
                    })
                  }
                })
                .catch(err => {
                  if (err) {
                    that.$message({
                      message: that.$t('message.unknown'),
                      type: 'error'
                    })
                  }
                })
            } else if (formName === 'powerForm') {
              params.nodeNo = this.powerForm.line
              params.power = this.powerForm.limit
              modifyBoxsChnlPower(params)
                .then(res => {
                  if (res.success) {
                    that.$message({
                      message: this.$t('message.controlSuccess'),
                      type: 'success'
                    })
                  } else {
                    let message = ''
                    if (res.data) {
                      for (let elem of res.data) {
                        if (elem.errorMsg === '0') {
                          message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('message.processing') + '</div>'
                        } else {
                          message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                        }
                      }
                    } else {
                      message = res.message
                    }
                    that.$alert(message, '', {
                      dangerouslyUseHTMLString: true,
                      showConfirmButton: false,
                      customClass: 'alert-content',
                      callback: action => {}
                    })
                  }
                })
                .catch(err => {
                  if (err) {
                    that.$message({
                      message: that.$t('message.unknown'),
                      type: 'error'
                    })
                  }
                })
            } else if (formName === 'currentForm') {
              params.nodeNo = this.currentForm.line
              params.current = this.currentForm.limit
              modifyBoxsChnlCurrent(params)
                .then(res => {
                  if (res.success) {
                    that.$message({
                      message: this.$t('message.controlSuccess'),
                      type: 'success'
                    })
                  } else {
                    let message = ''
                    if (res.data) {
                      for (let elem of res.data) {
                        if (elem.errorMsg === '0') {
                          message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('message.processing') + '</div>'
                        } else {
                          message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                        }
                      }
                    } else {
                      message = res.message
                    }
                    that.$alert(message, '', {
                      dangerouslyUseHTMLString: true,
                      showConfirmButton: false,
                      customClass: 'alert-content',
                      callback: action => {}
                    })
                  }
                })
                .catch(err => {
                  if (err) {
                    that.$message({
                      message: that.$t('message.unknown'),
                      type: 'error'
                    })
                  }
                })
            } else if (formName === 'leakageCurrentForm') {
              params.nodeNo = this.leakageCurrentForm.line
              params.leakageCurrent = this.leakageCurrentForm.limit
              modifyBoxsChnlLeakageCurrent(params)
                .then(res => {
                  if (res.success) {
                    that.$message({
                      message: this.$t('message.controlSuccess'),
                      type: 'success'
                    })
                  } else {
                    let message = ''
                    if (res.data) {
                      for (let elem of res.data) {
                        if (elem.errorMsg === '0') {
                          message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('message.processing') + '</div>'
                        } else {
                          message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                        }
                      }
                    } else {
                      message = res.message
                    }
                    that.$alert(message, '', {
                      dangerouslyUseHTMLString: true,
                      showConfirmButton: false,
                      customClass: 'alert-content',
                      callback: action => {}
                    })
                  }
                })
                .catch(err => {
                  if (err) {
                    that.$message({
                      message: that.$t('message.unknown'),
                      type: 'error'
                    })
                  }
                })
            } else if (formName === 'temperatureForm') {
              params.nodeNo = this.temperatureForm.line
              params.temperature = this.temperatureForm.limit
              modifyBoxsChnlTemperature(params)
                .then(res => {
                  if (res.success) {
                    that.$message({
                      message: this.$t('message.controlSuccess'),
                      type: 'success'
                    })
                  } else {
                    let message = ''
                    if (res.data) {
                      for (let elem of res.data) {
                        if (elem.errorMsg === '0') {
                          message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('message.processing') + '</div>'
                        } else {
                          message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                        }
                      }
                    } else {
                      message = res.message
                    }
                    that.$alert(message, '', {
                      dangerouslyUseHTMLString: true,
                      showConfirmButton: false,
                      customClass: 'alert-content',
                      callback: action => {}
                    })
                  }
                })
                .catch(err => {
                  if (err) {
                    that.$message({
                      message: that.$t('message.unknown'),
                      type: 'error'
                    })
                  }
                })
            } else if (formName === 'voltageForm') {
              params.nodeNo = this.voltageForm.line
              params.voltageH = this.voltageForm.voltageH
              params.voltageL = this.voltageForm.voltageL
              modifyBoxsChnlVoltage(params)
                .then(res => {
                  if (res.success) {
                    that.$message({
                      message: this.$t('message.controlSuccess'),
                      type: 'success'
                    })
                  } else {
                    let message = ''
                    if (res.data) {
                      for (let elem of res.data) {
                        if (elem.errorMsg === '0') {
                          message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('message.processing') + '</div>'
                        } else {
                          message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                        }
                      }
                    } else {
                      message = res.message
                    }
                    that.$alert(message, '', {
                      dangerouslyUseHTMLString: true,
                      showConfirmButton: false,
                      customClass: 'alert-content',
                      callback: action => {}
                    })
                  }
                })
                .catch(err => {
                  if (err) {
                    that.$message({
                      message: that.$t('message.unknown'),
                      type: 'error'
                    })
                  }
                })
            } else if (formName === 'wiringForm') {
              params.nodeNo = this.wiringForm.line
              params.wiring = this.wiringForm.wiring
              modifyBoxsChnlWiring(params)
                .then(res => {
                  if (res.success) {
                    that.$message({
                      message: this.$t('message.controlSuccess'),
                      type: 'success'
                    })
                  } else {
                    let message = ''
                    if (res.data) {
                      for (let elem of res.data) {
                        if (elem.errorMsg === '0') {
                          message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('message.processing') + '</div>'
                        } else {
                          message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                        }
                      }
                    } else {
                      message = res.message
                    }
                    that.$alert(message, '', {
                      dangerouslyUseHTMLString: true,
                      showConfirmButton: false,
                      customClass: 'alert-content',
                      callback: action => {}
                    })
                  }
                })
                .catch(err => {
                  if (err) {
                    that.$message({
                      message: that.$t('message.unknown'),
                      type: 'error'
                    })
                  }
                })
            } else if (formName === 'passwordForm') {
              params.password = this.passwordForm.newPassword
              if (this.passwordForm.confirmNewPassword === '' || this.passwordForm.newPassword !== this.passwordForm.confirmNewPassword) {
                this.$message({
                  message: this.$t('message.newPasswordValidate'),
                  type: 'error'
                })
                return false
              }
              modifyBoxsLoginPasswrod(params)
                .then(res => {
                  if (res.success) {
                    that.$message({
                      message: this.$t('message.controlSuccess'),
                      type: 'success'
                    })
                  } else {
                    let message = ''
                    if (res.data) {
                      for (let elem of res.data) {
                        if (elem.errorMsg === '0') {
                          message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('message.processing') + '</div>'
                        } else {
                          message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                        }
                      }
                    } else {
                      message = res.message
                    }
                    that.$alert(message, '', {
                      dangerouslyUseHTMLString: true,
                      showConfirmButton: false,
                      customClass: 'alert-content',
                      callback: action => {}
                    })
                  }
                })
                .catch(err => {
                  if (err) {
                    that.$message({
                      message: that.$t('message.unknown'),
                      type: 'error'
                    })
                  }
                })
            } else if (formName === 'wirelessForm') {
              params.ssid = this.wirelessForm.ssid
              params.password = this.wirelessForm.password
              modifyBoxsWireless(params)
                .then(res => {
                  if (res.success) {
                    that.$message({
                      message: this.$t('message.controlSuccess'),
                      type: 'success'
                    })
                  } else {
                    let message = ''
                    if (res.data) {
                      for (let elem of res.data) {
                        if (elem.errorMsg === '0') {
                          message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('message.processing') + '</div>'
                        } else {
                          message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                        }
                      }
                    } else {
                      message = res.message
                    }
                    that.$alert(message, '', {
                      dangerouslyUseHTMLString: true,
                      showConfirmButton: false,
                      customClass: 'alert-content',
                      callback: action => {}
                    })
                  }
                })
                .catch(err => {
                  if (err) {
                    that.$message({
                      message: that.$t('message.unknown'),
                      type: 'error'
                    })
                  }
                })
            } else if (formName === 'timerForm') {
              params.channel = this.timerForm.checkedLines.join(',')
              params.autoid = 0
              params.status = this.timerForm.action
              params.time = this.timerForm.time + ':00'
              params.weekday = this.timerForm.week.join('')
              modifyBoxsChnlTimer(params)
                .then(res => {
                  if (res.success) {
                    that.$message({
                      message: this.$t('message.controlSuccess'),
                      type: 'success'
                    })
                  } else {
                    let message = ''
                    if (res.data) {
                      for (let elem of res.data) {
                        if (elem.errorMsg === '0') {
                          message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('message.processing') + '</div>'
                        } else {
                          message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                        }
                      }
                    } else {
                      message = res.message
                    }
                    that.$alert(message, '', {
                      dangerouslyUseHTMLString: true,
                      showConfirmButton: false,
                      customClass: 'alert-content',
                      callback: action => {}
                    })
                  }
                })
                .catch(err => {
                  if (err) {
                    that.$message({
                      message: that.$t('message.unknown'),
                      type: 'error'
                    })
                  }
                })
            } else if (formName === 'enableAlarmForm') {
              params.nodeNos = this.enableAlarmForm.checkedLines.join(',')
              params.alarmEnable = this.enableAlarmForm.enableBitsObj
              modifyBoxsChnlAlarmEbable(params)
                .then(res => {
                  if (res.success) {
                    that.$message({
                      message: this.$t('message.controlSuccess'),
                      type: 'success'
                    })
                  } else {
                    let message = ''
                    if (res.data) {
                      for (let elem of res.data) {
                        if (elem.errorMsg === '0') {
                          message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('message.processing') + '</div>'
                        } else {
                          message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                        }
                      }
                    } else {
                      message = res.message
                    }
                    that.$alert(message, '', {
                      dangerouslyUseHTMLString: true,
                      showConfirmButton: false,
                      customClass: 'alert-content',
                      callback: action => {}
                    })
                  }
                })
                .catch(err => {
                  if (err) {
                    that.$message({
                      message: that.$t('message.unknown'),
                      type: 'error'
                    })
                  }
                })
            } else if (formName === 'enableTripForm') {
              params.nodeNos = this.enableTripForm.checkedLines.join(',')
              params.tripEnable = this.enableTripForm.enableBitsObj
              modifyBoxsChnlTripEnable(params)
                .then(res => {
                  if (res.success) {
                    that.$message({
                      message: this.$t('message.controlSuccess'),
                      type: 'success'
                    })
                  } else {
                    let message = ''
                    if (res.data) {
                      for (let elem of res.data) {
                        if (elem.errorMsg === '0') {
                          message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('message.processing') + '</div>'
                        } else {
                          message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                        }
                      }
                    } else {
                      message = res.message
                    }
                    that.$alert(message, '', {
                      dangerouslyUseHTMLString: true,
                      showConfirmButton: false,
                      customClass: 'alert-content',
                      callback: action => {}
                    })
                  }
                })
                .catch(err => {
                  if (err) {
                    that.$message({
                      message: that.$t('message.unknown'),
                      type: 'error'
                    })
                  }
                })
            }
          })
        } else {
          return false
        }
      })
    },
    handleLines () {
      this.linesFlag = true
    },
    handleTripLines () {
      this.tripLinesFlag = true
    },
    handleTimerLines () {
      this.timerLinesFlag = true
    },
    handleRepeat () {
      this.repeatFlag = true
    },
    handleCheckAllLinesChange (val) {
      this.enableAlarmForm.checkedLines = val ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] : []
      this.isIndeterminate = false
    },
    handleCheckAllTripLinesChange (val) {
      this.enableTripForm.checkedLines = val ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] : []
      this.tripIsIndeterminate = false
    },
    handleCheckAllTimerLinesChange (val) {
      this.timerForm.checkedLines = val ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] : []
      this.timerIsIndeterminate = false
    },
    handleCheckAllRepeatChange (val) {
      this.timerForm.week = val ? ['日', '一', '二', '三', '四', '五', '六'] : []
      this.repeatIsIndeterminate = false
    },
    handleCheckedLinesChange (value) {
      let checkedCount = value.length
      this.checkAllLines = checkedCount === 29
      this.isIndeterminate = checkedCount > 0 && checkedCount < 29
    },
    handleCheckedTripLinesChange (value) {
      let checkedCount = value.length
      this.checkAllTripLines = checkedCount === 29
      this.tripIsIndeterminate = checkedCount > 0 && checkedCount < 29
    },
    handleCheckedTimerLinesChange (value) {
      let checkedCount = value.length
      this.checkAllTimerLines = checkedCount === 29
      this.timerIsIndeterminate = checkedCount > 0 && checkedCount < 29
    },
    handleCheckedWeekChange (value) {
      let checkedCount = value.length
      this.checkAllRepeat = checkedCount === this.week.length
      this.repeatIsIndeterminate = checkedCount > 0 && checkedCount < this.week.length
    },
    handleClose (tag) {
      this.enableAlarmForm.checkedLines.splice(this.enableAlarmForm.checkedLines.indexOf(tag), 1)
    },
    handleTripClose (tag) {
      this.enableTripForm.checkedLines.splice(this.enableTripForm.checkedLines.indexOf(tag), 1)
    },
    handleTimerClose (tag) {
      this.timerForm.checkedLines.splice(this.timerForm.checkedLines.indexOf(tag), 1)
    },
    handleRepeatClose (tag) {
      this.timerForm.week.splice(this.timerForm.week.indexOf(tag), 1)
    },
    handleTypeChange (val) {
      this.timerForm.time = ''
    },
    handleCheckedBitsChange (value) {
      let arr = []
      arr = [
        value.indexOf(this.$t('types.shortCircuitA')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.surgeA')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.overloadA')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.temperatureW')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.leakageA')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.overcurrentA')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.overpressureA')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.missingPhaseA')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.fireA')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.undervoltageA')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.overpressureW')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.undervoltageW')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.leakageW')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.currentW')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.temperatureA')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.unbalancedA')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.wrongPhaseA')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0
      ]
      this.enableAlarmForm.enableBitsObj = arr.reverse().join('')
    },
    handleCheckedTripsChange (value) {
      let arr = []
      arr = [
        value.indexOf(this.$t('types.shortCircuitA') + this.$t('btns.trip')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.surgeA') + this.$t('btns.trip')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.overloadA') + this.$t('btns.trip')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.temperatureW') + this.$t('btns.trip')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.leakageA') + this.$t('btns.trip')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.overcurrentA') + this.$t('btns.trip')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.overpressureA') + this.$t('btns.trip')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.missingPhaseA') + this.$t('btns.trip')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.fireA') + this.$t('btns.trip')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.undervoltageA') + this.$t('btns.trip')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.overpressureW') + this.$t('btns.trip')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.undervoltageW') + this.$t('btns.trip')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.leakageW') + this.$t('btns.trip')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.currentW') + this.$t('btns.trip')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.temperatureA') + this.$t('btns.trip')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.unbalancedA') + this.$t('btns.trip')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.wrongPhaseTrip')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0,
        value.indexOf(this.$t('types.reserved')) > -1 ? 1 : 0
      ]
      this.enableTripForm.enableBitsObj = arr.reverse().join('')
    }
  },
  watch: {
    '$store.state.batchHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.batchHeight.height = newVal
        }
      }
    },
    '$store.state.innerComponentHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.innerComponentHeight.height = newVal
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.batch-wrap
  overflow hidden
  >>> .el-form-item__label
        color #fff
.breadcrumb
  height 40px
  line-height 40px
  >>> .el-breadcrumb__inner
        color #fff
  .el-breadcrumb__item
    &:last-child
      .el-breadcrumb__inner
        color #fff
.divided
  height 1px
  background #fff
.dotted-devided
  margin-left 120px
  margin-bottom 22px
  border-top 1px dashed #fff
.select-wrap
  padding 20px
.form-wrap
  padding-right 30px
  width 435px
.w100
  width 100%
.alert-content
  overflow-y scroll
  width 400px
  max-height 400px
  .el-message-box__content
    margin-top 5px
  .el-message-box__message p
    text-align center
    font-size 16px
.power-unit
  position absolute
  margin-left 5px
.slot-label
  width 120px
  padding-right 12px
  color #409EFF
.el-tag + .el-tag
  margin-left 10px
.pointer
  cursor pointer
.el-checkbox-button__inner
  margin-right 5px
  margin-bottom 5px
  border-radius 4px
.el-checkbox-button.is-checked .el-checkbox-button__inner
  -webkit-box-shadow none
  box-shadow none
.description-title
  width 120px
  text-align right
  padding-right 12px
  font-size 14px
.description
  margin-left 120px
  padding 10px 0
.channel-list
  .el-dialog__body
    .el-checkbox
      width 12.5%
      margin-left 0
.el-tag
  background-color #fff
  color #409eff
  border 1px solid #b3d8ff
.device-wrap
  border none
  border-top 1px solid #EBEEF5
  border-left 1px solid #EBEEF5
  color #606266
  >>> .el-table__header-wrapper, >>> .el-table__body-wrapper
      th, tr, td
        color #606266
        border-right 1px solid #EBEEF5
      td, th.is-leaf
        border-bottom 1px solid #EBEEF5
.el-button--text
  color #409EFF
</style>
