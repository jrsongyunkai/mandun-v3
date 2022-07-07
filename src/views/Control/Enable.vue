<template>
  <el-row>
    <el-col>
      <el-form ref="enableAlarmForm" :model="enableBits"  class="" label-width="120px">
        <el-form-item :label="$t('control.enableBitSetting') + '：'">
          <el-checkbox-group size="small" v-model="enableBits.enableBits" @change="handleCheckedBitsChange">
            <el-checkbox-button v-for="(bit, index) in bits" :label="index + '-' + bit" :key="index" :disabled="bit === $t('types.reserved')">{{ bit }}</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="submitForm(param.mac, param.nodeNo, param.cmd)" :disabled="permission === 'false' || enableBits.enableBitsObj.length === 0">{{ $t('btns.save') }}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col>
      <div class="description-title">{{ $t('control.explanation') + '：'}}</div>
      <div class="description">{{ '1. ' + $t('control.description1') }}</div>
      <div class="description">{{ '2. ' + $t('control.description2') }}</div>
    </el-col>
  </el-row>
</template>
<script>
/* global config */
import { modifyBoxsChnlTripEnable, modifyBoxsChnlAlarmEbable } from '@/api/api'
export default {
  props: {
    enableBits: {
      type: Object,
      default () {
        return {}
      }
    },
    param: {
      type: Object,
      default () {
        return {}
      }
    },
    bits: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      permission: config.authority.BOX_ATTR_MODIFY
    }
  },
  mounted () {},
  methods: {
    handleCheckedBitsChange (value) {
      let arr = []
      if (this.param.cmd === 'SET_ENABLE_ALARM') {
        arr = [
          value.indexOf('0-' + this.$t('types.shortCircuitA')) > -1 ? 1 : 0,
          value.indexOf('1-' + this.$t('types.surgeA')) > -1 ? 1 : 0,
          value.indexOf('2-' + this.$t('types.overloadA')) > -1 ? 1 : 0,
          value.indexOf('3-' + this.$t('types.temperatureW')) > -1 ? 1 : 0,
          value.indexOf('4-' + this.$t('types.leakageA')) > -1 ? 1 : 0,
          value.indexOf('5-' + this.$t('types.overcurrentA')) > -1 ? 1 : 0,
          value.indexOf('6-' + this.$t('types.overpressureA')) > -1 ? 1 : 0,
          value.indexOf('7-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('8-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('9-' + this.$t('types.missingPhaseA')) > -1 ? 1 : 0,
          value.indexOf('10-' + this.$t('types.fireA')) > -1 ? 1 : 0,
          value.indexOf('11-' + this.$t('types.undervoltageA')) > -1 ? 1 : 0,
          value.indexOf('12-' + this.$t('types.overpressureW')) > -1 ? 1 : 0,
          value.indexOf('13-' + this.$t('types.undervoltageW')) > -1 ? 1 : 0,
          value.indexOf('14-' + this.$t('types.leakageW')) > -1 ? 1 : 0,
          value.indexOf('15-' + this.$t('types.currentW')) > -1 ? 1 : 0,
          value.indexOf('16-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('17-' + this.$t('types.localMaintenance')) > -1 ? 1 : 0,
          value.indexOf('18-' + this.$t('types.malignantLoad')) > -1 ? 1 : 0,
          value.indexOf('19-' + this.$t('message.remoteLock')) > -1 ? 1 : 0,
          value.indexOf('20-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('21-' + this.$t('types.temperatureA')) > -1 ? 1 : 0,
          value.indexOf('22-' + this.$t('types.unbalancedA')) > -1 ? 1 : 0,
          value.indexOf('23-' + this.$t('types.wrongPhaseA')) > -1 ? 1 : 0,
          value.indexOf('24-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('25-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('26-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('27-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('28-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('29-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('30-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('31-' + this.$t('types.reserved')) > -1 ? 1 : 0
        ]
        this.enableBits.enableBitsObj = arr.reverse().join('')
      } else if (this.param.cmd === 'SET_ENABLE_TRIP') {
        arr = [
          value.indexOf('0-' + this.$t('types.shortCircuitA') + this.$t('btns.trip')) > -1 ? 1 : 0,
          value.indexOf('1-' + this.$t('types.surgeA') + this.$t('btns.trip')) > -1 ? 1 : 0,
          value.indexOf('2-' + this.$t('types.overloadA') + this.$t('btns.trip')) > -1 ? 1 : 0,
          value.indexOf('3-' + this.$t('types.temperatureW') + this.$t('btns.trip')) > -1 ? 1 : 0,
          value.indexOf('4-' + this.$t('types.leakageA') + this.$t('btns.trip')) > -1 ? 1 : 0,
          value.indexOf('5-' + this.$t('types.overcurrentA') + this.$t('btns.trip')) > -1 ? 1 : 0,
          value.indexOf('6-' + this.$t('types.overpressureA') + this.$t('btns.trip')) > -1 ? 1 : 0,
          value.indexOf('7-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('8-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('9-' + this.$t('types.missingPhaseA') + this.$t('btns.trip')) > -1 ? 1 : 0,
          value.indexOf('10-' + this.$t('types.fireA') + this.$t('btns.trip')) > -1 ? 1 : 0,
          value.indexOf('11-' + this.$t('types.undervoltageA') + this.$t('btns.trip')) > -1 ? 1 : 0,
          value.indexOf('12-' + this.$t('types.overpressureW') + this.$t('btns.trip')) > -1 ? 1 : 0,
          value.indexOf('13-' + this.$t('types.undervoltageW') + this.$t('btns.trip')) > -1 ? 1 : 0,
          value.indexOf('14-' + this.$t('types.leakageW') + this.$t('btns.trip')) > -1 ? 1 : 0,
          value.indexOf('15-' + this.$t('types.currentW') + this.$t('btns.trip')) > -1 ? 1 : 0,
          value.indexOf('16-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('17-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('18-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('19-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('20-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('21-' + this.$t('types.temperatureA') + this.$t('btns.trip')) > -1 ? 1 : 0,
          value.indexOf('22-' + this.$t('types.unbalancedA') + this.$t('btns.trip')) > -1 ? 1 : 0,
          value.indexOf('23-' + this.$t('types.wrongPhaseTrip')) > -1 ? 1 : 0,
          value.indexOf('24-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('25-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('26-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('27-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('28-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('29-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('30-' + this.$t('types.reserved')) > -1 ? 1 : 0,
          value.indexOf('31-' + this.$t('types.reserved')) > -1 ? 1 : 0
        ]
        this.enableBits.enableBitsObj = arr.reverse().join('')
      }
    },
    submitForm (mac, node, type) {
      let that = this
      let params = {
        macs: mac,
        cmd: type,
        nodeNos: node
      }
      if (type === 'SET_ENABLE_TRIP') {
        params.tripEnable = this.enableBits.enableBitsObj
        modifyBoxsChnlTripEnable(params)
          .then(res => {
            if (res.success) {
              that.$message({
                message: this.$t('message.controlSuccess'),
                type: 'success'
              })
              this.$emit('refresh-init')
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
      } else if (type === 'SET_ENABLE_ALARM') {
        params.alarmEnable = this.enableBits.enableBitsObj
        modifyBoxsChnlAlarmEbable(params)
          .then(res => {
            if (res.success) {
              that.$message({
                message: this.$t('message.controlSuccess'),
                type: 'success'
              })
              this.$emit('refresh-init')
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
      }
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
