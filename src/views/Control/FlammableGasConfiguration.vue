<template>
  <div id="flammableGasConfiguration">
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
        <el-form :model="adjustment" class="mt-20" :inline="true">
          <el-row>
            <el-col :span="24">
              <el-col :span="24">
                <el-form-item :label="$t('stralsund.parameterSetting') + ':'" :label-width="$i18n.locale === 'zh' ? '125px' : '140px'">
                  <el-form-item :label="$t('stralsund.reportingCycle') + ':'" :label-width="$i18n.locale === 'zh' ? '125px' : '140px'">
                    <el-select size="small" v-model="adjustment.reportingCycle" :placeholder="$t('placeholder.pleaseChoose')">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                  </el-form-item>
                </el-form-item>
              </el-col>
              <el-col>
                <el-divider></el-divider>
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
import { macAlias, forsafeDeviceCommand, queryForsafeMsgTypeConfig } from '@/api/api'
export default {
  data () {
    return {
      adjustment: {
        mac: this.$store.state.mac,
        name: this.$store.state.aliasName,
        reportingCycle: 24,
        build: this.$store.state.sortBUR.build,
        unit: this.$store.state.sortBUR.unit,
        room: this.$store.state.sortBUR.room
      },
      aliasFlag: false,
      aliasIndex: -1,
      datas: [],
      orderFlag: false,
      timer: null,
      buildFlag: false,
      unitFlag: false,
      roomFlag: false,
      buildIndex: -1,
      unitIndex: -1,
      roomIndex: -1,
      options: [
        {value: 1, label: '1' + this.$t('table.hour')},
        {value: 8, label: '8' + this.$t('table.hour')},
        {value: 12, label: '12' + this.$t('table.hour')},
        {value: 24, label: '24' + this.$t('table.hour')},
        {value: 48, label: '48' + this.$t('table.hour')}
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.queryConfig()
    },
    queryConfig () {
      let params = {
        mac: this.$store.state.flammableGasObj.mac,
        msgType: 'DevInfo',
        devType: this.$store.state.flammableGasObj.devType
      }
      queryForsafeMsgTypeConfig(params)
        .then(res => {
          if (res.success) {
            this.adjustment.reportingCycle = res.data.period
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
    onSubmit () {
      let params = {
        mac: this.adjustment.mac,
        cmd: 'FORSAFE_SET_PERIOD',
        equipmentType: 7,
        data: this.adjustment.reportingCycle
      }
      forsafeDeviceCommand(params)
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
        .finally(() => {
          this.orderFlag = true
          this.liftRestrictions()
        })
    },
    liftRestrictions () {
      this.timer = setTimeout(() => {
        this.orderFlag = false
      }, 3e3)
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
#flammableGasConfiguration
    margin 0 auto
    width 1200px
  >>> .el-form-item__label
        color #fff
.adjustment-mac
  >>> .el-input .el-input__inner
    color #fff
    width 200px
    padding-left 0
    border none
    background-color transparent
.el-form-item
  padding-right 20px
.el-form-item__label
  vertical-align top
.el-input
  display inline-block
  width 100px
.alias
  width 200px
.title
  width 143px
  text-align right
#position
  >>> .el-input
        width 150px
  span
    margin-right 15px
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
