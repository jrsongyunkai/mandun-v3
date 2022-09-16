<template>
  <div id="ConfigurationList">
    <i class="el-icon-loading adjustment-modal" v-if="refreshLoading"></i>
    <el-row :gutter="20" style="margin: 0; padding:20px">
      <el-col :span="5" class="mb-20">
        <div class="ellipsis">
          <span class="label" :class="$i18n.locale === 'zh' ? 'normal-label' : ''">{{ $t('dialog.deviceNo') + '：' }}</span>
          <span :title="adjustment.mac">{{ adjustment.mac }}</span>
        </div>
      </el-col>
      <el-col :span="8" class="mb-20">
        <div>
          <el-popover
            placement="top"
            width="250"
            trigger="click"
            v-model="aliasFlag"
            :append-to-body="false"
            @hide="adjustment.name = $store.state.aliasName">
              <el-input size="small" maxlength="20" show-word-limit v-model.trim="adjustment.name" :placeholder="$t('table.pleaseEnter') + $t('dialog.deviceAlias')"></el-input>
              <div style="text-align: right; margin: 5px 0 0">
                <el-button type="primary" size="mini" @click="handleAlias(adjustment.mac, adjustment.name)">{{ $t('btns.ok') }}</el-button>
                <el-button size="mini" type="plain" @click="adjustment.name = $store.state.aliasName;aliasFlag = false">{{ $t('btns.cancel') }}</el-button>
              </div>
              <div slot="reference" @mouseover="aliasIndex = adjustment.mac" @mouseout="aliasIndex = -1" class="pointer pRelative">
                <div class="ellipsis" :class="aliasFlag ? 'dashed' : ''" :title="adjustment.name">
                  <span class="label" :class="$i18n.locale === 'zh' ? 'normal-label' : ''">{{ $t('dialog.deviceAlias') + '：' }}</span>
                  <span>{{ adjustment.name }}</span>
                </div>
                <i slot="reference" v-if="permission === 'true' && aliasIndex === adjustment.mac" class="el-icon-edit pointer" :class="$i18n.locale === 'zh' ? 'normal-icon' : 'unusual-icon'"></i>
              </div>
          </el-popover>
        </div>
      </el-col>
      <el-col :span="11" class="mb-20">
        <el-col :span="12">
          <div>
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              :append-to-body="false"
              v-model="buildFlag"
              @hide="adjustment.build = $store.state.sortBUR.build">
                <el-input size="small" maxlength="20" show-word-limit v-model.trim="adjustment.build" :placeholder="$t('table.pleaseEnter') + $t('control.building')"></el-input>
                <div style="text-align: right; margin: 5px 0 0">
                  <el-button type="primary" size="mini" @click="handleSort(adjustment.mac, adjustment.build, adjustment.unit, adjustment.room, adjustment.linkman, adjustment.linkman2, 'build')">{{ $t('btns.ok') }}</el-button>
                  <el-button size="mini" type="plain" @click="adjustment.build = $store.state.sortBUR.build;buildFlag = false">{{ $t('btns.cancel') }}</el-button>
                </div>
                <div slot="reference" @mouseover="buildIndex = adjustment.build" @mouseout="buildIndex = -1" class="pointer pRelative">
                  <div class="ellipsis" :class="buildFlag ? 'dashed' : ''" :title="adjustment.build">
                    <span class="label" :class="$i18n.locale === 'zh' ? 'normal-label' : ''">{{ $t('table.position') + $t('table.information') + '：' }}</span>
                    <span>{{ adjustment.build }}</span>
                  </div>
                  <i slot="reference" v-if="permission === 'true' && (buildIndex === adjustment.build || this.$func.checkDataType(adjustment.build))" class="el-icon-edit pointer" :class="$i18n.locale === 'zh' ? 'normal-icon' : 'unusual-icon'"></i>
                </div>
            </el-popover>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              :append-to-body="false"
              v-model="unitFlag"
              @hide="adjustment.unit = $store.state.sortBUR.unit">
                <el-input size="small" maxlength="20" show-word-limit v-model.trim="adjustment.unit" :placeholder="$t('table.pleaseEnter') + $t('control.unit')"></el-input>
                <div style="text-align: right; margin: 5px 0 0">
                  <el-button type="primary" size="mini" @click="handleSort(adjustment.mac, adjustment.build, adjustment.unit, adjustment.room, adjustment.linkman, adjustment.linkman2, 'unit')">{{ $t('btns.ok') }}</el-button>
                  <el-button size="mini" type="plain" @click="adjustment.unit = $store.state.sortBUR.unit;unitFlag = false">{{ $t('btns.cancel') }}</el-button>
                </div>
                <div slot="reference" @mouseover="unitIndex = adjustment.unit" @mouseout="unitIndex = -1" class="pointer pRelative">
                  <div class="ellipsis" :class="unitFlag ? 'dashed' : ''" :title="adjustment.unit">
                    <span>{{ adjustment.unit }}</span>
                  </div>
                  <i slot="reference" v-if="permission === 'true' && (unitIndex === adjustment.unit || $func.checkDataType(adjustment.unit))" class="el-icon-edit pointer unit-icon"></i>
                </div>
            </el-popover>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              :append-to-body="false"
              v-model="roomFlag"
              @hide="adjustment.room = $store.state.sortBUR.room">
                <el-input size="small" maxlength="20" show-word-limit v-model.trim="adjustment.room" :placeholder="$t('table.pleaseEnter') + $t('control.room')"></el-input>
                <div style="text-align: right; margin: 5px 0 0">
                  <el-button type="primary" size="mini" @click="handleSort(adjustment.mac, adjustment.build, adjustment.unit, adjustment.room, adjustment.linkman, adjustment.linkman2, 'room')">{{ $t('btns.ok') }}</el-button>
                  <el-button size="mini" type="plain" @click="adjustment.room = $store.state.sortBUR.room;roomFlag = false">{{ $t('btns.cancel') }}</el-button>
                </div>
                <div slot="reference" @mouseover="roomIndex = adjustment.room" @mouseout="roomIndex = -1" class="pointer pRelative">
                  <div class="ellipsis" :class="roomFlag ? 'dashed' : ''" :title="adjustment.room">
                    <span>{{ adjustment.room }}</span>
                  </div>
                  <i slot="reference" v-if="permission === 'true' && (roomIndex === adjustment.room || $func.checkDataType(adjustment.room))" class="el-icon-edit pointer unit-icon"></i>
                </div>
            </el-popover>
          </div>
        </el-col>
      </el-col>
      <el-col :span="5" class="mb-20">
        <el-col :span="16">
          <div>
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              :append-to-body="false"
              v-model="linkmanFlag"
              @hide="adjustment.linkman = $store.state.sortBUR.linkman">
                <el-input size="small" maxlength="20" show-word-limit v-model.trim="adjustment.linkman" :placeholder="$t('table.pleaseEnter') + $t('table.contact') + '1'"></el-input>
                <div style="text-align: right; margin: 5px 0 0">
                  <el-button type="primary" size="mini" @click="handleSort(adjustment.mac, adjustment.build, adjustment.unit, adjustment.room, adjustment.linkman, adjustment.linkman2, 'linkman')">{{ $t('btns.ok') }}</el-button>
                  <el-button size="mini" type="plain" @click="adjustment.linkman = $store.state.sortBUR.linkman;linkmanFlag = false">{{ $t('btns.cancel') }}</el-button>
                </div>
                <div slot="reference" @mouseover="linkmanIndex = adjustment.linkman" @mouseout="linkmanIndex = adjustment.linkman === '' ? '' : -1" class="pointer pRelative">
                  <div class="ellipsis" :class="linkmanFlag ? 'dashed' : ''" :title="adjustment.linkman">
                    <span class="label" :class="$i18n.locale === 'zh' ? 'normal-label' : ''">{{ $t('table.contact') + '1' + '：' }}</span>
                    <span>{{ adjustment.linkman }}</span>
                  </div>
                  <i slot="reference" v-if="permission === 'true' && (linkmanIndex === adjustment.linkman || $func.checkDataType(adjustment.linkman))" class="el-icon-edit pointer" :class="$i18n.locale === 'zh' ? 'normal-icon' : 'unusual-icon'"></i>
                </div>
            </el-popover>
          </div>
        </el-col>
        <el-col :span="8">
          <div>
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              :append-to-body="false"
              v-model="linkmanTelFlag"
              @hide="adjustment.linkmanTel = $store.state.sortBUR.linkmanTel">
                <el-input size="small" maxlength="20" show-word-limit v-model="adjustment.linkmanTel" :placeholder="$t('table.pleaseEnter') + $t('table.contactNumber') + '1'"></el-input>
                <div style="text-align: right; margin: 5px 0 0">
                  <el-button type="primary" size="mini" @click="handleTel(adjustment.mac, adjustment.linkmanTel, adjustment.linkmanTel2, 'linkmanTel')">{{ $t('btns.ok') }}</el-button>
                  <el-button size="mini" type="plain" @click="adjustment.linkmanTel = $store.state.sortBUR.linkmanTel;linkmanTelFlag = false">{{ $t('btns.cancel') }}</el-button>
                </div>
                <div slot="reference" @mouseover="linkmanTelIndex = adjustment.linkmanTel" @mouseout="linkmanTelIndex = adjustment.linkmanTel === '' ? '' : -1" class="pointer pRelative">
                  <div class="ellipsis" :class="linkmanTelFlag ? 'dashed' : ''" :title="adjustment.linkmanTel">
                    <span>{{ adjustment.linkmanTel }}</span>
                  </div>
                  <i slot="reference" v-if="permission === 'true' && (linkmanTelIndex === adjustment.linkmanTel || $func.checkDataType(adjustment.linkmanTel))" class="el-icon-edit pointer unit-icon"></i>
                </div>
            </el-popover>
          </div>
        </el-col>
      </el-col>
      <el-col :span="8" class="mb-20">
        <el-col :span="10">
          <div>
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              :append-to-body="false"
              v-model="linkman2Flag"
              @hide="adjustment.linkman2 = $store.state.sortBUR.linkman2">
                <el-input size="small" maxlength="20" show-word-limit v-model.trim="adjustment.linkman2" :placeholder="$t('table.pleaseEnter') + $t('table.contact') + '2'"></el-input>
                <div style="text-align: right; margin: 5px 0 0">
                  <el-button type="primary" size="mini" @click="handleSort(adjustment.mac, adjustment.build, adjustment.unit, adjustment.room, adjustment.linkman, adjustment.linkman2, 'linkman2')">{{ $t('btns.ok') }}</el-button>
                  <el-button size="mini" type="plain" @click="adjustment.linkman2 = $store.state.sortBUR.room;linkman2Flag = false">{{ $t('btns.cancel') }}</el-button>
                </div>
                <div slot="reference" @mouseover="linkman2Index = adjustment.linkman2" @mouseout="linkman2Index = adjustment.linkman2 === '' ? '' : -1" class="pointer pRelative">
                  <div class="ellipsis" :class="linkman2Flag ? 'dashed' : ''" :title="adjustment.linkman2">
                    <span class="label" :class="$i18n.locale === 'zh' ? 'normal-label' : ''">{{ $t('table.contact') + '2' + '：' }}</span>
                    <span>{{ adjustment.linkman2 }}</span>
                  </div>
                  <i slot="reference" v-if="permission === 'true' && (linkman2Index === adjustment.linkman2 || $func.checkDataType(adjustment.linkman2))" class="el-icon-edit pointer" :class="$i18n.locale === 'zh' ? 'normal-icon' : 'unusual-icon'"></i>
                </div>
            </el-popover>
          </div>
        </el-col>
        <el-col :span="7">
          <div>
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              :append-to-body="false"
              v-model="linkmanTel2Flag"
              @hide="adjustment.linkmanTel2 = $store.state.sortBUR.linkmanTel2">
                <el-input size="small" maxlength="20" show-word-limit v-model="adjustment.linkmanTel2" :placeholder="$t('table.pleaseEnter') + $t('table.contactNumber') + '2'"></el-input>
                <div style="text-align: right; margin: 5px 0 0">
                  <el-button type="primary" size="mini" @click="handleTel(adjustment.mac, adjustment.linkmanTel, adjustment.linkmanTel2, 'linkmanTel2')">{{ $t('btns.ok') }}</el-button>
                  <el-button size="mini" type="plain" @click="adjustment.linkmanTel2 = $store.state.sortBUR.linkmanTel2;linkmanTel2Flag = false">{{ $t('btns.cancel') }}</el-button>
                </div>
                <div slot="reference" @mouseover="linkmanTel2Index = adjustment.linkmanTel2" @mouseout="linkmanTel2Index = adjustment.linkmanTel2 === '' ? '' : -1" class="pointer pRelative">
                  <div class="ellipsis" :class="linkmanTel2Flag ? 'dashed' : ''" :title="adjustment.linkmanTel2">
                    <span>{{ adjustment.linkmanTel2 }}</span>
                  </div>
                  <i slot="reference" v-if="permission === 'true' && (linkmanTel2Index === adjustment.linkmanTel2 || $func.checkDataType(adjustment.linkmanTel2))" class="el-icon-edit pointer unit-icon"></i>
                </div>
            </el-popover>
          </div>
        </el-col>
      </el-col>
      <el-col :span="11">
        <el-col :span="11">
          <div>
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              v-model="customFlag"
              :append-to-body="false"
              @hide="adjustment.customAlarm = $store.state.customAlarm">
                <el-input size="small" maxlength="20" show-word-limit v-model.trim="adjustment.customAlarm" :placeholder="$t('table.pleaseEnter') + $t('system.customAlarm')"></el-input>
                <div style="text-align: right; margin: 5px 0 0">
                  <el-button type="primary" size="mini" @click="handleCustomAlarm(adjustment.mac, adjustment.customAlarm)">{{ $t('btns.ok') }}</el-button>
                  <el-button size="mini" type="plain" @click="adjustment.customAlarm = $store.state.customAlarm;customFlag = false">{{ $t('btns.cancel') }}</el-button>
                </div>
                <div slot="reference" @mouseover="customIndex = adjustment.mac" @mouseout="customIndex = -1" class="pointer pRelative">
                  <div class="ellipsis" :class="customFlag ? 'dashed' : ''" :title="adjustment.customAlarm">
                    <span class="label" :class="$i18n.locale === 'zh' ? 'normal-label' : ''">{{ $t('system.customAlarm') + '：' }}</span>
                    <span>{{ adjustment.customAlarm }}</span>
                  </div>
                  <i slot="reference" v-if="permission === 'true' && customIndex === adjustment.mac" class="el-icon-edit pointer" :class="$i18n.locale === 'zh' ? 'normal-icon' : 'unusual-icon'"></i>
                </div>
            </el-popover>
          </div>
        </el-col>
        <el-col :span="12" class="mb-20">
          <div>
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              v-model="classifyFlag"
              :append-to-body="false"
              @hide="adjustment.classifyLabel = $store.state.classifyLabel">
                <el-input size="small" maxlength="10" show-word-limit v-model.trim="adjustment.classifyLabel" :placeholder="$t('table.pleaseEnter') + $t('system.genericLabel')"></el-input>
                <div style="text-align: right; margin: 5px 0 0">
                  <el-button type="primary" size="mini" @click="handleClassifyLabel(adjustment.mac, adjustment.classifyLabel)">{{ $t('btns.ok') }}</el-button>
                  <el-button size="mini" type="plain" @click="adjustment.classifyLabel = $store.state.classifyLabel;classifyFlag = false">{{ $t('btns.cancel') }}</el-button>
                </div>
                <div slot="reference" @mouseover="classifyIndex = adjustment.mac" @mouseout="classifyIndex = -1" class="pointer pRelative">
                  <div class="ellipsis" :class="classifyFlag ? 'dashed' : ''" :title="adjustment.classifyLabel">
                    <span class="label" :class="$i18n.locale === 'zh' ? 'normal-label' : ''">{{ $t('system.genericLabel') + '：' }}</span>
                    <span>{{ adjustment.classifyLabel }}</span>
                  </div>
                  <i slot="reference" v-if="permission === 'true' && classifyIndex === adjustment.mac" class="el-icon-edit pointer" :class="$i18n.locale === 'zh' ? 'normal-icon' : 'unusual-icon'"></i>
                </div>
            </el-popover>
          </div>
        </el-col>
      </el-col>
      <el-col :span="24" v-if="false">
        <LoraDeviceSettings></LoraDeviceSettings>
      </el-col>
      <el-col :span="24" v-if="param.equipmentType !== 8">
        <span class="fs-14">{{ $t('dialog.alarmThresholdSetting') + '：' }}</span>
        <el-button
          type="text"
          :style="{ fontSize: '18px', color: '#fff' }"
          :disabled="disabledFlag"
          icon="el-icon-refresh alarm-threshold-refresh"
          @click="handleAdjustment(adjustment.mac, adjustment.name)"
        ></el-button>
        <el-button type="text" class="c-default" @click="handleInstructions">{{ $t('table.instruction') + $t('table.history') }}</el-button>
          <el-table :data="adjustments.slice((currentPage-1)*pageSize, currentPage*pageSize)" class="fs-12">
            <el-table-column type="expand">
               <template slot-scope="props">
                <el-col :span="12">
                  <el-form ref="wiringForm" :model="wiringForm" class="form-wrap" :inline="true">
                    <el-form-item :label="$t('control.wiring')" class="mb-0">
                      <select class="gatherAddr" :disabled="permission !== 'true'" v-model="props.row.gatherAddr" :placeholder="$t('placeholder.pleaseChoose')" @change="handleWiring(props.row.nodeNo, props.row.gatherAddr)">
                        <option value="0">{{ $t('placeholder.pleaseChoose') }}</option>
                        <option value="-1">{{ $t('control.directConnection') }}</option>
                        <option v-for="n in 29" :key="n" :value="n">{{ (n - 1 === 0) ? $t('control.mainRoad') : ($t('table.line') + (n - 1)) }}</option>
                      </select>
                    </el-form-item>
                    <el-form-item :label="$t('menu.missingGear') + '：'" class="mb-0" style="margin-left: 70px">
                      {{ props.row.leakageGear }}
                    </el-form-item>
                    <el-form-item :label="$t('menu.remoteControl')" class="mb-0" style="margin-left: 70px">
                      <select class="gatherAddr" :disabled="permission !== 'true'" v-model="props.row.enableControl" :placeholder="$t('placeholder.pleaseChoose')" @change="handleControl(props.row.nodeNo, props.row.enableControl)">
                        <option :value="true">{{ $t('btns.allow') }}</option>
                        <option :value="false">{{ $t('btns.notAllow') }}</option>
                      </select>
                    </el-form-item>
                  </el-form>
                </el-col>
                <el-col :span="4" class="enable" v-if="props.row.isEnableAlarm">
                  <span class="pointer" @click="handleEnable(props.row.enableAlarm, 'alarm', props.$index, props.row.enableAlarmShowHide)">{{ $t('control.enableAlarm') + $t('table.configuration') }}</span>
                </el-col>
                <el-col :span="4" class="enable" v-if="props.row.isEnableTrip">
                  <span class="pointer" @click="handleEnable(props.row.enableTrip, 'trip', props.$index, props.row.enableTripShowHide)">{{ $t('control.enableTrip') + $t('table.configuration') }}</span>
                </el-col>
                <el-col :span="24" class="mt-20" v-if="props.row.enableAlarmShowHide || props.row.enableTripShowHide">
                  <Enable @refresh-init="init" :enableBits="enableForm" :bits="bits" :param="{mac: adjustment.mac, nodeNo: props.row.nodeNo, cmd: props.row.enableAlarmShowHide ? 'SET_ENABLE_ALARM' : 'SET_ENABLE_TRIP'}"></Enable>
                </el-col>
               </template>
            </el-table-column>
            <el-table-column
              prop="title"
              align="center"
              :label="$t('table.lineName')">
              <template slot-scope="scope">
                <el-popover
                  placement="top"
                  width="250"
                  @show="titleVal = scope.row.title"
                  :ref="`title-popover-${scope.$index}`"
                  trigger="click">
                  <el-input size="small" show-word-limit v-model="titleVal" :placeholder="$t('placeholder.content')"></el-input>
                  <div class="tr mt-5">
                    <el-button type="primary" size="mini" @click="handleNodeTitle(adjustment.mac, scope.row.nodeNo, titleVal, scope.$index, 'title', scope.row)">{{ $t('btns.ok') }}</el-button>
                    <el-button size="mini" type="plain" @click="handleClosePopover('title', scope.$index)">{{ $t('btns.cancel') }}</el-button>
                  </div>
                  <span slot="reference" class="pointer">{{ scope.row.title }}</span>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              prop="curL">
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.currentLowerLimit') + '(A)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="scope">
                <el-popover
                  v-if="index === `curL-popover-${scope.$index}`"
                  placement="top"
                  width="250"
                  :ref="`curL-popover-${scope.$index}`"
                  trigger="click">
                  <el-input size="small" type="text" :maxlength="20" show-word-limit v-model="variable" :placeholder="$t('placeholder.content')">
                  </el-input>
                  <div class="tr mt-5">
                    <el-button type="primary" size="mini" @click="handleNodeAttr(adjustment.mac, scope.row.nodeNo, variable, scope.row.curH, '0xC8', scope.$index, 'curL', scope.row)">{{ $t('btns.ok') }}</el-button>
                    <el-button size="mini" type="plain" @click="handleClosePopover">{{ $t('btns.cancel') }}</el-button>
                  </div>
                  <span slot="reference" class="pointer">{{ scope.row.curL }}</span>
                </el-popover>
                <span class="pointer" v-else>
                  {{ scope.row.curL }}
                </span>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.currentLimit') + '(A)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="scope">
                <span>
                  <el-popover
                    placement="top"
                    width="250"
                    @show="curhVal = scope.row.curH"
                    :ref="`curH-popover-${scope.$index}`"
                    trigger="click">
                    <el-input size="small" :maxlength="20" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'"  prefix-icon="currency" show-word-limit v-model="curhVal" :onkeyup="curhVal = curhVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.alarmValue') + ':'}}</span>
                    </el-input>
                    <div class="tr mt-5">
                      <el-button type="primary" size="mini" @click="handleNodeAttr(adjustment.mac, scope.row.nodeNo, curhVal, '0xC8', scope.$index, 'curH', scope.row)">{{ $t('btns.ok') }}</el-button>
                      <el-button size="mini" type="plain" @click="handleClosePopover('curH', scope.$index)">{{ $t('btns.cancel') }}</el-button>
                    </div>
                    <span slot="reference" class="pointer">{{ scope.row.curH ? scope.row.curH : '-' }}</span>
                  </el-popover>
                </span>
                <span style="margin: 0 5px;">/</span>
                <span>
                  <el-popover
                    placement="top"
                    width="250"
                    :disabled="!scope.row.enableWarnModify"
                    @show="warnCurhVal = scope.row.warnCurh"
                    :ref="`warnCurh-popover-${scope.$index}`"
                    trigger="click">
                    <el-input size="small" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" :maxlength="20" show-word-limit v-model="warnCurhVal" :onkeyup="warnCurhVal = warnCurhVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.warningValue') + ':'}}</span>
                    </el-input>
                    <div class="tr mt-5">
                      <el-button type="primary" size="mini" @click="handleNodeAttr(adjustment.mac, scope.row.nodeNo, warnCurhVal, '0xCC', scope.$index, 'warnCurh', scope.row, '3')">{{ $t('btns.ok') }}</el-button>
                      <el-button size="mini" type="plain" @click="handleClosePopover('warnCurh', scope.$index)">{{ $t('btns.cancel') }}</el-button>
                    </div>
                    <span slot="reference" :class="scope.row.enableWarnModify ? 'pointer' : 'cursor'">{{ scope.row.warnCurh ? scope.row.warnCurh : '-' }}</span>
                  </el-popover>
                </span>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.voltageLowerLimit') + '(V)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="scope">
                <span>
                  <el-popover
                    placement="top"
                    width="250"
                    @show="volLVal = scope.row.volL"
                    :ref="`volL-popover-${scope.$index}`"
                    trigger="click">
                    <el-input size="small" :maxlength="20" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" show-word-limit v-model="volLVal" :onkeyup="volLVal = volLVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.alarmValue') + ':'}}</span>
                    </el-input>
                    <div class="tr mt-5">
                      <el-button type="primary" size="mini" @click="handleNodeAttr(adjustment.mac, scope.row.nodeNo, volLVal, '0xC7', scope.$index, 'volL', scope.row)">{{ $t('btns.ok') }}</el-button>
                      <el-button size="mini" type="plain" @click="handleClosePopover('volL', scope.$index)">{{ $t('btns.cancel') }}</el-button>
                    </div>
                    <span slot="reference" class="pointer">{{ scope.row.volL ? scope.row.volL : '-' }}</span>
                  </el-popover>
                </span>
                <span style="margin: 0 5px;">/</span>
                <span>
                  <el-popover
                    placement="top"
                    width="250"
                    :disabled="!scope.row.enableWarnModify"
                    @show="warnVollVal = scope.row.warnVoll"
                    :ref="`warnVoll-popover-${scope.$index}`"
                    trigger="click">
                    <el-input size="small" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" :maxlength="20" show-word-limit v-model="warnVollVal" :onkeyup="warnVollVal = warnVollVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.warningValue') + ':'}}</span>
                    </el-input>
                    <div class="tr mt-5">
                      <el-button type="primary" size="mini" @click="handleNodeAttr(adjustment.mac, scope.row.nodeNo, warnVollVal, '0xCC', scope.$index, 'warnVoll', scope.row, '2')">{{ $t('btns.ok') }}</el-button>
                      <el-button size="mini" type="plain" @click="handleClosePopover('warnVoll', scope.$index)">{{ $t('btns.cancel') }}</el-button>
                    </div>
                    <span slot="reference" :class="scope.row.enableWarnModify ? 'pointer' : 'cursor'">{{ scope.row.warnVoll ? scope.row.warnVoll : '-' }}</span>
                  </el-popover>
                </span>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.voltageLimit') + '(V)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="scope">
                <span>
                  <el-popover
                    placement="top"
                    width="250"
                    @show="volHVal = scope.row.volH"
                    :ref="`volH-popover-${scope.$index}`"
                    trigger="click">
                    <el-input size="small" :maxlength="20" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" show-word-limit v-model="volHVal" :onkeyup="volHVal = volHVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.alarmValue') + ':'}}</span>
                    </el-input>
                    <div class="tr mt-5">
                      <el-button type="primary" size="mini" @click="handleNodeAttr(adjustment.mac, scope.row.nodeNo, volHVal, '0xC7', scope.$index, 'volH', scope.row)">{{ $t('btns.ok') }}</el-button>
                      <el-button size="mini" type="plain" @click="handleClosePopover('volH', scope.$index)">{{ $t('btns.cancel') }}</el-button>
                    </div>
                    <span slot="reference" class="pointer">{{ scope.row.volH ? scope.row.volH : '-' }}</span>
                  </el-popover>
                </span>
                <span style="margin: 0 5px;">/</span>
                <span>
                  <el-popover
                    placement="top"
                    width="250"
                    :disabled="!scope.row.enableWarnModify"
                    @show="warnVolhVal = scope.row.warnVolh"
                    :ref="`warnVolh-popover-${scope.$index}`"
                    trigger="click">
                    <el-input size="small" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" :maxlength="20" show-word-limit v-model="warnVolhVal" :onkeyup="warnVolhVal = warnVolhVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.warningValue') + ':'}}</span>
                    </el-input>
                    <div class="tr mt-5">
                      <el-button type="primary" size="mini" @click="handleNodeAttr(adjustment.mac, scope.row.nodeNo, warnVolhVal, '0xCC', scope.$index, 'warnVolh', scope.row, '1')">{{ $t('btns.ok') }}</el-button>
                      <el-button size="mini" type="plain" @click="handleClosePopover('warnVolh', scope.$index)">{{ $t('btns.cancel') }}</el-button>
                    </div>
                    <span slot="reference" :class="scope.row.enableWarnModify ? 'pointer' : 'cursor'">{{ scope.row.warnVolh ? scope.row.warnVolh : '-' }}</span>
                  </el-popover>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="pwrL">
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.powerLowerLimit') + '(W)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="scope">
                <el-popover
                  v-if="index === `pwrL-popover-${scope.$index}`"
                  placement="top"
                  width="250"
                  :ref="`pwrL-popover-${scope.$index}`"
                  trigger="click">
                  <el-input size="small" :maxlength="20" show-word-limit v-model="variable" :placeholder="$t('placeholder.content')"></el-input>
                  <div class="tr mt-5">
                    <el-button type="primary" size="mini" @click="handleNodeAttr(adjustment.mac, scope.row.nodeNo, variable, scope.row.pwrH, '0xC6', scope.$index, 'pwrL', scope.row)">{{ $t('btns.ok') }}</el-button>
                    <el-button size="mini" type="plain" @click="handleClosePopover">{{ $t('btns.cancel') }}</el-button>
                  </div>
                  <span slot="reference" class="pointer">{{ scope.row.pwrL }}</span>
                </el-popover>
                <div class="pointer" v-else>
                  {{ scope.row.pwrL }}
                </div>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.powerLimit') + '(W)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="scope">
                <span>
                  <el-popover
                    placement="top"
                    width="250"
                    @show="pwrHVal = scope.row.pwrH"
                    :ref="`pwrH-popover-${scope.$index}`"
                    trigger="click">
                    <el-input size="small" :maxlength="20" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" show-word-limit v-model="pwrHVal" :onkeyup="pwrHVal = pwrHVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.alarmValue') + ':'}}</span>
                    </el-input>
                    <div class="tr mt-5">
                      <el-button type="primary" size="mini" @click="handleNodeAttr(adjustment.mac, scope.row.nodeNo, pwrHVal, '0xC6', scope.$index, 'pwrH', scope.row)">{{ $t('btns.ok') }}</el-button>
                      <el-button size="mini" type="plain" @click="handleClosePopover('pwrH', scope.$index)">{{ $t('btns.cancel') }}</el-button>
                    </div>
                    <span slot="reference" class="pointer">{{ scope.row.pwrH ? scope.row.pwrH : '-' }}</span>
                  </el-popover>
                </span>
                <span style="margin: 0 5px;">/</span>
                <span>
                  <el-popover
                    placement="top"
                    width="250"
                    :disabled="!scope.row.enableWarnModify"
                    @show="warnPwrhVal = scope.row.warnPwrh"
                    :ref="`warnPwrh-popover-${scope.$index}`"
                    trigger="click">
                    <el-input size="small" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" :maxlength="20" show-word-limit v-model="warnPwrhVal" :onkeyup="warnPwrhVal = warnPwrhVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.warningValue') + ':'}}</span>
                    </el-input>
                    <div class="tr mt-5">
                      <el-button type="primary" size="mini" @click="handleNodeAttr(adjustment.mac, scope.row.nodeNo, warnPwrhVal, '0xCC', scope.$index, 'warnPwrh', scope.row, '6')">{{ $t('btns.ok') }}</el-button>
                      <el-button size="mini" type="plain" @click="handleClosePopover('warnPwrh', scope.$index)">{{ $t('btns.cancel') }}</el-button>
                    </div>
                    <span slot="reference" :class="scope.row.enableWarnModify ? 'pointer' : 'cursor'">{{ scope.row.warnPwrh ? scope.row.warnPwrh : '-' }}</span>
                  </el-popover>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="lkiL" min-width="90">
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.leakageLowerLimit') + '(mA)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="scope">
                <el-popover
                  v-if="index === `lkiL-popover-${scope.$index}`"
                  placement="top"
                  width="250"
                  :ref="`lkiL-popover-${scope.$index}`"
                  trigger="click">
                  <el-input size="small" :maxlength="20" show-word-limit v-model="variable" :placeholder="$t('placeholder.content')"></el-input>
                  <div class="tr mt-5">
                    <el-button type="primary" size="mini" @click="handleNodeAttr(adjustment.mac, scope.row.nodeNo, variable, scope.row.lkiH, '0xC9', scope.$index, 'lkiL', scope.row)">{{ $t('btns.ok') }}</el-button>
                    <el-button size="mini" type="plain" @click="handleClosePopover">{{ $t('btns.cancel') }}</el-button>
                  </div>
                  <span slot="reference" class="pointer">{{ scope.row.lkiL }}</span>
                </el-popover>
                <div class="pointer" v-else>
                  {{ scope.row.lkiL }}
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="90">
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.leakageLimit') + '(mA)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="scope">
                <span>
                  <el-popover
                    placement="top"
                    width="250"
                    @show="lkiHVal = scope.row.lkiH"
                    :ref="`lkiH-popover-${scope.$index}`"
                    trigger="click">
                    <el-input size="small" :maxlength="20" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" show-word-limit v-model="lkiHVal" :onkeyup="lkiHVal = lkiHVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.alarmValue') + ':'}}</span>
                    </el-input>
                    <div class="tr mt-5">
                      <el-button type="primary" size="mini" @click="handleNodeAttr(adjustment.mac, scope.row.nodeNo, lkiHVal, '0xC9', scope.$index, 'lkiH', scope.row)">{{ $t('btns.ok') }}</el-button>
                      <el-button size="mini" type="plain" @click="handleClosePopover('lkiH', scope.$index)">{{ $t('btns.cancel') }}</el-button>
                    </div>
                    <span slot="reference" class="pointer">{{ scope.row.lkiH ? scope.row.lkiH : '-' }}</span>
                  </el-popover>
                </span>
                <span style="margin: 0 5px;">/</span>
                <span>
                  <el-popover
                    placement="top"
                    width="250"
                    :disabled="!scope.row.enableWarnModify"
                    @show="warnLkihVal = scope.row.warnLkih"
                    :ref="`warnLkih-popover-${scope.$index}`"
                    trigger="click">
                    <el-input size="small" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" :maxlength="20" show-word-limit v-model="warnLkihVal" :onkeyup="warnLkihVal = warnLkihVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.warningValue') + ':'}}</span>
                    </el-input>
                    <div class="tr mt-5">
                      <el-button type="primary" size="mini" @click="handleNodeAttr(adjustment.mac, scope.row.nodeNo, warnLkihVal, '0xCC', scope.$index, 'warnLkih', scope.row, '4')">{{ $t('btns.ok') }}</el-button>
                      <el-button size="mini" type="plain" @click="handleClosePopover('warnLkih', scope.$index)">{{ $t('btns.cancel') }}</el-button>
                    </div>
                    <span slot="reference" :class="scope.row.enableWarnModify ? 'pointer' : 'cursor'">{{ scope.row.warnLkih ? scope.row.warnLkih : '-' }}</span>
                  </el-popover>
                </span>
              </template>
            </el-table-column>
            <el-table-column
              prop="tmpL">
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.temperatureLowerLimit') + '(℃)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="scope">
                <el-popover
                  v-if="index === `tmpL-popover-${scope.$index}`"
                  placement="top"
                  width="250"
                  :ref="`tmpL-popover-${scope.$index}`"
                  trigger="click">
                  <el-input size="small" :maxlength="20" show-word-limit v-model="variable" :placeholder="$t('placeholder.content')"></el-input>
                  <div class="tr mt-5">
                    <el-button type="primary" size="mini" @click="handleNodeAttr(adjustment.mac, scope.row.nodeNo, variable, scope.row.tmpH, '0xCA', scope.$index, 'tmpL', scope.row)">{{ $t('btns.ok') }}</el-button>
                    <el-button size="mini" type="plain" @click="handleClosePopover">{{ $t('btns.cancel') }}</el-button>
                  </div>
                  <span slot="reference" class="pointer">{{ scope.row.tmpL }}</span>
                </el-popover>
                <div class="pointer" v-else>
                  {{ scope.row.tmpL }}
                </div>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('dialog.temperatureLimit') + '(℃)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('home.alarmValue') + '/' + $t('home.warningValue') }}</div>
              </template>
              <template slot-scope="scope">
                <span>
                  <el-popover
                    placement="top"
                    width="250"
                    @show="tmpHVal = scope.row.tmpH"
                    :ref="`tmpH-popover-${scope.$index}`"
                    trigger="click">
                    <el-input size="small" :maxlength="20" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" show-word-limit v-model="tmpHVal" :onkeyup="tmpHVal = tmpHVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.alarmValue') + ':'}}</span>
                    </el-input>
                    <div class="tr mt-5">
                      <el-button type="primary" size="mini" @click="handleNodeAttr(adjustment.mac, scope.row.nodeNo, tmpHVal, '0xCA', scope.$index, 'tmpH', scope.row)">{{ $t('btns.ok') }}</el-button>
                      <el-button size="mini" type="plain" @click="handleClosePopover('tmpH', scope.$index)">{{ $t('btns.cancel') }}</el-button>
                    </div>
                    <span slot="reference" class="pointer">{{ scope.row.tmpH ? scope.row.tmpH : '-' }}</span>
                  </el-popover>
                </span>
                <span style="margin: 0 5px;">/</span>
                <span>
                  <el-popover
                    placement="top"
                    width="250"
                    :disabled="!scope.row.enableWarnModify"
                    @show="warnTmphVal = scope.row.warnTmph"
                    :ref="`warnTmph-popover-${scope.$index}`"
                    trigger="click">
                    <el-input size="small" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" :maxlength="20" show-word-limit v-model="warnTmphVal" :onkeyup="warnTmphVal = warnTmphVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.warningValue') + ':'}}</span>
                    </el-input>
                    <div class="tr mt-5">
                      <el-button type="primary" size="mini" @click="handleNodeAttr(adjustment.mac, scope.row.nodeNo, warnTmphVal, '0xCC', scope.$index, 'warnTmph', scope.row, '5')">{{ $t('btns.ok') }}</el-button>
                      <el-button size="mini" type="plain" @click="handleClosePopover('warnTmph', scope.$index)">{{ $t('btns.cancel') }}</el-button>
                    </div>
                    <span slot="reference" :class="scope.row.enableWarnModify ? 'pointer' : 'cursor'">{{ scope.row.warnTmph ? scope.row.warnTmph : '-' }}</span>
                  </el-popover>
                </span>
              </template>
            </el-table-column>
            <el-table-column min-width="105">
              <template slot="header" slot-scope="{}">
                <div class="tl">{{ $t('types.malignantLoad') + '(W)' }}</div>
                <div class="tl" style="font-weight: 100;color: #ccc">{{ $t('main.adjustablePower') + '/' + $t('main.resistivePower') }}</div>
              </template>
              <template slot-scope="scope">
                <span>
                  <el-popover
                    placement="top"
                    width="250"
                    :disabled="!scope.row.enableTerribleLoad"
                    @show="adjPowerDnVal = scope.row.malLoadAdjPowerDn"
                    :ref="`adjPower-popover-${scope.$index}`"
                    trigger="click">
                    <el-input size="small" :maxlength="20" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" show-word-limit v-model="adjPowerDnVal" :onkeyup="adjPowerDnVal = adjPowerDnVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.alarmValue') + ':'}}</span>
                    </el-input>
                    <div class="tr mt-5">
                      <el-button type="primary" size="mini" @click="handMalignantLoad(adjustment.mac, scope.row.nodeNo, adjPowerDnVal, 'MALLOAD_ADJPOWER_DN', scope.$index, 'adjPower', scope.row)">{{ $t('btns.ok') }}</el-button>
                      <el-button size="mini" type="plain" @click="handleClosePopover('adjPower', scope.$index)">{{ $t('btns.cancel') }}</el-button>
                    </div>
                    <span slot="reference" :class="scope.row.enableTerribleLoad ? 'pointer' : 'cursor'">{{ scope.row.malLoadAdjPowerDn ? scope.row.malLoadAdjPowerDn : '-' }}</span>
                  </el-popover>
                </span>
                <span style="margin: 0 5px;">/</span>
                <span>
                  <el-popover
                    placement="top"
                    width="250"
                    :disabled="!scope.row.enableTerribleLoad"
                    @show="resPowerDnVal = scope.row.malLoadResPowerDn"
                    :ref="`resPower-popover-${scope.$index}`"
                    trigger="click">
                    <el-input size="small" :class="$i18n.locale === 'zh' ? 'zh-textarea' : 'en-textarea'" prefix-icon="currency" :maxlength="20" show-word-limit v-model="resPowerDnVal" :onkeyup="resPowerDnVal = resPowerDnVal.replace(/[^\d]/g,'')" :placeholder="$t('placeholder.content')">
                      <span slot="prefix" style="font-size: 12px;color: #909399;">{{ $t('home.warningValue') + ':'}}</span>
                    </el-input>
                    <div class="tr mt-5">
                      <el-button type="primary" size="mini" @click="handMalignantLoad(adjustment.mac, scope.row.nodeNo, resPowerDnVal, 'MALLOAD_RESPOWER_DN', scope.$index, 'resPower', scope.row)">{{ $t('btns.ok') }}</el-button>
                      <el-button size="mini" type="plain" @click="handleClosePopover('resPower', scope.$index)">{{ $t('btns.cancel') }}</el-button>
                    </div>
                    <span slot="reference" :class="scope.row.enableTerribleLoad ? 'pointer' : 'cursor'">{{ scope.row.malLoadResPowerDn ? scope.row.malLoadResPowerDn : '-' }}</span>
                  </el-popover>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <div class="block tc">
            <el-pagination
              v-if="adjustments.length > 10"
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
    </el-row>
    <el-dialog :title="$t('table.instruction') + $t('table.history') + $t('control.recording')" :close-on-click-modal="false" :modal="false" v-if="instructionsFlag" :visible.sync="instructionsFlag" custom-class="custom-select-dialog" width="1323px">
      <CommandFeedback :classFlag="true" :instructionsData="adjustment" :operateAt="5"></CommandFeedback>
    </el-dialog>
  </div>
</template>
<script>
/* global config */
import store from '@/store'
import LoraDeviceSettings from './LoraDeviceSettings'
import Enable from './Enable'
import CommandFeedback from '../Common/CommandFeedback'
import { queryChnlAttr, updateChnlAttr, updateNodeTitle, macAlias, modifyBoxsChnlWiring, saveBoxProperty, modifyBoxRemoteControl, terriblePower, queryBoxDetails } from '@/api/api'
export default {
  props: {
    param: {
      type: Object
    }
  },
  data () {
    return {
      adjustments: [],
      adjustment: {
        mac: this.$store.state.mac,
        name: '', //  this.$store.state.aliasName,
        build: '', //  this.$store.state.sortBUR.build,
        unit: '', //  this.$store.state.sortBUR.unit,
        room: '', //  this.$store.state.sortBUR.room,
        linkman: '', //  this.$store.state.sortBUR.linkman,
        linkman2: '', //  this.$store.state.sortBUR.linkman2,
        linkmanTel: '', //  this.$store.state.sortBUR.linkmanTel,
        linkmanTel2: '', //  this.$store.state.sortBUR.linkmanTel2,
        customAlarm: '', //  this.$store.state.customAlarm,
        classifyLabel: ''//  this.$store.state.classifyLabel
      },
      wiringForm: {
        wiring: ''
      },
      disabledFlag: false,
      refreshLoading: false,
      aliasIndex: -1,
      aliasFlag: false,
      buildFlag: false,
      unitFlag: false,
      roomFlag: false,
      linkmanFlag: false,
      linkman2Flag: false,
      linkmanTelFlag: false,
      linkmanTel2Flag: false,
      customFlag: false,
      classifyFlag: false,
      instructionsFlag: false,
      buildIndex: -1,
      unitIndex: -1,
      roomIndex: -1,
      linkmanIndex: -1,
      linkmanTelIndex: -1,
      linkman2Index: -1,
      linkmanTel2Index: -1,
      customIndex: -1,
      classifyIndex: -1,
      permission: config.authority.BOX_ATTR_MODIFY,
      index: 0,
      titleVal: '',
      curhVal: '',
      warnCurhVal: '',
      volLVal: '',
      warnVollVal: '',
      volHVal: '',
      warnVolhVal: '',
      pwrHVal: '',
      warnPwrhVal: '',
      lkiHVal: '',
      warnLkihVal: '',
      tmpHVal: '',
      warnTmphVal: '',
      adjPowerDnVal: '',
      resPowerDnVal: '',
      enableForm: {
        enableBits: [],
        enableBitsObj: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].reverse().join('')
      },
      bits: [],
      config: config,
      pageNo: 1,
      pageSize: 10,
      currentPage: 1,
      total: 0
    }
  },
  created () {
    this.queryInfo()
  },
  mounted () {
    // console.log(this.$store.state.mac, '============this.$store.state.mac')
    if (this.param.equipmentType !== 8) this.init()
    this.linkmanIndex = (this.$store.state.sortBUR.linkman === '' || this.$store.state.sortBUR.linkman === undefined) ? (this.$store.state.sortBUR.linkman === undefined ? undefined : '') : -1
    this.linkman2Index = (this.$store.state.sortBUR.linkman2 === '' || this.$store.state.sortBUR.linkman2 === undefined) ? (this.$store.state.sortBUR.linkman2 === undefined ? undefined : '') : -1
    this.linkmanTelIndex = (this.$store.state.sortBUR.linkmanTel === '' || this.$store.state.sortBUR.linkmanTel === undefined) ? (this.$store.state.sortBUR.linkmanTel === undefined ? undefined : '') : -1
    this.linkmanTel2Index = (this.$store.state.sortBUR.linkmanTel2 === '' || this.$store.state.sortBUR.linkmanTel2 === undefined) ? (this.$store.state.sortBUR.linkmanTel2 === undefined ? undefined : '') : -1
  },
  methods: {
    init () {
      this.handleAdjustment(this.adjustment.mac, this.adjustment.name)
    },
    queryInfo () {
      let params = {
        'mac': this.$store.state.mac
      }
      queryBoxDetails(params).then(res => {
        if (res.success) {
          this.adjustment.name = res.data.name
          this.adjustment.build = res.data.build
          this.adjustment.unit = res.data.unit
          this.adjustment.room = res.data.room
          this.adjustment.linkman = res.data.linkman
          this.adjustment.linkman2 = res.data.linkman2
          this.adjustment.linkmanTel = res.data.linkmanTel
          this.adjustment.linkmanTel2 = res.data.linkmanTel2
          this.adjustment.customAlarm = res.data.others.customAlarm
          this.adjustment.classifyLabel = res.data.others.classifyLabel
          store.commit('aliasName', res.data.name)
          store.commit('customAlarm', res.data.others.customAlarm)
          store.commit('classifyLabel', res.data.others.classifyLabel)
          store.commit('sortBUR', {build: res.data.build, unit: res.data.unit, room: res.data.room, linkman: res.data.linkman, linkman2: res.data.linkman2, linkmanTel: res.data.linkmanTel, linkmanTel2: res.data.linkmanTel2})
        }
      })
    },
    handleAdjustment (mac, name) {
      let ele = document.querySelector('.alarm-threshold-refresh')
      this.refreshLoading = true
      if (ele) {
        this.disabledFlag = true
        setTimeout(() => {
          this.disabledFlag = false
        }, 100)
      }
      queryChnlAttr({mac: mac})
        .then(res => {
          if (res.success) {
            res.data.map((item, index) => {
              item.index = index
            })
            this.adjustments = res.data
            this.total = res.data.length
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
        .finally(() => {
          this.refreshLoading = false
        })
    },
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    handleAlias (mac, name) {
      macAlias({mac: mac, name: name})
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('dialog.deviceAlias') + this.$t('message.successfulModified') + '！',
              type: 'success'
            })
            store.commit('aliasName', name)
            this.aliasFlag = false
            this.aliasIndex = -1
            this.adjustment.name = name
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
    handleSort (mac, build, unit, room, linkman, linkman2, type) {
      let params = {
        mac: mac
      }
      if (type === 'build') {
        params.build = build
      } else if (type === 'unit') {
        params.unit = unit
      } else if (type === 'room') {
        params.room = room
      } else if (type === 'linkman') {
        params.linkman = linkman
      } else if (type === 'linkman2') {
        params.linkman2 = linkman2
      }
      macAlias(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('message.successfulModified') + '！',
              type: 'success'
            })
            store.commit('sortBUR', {build: this.adjustment.build, unit: this.adjustment.unit, room: this.adjustment.room, linkman: this.adjustment.linkman, linkman2: this.adjustment.linkman2, linkmanTel: this.adjustment.linkmanTel, linkmanTel2: this.adjustment.linkmanTel2})
            if (type === 'build') {
              this.buildFlag = false
              this.buildIndex = -1
              this.adjustment.build = build
            } else if (type === 'unit') {
              this.unitFlag = false
              this.unitIndex = -1
              this.adjustment.unit = unit
            } else if (type === 'room') {
              this.roomFlag = false
              this.roomIndex = -1
              this.adjustment.room = room
            } else if (type === 'linkman') {
              this.linkmanFlag = false
              this.linkmanIndex = this.adjustment.linkman === '' || this.adjustment.linkman === undefined ? (this.adjustment.linkman === undefined ? undefined : '') : -1
              this.adjustment.linkman = linkman
            } else if (type === 'linkman2') {
              this.linkman2Flag = false
              this.linkman2Index = this.adjustment.linkman2 === '' || this.adjustment.linkman2 === undefined ? (this.adjustment.linkman2 === undefined ? undefined : '') : -1
              this.adjustment.linkman2 = linkman2
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
    handleTel (mac, linkmanTel, linkmanTel2, type) {
      let params = {
        mac: mac
      }
      if (type === 'linkmanTel') {
        params.linkmanTel = linkmanTel
        if (!this.$func.checkPhone(linkmanTel) && linkmanTel !== '' && linkmanTel2 !== undefined) {
          this.$message({
            message: this.$t('message.numberFormatError'),
            type: 'error'
          })
          return false
        }
      } else if (type === 'linkmanTel2') {
        params.linkmanTel2 = linkmanTel2
        if (!this.$func.checkPhone(linkmanTel2) && linkmanTel2 !== '' && linkmanTel2 !== undefined) {
          this.$message({
            message: this.$t('message.numberFormatError'),
            type: 'error'
          })
          return false
        }
      }
      macAlias(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('message.successfulModified') + '！',
              type: 'success'
            })
            store.commit('sortBUR', {build: this.adjustment.build, unit: this.adjustment.unit, room: this.adjustment.room, linkman: this.adjustment.linkman, linkman2: this.adjustment.linkman2, linkmanTel: this.adjustment.linkmanTel, linkmanTel2: this.adjustment.linkmanTel2})
            if (type === 'linkmanTel') {
              this.linkmanTelFlag = false
              this.linkmanTelIndex = this.adjustment.linkmanTel === '' || this.adjustment.linkmanTel === undefined ? (this.adjustment.linkmanTel === undefined ? undefined : '') : -1
            } else if (type === 'linkmanTel2') {
              this.linkmanTel2Flag = false
              this.linkmanTel2Index = this.adjustment.linkmanTel2 === '' || this.adjustment.linkmanTel2 === undefined ? (this.adjustment.linkmanTel2 === undefined ? undefined : '') : -1
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
        }).catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    },
    handleNodeTitle (mac, nodeNo, title, index, field, row) {
      if (this.config.authority.CTL_AUTHORITY === 'false') {
        this.$func.controlAuthority(this.config.authority.CTL_AUTHORITY)
        return false
      }
      if (title === '') {
        this.$message({
          message: this.$t('placeholder.content'),
          type: 'error'
        })
        return false
      }
      updateNodeTitle({mac: mac, nodeNo: nodeNo, title: title})
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('message.controlSuccess'),
              type: 'success'
            })
            this.$refs[`${field}-popover-${index}`].doClose()
            row.title = this.titleVal
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
    handMalignantLoad (mac, nodeNo, val, type, index, field, row) {
      let that = this
      if (val === '') {
        this.$message({
          message: this.$t('placeholder.content'),
          type: 'error'
        })
        return false
      }
      let params = {
        macs: mac,
        nodeNo: nodeNo,
        cmd: 'LIMIT_TERRIBLE_LOAD_POWER',
        type: type,
        lower: val
      }
      terriblePower(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('message.controlSuccess'),
              type: 'success'
            })
            this.$refs[`${field}-popover-${index}`].doClose()
            if (field === 'adjPower') {
              row.malLoadAdjPowerDn = this.adjPowerDnVal
            } else if (field === 'resPower') {
              row.malLoadResPowerDn = this.resPowerDnVal
            }
          } else if (res.code === '-1') {
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
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    },
    handleNodeAttr (mac, nodeNo, val, type, index, field, row, warnType) {
      if (this.config.authority.CTL_AUTHORITY === 'false') {
        this.$func.controlAuthority(this.config.authority.CTL_AUTHORITY)
        return false
      }
      if (val === '') {
        this.$message({
          message: this.$t('placeholder.content'),
          type: 'error'
        })
        return false
      }
      let params = {
        mac: mac,
        nodeNo: nodeNo,
        warnType: warnType,
        type: type,
        _operate_at: '5'
      }
      if (field === 'curH' || field === 'warnCurh' || field === 'pwrH' || field === 'warnPwrh' || field === 'lkiH' || field === 'warnLkih' || field === 'tmpH' || field === 'warnTmph') {
        params.upper = val
      } else if (field === 'volL') {
        params.lower = val
        params.upper = row.volH
      } else if (field === 'warnVoll') {
        params.lower = val
        params.upper = row.warnVolh
      } else if (field === 'volH') {
        params.upper = val
        params.lower = row.volL
      } else if (field === 'warnVolh') {
        params.upper = val
        params.lower = row.warnVoll
      }
      updateChnlAttr(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('message.controlSuccess'),
              type: 'success'
            })
            this.$refs[`${field}-popover-${index}`].doClose()
            if (field === 'curH') {
              row.curH = this.curhVal
            } else if (field === 'warnCurh') {
              row.warnCurh = this.warnCurhVal
            } else if (field === 'volL') {
              row.volL = this.volLVal
            } else if (field === 'warnVoll') {
              row.warnVoll = this.warnVollVal
            } else if (field === 'volH') {
              row.volH = this.volHVal
            } else if (field === 'warnVolh') {
              row.warnVolh = this.warnVolhVal
            } else if (field === 'pwrH') {
              row.pwrH = this.pwrHVal
            } else if (field === 'warnPwrh') {
              row.warnPwrh = this.warnPwrhVal
            } else if (field === 'lkiH') {
              row.lkiH = this.lkiHVal
            } else if (field === 'warnLkih') {
              row.warnLkih = this.warnLkihVal
            } else if (field === 'tmpH') {
              row.tmpH = this.tmpHVal
            } else if (field === 'warnTmph') {
              row.warnTmph = this.warnTmphVal
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
    handleWiring (nodeNo, gatherAddr) {
      let that = this
      let params = {
        macs: this.adjustment.mac,
        cmd: 'SETWIRING',
        nodeNo: nodeNo,
        wiring: gatherAddr
      }
      modifyBoxsChnlWiring(params)
        .then(res => {
          if (res.success) {
            that.$message({
              message: this.$t('message.controlSuccess'),
              type: 'success'
            })
          } else if (res.code === '-1') {
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
    },
    handleControl (nodeNo, enableControl) {
      let that = this
      let params = {
        macs: this.adjustment.mac,
        cmd: 'SETCONTROL',
        nodeNo: nodeNo,
        operType: enableControl ? '1' : '0'
      }
      modifyBoxRemoteControl(params)
        .then(res => {
          if (res.success) {
            that.$message({
              message: this.$t('message.controlSuccess'),
              type: 'success'
            })
          } else if (res.code === '-1') {
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
    },
    handleEnable (obj, type, index, flag) {
      if (type === 'alarm') {
        this.adjustments[index + ((this.currentPage - 1) * 10)].enableAlarmShowHide = !this.adjustments[index + ((this.currentPage - 1) * 10)].enableAlarmShowHide
        this.adjustments[index + ((this.currentPage - 1) * 10)].enableTripShowHide = false
        this.bits = [this.$t('types.shortCircuitA'), this.$t('types.surgeA'), this.$t('types.overloadA'), this.$t('types.temperatureW'), this.$t('types.leakageA'), this.$t('types.overcurrentA'), this.$t('types.overpressureA'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.missingPhaseA'), this.$t('types.fireA'), this.$t('types.undervoltageA'), this.$t('types.overpressureW'), this.$t('types.undervoltageW'), this.$t('types.leakageW'), this.$t('types.currentW'), this.$t('types.reserved'), this.$t('types.localMaintenance'), this.$t('types.malignantLoad'), this.$t('message.remoteLock'), this.$t('types.reserved'), this.$t('types.temperatureA'), this.$t('types.unbalancedA'), this.$t('types.wrongPhaseA'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved')]
      } else if (type === 'trip') {
        this.adjustments[index + ((this.currentPage - 1) * 10)].enableTripShowHide = !this.adjustments[index + ((this.currentPage - 1) * 10)].enableTripShowHide
        this.adjustments[index + ((this.currentPage - 1) * 10)].enableAlarmShowHide = false
        this.bits = [this.$t('types.shortCircuitA') + this.$t('btns.trip'), this.$t('types.surgeA') + this.$t('btns.trip'), this.$t('types.overloadA') + this.$t('btns.trip'), this.$t('types.temperatureW') + this.$t('btns.trip'), this.$t('types.leakageA') + this.$t('btns.trip'), this.$t('types.overcurrentA') + this.$t('btns.trip'), this.$t('types.overpressureA') + this.$t('btns.trip'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.missingPhaseA') + this.$t('btns.trip'), this.$t('types.fireA') + this.$t('btns.trip'), this.$t('types.undervoltageA') + this.$t('btns.trip'), this.$t('types.overpressureW') + this.$t('btns.trip'), this.$t('types.undervoltageW') + this.$t('btns.trip'), this.$t('types.leakageW') + this.$t('btns.trip'), this.$t('types.currentW') + this.$t('btns.trip'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.malignantLoad') + this.$t('control.enableTrip'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.temperatureA') + this.$t('btns.trip'), this.$t('types.unbalancedA') + this.$t('btns.trip'), this.$t('types.wrongPhaseTrip'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved'), this.$t('types.reserved')]
      }
      let arr = obj.split('').reverse()
      let _arr = []
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] === '1') _arr.push(i + '-' + this.bits[i])
      }

      this.enableForm.enableBits = _arr
      console.log(this.enableForm, obj, '=======')
      this.enableForm.enableBitsObj = obj
      let _len = this.adjustments.length
      for (let i = 0; i < _len; i++) {
        if (index + ((this.currentPage - 1) * 10) !== i) {
          this.adjustments[i].enableAlarmShowHide = false
          this.adjustments[i].enableTripShowHide = false
        }
      }
    },
    handleClosePopover (field, index) {
      this.$refs[`${field}-popover-${index}`].doClose()
      this.$nextTick(() => {
        this[`${field}Val`] = ''
      })
    },
    handleCustomAlarm (mac, val) {
      let params = {
        mac: mac,
        property: 'CUSTOM_ALARM',
        value: val
      }
      saveBoxProperty(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('system.customAlarm') + this.$t('message.successfulModified') + '！',
              type: 'success'
            })
            store.commit('customAlarm', val)
            this.customFlag = false
            this.customIndex = -1
            this.adjustment.customAlarm = val
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
    handleClassifyLabel (mac, val) {
      let params = {
        mac: mac,
        property: 'CLASSIFY_LABEL',
        value: val
      }
      saveBoxProperty(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('system.genericLabel') + this.$t('message.successfulModified') + '！',
              type: 'success'
            })
            store.commit('classifyLabel', val)
            this.classifyFlag = false
            this.classifyIndex = -1
            this.adjustment.classifyLabel = val
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
    handleInstructions () {
      this.instructionsFlag = true
      this.adjustment.projectCode = this.$store.state.projectCode
    }
  },
  components: {
    Enable,
    LoraDeviceSettings,
    CommandFeedback
  }
}
</script>
<style lang="stylus" scoped>
/deep/ .el-col
         padding 0 !important
.pRelative
  position relative
  i
    position absolute
    top 12px
  .normal-icon
    left 75px
  .unusual-icon
    left 120px
  .unit-icon
    left -12px
.label
  display inline-block
  width 130px
  text-align right
.normal-label
  width 85px
.ellipsis
  height 40px
  line-height 40px
  font-size 14px
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
.el-divider
  background-color #303a5e
.adjustment-content
  margin-left 100px
  margin-top -40px
.adjustment-name
  padding-right 12px
  width 93px
  display inline-block
  text-align right
  cursor pointer
.adjustment-modal
  position absolute
  left 50%
  top 50%
  margin-left -15px
  margin-top -15px
  font-size 30px
  color #23b48c
  z-index 9999
.dashed
  box-sizing border-box
  border-bottom 1px dashed #303a5e
.enable
  height 40px
  line-height 40px
/deep/ .el-table__expand-icon
         color #fff
.zh-textarea >>> .el-input__inner
  padding-left 50px !important
.en-textarea >>> .el-input__inner
  padding-left 95px !important
.cursor
  cursor not-allowed
</style>
