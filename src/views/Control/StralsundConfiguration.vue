<template>
  <div id="stralsundConfiguration">
    <i class="el-icon-loading adjustment-modal" v-if="refreshLoading"></i>
    <el-row :gutter="20" style="margin: 0; padding:20px">
      <el-col :span="5">
        <div class="ellipsis">
          <span class="label" :class="$i18n.locale === 'zh' ? 'normal-label' : ''">{{ $t('dialog.deviceNo') + '：' }}</span>
          <span :title="adjustment.mac">{{ adjustment.mac }}</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <el-popover
            placement="top"
            width="250"
            trigger="click"
            :append-to-body="false"
            v-model="aliasFlag"
            @hide="adjustment.name = $store.state.aliasName">
              <el-input class="input" size="small" maxlength="20" show-word-limit v-model.trim="adjustment.name" :placeholder="$t('table.pleaseEnter') + $t('dialog.deviceAlias')"></el-input>
              <div style="text-align: right; margin: 5px 0 0">
                <el-button type="primary" size="mini" @click="handleAlias(adjustment.mac, adjustment.name)">{{ $t('btns.ok') }}</el-button>
                <el-button size="mini" type="plain" @click="adjustment.name = $store.state.aliasName;aliasFlag = false">{{ $t('btns.cancel') }}</el-button>
              </div>
              <div slot="reference" @mouseover="aliasIndex = adjustment.mac" @mouseout="aliasIndex = -1" class="pointer pRelative">
                <div class="ellipsis" :class="aliasFlag ? 'dashed' : ''" :title="adjustment.name">
                  <span class="label" :class="$i18n.locale === 'zh' ? 'normal-label' : ''">{{ $t('dialog.deviceAlias') + '：' }}</span>
                  <span>{{ adjustment.name }}</span>
                </div>
                <i slot="reference" v-if="aliasIndex === adjustment.mac" class="el-icon-edit pointer" :class="$i18n.locale === 'zh' ? 'normal-icon' : 'unusual-icon'"></i>
              </div>
          </el-popover>
        </div>
      </el-col>
      <el-col :span="11">
        <el-col :span="12">
          <div>
            <el-popover
              placement="top"
              width="250"
              trigger="click"
              :append-to-body="false"
              v-model="buildFlag"
              @hide="adjustment.build = $store.state.sortBUR.build">
                <el-input class="input" size="small" maxlength="20" show-word-limit v-model.trim="adjustment.build" :placeholder="$t('table.pleaseEnter') + $t('control.building')"></el-input>
                <div style="text-align: right; margin: 5px 0 0">
                  <el-button type="primary" size="mini" @click="handleSort(adjustment.mac, adjustment.build, adjustment.unit, adjustment.room, 'build')">{{ $t('btns.ok') }}</el-button>
                  <el-button size="mini" type="plain" @click="adjustment.build = $store.state.sortBUR.build;buildFlag = false">{{ $t('btns.cancel') }}</el-button>
                </div>
                <div slot="reference" @mouseover="buildIndex = adjustment.build" @mouseout="buildIndex = -1" class="pointer pRelative">
                  <div class="ellipsis" :class="buildFlag ? 'dashed' : ''" :title="adjustment.build">
                    <span class="label" :class="$i18n.locale === 'zh' ? 'normal-label' : ''">{{ $t('table.floor') + $t('table.information') + '：' }}</span>
                    <span>{{ adjustment.build }}</span>
                  </div>
                  <i slot="reference" v-if="buildIndex === adjustment.build || $func.checkDataType(adjustment.build)" class="el-icon-edit pointer" :class="$i18n.locale === 'zh' ? 'normal-icon' : 'unusual-icon'"></i>
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
                <el-input class="input" size="small" maxlength="20" show-word-limit v-model.trim="adjustment.unit" :placeholder="$t('table.pleaseEnter') + $t('control.unit')"></el-input>
                <div style="text-align: right; margin: 5px 0 0">
                  <el-button type="primary" size="mini" @click="handleSort(adjustment.mac, adjustment.build, adjustment.unit, adjustment.room, 'unit')">{{ $t('btns.ok') }}</el-button>
                  <el-button size="mini" type="plain" @click="adjustment.unit = $store.state.sortBUR.unit;unitFlag = false">{{ $t('btns.cancel') }}</el-button>
                </div>
                <div slot="reference" @mouseover="unitIndex = adjustment.unit" @mouseout="unitIndex = -1" class="pointer pRelative">
                  <div class="ellipsis" :class="unitFlag ? 'dashed' : ''" :title="adjustment.unit">
                    <span>{{ adjustment.unit }}</span>
                  </div>
                  <i slot="reference" v-if="unitIndex === adjustment.unit || $func.checkDataType(adjustment.unit)" class="el-icon-edit pointer unit-icon"></i>
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
                <el-input class="input" size="small" maxlength="20" show-word-limit v-model.trim="adjustment.room" :placeholder="$t('table.pleaseEnter') + $t('control.room')"></el-input>
                <div style="text-align: right; margin: 5px 0 0">
                  <el-button type="primary" size="mini" @click="handleSort(adjustment.mac, adjustment.build, adjustment.unit, adjustment.room, 'room')">{{ $t('btns.ok') }}</el-button>
                  <el-button size="mini" type="plain" @click="adjustment.room = $store.state.sortBUR.room;roomFlag = false">{{ $t('btns.cancel') }}</el-button>
                </div>
                <div slot="reference" @mouseover="roomIndex = adjustment.room" @mouseout="roomIndex = -1" class="pointer pRelative">
                  <div class="ellipsis" :class="roomFlag ? 'dashed' : ''" :title="adjustment.room">
                    <span>{{ adjustment.room }}</span>
                  </div>
                  <i slot="reference" v-if="roomIndex === adjustment.room || $func.checkDataType(adjustment.room)" class="el-icon-edit pointer unit-icon"></i>
                </div>
            </el-popover>
          </div>
        </el-col>
      </el-col>
      <el-col>
        <el-form :model="adjustment" :inline="true" class="mt-20" v-loading="loading">
          <el-row>
            <el-col :span="24">
              <el-col :span="24">
                <el-form-item>
                  {{ $t('dialog.alarmValueParameterSetting') + '：' }}
                  <el-button
                    size="small"
                    type="text"
                    :style="{ fontSize: '18px', color: '#fff' }"
                    :disabled="orderFlag"
                    icon="el-icon-refresh alarm-threshold-refresh"
                    @click="handleRefresh"
                  ></el-button>
                </el-form-item>
              </el-col>
              <el-col v-show="true">
                <el-col v-for="(item, index) in datas" :key="index" v-show="item.loopType !== 32">
                  <el-form-item class="title">
                    <span v-if="item.loopType === 0">{{ $t('stralsund.smoke') + $t('control.loop') + item.loopAddr + '：' }}</span>
                    <span v-else-if="item.loopType === 1">{{ $t('main.volt') + $t('control.loop') + item.loopAddr + '：' }}</span>
                    <span v-else-if="item.loopType === 2">{{ $t('control.leakage') + $t('control.loop') + item.loopAddr + '：' }}</span>
                    <span v-else-if="item.loopType === 4">{{ $t('menu.temperature') + $t('control.loop') + item.loopAddr + '：' }}</span>
                    <span v-else-if="item.loopType === 8">{{ $t('main.ampere') + $t('control.loop') + item.loopAddr + '：' }}</span>
                  </el-form-item>
                  <el-form-item>
                    <el-checkbox-group v-model="adjustment.loopStatus[index]">
                      <el-checkbox :label="$t('control.loop') + $t('stralsund.open')" :checked="adjustment.loopStatus[index]"></el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item>
                    <el-checkbox-group v-model="adjustment.tripStatus[index]">
                      <el-checkbox :label="$t('btns.trip') + $t('stralsund.open')" name=""></el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item v-if="item.loopType !== 0 && item.dataCategory === 112" :label="$t('stralsund.alarmValue') + $t('control.upperLimit')+ ':'">
                    <el-input size="small" v-model.number="adjustment.alarmUpperLimt[index]"></el-input>
                    <span class="unit" v-if="item.loopType === 2">{{ item.others.unit + '(300~500mA)'}}</span>
                    <span class="unit" v-else-if="item.loopType === 4">{{ item.others.unit + '(70~90℃)'}}</span>
                    <span class="unit" v-else-if="item.loopType === 8">{{ '% ' + $t('control.ratedCurrent') }}</span>
                    <span class="unit" v-else>{{ '% '+ $t('control.ratedVoltage') }}</span>
                  </el-form-item>
                  <el-form-item v-else-if="item.dataCategory === 104" :label="$t('stralsund.alarmValue') + ':'">
                    <el-input size="small" v-model.number="adjustment.alarmUpperLimt[index]" @input="handleInput(index, adjustment.alarmUpperLimt[index], item.alarmUpperLimt)"></el-input><span class="unit">{{ item.others.unit }}</span>
                  </el-form-item>
                  <el-form-item v-if="item.loopType === 1" :label="$t('stralsund.alarmValue') + $t('control.lowerLimit')+ ':'">
                    <el-input size="small" v-model.number="adjustment.alarmLowerLimit[index]"></el-input><span class="unit">{{ '% ' + $t('control.ratedVoltage') }}</span>
                  </el-form-item>
                  <el-form-item v-if="item.dataCategory === 104" :label="$t('stralsund.tripValue') + ':'">
                    <el-input size="small" v-model="adjustment.tripUpperLimit[index]" readonly></el-input><span class="unit">{{ item.others.unit }}</span>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col>
                <el-divider></el-divider>
              </el-col>
              <el-col v-if="$store.state.stralsundObj.dataCategory === 112">
                <el-form-item :label="$t('control.ratedCurrent') + ':'" label-width="143px" class="ratedCurrent-title">
                  <el-input size="small" v-model="adjustment.ratedCurrent" readonly></el-input><span class="unit">A</span>
                </el-form-item>
              </el-col>
              <el-col class="tc">
                <el-form-item>
                  <el-button size="small" type="primary" @click="onSubmit" :disabled="orderFlag">{{ $t('btns.save') }}</el-button>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import store from '@/store'
import { macAlias, strlRefreshAttr, strlModifyThreshold } from '@/api/api'
export default {
  data () {
    return {
      refreshLoading: false,
      adjustment: {
        mac: this.$store.state.mac,
        name: this.$store.state.aliasName,
        build: this.$store.state.sortBUR.build,
        unit: this.$store.state.sortBUR.unit,
        room: this.$store.state.sortBUR.room,
        loopType: [],
        loopAddr: [],
        loopStatus: [],
        tripStatus: [],
        alarmUpperLimt: [],
        alarmLowerLimit: [],
        tripUpperLimit: [],
        ratedCurrent: ''
      },
      aliasFlag: false,
      aliasIndex: -1,
      buildFlag: false,
      unitFlag: false,
      roomFlag: false,
      buildIndex: -1,
      unitIndex: -1,
      roomIndex: -1,
      loading: true,
      datas: [],
      orderFlag: false,
      timer: null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.loading = true
      this.handleQuery()
    },
    handleAlias (mac, name) {
      macAlias({mac: mac, name: name})
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('dialog.deviceAlias') + this.$t('message.successfulModified') + '！',
              type: 'success'
            })
            this.aliasFlag = false
            this.aliasIndex = -1
            this.adjustment.name = name
            store.commit('aliasName', name)
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
            store.commit('sortBUR', {build: this.adjustment.build, unit: this.adjustment.unit, room: this.adjustment.room})
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
    handleQuery () {
      if (this.orderFlag) return false
      let params = {
        mac: this.adjustment.mac
      }
      strlRefreshAttr(params)
        .then(res => {
          if (res.success) {
            let version = this.$store.state.stralsundObj.dataCategory
            // 112 能耗版
            // 104 基础版
            let datas = res.data.filter((item) => {
              if (version === 112) {
                return item.loopType === 0 || item.loopType === 1 || item.loopType === 2 || item.loopType === 4 || item.loopType === 8 || item.loopType === 32
              } else if (version === 104) {
                return item.loopType === 2 || item.loopType === 4 || item.loopType === 8
              }
            })
            datas.sort((a, b) => {
              return a['loopType'] - b['loopType']
            })
            this.adjustment.loopStatus = datas.map(item => {
              return item.loopStatus === 1 ? !0 : !!0
            })
            this.adjustment.tripStatus = datas.map(item => {
              return item.tripStatus === 1 ? !0 : !!0
            })
            this.adjustment.alarmUpperLimt = datas.map(item => {
              return item.alarmUpperLimt
            })
            this.adjustment.alarmLowerLimit = datas.map(item => {
              return item.alarmLowerLimit
            })
            this.adjustment.tripUpperLimit = datas.map(item => {
              return item.tripUpperLimit
            })
            this.adjustment.loopType = datas.map(item => {
              return item.loopType
            })
            this.adjustment.loopAddr = datas.map(item => {
              return item.loopAddr
            })
            datas.map(item => {
              if (item.loopType === 32) this.adjustment.ratedCurrent = item.detectValue
            })
            this.datas = datas
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
          this.loading = false
          this.orderFlag = true
          this.liftRestrictions()
        })
    },
    handleInput (index, val, oldVal) {
      if (val % 5 === 0) {
        this.adjustment.tripUpperLimit[index] = val + 5
      }
    },
    onSubmit () {
      let dataCategory = this.$store.state.stralsundObj.dataCategory
      let params = {
        mac: this.adjustment.mac,
        cmd: 'STRL_THRESHOLD_SET',
        value1: ''
      }
      if (dataCategory === 112) {
        params.value2 = ''
        this.adjustment.loopType.map((item, index) => {
          if (item !== 32) {
            params.value1 += (index === 0 ? '' : ':') + item + ',' + this.adjustment.loopAddr[index] + ',' + (item === 0 ? 0 : this.adjustment.alarmUpperLimt[index]) + ',' + (this.adjustment.loopStatus[index] ? 1 : 0) + ',' + (this.adjustment.tripStatus[index] ? 1 : 0)
            if (item === 1) {
              params.value2 += (index === 1 ? '' : ':') + item + ',' + this.adjustment.loopAddr[index] + ',' + this.adjustment.alarmLowerLimit[index]
            }
          }
        })
        params.value3 = this.adjustment.ratedCurrent
        this.issueInstructions(params)
      } else if (dataCategory === 104) {
        this.adjustment.loopType.map((item, index) => {
          params.value1 += (index === 0 ? '' : ':') + item + ',' + this.adjustment.loopAddr[index] + ',' + this.adjustment.alarmUpperLimt[index] + ',' + (this.adjustment.loopStatus[index] ? 1 : 0) + ',' + (this.adjustment.tripStatus[index] ? 1 : 0)
        })
        let _flag = this.adjustment.alarmUpperLimt.every(item => {
          return item % 5 === 0
        })
        if (_flag) {
          this.issueInstructions(params)
        } else {
          this.$message({
            type: 'error',
            message: this.$t('message.alarmValueWarning')
          })
        }
      }
    },
    issueInstructions (params) {
      strlModifyThreshold(params)
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
        .finally(() => {
          this.orderFlag = true
          this.liftRestrictions()
        })
    },
    handleRefresh () {
      this.loading = true
      this.handleQuery()
    },
    liftRestrictions () {
      this.timer = setTimeout(() => {
        this.orderFlag = false
      }, 3e3)
    }
  },
  destroyed () {
    clearTimeout(this.timer)
  }
}
</script>
<style lang="stylus" scoped>
.adjustment-modal
  position absolute
  left 50%
  top 50%
  margin-left -15px
  margin-top -15px
  font-size 30px
  color #23b48c
  z-index 9999
#stralsundConfiguration
  margin 0 auto
  width 1200px
  >>> .el-form-item__label
        color #fff
.adjustment-mac
  >>> .el-form-item__content
        display inline-block
  >>> .el-input .el-input__inner
    color #fff
    width 150px
    padding-left 0
    border none
    background-color transparent
#adjustment-alias, #position
  >>> .el-form-item__content
        display inline-block
#position
  >>> .el-input
        width 150px
  span
    margin-right 15px
.el-checkbox
  color #fff
.el-form-item
  padding-right 20px
.el-form-item__label
  vertical-align top
.el-input, .danwei
  display inline-block
.el-input
  width 80px
.alias
  width 200px
.unit
  padding 0 10px
.title
  width 143px
  text-align right
.ratedCurrent-title
  >>> .el-form-item__label
        margin-right 30px
.label
  display inline-block
  width 130px
  text-align left
.normal-label
  width 85px
.ellipsis
  height 40px
  line-height 40px
  font-size 14px
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
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
.input
  width 100%
.dashed
  box-sizing border-box
  border-bottom 1px dashed #303a5e
</style>
