<template>
  <div v-if="lists.length > 0 && lists2.length > 0">
    <el-row>
      <el-col :span="24"
        ><el-divider content-position="left">{{
          $t('table.alarmType')
        }}</el-divider></el-col
      >
    </el-row>
    <el-row class="pj-alarm">
      <el-col
        :span="4"
        class="pj-alarm-cont"
        v-for="item in lists"
        :key="item.typeNumber"
      >
        <div>
          <el-popover
            placement="top"
            width="250"
            trigger="click"
            :ref="`title-popover-${item.typeNumber}`"
            :append-to-body="false"
            @show="alarmData = item.info"
          >
            <el-input
              size="small"
              :maxlength="$i18n.locale === 'zh' ? 10 : 20"
              show-word-limit
              v-model.trim="alarmData"
              :placeholder="$t('placeholder.customName')"
            ></el-input>
            <div style="text-align: right; margin: 5px 0 0">
              <el-button
                type="primary"
                size="mini"
                @click="handleOk(item, 'alarm')"
                >{{ $t('btns.ok') }}</el-button
              >
              <el-button
                size="mini"
                type="plain"
                @click="handleReset(item, 'alarm')"
                >{{ $t('btns.reset') }}</el-button
              >
            </div>
            <div
              slot="reference"
              @mouseover="handleOver(item, 'alarm')"
              @mouseout="handleOut(item, 'alarm')"
              class="pointer pRelative"
            >
              <div class="ellipsis" :title="item.info" style="display:flex">
                <div style="width:150px;height:20px;border:1px solid #999999;padding:5px">
                  <span>{{ item.info }}  </span>
                </div>
                <div> <i  slot="reference"  :ref="`alarm-${item.typeNumber}`"></i></div>
              </div>
            </div>
          </el-popover>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24"
        ><el-divider content-position="left">{{
          $t('table.warnType')
        }}</el-divider></el-col
      >
    </el-row>
    <el-row class="pj-alarm">
      <el-col
        :span="4"
        class="pj-alarm-cont"
        v-for="item in lists2"
        :key="item.typeNumber"
      >
        <div>
          <el-popover
            placement="top"
            width="250"
            trigger="click"
            :ref="`title-popover-${item.typeNumber}`"
            :append-to-body="false"
            @show="warnData = item.info"
          >
            <el-input
              size="small"
              :maxlength="$i18n.locale === 'zh' ? 10 : 20"
              show-word-limit
              v-model.trim="warnData"
              :placeholder="$t('placeholder.customName')"
            ></el-input>
            <div style="text-align: right; margin: 5px 0 0">
              <el-button
                type="primary"
                size="mini"
                @click="handleOk(item, 'warn')"
                >{{ $t('btns.ok') }}</el-button
              >
              <el-button
                size="mini"
                type="plain"
                @click="handleReset(item, 'warn')"
                >{{ $t('btns.reset') }}</el-button
              >
            </div>
            <div
              slot="reference"
              @mouseover="handleOver(item, 'warn')"
              @mouseout="handleOut(item, 'warn')"
              class="pointer pRelative"
            >
              <div class="ellipsis" :title="item.info" style="display:flex">
                <div style="width:150px;height:20px;border:1px solid #999999;padding:5px">
                  <span>{{ item.info }}  </span>
                </div>
                <div><i slot="reference" :ref="`warn-${item.typeNumber}`"></i></div>

              </div>
            </div>
          </el-popover>
        </div>
      </el-col>
    </el-row>
    <el-row class="pj-alarm">
      <el-col :span="24" class="tc pj-alarm-foot">
        <el-button size="small" @click="handleSave" type="primary">{{
          $t('btns.save')
        }}</el-button>
        <el-button size="small" @click="handleAlarmDialog">{{
          $t('btns.cancel')
        }}</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import store from '@/store'
import {
  queryAlarms4Custom,
  resetCustomAlarm,
  saveCustomAlarms
} from '@/api/api'
export default {
  components: {},
  data () {
    return {
      lists: [],
      lists2: [],
      alarmData: '',
      warnData: '',
      changeData: []
    }
  },
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.queryConfig()
    },
    // 列表
    queryConfig () {
      let parmas = {
        projectCode: this.$store.state.projectCode
      }
      queryAlarms4Custom(parmas)
        .then(res => {
          this.lists = res.data.alarms
          this.lists2 = res.data.warns
          store.commit('alarmForConfig', this.lists.concat(this.lists2))
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
    // 保存按钮
    handleSave () {
      let parmas = {
        projectCode: this.$store.state.projectCode,
        customAlarm: JSON.stringify(this.changeData)
      }
      console.log(parmas, '======parmas')
      saveCustomAlarms(parmas)
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.$nextTick(() => {
              this.handleAlarmDialog()
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
    // 取消按钮
    handleAlarmDialog () {
      this.changeData = []
      this.$emit('handleAlarmDialog')
    },
    handleOver (item, type) {
      this.$refs[`${type}-${item.typeNumber}`][0].className =
        'el-icon-edit pointer normal-icon'
    },
    handleOut (item, type) {
      this.$refs[`${type}-${item.typeNumber}`][0].className = ''
    },
    // 确定按钮
    handleOk (item, type) {
      if (type === 'alarm') {
        item.info = this.alarmData
      } else {
        item.info = this.warnData
      }
      this.changeData.forEach((v, i) => {
        if (v.typeNumber === item.typeNumber) this.changeData.splice(i)
      })
      console.log(this.changeData, '=====this.changeData')
      this.changeData.push(item)
      this.$refs[`title-popover-${item.typeNumber}`][0].doClose()
    },
    // 重置按钮
    handleReset (item, type) {
      let parmas = {
        typeNumber: item.typeNumber
      }
      resetCustomAlarm(parmas)
        .then(res => {
          if (type === 'alarm') {
            this.alarmData = res.data
          } else {
            this.warnData = res.data
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
  watch: {
    '$store.state.projectCode': {
      handler (newVal, oldVal) {
        if (newVal) this.init()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.pj-alarm
  padding-left 40px
.pj-alarm-cont
  margin-right 30px
  margin-bottom 20px
.pj-alarm-foot
  margin 20px 0 10px
  padding-right 60px
.pRelative
  position relative
  i
    position absolute
    top 2px
  .normal-icon
    margin-left 5px
</style>
