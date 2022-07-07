<template>
  <div id="hydrological">
     <i class="el-icon-loading adjustment-modal" v-if="refreshLoading"></i>
    <el-row :gutter="20" style="margin: 0; padding:20px;">
      <el-col :span="5">
        <div class="ellipsis" style="margin-left:53px">
          <span class="label" :class="$i18n.locale === 'zh' ? 'normal-label' : ''">{{ $t('dialog.deviceNo') + '：' }}</span>
          <span :title="adjustment.mac" style="margin-left:-30px">{{ adjustment.mac }}</span>
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
          <el-form :model="adjustment" :inline="true" :rules="rules" class="mt-20" ref="adjustment">
            <el-row>
              <el-col :span="24">
                <el-col :span="24">
                  <el-form-item :label="$t('stralsund.parameterSetting') + ':'" :label-width="$i18n.locale === 'zh' ? '125px' : '140px'">
                   <el-button type="text" style="color:#fff"  :disabled="disabledFlag"
          icon="el-icon-refresh alarm-threshold-refresh" @click="reFreshValue" > 刷新</el-button>
                  </el-form-item>
                </el-col>
                <el-col :span="22" style="margin-left:10px">
                  <el-form-item :label="$t('control.pressure') + '(' + $t('control.level') + '):'" :label-width="$i18n.locale === 'zh' ? '125px' : '140px'">
                    <el-form-item :label="$t('control.lowerLimit') + ':'" label-width="90px">
                      <el-input size="small" v-model="adjustment.lower"></el-input><span class="unit">Mpa(M)</span>
                    </el-form-item>
                    <el-form-item :label="$t('control.upperLimit') + ':'" label-width="90px">
                      <el-input size="small" v-model="adjustment.upper"></el-input><span class="unit">Mpa(M)</span>
                    </el-form-item>
                  </el-form-item>
                </el-col>
                <el-col :span="22" style="margin-left:-28px">
                  <el-form-item :label="$t('menu.temperature') + ':'" :label-width="$i18n.locale === 'zh' ? '125px' : '140px'">
                    <el-form-item style="margin-left:38px" :label="$t('control.lowerLimit') + ':'" label-width="90px">
                      <el-input size="small" v-model="adjustment.tlower"></el-input><span class="unit">℃</span>
                    </el-form-item>
                    <el-form-item  :label="$t('control.upperLimit') + ':'" label-width="90px">
                      <el-input size="small" v-model="adjustment.tupper"></el-input><span class="unit">℃</span>
                    </el-form-item>
                  </el-form-item>
                </el-col>
                <el-col :span="22" >
                  <el-form-item :label="$t('stralsund.reportingCycle') + ':'" :label-width="$i18n.locale === 'zh' ? '125px' : '140px'" prop="reportingCycle">
                    <el-input size="small" v-model.number="adjustment.reportingCycle" :placeholder="$t('table.pleaseEnter')"></el-input><span class="unit">{{ $t('table.minute') }}</span>
                  </el-form-item>
                </el-col>
                <!-- <el-col>
                  <el-divider></el-divider>
                </el-col> -->
                <el-col class="tc">
                  <el-form-item>
                    <el-button size="small" type="primary" @click="onSubmit('adjustment')" :disabled="orderFlag">{{ $t('btns.save') }}</el-button>
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
import { macAlias, tlinkDeviceCommand, queryTlinkConfig } from '@/api/api'
export default {
  props: {
    equipmentNum: {
      type: Number
    }
  },
  data () {
    let checkCycle = (rule, value, callback) => {
      if (value < 2 || value > 1440) {
        this.orderFlag = true
        callback(new Error(this.$t('dialog.range') + '2 ~ 1440'))
      } else {
        this.orderFlag = false
        callback()
      }
    }
    return {
      disabledFlag: false,
      refreshLoading: false,
      adjustment: {
        mac: this.$store.state.mac,
        name: this.$store.state.aliasName,
        build: this.$store.state.sortBUR.build,
        unit: this.$store.state.sortBUR.unit,
        room: this.$store.state.sortBUR.room,
        reportingCycle: 120,
        lower: '',
        upper: '',
        tlower: '',
        tupper: '',
        FT: '0.5'
      },
      aliasFlag: false,
      aliasIndex: -1,
      buildFlag: false,
      unitFlag: false,
      roomFlag: false,
      buildIndex: -1,
      unitIndex: -1,
      roomIndex: -1,
      datas: [],
      orderFlag: false,
      timer: null,
      rules: {
        reportingCycle: [
          {validator: checkCycle, trigger: 'change'}
        ]
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.queryTlinkConfig()
    },
    queryTlinkConfig () {
      queryTlinkConfig({mac: this.$store.state.mac})
        .then(res => {
          if (res.success) {
            this.adjustment.reportingCycle = res.data.AT
            this.adjustment.tupper = res.data.TH
            this.adjustment.tlower = res.data.TL
            this.adjustment.lower = res.data.FL
            this.adjustment.upper = res.data.FH
            this.adjustment.FT = res.data.FT
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
    onSubmit (formName) {
      let params = {
        mac: this.adjustment.mac,
        cmd: this.equipmentNum === 4 ? 'TLINK_WATER' : 'TLINK_PRESSURE',
        FH: this.adjustment.upper,
        FL: this.adjustment.lower,
        TH: this.adjustment.tupper,
        TL: this.adjustment.tlower,
        AT: this.adjustment.reportingCycle,
        FT: this.adjustment.FT
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          tlinkDeviceCommand(params)
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
        } else {
          return false
        }
      })
    },
    liftRestrictions () {
      this.timer = setTimeout(() => {
        this.orderFlag = false
      }, 3e3)
    },
    throttle  (fn, delay) {
      let timer = null
      return function () {
        let context = this
        console.log(11111)
        let args = Array.prototype.slice.call(arguments)
        if (timer) {
          return
        }
        timer = setTimeout(() => {
          fn.apply(context, args)
          timer = null
        }, delay)
      }
    },

    reFreshValue () {
      let ele = document.querySelector('.alarm-threshold-refresh')
      this.refreshLoading = true
      if (ele) {
        this.disabledFlag = true
        setTimeout(() => {
          this.disabledFlag = false
          this.refreshLoading = false
        }, 500)
      }
      this.init()
      // this.throttle(this.init(), 3000)
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
#hydrological
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
.unit
  display inline-block
  margin-left 5px
  width 60px
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
