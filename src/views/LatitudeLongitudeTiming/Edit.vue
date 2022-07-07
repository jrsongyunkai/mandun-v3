<template>
  <div id="edit">
    <el-form :model="form" label-width="120px" size="small">
      <el-form-item>
        <label slot="label" class="slot-label pointer" @click="handleDevice">{{ '+' + $t('btns.select') + $t('control.device') + '：' }}</label>
        <el-input style="width: 199px" v-model="form.mac" readonly></el-input>
      </el-form-item>
      <el-form-item v-show="form.mac">
        <label slot="label" class="slot-label pointer" @click="handleLine">{{ '+' +$t('btns.select') + $t('table.line') + '：' }}</label>
        <el-tag
          v-show="tag.title.length > 0"
          v-for="(tag, index) in tags"
          :key="index"
          closable
          @close="handleCloseTag(tag)">
          {{tag.title}}
        </el-tag>
      </el-form-item>
      <el-form-item>
        <label slot="label" class="slot-label pointer" @click="handleRepeat">{{ '+' + $t('btns.select') + $t('dialog.repeat') + '：' }}</label>
        <el-tag
          v-for="tag in form.week"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleRepeatClose(tag)">
          <span v-show="$i18n.locale === 'zh'">{{ $t('dialog.week') + tag }}</span>
          <span v-show="$i18n.locale !== 'zh' && tag === '日'">{{ $t('echarts.Sunday') }}</span>
          <span v-show="$i18n.locale !== 'zh' && tag === '一'">{{ $t('echarts.Monday') }}</span>
          <span v-show="$i18n.locale !== 'zh' && tag === '二'">{{ $t('echarts.Tuesday') }}</span>
          <span v-show="$i18n.locale !== 'zh' && tag === '三'">{{ $t('echarts.Wednesday') }}</span>
          <span v-show="$i18n.locale !== 'zh' && tag === '四'">{{ $t('echarts.Thursday') }}</span>
          <span v-show="$i18n.locale !== 'zh' && tag === '五'">{{ $t('echarts.Friday') }}</span>
          <span v-show="$i18n.locale !== 'zh' && tag === '六'">{{ $t('echarts.Saturday') }}</span>
        </el-tag>
      </el-form-item>
      <el-form-item :label="'时间延迟' + '：'">
        <el-col :span="10"  style="padding-left: 0">
          <el-select v-model="form.type">
            <el-option
              v-for="item in trigger"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="14"  style="padding-left: 0">
          <el-input
            style="width: 90px"
            size="small"
            v-model="form.time">
            <i slot="suffix" style="font-style:normal;margin-right">{{ $t('main.second') }}</i>
          </el-input>
          <span>{{ '(' + $t('placeholder.positiveNumber') + ')' }}</span>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('control.action') + '：'">
        <el-col :span="10"  style="padding-left: 0">
          <el-select v-model="form.action">
            <el-option
              v-for="item in actions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="12" class="tr">
          <span class="pointer c-primary" @click="handleSetUp">{{ $t('control.setting') + $t('table.LongitudeAndLatitude') }}</span>
        </el-col>
      </el-form-item>
      <el-form-item v-if="setupFlag">
        <label v-show="monitorFlag" slot="label" class="slot-label">{{ $t('table.monitor') + '：' }}</label>
        <el-input
          v-show="monitorFlag"
          style="width: 199px"
          size="small"
          oninput="if(value>86399) {value=86399} else if (value<0) {value=0}"
          v-model="form.monitorTime">
          <i slot="suffix" style="font-style:normal;margin-right">{{ $t('main.second') }}</i>
        </el-input>
        <span v-show="monitorFlag">(0 ~ 86399)</span>
        <span class="fr pointer c-primary" @click="handleAdvanced" style="margin-right: 95px">{{ $t('main.senior') }}</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :disabled="form.mac === '' || tags.length === 0 || form.week.length === 0 || form.action === '' || form.time === ''">{{ $t('btns.save') }}</el-button>
      </el-form-item>
    </el-form>
    <div>
      <div class="description-title">{{ $t('control.explanation') + '：'}}</div>
      <div class="description">{{ '1. ' + $t('control.description1') }}</div>
      <div class="description">{{ '2. ' + $t('control.description3') }}</div>
    </div>
    <el-dialog :title="$t('table.addDeviceLine')" :close-on-click-modal="false" custom-class="custom-device-dialog" :visible.sync="deviceVisible" width="75%" :before-close="handleClose" append-to-body>
      <el-scrollbar style="height: 100%;">
        <Device source="BuiltInTiming" @sendBuiltInTimingMac="receiveBuiltInTimingMac" attrFlag="attrFlag"></Device>
      </el-scrollbar>
    </el-dialog>
    <el-dialog :title="$t('dialog.channelList')" :visible.sync="lineVisible" width="60%" append-to-body>
      <LineList :mac="form.mac" :tags="tags" @sendChannels="receiveChannels" source="BuiltInTiming" v-if="lineVisible"></LineList>
    </el-dialog>
    <el-dialog :title="$t('btns.select') + $t('dialog.repeat')" :visible.sync="repeatFlag" append-to-body>
      <WeekSelection :options="form.week" @sendWeekSelection="receiveWeekSelection"></WeekSelection>
    </el-dialog>
  </div>
</template>
<script>
import Device from '../DetectionRules/Device'
import LineList from '../Common/LineList'
import WeekSelection from '../Common/WeekSelection'
import { modifyTiming, queryPageAuth } from '@/api/api'
export default {
  props: {
    options: {
      type: Object,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      form: {
        mac: this.options.mac,
        triggerTime: '',
        time: this.options.time,
        week: [...this.options.weekday],
        action: this.options.status,
        type: this.options.type,
        monitorTime: this.options.monitorTime
      },
      trigger: [
        {
          value: 2,
          label: this.$t('table.sunrise')
        },
        {
          value: 3,
          label: this.$t('table.sunset')
        }
      ],
      actions: [
        {
          value: 'true',
          label: this.$t('table.closing')
        },
        {
          value: 'false',
          label: this.$t('table.opening')
        }
      ],
      setupFlag: false,
      monitorFlag: false,
      deviceVisible: false,
      lineVisible: false,
      repeatFlag: false,
      tags: this.options.tags
    }
  },
  mounted () {
    this.init()
    if (this.form.monitorTime) {
      this.monitorFlag = true
    }
  },
  methods: {
    init () {
      let parmas = {
        resKeys: 'AUTH_PROJECT_USE',
        operKeys: 'ADVANCED_TIMING_MONITOR'
      }
      queryPageAuth(parmas)
        .then(res => {
          if (res.success) {
            this.setupFlag = res.data[0].result
            if (this.form.monitorTime.length > 0) {
              this.monitorFlag = true
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
    handleChangeType (val) {
      this.form.type = val
      if (this.form.type === 1) {
        this.form.time = this.$func.getNowFormatDateTime()
      } else {
        this.form.time = this.options.time ? this.options.time : this.$func.getNowFormatDateTime('time')
      }
    },
    handleAdvanced () {
      this.monitorFlag = !this.monitorFlag
    },
    handleDevice () {
      this.deviceVisible = true
    },
    handleLine () {
      this.lineVisible = true
    },
    handleRepeat () {
      this.repeatFlag = true
    },
    handleRepeatClose (tag) {
      this.form.week.splice(this.form.week.indexOf(tag), 1)
    },
    receiveWeekSelection (val) {
      this.form.week = val
      this.repeatFlag = false
    },
    receiveBuiltInTimingMac (val) {
      this.form.mac = val
      this.tags = []
      this.deviceVisible = false
    },
    receiveChannels (val) {
      this.tags = val
      this.lineVisible = false
    },
    handleCloseTag (tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    handleSubmit () {
      let params = {
        mac: this.form.mac,
        autoid: this.options.autoid ? this.options.autoid : 0,
        channel: this.tags.map((item) => { return item.addr }).join(','),
        weekday: this.form.week.join(''),
        time: this.form.time,
        type: this.form.type,
        status: this.form.action,
        _operate_at: 4 + ':' + this.options.autoid,
        monitorTime: this.form.monitorTime
      }
      modifyTiming(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.$emit('queryList', true)
            this.$emit('closeEdit', true)
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
    handleSetUp () {
      if (this.form.mac === '') {
        this.$message({
          message: this.$t('placeholder.pleaseChoose') + this.$t('control.device'),
          type: 'error'
        })
        return false
      }
      this.form.flag = 'ture'
      this.form.autoid = this.options.autoid ? this.options.autoid : 0
      this.form.tags = this.tags
      this.$emit('handleLatitudeLongitude', this.form)
    }
  },
  watch: {
    monitorFlag: {
      handler (newVal, oldVal) {
        if (!newVal) {
          this.form.monitorTime = ''
        }
        if (newVal) {
          this.form.monitorTime = this.options.monitorTime
        }
      }
    }
  },
  components: {
    Device,
    LineList,
    WeekSelection
  }
}
</script>
<style lang="stylus" scoped>
#edit
  >>> .el-form-item__label
        color #333
.el-tag + .el-tag
  margin-left 5px
</style>
