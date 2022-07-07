<template>
    <div id="linkageScene">
      <el-col>
        <el-col class="mt-10">
          <el-row>
            <el-button type="text" class="c-default" icon="el-icon-plus" @click="handleLinkageScene">{{ $t('control.linkage') + $t('btns.add') }}</el-button>
          </el-row>
        </el-col>
        <el-col>
          <el-table
            :data="linkageData"
            size="small"
            :height="tableComponentHeight"
            :max-height="tableComponentHeight"
            v-el_scrollBar:scrollBar>
            <el-table-column :label="$t('control.linkage') + $t('dialog.name')" align="center">
              <template slot-scope="scope">
                <span class="pointer c-default"  @click="handleViewScene(scope.row)">{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('table.status')" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 2" class="danger-text">{{ $t('system.disable') }}</span>
                <span v-else class="normal-text">{{ $t('system.enable') }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="remark" :label="$t('table.remark')" align="center">
            </el-table-column>
            <el-table-column :label="$t('table.operating')" align="center">
              <template slot-scope="scope">
                <el-button class="top-padding-bottom left-padding-right c-default" type="text" @click="handleLinkageScene(scope.row, 'edit')">{{ $t('control.edit') }}</el-button>
                <el-button class="top-padding-bottom left-padding-right c-default" type="text" @click="handleLinkagedeLock(scope.row)">{{ $t('table.stopAndStart') }}</el-button>
                <el-button class="top-padding-bottom left-padding-right c-default" type="text" @click="handleSceneDel(scope.row.id)">{{ $t('system.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
         <el-col class="tc mt-5">
           <el-pagination
            @size-change="handleNewSizeChange"
            @current-change="handleNewCurrentChange"
            :current-page.sync="newCurrentPage"
            :page-sizes="[10, 50, 100, 500]"
            :page-size="PageSize"
            layout="sizes, prev, pager, next"
            :total="newTotal"
            >
          </el-pagination>
           </el-col>
      </el-col>
      <el-dialog :title="$t('system.add') + '、' + $t('control.edit') + $t('control.linkage') + $t('dialog.name')" :close-on-click-modal="false" :modal="false" :visible.sync="linkageFlag" @close="detailsFlag = false" width="35%" top="30vh" id="scenes-form">
        <el-form :model="scenes" size="small">
          <el-form-item v-show="false" :label="$t('dialog.id')" :label-width="formLabelWidth">
            <el-input v-model="scenes.id" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('control.linkage') + $t('dialog.name')" :label-width="formLabelWidth">
            <el-input v-model="scenes.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.remark')" :label-width="formLabelWidth">
            <el-input v-model="scenes.remark" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" v-if="detailsFlag" @click="handleLinkageSceneDetails">{{ $t('control.details2') }}</el-button>
          <el-button size="small" @click="handleLinkageSceneClose">{{ $t('btns.cancel2') }}</el-button>
          <el-button size="small" type="primary" @click="handleLinkageSceneSave">{{ $t('btns.ok2')}}</el-button>
        </div>
      </el-dialog>
      <el-dialog
        :title="$t('control.linkage') + $t('control.details')"
        :visible.sync="dialogDetails"
        :close-on-click-modal="false"
        :modal="false"
        width="40%" top="20vh" id="scene-view"
        @close="dialogDetails = false">
        <el-row>
          <el-col :span="24" style="padding: 10px 25px 0">
            <el-form class="scene-form" size="small" label-position="left">
              <el-form-item :label="$t('control.linkage') + $t('dialog.name')" label-width="100px" required>
                <el-input v-model="scenes.name" readonly  autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item :label="$t('btns.if')" required>
                  <template>
                    <el-row>
                      <el-col :lg="16" :xl="10">
                        <el-select v-model="equipmentrValue" :disabled="equipmentFlag" style="width: 155px" size="small" :placeholder="$t('placeholder.pleaseChoose')">
                          <el-option
                            v-for="item in equipmentTypeAttr"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                        <el-select v-model="ifValue" style="width: 125px" size="small" :placeholder="$t('placeholder.pleaseChoose')">
                            <el-option
                              v-for="item in options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                        </el-select>
                      </el-col>
                      <el-col :lg="3" :xl="9" class="tr" style="margin-top: -5px;float: right">
                          <el-divider content-position="right">
                              <el-button size="small" type="text" icon="el-icon-plus" @click="handleIfAdd">{{ $t('system.add') }}</el-button>
                          </el-divider>
                      </el-col>
                    </el-row>
                    <el-col :span="24" class="tc">
                        <el-table
                          class="mt-10 device-wrap"
                          style="width: 100%"
                          :data="preList"
                          border
                          size="small">
                          <el-table-column
                            :label="$t('dialog.deviceName')">
                            <template slot-scope="scope">
                              <span>{{ scope.row.others.macName + '(' + scope.row.others.mac + ')' }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column
                            v-if="equipmentrValue === '1,2'"
                            :label="$t('table.line')">
                            <template slot-scope="scope">
                              <span>{{ scope.row.others.title }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column
                            width="200px"
                            :label="$t('btns.condition')">
                            <template slot-scope="scope">
                              <span v-if="scope.row.typeNumber === 9003">{{'水浸报警'||'_'}}</span>
                              <span v-else-if=" (scope.row.equipmentrValue === 11 || scope.row.others.equipmentType === 11)">{{ (scope.row.elecType === 4 ? $t('menu.temperature') : $t('menu.humidity')) + (scope.row.compType === 1 ? $t('menu.above') : $t('menu.below')) + '\xa0\xa0' + scope.row.compValue }}</span>
                              <span v-else-if="scope.row.equipmentrValue === 14 || scope.row.others.equipmentType === 14">{{ $t('echarts.illumination') + $t('echarts.celsius') + (scope.row.compType === 1 ? $t('menu.above') : $t('menu.below')) + '\xa0\xa0' + scope.row.compValue }}</span>
                              <span v-else-if="scope.row.equipmentrValue === 5 || scope.row.others.equipmentType === 5">{{(scope.row.elecType === 4?'温度': $t('control.pressure'))  + (scope.row.compType === 1 ? $t('menu.above') : $t('menu.below')) + '\xa0\xa0' + scope.row.compValue }}</span>
                              <span v-else-if="scope.row.equipmentrValue === 4 || scope.row.others.equipmentType === 4">{{(scope.row.elecType === 4?'温度': $t('control.level') ) + (scope.row.compType === 1 ? $t('menu.above') : $t('menu.below')) + '\xa0\xa0' + scope.row.compValue }}</span>
                              <span  v-else-if="scope.row.equipmentrValue !== '1,2' && scope.row.others.equipmentType !== 1 && scope.row.others.equipmentType !== 2 && scope.row.equipmentrValue !== 11 && scope.row.others.equipmentType !== 11 && scope.row.equipmentrValue !== 14 && scope.row.others.equipmentType !== 14">{{ scope.row.typeNumber === 2002 ? $t('control.smoke') + $t('home.alarm') : scope.row.typeNumber === 2006 ? $t('control.gas') + $t('home.alarm') : $t('control.device') + $t('control.malfunction') + $t('home.alarm') }}</span>
                              <span v-if="scope.row.equipmentrValue === '1,2' || scope.row.others.equipmentType === 1 || scope.row.others.equipmentType === 2">{{ scope.row.elecType === 1 ? $t('main.watt') : scope.row.elecType === 2 ? $t('main.ampere') : scope.row.elecType === 3 ? $t('menu.leakageCurrent') : scope.row.elecType === 4 ? $t('menu.temperature') : scope.row.elecType === 5 ? $t('main.volt') : ($t('table.switch') + $t('table.status')) }}</span>
                              <span v-if="scope.row.equipmentrValue === '1,2' || scope.row.others.equipmentType === 1 || scope.row.others.equipmentType === 2">{{ scope.row.calcType === 1 ? $t('table.summationValue') : scope.row.calcType === 2 ? $t('table.calculateValue') : scope.row.calcType === 3 ? $t('table.maximum') : scope.row.calcType === 4 ? $t('table.minimum') : scope.row.calcType === 5 ? $t('table.averageValue') : scope.row.calcType === 6 ? ($t('placeholder.all') + $t('table.line')) : ($t('placeholder.any') + $t('table.line')) }}</span>
                              <span v-if="scope.row.equipmentrValue === '1,2' || scope.row.others.equipmentType === 1 || scope.row.others.equipmentType === 2">{{ scope.row.compType === 1 ? $t('menu.greaterThan') : scope.row.compType === 2 ? $t('menu.lessThan') : $t('menu.beEqualTo') }}</span>
                              <span v-if="scope.row.equipmentrValue === '1,2' || scope.row.others.equipmentType === 1 || scope.row.others.equipmentType === 2">{{ scope.row.compValue === 'false' ? $t('table.opening') : scope.row.compValue === 'true' ? $t('table.closing') : scope.row.compValue }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column
                            width="100px"
                            :label="$t('table.operating')">
                            <template slot-scope="scope">
                              <el-button class="top-padding-bottom left-padding-right deviceHover" type="text" @click="handlelinkageScenePre(scope.row, scope.$index)">{{ $t('control.edit') }}</el-button>
                              <el-button class="top-padding-bottom left-padding-right deviceHover" type="text" @click="handleSceneDelPre(scope.$index)">{{ $t('system.delete') }}</el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                    </el-col>
                  </template>
              </el-form-item>
              <el-form-item :label="'\xa0\xa0' + $t('btns.executed')">
                  <el-col :span="20" style="margin-top: -5px;float: right">
                  <el-divider content-position="right">
                    <el-button size="small" type="text" icon="el-icon-plus" @click="handleAddAction">{{ $t('system.add') }}</el-button>
                  </el-divider>
                  </el-col>
                  <el-col :span="24">
                        <el-table
                          class="mt-10 device-wrap"
                          style="width: 100%"
                          :data="actionsList"
                          border
                          size="small">
                          <el-table-column
                            width="200"
                            :label="$t('dialog.deviceName')">
                            <template slot-scope="scope">
                              <span>{{ scope.row.others.macName + '(' + scope.row.others.mac + ')' }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column
                            width="150"
                            prop="others.title"
                            :label="$t('table.line')">
                          </el-table-column>
                          <el-table-column
                            :label="$t('control.action') + $t('table.type')">
                            <template slot-scope="scope">
                              <span>{{ scope.row.actionType === '1,3' ? $t('table.opening') : scope.row.actionType === '2,3' ? $t('table.closing') : scope.row.actionType === '1' ? $t('table.opening') : scope.row.actionType === '2' ? $t('table.closing') : '' }}</span>
                              <span>{{ scope.row.alarmTypeNo }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column
                            width="85"
                            :label="$t('table.operating')">
                            <template slot-scope="scope">
                              <el-button class="top-padding-bottom left-padding-right deviceHover" type="text" @click="handlelinkageSceneAction(scope.row, scope.$index)">{{ $t('control.edit') }}</el-button>
                              <el-button class="top-padding-bottom left-padding-right deviceHover" type="text" @click="handleSceneDelAction(scope.$index)">{{ $t('system.delete') }}</el-button>
                            </template>
                          </el-table-column>
                        </el-table>
                    </el-col>
              </el-form-item>
              <el-form-item :label="$t('dialog.effectiveTime')" label-width="100px" class="auto-complete" required>
                <el-date-picker
                  style="width:100%"
                  v-model="value1"
                  type="datetimerange"
                  :range-separator="$t('table.to')"
                  :start-placeholder="$t('table.startDate')"
                  :end-placeholder="$t('table.endDate')"
                  format='yyyy-MM-dd HH:mm'
                  value-format="yyyy-MM-dd HH:mm">
                </el-date-picker>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="handleLinkageDetailsClose">{{ $t('btns.cancel2') }}</el-button>
          <el-button size="small" type="primary" @click="handleLinkageDetailsSave">{{ $t('btns.ok2')}}</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="$t('system.add') +$t('dialog.precondition')" :close-on-click-modal="false" :modal="false" :before-close="handlePreClose" :visible.sync="preconditionFlag" width="35%" top="30vh" id="scenes-form">
        <el-form :model="preData" size="small" label-width="100px">
          <el-form-item required>
            <label slot="label" class="slot-label pointer deviceHover" @click="handlePreAdd('pre')">{{ '+' + $t('btns.select') + $t('control.device') + ':' }}</label>
            <el-input v-model="preData.mac" :placeholder="$t('placeholder.pleaseChoose')" readonly></el-input>
          </el-form-item>
          <el-form-item v-show="equipmentrValue === '1,2' && preData.mac" :label="$t('btns.conditionsType') + ':'">
            <label slot="label" class="slot-label pointer deviceHover" @click="handleLine('pre')">{{ '+' + $t('btns.select') + $t('table.line') + ':' }}</label>
            <el-tag
              v-show="tag.title.length > 0"
              v-for="(tag, index) in preData.tags"
              :key="index"
              closable
              @close="handleCloseTag('pre', tag)">
              {{tag.title}}
            </el-tag>
          </el-form-item>
          <el-form-item :label="$t('btns.conditionsType') + ':'" required v-if="equipmentrValue === 11 || equipmentrValue === 14 || equipmentrValue === '1,2'||equipmentrValue === 4|| equipmentrValue === 5">
            <el-col :span="12" style="padding-left: 0" v-if="equipmentrValue === 11">
              <el-select v-model="attrValue" :placeholder="$t('placeholder.pleaseChoose')">
                <el-option
                  v-for="item in conditionsAttr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="12" style="padding-left: 0" v-if="equipmentrValue === 14">
              <el-select v-model="attrValue" :placeholder="$t('placeholder.pleaseChoose')">
                <el-option
                  v-for="item in illuminanceAttr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="12" style="padding-right: 0" v-if="equipmentrValue === 11 || equipmentrValue === 14">
              <el-select v-model="typeValue" :placeholder="$t('placeholder.pleaseChoose')">
                <el-option
                  v-for="item in conditionsType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
              <!-- 压力设备条件类型 -->
             <el-col :span="12" style="padding-right: 0" v-if="equipmentrValue === 5">
              <el-select v-model="pressureValue" :placeholder="$t('placeholder.pleaseChoose')">
                <el-option
                  v-for="item in pressureType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <!-- =================================================== -->
            <!-- 液位设备条件类型 -->
             <el-col :span="12" style="padding-right: 0" v-if="equipmentrValue === 4">
              <el-select v-model="levelValue" :placeholder="$t('placeholder.pleaseChoose')">
                <el-option
                  v-for="item in leveltionsType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
             <el-col :span="12" style="padding-right: 0" v-if="equipmentrValue === 4||equipmentrValue === 5">
              <el-select v-model="typeValue" :placeholder="$t('placeholder.pleaseChoose')">
                <el-option
                  v-for="item in conditionsType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8" style="padding-left: 0" v-if="equipmentrValue === '1,2'">
              <el-select v-model="microBreakValue" @change="handlemicroBreak" :placeholder="$t('placeholder.pleaseChoose')">
                <el-option
                  v-for="item in microBreakAttr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8" v-if="equipmentrValue === '1,2' && microBreakValue !== 13">
              <el-select v-model="evaluateValue" :placeholder="$t('placeholder.pleaseChoose')">
                <el-option
                  v-for="item in evaluateAttr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8" v-if="equipmentrValue === '1,2' && microBreakValue === 13">
              <el-select v-model="lineValue" :placeholder="$t('placeholder.pleaseChoose')">
                <el-option
                  v-for="item in lineAttr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="8" style="padding-right: 0" v-if="equipmentrValue === '1,2'">
              <el-select v-if="microBreakValue === 13" v-model="comparisonValue" :placeholder="$t('placeholder.pleaseChoose')">
                <el-option
                  key="3"
                  :label="$t('menu.beEqualTo')"
                  value="3">
                </el-option>
              </el-select>
              <el-select v-else v-model="comparisonValue" :placeholder="$t('placeholder.pleaseChoose')">
                <el-option
                  v-for="item in comparisonAttr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item :label="$t('table.alarmType') + ':'" required  v-if="equipmentrValue !== 11 && (equipmentrValue === 6 || equipmentrValue === 10)">
            <el-select v-model="smokeValue" :placeholder="$t('placeholder.pleaseChoose')">
                <el-option
                  v-for="item in smokeType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
          <!-- 水浸设备 -->
           <el-form-item :label="$t('table.alarmType') + ':'" required  v-if="equipmentrValue ===18">
            <el-select v-model="aLarmValue" :placeholder="$t('placeholder.pleaseChoose')">
                <el-option
                  v-for="item in aLarmType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.alarmType') + ':'" required v-if="equipmentrValue !== 11 && (equipmentrValue === 7 || equipmentrValue === 13)">
            <el-select v-model="gasValue" :placeholder="$t('placeholder.pleaseChoose')">
              <el-option
                v-for="item in gasType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('home.value') + ':'" required v-if="equipmentrValue === 11 || equipmentrValue === 14 || equipmentrValue === '1,2'|| equipmentrValue === 4|| equipmentrValue === 5">
            <el-col :span="8" style="padding-left: 0" v-if="microBreakValue === 13">
              <el-select v-model="openCloseValue" :placeholder="$t('placeholder.pleaseChoose')">
                <el-option
                  v-for="item in openClose"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-input v-else v-model="preData.num" :onkeyup="preData.num=preData.num.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d)$/, '$1$2.$3').replace(/^[^0-9.]*(\d*[\.]?\d{0,2})\w*$/,'$1')" :placeholder="$t('table.pleaseEnter')" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="handlePreClose">{{ $t('btns.cancel2') }}</el-button>
          <el-button size="small" type="primary" @click="handlePreSave">{{ $t('btns.ok2')}}</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="$t('system.add') +$t('dialog.performAction')" :close-on-click-modal="false" :modal="false" :visible.sync="actionFlag" :before-close="handleActionClose" width="35%" top="30vh" id="scenes-form">
        <el-form :model="actionData" size="small" label-width="100px">
          <el-form-item required>
            <label slot="label" class="slot-label pointer deviceHover" @click="handlePreAdd('action')">{{ '+' + $t('btns.select') + $t('control.device') + ':' }}</label>
            <el-input v-model="actionData.mac" readonly></el-input>
          </el-form-item>
          <el-form-item v-show="actionData.mac" :label="$t('btns.conditionsType') + ':'">
            <label slot="label" class="slot-label pointer deviceHover" @click="handleLine('action')">{{ '+' + $t('btns.select') + $t('table.line') + ':' }}</label>
            <el-tag
              v-show="tag.title.length > 0"
              v-for="(tag, index) in actionData.tags"
              :key="index"
              closable
              @close="handleCloseTag('action', tag)">
              {{tag.title}}
            </el-tag>
          </el-form-item>
          <el-form-item :label="$t('control.action') + ':'">
            <el-select v-model="actionData.openCloseValue" clearable :placeholder="$t('placeholder.pleaseChoose')">
              <el-option
                v-for="item in openClose"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="equipmentrValue === '1,2'" :label="$t('control.generate') + $t('home.alarm') + ':'">
              <el-cascader
                v-model="actionData.alarm"
                clearable
                :options="alarms"
                :props="{ expandTrigger: 'hover' }"
                :show-all-levels="false">
              </el-cascader>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="handleActionClose">{{ $t('btns.cancel2') }}</el-button>
          <el-button size="small" type="primary" @click="handleActionSave">{{ $t('btns.ok2')}}</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="$t('table.addDeviceLine')" :close-on-click-modal="false" custom-class="custom-device-dialog" :visible.sync="deviceVisible" width="75%">
        <el-scrollbar style="height: 100%;">
          <div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="rule-form" size="small">
              <el-form-item>
                <el-col :span="5" class="left-padding-right">
                  <el-input v-model="ruleForm.mac" :placeholder="$t('table.deviceNo')"></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" @click="handleSearch">{{ $t('btns.query') }}</el-button>
                </el-col>
              </el-form-item>
            </el-form>
            <el-table
              class="mt-20 device-wrap"
              :data="data">
              <el-table-column
                prop="mac"
                align="center"
                :label="$t('dialog.deviceNo')">
              </el-table-column>
              <el-table-column
                prop="build"
                align="center"
                :label="config.positionLabelA">
              </el-table-column>
              <el-table-column
                prop="unit"
                align="center"
                :label="config.positionLabelB">
              </el-table-column>
              <el-table-column
                prop="room"
                align="center"
                :label="config.positionLabelC">
              </el-table-column>
              <el-table-column
                align="center"
                :label="$t('table.operating')">
                <template slot-scope="scope">
                  <el-button  type="text" @click="handleMac(scope.row)">{{ $t('btns.select') + $t('control.device') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-sizes="[20, 50, 100, 500]"
              :page-size="20"
              layout="sizes, prev, pager, next"
              :total="total">
            </el-pagination>
          </div>
        </el-scrollbar>
      </el-dialog>
      <el-dialog :title="$t('dialog.channelList')" :visible.sync="lineVisible" width="60%" append-to-body>
        <LineList :mac="lineMac" :tags="lineTags" @sendChannels="receiveChannels" source="BuiltInTiming" v-if="lineVisible"></LineList>
      </el-dialog>
    </div>
</template>

<script>
/* global config */
import Device from '../DetectionRules/Device'
import LineList from '../Common/LineList'
import { linkageSceneList, linkageSceneSave, linkageSceneDel, linkageDetail, linkagedeLock, queryBoxes, queryAlarmForConfig } from '@/api/api'
export default {
  data () {
    return {
      linkageFlag: false,
      detailsFlag: false,
      dialogDetails: false,
      preconditionFlag: false,
      actionFlag: false,
      deviceVisible: false,
      lineVisible: false,
      linkageData: [],
      formLabelWidth: '80px',
      equipmentTypesNum: '',
      lineMac: '',
      lineTags: [],
      form: {},
      scenes: {
        id: '',
        name: '',
        remark: '',
        status: '',
        timeRanges: ''
      },
      preData: {
        mac: '',
        line: '',
        name: '',
        num: '',
        tags: []
      },
      preList: [],
      actionData: {
        mac: '',
        macName: '',
        openCloseValue: '',
        tags: [],
        alarm: ''
      },
      actionsList: [],
      value1: [],
      tableComponentHeight: this.$store.state.BuiltInTimingHeight,
      options: [{
        value: 1,
        label: this.$t('btns.satisfyAll')
      }, {
        value: 2,
        label: this.$t('btns.satisfySingle')
      }],
      equipmentTypeAttr: [{
        value: '1,2',
        label: this.$t('stralsund.microBreaker') + '(Md)'
      }, {
        value: 11,
        label: this.$t('stralsund.temperatureAndHumidityDetection') + '(Renke)'
      }, {
        value: 14,
        label: this.$t('stralsund.illuminanceCollector') + '(Renke)'
      }, {
        value: 18,
        label: this.$t('stralsund.waterMoreDevice') + '(Renke)'
      }, {
        value: 4,
        label: this.$t('stralsund.Liquidlevelequipment') + '(TLink)'
      }, {
        value: 5,
        label: this.$t('stralsund.pressureFacility') + '(TLink)'
      },
      {
        value: 6,
        label: this.$t('stralsund.smokeFireDetection') + '(Fs)'
      }, {
        value: 7,
        label: this.$t('stralsund.combustibleGasDetection') + '(Fs)'
      }, {
        value: 10,
        label: this.$t('stralsund.smokeFireDetection') + '(Zac)'
      }, {
        value: 13,
        label: this.$t('stralsund.combustibleGasDetection') + '(Zac)'
      }],
      microBreakAttr: [{
        value: 1,
        label: this.$t('main.watt')
      }, {
        value: 2,
        label: this.$t('main.ampere')
      }, {
        value: 3,
        label: this.$t('menu.leakageCurrent')
      }, {
        value: 4,
        label: this.$t('menu.temperature')
      }, {
        value: 5,
        label: this.$t('main.volt')
      }, {
        value: 13,
        label: this.$t('table.switch') + this.$t('table.status')
      }],
      evaluateAttr: [{
        value: 1,
        label: this.$t('table.summationValue')
      }, {
        value: 2,
        label: this.$t('table.calculateValue')
      }, {
        value: 3,
        label: this.$t('table.maximum')
      }, {
        value: 4,
        label: this.$t('table.minimum')
      }, {
        value: 5,
        label: this.$t('table.averageValue')
      }],
      lineAttr: [{
        value: 6,
        label: this.$t('placeholder.all') + this.$t('table.line')
      }, {
        value: 7,
        label: this.$t('placeholder.any') + this.$t('table.line')
      }],
      comparisonAttr: [{
        value: 1,
        label: this.$t('menu.greaterThan')
      }, {
        value: 2,
        label: this.$t('menu.lessThan')
      }, {
        value: 3,
        label: this.$t('menu.beEqualTo')
      }],
      conditionsAttr: [{
        value: 4,
        label: this.$t('menu.temperature')
      }, {
        value: 10,
        label: this.$t('menu.humidity')
      }],
      illuminanceAttr: [{
        value: 12,
        label: this.$t('echarts.illumination') + this.$t('echarts.celsius')
      }],
      conditionsType: [{
        value: 1,
        label: this.$t('menu.above')
      }, {
        value: 2,
        label: this.$t('menu.below')
      }],
      smokeType: [{
        value: 2002,
        label: this.$t('control.smoke') + this.$t('home.alarm')
      }, {
        value: 9000,
        label: this.$t('control.device') + this.$t('control.malfunction') + this.$t('home.alarm')
      }],
      gasType: [{
        value: 2006,
        label: this.$t('control.gas') + this.$t('home.alarm')
      }, {
        value: 9000,
        label: this.$t('control.device') + this.$t('control.malfunction') + this.$t('home.alarm')
      }],
      openClose: [{
        value: '1',
        label: this.$t('table.opening')
      }, {
        value: '2',
        label: this.$t('table.closing')
      }],
      alarms: [{
        value: 'alarms',
        label: this.$t('home.alarm'),
        children: []
      }, {
        value: 'warns',
        label: this.$t('home.warning'),
        children: []
      }],
      leveltionsType: [{value: 4, label: '温度'}, {value: 7, label: '液位'}],
      pressureType: [{value: 4, label: '温度'}, {value: 6, label: '压力'}],
      aLarmType: [{value: 9003, label: '水浸报警'}],
      aLarmValue: '',
      ifValue: '',
      equipmentrValue: '1,2',
      attrValue: '',
      microBreakValue: '',
      evaluateValue: '',
      lineValue: '',
      levelValue: '',
      pressureValue: '',
      openCloseValue: '',
      comparisonValue: '',
      typeValue: '',
      smokeValue: '',
      gasValue: '',
      edit: false,
      actionEdit: false,
      tags: [],
      index: 0,
      actionIndex: 0,
      ruleForm: {
        mac: ''
      },
      mac: '',
      data: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      config: config,
      equipmentFlag: false,
      PageSize: 10,
      newCurrentPage: 1,
      newTotal: 0
    }
  },
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.queryLinkageSceneList()
      this.handleAlarmFocus()
    },
    handleNewSizeChange (val) {
      this.PageSize = val
      this.queryLinkageSceneList()
    },
    handleNewCurrentChange (val) {
      this.newCurrentPage = val
      this.queryLinkageSceneList()
    },
    queryLinkageSceneList () {
      let params = {
        projectCode: this.$store.state.projectCode,
        pageSize: this.PageSize,
        pageNo: this.newCurrentPage
      }
      linkageSceneList(params)
        .then(res => {
          if (res.success) {
            this.linkageData = res.datas
            this.newTotal = res.total
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
    handleLinkageSceneSave () {
      if (this.scenes.name === '') {
        this.$message({
          message: this.$t('table.pleaseEnter') + this.$t('control.linkage') + this.$t('dialog.name'),
          type: 'error'
        })
        return false
      }
      let params = {
        name: this.scenes.name,
        status: this.scenes.status,
        remark: this.scenes.remark,
        id: this.scenes.id,
        timeRanges: this.scenes.timeRanges,
        extValue: this.$store.state.projectCode
      }
      linkageSceneSave(params)
        .then(res => {
          if (res.success) {
            this.handleLinkageSceneClose()
            this.queryLinkageSceneList()
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
    handleLinkageSceneClose () {
      this.linkageFlag = false
      this.scenes = {
        id: '',
        name: '',
        remark: ''
      }
    },
    handleLinkageDetailsClose () {
      this.dialogDetails = false
    },
    handleLinkageDetailsSave () {
      if (this.value1 === null || this.ifValue === '') {
        this.$message({
          message: this.$t('message.uninformation'),
          type: 'error'
        })
        return false
      }

      let alarmsArr = this.alarms[0].children.concat(this.alarms[1].children)
      let actonsArr = []
      let preArr = []
      this.actionsList.forEach(item => {
        let alarmTypeNo = alarmsArr.filter(val => val.label === item.alarmTypeNo)
        let obj = {
          mac: item.others.mac,
          addrs: item.addrs,
          actionType: item.actionType,
          alarmTypeNo: alarmTypeNo.length > 0 ? alarmTypeNo[0].value : ''
        }
        actonsArr.push(obj)
      })
      this.preList.forEach(item => {
        let obj = {
          mac: item.others.mac,
          addrs: item.addrs,
          elecType: item.elecType,
          calcType: item.calcType,
          compType: item.compType,
          compValue: item.compValue,
          logicType: this.ifValue,
          typeNumber: item.typeNumber
        }
        preArr.push(obj)
      })
      let params = {
        name: this.scenes.name,
        status: this.scenes.status,
        timeRanges: this.value1[0].length ? this.value1[0] + '~' + this.value1[1] : this.$func.formatDate('yyyy-MM-dd HH:mm:ss', this.value1[0]).slice(0, 16) + '~' + this.$func.formatDate('yyyy-MM-dd HH:mm:ss', this.value1[1]).slice(0, 16),
        extValue: this.$store.state.projectCode,
        id: this.scenes.id,
        remark: this.scenes.remark,
        conditions: JSON.stringify(preArr),
        actions: JSON.stringify(actonsArr)
      }

      linkageSceneSave(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.handleLinkageDetailsClose()
            this.queryLinkageSceneList()
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
    handleLinkageSceneDetails () {
      this.linkageFlag = false
      this.preconditionFlag = false
      this.actionFlag = false
      this.handleViewScene(this.scenes)
    },
    handleSceneDel (id) {
      let params = {
        sceneId: id,
        projectCode: this.$store.state.projectCode
      }
      this.$confirm(this.$t('message.confirmDeleteGroup'), this.$t('dialog.prompt'), {
        confirmButtonText: this.$t('btns.ok'),
        cancelButtonText: this.$t('btns.cancel'),
        type: 'warning'
      }).then(() => {
        linkageSceneDel(params)
          .then(res => {
            if (res.success) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.queryLinkageSceneList()
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
    handleLinkageScene (obj, val) {
      this.detailsFlag = false
      this.linkageFlag = true
      this.scenes = {
        id: '',
        name: '',
        remark: '',
        status: '',
        timeRanges: ''
      }
      this.ifValue = this.options[0].value
      if (val) {
        this.detailsFlag = true
        this.scenes = {
          id: obj.id,
          name: obj.name,
          remark: obj.remark,
          status: obj.status,
          timeRanges: obj.timeRanges
        }
      }
    },
    handleLinkagedeLock (row) {
      let params = {
        sceneId: row.id,
        projectCode: this.$store.state.projectCode,
        oper: row.status === 2 ? 'unlock' : 'lock'
      }
      linkagedeLock(params)
        .then(res => {
          if (res.success) {
            this.queryLinkageSceneList()
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
    handleIfAdd () {
      this.dialogDetails = false
      this.edit = false
      this.preconditionFlag = true
      this.preData = {
        mac: '',
        name: '',
        num: '',
        tags: []
      }
      this.lineValue = this.comparisonValue = this.openCloseValue = this.evaluateValue = this.microBreakValue = this.smokeValue = this.gasValue = this.attrValue = this.typeValue = ''
    },
    handleAddAction () {
      this.actionEdit = false
      this.dialogDetails = false
      this.actionFlag = true
      this.actionData = {
        mac: '',
        macName: '',
        openCloseValue: '',
        tags: [],
        alarm: ''
      }
    },
    handleViewScene (row) {
      this.scenes.id = row.id
      this.scenes.status = row.status
      this.value1 = []
      let params = {
        projectCode: this.$store.state.projectCode,
        sceneId: row.id
      }
      linkageDetail(params)
        .then(res => {
          if (res.success) {
            this.scenes.name = res.data.scene.name
            let arr = res.data.scene.timeRanges.split('~')
            arr.forEach(element => {
              this.value1.push(element)
            })
            if (res.data.actions !== []) {
              res.data.actions.forEach(item => {
                if (item.alarmTypeNo) {
                  this.alarms[0].children.concat(this.alarms[1].children).forEach(element => {
                    if (element.value === item.alarmTypeNo + '') item.alarmTypeNo = element.label
                  })
                }
                if (item.alarmTypeNo === 0) item.alarmTypeNo = ''
              })
            }
            this.ifValue = res.data.conditions.length > 0 ? res.data.conditions[0].logicType : this.options[0].value
            this.equipmentrValue = res.data.conditions.length > 0 ? res.data.conditions[0].others.equipmentType === 1 || res.data.conditions[0].others.equipmentType === 2 ? '1,2' : res.data.conditions[0].others.equipmentType : '1,2'
            this.preList = res.data.conditions
            this.actionsList = res.data.actions
            this.dialogDetails = true
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
    handlePreClose () {
      this.preconditionFlag = false
      this.dialogDetails = true
    },
    handleActionClose () {
      this.actionFlag = false
      this.dialogDetails = true
    },
    handlePreAdd (val) {
      this.equipmentTypesNum = ''
      if (val === 'pre') {
        this.equipmentTypesNum = this.equipmentrValue
        // console.log(this.equipmentTypesNum, '=========== this.equipmentTypesNum ')
      } else {
        this.equipmentTypesNum = 1
      }
      this.deviceVisible = true
      this.ruleForm.mac = ''
      this.queryList(this.ruleForm.mac)
    },
    handleSearch () {
      this.currentPage = 1
      this.queryList(this.ruleForm.mac)
    },
    handleLine (val) {
      if (val === 'pre') {
        this.lineMac = this.preData.mac
        this.lineTags = this.preData.tags
      } else {
        this.lineMac = this.actionData.mac
        this.lineTags = this.actionData.tags
      }
      this.lineVisible = true
    },
    receiveChannels (val) {
      if (this.preconditionFlag) {
        this.preData.tags = val
      } else if (this.actionFlag) {
        this.actionData.tags = val
      }
      this.lineVisible = false
    },
    handleCloseTag (val, tag) {
      if (val === 'pre') {
        this.preData.tags.splice(this.preData.tags.indexOf(tag), 1)
      } else if (val === 'action') {
        this.actionData.tags.splice(this.actionData.tags.indexOf(tag), 1)
      }
    },
    handlemicroBreak (val) {
      if (val === 13) {
        this.preData.num = this.evaluateValue = this.comparisonValue = ''
      }
    },
    handlePreSave () {
      if (this.equipmentrValue === 11 || this.equipmentrValue === 14) {
        if (this.preData.mac === '' || this.typeValue === '' || this.attrValue === '' || this.preData.num === '' || (this.preData.num.indexOf('.') !== -1 && this.preData.num.toString().split('.')[1].length === 0)) {
          this.$message({
            message: this.$t('message.uninformation'),
            type: 'error'
          })
          return false
        }
      } else if (this.equipmentrValue === 6 || this.equipmentrValue === 10) {
        if (this.preData.mac === '' || this.smokeValue === '') {
          this.$message({
            message: this.$t('message.uninformation'),
            type: 'error'
          })
          return false
        }
      } else if (this.equipmentrValue === 4) {
        if (this.preData.mac === '' || this.levelValue === '') {
          this.$message({
            message: this.$t('message.uninformation'),
            type: 'error'
          })
          return false
        }
      } else if (this.equipmentrValue === 5) {
        if (this.preData.mac === '' || this.pressureValue === '') {
          this.$message({
            message: this.$t('message.uninformation'),
            type: 'error'
          })
          return false
        }
      } else if (this.equipmentrValue === 18) {
        if (this.preData.mac === '' || this.aLarmValue === '') {
          this.$message({
            message: this.$t('message.uninformation'),
            type: 'error'
          })
          return false
        }
      } else if (this.equipmentrValue === '1,2') {
        if (this.microBreakValue === 13) {
          if (this.preData.mac === '' || this.preData.tags.length === 0 || this.lineValue === '' || this.comparisonValue === '' || this.openCloseValue === '') {
            this.$message({
              message: this.$t('message.uninformation'),
              type: 'error'
            })
            return false
          }
        } else {
          if (this.preData.mac === '' || this.preData.tags.length === 0 || this.microBreakValue === '' || this.evaluateValue === '' || this.comparisonValue === '' || this.preData.num === '') {
            this.$message({
              message: this.$t('message.uninformation'),
              type: 'error'
            })
            return false
          }
        }
      } else {
        if (this.preData.mac === '' || this.gasValue === '') {
          // console.log(this.preData.mac)
          this.$message({
            message: this.$t('message.uninformation'),
            type: 'error'
          })
          return false
        }
      }
      if (this.edit) {
        if (this.equipmentrValue === 11 || this.equipmentrValue === 14) {
          this.preList[this.index].others.mac = this.preData.mac
          this.preList[this.index].compType = this.typeValue
          this.preList[this.index].others.macName = this.preData.name
          this.preList[this.index].elecType = this.attrValue
          this.preList[this.index].compValue = this.preData.num
          if (this.preList.length >= 1) {
            let i = 0
            this.preList.forEach(element => {
              if (element.compType === this.preList[this.index].compType && element.others.mac === this.preList[this.index].others.mac && element.others.macName === this.preList[this.index].others.macName && element.compValue === this.preList[this.index].compValue && element.elecType === this.preList[this.index].elecType) {
                i++
              }
            })
            if (i > 1) {
              this.preList.splice(this.index, 1)
            }
          }
        } else if (this.equipmentrValue === 4) {
          this.preList[this.index].compType = this.typeValue
          this.preList[this.index].compValue = this.preData.num
          this.preList[this.index].elecType = this.levelValue
          this.preList[this.index].others.mac = this.preData.mac
          this.preList[this.index].others.macName = this.preData.name
          //  console.log(this.preList, '==============this.preList')
        } else if (this.equipmentrValue === 5) {
          this.preList[this.index].compType = this.typeValue
          this.preList[this.index].compValue = this.preData.num
          this.preList[this.index].elecType = this.pressureValue
          this.preList[this.index].others.mac = this.preData.mac
          this.preList[this.index].others.macName = this.preData.name
          // console.log(this.preList, '==============this.preList5')
        } else if (this.equipmentrValue === 18) {
          this.preList[this.index].typeNumber = this.aLarmValue
        } else if (this.equipmentrValue === '1,2') {
          let titleArr = []
          let addrArr = []
          if (this.preData.tags.length > 0) {
            this.preData.tags.forEach(item => {
              titleArr.push(item.title)
              addrArr.push(item.addr)
            })
          }
          this.preList[this.index].others.mac = this.preData.mac
          this.preList[this.index].compType = this.comparisonValue
          this.preList[this.index].others.macName = this.preData.name
          this.preList[this.index].elecType = this.microBreakValue
          this.preList[this.index].compValue = this.preData.num ? this.preData.num : this.openCloseValue === '1' ? 'false' : 'true'
          this.preList[this.index].calcType = this.evaluateValue ? this.evaluateValue : this.lineValue
          this.preList[this.index].others.title = titleArr.join(',')
          this.preList[this.index].addrs = addrArr.join(',')
          if (this.preList.length >= 1) {
            let i = 0
            this.preList.forEach(element => {
              if (element.compType === this.preList[this.index].compType && element.others.mac === this.preList[this.index].others.mac && element.others.macName === this.preList[this.index].others.macName && element.compValue === this.preList[this.index].compValue && element.elecType === this.preList[this.index].elecType && element.calcType === this.preList[this.index].calcType && element.addrs === this.preList[this.index].addrs) {
                i++
              }
            })
            if (i > 1) {
              this.preList.splice(this.index, 1)
            }
          }
        } else {
          if (this.equipmentrValue === 6 || this.equipmentrValue === 10) {
            this.preList[this.index].typeNumber = this.smokeValue
          } else {
            this.preList[this.index].typeNumber = this.gasValue
          }
          if (this.preList.length >= 1) {
            let i = 0
            this.preList.forEach(element => {
              if (element.typeNumber === this.preList[this.index].typeNumber && element.others.mac === this.preList[this.index].others.mac && element.others.macName === this.preList[this.index].others.macName) {
                i++
              }
            })
            if (i > 1) {
              this.preList.splice(this.index, 1)
            }
          }
        }
      } else {
        let params
        if (this.equipmentrValue === 11 || this.equipmentrValue === 14) {
          params = {
            others: {
              mac: this.preData.mac,
              macName: this.preData.name
            },
            addrs: '1',
            elecType: this.attrValue,
            calcType: '1',
            compType: this.typeValue,
            compValue: this.preData.num,
            logicType: this.ifValue,
            equipmentrValue: this.equipmentrValue
          }
        } else if (this.equipmentrValue === 4) {
          params = {
            others: {
              mac: this.preData.mac,
              macName: this.preData.name
            },
            addrs: '1',
            elecType: this.levelValue,
            calcType: '1',
            compType: this.typeValue,
            compValue: this.preData.num,
            logicType: this.ifValue,
            equipmentrValue: this.equipmentrValue
          }
        } else if (this.equipmentrValue === 5) {
          params = {
            others: {
              mac: this.preData.mac,
              macName: this.preData.name
            },
            addrs: '1',
            elecType: this.pressureValue,
            calcType: '1',
            compType: this.typeValue,
            compValue: this.preData.num,
            logicType: this.ifValue,
            equipmentrValue: this.equipmentrValue
          }
        } else if (this.equipmentrValue === '1,2') {
          let addr = ''
          let titles = ''
          if (this.preData.tags.length > 1) {
            titles = this.preData.tags.map(item => {
              return item.title
            }).join(',')
            addr = this.preData.tags.map(item => {
              return item.addr
            })
          } else {
            addr = this.preData.tags[0].addr
            titles = this.preData.tags[0].title
          }
          params = {
            others: {
              mac: this.preData.mac,
              macName: this.preData.name,
              title: titles
            },
            addrs: addr.length > 1 ? addr.join(',') : addr,
            elecType: this.microBreakValue,
            calcType: this.evaluateValue ? this.evaluateValue : this.lineValue,
            compType: this.comparisonValue,
            compValue: this.preData.num ? this.preData.num : this.openCloseValue === '1' ? 'false' : 'true',
            logicType: this.ifValue,
            equipmentrValue: this.equipmentrValue
          }
        } else if (this.equipmentrValue === 18) {
          params = {
            others: {
              mac: this.preData.mac,
              macName: this.preData.name
            },
            typeNumber: this.aLarmValue ? this.aLarmValue : this.gasValue,
            smokeValue: this.aLarmValue,
            gasValue: this.gasValue,
            logicType: this.ifValue,
            equipmentrValue: this.equipmentrValue
          }
        } else {
          params = {
            others: {
              mac: this.preData.mac,
              macName: this.preData.name
            },
            typeNumber: this.smokeValue ? this.smokeValue : this.gasValue,
            smokeValue: this.smokeValue,
            gasValue: this.gasValue,
            logicType: this.ifValue,
            equipmentrValue: this.equipmentrValue
          }
        }
        if (this.preList.length >= 1) {
          let i = 0
          if (this.equipmentrValue === 11 || this.equipmentrValue === 14) {
            this.preList.forEach(element => {
              if (element.compType === params.compType && element.others.mac === params.others.mac && element.others.macName === params.others.macName && element.compValue === params.compValue && element.elecType === params.elecType) {
                i++
              }
            })
          } else if (this.equipmentrValue === '1,2') {
            this.preList.forEach(element => {
              if (element.compType === params.compType && element.others.mac === params.others.mac && element.others.macName === params.others.macName && element.addrs === params.addrs && element.compValue === params.compValue && element.elecType === params.elecType && element.calcType === params.calcType) {
                i++
              }
            })
          } else {
            this.preList.forEach(element => {
              if (element.typeNumber === params.typeNumber && element.others.mac === params.others.mac && element.others.macName === params.others.macName) {
                i++
              }
            })
          }
          if (i === 0) {
            this.preList.push(params)
          }
        } else {
          this.preList.push(params)
        }
      }
      this.preconditionFlag = false
      this.dialogDetails = true
      console.log(this.preList, '==========this.preList')
    },
    handleActionSave () {
      if (this.equipmentrValue === '1,2') {
        if (this.actionData.alarm === '' && this.actionData.openCloseValue === '') {
          this.$message({
            message: this.$t('message.uninformation'),
            type: 'error'
          })
          return false
        }
        if (this.actionData.mac === '' || this.actionData.tags.length === 0) {
          this.$message({
            message: this.$t('message.uninformation'),
            type: 'error'
          })
          return false
        }
      } else {
        if (this.actionData.mac === '' || this.actionData.openCloseValue === '') {
          this.$message({
            message: this.$t('message.uninformation'),
            type: 'error'
          })
          return false
        }
      }
      if (this.actionEdit) {
        let titleArr = []
        let addrArr = []
        if (this.actionData.tags.length > 0) {
          this.actionData.tags.forEach(item => {
            titleArr.push(item.title)
            addrArr.push(item.addr)
          })
        }
        this.actionsList[this.actionIndex].others.mac = this.actionData.mac
        this.actionsList[this.actionIndex].others.macName = this.actionData.macName
        this.actionsList[this.actionIndex].actionType = this.actionData.openCloseValue
        this.actionsList[this.actionIndex].others.title = titleArr.join(',')
        this.actionsList[this.actionIndex].addrs = addrArr.join(',')
        if (this.equipmentrValue === '1,2' && this.actionData.alarm.length > 0) {
          let Alarms = ''
          if (this.actionData.alarm[0] === 'alarms') {
            Alarms = this.alarms[0].children.filter(keyItem => {
              if (keyItem.value === this.actionData.alarm[1]) return keyItem
            })
          } else if (this.actionData.alarm[0] === 'warns') {
            Alarms = this.alarms[1].children.filter(keyItem => {
              if (keyItem.value === this.actionData.alarm[1]) return keyItem
            })
          }
          this.actionsList[this.actionIndex].actionType = this.actionData.openCloseValue ? this.actionData.openCloseValue + ',3' : this.actionData.alarm !== '' ? '3' : ''
          this.actionsList[this.actionIndex].alarmTypeNo = Alarms[0].label
        } else {
          this.actionsList[this.actionIndex].actionType = this.actionData.openCloseValue ? this.actionData.openCloseValue + ',3' : this.actionData.alarm !== '' ? '3' : ''
          this.actionsList[this.actionIndex].alarmTypeNo = ''
        }
      } else {
        let titleArr = []
        let addrArr = []
        if (this.actionData.tags.length > 0) {
          this.actionData.tags.forEach(item => {
            titleArr.push(item.title)
            addrArr.push(item.addr)
          })
        }
        let params = {
          addrs: addrArr.length > 0 ? addrArr.join(',') : '',
          others: {
            mac: this.actionData.mac,
            macName: this.actionData.macName,
            title: titleArr.length > 0 ? titleArr.join(',') : titleArr
          },
          actionType: this.actionData.openCloseValue
        }
        if (this.equipmentrValue === '1,2' && this.actionData.alarm.length > 0) {
          let Alarms = ''
          if (this.actionData.alarm[0] === 'alarms') {
            Alarms = this.alarms[0].children.filter(keyItem => {
              if (keyItem.value === this.actionData.alarm[1]) return keyItem
            })
          } else if (this.actionData.alarm[0] === 'warns') {
            Alarms = this.alarms[1].children.filter(keyItem => {
              if (keyItem.value === this.actionData.alarm[1]) return keyItem
            })
          }
          params.actionType = this.actionData.openCloseValue ? this.actionData.openCloseValue + ',3' : this.actionData.alarm !== '' ? '3' : ''
          params.alarmTypeNo = Alarms[0].label
        } else {
          params.actionType = this.actionData.openCloseValue ? this.actionData.openCloseValue + ',3' : this.actionData.alarm !== '' ? '3' : ''
          params.alarmTypeNo = ''
        }
        this.actionsList.push(params)
      }
      this.actionFlag = false
      this.dialogDetails = true
    },
    handlelinkageScenePre (row, index) {
      console.log(row, '====row')

      let titles = []
      let tags = []
      this.edit = true
      this.dialogDetails = false
      this.preconditionFlag = true
      this.index = index
      if (row.others.title) {
        titles = this.preList[index].others.title.split(',')
        this.preList[index].addrs.split(',').map((item, index) => {
          tags.push({addr: item, title: titles[index]})
        })
      }
      this.preData = {
        mac: row.others.mac,
        num: row.compValue,
        name: row.others.macName,
        tags: tags
      }
      if (row.typeNumber === 9003) {
        this.aLarmValue = row.typeNumber
      }

      this.pressureValue = row.elecType
      this.levelValue = row.elecType
      this.attrValue = row.elecType
      this.typeValue = row.compType
      this.equipmentrValue = row.equipmentrValue ? row.equipmentrValue : row.others.equipmentType === 1 || row.others.equipmentType === 2 ? '1,2' : row.others.equipmentType
      this.smokeValue = row.smokeValue ? row.smokeValue : row.typeNumber
      this.gasValue = row.gasValue ? row.gasValue : row.typeNumber
      this.microBreakValue = row.elecType
      this.evaluateValue = row.calcType
      this.comparisonValue = row.compType
      if (row.elecType === 13) {
        this.preData.num = this.evaluateValue = ''
        this.lineValue = row.calcType
        this.openCloseValue = row.compValue === 'false' ? '1' : '2'
      }
    },
    handlelinkageSceneAction (row, index) {
      let Alarms = ''
      if (row.alarmTypeNo && row.alarmTypeNo.length > 0) {
        Alarms = this.alarms[0].children.filter(keyItem => {
          if (keyItem.label === row.alarmTypeNo) return keyItem
        })
        if (Alarms.length > 0) {
          this.actionData.alarm = ['alarms', Alarms[0].value]
        } else {
          Alarms = this.alarms[1].children.filter(keyItem => {
            if (keyItem.label === row.alarmTypeNo) return keyItem
          })
          this.actionData.alarm = ['warns', Alarms[0].value]
        }
      } else {
        this.actionData.alarm = []
      }

      this.actionEdit = true
      this.dialogDetails = false
      this.actionFlag = true
      this.actionIndex = index
      this.actionData.mac = row.others.mac
      this.actionData.macName = row.others.macName
      this.actionData.openCloseValue = row.actionType === '3' ? '' : row.actionType.split(',')[0]
      let titles = []
      let tags = []
      if (row.others.title) {
        titles = this.actionsList[this.actionIndex].others.title.split(',')
        this.actionsList[this.actionIndex].addrs.split(',').map((item, index) => {
          tags.push({addr: item, title: titles[index]})
        })
      }
      let titleEdit = []
      let addrEdit = []
      this.actionData.tags = tags
      if (this.actionData.tags.length !== tags.length) {
        this.actionData.tags.forEach(item => {
          titleEdit.push(item.title)
          addrEdit.push(item.addr)
        })
      }
    },
    handleSceneDelPre (index) {
      this.preList.splice(index, 1)
    },
    handleSceneDelAction (index) {
      this.actionsList.splice(index, 1)
    },
    queryList (mac) {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        projectCode: this.$store.state.projectCode,
        equipmentTypes: this.equipmentTypesNum
      }
      if (mac) params.key = mac
      queryBoxes(params)
        .then(res => {
          if (res.success) {
            this.total = res.total
            this.data = res.datas
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
      this.queryList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.queryList()
    },
    handleMac (row) {
      if (this.preconditionFlag) {
        this.preData.mac = row.mac
        this.preData.name = row.name
        this.preData.tags = []
      } else {
        this.actionData.mac = row.mac
        this.actionData.macName = row.name
        this.actionData.tags = []
      }
      this.deviceVisible = false
    },
    handleAlarmFocus () {
      queryAlarmForConfig({})
        .then(res => {
          res.data.alarms.map(item => {
            return this.alarms[0].children.push({value: item.typeNumber, label: item.info})
          })
          res.data.warns.map(item => {
            return this.alarms[1].children.push({value: item.typeNumber, label: item.info})
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
    }
  },
  watch: {
    '$store.state.projectCode': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.init()
        }
      }
    },
    '$store.state.channelsTableHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.tableComponentHeight = newVal
        }
      }
    },
    preList: {
      handler (newVal, oldVal) {
        if (this.preList.length > 0) {
          this.equipmentFlag = true
        } else {
          this.equipmentFlag = false
        }
      }
    }
  },
  components: {
    Device,
    LineList
  }
}
</script>

<style lang="stylus" scoped>
#linkageScene
  position absolute
  left 200px
  width calc(100% - 200px)
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
#scenes-form .el-form-item >>> .el-form-item__label
    color #333
#scene-view >>> .el-dialog__body
    padding 0
#scene-view >>> .el-card
    border 1px solid transparent
.scene-form .el-form-item >>> .el-form-item__label, .el-button--text
    color #333
.scene-form .el-form-item >>> .el-button--text
    color #333
    &:hover
      color #409EFF !important
.deviceHover
  &:hover
      color #409EFF !important
.device-wrap
  border none
  border 1px solid #EBEEF5
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
