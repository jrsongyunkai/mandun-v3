<template>
  <div id="edit">
    <el-form :model="form" label-width="120px">
      <el-form-item>
        <label slot="label" class="slot-label pointer" @click="handleDevice">{{ '+' + $t('btns.select') + $t('control.device') + ':' }}</label>
        <el-input v-model="form.mac" readonly></el-input>
      </el-form-item>
      <el-form-item v-show="form.mac">
        <label slot="label" class="slot-label pointer" @click="handleLine">{{ '+' +$t('btns.select') + $t('table.line') + ':' }}</label>
        <el-tag
          v-show="tag.title.length > 0"
          v-for="(tag, index) in tags"
          :key="index"
          closable
          @close="handleCloseTag(tag)">
          {{tag.title}}
        </el-tag>
      </el-form-item>
      <el-form-item :label="$t('table.type') + ':'">
        <el-select v-model="form.type" @change="handleChangeType">
          <el-option :label="item.label" v-for="item in timingOptions" :key="item.value" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-if="form.type === 1"
          v-model="form.time"
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm:ss"
          :editable="false"
          :clearable="false"
          type="datetime"
          :placeholder="$t('placeholder.pleaseChoose') + $t('main.date') + $t('dialog.time')">
        </el-date-picker>
        <el-time-picker
          v-if="form.type === 2"
          v-model="form.time"
          format="HH:mm"
          value-format="HH:mm:ss"
          :editable="false"
          :clearable="false"
          :placeholder="$t('placeholder.anyTime')">
        </el-time-picker>
      </el-form-item>
      <el-form-item v-if="form.type === 2">
        <label slot="label" class="slot-label pointer" @click="handleRepeat">{{ '+' + $t('btns.select') + $t('dialog.repeat') }}</label>
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
      <el-form-item :label="$t('control.action') + '：'">
        <el-select v-model="form.action">
          <el-option
            v-for="item in actions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :disabled="form.mac === '' || tags.length === 0 || (form.type === 2 && form.week.length === 0)">{{ $t('btns.save') }}</el-button>
      </el-form-item>
    </el-form>
    <div>
      <div class="description-title">{{ $t('control.explanation') + '：'}}</div>
      <div class="description">{{ '1. ' + $t('control.description1') }}</div>
      <div class="description">{{ '2. ' + $t('control.description3') }}</div>
    </div>
    <el-dialog :title="$t('table.addDeviceLine')" :close-on-click-modal="false" custom-class="custom-device-dialog" :visible.sync="deviceVisible" width="75%" :before-close="handleClose" append-to-body>
      <el-scrollbar style="height: 100%;">
        <Device source="BuiltInTiming" @sendBuiltInTimingMac="receiveBuiltInTimingMac"></Device>
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
import { modifyTiming } from '@/api/api'
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
        type: this.options.weekday === '' ? 1 : 2,
        time: this.options.time ? this.options.time : this.$func.getNowFormatDateTime(),
        week: [...this.options.weekday],
        action: this.options.status
      },
      timingOptions: [
        {
          value: 1,
          label: this.$t('dialog.singleTiming')
        },
        {
          value: 2,
          label: this.$t('dialog.cycleTiming')
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
      deviceVisible: false,
      lineVisible: false,
      repeatFlag: false,
      tags: this.options.tags
    }
  },
  mounted () {
  },
  methods: {
    handleChangeType (val) {
      this.form.type = val
      if (this.form.type === 1) {
        this.form.time = this.$func.getNowFormatDateTime()
      } else {
        this.form.time = this.options.time ? this.options.time : this.$func.getNowFormatDateTime('time')
      }
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
      let time = ''
      if (this.form.time.length === 8 || 19) {
        let arr = this.form.time.split(':')
        time = arr.pop()
        time = arr.join(':')
      }
      if (this.form.type === 2) {
        time = time.substring(time.length - 5, time.length)
      }
      let params = {
        mac: this.form.mac,
        autoid: this.options.autoid ? this.options.autoid : 0,
        channel: this.tags.map((item) => { return item.addr }).join(','),
        weekday: this.form.week.join(''),
        time: time + ':00',
        type: 1,
        status: this.form.action,
        _operate_at: 4 + ':' + this.options.autoid
      }
      modifyTiming(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
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
