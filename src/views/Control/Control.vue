<template>
    <div id="control">
      <el-col>
        <el-col class="mt-10" v-if="!syncFlag && !instructionsFlag">
          <el-row>
            <el-button type="text" class="c-default" icon="el-icon-plus" @click="handleSceneEdit">{{ $t('control.sceneAdded') }}</el-button>
          </el-row>
          <el-col :span="24">
          <el-table
            :data="scenesData"
            size="small"
            :height="tableComponentHeight"
            :max-height="tableComponentHeight"
            v-el_scrollBar:scrollBar>
            <el-table-column :label="$t('table.sceneName')"  width="200" align="center">
              <template slot-scope="scope">
                <span class="pointer c-default"  @click="handleViewScene(scope.row.sceneId,scope.row)">{{scope.row.sceneName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="场景模式">
              <template slot-scope="scope">
                <span class="pointer c-default">{{scope.row.type===1?'自动':"手动"}}</span>
              </template>

            </el-table-column>
            <el-table-column :label="$t('table.status')" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0" class="danger-text">{{ $t('system.disable') }}</span>
                <span v-else class="normal-text">{{ $t('system.enable') }}</span>
                <span>|</span>
                <span v-if="scope.row.others.chnlOcStatus === 1" class="normal-text">{{ $t('table.fullLine') }}</span>
                <span v-else-if="scope.row.others.chnlOcStatus === 0" class="red-text">{{ $t('table.lineClearance') }}</span>
                <span v-else-if="scope.row.others.chnlOcStatus === -1" class="danger-text">{{ $t('table.halfFullLine') }}</span>
                <span v-else-if="scope.row.others.chnlOcStatus === -2">{{ $t('table.noAddLine') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="remark" :label="$t('table.remark')" align="center">
            </el-table-column>
            <el-table-column :label="$t('table.operating')" width="360" align="center">
              <template slot-scope="scope" >
                  <el-button  v-if="scope.row.type===1" class="top-padding-bottom left-padding-right c-default" type="text" @click="handleSceneOc(scope.row.sceneId, 'open')" :disabled="scope.row.status === 0">{{ $t('table.oneButtonOn') }}</el-button>
                <el-button  v-if="scope.row.type===1" class="top-padding-bottom left-padding-right c-default" type="text" @click="handleSceneOc(scope.row.sceneId, 'close')" :disabled="scope.row.status === 0">{{ $t('table.oneButtonOff') }}</el-button>
                <el-button  class="top-padding-bottom left-padding-right c-default" type="text" @click="handleSceneEdit(scope.row, 'edit')">{{ $t('control.edit') }}</el-button>
                <el-button  v-if="scope.row.type===1" class="top-padding-bottom left-padding-right c-default" type="text" @click="handleSceneStatus(scope.row.sceneId)">{{ $t('table.stopAndStart') }}</el-button>
                <el-button  class="top-padding-bottom left-padding-right c-default" type="text" v-if="scope.row.type===2" @click="handleSceneOc(scope.row.sceneId, 'close')">执行</el-button>
                <el-button  class="top-padding-bottom left-padding-right c-default" type="text" @click="handleSceneDel(scope.row.sceneId)">{{ $t('system.delete') }}</el-button>
                <el-tooltip :content="$t('table.pushBuiltinTiming')" open-delay="1000" placement="bottom" effect="light">
                  <el-button  v-if="scope.row.type===1" class="top-padding-bottom left-padding-right c-default" type="text" @click="handleSceneSync(scope.row)">{{ $t('table.push') }}</el-button>
                </el-tooltip>
                <el-button   class="top-padding-bottom left-padding-right c-default" type="text" @click="handleInstructions(scope.row)">{{ $t('table.instruction') + $t('table.history') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-col class="tc mt-5">
           <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10,,20, 50, 100, 500]"
            :page-size="PageSize"
            layout="sizes, prev, pager, next"
            :total="total"
            >
          </el-pagination>
           </el-col>
          </el-col>
        </el-col>
        <el-col v-if="syncFlag && !instructionsFlag">
          <Synchronize @handleBatchBack="handleBatchBack" :paramsId='scenelds'></Synchronize>
        </el-col>
        <el-col v-if="instructionsFlag" class="mt-20">
          <el-col :span="5">
            <el-button type="text" class="c-default" icon="el-icon-arrow-left" @click="handleBack">{{ $t('btns.back') }}</el-button>
          </el-col>
          <el-col :span="19">
            <el-form ref="form" size="small" @submit.native.prevent :inline="true" :model="form" class="tr">
              <el-form-item>
                <el-date-picker
                  size="small"
                  v-model="feedbackTime"
                  type="daterange"
                  :range-separator="$t('table.to')"
                  :start-placeholder="$t('table.startDate')"
                  :end-placeholder="$t('table.endDate')">
                </el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-input v-model="instructionsData.mac" :placeholder="$t('table.pleaseEnter') + $t('table.deviceNo')"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="queryFeedbackList">{{ $t('btns.query') }}</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col>
            <CommandFeedback ref="CommandFeedback" :classFlag="false" :instructionsData="instructionsData" :operateAt="3" :feedbackTime="feedbackTime"></CommandFeedback>
          </el-col>
        </el-col>
      </el-col>
      <el-dialog :title="$t('dialog.addEditScene')" :close-on-click-modal="false" :modal="false" :visible.sync="sceneFlag" @close="detailsFlag = false" width="35%" top="30vh" id="scenes-form">
        <el-form :model="scenes" size="small">
          <el-form-item v-show="false" :label="$t('dialog.sceneId')" :label-width="formLabelWidth">
            <el-input v-model="scenes.id" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.sceneName')" :label-width="formLabelWidth">
            <el-input v-model="scenes.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.remark')" :label-width="formLabelWidth">
            <el-input v-model="scenes.remark" autocomplete="off"></el-input>
          </el-form-item>
            <el-form-item label="场景类型" :label-width="formLabelWidth"  v-show="!detailsFlag">
            <el-select v-model="sceneValue" placeholder="请选择">
            <el-option
              v-for="item in optionTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
              </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" v-if="detailsFlag" @click="handleDetails">{{ $t('control.details2') }}</el-button>
          <el-button size="small" @click="handleSceneCancel">{{ $t('btns.cancel2') }}</el-button>
          <el-button size="small" type="primary" @click="handleSceneSave">{{ $t('btns.ok2')}}</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="$t('dialog.lineChoose')" :modal="false" :visible.sync="lineSelectionFlag" top="30vh" id="line-selection" @close="handleCloseLineSelection">
        <el-form :model="lineSelection" size="small">
          <el-form-item :label="$t('dialog.lineLocation')" :label-width="formLabelWidth">
            <el-select v-model="lineSelection.build" :placeholder="$t('placeholder.pleaseChoose')" @change="handleLineBuilding">
              <el-option
                v-for="(item, index) in lineBuilding"
                :key="index"
                :label="item.name"
                :value="index">
              </el-option>
            </el-select>
            <el-select v-model="lineSelection.unit" :placeholder="$t('placeholder.pleaseChoose')" @change="handleLineUnit">
              <el-option
                v-for="(item, index) in lineUnit"
                :key="index"
                :label="item.name"
                :value="index">
              </el-option>
            </el-select>
            <el-select v-model="lineSelection.room" :placeholder="$t('placeholder.pleaseChoose')" @change="handleLineRoom">
              <el-option
                v-for="(item, index) in lineRoom"
                :key="index"
                :label="item.name + ' [' + item.mac + ']'"
                :value="item.name + ' [' + item.mac + ']'">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <el-table :data="lineSelectionData" size="small">
          <el-table-column property="title" :label="$t('table.lineName')" align="center"></el-table-column>
          <el-table-column :label="$t('table.status')" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.others.online === -1">{{ $t('table.offLine')}}</span>
              <span v-else-if="!scope.row.others.online || scope.row.others.online === 0" class="danger-text">{{ $t('control.offline') }}</span>
              <span v-else-if="scope.row.others.online === 1" class="normal-text">{{ $t('table.online') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.operating')" align="center">
            <template slot-scope="scope">
              <el-tooltip :content="$t('table.addDeviceLine')" placement="top">
               <el-button type="success" size="mini" :disabled="scope.row.others.assign && scope.row.others.assign === 'Y'" @click="handleAssign(scope.row.mac, scope.row.addr, 'add')" icon="iconfont icon-caidanzhankai"></el-button>
              </el-tooltip>
              <el-tooltip :content="$t('table.deleteDeviceLine')" placement="top">
                <el-button type="success" size="mini" :disabled="!scope.row.others.assign && scope.row.others.assign !== 'Y'" @click="handleAssign(scope.row.mac, scope.row.addr, 'del')" icon="iconfont icon-caidanzhankai-copy"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog :title="$t('dialog.addEditTiming')" :close-on-click-modal="false" :modal="false" :visible.sync="timerFlag" width="45%" top="30vh" id="scene-timer">
        <el-form :model="sceneTimer" size="small">
          <el-form-item :label="$t('dialog.timingType') + ':'" :label-width="formLabelWidth">
            <el-select v-model="sceneTimer.timerType" :placeholder="$t('placeholder.pleaseChoose')" @change="handleTimerType">
              <el-option
                v-for="(item, index) in timerType"
                :key="index"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('dialog.time') + ':'" :label-width="formLabelWidth">
            <el-time-picker v-if="sceneTimer.timerType === '2'"
            v-model="sceneTimer.time"
            format='HH:mm'
            value-format="HH:mm">
          </el-time-picker>
          <el-date-picker v-if="sceneTimer.timerType === '1'"
            v-model="sceneTimer.time"
            format='yyyy-MM-dd HH:mm'
            value-format="yyyy-MM-dd HH:mm"
            type="datetime">
          </el-date-picker>
          </el-form-item>
          <el-form-item :label=" $t('table.status') + ':'" :label-width="formLabelWidth">
            <el-select v-model="sceneTimer.timerStatus">
              <el-option
                v-for="(item, index) in timerStatus"
                :key="index"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('dialog.repeat') + ':'" :label-width="formLabelWidth">
            <el-checkbox-group v-model="sceneTimer.week" @change="handleCheckedWeekChange">
              <el-checkbox v-for="week in weekList" :label="week" :key="week" :disabled="sceneTimer.timerType === '1'">{{week}}</el-checkbox>
            </el-checkbox-group>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" :disabled="sceneTimer.timerType === '1'" @change="handleCheckAllChange">{{ $t('system.Indeterminate') }}</el-checkbox>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="handleSceneTimerCancel">{{ $t('btns.cancel2') }}</el-button>
          <el-button size="small" type="primary" @click="handleSceneTimerSave">{{ $t('btns.ok2') }}</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="$t('dialog.sceneDetails')" :close-on-click-modal="false" :modal="false" :visible.sync="sceneViewFlag" width="35%" top="30vh" id="scene-view">
        <el-col class="scene-name">{{ $t('table.sceneName') + ': '}}<span class="fw">{{sceneName}}</span></el-col>
        <el-card class="box-card" shadow="never" v-if="senceType===1">
          <div slot="header" class="clearfix">
            <span>{{ $t('dialog.addedTiming') }}</span>
            <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-plus" @click="handleSceneTimer(sceneId)"></el-button>
          </div>
          <div v-for="(item, index) in timerList" :key="index" class="text item">
            <el-row>
              <el-col :span="8">{{ item.time }}</el-col>
              <el-col :span="10">{{ item.weekday ? $t('dialog.weekly') + item.weekday : $t('dialog.single') }}</el-col>
              <el-col :span="2">{{ item.status === 'true' ? $t('table.closing') : $t('table.opening')}}</el-col>
              <el-col :span="4">
                <i @click="handleSceneTimer(sceneId, item)" class="iconfont icon-bianji"></i>
                <i @click="handleDelSceneTimer(item.timeId)" class="iconfont icon-shanchu"></i>
              </el-col>
            </el-row>
          </div>
        </el-card>
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span>{{ $t('dialog.addedLine') }}</span>
            <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-plus" @click="handleLine(sceneId)"></el-button>
          </div>
          <div v-for="(item, index) in addrList" :key="index" class="text item">
            <el-row v-for="(v, i) in item.addrs" :key="i">
              <el-col :span="6" >{{ v.title ? v.title : $t('table.line') + ':' + v.addr}}</el-col>
              <el-col v-if="senceType===1" :span="14">{{ item.build  + item.unit + item.room + '(' + item.mac + ')'}}</el-col>
              <el-col v-if="senceType===2" :span="9">{{ item.build  + item.unit + item.room + '(' + item.mac + ')'}}</el-col>
              <el-col v-if="senceType===2" :span="5"> <el-switch
                        :active-value="1"
                        :inactive-value="2"
                        v-model="v.actionType"
              active-color="#eaecf0"
              inactive-color="#13ce66"
              active-text="分闸"
              inactive-text="合闸"
              @change="changeLineStatus(v.actionType,item, v.addr)">
            </el-switch></el-col>
              <el-col :span="4">
                <i @click="handleAssign(item.mac, v.addr, 'del')" class="iconfont icon-shanchu"></i>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-dialog>
      <el-dialog :title="$t('dialog.equipmentParameterAdjustment')" :close-on-click-modal="false" :modal="false" :visible.sync="adjustmentFlag" top="30vh" width="80%" id="adjustment-view">
        <i class="el-icon-loading adjustment-modal" v-if="refreshLoading"></i>
        <el-scrollbar style="height:100%">
        <el-form :model="adjustment">
          <el-row>
          <el-col :span="24">
            <el-col :span="12">
              <el-form-item :label="$t('dialog.deviceNo') + ':'" label-width="100px" class="adjustment-mac">
                <el-input v-model="adjustment.mac" autocomplete="off" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('dialog.deviceAlias') + ':'" label-width="100px">
                <el-input v-if="aliasFlag" v-model="adjustment.name" @blur="handleAlias(adjustment.mac, adjustment.name)" @keyup.enter.native="$event.target.blur" autocomplete="off"></el-input>
                <span v-else class="adjustment-alias" @mouseover="aliasIndex = adjustment.mac" @mouseout="aliasIndex = -1">{{adjustment.name}}<transition name="fades"><i class="el-icon-edit" v-show="aliasIndex === adjustment.mac" @click="aliasFlag = !aliasFlag"></i></transition></span>
              </el-form-item>
            </el-col>
          </el-col>
          <el-col :span="24">
            <el-form-item>
              {{ $t('dialog.alarmThresholdSetting') + '：' }}<el-button type="text" :style="{ fontSize: '18px' }" :disabled="disabledFlag" icon="el-icon-refresh alarm-threshold-refresh" @click="handleAdjustment(adjustment.mac, adjustment.name)"></el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-for="(item, index) in adjustments" :key="index">
              <el-input v-if="nodeFlag === index" class="adjustment-title" @blur="handleNodeTitle(adjustment.mac, item.nodeNo, item.title)" @keyup.enter.native="$event.target.blur" v-model="item.title" autocomplete="off"></el-input>
              <span v-else @mouseover="adjustmentLineIndex = item.nodeNo" @mouseout="adjustmentLineIndex = -1" class="adjustment-name"><transition name="fades"><i class="el-icon-edit" v-show="adjustmentLineIndex === item.nodeNo" @click="nodeFlag = index"></i></transition>{{item.title}}:</span>
              <el-row class="adjustment-content">
                <el-col :span="4" v-show="item.curL || item.curL === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'curL')" @mouseout.stop="adjustmentIndex = -1">{{ $t('dialog.currentLowerLimit') + '：'}}<el-input v-model="item.curL" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.curL, item.curH, '0xC8')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-curL'" autocomplete="off"></el-input><span v-else>{{item.curL}}</span>A<transition name="fades"><i class="el-icon-edit" v-show="adjustmentIndex === index + '-curL'" @click="handleModel(index, 'curL')"></i></transition></span>
                </el-col>
                <el-col :span="4" v-show="item.curH || item.curH === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'curH')" @mouseout.stop="adjustmentIndex = -1">{{ $t('dialog.currentLimit') + '：'}}<el-input v-model="item.curH" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.curL, item.curH, '0xC8')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-curH'" autocomplete="off"></el-input><span v-else>{{item.curH}}</span>A<transition name="fades"><i class="el-icon-edit" v-show="adjustmentIndex === index + '-curH'" @click="handleModel(index, 'curH')"></i></transition></span>
                </el-col>
                <el-col :span="4" v-show="item.volL || item.volL === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'volL')" @mouseout.stop="adjustmentIndex = -1">{{ $t('dialog.voltageLowerLimit') + '：'}}<el-input v-model="item.volL" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.volL, item.volH, '0xC7')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-volL'" autocomplete="off"></el-input><span v-else>{{item.volL}}</span>V<transition name="fades"><i class="el-icon-edit" v-show="adjustmentIndex === index + '-volL'" @click="handleModel(index, 'volL')"></i></transition></span>
                </el-col>
                <el-col :span="4" v-show="item.volH || item.volH === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'volH')" @mouseout.stop="adjustmentIndex = -1">{{ $t('dialog.voltageLimit') + '：'}}<el-input v-model="item.volH" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.volL, item.volH, '0xC7')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-volH'" autocomplete="off"></el-input><span v-else>{{item.volH}}</span>V<transition name="fades"><i class="el-icon-edit" v-show="adjustmentIndex === index + '-volH'" @click="handleModel(index, 'volH')"></i></transition></span>
                </el-col>
                <el-col :span="4" v-show="item.pwrL || item.pwrL === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'pwrL')" @mouseout.stop="adjustmentIndex = -1">{{ $t('dialog.powerLowerLimit') + '：'}}<el-input v-model="item.pwrL" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.pwrL, item.pwrH, '0xC6')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-pwrL'" autocomplete="off"></el-input><span v-else>{{item.pwrL}}</span>W<transition name="fades"><i class="el-icon-edit" v-show="adjustmentIndex === index + '-pwrL'" @click="handleModel(index, 'pwrL')"></i></transition></span>
                </el-col>
                <el-col :span="4" v-show="item.pwrH || item.pwrH === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'pwrH')" @mouseout.stop="adjustmentIndex = -1">{{ $t('dialog.powerLimit') + '：'}}<el-input v-model="item.pwrH" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.pwrL, item.pwrH, '0xC6')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-pwrH'" autocomplete="off"></el-input><span v-else>{{item.pwrH}}</span>W<transition name="fades"><i class="el-icon-edit" v-show="adjustmentIndex === index + '-pwrH'" @click="handleModel(index, 'pwrH')"></i></transition></span>
                </el-col>
                <el-col :span="4" v-show="item.lkiL || item.lkiL === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'lkiL')" @mouseout.stop="adjustmentIndex = -1">{{ $t('dialog.leakageLowerLimit') + '：'}}<el-input v-model="item.lkiL" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.lkiL, item.lkiH, '0xC9')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-lkiL'" autocomplete="off"></el-input><span v-else>{{item.lkiL}}</span>mA<transition name="fades"><i class="el-icon-edit" v-show="adjustmentIndex === index + '-lkiL'" @click="handleModel(index, 'lkiL')"></i></transition></span>
                </el-col>
                <el-col :span="4" v-show="item.lkiH || item.lkiH === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'lkiH')" @mouseout.stop="adjustmentIndex = -1">{{ $t('dialog.leakageLimit') + '：'}}<el-input v-model="item.lkiH" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.lkiL, item.lkiH, '0xC9')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-lkiH'" autocomplete="off"></el-input><span v-else>{{item.lkiH}}</span>mA<transition name="fades"><i class="el-icon-edit" v-show="adjustmentIndex === index + '-lkiH'" @click="handleModel(index, 'lkiH')"></i></transition></span>
                </el-col>
                <el-col :span="4" v-show="item.tmpL || item.tmpL === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'tmpL')" @mouseout.stop="adjustmentIndex = -1">{{ $t('dialog.temperatureLowerLimit') + '：'}}<el-input v-model="item.tmpL" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.tmpL, item.tmpH, '0xCA')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-tmpL'" autocomplete="off"></el-input><span v-else>{{item.tmpL}}</span>℃<transition name="fades"><i class="el-icon-edit" v-show="adjustmentIndex === index + '-tmpL'" @click="handleModel(index, 'tmpL')"></i></transition></span>
                </el-col>
                <el-col :span="4" v-show="item.tmpH || item.tmpH === ''">
                  <span @mouseover.stop="adjustmentOver(index, 'tmpH')" @mouseout.stop="adjustmentIndex = -1">{{ $t('dialog.temperatureLimit') + '：'}}<el-input v-model="item.tmpH" @blur="handleNodeAttr(adjustment.mac, item.nodeNo, item.tmpL, item.tmpH, '0xCA')" @keyup.enter.native="$event.target.blur" v-if="adjustmentModelIndex === index + '-tmpH'" autocomplete="off"></el-input><span v-else>{{item.tmpH}}</span>℃<transition name="fades"><i class="el-icon-edit" v-show="adjustmentIndex === index + '-tmpH'" @click="handleModel(index, 'tmpH')"></i></transition></span>
                </el-col>
              </el-row>
              <div class="divider-gray"></div>
            </el-form-item>
          </el-col>
          </el-row>
        </el-form>
        </el-scrollbar>
      </el-dialog>
    </div>
</template>
<script>
/* global config */
import { getBuildings, syncScene, queryChannels, queryScenes, scenesLock, scenesUpdate, scenesDel, scenesCtlOc, addrMod, timerMod, sceneInfo, queryChnlAttr, macAlias, updateNodeTitle, updateChnlAttr, modActionType } from '@/api/api'
import CommandFeedback from '../Common/CommandFeedback'
import Synchronize from './Synchronize'
export default {
  data () {
    return {
      addrOpen: false,
      addrClose: true,
      senceType: '',
      sceneValue: 1,
      optionTypes: [{label: '自动', value: 1}, {label: '手动', value: 2}],
      config: [],
      form: {},
      sceneFlag: false,
      scenesData: [],
      scenes: {
        id: '',
        name: '',
        remark: ''
      },
      scenelds: '',
      formLabelWidth: '80px',
      lineSelectionFlag: false,
      lineSelectionData: [],
      lineBuilding: [],
      lineUnit: [],
      lineRoom: [],
      lineSelection: {
        build: '',
        unit: '',
        room: ''
      },
      extParam: '',
      timerFlag: false,
      timerId: '',
      timerType: [{
        name: this.$t('dialog.singleTiming'),
        value: '1'
      }, {
        name: this.$t('dialog.cycleTiming'),
        value: '2'
      }],
      timerStatus: [{
        name: this.$t('table.closing'),
        value: 'true'
      }, {
        name: this.$t('table.opening'),
        value: 'false'
      }],
      weekList: [this.$t('dialog.Sunday'), this.$t('dialog.Monday'), this.$t('dialog.Tuesday'), this.$t('dialog.Wednesday'), this.$t('dialog.Thursday'), this.$t('dialog.Friday'), this.$t('dialog.Saturday')],
      checkAll: false,
      isIndeterminate: true,
      instructionsFlag: false,
      instructionsData: {},
      sceneTimer: {
        timerType: '1',
        timerStatus: 'true',
        time: this.$func.getNowFormatDateTime(),
        week: []
      },
      sceneViewFlag: false,
      sceneName: '',
      sceneId: '',
      timerList: [],
      addrList: [],
      checkBuildIndex: 0,
      adjustmentFlag: false,
      adjustments: [],
      adjustment: {
        mac: '',
        name: ''
      },
      adjustmentIndex: -1,
      adjustmentModelIndex: -1,
      adjustmentLineIndex: -1,
      nodeFlag: -1,
      aliasIndex: -1,
      aliasFlag: false,
      refreshLoading: false,
      loading: false,
      disabledFlag: false,
      syncFlag: false,
      detailsFlag: false,
      tableComponentHeight: this.$store.state.BuiltInTimingHeight,
      feedbackTime: [''],
      pageSize: 10,
      total: 0,
      currentPage: 1
    }
  },
  mounted () {
    this.init()
    this.config = config
  },
  methods: {
    init () {
      this.queryScenes()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.queryScenes()
    },
    changeLineStatus (val, item, line) {
      // console.log(this.addrOpen)
      // console.log(val, this.addrList, '====val')
      let params = {
        projectCode: this.$store.state.projectCode,
        sceneId: this.sceneId,
        mac: item.mac,
        addr: line,
        actionType: val
      }
      modActionType(params).then(res => {
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
      }).catch(err => {
        if (err) {
          this.$message({
            message: this.$t('message.unknown'),
            type: 'error'
          })
        }
      })

      if (val) {
        // 此为进行分闸操作

      } else {
        // 此为进行合闸操作
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.queryScenes()
    },
    queryScenes () {
      let params = {
        projectCode: this.$store.state.projectCode,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        type: 0
      }
      this.$nextTick(function () {
        queryScenes(params)
          .then(res => {
            if (res.success) {
              //  console.log(res.datas)
              this.scenesData = res.datas
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
      })
    },
    handleCommand (val) {
      console.log(val)
      if (val.command === 'execute') {
        this.handleSceneOc(val.sceneId, 'close')
      } else if (val.command === 'delete') {
        this.handleSceneDel(val.sceneId)
      } else if (val.command === 'history') {
        this.handleInstructions(val.row)
      }
    },
    queryFeedbackList () {
      this.$refs.CommandFeedback.handleFeedBackList()
    },
    handleSceneStatus (ele) {
      let params = {
        projectCode: this.$store.state.projectCode,
        sceneId: ele
      }
      scenesLock(params)
        .then(res => {
          if (res.success) {
            this.queryScenes()
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
    handleSceneEdit (obj, val) {
      if (val) {
        this.detailsFlag = true
      }
      this.senceType = obj.type
      this.scenes.id = ''
      this.scenes.name = ''
      this.scenes.remark = ''
      this.sceneFlag = true
      if (obj.sceneId) {
        this.scenes.id = obj.sceneId
        this.scenes.name = obj.sceneName
        this.scenes.remark = obj.remark
      }
    },
    handleDetails () {
      this.sceneFlag = false
      this.detailsFlag = false

      this.handleViewScene(this.scenes.id)
    },
    handleSceneCancel () {
      this.sceneFlag = false
      this.detailsFlag = false
      this.scenes.id = ''
      this.scenes.name = ''
      this.scenes.remark = ''
    },
    handleSceneSave () {
      if (this.scenes.name === '') {
        this.$message({
          message: this.$t('table.pleaseEnter') + this.$t('table.sceneName'),
          type: 'error'
        })
        return false
      }
      let params = {
        projectCode: this.$store.state.projectCode,
        sceneId: this.scenes.id,
        sceneName: this.scenes.name,
        remark: this.scenes.remark,
        type: this.sceneValue
      }
      scenesUpdate(params)
        .then(res => {
          if (res.success) {
            this.handleSceneCancel()
            this.queryScenes()
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
    handleSceneDel (ele) {
      let params = {
        projectCode: this.$store.state.projectCode,
        sceneId: ele
      }
      this.$confirm(this.$t('message.confirmDeleteScene'), this.$t('dialog.prompt'), {
        confirmButtonText: this.$t('btns.ok'),
        cancelButtonText: this.$t('btns.cancel'),
        type: 'warning'
      }).then(() => {
        scenesDel(params)
          .then(res => {
            if (res.success) {
              this.queryScenes()
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.undelete')
        })
      })
    },
    handleSceneOc (ele, oc) {
      if (this.config.authority.CTL_AUTHORITY === 'false') {
        this.$func.controlAuthority(this.config.authority.CTL_AUTHORITY)
        return false
      }
      let params = {
        projectCode: this.$store.state.projectCode,
        sceneId: ele,
        openClose: oc,
        _operate_at: '3' + ':' + ele
      }
      this.$confirm(this.$t('message.whetherAKey') + (oc === 'open' ? this.$t('dialog.open') : this.$t('table.operating')) + this.$t('message.thisScene'), this.$t('dialog.prompt'), {
        confirmButtonText: this.$t('btns.ok'),
        cancelButtonText: this.$t('btns.cancel'),
        type: 'warning'
      }).then(() => {
        scenesCtlOc(params)
          .then(res => {
            if (res.success) {
              this.$message({
                message: this.$t('message.controlSuccess'),
                type: 'success'
              })
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.oneButtonCanceled') + (oc === 'open' ? this.$t('dialog.open') : this.$t('dialog.close')) + this.$t('message.scene')
        })
      })
    },
    handleInstructions (row) {
      this.instructionsFlag = true
      this.instructionsData = row
      this.feedbackTime = [this.$func.formatDate('yyyy-MM-dd HH:mm:ss', new Date() - 86400000 * 7), this.$func.getNowFormatDateTime()]
    },
    handleBack () {
      this.instructionsFlag = false
      this.syncFlag = false
    },
    handleLine (ele) {
      this.lineSelectionFlag = true
      this.extParam = ele
      this.sceneId = ele
      this.handleGetBuildings()
    },
    handleGetBuildings () {
      let params = {
        projectCode: this.$store.state.projectCode,
        all: true
      }
      getBuildings(params)
        .then(res => {
          this.lineBuilding = res.data
          this.lineSelection.build = this.lineBuilding[0].name
          this.lineUnit = this.lineBuilding[0].childs
          this.lineSelection.unit = this.lineUnit[0].name
          this.lineRoom = this.lineUnit[0].childs
          this.lineSelection.room = this.lineUnit[0].childs[0].name + ' [' + this.lineUnit[0].childs[0].mac + ']'
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
    getAllBuilding () {
      let params = {
        projectCode: this.$store.state.projectCode,
        all: true
      }
      getBuildings(params)
        .then(res => {
          this.lineBuilding = res.data
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
    handleLineBuilding (val) {
      this.lineSelection.build = this.lineBuilding[val].name
      this.lineUnit = this.lineBuilding[val].childs
      this.lineSelection.unit = this.lineUnit[0].name
      this.lineRoom = this.lineUnit[0].childs
      this.lineSelection.room = this.lineRoom[0].name + ' [' + this.lineUnit[0].childs[0].mac + ']'
    },
    handleLineUnit (val) {
      this.lineRoom = this.lineUnit[val].childs
      this.lineSelection.unit = this.lineUnit[val].name
      this.lineSelection.room = this.lineRoom[0].name + ' [' + this.lineUnit[0].childs[0].mac + ']'
    },
    handleLineRoom (val) {},
    handleCloseLineSelection () {
      this.lineSelection.build = ''
      this.lineSelection.unit = ''
      this.lineSelection.room = ''
      this.lineSelectionData = []
    },
    queryDeviceLines () {
      let params = {
        pageNo: 1,
        pageSize: 10,
        projectCode: this.$store.state.projectCode,
        build: this.lineSelection.build,
        unit: this.lineSelection.unit,
        room: this.lineSelection.room !== '' ? this.lineSelection.room.split(' [')[1].split(']')[0] : '',
        mac: this.lineSelection.room !== '' ? this.lineSelection.room.split(' [')[1].split(']')[0] : '',
        forwhat: 'SCENE_DETAIL',
        extParam: this.extParam
      }
      if (!params.build || !params.unit || !params.room) {
        return false
      }
      queryChannels(params)
        .then(res => {
          if (res.success) {
            this.lineSelectionData = res.datas
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
    handleAssign (mac, addr, oper) {
      let params = {
        projectCode: this.$store.state.projectCode,
        sceneId: this.sceneId,
        mac: mac,
        addr: addr,
        oper: oper
      }
      addrMod(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('message.scene') + this.$t('table.line') + (oper === 'add' ? this.$t('system.add') : this.$t('system.delete')) + this.$t('system.success') + '！',
              type: 'success'
            })
            this.queryDeviceLines()
            this.queryScenes()
            if (this.sceneViewFlag === true) {
              this.handleViewScene(this.sceneId)
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
    },
    handleSceneTimer (ele, obj) {
      this.extParam = ele
      this.timerFlag = true
      if (obj) {
        if (obj.weekday) {
          this.sceneTimer.timerType = '2'
          this.sceneTimer.week = obj.weekday.split(',')
          if (this.sceneTimer.week.length === 7) {
            this.isIndeterminate = false
            this.checkAll = true
          } else {
            this.isIndeterminate = true
            this.checkAll = false
          }
        } else {
          this.sceneTimer.timerType = '1'
          this.isIndeterminate = false
          this.checkAll = false
        }
        this.sceneTimer.time = obj.time
        this.sceneTimer.timerStatus = obj.status
        this.timerId = obj.timerId
      }
    },
    handleCheckAllChange (val) {
      this.sceneTimer.week = val ? this.weekList : []
      this.isIndeterminate = false
    },
    handleCheckedWeekChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.weekList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.weekList.length
    },
    handleSceneTimerSave () {
      if (this.sceneTimer.timerType === '2' && this.sceneTimer.week.length === 0) {
        this.$message({
          message: this.$t('message.selectDuplicate'),
          type: 'error'
        })
        return false
      }
      let selectTime = ''
      if (this.sceneTimer.time.length === 5 || this.sceneTimer.time.length === 16) {
        selectTime = this.sceneTimer.time + ':00'
      } else {
        selectTime = this.sceneTimer.time.substring(0, this.sceneTimer.time.length - 2) + '00'
      }
      let params = {
        sceneId: this.extParam,
        timerId: this.timerId,
        weekday: this.sceneTimer.week.join(','),
        timerType: this.sceneTimer.timerType,
        time: selectTime,
        status: this.sceneTimer.timerStatus,
        projectCode: this.$store.state.projectCode,
        oper: 'add'
      }
      timerMod(params)
        .then(res => {
          if (res.success) {
            this.timerFlag = false
            this.sceneTimer.week = []
            this.sceneTimer.timerType = '1'
            this.sceneTimer.timerStatus = 'true'
            this.sceneTimer.time = this.$func.getNowFormatDateTime()
            this.$message({
              message: res.message,
              type: 'success'
            })
            if (this.sceneViewFlag === true) {
              this.handleViewScene(this.sceneId)
              this.timerId = ''
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
    handleSceneTimerCancel () {
      this.extParam = ''
      this.timerFlag = false
      this.sceneTimer.week = []
      this.sceneTimer.timerType = '1'
      this.sceneTimer.timerStatus = 'true'
      this.sceneTimer.time = this.$func.getNowFormatDateTime()
    },
    handleTimerType (val) {
      if (val === '2') {
        this.sceneTimer.time = this.$func.getNowFormatDateTime('time')
      } else if (val === '1') {
        this.sceneTimer.time = this.$func.getNowFormatDateTime()
        this.sceneTimer.week = []
      }
    },
    handleViewScene (ele, row) {
      if (row) {
        this.senceType = row.type
      }

      let params = {
        projectCode: this.$store.state.projectCode,
        sceneId: ele
      }

      sceneInfo(params)
        .then(res => {
          if (res.success) {
            this.timerList = res.data.timers
            if (this.senceType === 2) {
              this.addrList = res.data.devices.map(item => ({...item, actionType: item.addrs[0].actionType}))
            } else {
              this.addrList = res.data.devices
            }
            // console.log(res.data, '=========res.data.devices')
            this.sceneName = res.data.sceneName
            this.sceneId = ele
            this.sceneViewFlag = true
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
    handleDelSceneTimer (ele) {
      let params = {
        projectCode: this.$store.state.projectCode,
        sceneId: this.sceneId,
        timerId: ele,
        oper: 'del'
      }
      timerMod(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            if (this.sceneViewFlag === true) {
              this.handleViewScene(this.sceneId)
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
    renderCheckbox () {
      this.lineCheckedUnit = this.lineBuilding[0]['childs']
      this.lineCheckedRoom = this.lineCheckedUnit[0]['childs']
    },
    handleAdjustment (mac, name) {
      if (config.authority.BOX_ATTR_MODIFY !== 'true') return false
      this.adjustmentFlag = true
      this.aliasFlag = false
      this.aliasIndex = -1
      this.nodeFlag = -1
      this.adjustmentLineIndex = -1
      this.adjustmentModelIndex = -1
      this.adjustment.mac = mac
      this.adjustment.name = name
      this.refreshLoading = true
      let ele = document.querySelector('.alarm-threshold-refresh')
      if (ele) {
        this.disabledFlag = true
        setTimeout(() => {
          this.disabledFlag = false
        }, 3000)
      }
      queryChnlAttr({mac: mac})
        .then(res => {
          if (res.success) {
            this.adjustments = res.data
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
    adjustmentOver (index, name) {
      this.adjustmentIndex = index + '-' + name
    },
    handleModel (index, name) {
      this.adjustmentModelIndex = index + '-' + name
    },
    handleAlias (mac, name) {
      macAlias({mac: mac, name: name})
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('dialog.deviceAlias') + this.$t('message.successfulModified') + '！',
              type: 'success'
            })
            this.queryList()
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
    handleNodeTitle (mac, nodeNo, title) {
      updateNodeTitle({mac: mac, nodeNo: nodeNo, title: title})
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('message.controlSuccess'),
              type: 'success'
            })
            this.handleAdjustment(mac, this.adjustment.name)
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
          this.nodeFlag = -1
          this.adjustmentLineIndex = -1
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
    handleNodeAttr (mac, nodeNo, lower, upper, type) {
      let params = {
        mac: mac,
        nodeNo: nodeNo,
        lower: lower,
        upper: upper,
        type: type
      }
      updateChnlAttr(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('message.controlSuccess'),
              type: 'success'
            })
            this.handleAdjustment(mac, this.adjustment.name)
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
          this.adjustmentModelIndex = -1
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
    handleSceneSync (row) {
      this.scenelds = row.sceneId
      syncScene({sceneId: this.scenelds})
        .then(res => {
          if (res.success) {
            this.syncFlag = true
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
    handleBatchBack () {
      this.syncFlag = false
    },
    handlelinkageScene () {
      this.linkageFlag = true
    }
  },
  watch: {
    lineSelection: {
      handler (newVal, oldVal) {
        if (newVal) {
          this.queryDeviceLines()
        }
      },
      deep: true
    },
    '$store.state.channelsTableHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.tableComponentHeight = newVal
        }
      },
      '$store.state.projectCode': {
        handler (newVal, oldVal) {
          if (newVal) {
            this.init()
          }
        }
      }
    }
  },
  components: {
    Synchronize,
    CommandFeedback
  }
}
</script>
<style lang="stylus" scoped>
.el-tabs >>> .el-tabs__item
    color #fff
.danger-text
    color #FF5722
.normal-text
    color #5FB878
.red-text
    color #F00
.el-table >>> .el-button--mini
    padding 3px
.el-table >>> .el-button+.el-button, .view-scene, .icon-weibiaoti-
    margin-left:4px
.el-table >>> .el-table__body-wrapper
    overflow-x auto
#scenes-form .el-form-item >>> .el-form-item__label, #line-selection .el-form-item >>> .el-form-item__label, #scene-timer .el-form-item >>> .el-form-item__label
    color #333
#line-selection .el-form >>> .el-input__inner
    width 170px
#scene-timer .el-form .el-select, #scene-timer .el-form .el-date-editor--datetime
    width 100%
#line-selection .el-table, #line-selection >>> .el-table th, #line-selection >>> .el-table td
    border 1px solid #ebeef5
    color #909399
#line-selection .el-table td, #line-selection >>> .el-table th.is-leaf
    border-bottom 1px solid #ebeef5
#line-selection .el-table--border::after,#line-selection .el-table--group::after,#line-selection .el-table::before
    background-color #ebeef5
.scene-name
    padding 18px 20px !important
    color #333
    background rgb(217, 236, 255)
#scene-view >>> .el-dialog__body
    padding 0
#scene-view >>> .el-card
    border 1px solid transparent
.divider-gray
    margin 10px 0px
    display block
    height 1px
    width 100%
    background #C0C4CC
.adjustment-name
    padding-right 12px
    width 87px
    display inline-block
    text-align right
    cursor pointer
.adjustment-content
    margin-left 100px
    margin-top -40px
    >>> .el-input
        width 60px
        .el-input__inner
          padding 0 5px
          width 60px
    span
      cursor pointer
    .el-icon-edit
      margin-left 2px
      font-size 16px
.adjustment-mac >>> .el-input .el-input__inner
    padding-left 0
    border none
#adjustment-view
  >>> .el-dialog__body
    height 50vh
  .el-form-item >>> .el-form-item__label
    color #606266
.adjustment-modal
  position absolute
  left 50%
  top 50%
  margin-left -15px
  margin-top -15px
  font-size 30px
  color #23b48c
  z-index 9999
.adjustment-alias
  cursor pointer
  .el-icon-edit
    margin-left 2px
    font-size 16px
.adjustment-title
  width 86px
.text .el-row
  padding 5px 0
#control
  >>> .block .el-date-editor.el-input, .el-date-editor.el-input__inner, .short-input
        width 220px
</style>
