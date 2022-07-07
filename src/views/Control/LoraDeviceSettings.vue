<template>
  <el-col>
    <el-form>
      <el-form-item :label="$t('control.device') + $t('system.settings')+ '：'">
        <el-tooltip class="item" effect="light" :content="$t('btns.refresh') + $t('table.list')" placement="top">
          <el-button type="text" :style="{ fontSize: '18px', color: '#fff' }" icon="el-icon-refresh" @click="queryList"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="light" :content="$t('btns.reverseLookup') + $t('table.switch') + $t('table.information')" placement="top">
          <el-button type="text" :style="{ fontSize: '18px', color: '#fff' }" icon="el-icon-open" @click="handleReportInformation('ZH_LORA_O_GET_TYPE_1')"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="light" :content="$t('btns.reverseLookup') + $t('table.node') + $t('table.information')" placement="top">
          <el-button type="text" :style="{ fontSize: '18px', color: '#fff' }" icon="el-icon-s-operation" @click="handleReportInformation('ZH_LORA_O_GET_TYPE_2')"></el-button>
        </el-tooltip>
      </el-form-item>
      <el-form-item v-for="(value, index) in datas" :key="index" :label="$t('table.line') + (value.addr + 1) + '：'">
        <el-col :span="4">
          {{ $t('dialog.open') + $t('dialog.time') + '：' }}
          <span v-if="lineIndex !== index + '-openTime'" @mouseover="handleOver(index, 'openTime')" @mouseout="lineIndex = -1">{{ value.openTime }}</span>
          <el-time-picker
            v-if="lineIndex === index + '-openTime'"
            v-model="value.openTime"
            format="HH:mm"
            class="component-width"
            value-format="HH:mm"
            :editable="false"
            :clearable="false"
            size="small"
            @change="handleChange(value.mac, 'ZH_LORA_O_TIMED_OPEN_AND_OFF', value.openTime, value.closeTime)"
            :placeholder="$t('placeholder.anyTime')"
            >
          </el-time-picker>
        </el-col>
        <el-col :span="4">
          {{ $t('dialog.close') + $t('dialog.time') + '：' }}
          <span v-if="lineIndex !== index + '-closeTime'" @mouseover="handleOver(index, 'closeTime')" @mouseout="lineIndex = -1">{{ value.closeTime }}</span>
          <el-time-picker
            v-if="lineIndex === index + '-closeTime'"
            v-model="value.closeTime"
            format="HH:mm"
            class="component-width"
            value-format="HH:mm"
            :editable="false"
            :clearable="false"
            size="small"
            @change="handleChange(value.mac, 'ZH_LORA_O_TIMED_OPEN_AND_OFF', value.openTime, value.closeTime)"
            :placeholder="$t('placeholder.anyTime')"
            >
          </el-time-picker>
        </el-col>
        <el-col :span="4">
          {{ $t('stralsund.reportingCycle') + '：' }}
          <span v-if="lineIndex !== index + '-reportCycle'" @mouseover="handleOver(index, 'reportCycle')" @mouseout="lineIndex = -1">{{ value.reportCycle }}</span>
          <el-input
            v-if="lineIndex === index + '-reportCycle'"
            class="component-width"
            @blur="handleReporting(value.mac, 'ZH_LORA_O_PERIOD_AND_DELAY', value.reportCycle, value.reportDelay)"
            @keyup.enter.native="$event.target.blur"
            v-model.number="value.reportCycle"
            autocomplete="off"
            size="small"
          ></el-input>
          <span>(min)</span>
        </el-col>
        <el-col :span="4">
          {{ $t('stralsund.reportDelay') + '：' }}
          <span v-if="lineIndex !== index + '-reportDelay'" @mouseover="handleOver(index, 'reportDelay')" @mouseout="lineIndex = -1">{{ value.reportDelay }}</span>
          <el-input
            v-if="lineIndex === index + '-reportDelay'"
            class="component-width"
            @blur="handleReporting(value.mac, 'ZH_LORA_O_PERIOD_AND_DELAY', value.reportCycle, value.reportDelay)"
            @keyup.enter.native="$event.target.blur"
            v-model.number="value.reportDelay"
            autocomplete="off"
            size="small"
          ></el-input>
          <span>(ms)</span>
        </el-col>
      </el-form-item>
    </el-form>
  </el-col>
</template>
<script>
// import { zhloraQueryBoxConfig, zhloraCmd } from '@/api/api'
import { zhloraQueryBoxConfig } from '@/api/api'
export default {
  data () {
    return {
      datas: [],
      lineIndex: -1
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.queryList()
    },
    queryList () {
      let params = {
        mac: this.$route.query.param.mac,
        addr: this.$route.query.param.addr
      }
      zhloraQueryBoxConfig(params)
        .then(res => {
          if (res.success) {
            this.datas = res.data
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
          this.lineIndex = -1
        })
    },
    // handleReportInformation (cmd) {
    //   let params = {
    //     mac: this.$route.query.param.mac,
    //     cmd: cmd
    //   }
    //   zhloraCmd(params)
    //     .then(res => {
    //       if (res.success) {
    //         this.$message({
    //           message: res.message,
    //           type: 'success'
    //         })
    //       } else if (res.code === '-1') {
    //       } else {
    //         if (res.message) {
    //           this.$message({
    //             message: res.message,
    //             type: 'error'
    //           })
    //         } else {
    //           this.$message({
    //             message: this.$t('message.unknown'),
    //             type: 'error'
    //           })
    //         }
    //       }
    //     })
    //     .catch(err => {
    //       if (err) {
    //         this.$message({
    //           message: this.$t('message.unknown'),
    //           type: 'error'
    //         })
    //       }
    //     })
    //   this.lineIndex = -1
    // },
    handleOver (index, name) {
      this.lineIndex = index + '-' + name
    }
    // handleChange (mac, cmd, openTime, closeTime) {
    //   let params = {
    //     mac: mac,
    //     cmd: cmd,
    //     openTime: openTime,
    //     closeTime: closeTime
    //   }
    //   zhloraCmd(params)
    //     .then(res => {
    //       if (res.success) {
    //         this.$message({
    //           message: res.message,
    //           type: 'success'
    //         })
    //       } else if (res.code === '-1') {
    //       } else {
    //         if (res.message) {
    //           this.$message({
    //             message: res.message,
    //             type: 'error'
    //           })
    //         } else {
    //           this.$message({
    //             message: this.$t('message.unknown'),
    //             type: 'error'
    //           })
    //         }
    //       }
    //     })
    //     .catch(err => {
    //       if (err) {
    //         this.$message({
    //           message: this.$t('message.unknown'),
    //           type: 'error'
    //         })
    //       }
    //     })
    //   this.lineIndex = -1
    // },
    // handleReporting (mac, cmd, reportCycle, reportDelay) {
    //   let params = {
    //     mac: mac,
    //     cmd: cmd,
    //     reportCycle: reportCycle,
    //     reportDelay: reportDelay
    //   }
    //   zhloraCmd(params)
    //     .then(res => {
    //       if (res.success) {
    //         this.$message({
    //           message: res.message,
    //           type: 'success'
    //         })
    //       } else if (res.code === '-1') {
    //       } else {
    //         if (res.message) {
    //           this.$message({
    //             message: res.message,
    //             type: 'error'
    //           })
    //         } else {
    //           this.$message({
    //             message: this.$t('message.unknown'),
    //             type: 'error'
    //           })
    //         }
    //       }
    //     })
    //     .catch(err => {
    //       if (err) {
    //         this.$message({
    //           message: this.$t('message.unknown'),
    //           type: 'error'
    //         })
    //       }
    //     })
    //   this.lineIndex = -1
    // }
  }
}
</script>
<style lang="stylus" scoped>
.component-width
  width 95px
</style>
