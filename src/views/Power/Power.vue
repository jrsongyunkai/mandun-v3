<template>
  <div id="power">
    <el-scrollbar style="height:100%;">
      <el-col :style="powerTableHeight">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane name="first">
            <span slot="label">
              <el-dropdown @command="handleMonthCommand">
                <span class="el-dropdown-link" style="color: #fff">
                  {{ firstName
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="natural">{{
                    $t('echarts.naturalMonth')
                  }}</el-dropdown-item>
                  <el-dropdown-item command="custom">{{
                    $t('echarts.customMonth')
                  }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
            <el-col :span="14">
              <div id="gauge" v-show="gauge"></div>
            </el-col>
            <el-col
              :span="10"
              class="contrast-wrap"
              v-if="firstCommand === 'custom'"
            >
              <div class="the-month">
                {{
                  dayTime.startDate +
                    $t('table.to') +
                    dayTime.endDate +
                    $t('main.energyUsed') +
                    ':' +
                    (cycleData.number1
                      ? cycleData.number1 !== ''
                        ? cycleData.number1
                        : '--'
                      : '--') +
                    $t('echarts.celsius')
                }}
              </div>
              <div class="last-month">
                {{
                  dayTime.preStartDate +
                    $t('table.to') +
                    dayTime.preEndDate +
                    $t('main.energyUsed') +
                    ':' +
                    (cycleData.number2
                      ? cycleData.number2 !== ''
                        ? cycleData.number2
                        : '--'
                      : '--') +
                    $t('echarts.celsius')
                }}
              </div>
              <div
                class="contrast"
                v-if="cycleData.number1 - cycleData.number2 >= 0"
              >
                {{
                  $t('echarts.RelativeSpecificPowerConsumptionExceeded') +
                    ':' +
                    (cycleData.number1
                      ? cycleData.number1 !== ''
                        ? (cycleData.number1 - cycleData.number2).toFixed(3)
                        : '--'
                      : '--') +
                    $t('echarts.celsius')
                }}
              </div>
              <div class="contrast" v-else>
                {{
                  $t('echarts.RelativelyLessThanElectricityConsumption') +
                    ':' +
                    (cycleData.number2
                      ? cycleData.number2 !== ''
                        ? (cycleData.number2 - cycleData.number1).toFixed(3)
                        : '--'
                      : '--') +
                    $t('echarts.celsius')
                }}
              </div>
            </el-col>
            <el-col :span="10" class="contrast-wrap" v-else>
              <div class="the-month">
                {{
                  $t('echarts.electricityConsumptionForMonth', {
                    year: year,
                    month: formatMonth[0].text
                  }) +
                    '：' +
                    (number2 ? (number2 !== '' ? number2 : '--') : '--') +
                    $t('echarts.celsius')
                }}
              </div>
              <div class="last-month">
                {{
                  $t('echarts.electricityConsumptionForMonth', {
                    year: preFormatMonth[0].value === '12' ? year - 1 : year,
                    month: preFormatMonth[0].text
                  }) +
                    '：' +
                    (number3 ? (number3 !== '' ? number3 : '--') : '--') +
                    $t('echarts.celsius')
                }}
              </div>
              <div class="contrast" v-if="number2 - number3 >= 0">
                {{
                  $t('echarts.beyond', {
                    current: formatMonth[0].text,
                    pre: preFormatMonth[0].text
                  }) +
                    (number2
                      ? number2 !== ''
                        ? (number2 - number3).toFixed(3)
                        : '--'
                      : '--') +
                    $t('echarts.celsius')
                }}
              </div>
              <div class="contrast" v-else>
                {{
                  $t('echarts.saving', {
                    current: formatMonth[0].text,
                    pre: preFormatMonth[0].text
                  }) +
                    (number2
                      ? number2 !== ''
                        ? (number3 - number2).toFixed(3)
                        : '--'
                      : '--') +
                    $t('echarts.celsius')
                }}
              </div>
            </el-col>
            <el-col id="power-form">
              <div id="input-wrap" style="max-height: 124px;">
                <el-form
                  ref="form"
                  :model="form"
                  size="small"
                  :inline="true"
                  @submit.native.prevent
                >
                  <el-form-item :label="$t('control.building') + ':'">
                    <el-select
                      v-model="building"
                      class="build"
                      :placeholder="$t('placeholder.pleaseChoose')"
                    >
                      <el-option
                        v-for="item in buildings"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-if="firstCommand !== 'custom'"
                    :label="$t('echarts.years') + ':'"
                  >
                    <el-select
                      :class="$i18n.locale === 'en' ? 'en-form-input' : ''"
                      class="year"
                      v-model="year"
                      :placeholder="$t('placeholder.pleaseChoose')"
                    >
                      <el-option
                        v-for="item in years"
                        :key="item.value"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-if="firstCommand !== 'custom'"
                    :label="$t('echarts.month') + ':'"
                  >
                    <el-select
                      :class="$i18n.locale === 'en' ? 'en-form-input' : ''"
                      class="month"
                      v-model="month"
                      :placeholder="$t('placeholder.pleaseChoose')"
                    >
                      <el-option
                        v-for="item in months"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-if="firstCommand === 'custom'"
                    :label="$t('echarts.month') + ':'"
                  >
                    <el-date-picker
                      v-model="customValue"
                      :clearable="false"
                      type="daterange"
                      style="width:240px"
                      :range-separator="$t('table.to')"
                      :start-placeholder="$t('table.startDate')"
                      :end-placeholder="$t('table.endDate')"
                      :picker-options="pickerOptions"
                    >
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item
                    :label="$t('dialog.deviceNo') + ':'"
                    @keyup.enter.native="queryPowerList"
                  >
                    <el-input
                      :placeholder="$t('placeholder.enterDeviceNo')"
                      v-model="keyword"
                      clearable
                    ></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="queryPowerList">{{
                      $t('btns.query')
                    }}</el-button>
                    <el-tooltip
                      v-if="firstCommand !== 'custom'"
                      :content="$t('home.export')"
                      placement="top"
                    >
                      <el-dropdown trigger="click" @command="handleCommand">
                        <el-button type="text" class="export-btns">
                          <i class="iconfont icon-export"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="exportCurrent">{{
                            $t('btns.exportCurPageDevicePower')
                          }}</el-dropdown-item>
                          <el-dropdown-item command="exportAll">{{
                            $t('btns.exportAllPagesDevicePower')
                          }}</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-tooltip>
                    <el-button v-else type="text" class="export-btns">
                      <i
                        @click="handleExportRangeOpen"
                        class="iconfont icon-export"
                      ></i>
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
            </el-col>
            <el-col
              v-loading="loading"
              element-loading-spinner="el-icon-loading"
              :element-loading-text="$t('message.loading')"
            >
              <el-scrollbar style="height: 300px">
                <el-table :data="tableData" size="small" style="width: 100%;">
                  <el-table-column
                    prop="mac"
                    align="center"
                    :label="$t('dialog.deviceNo')"
                  ></el-table-column>
                  <el-table-column align="center" :label="$t('control.room')">
                    <template slot-scope="scope"
                      >{{ scope.row.unit ? scope.row.unit : ''
                      }}{{
                        scope.row.room ? ',' + scope.row.room : ''
                      }}</template
                    >
                  </el-table-column>
                  <el-table-column
                    v-if="firstCommand !== 'custom'"
                    prop="others.electricity"
                    align="center"
                    :label="$t('table.thisMonth') + $t('menu.electricity')"
                    width="90px"
                  ></el-table-column>
                  <el-table-column
                    v-if="firstCommand !== 'custom'"
                    prop="others.preElectricity"
                    align="center"
                    :label="$t('table.lastmonth') + $t('menu.electricity')"
                    width="90px"
                  ></el-table-column>
                  <el-table-column
                    v-if="firstCommand === 'custom'"
                    prop="others.preElectricity"
                    align="center"
                    :label="
                      dayTime.preStartDate + $t('table.to') + dayTime.preEndDate
                    "
                    width="110px"
                  ></el-table-column>
                  <el-table-column
                    v-if="firstCommand === 'custom'"
                    prop="others.electricity"
                    align="center"
                    :label="
                      dayTime.startDate + $t('table.to') + dayTime.endDate
                    "
                    width="110px"
                  ></el-table-column>
                  <el-table-column
                    prop="others.ratio"
                    align="center"
                    :label="$t('table.compared')"
                  ></el-table-column>
                  <el-table-column
                    prop="linkman"
                    align="center"
                    :label="$t('table.contact')"
                  ></el-table-column>
                  <el-table-column
                    prop="linkmanTel"
                    align="center"
                    :label="$t('table.contactNumber')"
                  ></el-table-column>
                  <el-table-column :label="$t('table.status')" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.statusCnString === 'NORMAL'">
                        <span v-if="scope.row.others.online === 1">
                          {{ $t('system.enable') }}|
                          <span class="c-success">{{
                            $t('table.online')
                          }}</span>
                        </span>
                        <span v-else-if="scope.row.others.online === 0">
                          {{ $t('system.enable') }}|
                          <span class="c-danger">{{
                            $t('control.offline')
                          }}</span>
                        </span>
                        <span v-else>
                          {{ $t('system.enable') }}|
                          <span class="c-info">{{ $t('table.offLine') }}</span>
                        </span>
                      </span>
                      <span v-else>{{ $t('system.disable') }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :label="$t('table.operating')"
                    align="center"
                    width="50px"
                  >
                    <template slot-scope="scope">
                      <el-tooltip
                        :content="$t('table.lineDetail')"
                        placement="top"
                      >
                        <el-button
                          class="top-padding-bottom"
                          type="text"
                          size="small"
                          @click="
                            linePowerDetail(
                              scope.row.build,
                              scope.row.unit,
                              scope.row.room,
                              scope.row.mac
                            )
                          "
                        >
                          <i class="iconfont icon-mingxi"></i>
                        </el-button>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </el-scrollbar>
              <el-col :span="24" class="tc mt-5">
                <el-pagination
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page.sync="currentPage"
                  :page-sizes="[10, 20, 30]"
                  :page-size="pageSize"
                  :small="true"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                ></el-pagination>
              </el-col>
            </el-col>
          </el-tab-pane>
          <el-tab-pane
            :label="$t('echarts.electricityConsumptionPastTwoYears')"
            name="second"
          >
            <el-col :span="24">
              <bar-charts :options="optionsFirst" v-if="first"></bar-charts>
            </el-col>
            <el-col :span="12">
              <line-charts :options="optionsSecond" v-if="first"></line-charts>
            </el-col>
            <el-col :span="12">
              <bar-charts :options="optionsThird" v-if="first"></bar-charts>
            </el-col>
          </el-tab-pane>
          <el-tab-pane :label="$t('echarts.customCombinedPower')" name="third">
            <el-row>
              <el-col :span="6">
                <el-button
                  type="text"
                  class="c-default ml-20"
                  icon="el-icon-plus"
                  @click="handleAddEdit"
                  >{{ $t('control.newGroup') }}</el-button
                >
              </el-col>
              <el-col :span="18">
                <el-form
                  :inline="true"
                  size="small"
                  :model="formInline"
                  class="demo-form-inline tr"
                >
                  <el-form-item :label="$t('echarts.years') + ':'">
                    <el-select
                      :class="$i18n.locale === 'en' ? 'en-form-input' : ''"
                      class="year"
                      v-model="formInline.value"
                      :placeholder="$t('placeholder.pleaseChoose')"
                    >
                      <el-option
                        v-for="item in years"
                        :key="item.value"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    :class="$i18n.locale === 'en' ? 'en-form-input' : ''"
                    class="month"
                    :label="$t('echarts.month') + ':'"
                  >
                    <el-select
                      v-model="formInline.region"
                      :placeholder="$t('placeholder.pleaseChoose')"
                    >
                      <el-option
                        v-for="item in months"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="onSubmit">{{
                      $t('btns.query')
                    }}</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-dropdown trigger="click" @command="handleExport">
                      <el-button>
                        {{ $t('home.export')
                        }}<i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="current">{{
                          $t('btns.exportCurrent')
                        }}</el-dropdown-item>
                        <el-dropdown-item command="all">{{
                          $t('btns.exportAll')
                        }}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-scrollbar :style="groupTableHeight">
                  <el-table :data="groupData" style="width: 100%">
                    <el-table-column
                      align="center"
                      :label="$t('table.group_name')"
                    >
                      <template slot-scope="scope">
                        <span
                          class="pointer c-default"
                          @click="handleViewGroup(scope.row.name, scope.row.id)"
                          >{{ scope.row.name }}</span
                        >
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="remark"
                      align="center"
                      :label="$t('table.descript')"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="others.statsPower"
                      align="center"
                      :label="$t('table.statistical_power')"
                    >
                    </el-table-column>
                    <el-table-column
                      align="center"
                      width="200px"
                      :label="$t('table.operating')"
                    >
                      <template slot-scope="scope">
                        <el-button
                          class="c-default"
                          type="text"
                          @click="handleViewGroup(scope.row.name, scope.row.id)"
                          >{{ $t('table.lineDetail') }}</el-button
                        >
                        <el-button
                          class="c-default"
                          type="text"
                          @click="handleAddEdit(scope.row, 'edit')"
                          >{{ $t('control.edit') }}</el-button
                        >
                        <el-button
                          class="c-default"
                          type="text"
                          @click="handleDelGroup(scope.row.id)"
                          >{{ $t('system.delete') }}</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                </el-scrollbar>
              </el-col>
              <el-col :span="24" class="tc mt-5">
                <el-pagination
                  background
                  @size-change="handleGroupChange"
                  @current-change="handleGroupCurrentChange"
                  :current-page="currentGroupPage"
                  :page-sizes="[10, 20, 30]"
                  :page-size="pageGroupSize"
                  :small="true"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="groupTotal"
                ></el-pagination>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-dialog
        :title="addr"
        width="40%"
        :visible.sync="powerDialog"
        :modal="false"
        @closed="handleCloseAddr"
      >
        <el-row class="pickDate">
          <template>
            <div class="block">
              <el-tooltip
                effect="dark"
                :content="$t('home.export')"
                placement="top"
              >
                <i
                  class="export iconfont icon-export"
                  @click="handlePowerExport"
                ></i>
              </el-tooltip>
            </div>
            <div class="block" v-show="datePicker === 'hour'">
              <span class="demonstration">{{ $t('main.hour') }}</span>
              <el-date-picker
                :popper-append-to-body="false"
                popper-class="popper-hour"
                style="width: 155px"
                v-model="powerHour"
                type="datetime"
                size="small"
                :editable="false"
                :clearable="false"
                value-format="yyyy-MM-dd HH"
                format="yyyy-MM-dd HH"
                @change="handlePowerHourPicker"
              >
              </el-date-picker>
            </div>
            <div class="block" v-show="datePicker === 'day'">
              <span class="demonstration">{{ $t('main.date') }}</span>
              <el-date-picker
                v-model="powerDay"
                type="date"
                size="small"
                :editable="false"
                :clearable="false"
                value-format="yyyy-MM-dd"
                @change="handlePowerDayPicker"
              >
              </el-date-picker>
            </div>
            <div class="block" v-show="datePicker === 'month'">
              <span class="demonstration">{{ $t('main.date') }}</span>
              <el-date-picker
                v-model="powerMonth"
                value-format="yyyy-MM"
                type="month"
                size="small"
                :editable="false"
                :clearable="false"
                @change="handlePowerMonthPicker"
              >
              </el-date-picker>
            </div>
          </template>
          <div class="block">
            <el-button
              size="small"
              :type="datePicker === 'hour' ? 'success' : 'info'"
              circle
              @click="handleDatePicker('hour')"
              >{{ $t('main.hour') }}</el-button
            >
            <el-button
              size="small"
              :type="datePicker === 'day' ? 'success' : 'info'"
              circle
              @click="handleDatePicker('day')"
              >{{ $t('main.day') }}</el-button
            >
            <el-button
              size="small"
              v-if="firstCommand !== 'custom'"
              :type="datePicker === 'month' ? 'success' : 'info'"
              circle
              @click="handleDatePicker('month')"
              >{{ $t('main.month') }}</el-button
            >
          </div>
        </el-row>
        <el-row
          v-loading="detailLoading"
          element-loading-spinner="el-icon-loading"
          :element-loading-text="$t('message.loading')"
        >
          <el-table :data="powerData">
            <el-table-column
              prop="title"
              :label="$t('table.lineName')"
            ></el-table-column>
            <el-table-column
              prop="electricity"
              :label="$t('echarts.electricity')"
            ></el-table-column>
            <el-table-column
              prop="preElectricity"
              :label="
                datePicker === 'day'
                  ? $t('table.theDayBefore') + $t('echarts.electricity')
                  : datePicker === 'hour'
                  ? $t('table.lastHour') + $t('echarts.electricity')
                  : $t('table.lastMonth') + $t('echarts.electricity')
              "
            ></el-table-column>
          </el-table>
        </el-row>
      </el-dialog>
      <el-dialog
        :title="$t('dialog.addEditGroups')"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        custom-class="export-range"
        @close="detailsFlag = false"
        width="35%"
        top="30vh"
      >
        <el-form
          ref="form"
          :modal="false"
          :model="groupsForm"
          size="small"
          label-width="80px"
        >
          <el-form-item :label="$t('dialog.name')">
            <el-input v-model="groupsForm.name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('table.descript')">
            <el-input v-model="groupsForm.remark" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" v-if="detailsFlag" @click="handleDetails">{{
            $t('control.details2')
          }}</el-button>
          <el-button size="small" @click="handleSceneCancel">{{
            $t('btns.cancel2')
          }}</el-button>
          <el-button size="small" type="primary" @click="handleSceneSave">{{
            $t('btns.ok2')
          }}</el-button>
        </div>
      </el-dialog>
      <el-dialog
        :title="$t('menu.electricity') + $t('home.export')"
        :close-on-click-modal="false"
        :visible.sync="exportRangeFlag"
        custom-class="export-range"
        @closed="handleCloseRange"
      >
        <el-form
          :inline="true"
          ref="rangeExportForm"
          :model="rangeExportForm"
          label-width="80px"
        >
          <el-form-item :label="$t('dialog.time') + $t('dialog.range')">
            <el-date-picker
              v-model="rangeExportForm.value"
              type="daterange"
              value-format="yyyy-MM-dd"
              :clearable="false"
              :editable="false"
              :range-separator="$t('table.to')"
              :start-placeholder="$t('table.startDate')"
              :end-placeholder="$t('table.endDate')"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleExportRange">{{
              $t('home.export') + $t('dialog.Sunday') + $t('menu.electricity')
            }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleExportRange('hour')">{{
              $t('home.export') + $t('table.hour') + $t('menu.electricity')
            }}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
        :title="groupName"
        width="40%"
        :close-on-click-modal="false"
        :visible.sync="groupDialog"
        :modal="false"
        @closed="handleCloseGroup"
      >
        <el-row class="pickDate">
          <template>
            <el-button
              type="text"
              class="c-default"
              icon="el-icon-plus"
              @click="handleSelectDevice"
              >{{ $t('btns.select') + $t('control.device') }}</el-button
            >
            <div class="block">
              <el-tooltip
                effect="dark"
                :content="$t('home.export')"
                placement="top"
              >
                <i
                  class="export iconfont icon-export"
                  @click="handleGroupExport"
                ></i>
              </el-tooltip>
            </div>
            <div class="block" v-show="datePicker === 'hour'">
              <span class="demonstration">{{ $t('main.hour') }}</span>
              <el-date-picker
                :popper-append-to-body="false"
                popper-class="popper-hour"
                style="width: 155px"
                v-model="groupHour"
                type="datetime"
                size="small"
                :editable="false"
                :clearable="false"
                value-format="yyyy-MM-dd HH"
                format="yyyy-MM-dd HH"
                @change="handleHourPicker"
              >
              </el-date-picker>
            </div>
            <div class="block" v-show="datePicker === 'day'">
              <span class="demonstration">{{ $t('main.date') }}</span>
              <el-date-picker
                v-model="groupDay"
                type="date"
                size="small"
                :editable="false"
                :clearable="false"
                value-format="yyyy-MM-dd"
                @change="handleGroupDayPicker"
              >
              </el-date-picker>
            </div>
            <div class="block" v-show="datePicker === 'month'">
              <span class="demonstration">{{ $t('main.date') }}</span>
              <el-date-picker
                v-model="groupMonth"
                :clearable="false"
                value-format="yyyy-MM"
                type="month"
                size="small"
                :editable="false"
                @change="handleGroupMonthPicker"
              >
              </el-date-picker>
            </div>
          </template>
          <div class="block">
            <el-button
              size="small"
              :type="datePicker === 'hour' ? 'success' : 'info'"
              circle
              @click="handleDateLinePicker('hour')"
              >{{ $t('main.hour') }}</el-button
            >
            <el-button
              size="small"
              :type="datePicker === 'day' ? 'success' : 'info'"
              circle
              @click="handleDateLinePicker('day')"
              >{{ $t('main.day') }}</el-button
            >
            <el-button
              size="small"
              :type="datePicker === 'month' ? 'success' : 'info'"
              circle
              @click="handleDateLinePicker('month')"
              >{{ $t('main.month') }}</el-button
            >
          </div>
        </el-row>
        <el-row
          v-loading="detailLoading"
          element-loading-spinner="el-icon-loading"
          :element-loading-text="$t('message.loading')"
        >
          <el-table :data="groupLineData">
            <el-table-column :label="$t('control.device')">
              <template slot-scope="scope">
                <div>{{ scope.row.mac }}</div>
                <div>{{ scope.row.name }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="addrTitles"
              :label="$t('table.line')"
            ></el-table-column>
            <el-table-column
              prop="power"
              width="120px"
              :label="$t('echarts.electricity')"
            ></el-table-column>
            <el-table-column
              width="80px"
              align="center"
              :label="$t('table.operating')"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="handleDelGroupLine(scope.row.id)"
                  >{{ $t('system.delete') }}</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-dialog>
      <el-dialog
        :title="$t('table.addDeviceLine')"
        :close-on-click-modal="false"
        :visible.sync="addDeviceVisible"
        custom-class="export-range custom-dialog"
        :modal="false"
        top="10vh"
        width="70%"
        :before-close="handleClose"
      >
        <el-scrollbar style="height: 100%;">
          <div>
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              class="rule-form"
              size="small"
              @submit.native.prevent
            >
              <el-form-item>
                <el-col :span="5" class="left-padding-right">
                  <el-input
                    v-model="ruleForm.mac"
                    :placeholder="$t('table.deviceNo')"
                  ></el-input>
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" @click="handleQuery">{{
                    $t('btns.query')
                  }}</el-button>
                </el-col>
              </el-form-item>
            </el-form>
            <el-table
              class="mt-20 device-wrap"
              :data="macLineData"
              border
              style="width: 100%"
            >
              <el-table-column align="center" :label="$t('dialog.deviceNo')">
                <template slot-scope="scope">
                  <div>{{ scope.row.mac }}</div>
                  <div>{{ scope.row.name }}</div>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="build"
                :label="$t('control.building')"
                width="180"
              >
              </el-table-column>
              <el-table-column
                align="center"
                prop="unit"
                :label="$t('control.unit')"
              >
              </el-table-column>
              <el-table-column
                align="center"
                prop="room"
                :label="$t('control.room')"
              >
              </el-table-column>
              <el-table-column align="center" :label="$t('table.operating')">
                <template slot-scope="scope">
                  <el-button
                    class="c-default"
                    type="text"
                    style="color: #409EFF"
                    @click="handleLine(scope.row.mac)"
                    >{{ $t('btns.select') + $t('table.line') }}</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="handleSizeLineChange"
              @current-change="handleCurrentLineChange"
              :current-page.sync="currentLinePage"
              :page-sizes="[20, 50, 100, 500]"
              :page-size="pageLineSize"
              layout="sizes, prev, pager, next"
              :total="lineTotal"
            >
            </el-pagination>
          </div>
        </el-scrollbar>
        <el-dialog
          :title="$t('dialog.channelList')"
          custom-class="export-range"
          :visible.sync="lineListVisible"
          width="60%"
          append-to-body="true"
          :before-close="checkedClose"
        >
          <el-checkbox-group
            v-model="checkedAddr"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="(v, f) in addrData"
              :ref="`disable-${v.title}`"
              :label="v"
              :key="f"
              >{{ v.title
              }}<span v-if="v.gatherAddr === '-1'" class="c-warning"
                >(D)</span
              ></el-checkbox
            >
          </el-checkbox-group>
          <el-row class="mt-20">
            <el-col :span="22">
              <el-button
                style="float: right"
                class="mr-20"
                size="small"
                @click="checkedClose"
                >{{ $t('btns.back') }}</el-button
              >
            </el-col>
            <el-col :span="2">
              <el-button
                :disabled="checkedAddr.length === 0"
                type="primary"
                size="small"
                @click="handleAddrSave"
                >{{ $t('btns.save') }}</el-button
              >
            </el-col>
          </el-row>
        </el-dialog>
      </el-dialog>
    </el-scrollbar>
  </div>
</template>
<script>
/* global ctxPaths */
import {
  last2mPowerStats,
  queryPower,
  getBuildings,
  chnlPowerStatsOfBox,
  last2yPowerStats,
  addrEditGroup,
  queryGroup,
  delGroup,
  chnlDetails,
  delDetail,
  pageBoxsSelect,
  queryChnlSelect,
  saveDetail,
  statsPowerByTimeRange,
  queryYearRatioByTimeRangePower,
  queryTimeRangePowerOfProject
} from '@/api/api'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/gauge'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import BarCharts from '../Common/Bars'
import LineCharts from '../Common/Line'
export default {
  data () {
    return {
      activeName: 'first',
      firstCommand: '',
      firstName: this.$t('echarts.electricityConsumptionPerHousehold'),
      powerHeight: {},
      gauge: true,
      number2: '',
      number3: '',
      formInline: {
        value: '',
        region: ''
      },
      groupsForm: {
        name: '',
        remark: '',
        id: ''
      },
      name: '',
      groupId: '',
      powerDialog: false,
      groupDialog: false,
      dialogVisible: false,
      lineListVisible: false,
      addDeviceVisible: false,
      loading: false,
      detailLoading: false,
      datePicker: 'hour',
      powerHour: this.$func.formatDate('yyyy-MM-dd HH', new Date()),
      powerDay: this.$func.getNowFormatDate(),
      powerMonth: this.$func.getCurrentYearMonth(),
      groupHour: this.$func.formatDate('yyyy-MM-dd HH', new Date()),
      groupDay: this.$func.getNowFormatDate(),
      groupMonth: this.$func.getCurrentYearMonth(),
      powerData: [],
      groupData: [],
      addrData: [],
      checkedAddr: [],
      groupLineData: [],
      date: '',
      dateType: 3,
      addr: '',
      addrMac: '',
      groupName: '',
      mac: '',
      building: '',
      buildings: [],
      macLineData: [],
      year: '',
      customValue: '',
      years: [
        { value: new Date().getFullYear() },
        { value: new Date().getFullYear() - 1 },
        { value: new Date().getFullYear() - 2 }
      ],
      month: '',
      formatMonth: [{ text: '', value: '' }],
      preFormatMonth: [{ text: '', value: '' }],
      months: [
        { text: this.$t('echarts.January'), value: '01' },
        { text: this.$t('echarts.February'), value: '02' },
        { text: this.$t('echarts.March'), value: '03' },
        { text: this.$t('echarts.April'), value: '04' },
        { text: this.$t('echarts.May'), value: '05' },
        { text: this.$t('echarts.June'), value: '06' },
        { text: this.$t('echarts.July'), value: '07' },
        { text: this.$t('echarts.August'), value: '08' },
        { text: this.$t('echarts.September'), value: '09' },
        { text: this.$t('echarts.October'), value: '10' },
        { text: this.$t('echarts.November'), value: '11' },
        { text: this.$t('echarts.December'), value: '12' }
      ],
      tableData: [],
      dayTime: {
        startDate: '',
        endDate: '',
        preStartDate: '',
        preEndDate: ''
      },
      cycleData: {
        number1: '',
        number2: ''
      },
      form: {
        keyword: ''
      },
      pageNo: 1,
      pageGroupNo: 1,
      pageSize: 10,
      pageLineSize: 20,
      pageGroupSize: 10,
      currentPage: 1,
      currentLinePage: 1,
      currentGroupPage: 1,
      total: 0,
      lineTotal: 0,
      groupTotal: 0,
      keyword: '',
      first: false,
      ruleForm: {
        mac: ''
      },
      exportRangeFlag: false,
      detailsFlag: false, // 控制弹窗中的详情按钮的显示与否
      rangeExportForm: {
        value: ''
      },
      optionsFirst: {
        legendStatus: true,
        legend: [],
        series: [],
        xAxis: [],
        title: {
          show: true,
          text: this.$t('echarts.monthlyElectricityConsumption')
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          formatter:
            '{b}<br/>{a0}' +
            this.$t('main.year') +
            '：{c0} ' +
            this.$t('echarts.celsius') +
            '<br/>{a1}' +
            this.$t('main.year') +
            '：{c1} ' +
            this.$t('echarts.celsius')
        }
      },
      addrList: [],
      optionsSecond: {
        series: [],
        xAxis: [],
        title: {
          show: true,
          text: this.$t('echarts.powerConsumptionContrastMonthly')
        }
      },
      optionsThird: {
        legendStatus: false,
        xAxisType: 'value',
        yAxisType: 'category',
        xAxis: [
          {
            max: null
          }
        ],
        series: [],
        title: {
          show: true,
          text: ''
        },
        tooltip: {
          show: false,
          trigger: '',
          formatter: ''
        }
      },
      powerTableHeight: {
        height: this.$store.state.powerTableHeight
      },
      groupTableHeight: {
        height: this.$store.state.groupTableHeight
      },
      pickerOptions: {
        disabledDate: time => {
          return (
            new Date(new Date().getFullYear() - 3, 12) > time ||
            time > new Date(new Date().getFullYear(), 12, 0)
          )
        }
      }
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    contrast: function () {
      return Math.abs(
        (((this.number2 - this.number3) / this.number3) * 100).toFixed(1)
      )
    }
  },
  methods: {
    init () {
      this.initBuilding()
    },
    initGauge () {
      let that = this
      if (this.firstCommand === 'custom') {
        let params = {
          projectCode: this.$store.state.projectCode,
          build: this.building,
          mac: this.keyword,
          startTime: this.$func.formatDate('yyyy-MM-dd', this.customValue[0]),
          endTime: this.$func.formatDate('yyyy-MM-dd', this.customValue[1])
        }
        this.$nextTick(() => {
          queryYearRatioByTimeRangePower(params)
            .then(res => {
              if (res.success) {
                let data = [
                  { value: res.data.ratio, name: that.$t('main.percentage') }
                ]
                let startData = res.data.startTime
                let endData = res.data.endTime
                let options = {
                  title: {
                    text:
                      (this.building === ''
                        ? this.$store.state.projectName
                        : this.building) +
                      '\xa0\xa0' +
                      that.$t('echarts.totalElectricityProportion', {
                        startDate: startData,
                        endDate: endData,
                        year: this.year
                      }),
                    x: 'center',
                    textStyle: {
                      fontSize: 13,
                      fontWeight: 'normal',
                      color: '#fff'
                    }
                  },
                  series: [
                    {
                      name: that.$t('main.percentage'),
                      type: 'gauge',
                      splitNumber: 10,
                      axisLine: {
                        lineStyle: {
                          color: [
                            [0.2, '#2EC7C9'],
                            [0.8, '#5AB1EF'],
                            [1, '#D87A80']
                          ],
                          width: 8
                        }
                      },
                      axisTick: {
                        splitNumber: 10,
                        length: 12,
                        lineStyle: {
                          color: 'auto'
                        }
                      },
                      axisLabel: {
                        textStyle: {
                          color: 'auto'
                        }
                      },
                      splitLine: {
                        show: true,
                        length: 30,
                        lineStyle: {
                          color: 'auto'
                        }
                      },
                      pointer: {
                        width: 5
                      },
                      title: {
                        show: true,
                        textStyle: {
                          color: '#fff'
                        },
                        offsetCenter: [0, '-40%']
                      },
                      detail: {
                        formatter: '{value}%',
                        textStyle: {
                          color: 'auto'
                        }
                      },
                      data: data
                    }
                  ]
                }
                let chart = echarts.init(document.getElementById('gauge'))
                chart.setOption(options)
                window.addEventListener('resize', function () {
                  chart.resize()
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
        })
      } else {
        let params = {
          projectCode: this.$store.state.projectCode,
          month: this.month ? this.month : '01',
          build: this.building,
          year: this.year ? this.year : new Date().getFullYear(),
          mac: this.keyword
        }
        this.$nextTick(function () {
          last2mPowerStats(params)
            .then(res => {
              if (res.success) {
                let data = [
                  {
                    value:
                      res.data.number2 === 0 && res.data.number1 === 0
                        ? 0
                        : Math.abs(
                          (
                            (res.data.number2 / res.data.number1) *
                              100
                          ).toFixed(1)
                        )
                          ? Math.abs(
                            (
                              (res.data.number2 / res.data.number1) *
                              100
                            ).toFixed(1)
                          )
                          : 0,
                    name: that.$t('main.percentage')
                  }
                ]
                this.number2 = res.data.number2
                this.number3 = res.data.number3
                let options = {
                  title: {
                    text:
                      (this.building === ''
                        ? this.$store.state.projectName
                        : this.building) +
                      '\xa0\xa0' +
                      that.$t('echarts.totalProportion', {
                        year: this.year,
                        month: this.formatMonth[0].text
                      }),
                    x: 'center',
                    textStyle: {
                      fontSize: 13,
                      fontWeight: 'normal',
                      color: '#fff'
                    }
                  },
                  series: [
                    {
                      name: that.$t('main.percentage'),
                      type: 'gauge',
                      splitNumber: 10,
                      axisLine: {
                        lineStyle: {
                          color: [
                            [0.2, '#2EC7C9'],
                            [0.8, '#5AB1EF'],
                            [1, '#D87A80']
                          ],
                          width: 8
                        }
                      },
                      axisTick: {
                        splitNumber: 10,
                        length: 12,
                        lineStyle: {
                          color: 'auto'
                        }
                      },
                      axisLabel: {
                        textStyle: {
                          color: 'auto'
                        }
                      },
                      splitLine: {
                        show: true,
                        length: 30,
                        lineStyle: {
                          color: 'auto'
                        }
                      },
                      pointer: {
                        width: 5
                      },
                      title: {
                        show: true,
                        textStyle: {
                          color: '#fff'
                        },
                        offsetCenter: [0, '-40%']
                      },
                      detail: {
                        formatter: '{value}%',
                        textStyle: {
                          color: 'auto'
                        }
                      },
                      data: data
                    }
                  ]
                }
                let chart = echarts.init(document.getElementById('gauge'))
                chart.setOption(options)
                window.addEventListener('resize', function () {
                  chart.resize()
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
        })
      }
    },
    onSubmit () {
      let params = {
        pageNo: this.pageGroupNo,
        pageSize: this.pageGroupSize,
        year: this.formInline.value
          ? this.formInline.value
          : new Date().getFullYear(),
        month: this.formInline.region ? this.formInline.region : '01',
        projectCode: this.$store.state.projectCode
      }
      queryGroup(params)
        .then(res => {
          if (res.success) {
            this.groupData = res.datas
            this.groupTotal = res.total
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
    handleAddEdit (obj, val) {
      if (val) this.detailsFlag = true
      this.groupsForm.id = ''
      this.groupsForm.name = ''
      this.groupsForm.remark = ''
      this.dialogVisible = true
      if (obj.id) {
        this.groupsForm.id = obj.id
        this.groupsForm.name = obj.name
        this.groupsForm.remark = obj.remark
        this.name = obj.name
        this.groupId = obj.id
      }
    },
    handleDelGroup (id) {
      let params = {
        groupId: id
      }
      this.$confirm(
        this.$t('message.confirmDeleteGroup'),
        this.$t('dialog.prompt'),
        {
          confirmButtonText: this.$t('btns.ok'),
          cancelButtonText: this.$t('btns.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          delGroup(params)
            .then(res => {
              if (res.success) {
                this.onSubmit()
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
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('message.undelete')
          })
        })
    },
    handleDetails () {
      this.dialogVisible = false
      this.groupDialog = true
      this.handleViewGroup(this.name, this.groupId)
    },
    handleSceneCancel () {
      this.dialogVisible = false
      this.groupsForm.name = ''
      this.groupsForm.remark = ''
    },
    handleSceneSave () {
      if (this.groupsForm.name === '') {
        this.$message({
          message: this.$t('table.pleaseEnter') + this.$t('table.groupName'),
          type: 'error'
        })
        return false
      }
      let params = {
        name: this.groupsForm.name,
        remark: this.groupsForm.remark,
        groupId: this.groupsForm.id,
        projectCode: this.$store.state.projectCode
      }
      addrEditGroup(params)
        .then(res => {
          if (res.success) {
            this.handleSceneCancel()
            this.onSubmit()
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
    handleViewGroup (name, id) {
      this.groupDialog = true
      this.groupId = id
      this.groupName =
        this.$t('table.group_name') +
        '：' +
        '\xa0' +
        '"' +
        name +
        '"' +
        '\xa0\xa0' +
        this.$t('main.of') +
        this.$t('table.line') +
        ' ' +
        this.$t('echarts.electricityDetail')
      this.handleGroupChnlDetails()
    },
    initBuilding () {
      let that = this
      let params = {
        projectCode: this.$store.state.projectCode
      }
      this.$nextTick(function () {
        getBuildings(params)
          .then(res => {
            if (res.success) {
              that.buildings = [
                { text: this.$t('placeholder.all'), value: '' }
              ].concat(res.data)
              that.year = this.years[0].value
              that.month = String(
                new Date().getMonth() + 1 > 9
                  ? new Date().getMonth() + 1
                  : '0' + (new Date().getMonth() + 1)
              )
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
      })
    },
    queryPowerList () {
      this.currentPage = this.pageNo = 1
      this.queryList()
    },
    queryList () {
      if (this.firstCommand === 'custom') {
        if (
          this.$func.getDaysBetween(this.customValue[0], this.customValue[1]) >
          30
        ) {
          this.$message({
            message: this.$t('message.limitMonth'),
            type: 'error'
          })
          return false
        }
        this.loading = true
        let v = this.customValue[0]
        let i = this.customValue[1]
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          type: 'MAC',
          params: {
            projectCode: this.$store.state.projectCode,
            startTime: this.$func.formatDate('yyyy-MM-dd', v),
            endTime: this.$func.formatDate('yyyy-MM-dd', i),
            build: this.building,
            mac: this.keyword
          }
        }
        this.$nextTick(() => {
          queryTimeRangePowerOfProject(params)
            .then(res => {
              if (res.success) {
                let days = this.$func.getDaysBetween(v, i) + 1
                this.dayTime = {
                  startDate: this.$func.formatDate('yyyy-MM-dd', v),
                  endDate: this.$func.formatDate('yyyy-MM-dd', i),
                  preEndDate:
                    new Date(v - 24 * 60 * 60 * 1000).getFullYear() +
                    '-' +
                    (new Date(v - 24 * 60 * 60 * 1000).getMonth() + 1) +
                    '-' +
                    new Date(v - 24 * 60 * 60 * 1000).getDate(),
                  preStartDate:
                    new Date(v - days * 24 * 60 * 60 * 1000).getFullYear() +
                    '-' +
                    (new Date(v - days * 24 * 60 * 60 * 1000).getMonth() + 1) +
                    '-' +
                    new Date(v - days * 24 * 60 * 60 * 1000).getDate()
                }
                this.tableData = res.datas
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
              this.initGauge()
              this.queryPowerRange(this.dayTime.startDate, this.dayTime.endDate)
              this.loading = false
            })
        })
      } else {
        this.loading = true
        let params = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          type: 'MAC',
          params: {
            projectCode: this.$store.state.projectCode,
            month: this.month ? this.month : '01',
            build: this.building,
            year: this.year ? this.year : new Date().getFullYear(),
            mac: this.keyword
          }
        }
        this.$nextTick(function () {
          this.formatMonth = this.months.filter(item => {
            return item.value === this.month
          })
          this.preFormatMonth = this.months.filter(item => {
            return this.month === '01'
              ? item.value === '12'
              : Number(item.value) === Number(this.month) - 1
          })
          queryPower(params)
            .then(res => {
              if (res.success) {
                this.tableData = res.datas
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
              this.initGauge()
              this.loading = false
            })
        })
      }
    },
    queryPowerRange (startTime, endTime) {
      let params = {
        projectCode: this.$store.state.projectCode,
        startTime: startTime,
        endTime: endTime,
        build: this.building,
        mac: this.keyword
      }
      statsPowerByTimeRange(params)
        .then(res => {
          if (res.success) {
            this.cycleData = res.data
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
    linePowerDetail (build, unit, room, mac) {
      this.mac = mac
      this.powerDialog = true
      if (build) {
        unit = ',' + unit
      }
      if (unit) {
        room = ',' + room
      }
      this.addr =
        '【' +
        build +
        unit +
        room +
        '】' +
        this.$t('main.of') +
        this.$t('table.line') +
        ' ' +
        this.$t('echarts.electricityDetail')
      this.initPowerDetail()
    },
    initPowerDetail () {
      this.$nextTick(function () {
        this.detailLoading = true
        this.powerData = []
        let params = {
          page: 1,
          limit: 10,
          dateType: this.dateType,
          date: this.date
            ? this.date
            : this.$func.formatDate('yyyy-MM-dd HH', new Date()),
          projectCode: this.$store.state.projectCode,
          mac: this.mac
        }
        chnlPowerStatsOfBox(params)
          .then(res => {
            if (res.success) {
              this.powerData = res.data
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
            this.detailLoading = false
          })
      })
    },
    initCharts () {
      this.optionsFirst.series = []
      this.optionsFirst.xAxis = []
      this.optionsSecond.series = []
      this.optionsSecond.xAxis = []
      let params = {
        projectCode: this.$store.state.projectCode
      }
      let that = this
      this.$nextTick(function () {
        last2yPowerStats(params)
          .then(res => {
            if (res.success) {
              let year = [
                new Date().getFullYear() - 1,
                new Date().getFullYear()
              ]
              let month = new Date().getMonth() + 1
              let bardata = { lastyear: [], thisyear: [] }
              let bardata2 = { value: [0, 0] }
              let value = 0
              let linedata = { value: [] }
              this.optionsFirst.legend = year
              this.optionsFirst.xAxis = [
                that.$t('echarts.January'),
                that.$t('echarts.February'),
                that.$t('echarts.March'),
                that.$t('echarts.April'),
                that.$t('echarts.May'),
                that.$t('echarts.June'),
                that.$t('echarts.July'),
                that.$t('echarts.August'),
                that.$t('echarts.September'),
                that.$t('echarts.October'),
                that.$t('echarts.November'),
                that.$t('echarts.December')
              ]
              this.optionsSecond.xAxis = this.optionsFirst.xAxis.slice(0, month)
              res.data.forEach(function (v, i) {
                bardata.lastyear[i] = v.number1
                bardata.thisyear[i] = v.number2
                linedata.value[i] =
                  v.number2 === '-'
                    ? '-'
                    : v.number1 === 0
                      ? v.number2 === 0
                        ? 0
                        : '0'
                      : ((v.number2 - v.number1) / v.number1).toFixed(1)
                if (i < month) {
                  bardata2.value[0] += v.number2 === '-' ? 0 : v.number2
                  bardata2.value[1] += v.number1
                }
              })
              bardata2.value[0] =
                bardata2.value[0] !== 0
                  ? parseFloat(bardata2.value[0].toFixed(1))
                  : 0
              bardata2.value[1] =
                bardata2.value[1] !== 0
                  ? parseFloat(bardata2.value[1].toFixed(1))
                  : 0
              if (bardata2.value[1] === 0) {
                value = bardata2.value[0].toFixed(1)
                this.optionsThird.title.text =
                  this.$t('echarts.electricityConsumptionComparedToLastYear') +
                  '1-' +
                  month +
                  this.$t('echarts.monthlyMore') +
                  value +
                  this.$t('echarts.celsius')
              } else {
                value = Math.abs(
                  (
                    ((bardata2.value[0] - bardata2.value[1]) /
                      bardata2.value[1]) *
                    100
                  ).toFixed(1)
                )
                if (month <= 1) {
                  if (bardata2.value[0] - bardata2.value[1] < 0) {
                    this.optionsThird.title.text =
                      this.$t(
                        'echarts.electricityConsumptionComparedToLastYear'
                      ) +
                      '1' +
                      this.$t('echarts.monthlySavings') +
                      value +
                      '%'
                  } else if (bardata2.value[0] - bardata2.value[1] > 0) {
                    this.optionsThird.title.text =
                      this.$t(
                        'echarts.electricityConsumptionComparedToLastYear'
                      ) +
                      '1' +
                      this.$t('echarts.monthlyExceeded') +
                      value +
                      '%'
                  } else {
                    this.optionsThird.title.text =
                      this.$t(
                        'echarts.electricityConsumptionComparedToLastYear'
                      ) +
                      '1' +
                      this.$t('echarts.monthlyFlat')
                  }
                } else {
                  if (bardata2.value[0] - bardata2.value[1] < 0) {
                    this.optionsThird.title.text =
                      this.$t(
                        'echarts.electricityConsumptionComparedToLastYear'
                      ) +
                      '1-' +
                      month +
                      this.$t('echarts.monthlySavings') +
                      value +
                      '%'
                  } else if (bardata2.value[0] - bardata2.value[1] > 0) {
                    this.optionsThird.title.text =
                      this.$t(
                        'echarts.electricityConsumptionComparedToLastYear'
                      ) +
                      '1-' +
                      month +
                      this.$t('echarts.monthlyExceeded') +
                      value +
                      '%'
                  } else {
                    this.optionsThird.title.text =
                      this.$t(
                        'echarts.electricityConsumptionComparedToLastYear'
                      ) +
                      '1-' +
                      month +
                      this.$t('echarts.monthlyFlat')
                  }
                }
              }
              this.optionsThird.xAxis.max =
                bardata2.value[0] > bardata2.value[1]
                  ? bardata2.value[0] * 1.2
                  : bardata2.value[1] * 1.2
              this.optionsFirst.series.push({
                name: year[0],
                type: 'bar',
                barMaxWidth: '30',
                data: bardata.lastyear,
                itemStyle: {
                  emphasis: { barBorderRadius: 4 },
                  normal: { color: '#08BEC1', barBorderRadius: 4 }
                }
              })
              this.optionsFirst.series.push({
                name: year[1],
                type: 'bar',
                barMaxWidth: '30',
                data: bardata.thisyear,
                itemStyle: {
                  emphasis: { barBorderRadius: 4 },
                  normal: { color: '#B8A5DD', barBorderRadius: 4 }
                }
              })
              this.optionsSecond.series.push({
                name: this.$t('menu.electricity') + this.$t('home.YearOnYear'),
                type: 'line',
                smooth: true,
                data: linedata.value,
                itemStyle: { normal: { color: '#B8A5DD' } },
                symbol: 'emptyCircle'
              })
              this.optionsThird.series = {
                type: 'bar',
                barMaxWidth: 10,
                data: bardata2.value,
                itemStyle: {
                  emphasis: { barBorderRadius: 4 },
                  normal: {
                    color: '#08BEC1',
                    barBorderRadius: 4,
                    label: {
                      show: true,
                      position: 'right',
                      textStyle: { color: '#fff' }
                    }
                  }
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
      })
    },
    handleGroupChnlDetails () {
      this.$nextTick(function () {
        this.detailLoading = true
        this.groupLineData = []
        let params = {
          dateType: this.dateType,
          date: this.date
            ? this.date
            : this.$func.formatDate('yyyy-MM-dd HH', new Date()),
          groupId: this.groupId
        }
        chnlDetails(params)
          .then(res => {
            if (res.success) {
              // console.log(res, '=====res')
              this.groupLineData = res.data
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
            this.detailLoading = false
          })
      })
    },
    handleHourPicker (val) {
      this.dateType = 3
      this.date = val
      this.handleGroupChnlDetails()
    },
    handlePowerHourPicker (val) {
      this.dateType = 3
      this.date = val
      this.initPowerDetail()
    },
    handlePowerDayPicker (val) {
      this.dateType = 1
      this.date = val
      this.initPowerDetail()
    },
    handleGroupDayPicker (val) {
      this.dateType = 1
      this.date = val
      this.handleGroupChnlDetails()
    },
    handlePowerMonthPicker (val) {
      this.dateType = 2
      this.date = val
      this.initPowerDetail()
    },
    handleGroupMonthPicker (val) {
      this.dateType = 2
      this.date = val
      this.handleGroupChnlDetails()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.queryList()
    },
    handleGroupChange (val) {
      this.pageGroupSize = val
      this.onSubmit()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.queryList()
    },
    handleGroupCurrentChange (val) {
      this.pageGroupNo = val
      this.onSubmit()
    },
    handleClick (tab, event) {
      if (tab.name === 'first') {
        this.gauge = true
        this.powerHeight = this.powerTableHeight
        if (this.firstCommand === 'custom') {
          this.customValue = this.customValue
            ? this.customValue
            : [
              new Date(new Date().getFullYear(), new Date().getMonth(), 1),
              new Date()
            ]
        }
      }
      if (tab.name === 'second') {
        this.initCharts()
        this.gauge = false
        this.first = true
      }
      if (tab.name === 'third') {
        this.powerHeight = null
        this.gauge = false
        this.first = false
        this.formInline.value = this.years[0].value
        this.formInline.region = String(
          new Date().getMonth() + 1 > 9
            ? new Date().getMonth() + 1
            : '0' + (new Date().getMonth() + 1)
        )
        this.onSubmit()
      }
    },
    handleMonthCommand (command) {
      this.activeName = 'first'
      this.firstCommand = command
      this.gauge = true
      this.powerHeight = this.powerTableHeight
      if (command === 'natural') {
        this.firstName = this.$t('echarts.electricityConsumptionPerHousehold')
      } else if (command === 'custom') {
        this.firstName =
          this.$t('echarts.electricityConsumptionPerHousehold') +
          '(' +
          this.$t('echarts.customMonth') +
          ')'
        this.customValue = this.customValue
          ? this.customValue
          : [
            new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            new Date()
          ]
      }
      this.queryList()
    },
    handleCommand (command) {
      if (command === 'exportAll') {
        this.$func.windowCountDown(
          ctxPaths +
            '/project/main/v2/xls/powerStats.as?projectCode=' +
            this.$store.state.projectCode +
            '&mac=' +
            this.keyword +
            '&build=' +
            this.building +
            '&year=' +
            this.year +
            '&month=' +
            this.month +
            '&projectName=' +
            this.$store.state.projectName +
            '&currentPage=0'
        )
      } else if (command === 'exportCurrent') {
        this.$func.windowCountDown(
          ctxPaths +
            '/project/main/v2/xls/powerStats.as?projectCode=' +
            this.$store.state.projectCode +
            '&mac=' +
            this.keyword +
            '&build=' +
            this.building +
            '&year=' +
            this.year +
            '&month=' +
            this.month +
            '&projectName=' +
            this.$store.state.projectName +
            '&currentPage=' +
            this.pageNo +
            '&pageSize=' +
            this.tableData.length
        )
      }
    },
    handlePowerExport () {
      this.date = this.date
        ? this.date
        : this.$func.formatDate('yyyy-MM-dd HH', new Date())
      this.$func.windowCountDown(
        ctxPaths +
          '/project/main/v2/xls/powerStatsDetail.as?projectCode=' +
          this.$store.state.projectCode +
          '&mac=' +
          this.mac +
          '&oqp1=' +
          this.$store.state.projectName +
          '&dateType=' +
          this.dateType +
          '&date=' +
          this.date
      )
    },
    handleGroupExport () {
      this.date = this.date
        ? this.date
        : this.$func.formatDate('yyyy-MM-dd HH', new Date())
      this.$func.windowCountDown(
        ctxPaths +
          '/stats-group/export/chnlDetails.as?projectCode=' +
          this.$store.state.projectCode +
          '&groupId=' +
          this.groupId +
          '&oqp1=' +
          this.$store.state.projectName +
          '&dateType=' +
          this.dateType +
          '&date=' +
          this.date
      )
    },
    handleExport (command) {
      if (command === 'current') {
        this.$func.windowCountDown(
          ctxPaths +
            '/stats-group/export.as?projectCode=' +
            this.$store.state.projectCode +
            '&year=' +
            this.formInline.value +
            '&month=' +
            this.formInline.region +
            '&pageSize=' +
            this.pageGroupSize +
            '&pageNo=' +
            this.pageGroupNo
        )
      }
      if (command === 'all') {
        this.$func.windowCountDown(
          ctxPaths +
            '/stats-group/export.as?projectCode=' +
            this.$store.state.projectCode +
            '&year=' +
            this.formInline.value +
            '&month=' +
            this.formInline.region +
            '&pageSize=' +
            this.pageGroupSize +
            '&pageNo=' +
            this.pageGroupNo +
            '&exportType=exportAll'
        )
      }
    },
    handleDatePicker (val) {
      if (val === 'day') {
        this.dateType = 1
        this.date = this.powerDay
      } else if (val === 'month') {
        this.dateType = 2
        this.date = this.powerMonth
      } else if (val === 'hour') {
        this.dateType = 3
        this.date = this.powerHour
      }
      this.datePicker = val
      this.initPowerDetail()
    },
    handleDateLinePicker (val) {
      if (val === 'day') {
        this.dateType = 1
        this.date = this.groupDay
      } else if (val === 'month') {
        this.dateType = 2
        this.date = this.groupMonth
      } else if (val === 'hour') {
        this.dateType = 3
        this.date = this.groupHour
      }
      this.datePicker = val
      this.handleGroupChnlDetails()
    },
    handleCloseAddr () {
      this.datePicker = 'hour'
      this.dateType = 3
      this.powerHour = this.$func.formatDate('yyyy-MM-dd HH', new Date())
      this.powerDay = this.$func.getNowFormatDate()
      this.powerMonth = this.$func.getCurrentYearMonth()
      this.date = this.powerHour
    },
    handleCloseGroup () {
      this.datePicker = 'hour'
      this.dateType = 3
      this.groupHour = this.$func.formatDate('yyyy-MM-dd HH', new Date())
      this.groupDay = this.$func.getNowFormatDate()
      this.groupMonth = this.$func.getCurrentYearMonth()
      this.date = this.groupHour
    },
    handleCloseRange () {
      this.rangeExportForm.value = []
    },
    handleExportRangeOpen () {
      this.exportRangeFlag = true
      this.rangeExportForm.value = this.customValue
    },
    handleExportRange (val) {
      if (
        new Date(this.rangeExportForm.value[0]).getTime() >=
          new Date(this.$func.getNowFormatDate()).getTime() ||
        new Date(this.rangeExportForm.value[1]).getTime() >=
          new Date(this.$func.getNowFormatDate()).getTime()
      ) {
        this.$message({
          message: this.$t('message.rangeLimitation'),
          type: 'error'
        })
        return false
      }
      if (
        this.$func.checkDateOneMonth(
          this.rangeExportForm.value[0],
          this.rangeExportForm.value[1]
        ) === 'true'
      ) {
        this.$func.windowCountDown(
          ctxPaths +
            '/project/main/v3/xls/powerDetailByTimeRange.as?projectCode=' +
            this.$store.state.projectCode +
            '&mac=' +
            this.keyword +
            '&build=' +
            this.building +
            '&oqp1=' +
            this.$func.formatDate('yyyy-MM-dd', this.rangeExportForm.value[0]) +
            '&oqp2=' +
            this.$func.formatDate('yyyy-MM-dd', this.rangeExportForm.value[1]) +
            '&dateType=' +
            `${val === 'hour' ? 3 : 1}`
        )
      } else {
        this.$message({
          message: this.$t('message.exportRange'),
          type: 'error'
        })
      }
    },
    handleSelectDevice () {
      this.addDeviceVisible = true
      this.querySelectDevice()
    },
    handleSizeLineChange (val) {
      this.pageLineSize = val
      this.querySelectDevice()
    },
    handleCurrentLineChange (val) {
      this.currentLinePage = val
      this.querySelectDevice()
    },
    handleQuery () {
      this.currentLinePage = 1
      this.querySelectDevice()
    },
    querySelectDevice () {
      let params = {
        projectCode: this.$store.state.projectCode,
        key: this.ruleForm.mac,
        pageNo: this.currentLinePage,
        pageSize: this.pageLineSize
      }
      pageBoxsSelect(params)
        .then(res => {
          if (res.success) {
            this.macLineData = res.datas
            this.lineTotal = res.total
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
    handleClose () {
      this.addDeviceVisible = false
      this.ruleForm.mac = ''
    },
    handleLine (mac) {
      this.addrData = []
      this.addrMac = mac
      this.lineListVisible = true
      queryChnlSelect({ mac })
        .then(res => {
          if (res.success) {
            if (res.data) {
              this.addrData = res.data
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
    handleCheckedCitiesChange (val) {
      this.addrList = []
      if (val.length === 0) return
      if (val[0].gatherAddr === '-1') {
        for (let j = 0; j < val.length; j++) {
          for (let i = 0; i < this.addrData.length; i++) {
            if (this.addrData[i].gatherAddr === val[j].addr.toString()) {
              this.$refs[`disable-${this.addrData[i].title}`][0].disabled = true
            }
          }
        }
      } else {
        for (let j = 0; j < val.length; j++) {
          for (let i = 0; i < this.addrData.length; i++) {
            if (this.addrData[i].addr.toString() === val[j].gatherAddr) {
              this.$refs[`disable-${this.addrData[i].title}`][0].disabled = true
            }
          }
        }
      }
      if (val.length > 1) {
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < this.addrData.length; j++) {
            if (
              this.addrData[j].addr.toString() === val[i].gatherAddr ||
              val[i].addr.toString() === this.addrData[j].gatherAddr
            ) {
              this.$refs[`disable-${this.addrData[j].title}`][0].disabled = true
            }
          }
        }
      }
      val.forEach(v => {
        this.addrList.push(v.addr)
      })
    },
    handleAddrSave () {
      if (this.addrList.length === 0) return
      let params = {
        groupId: this.groupId,
        mac: this.addrMac,
        addrs: this.addrList.toString()
      }
      saveDetail(params)
        .then(res => {
          if (res.success) {
            this.checkedClose()
            this.addDeviceVisible = false
            this.handleGroupChnlDetails()
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
    handleDelGroupLine (id) {
      let params = {
        groupDetailId: id
      }
      delDetail(params)
        .then(res => {
          if (res.success) {
            this.handleGroupChnlDetails()
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
    checkedClose () {
      this.lineListVisible = false
      this.checkedAddr = []
      this.addrList = []
    }
  },
  watch: {
    '$store.state.projectCode': {
      handler (newVal, oleVal) {
        if (newVal) {
          this.init()
        }
      }
    },
    '$store.state.powerTableHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.powerTableHeight.height = newVal
        }
      }
    }
  },
  components: {
    BarCharts,
    LineCharts
  }
}
</script>
<style lang="stylus" scoped>
#gauge
  width 100%
  height 325px
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
  .el-button
    color #409EFF !important
.contrast-wrap
  height 325px
.the-month, .last-month, .contrast
  line-height 26px
  text-align end
  margin-right 60px
.the-month
  margin-top 25%
  color #2EC7C9
.last-month
  color #5AB1EF
.contrast
  color #B8A5DD
#power-form .el-form >>> .el-input__inner
  width 140px
.en-form-input >>> .el-input__inner
  width 90px !important
.build >>> .el-input__inner
  width 90px !important
.year, .month
  >>> .el-input__inner
        width 80px !important
.el-form .el-form-item >>> .el-form-item__label
  color #fff
.el-dialog__wrapper >>> .el-dialog
    background #1b2250
.el-dialog__wrapper >>> .el-dialog__title,.el-dialog__wrapper >>> .el-dialog__close
    color #fff
.pickDate
    margin-bottom 20px
.el-tabs >>> .el-tabs__item
    color #fff
.el-table >>> .el-table__body-wrapper
    overflow-y hidden
    overflow-x hidden
.el-tabs >>> .el-tabs__content
    padding-bottom 32px
.export-btns
    padding 0 10px
    color #fff
    .icon-export
      font-size 22px
.el-dialog__wrapper
  >>>.el-dialog.export-range
    background #fff
.el-dialog__wrapper >>> .export-range
  .el-dialog__title, .el-dialog__close, .el-form-item__label
    color #303133
  .el-date-editor.el-input__inner
    width 350px
#power >>>  .custom-dialog
              .el-dialog__body
                height 70vh
.block .export
  font-size 20px
  color #fff
  line-height 32px
</style>
