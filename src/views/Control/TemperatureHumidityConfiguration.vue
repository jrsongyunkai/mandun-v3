<template>
    <div id="TemperatureHumidityConfiguration">
      <el-row :gutter="20" style="margin: 0; padding:20px">
        <el-col :span="7" class="mb-20">
          <div class="ellipsis">
            <span class="label" :class="$i18n.locale === 'zh' ? 'normal-label' : ''">{{ $t('dialog.deviceNo') + '：' }}</span>
            <span :title="temperatureHumList.mac">{{ temperatureHumList.mac }}</span>
          </div>
        </el-col>
        <el-col :span="7" class="mb-20">
          <div>
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              v-model="aliasFlag"
              :append-to-body="false"
              @hide="temperatureHumList.name = $store.state.aliasName">
                <el-input size="small" maxlength="20" show-word-limit v-model.trim="temperatureHumList.name" :placeholder="$t('table.pleaseEnter') + $t('dialog.deviceAlias')"></el-input>
                <div style="text-align: right; margin: 5px 0 0">
                  <el-button type="primary" size="mini" @click="handleAlias(temperatureHumList.mac, temperatureHumList.name)">{{ $t('btns.ok') }}</el-button>
                  <el-button size="mini" type="plain" @click="TemperatureHumList.name = $store.state.aliasName;aliasFlag = false">{{ $t('btns.cancel') }}</el-button>
                </div>
                <div slot="reference" @mouseover="aliasIndex = temperatureHumList.mac" @mouseout="aliasIndex = -1" class="pointer pRelative">
                  <div class="ellipsis" :class="aliasFlag ? 'dashed' : ''" :title="temperatureHumList.name">
                    <span class="label" :class="$i18n.locale === 'zh' ? 'normal-label' : ''">{{ $t('dialog.deviceAlias') + '：' }}</span>
                    <span>{{ temperatureHumList.name }}</span>
                  </div>
                  <i slot="reference" v-if="permission === 'true' && aliasIndex === temperatureHumList.mac" class="el-icon-edit pointer" :class="$i18n.locale === 'zh' ? 'normal-icon' : 'unusual-icon'"></i>
                </div>
            </el-popover>
          </div>
        </el-col>
        <el-col :span="10" class="mb-20">
          <el-col :span="12">
            <div>
              <el-popover
                placement="top"
                width="250"
                trigger="click"
                :append-to-body="false"
                v-model="buildFlag"
                @hide="temperatureHumList.build = $store.state.sortBUR.build">
                  <el-input size="small" maxlength="20" show-word-limit v-model.trim="temperatureHumList.build" :placeholder="$t('table.pleaseEnter') + $t('control.building')"></el-input>
                  <div style="text-align: right; margin: 5px 0 0">
                    <el-button type="primary" size="mini" @click="handleSort(temperatureHumList.mac, temperatureHumList.build, temperatureHumList.unit, temperatureHumList.room, 'build')">{{ $t('btns.ok') }}</el-button>
                    <el-button size="mini" type="plain" @click="temperatureHumList.build = $store.state.sortBUR.build;buildFlag = false">{{ $t('btns.cancel') }}</el-button>
                  </div>
                  <div slot="reference" @mouseover="buildIndex = temperatureHumList.build" @mouseout="buildIndex = -1" class="pointer pRelative">
                    <div class="ellipsis" :class="buildFlag ? 'dashed' : ''" :title="temperatureHumList.build">
                      <span class="label" :class="$i18n.locale === 'zh' ? 'normal-label' : ''">{{ $t('table.position') + '：' }}</span>
                      <span>{{ temperatureHumList.build }}</span>
                    </div>
                    <i slot="reference" v-if="permission === 'true' && (buildIndex === temperatureHumList.build || this.$func.checkDataType(temperatureHumList.build))" class="el-icon-edit pointer" :class="$i18n.locale === 'zh' ? 'normal-icon' : 'unusual-icon'"></i>
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
                @hide="temperatureHumList.unit = $store.state.sortBUR.unit">
                  <el-input size="small" maxlength="20" show-word-limit v-model.trim="temperatureHumList.unit" :placeholder="$t('table.pleaseEnter') + $t('control.unit')"></el-input>
                  <div style="text-align: right; margin: 5px 0 0">
                    <el-button type="primary" size="mini" @click="handleSort(temperatureHumList.mac, temperatureHumList.build, temperatureHumList.unit, temperatureHumList.room, 'unit')">{{ $t('btns.ok') }}</el-button>
                    <el-button size="mini" type="plain" @click="temperatureHumList.unit = $store.state.sortBUR.unit;unitFlag = false">{{ $t('btns.cancel') }}</el-button>
                  </div>
                  <div slot="reference" @mouseover="unitIndex = temperatureHumList.unit" @mouseout="unitIndex = -1" class="pointer pRelative">
                    <div class="ellipsis" :class="unitFlag ? 'dashed' : ''" :title="temperatureHumList.unit">
                      <span>{{ temperatureHumList.unit }}</span>
                    </div>
                    <i slot="reference" v-if="permission === 'true' && (unitIndex === temperatureHumList.unit || $func.checkDataType(temperatureHumList.unit))" class="el-icon-edit pointer unit-icon"></i>
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
                @hide="temperatureHumList.room = $store.state.sortBUR.room">
                  <el-input size="small" maxlength="20" show-word-limit v-model.trim="temperatureHumList.room" :placeholder="$t('table.pleaseEnter') + $t('control.room')"></el-input>
                  <div style="text-align: right; margin: 5px 0 0">
                    <el-button type="primary" size="mini" @click="handleSort(temperatureHumList.mac, temperatureHumList.build, temperatureHumList.unit, temperatureHumList.room, 'room')">{{ $t('btns.ok') }}</el-button>
                    <el-button size="mini" type="plain" @click="temperatureHumList.room = $store.state.sortBUR.room;roomFlag = false">{{ $t('btns.cancel') }}</el-button>
                  </div>
                  <div slot="reference" @mouseover="roomIndex = temperatureHumList.room" @mouseout="roomIndex = -1" class="pointer pRelative">
                    <div class="ellipsis" :class="roomFlag ? 'dashed' : ''" :title="temperatureHumList.room">
                      <span>{{ temperatureHumList.room }}</span>
                    </div>
                    <i slot="reference" v-if="permission === 'true' && (roomIndex === temperatureHumList.room || $func.checkDataType(temperatureHumList.room))" class="el-icon-edit pointer unit-icon"></i>
                  </div>
              </el-popover>
            </div>
          </el-col>
        </el-col>
        <el-col :span="24">
        <span class="fs-14">{{ $t('dialog.alarmThresholdSetting') + '：' }}</span>
        <i class="el-icon-refresh" :style="{ fontSize: '18px', color: '#fff' }" ref="refBtn"></i>
        <el-button
          type="text"
          ref="refreshBtn"
          class="c-default"
          style="fontSize: 14px;"
          @click="handleTemperatureHumList(temperatureHumList.mac, temperatureHumList.name)"
          :disabled="disabledFlag"
        >{{ '\xa0' + $t('btns.refresh')}}</el-button>
          <el-table :data="TemHumList" class="fs-12" @cell-click="handleCell">
            <el-table-column
              prop="nodeName"
              align="center"
              :label="$t('table.nodeName')">
            </el-table-column>
            <el-table-column
              align="center"
              prop="nodeEnable"
              :label="$t('table.nodeEnable')">
              <template slot-scope="scope">
                <el-select v-model="scope.row.alarmEnable" class="w100" size="mini" @change="handleOpenClose(scope.row)">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column
              prop="temUpper"
              align="center"
              :label="equipmentNum === 11 ? $t('dialog.temperatureLimit') + '(℃)' : $t('echarts.illumination') + $t('echarts.celsius') + $t('control.upperLimit') + '(Lux)'">
              <template slot-scope="scope">
                <el-popover
                  v-if="index === `temUpper-popover-${scope.$index}`"
                  placement="top"
                  width="250"
                  :ref="`temUpper-popover-${scope.$index}`"
                  trigger="click">
                  <el-input size="small" :maxlength="20" show-word-limit v-model="variable" :onkeyup="variable = variable.replace(/[^0-9\\.]/g,'')" :placeholder="$t('placeholder.content')"></el-input>
                  <div class="tr mt-5">
                    <el-button type="primary" :disabled="disabledRefresh" size="mini" @click="handleNodeAttr(temperatureHumList.mac, scope.row, 'temUpper')">{{ $t('btns.ok') }}</el-button>
                    <el-button size="mini" type="plain" @click="handleClosePopover">{{ $t('btns.cancel') }}</el-button>
                  </div>
                  <span slot="reference" class="pointer">{{ scope.row.temUpper ? scope.row.temUpper : '-' }}</span>
                </el-popover>
                <div class="pointer" v-else>
                  {{ scope.row.temUpper ? scope.row.temUpper : '-' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="temLower"
              align="center"
              :label="equipmentNum === 11 ? $t('dialog.temperatureLowerLimit') + '(℃)' : $t('echarts.illumination') + $t('echarts.celsius') + this.$t('control.lowerLimit') + '(Lux)'">
              <template slot-scope="scope">
                <el-popover
                  v-if="index === `temLower-popover-${scope.$index}`"
                  placement="top"
                  width="250"
                  :ref="`temLower-popover-${scope.$index}`"
                  trigger="click">
                  <el-input size="small" :maxlength="20" show-word-limit v-model="variable" :onkeyup="variable = variable.replace(/[^0-9\\.]/g,'')" :placeholder="$t('placeholder.content')"></el-input>
                  <div class="tr mt-5">
                    <el-button type="primary" size="mini" :disabled="disabledRefresh" @click="handleNodeAttr(temperatureHumList.mac, scope.row, 'temLower')">{{ $t('btns.ok') }}</el-button>
                    <el-button size="mini" type="plain" @click="handleClosePopover">{{ $t('btns.cancel') }}</el-button>
                  </div>
                  <span slot="reference" class="pointer">{{ scope.row.temLower ? scope.row.temLower : '-' }}</span>
                </el-popover>
                <div class="pointer" v-else>
                  {{ scope.row.temLower ? scope.row.temLower : '-' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="equipmentNum === 11"
              prop="humUpper"
              align="center"
              :label="$t('menu.humidity') + $t('control.upperLimit') + '(%RH)'">
              <template slot-scope="scope">
                <el-popover
                  v-if="index === `humUpper-popover-${scope.$index}`"
                  placement="top"
                  width="250"
                  :ref="`humUpper-popover-${scope.$index}`"
                  trigger="click">
                  <el-input size="small" :maxlength="20" show-word-limit v-model="variable" :onkeyup="variable = variable.replace(/[^0-9\\.]/g,'')" :placeholder="$t('placeholder.content')"></el-input>
                  <div class="tr mt-5">
                    <el-button type="primary" size="mini" :disabled="disabledRefresh" @click="handleNodeAttr(temperatureHumList.mac, scope.row, 'humUpper')">{{ $t('btns.ok') }}</el-button>
                    <el-button size="mini" type="plain" @click="handleClosePopover">{{ $t('btns.cancel') }}</el-button>
                  </div>
                  <span slot="reference" class="pointer">{{ scope.row.humUpper ? scope.row.humUpper : '-' }}</span>
                </el-popover>
                <div class="pointer" v-else>
                  {{ scope.row.humUpper ? scope.row.humUpper : '-' }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              v-if="equipmentNum === 11"
              prop="humLower"
              align="center"
              :label="$t('menu.humidity') + $t('control.lowerLimit') + '(%RH)'">
              <template slot-scope="scope">
                <el-popover
                  v-if="index === `humLower-popover-${scope.$index}`"
                  placement="top"
                  width="250"
                  :ref="`humLower-popover-${scope.$index}`"
                  trigger="click">
                  <el-input size="small" :maxlength="20" show-word-limit :onkeyup="variable = variable.replace(/[^0-9\\.]/g,'')" v-model="variable" :placeholder="$t('placeholder.content')"></el-input>
                  <div class="tr mt-5">
                    <el-button type="primary" size="mini" :disabled="disabledRefresh" @click="handleNodeAttr(temperatureHumList.mac, scope.row, 'humLower')">{{ $t('btns.ok') }}</el-button>
                    <el-button size="mini" type="plain" @click="handleClosePopover">{{ $t('btns.cancel') }}</el-button>
                  </div>
                  <span slot="reference" class="pointer">{{ scope.row.humLower ? scope.row.humLower : '-' }}</span>
                </el-popover>
                <div class="pointer" v-else>
                  {{ scope.row.humLower ? scope.row.humLower : '-' }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
</template>

<script>
/* global config */
import store from '@/store'
import { queryParamByMac, macAlias, updateParam, refreshParam, updateAlarmEnable } from '@/api/api'
export default {
  components: {},
  props: {
    online: {
      type: Number
    },
    equipmentNum: {
      type: Number
    }
  },
  data () {
    return {
      temperatureHumList: {
        mac: this.$store.state.mac,
        name: this.$store.state.aliasName,
        build: this.$store.state.sortBUR.build,
        unit: this.$store.state.sortBUR.unit,
        room: this.$store.state.sortBUR.room
      },
      disabledRefresh: false,
      disabledFlag: false,
      aliasFlag: false,
      aliasIndex: -1,
      buildFlag: false,
      buildIndex: -1,
      unitFlag: false,
      unitIndex: -1,
      roomFlag: false,
      roomIndex: -1,
      index: 0,
      variable: '',
      TemHumList: [],
      TemHumName: '',
      permission: config.authority.BOX_ATTR_MODIFY,
      options: [
        {
          value: true,
          label: this.$t('dialog.open')
        },
        {
          value: false,
          label: this.$t('dialog.close')
        }
      ]
    }
  },
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.queryTemHumList()
      this.handleTemperatureHumList()
    },
    queryTemHumList () {
      let params = {
        mac: this.temperatureHumList.mac
      }
      queryParamByMac(params)
        .then(res => {
          if (res.success) {
            res.data.map((item, index) => {
              item.index = index
            })
            this.TemHumList = res.data
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
    handlerefresh () {
      this.disabledRefresh = true
      let parmas = {
        mac: this.temperatureHumList.mac
      }
      refreshParam(parmas)
        .then(res => {
          if (res.success) {
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
    handleCell (row, column, cell, event) {
      if (column.property === 'nodeName' || column.property === 'nodeEnable') return false
      this.index = `${column.property}-popover-${row.index}`
      this.variable = row[column.property]
      this.$nextTick(() => {
        if (this.index !== 0) this.$refs[this.index].doShow()
      })
    },
    handleClosePopover () {
      this.$nextTick(() => {
        this.index = 0
        this.variable = ''
      })
    },
    handleTemperatureHumList (mac, name) {
      this.handlerefresh()
      this.$refs.refBtn.className = 'el-icon-refresh iconfont-loading'
      this.$refs.refreshBtn.className = 'iconfont-grey'
      this.disabledFlag = true
      let timer = setTimeout(() => {
        this.$refs.refBtn.className = 'el-icon-refresh'
        this.disabledFlag = false
        this.$refs.refreshBtn.className = 'c-default'
        if (this.variable.length > 0) this.disabledRefresh = false
        this.queryTemHumList()
        clearTimeout(timer)
      }, 5000)
    },
    handleOpenClose (row) {
      let params = {
        mac: this.temperatureHumList.mac,
        alarmEnable: row.alarmEnable ? 'open' : 'false',
        nodeId: row.nodeId
      }
      updateAlarmEnable(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
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
            this.temperatureHumList.name = name
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
    handleSort (mac, build, unit, room, type) {
      let params = {
        mac: mac
      }
      if (type === 'build') {
        params.build = build
      } else if (type === 'unit') {
        params.unit = unit
      } else if (type === 'room') {
        params.room = room
      }
      macAlias(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('message.successfulModified') + '！',
              type: 'success'
            })
            store.commit('sortBUR', {build: this.temperatureHumList.build, unit: this.temperatureHumList.unit, room: this.temperatureHumList.room})
            if (type === 'build') {
              this.buildFlag = false
              this.buildIndex = -1
              this.temperatureHumList.build = build
            } else if (type === 'unit') {
              this.unitFlag = false
              this.unitIndex = -1
              this.temperatureHumList.unit = unit
            } else if (type === 'room') {
              this.roomFlag = false
              this.roomIndex = -1
              this.temperatureHumList.room = room
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
    handleNodeAttr (mac, row, val) {
      if (this.online === 0) {
        this.$message({
          message: this.$t('message.deviceOnline', [`${mac}`]) + '！',
          type: 'error'
        })
        return
      }
      if (val === 'temUpper') {
        if (this.equipmentNum === 14 && this.variable > 200000) {
          this.$message({
            message: this.$t('message.upperLimitMax') + '！',
            type: 'error'
          })
          return
        } else if (this.equipmentNum === 11 && this.variable > 80) {
          this.$message({
            message: this.$t('message.temUpperMax') + '！',
            type: 'error'
          })
          return
        }
        if (this.variable <= row.temLower) {
          this.$message({
            message: this.$t('message.upperLimitLower') + '！',
            type: 'error'
          })
          return
        }
      } else if (val === 'temLower') {
        if (this.variable < -40) {
          this.$message({
            message: this.$t('message.temUpperMin') + '！',
            type: 'error'
          })
          return
        }
        if (this.variable >= row.temUpper) {
          this.$message({
            message: this.$t('message.lowerLimitHigher') + '！',
            type: 'error'
          })
          return
        }
      } else if (val === 'humUpper') {
        if (this.variable > 100) {
          this.$message({
            message: this.$t('message.humUpperMax') + '！',
            type: 'error'
          })
          return
        }
        if (this.variable <= row.humLower) {
          this.$message({
            message: this.$t('message.upperLimitLower') + '！',
            type: 'error'
          })
          return
        }
      } else if (val === 'humLower') {
        if (this.variable < 0) {
          this.$message({
            message: this.$t('message.humUpperMin') + '！',
            type: 'error'
          })
          return
        }
        if (this.variable >= row.humUpper) {
          this.$message({
            message: this.$t('message.lowerLimitHigher') + '！',
            type: 'error'
          })
          return
        }
      }
      let params = {
        mac: mac,
        nodeId: row.nodeId,
        paramName: val,
        value: this.variable
      }
      this.disabledFlag = true
      updateParam(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.handleClosePopover()
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
          let timer = setTimeout(() => {
            this.disabledFlag = false
            clearTimeout(timer)
          }, 5000)
        })
    }
  },
  watch: {
    variable: {
      handler (newVal, oldVal) {
        if (newVal === '') {
          this.disabledRefresh = true
        } else {
          this.disabledRefresh = false
        }
      }
    }
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
.dashed
  box-sizing border-box
  border-bottom 1px dashed #303a5e
.enable
  height 40px
  line-height 40px
/deep/ .el-table__expand-icon
         color #fff
.iconfont-grey
  color #909399 !important
.iconfont-loading
  animation-duration 1s
  animation-timing-function linear
  animation-delay 0s
  animation-iteration-count infinite
  animation-direction normal
  animation-fill-mode none
  animation-play-state running
  animation-name rotating
  display inline-block
.w100
  width 100px
</style>
