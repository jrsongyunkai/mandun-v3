<template>
  <div>
    <div id="overList" v-show="post">
      <el-col v-show="flag" :style="{ padding: '0' }">
        <el-row id="buildings-form">
          <el-col :span="24">
            <el-form ref="form" :model="form" size="small" :inline="true">
              <el-form-item :label="$t('control.building') + ':'">
                <el-select
                  v-model="building"
                  :placeholder="$t('placeholder.pleaseChoose')"
                  @change="handleChange"
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="item in buildings"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('control.unit') + ':'">
                <el-select
                  v-model="unit"
                  class="en-unit"
                  :placeholder="$t('placeholder.pleaseChoose')"
                  @change="handleUnit"
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="item in units"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('table.status') + ':'">
                <el-select
                  v-model="status"
                  class="en-unit"
                  @change="handleStatus"
                  :popper-append-to-body="false"
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
                  v-model="form.mac"
                  :onkeyup="(form.mac = form.mac.replace(/[, ]/g, ''))"
                  @input.native="handleInputMac"
                  @keyup.enter.native="handleKeyWords"
                  :title="$t('placeholder.macRoomNo')"
                  :placeholder="$t('placeholder.macRoomNo')"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click.stop="handleSearch">{{
                  $t('btns.query')
                }}</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row> <el-col
          :style="{ padding: '0' }"
          v-loading="loading"
          element-loading-spinner="el-icon-loading"
          :element-loading-text="$t('message.loading')"
        >
          <div :style="controlTableHeight" v-el_scrollBar>
            <el-row :gutter="8" style="margin: 0;flex-wrap:wrap" type="flex">
              <el-col
                :lg="6"
                :md="8"
                :span="6"
                v-for="(v, k) in tableData"
                :key="k"
                class="device-wrap"
              >
                <div class="grid-content">
                  <div class="device">
                    <el-row class="device-header">
                      <el-col
                        :span="9"
                        v-show="v.others.online === 1"
                        class="c-success"
                      >
                        <span class="iconfont icon-zaixian"></span>
                        <span class="status-name">{{
                          $t('table.online')
                        }}</span>
                      </el-col>
                      <el-col
                        :span="9"
                        v-show="v.others.online === 0"
                        class="c-danger"
                      >
                        <span class="iconfont icon-lixian"></span>
                        <span class="status-name">{{
                          $t('control.offline')
                        }}</span>
                      </el-col>
                      <el-col
                        :span="9"
                        v-show="v.others.online === -1"
                        class="c-danger"
                      >
                        <span class="iconfont icon-lixian"></span>
                        <span class="status-name">{{
                          $t('table.offLine')
                        }}</span>
                      </el-col>
                      <el-col
                        :span="15"
                        :style="{ 'text-align': 'right' }"
                        v-if="
                          v.equipmentType !== 10 &&
                            v.equipmentType !== 13 &&
                            v.equipmentType !== 15 &&
                            v.equipmentType !== 16
                        "
                      >
                        <span
                          v-show="
                            v.equipmentType === 1 || v.equipmentType === 2
                          "
                          >{{ $t('control.lineNos') + '：'
                          }}{{
                            v.others.countAddr ? v.others.countAddr : 0
                          }}</span
                        >
                        <!-- <span class="iconfont icon-weibiaoti-" @click="handleDblLineList(v)"></span> -->
                        <el-dropdown trigger="click" @command="handleCommand">
                          <span class="el-dropdown-link">
                            <i class="iconfont icon-weibiaoti- c-default"></i>
                          </span>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                              v-if="
                                v.equipmentType === 1 || v.equipmentType === 2
                              "
                              :command="beforeHandleCommand('list', v)"
                              >{{
                                $t('btns.view') + $t('dialog.channelList')
                              }}</el-dropdown-item
                            >
                            <el-dropdown-item
                              v-if="
                                config.authority
                                  .AUTH_PROJECT_USE__SET_SERVER_POINT ===
                                  'true' &&
                                  (v.equipmentType === 1 ||
                                    v.equipmentType === 2)
                              "
                              :command="beforeHandleCommand('orientation', v)"
                              >{{
                                $t('btns.edit') + $t('home.serviceOrientation')
                              }}</el-dropdown-item
                            >
                            <el-dropdown-item
                              :command="beforeHandleCommand('inspection', v)"
                              >{{
                                $t('control.device') +
                                  $t('table.inspection') +
                                  $t('control.recording')
                              }}</el-dropdown-item
                            >
                            <el-dropdown-item
                              v-if="
                                v.equipmentType === 1 || v.equipmentType === 2
                              "
                              :command="beforeHandleCommand('equipment', v)"
                              >{{
                                $t('dialog.equipmentParameterAdjustment')
                              }}</el-dropdown-item
                            >
                            <el-dropdown-item
                              v-if="
                                v.equipmentType === 1 || v.equipmentType === 2
                              "
                              :command="beforeHandleCommand('builtIn', v)"
                              >{{
                                $t('control.builtIn') +
                                  $t('control.timing') +
                                  $t('table.configuration')
                              }}</el-dropdown-item
                            >
                            <el-dropdown-item
                              v-if="
                                (v.equipmentType === 1 ||
                                  v.equipmentType === 2) &&
                                  v.others.enableAdvancedTiming
                              "
                              :command="beforeHandleCommand('longitude', v)"
                              >{{
                                $t('table.LongitudeLatitude') +
                                  $t('control.builtIn') +
                                  $t('control.timing')
                              }}</el-dropdown-item
                            >
                            <el-dropdown-item
                              v-if="
                                (v.equipmentType === 1 ||
                                  v.equipmentType === 2) &&
                                  bandFlag
                              "
                              :command="beforeHandleCommand('region', v)"
                              >{{ '区域关系绑定' }}</el-dropdown-item
                            >
                          </el-dropdown-menu>
                        </el-dropdown>
                      </el-col>
                    </el-row>
                    <el-row class="device-container">
                      <a href="javascript:void(0);" @click="macClick(v)">
                        <div class="device-img">
                          <span
                            v-show="
                              v.equipmentType === 1 || v.equipmentType === 8
                            "
                          >
                            <img
                              v-if="v.others.online === 1"
                              src="/static/images/Airopen-online.png"
                              alt="Mantunsci"
                            />
                            <img
                              v-else
                              src="/static/images/Airopen-offline.png"
                              alt="Mantunsci"
                            />
                          </span>
                          <span v-show="v.equipmentType === 2">
                            <img
                              v-if="v.others.online === 1"
                              src="/static/images/ElectricalFire-Online.png"
                              alt="Mantunsci"
                            />
                            <img
                              v-else
                              src="/static/images/ElectricalFire-Offline.png"
                              alt="Mantunsci"
                            />
                          </span>
                          <span v-show="v.equipmentType === 3">
                            <img
                              v-if="v.others.online === 1"
                              src="/static/images/Stralsund-online.png"
                              alt="Mantunsci"
                            />
                            <img
                              v-else
                              src="/static/images/Stralsund-offline.png"
                              alt="Mantunsci"
                            />
                          </span>
                          <span
                            v-show="
                              v.equipmentType === 4 || v.equipmentType === 5
                            "
                          >
                            <img
                              v-if="v.others.online === 1"
                              src="/static/images/PressureLevel-online.png"
                              alt="Mantunsci"
                            />
                            <img
                              v-else
                              src="/static/images/PressureLevel-offline.png"
                              alt="Mantunsci"
                            />
                          </span>
                          <span v-show="v.equipmentType === 6">
                            <img
                              v-if="v.others.online === 1"
                              src="/static/images/Smoke-online.png"
                              alt="Mantunsci"
                            />
                            <img
                              v-else
                              src="/static/images/Smoke-offline.png"
                              alt="Mantunsci"
                            />
                          </span>
                          <span v-show="v.equipmentType === 7">
                            <img
                              v-if="v.others.online === 1"
                              src="/static/images/FlammableGas-online.png"
                              alt="Mantunsci"
                            />
                            <img
                              v-else
                              src="/static/images/FlammableGas-offline.png"
                              alt="Mantunsci"
                            />
                          </span>
                          <span v-show="v.equipmentType === 10">
                            <img
                              v-if="v.others.online === 1"
                              src="/static/images/zac-online.png"
                              alt="Mantunsci"
                            />
                            <img
                              v-else
                              src="/static/images/zac-offline.png"
                              alt="Mantunsci"
                            />
                          </span>
                          <span v-show="v.equipmentType === 11">
                            <img
                              v-if="v.others.online === 1"
                              src="/static/images/renke-wsd-online.png"
                              alt="Mantunsci"
                            />
                            <img
                              v-else
                              src="/static/images/renke-wsd-offline.png"
                              alt="Mantunsci"
                            />
                          </span>
                          <span v-show="v.equipmentType === 12">
                            <img
                              v-if="v.others.online === 1"
                              src="/static/images/emeter-online.png"
                              alt="Mantunsci"
                            />
                            <img
                              v-else
                              src="/static/images/emeter-offline.png"
                              alt="Mantunsci"
                            />
                          </span>
                          <span v-show="v.equipmentType === 13">
                            <img
                              v-if="v.others.online === 1"
                              src="/static/images/zac-gas-online.png"
                              alt="Mantunsci"
                            />
                            <img
                              v-else
                              src="/static/images/zac-gas-offline.png"
                              alt="Mantunsci"
                            />
                          </span>
                          <span v-show="v.equipmentType === 14">
                            <img
                              v-if="v.others.online === 1"
                              src="/static/images/renke-gzd-online.png"
                              alt="Mantunsci"
                            />
                            <img
                              v-else
                              src="/static/images/renke-gzd-offline.png"
                              alt="Mantunsci"
                            />
                          </span>
                          <span v-show="v.equipmentType === 15">
                            <img
                              v-if="v.others.online === 1"
                              src="/static/images/common-water-online.png"
                              alt="Mantunsci"
                            />
                            <img
                              v-else
                              src="/static/images/common-water-offline.png"
                              alt="Mantunsci"
                            />
                          </span>
                          <span v-show="v.equipmentType === 16">
                            <img
                              v-if="v.others.online === 1"
                              src="/static/images/chaobiaomao-water-online.png"
                              alt="Mantunsci"
                            />
                            <img
                              v-else
                              src="/static/images/chaobiaomao-water-offline.png"
                              alt="Mantunsci"
                            />
                          </span>
                          <span  v-show="v.equipmentType === 18"> <img
                              src="/static/images/watjin.png"
                              alt="Mantunsci"
                            /></span>
                             <span  v-show="v.equipmentType === 17"> <img
                              src="/static/images/qinniao.png"
                              alt="Mantunsci"
                            /></span>
                        </div>
                        <div class="device-desc" style="padding-left:8px">
                          <el-tooltip
                            :disabled="detailsFlag"
                            :content="v.mac"
                            placement="top-start"
                            open-delay="1000"
                            effect="light"
                          >
                            <p>{{ v.mac }}</p>
                          </el-tooltip>
                          <el-tooltip
                            :disabled="detailsFlag"
                            :content="v.name"
                            placement="top-start"
                            open-delay="1000"
                            effect="light"
                          >
                            <p>{{ v.name }}</p>
                          </el-tooltip>
                          <el-tooltip
                            :disabled="detailsFlag"
                            :content="v.build + v.unit + v.room"
                            placement="top-start"
                            open-delay="1000"
                            effect="light"
                          >
                            <p>{{ v.build + v.unit + v.room }}</p>
                          </el-tooltip>
                        </div>
                      </a>
                      <el-col
                        :span="24"
                        v-show="v.others.alarmInfo"
                        class="alarmInfo c-danger"
                      >
                        <i
                          class="el-icon-bell"
                          :style="{ 'margin-right': '5px' }"
                        ></i>
                        {{ v.others.alarmInfo }}
                      </el-col>
                      <el-col
                        :span="24"
                        v-show="!v.others.alarmInfo"
                        class="alarmInfo"
                      >
                        <i
                          class="el-icon-bell"
                          :style="{ 'margin-right': '5px' }"
                        ></i>
                        {{ $t('control.normal') }}
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
        </el-col></el-row>

      </el-col>
      <!-- v5待完善 -->
      <el-col v-if="!flag" class="left-padding-right">
        <el-col class="left-padding-right">
          <el-col class="channel-top">
            <i
              class="iconfont icon-fanhui-copy borderText mr-20"
              @click="backToPrev"
              ><span style="font-size: 14px">{{ $t('btns.back') }}</span></i
            >
            <span>{{
              $t('table.position') + '：' + obj.build + obj.unit + obj.room
            }}</span>
            <span>{{ $t('dialog.deviceNo') + '：' + obj.mac }}</span>
            <span>{{
              $t('table.version') +
                '：' +
                (obj.others.version !== undefined
                  ? obj.others.version
                  : $t('control.nothing'))
            }}</span>
            <span class="channel-except">{{
              $t('table.online') + $t('table.status') + '：'
            }}</span>
            <span v-if="obj.others.online === 1" class="c-success">{{
              $t('table.online')
            }}</span>
            <span v-else-if="obj.others.online === 0" class="c-danger">{{
              $t('control.offline')
            }}</span>
            <span v-else-if="obj.others.online === -1" class="c-danger">{{
              $t('table.offLine')
            }}</span>
            <el-button size="mini" @click="queryChannels">{{
              $t('btns.refresh')
            }}</el-button>
            <el-button
              size="mini"
              v-if="obj.equipmentType === 1"
              :disabled="channels.length === 0"
              @click="handleChannelsOC(true)"
              >{{ $t('table.oneButtonOn') }}</el-button
            >
            <el-button
              size="mini"
              v-if="obj.equipmentType === 1"
              :disabled="channels.length === 0"
              @click="handleChannelsOC(false)"
              >{{ $t('table.oneButtonOff') }}</el-button
            >
            <el-button size="mini" @click="handleInstructions">{{
              $t('table.instruction') + $t('table.history')
            }}</el-button>
          </el-col>
          <el-table
            :data="channelsData"
            size="small"
            :height="channelsHeight.height"
            style="width: 100%;margin-top: 10px;position: relative;"
            v-el_scrollBar:scrollBar
            :row-key="row => row.id"
            ref="channelsTable"
            @cell-dblclick="handleDblClick"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              v-if="obj.equipmentType === 1"
              type="selection"
              :selectable="
                (row, index) =>
                  row.others.online === 1 && !row.disableSelectState
              "
              align="center"
              width="50px"
            ></el-table-column>
            <el-table-column
              v-if="obj.equipmentType === 1"
              align="center"
              width="70px"
              label="勾选态"
            >
              <template slot-scope="scope">
                <span
                  :class="
                    scope.row.disableSelectState
                      ? 'iconfont icon-xuanze-kong verticallyCentered'
                      : 'iconfont icon-xuanze-xian verticallyCentered'
                  "
                  style="font-size: 20px;"
                  @click="handleResetState(scope.row)"
                  :title="
                    scope.row.disableSelectState
                      ? $t('table.uncheckable')
                      : $t('table.checkable')
                  "
                ></span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="title"
              :label="$t('table.lineName')"
            >
              <template slot-scope="scope">
                <el-popover
                  placement="bottom"
                  width="250"
                  :append-to-body="false"
                  :ref="`popover-${scope.$index}`"
                  @show="handleShow"
                  @hide="handleHide"
                  trigger="click"
                >
                  <el-input
                    size="small"
                    show-word-limit
                    v-model.trim="channelDatas[scope.$index].title"
                    :placeholder="$t('placeholder.content')"
                  ></el-input>
                  <div style="text-align: right; margin: 5px 0 0">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="
                        handleEdit(
                          scope.$index,
                          scope.row,
                          channelDatas[scope.$index].title
                        )
                      "
                      >{{ $t('btns.ok') }}</el-button
                    >
                    <el-button
                      size="mini"
                      type="plain"
                      @click="$refs[`popover-` + scope.$index].doClose()"
                      >{{ $t('btns.cancel') }}</el-button
                    >
                  </div>
                  <div slot="reference">{{ scope.row.title }}</div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="clearModel"
              :label="$t('table.model')"
              width="100"
            >
              <template slot-scope="scope">
                <div style="display:flex">
                  <div>{{ scope.row.clearModel }}</div>
                  <div
                    style="margin-left:5px"
                    v-if="String(scope.row.iconUrl).length > 0"
                  >
                    <i
                      class="el-icon-picture"
                      @click="lookPicFlag(scope.row.iconUrl)"
                    ></i>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="gLd"
              :label="$t('table.milliamp')"
            ></el-table-column>
            <el-table-column
              align="center"
              width="180"
              :label="$t('table.celsius')"
            >
              <template slot-scope="scope">
                {{ scope.row.gT > -60 ? scope.row.gT : ''
                }}<i
                  class="iconfont icon-jieruguanli"
                  :title="$t('table.missedProbe')"
                  v-show="scope.row.gT < -60"
                ></i>
                <div
                  v-show="
                    scope.row.lineType === '180' || scope.row.lineType === '380'
                  "
                  class="split-line"
                >
                  <span
                    >A:{{ scope.row.aT > -60 ? scope.row.aT : ''
                    }}<i
                      class="iconfont icon-jieruguanli"
                      :title="$t('table.missedProbe')"
                      v-show="scope.row.aT < -60"
                    ></i
                  ></span>
                  <span
                    >B:{{ scope.row.bT > -60 ? scope.row.bT : ''
                    }}<i
                      class="iconfont icon-jieruguanli"
                      :title="$t('table.missedProbe')"
                      v-show="scope.row.bT < -60"
                    ></i
                  ></span>
                  <span
                    >C:{{ scope.row.cT > -60 ? scope.row.cT : ''
                    }}<i
                      class="iconfont icon-jieruguanli"
                      :title="$t('table.missedProbe')"
                      v-show="scope.row.cT < -60"
                    ></i
                  ></span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('table.ampere')">
              <template slot-scope="scope">
                {{ scope.row.gA }}
                <div
                  v-show="
                    scope.row.lineType === '180' || scope.row.lineType === '380'
                  "
                  class="split-line"
                >
                  <span>A:{{ scope.row.aA }}</span>
                  <span>B:{{ scope.row.bA }}</span>
                  <span>C:{{ scope.row.cA }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('table.volt')">
              <template slot-scope="scope">
                {{ scope.row.gV }}
                <div
                  v-show="
                    scope.row.lineType === '180' || scope.row.lineType === '380'
                  "
                  class="split-line"
                >
                  <span>A:{{ scope.row.aV }}</span>
                  <span>B:{{ scope.row.bV }}</span>
                  <span>C:{{ scope.row.cV }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('table.watt')">
              <template slot-scope="scope">
                {{ scope.row.gW }}
                <div
                  v-show="
                    scope.row.lineType === '180' || scope.row.lineType === '380'
                  "
                  class="split-line"
                >
                  <span>A:{{ scope.row.aW }}</span>
                  <span>B:{{ scope.row.bW }}</span>
                  <span>C:{{ scope.row.cW }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('control.powerFactor')"
              prop="gPF"
            >
            </el-table-column>
            <el-table-column align="center" :label="$t('table.status')">
              <template slot-scope="scope">
                <span v-show="scope.row.oc" class="normal-text">{{
                  $t('table.beenClosed')
                }}</span>
                <span v-show="!scope.row.oc" class="danger-text">{{
                  $t('table.beenOpend')
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              :label="$t('table.operating')"
              width="160"
              v-if="obj.equipmentType === 1"
            >
              <template slot-scope="scope">
                <span>
                  <span
                    class="verticallyCentered"
                    v-if="scope.row.enableNetCtrl"
                  >
                    <el-button
                      size="mini"
                      v-show="scope.row.others.online !== 1"
                      :disabled="
                        scope.row.others.online !== 1 || scope.row.localLock
                      "
                      >{{ $t('table.closing') }}</el-button
                    >
                    <span
                      v-if="
                        scope.row.others.online === 1 &&
                          config.authority.CTL_AUTHORITY === 'true'
                      "
                    >
                      <el-button
                        size="mini"
                        v-if="scope.row.oc"
                        :disabled="true"
                        >{{ $t('table.closing') }}</el-button
                      >
                      <el-button
                        size="mini"
                        v-else-if="!scope.row.oc && scope.row.localLock"
                        :disabled="true"
                        >{{ $t('table.closing') }}</el-button
                      >
                      <el-button
                        size="mini"
                        v-else
                        @click="
                          switcherCtlEvent(
                            scope.row.mac,
                            scope.row.addr,
                            true,
                            'lineList',
                            scope.row
                          )
                        "
                        >{{ $t('table.closing') }}</el-button
                      >
                    </span>
                    <span
                      v-else-if="
                        scope.row.others.online === 1 &&
                          config.authority.CTL_AUTHORITY === 'false'
                      "
                    >
                      <el-button size="mini" :disabled="true">{{
                        $t('table.closing')
                      }}</el-button>
                    </span>
                    <el-button
                      size="mini"
                      v-show="scope.row.others.online !== 1"
                      :disabled="
                        scope.row.others.online !== 1 || scope.row.localLock
                      "
                      >{{ $t('table.opening') }}</el-button
                    >
                    <span
                      v-if="
                        scope.row.others.online === 1 &&
                          config.authority.CTL_AUTHORITY === 'true'
                      "
                    >
                      <el-button
                        size="mini"
                        v-if="!scope.row.oc"
                        :disabled="true"
                        >{{ $t('table.opening') }}</el-button
                      >
                      <el-button
                        size="mini"
                        v-else-if="scope.row.oc && scope.row.localLock"
                        :disabled="true"
                        >{{ $t('table.opening') }}</el-button
                      >
                      <el-button
                        size="mini"
                        v-else
                        @click="
                          switcherCtlEvent(
                            scope.row.mac,
                            scope.row.addr,
                            false,
                            'lineList',
                            scope.row
                          )
                        "
                        >{{ $t('table.opening') }}</el-button
                      >
                    </span>
                    <span
                      v-else-if="
                        scope.row.others.online === 1 &&
                          config.authority.CTL_AUTHORITY === 'false'
                      "
                    >
                      <el-button size="mini" :disabled="true">{{
                        $t('table.opening')
                      }}</el-button>
                    </span>
                  </span>
                  <span class="verticallyCentered" v-else>
                    <el-button
                      size="mini"
                      @click="handleUnlock(scope.row)"
                      :disabled="scope.row.localLock"
                      >{{ $t('table.unlock') }}</el-button
                    >
                  </span>
                  <span class="verticallyCentered" v-if="subItemFlag">
                    <el-button size="mini" @click="handlesetUp(scope.row)"
                      >设置分项</el-button
                    >
                  </span>
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-col>
      <el-dialog
        :visible.sync="piclFlag"
        :width="dialogWidth"
        :modal="false"
        :close-on-click-modal="false"
      >
        <img  @load="onLoadImg"
          :width="boxWidth" :src="iconUrl" alt="" />
      </el-dialog>

      <el-dialog
        title=""
        :close-on-click-modal="false"
        :visible.sync="dblFlag"
        :modal="false"
        :fullscreen="true"
        custom-class="dbl-custom"
      >
        <span class="dbl-title">{{ $t('table.watt') + ':' }}</span>
        <div class="dbl-detail" :class="{ isThreePhase: !threePhaseDetail }">
          <span>{{ gw }}</span>
          <div
            v-if="threePhaseDetail"
            class="dbl-split-line"
            style="overflow: hidden;"
          >
            <span>A:{{ aw }}</span>
            <span>B:{{ bw }}</span>
            <span>C:{{ cw }}</span>
          </div>
        </div>
      </el-dialog>
      <el-dialog
        :title="$t('control.device') + $t('control.details')"
        :close-on-click-modal="false"
        :custom-class="
          obj.equipmentType === 16 ? 'water-dialog' : 'details-dialog'
        "
        :modal="false"
        width="1423px"
        lock-scroll="false"
        :visible.sync="detailsFlag"
        :before-close="handleDetailsClose"
      >
        <span
          class="offline-attention c-danger"
          :class="this.$i18n.locale === 'zh' ? '' : 'en-offline-attention'"
          v-show="obj.others.online !== 1"
          >{{ $t('control.offlineAttention') }}</span
        >
        <div class="date-picker" v-if="obj.equipmentType === 16">
          <el-date-picker
            style="width: 240px"
            size="small"
            align="center"
            v-model="value1"
            :key="obj.equipmentType"
            :editable="false"
            @change="handleDateRangeChange"
            type="daterange"
            value-format="yyyy-MM-dd"
            :range-separator="$t('table.to')"
            :start-placeholder="$t('table.startDate')"
            :end-placeholder="$t('table.endDate')"
          >
          </el-date-picker>
        </div>
        <div class="date-picker" v-else>
          <el-button type="success" circle size="mini">{{
            obj.equipmentType === 6 || obj.equipmentType === 7
              ? $t('main.month')
              : $t('main.day')
          }}</el-button>
          <span>{{ $t('main.date') }}</span>
          <el-date-picker
            style="width: 135px"
            :key="obj.equipmentType"
            v-model="value"
            align="center"
            :type="
              obj.equipmentType === 6 || obj.equipmentType === 7
                ? 'month'
                : 'date'
            "
            size="small"
            @change="handleDateChange"
            :disabled="$store.state.dateFlag"
            :editable="false"
            :value-format="
              obj.equipmentType === 6 || obj.equipmentType === 7
                ? 'yyyy-MM'
                : 'yyyy-MM-dd'
            "
            :placeholder="$t('placeholder.pleaseChoose') + $t('main.date')"
          >
          </el-date-picker>
        </div>
        <el-scrollbar v-if="obj.equipmentType !== 16" style="height: 100%;">
          <Details v-if="detailsFlag" :param="obj"></Details>
        </el-scrollbar>
        <Details
          v-else-if="detailsFlag && obj.equipmentType === 16"
          :param="obj"
        ></Details>
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
            v-if="
              equipmentFlag &&
                (equipmentNum === 1 || equipmentNum === 2 || equipmentNum === 8)
            "
            :param="obj"
          ></ConfigurationList>
          <StralsundConfiguration
            v-if="equipmentFlag && equipmentNum === 3"
          ></StralsundConfiguration>
          <HydrologicalConfiguration
            v-if="equipmentFlag && (equipmentNum === 4 || equipmentNum === 5)"
             :equipmentNum="equipmentNum"
          ></HydrologicalConfiguration>
          <SmokeConfiguration
            v-if="equipmentFlag && equipmentNum === 6"
          ></SmokeConfiguration>
          <FlammableGasConfiguration
            v-if="equipmentFlag && equipmentNum === 7"
          ></FlammableGasConfiguration>
          <TemperatureHumidityConfiguration
            v-if="equipmentFlag && (equipmentNum === 11 || equipmentNum === 14)"
            :online="online"
            :equipmentNum="equipmentNum"
          ></TemperatureHumidityConfiguration>
        </el-scrollbar>
      </el-dialog>
      <el-dialog
        :title="
          $t('message.immediately') +
            $t('btns.edit') +
            $t('control.device') +
            $t('home.serviceOrientation')
        "
        :close-on-click-modal="false"
        :modal="false"
        :visible.sync="orientationVisible"
        @closed="orientationVisible = false"
        width="680px"
      >
        <el-form
          ref="form"
          class="orientationForm"
          :model="orientationForm"
          label-width="130px"
        >
          <el-form-item
            :label="$t('home.newDirection', { param: $t('table.type') }) + ':'"
          >
            <el-select
              v-model="orientationForm.isDomain"
              @input="
                handleInput(
                  'isDomain',
                  orientationForm.mac,
                  orientationForm.isDomain
                )
              "
              :placeholder="$t('placeholder.pleaseChoose')"
            >
              <el-option
                v-for="item in option"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('home.newDirection', { param: ':' })">
            <el-input
              v-model="orientationForm.ipOrDomain"
              @input="
                handleInput(
                  'ipOrDomain',
                  orientationForm.mac,
                  orientationForm.ipOrDomain
                )
              "
              placeholder=""
            ></el-input>
          </el-form-item>
          <el-form-item
            :label="
              $t('home.newDirection', { param: this.$t('home.port') }) + ':'
            "
          >
            <el-input
              v-model="orientationForm.port"
              @input="
                handleInput('port', orientationForm.mac, orientationForm.port)
              "
              placeholder=""
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('home.serviceEntrance') + ':'">
            <el-input
              v-model="orientationForm.dealEntry"
              @input="
                handleInput(
                  'dealEntry',
                  orientationForm.mac,
                  orientationForm.dealEntry
                )
              "
              :placeholder="
                $t('system.formatExample', [
                  '/data/carry',
                  '/ebx-bishop/data/carry'
                ])
              "
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button size="small" @click="handleSave" type="primary">{{
              $t('btns.send')
            }}</el-button>
            <el-button size="small" @click="orientationVisible = false">{{
              $t('btns.cancel')
            }}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
        :title="
          $t('table.instruction') +
            $t('table.history') +
            $t('control.recording')
        "
        :close-on-click-modal="false"
        :modal="false"
        v-if="instructionsFlag"
        :visible.sync="instructionsFlag"
        custom-class="custom-select-dialog"
        width="1323px"
      >
        <CommandFeedback
          :classFlag="true"
          :instructionsData="instructionsData"
          :operateAt="2"
        ></CommandFeedback>
      </el-dialog>
      <el-dialog
        :title="
          $t('control.device') +
            $t('table.inspection') +
            $t('control.recording')
        "
        :close-on-click-modal="false"
        :modal="false"
        width="1000px"
        :visible.sync="inspectionFlag"
      >
        <div style="margin: 10px 20px">
          <InspectionDevice
            ref="inspection"
            v-if="inspectionFlag"
            :inspectionData="inspectionData"
            :titleFlag="false"
          ></InspectionDevice>
        </div>
      </el-dialog>
      <el-dialog
        title="设置分项"
        custom-class="custom-password"
        :modal="false"
        :close-on-click-modal="false"
        :visible.sync="setupFlag"
        width="30%"
        top="25vh"
        :before-close="handleBeforeClose"
      >
        <el-form
          :model="subItemForm"
          size="small"
          :label-width="$i18n.locale === 'zh' ? '100px' : '140px'"
          ref="informationForm"
        >
          <el-form-item required :label="'分项类型' + ':'">
            <el-select
              style="width:100%"
              v-model="subItemForm.type"
              placeholder="请选择"
            >
              <el-option
                v-for="item in subItemOptions"
                :key="item.id"
                :label="item.CategoryName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="handleInformationClose()">{{
            $t('btns.cancel2')
          }}</el-button>
          <el-button size="small" type="primary" @click="submitInformation()">{{
            $t('btns.ok2')
          }}</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="区域关系绑定"
        :close-on-click-modal="false"
        :modal="false"
        width="1000px"
        :visible.sync="BindingFlag"
      >
        <div style="margin: 10px 20px">
          <RegionalRelationshipBinding
            :resId="resId"
            v-if="BindingFlag"
            @handleClose="handleClose"
          ></RegionalRelationshipBinding>
        </div>
      </el-dialog>
    </div>
    <div v-loading.fullscreen.lock="loadingData"></div>
    <div v-if="error">error</div>
  </div>
</template>
<script>
/* global config */
import store from '@/store'
import {
  getBuildings,
  queryPageAuth,
  queryBoxes,
  queryChannels,
  remotectrl,
  verifyAuthCode,
  modifyMacRate,
  updateNodeTitle,
  abnormalSwitchUnlock,
  disableSelection,
  getChannelCategory,
  addChannelCategory
} from '@/api/api'
import CommandFeedback from '../Common/CommandFeedback'
import ConfigurationList from './ConfigurationList'
import StralsundConfiguration from './StralsundConfiguration'
import HydrologicalConfiguration from './HydrologicalConfiguration'
import SmokeConfiguration from './SmokeConfiguration'
import FlammableGasConfiguration from './FlammableGasConfiguration'
import TemperatureHumidityConfiguration from './TemperatureHumidityConfiguration'
import Details from './Details'
import InspectionDevice from '../Common/InspectionDevice'
import RegionalRelationshipBinding from '../Common/RegionalRelationshipBinding'
export default {
  props: {
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      dialogWidth: '',
      boxWidth: '',
      iconUrl: '',
      piclFlag: false,
      config: config,
      flag: true,
      loading: false,
      form: {
        mac: this.options.mac
      },
      tableData: [],
      instructionsData: {},
      pageNo: 1,
      pageSize: 24,
      currentPage: 1,
      total: 0,
      buildings: [],
      units: [],
      setupFlag: false,
      subItemOptions: [],
      channelAddr: '',
      stats: [
        {
          value: '',
          text: this.$t('placeholder.all')
        },
        {
          value: '1',
          text: this.$t('table.online')
        },
        {
          value: '0',
          text: this.$t('control.offline')
        },
        {
          value: '-1',
          text: this.$t('table.offLine')
        }
      ],
      building: '',
      unit: '',
      status: '',
      obj: {
        others: {
          version: '',
          online: ''
        }
      },
      channelsData: [],
      channelDatas: [],
      channelsPageNo: 1,
      channelsPageSize: 10,
      timerID: null,
      detailsFlag: false,
      online: 0,
      equipmentNum: 0,
      equipmentFlag: false,
      dblFlag: false,
      threePhaseDetail: false,
      instructionsFlag: false,
      gw: '',
      aw: '',
      bw: '',
      cw: '',
      value: '',
      value1: '',
      loadingData: false,
      inspectionFlag: false,
      BindingFlag: false,
      resId: '',
      post: null,
      error: null,
      bandFlag: false,
      subItemFlag: false,
      title: [],
      channels: [],
      enableNetCtrls: [],
      channelTitle: '',
      orientationVisible: false,
      channel: [],
      orientationForm: {
        _SPECIAL_FLAG: 'INR_CHK_ONR',
        cmd: 'SETSERVERPOINT_DA',
        mac: '',
        isDomain: '0',
        ipOrDomain: '',
        port: '',
        dealEntry: ''
      },
      option: [
        {
          label: 'IP',
          value: '0'
        },
        {
          label: this.$t('system.domainName'),
          value: '1'
        }
      ],
      subItemForm: {
        type: ''
      },
      inspectionData: {
        projectCode: '',
        macs: ''
      },
      controlTableHeight: {
        position: 'relative',
        height: this.$store.state.controlTableHeight
        // overflow: 'hidden'
      },
      channelsHeight: {
        position: 'relative',
        height: this.$store.state.channelsHeight
      }
    }
  },
  created () {
    this.init()
  },
  mounted () {},
  methods: {
    init () {
      this.flag = true
      clearTimeout(this.timerID)
      this.form.mac = this.options.mac
      this.error = this.post = null
      this.loadingData = true
      this.getBuilding()
      this.queryTreePageAuth()
    },
    lookPicFlag (val) {
      this.piclFlag = true
      // console.log(val, '=======val')
      this.iconUrl = val
    },
    onLoadImg (e) {
      let img = e.target
      let width = 0
      if (img.fileSize > 0 || (img.width > 1 && img.height > 1)) {
        width = img.width
      }
      if (img.height > img.width && width > 370) {
        width = 370
      } else if (width > 600) {
        width = 600
      }
      this.boxWidth = width + 'px'
      this.dialogWidth = width + 40 + 'px'
    },
    queryTreePageAuth () {
      let params = {
        resKeys: 'AUTH_PROJECT_USE,AUTH_PROJECT_USE',
        operKeys: 'ENERGY_AREA,ENERGY_CATEGORY'
      }
      queryPageAuth(params)
        .then(res => {
          if (res.success) {
            this.bandFlag = res.data[0].result
            this.subItemFlag = res.data[1].result
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
    getBuilding () {
      let all = this.$t('placeholder.all')
      let params = {
        projectCode: this.$store.state.projectCode,
        equipmentTypes: this.options.type,
        build: this.build
      }
      this.$nextTick(() => {
        getBuildings(params)
          .then(res => {
            if (res.success) {
              if (params.build && params.build !== '') {
                this.units = [{ text: all, value: '' }].concat(res.data)
                this.unit = ''
              } else {
                this.buildings = [{ text: all, value: '' }].concat(res.data)
                this.units = []
                this.unit = ''
              }
              this.queryList()
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
            this.post = true
            this.loading = false
            this.loadingData = false
          })
      })
    },
    handleChange (val) {
      this.build = val
      this.pageNo = 1
      this.getBuilding()
    },
    handleUnit (val) {
      this.unit = val
      this.pageNo = 1
      this.queryList()
    },
    handleStatus (val) {
      this.pageNo = 1
      this.status = val
      this.queryList()
    },
    handleKeyWords (event) {
      this.$emit('sendMac', event.target.value)
      this.form.mac = event.target.value
      this.pageNo = 1
      this.queryList()
    },
    handleInputMac (e) {
      this.$emit('sendMac', e.target.value)
    },
    handleSearch () {
      this.pageNo = 1
      this.queryList()
    },
    queryList () {
      this.loading = true
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        projectCode: this.$store.state.projectCode,
        build: this.build,
        unit: this.unit,
        status: this.status,
        key: this.options.mac,
        equipmentTypes: this.options.type
      }
      if (this.activeName === 'first') {
        params.equipmentTypes = '1'
      }
      if (localStorage.getItem('dblLineObj')) {
        this.handleModifyMacRate(localStorage.getItem('dblLineObj'), false)
        localStorage.setItem('dblLineObj', '')
      }
      this.$nextTick(function () {
        queryBoxes(params)
          .then(res => {
            if (res.success) {
              this.post = true
              this.tableData = res.datas
              // console.log(this.tableData, this.options, '=========this.tableData')
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
          .finally(() => {
            this.post = true
            this.loading = false
            this.loadingData = false
          })
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.queryList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.queryList()
    },
    handlesetUp (row) {
      this.subItemForm.type = ''
      this.channel = row
      this.channelAddr = row.addr
      clearTimeout(this.timerID)
      this.setupFlag = true
      getChannelCategory()
        .then(res => {
          if (res.success) {
            this.subItemOptions = res.data
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
    submitInformation () {
      if (this.subItemForm.type === '') {
        this.$message({
          message: '请选择分项',
          type: 'error'
        })
      }
      if (this.channel.gatherAddr === '-1') {
        this.$confirm(
          '如果同时存在进线直连和非进线直连线路的分项配置，可能导致按分项统计时电量不准。 是否继续？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
          .then(() => {
            let parmas = {
              categoryId: this.subItemForm.type,
              channelAddr: this.channelAddr,
              resId: this.obj.resId
            }
            addChannelCategory(parmas)
              .then(res => {
                if (res.success) {
                  this.$message({
                    message: res.message,
                    type: 'success'
                  })
                  this.setupFlag = false
                  this.setTimer(
                    this.queryChannels,
                    config.pollingInterval.channel * 1000
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
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
      } else {
        let parmas = {
          categoryId: this.subItemForm.type,
          channelAddr: this.channelAddr,
          resId: this.obj.resId
        }
        addChannelCategory(parmas)
          .then(res => {
            if (res.success) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.setupFlag = false
              this.setTimer(
                this.queryChannels,
                config.pollingInterval.channel * 1000
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
      }
    },
    handleInformationClose () {
      this.subItemForm.type = ''
      this.setupFlag = false
    },
    handleDblLineList (obj) {
      localStorage.setItem('dblLineObj', obj.mac)
      if (obj.equipmentType !== 1 && obj.equipmentType !== 2) return false
      if (obj) this.obj = obj
      this.detailsFlag = false
      this.flag = false
      store.commit('rightView', true)
      this.queryChannels()
      this.handleModifyMacRate(obj.mac, true)
      clearTimeout(this.timerID)
      this.setTimer(this.queryChannels, config.pollingInterval.channel * 1000)
    },
    handleShow () {
      clearTimeout(this.timerID)
    },
    handleHide () {
      this.setTimer(this.queryChannels, config.pollingInterval.channel * 1000)
    },
    queryChannels () {
      let params = {
        pageNo: this.channelsPageNo,
        pageSize: this.channelsPageSize,
        mac: this.obj.mac
      }
      this.$nextTick(function () {
        queryChannels(params)
          .then(res => {
            if (res.success) {
              this.channelsData = res.datas
              this.channelDatas = JSON.parse(JSON.stringify(res.datas))
              if (this.dblFlag) {
                res.datas.forEach((v, i) => {
                  if (v.addr === this.dblAddr) {
                    this.gw = v.gW
                    this.aw = v.aW
                    this.bw = v.bW
                    this.cw = v.cW
                  }
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
    },
    backToPrev () {
      this.$refs.channelsTable.clearSelection()
      clearTimeout(this.timerID)
      this.handleModifyMacRate(this.obj.mac, false)
      this.flag = true
      store.commit('rightView', false)
    },
    switcherCtlEvent (mac, addr, opr, lineList, row) {
      if (this.config.authority.CTL_AUTHORITY === 'false') {
        this.$func.controlAuthority(this.config.authority.CTL_AUTHORITY)
        return false
      }
      if (
        (row && row.enableNetCtrl === false) ||
        (this.enableNetCtrls.length === 1 && this.enableNetCtrls[0] === false)
      ) {
        this.$message({
          message:
            (row ? row.title : this.titles[0]) +
            this.$t('message.enableNetCtrl'),
          type: 'error'
        })
        return false
      }
      this.$confirm(
        (this.enableNetCtrls.indexOf(false) > -1
          ? this.$t('table.line') + this.$t('message.enableNetCtrl') + '\xa0'
          : '') +
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
                                this.$refs.channelsTable.clearSelection()
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
                    this.$refs.channelsTable.clearSelection()
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
    handleDblClick (row, column, cell, event) {
      if (column.label === this.$t('table.watt')) {
        this.dblFlag = true
        this.gw = row.gW
        this.aw = row.aW
        this.bw = row.bW
        this.cw = row.cW
        this.dblAddr = row.addr
        if (row.lineType === '380' || row.lineType === '180') {
          this.threePhaseDetail = true
        } else {
          this.threePhaseDetail = false
        }
      }
    },
    macClick (obj) {
      this.obj = obj
      store.commit('mac', obj.mac)
      store.commit('equipmentType', obj.equipmentType)
      if (obj.equipmentType === 6 || obj.equipmentType === 7) {
        this.value = this.$func.getCurrentYearMonth()
      } else if (obj.equipmentType === 15) {
        this.value = this.$func.formatDate(
          'yyyy-MM-dd',
          new Date(new Date().setDate(new Date().getDate() - 1))
        )
      } else if (obj.equipmentType === 16) {
        this.value1 = [
          this.$func.formatDate(
            'yyyy-MM-dd',
            new Date(new Date().setDate(new Date().getDate() - 7))
          ),
          this.$func.formatDate(
            'yyyy-MM-dd',
            new Date(new Date().setDate(new Date().getDate() - 1))
          )
        ]
      } else {
        this.value = this.$func.getNowFormatDate()
      }
      if (obj.equipmentType === 16) {
        store.commit('historyDate', this.value1)
      } else {
        store.commit('historyDate', this.value)
      }
      this.detailsFlag = true
      this.handleModifyMacRate(obj.mac, true)
    },
    handleDetailsClose () {
      if (this.obj.equipmentType === 6 || this.obj.equipmentType === 7) {
        this.value = this.$func.getCurrentYearMonth()
        store.commit('historyDate', this.$func.getCurrentYearMonth())
      } else if (this.obj.equipmentType === 16) {
        this.value1 = [
          this.$func.formatDate(
            'yyyy-MM-dd',
            new Date(new Date().setDate(new Date().getDate() - 7))
          ),
          this.$func.formatDate(
            'yyyy-MM-dd',
            new Date(new Date().setDate(new Date().getDate() - 1))
          )
        ]
        store.commit('historyDate', [
          this.$func.formatDate(
            'yyyy-MM-dd',
            new Date(new Date().setDate(new Date().getDate() - 7))
          ),
          this.$func.formatDate(
            'yyyy-MM-dd',
            new Date(new Date().setDate(new Date().getDate() - 1))
          )
        ])
      } else {
        this.value = this.$func.getNowFormatDate()
        store.commit('historyDate', this.$func.getNowFormatDate())
      }
      store.commit('detailsAddr', '')
      this.handleModifyMacRate(this.$store.state.mac, false)
      store.dispatch('resetMac')
      this.detailsFlag = false
    },
    handleDateChange (val) {
      this.value = val
      store.commit('historyDate', val)
    },
    handleDateRangeChange (val) {
      this.value1 = val
      store.commit('historyDate', val)
    },
    handleSelectionChange (val) {
      if (val.length > 0) {
        clearTimeout(this.timerID)
      } else {
        this.setTimer(this.queryChannels, config.pollingInterval.channel * 1000)
      }
      this.titles = []
      this.channels = []
      this.enableNetCtrls = []
      val.forEach((item, index) => {
        if (
          item.others.online === 1 &&
          (item.lineType === '220' || item.lineType === '380')
        ) {
          this.channels.push(item.addr)
          this.titles.push(item.title)
          this.enableNetCtrls.push(item.enableNetCtrl)
        }
      })
    },
    handleChannelsOC (type) {
      if (this.config.authority.CTL_AUTHORITY === 'false') {
        this.$func.controlAuthority(this.config.authority.CTL_AUTHORITY)
        return false
      }
      if (this.channels.length > 0) {
        this.switcherCtlEvent(
          this.obj.mac,
          this.channels.join(','),
          type,
          'lineList'
        )
      }
    },
    handleModifyMacRate (mac, flag) {
      if (!mac) return false
      modifyMacRate({
        fastMac: flag === true ? mac : '',
        slowMac: flag === true ? '' : mac
      })
    },
    handleEdit (index, e, title) {
      updateNodeTitle({ mac: e.mac, nodeNo: e.addr, title: title })
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('message.controlSuccess'),
              type: 'success'
            })
            this.$refs[`popover-` + index].doClose()
            this.queryChannels()
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
    handleCommand (command) {
      switch (command.command) {
        case 'list':
          this.handleDblLineList(command.row)
          break
        case 'orientation':
          this.handleOrientation(command.row)
          break
        case 'inspection':
          this.handleInspection(command.row)
          break
        case 'equipment':
          this.handleEquipment(command.row)
          break
        case 'builtIn':
          this.handleBuiltIn(command.row)
          break
        case 'longitude':
          this.handleLongitude(command.row)
          break
        case 'region':
          this.handleRegionalRelations(command.row)
          break
      }
    },
    beforeHandleCommand (command, row) {
      return {
        command: command,
        row: row
      }
    },
    handleUnlock (row) {
      if (!row.enableNetCtrl && row.localLock) {
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
            mac: row.mac,
            addr: row.addr
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
    handleOrientation (row) {
      if (row.others.online === 1) {
        this.orientationVisible = true
        this.orientationForm.mac = row.mac
        this.orientationForm.isDomain = sessionStorage.getItem(
          'isDomain-' + row.mac
        )
          ? sessionStorage.getItem('isDomain-' + row.mac)
          : '0'
        this.orientationForm.ipOrDomain = sessionStorage.getItem(
          'ipOrDomain-' + row.mac
        )
          ? sessionStorage.getItem('ipOrDomain-' + row.mac)
          : ''
        this.orientationForm.port = sessionStorage.getItem('port-' + row.mac)
          ? sessionStorage.getItem('port-' + row.mac)
          : ''
        this.orientationForm.dealEntry = sessionStorage.getItem(
          'dealEntry-' + row.mac
        )
          ? sessionStorage.getItem('dealEntry-' + row.mac)
          : ''
      } else {
        this.$message({
          message: this.$t('message.notOnline'),
          type: 'error'
        })
      }
    },
    handleInspection (row) {
      this.inspectionFlag = true
      this.inspectionData = {
        projectCode: row.projectCode,
        macs: row.mac
      }
    },
    handleEquipment (row) {
      this.equipmentNum = row.equipmentType
      this.online = row.others.online
      store.commit('mac', row.mac)
      store.commit('equipmentType', row.equipmentType)
      this.equipmentFlag = true
    },
    handleBuiltIn (row) {
      this.$router.push({
        name: 'BuiltInTiming',
        params: {
          mac: row.mac
        }
      })
    },
    handleLongitude (row) {
      this.$router.push({
        name: 'LatitudeLongitudeTiming',
        params: {
          mac: row.mac
        }
      })
    },
    handleRegionalRelations (row) {
      this.BindingFlag = true
      this.resId = row.resId
    },
    handleClose () {
      this.BindingFlag = false
    },
    handleEquipmentClose () {
      this.equipmentFlag = false
    },
    handleInput (key, index, value) {
      sessionStorage.setItem(key + '-' + index, value)
      this.orientationForm[key] = value
    },
    handleSave () {
      let params = {
        _SPECIAL_FLAG: this.orientationForm._SPECIAL_FLAG,
        cmd: this.orientationForm.cmd,
        mac: JSON.stringify([this.orientationForm.mac]),
        isDomain: JSON.stringify([this.orientationForm.isDomain]),
        ipOrDomain: JSON.stringify([this.orientationForm.ipOrDomain]),
        port: JSON.stringify([this.orientationForm.port]),
        dealEntry: JSON.stringify([this.orientationForm.dealEntry])
      }
      this.$confirm(
        '<div style="font-size: 18px;">' +
          this.$t('message.carefulOperation') +
          '</div>' +
          '<div style="font-size: 14px;text-align: center;font-weight: 700 ;">' +
          this.$t('message.reconfirm') +
          '</div>',
        this.$t('table.operating') + this.$t('btns.confirm'),
        {
          confirmButtonText: this.$t('btns.ok'),
          cancelButtonText: this.$t('btns.cancel'),
          dangerouslyUseHTMLString: true
        }
      )
        .then(() => {
          remotectrl(params)
            .then(res => {
              if (res.success) {
                if (res.code === '0') {
                  this.orientationVisible = false
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('message.cancelled')
          })
        })
    },
    handleInstructions () {
      this.instructionsData = {
        mac: this.obj.mac,
        projectCode: this.$store.state.projectCode
      }
      this.instructionsFlag = true
    },
    handleResetState (row) {
      let addrs = []
      row.disableSelectState = !row.disableSelectState
      this.channelsData.filter(item => {
        if (item.disableSelectState) return addrs.push(item.addr)
      })
      let parmas = {
        mac: row.mac,
        addrs: addrs.join(',')
      }
      disableSelection(parmas)
        .then(res => {
          if (res.success) {
            if (res.code === '0') {
              if (!row.disableSelectState) {
                this.$message({
                  message: '已设置为可以勾选',
                  type: 'success'
                })
              } else {
                this.$message({
                  message: '已设置为不可勾选',
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
    '$store.state.projectCode': {
      handler (newVal, oldVal) {
        if (newVal && this.$route.path === '/InnerMain/Overview') this.init()
      }
    },
    '$store.state.controlTableHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.controlTableHeight.height = newVal
        }
      }
    },
    '$store.state.channelsHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.channelsHeight.height = newVal
        }
      }
    },
    $route (to, from) {
      if (
        (from.path === '/Home' ||
          from.path === '/Overview' ||
          from.path === '/Alarm' ||
          from.path === '/Device') &&
        to.path === '/InnerMain/Overview'
      ) {
        this.init()
      }
      if (to) {
        this.flag = true
        clearTimeout(this.timerID)
      }
      if (to && !this.flag) {
        this.handleModifyMacRate(this.obj.mac, false)
      }
    }
  },
  components: {
    Details,
    CommandFeedback,
    InspectionDevice,
    RegionalRelationshipBinding,
    ConfigurationList,
    StralsundConfiguration,
    HydrologicalConfiguration,
    SmokeConfiguration,
    FlammableGasConfiguration,
    TemperatureHumidityConfiguration
  }
}
</script>
<style lang="stylus" scoped>
#buildings-form .el-form >>> .el-input__inner
    width 135px
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
.en-unit >>> .el-input__inner
    width 90px !important
.channel-top
    padding 10px 0
    span
      padding-right 5px
      font-size 13px
    .channel-except
      padding-right 0
.split-line
    border-top 1px solid #c6e7ffcf
    overflow-x auto
.el-table >>> .cell, .icon-fanhui-copy
    cursor pointer
.el-table >>> .el-button--mini
    padding 3px
.el-table >>> .el-button+.el-button
    margin-left:4px
.danger-text
    color #FF5722
.normal-text
    color #5FB878
.el-dialog__wrapper >>> .dbl-custom
    position relative
    background #262626
    .el-dialog__body
        position absolute
        height 100px
        top 50%
        margin-top -80px
        width 50%
        margin-left 25%
        margin-right 25%
        font-size 32px
        text-align center
        color #fff
        .dbl-title
            display inline-block
            height 100px
            vertical-align middle
        .dbl-detail
            display inline-block
            padding-left 20px
        .isThreePhase
            height 100px
            vertical-align middle
        .dbl-split-line
            border-top 1px solid #fff
            overflow-x auto
#overList >>> .water-dialog
    background-color #0c1e32
    position: absolute
    top 200px
    height 460px
    left 50%
    margin-left -661.5px
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
      padding 0 17px
      overflow auto
      overflow-y hidden
      color #fff
    .el-dialog__headerbtn
      top 10px
      right 5px
#overList >>> .details-dialog
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
      padding 0 17px
      overflow auto
      color #fff
    .el-dialog__headerbtn
      top 10px
      right 5px
.date-picker
  position absolute
  right 40px
  top 14px
  z-index 999
  span
    color #fff
  .el-date-editor.el-input
    width 130px
.offline-attention
  position absolute
  top 10px
  left 120px
  width 940px
.en-offline-attention
  left 135px
  top 2px
.icon-zaixian, .icon-lixian, .status-name
  vertical-align middle
/deep/ .orientationForm
        .el-form-item__label
          color #333
.borderText
  padding 5px
  border 1px solid #fff
  border-radius 5px
#overList >>> .custom-select-dialog
  .el-dialog__title, .el-dialog__headerbtn .el-dialog__close
      color #303133
.verticallyCentered
  display inline-block
  vertical-align middle
/deep/ .custom-password .el-form-item__label
          color #606266
</style>
