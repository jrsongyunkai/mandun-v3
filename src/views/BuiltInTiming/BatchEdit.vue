<template>
    <div id="BatchEdit">
      <el-table
        class="mb-20 device-wrap"
        :data="options"
        v-el_scrollBar:scrollBar
        size="small"
        max-height="280"
        :header-cell-style="{ 'text-align': 'center' }"
        style="width: 100%">
        <el-table-column
          align="center"
          :label="$t('table.deviceNo')">
          <template slot-scope="scope">
            <div>{{ scope.row.mac }}</div>
            <div>{{ scope.row.others.name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="others.address" align="center" :label="$t('table.location')"></el-table-column>
        <el-table-column
        min-width="300"
        :label="$t('table.line')">
        <template slot-scope="scope">
          <el-button type="text" class="mr-15 tl" @click="handleLine(scope.row, scope.$index)"><i class="el-icon-plus"></i>{{ $t('btns.select') + $t('table.line') }}</el-button>
          <el-tag
            size="medium"
            v-show="scope.row.others.titles.length > 0"
            v-for="(tag, index) in scope.row.others.titles"
            :key="index"
            closable
            @close="handleCloseTag(index, scope.row)">
            {{tag}}
          </el-tag>
        </template>
      </el-table-column>
      </el-table>
      <el-form :model="form" size="small" label-width="120px">
        <el-form-item :label="$t('dialog.timingType') + '：'">
          <el-select v-model="form.type" @change="handleChangeType">
            <el-option :label="item.label" v-for="item in timingOptions" :key="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('btns.execute') + $t('dialog.time') + '：'">
          <el-date-picker
            v-if="form.type === 1"
            v-model="form.time"
            style="width:199px"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm:ss"
            :editable="false"
            :clearable="false"
            type="datetime"
            :placeholder="$t('placeholder.pleaseChoose') + $t('main.date') + $t('dialog.time')">
          </el-date-picker>
          <el-time-picker
            v-if="form.type === 2"
            style="width:199px"
            v-model="form.time"
            format="HH:mm"
            value-format="HH:mm:ss"
            :editable="false"
            :clearable="false"
            :placeholder="$t('placeholder.anyTime')">
          </el-time-picker>
        </el-form-item>
        <el-form-item v-if="form.type === 2" :label="this.$t('btns.select') + this.$t('dialog.repeat') + '：'">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{ $t('system.Indeterminate') }}</el-checkbox>
          <el-checkbox-group v-model="form.weekday" @change="handleCheckedTypesChange">
            <el-checkbox v-for="item in weekDays" :label="item" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item :label="$t('btns.execute') + $t('control.action') + '：'">
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
          <el-button type="primary" @click="onSubmit">{{ $t('btns.save2') }}</el-button>
          <el-button @click="handleCancel">{{ $t('btns.cancel') }}</el-button>
        </el-form-item>
      </el-form>
      <el-dialog :title="$t('dialog.channelList')" :visible.sync="lineVisible" width="60%" append-to-body>
        <LineList :mac="lineMac" :tags="tags" @sendChannels="receiveChannels" source="BuiltInTiming" v-if="lineVisible"></LineList>
      </el-dialog>
    </div>
</template>

<script>
import LineList from '../Common/LineList'
import { batchModifyTiming } from '@/api/api'
export default {
  components: { LineList },
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
        type: 1,
        time: '',
        weekday: [],
        action: ''
      },
      lineMac: '',
      tags: [],
      index: 0,
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
      isIndeterminate: false,
      checkAll: false,
      lineVisible: false,
      weekDays: [
        {
          value: '日',
          label: this.$t('echarts.Sunday')
        },
        {
          value: '一',
          label: this.$t('echarts.Monday')
        },
        {
          value: '二',
          label: this.$t('echarts.Tuesday')
        },
        {
          value: '三',
          label: this.$t('echarts.Wednesday')
        },
        {
          value: '四',
          label: this.$t('echarts.Thursday')
        },
        {
          value: '五',
          label: this.$t('echarts.Friday')
        },
        {
          value: '六',
          label: this.$t('echarts.Saturday')
        }
      ],
      actions: [
        {
          value: true,
          label: this.$t('table.closing')
        },
        {
          value: false,
          label: this.$t('table.opening')
        }
      ]
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
        this.form.time = this.$func.getNowFormatDateTime('time')
      }
    },
    handleCheckAllChange (val) {
      this.form.weekday = val ? this.weekDays : []
      this.isIndeterminate = false
    },
    handleCheckedTypesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.weekDays.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.weekDays.length
    },
    onSubmit () {
      let typeMsg = this.$t('message.controlSuccess')
      if (this.form.time === '' || this.form.action === '') {
        this.$message({
          message: this.$t('message.uninformation'),
          type: 'error'
        })
        return
      }
      if (this.form.type === 2 && this.form.weekday.length === 0) {
        this.$message({
          message: this.$t('message.uninformation'),
          type: 'error'
        })
        return
      }
      let addrs = this.options.map(element => {
        return element.channelAddrs.join(',')
      })
      let macs = this.options.map(element => {
        return element.mac
      })
      let autoIds = this.options.map(element => {
        return element.autoId
      })
      let operates = this.options.map(element => {
        return 4 + ':' + element.autoId
      })
      let week = this.form.weekday.map(element => {
        return element.value
      })
      let time = ''
      if (this.form.time.length === 8 || 19) {
        let arr = this.form.time.split(':')
        time = arr.pop()
        time = arr.join(':')
      }
      let parmas = {
        macs: macs.join('_'),
        channels: addrs.join('_'),
        autoids: autoIds.join('_'),
        weekDay: week.join(''),
        time: time + ':00',
        status: this.form.action,
        _operate_at: operates.join('_')
      }
      batchModifyTiming(parmas)
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
          } else if (res.code === '-1') {
          } else {
            let errMsg = (res.data !== undefined && res.data.length > 0) ? res.data.split('<br/>').map((item) => {
              if (item.indexOf(':0') !== -1) {
                item = item.split(':0').join('')
                return `<div style="color: #67C23A">${item + ':\xa0' + typeMsg}</div>`
              } else {
                return `<div style="color: #F56C6C">${item}</div>`
              }
            }) : res.message
            this.$alert((res.data !== undefined && res.data.length > 0) ? errMsg.join('\n') : errMsg, '', {
              dangerouslyUseHTMLString: true,
              showConfirmButton: false,
              callback: action => {}
            })
          }
        }).catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
      this.$emit('closeBatchEdit', true)
    },
    handleCancel () {
      this.$emit('closeBatchEdit', true)
    },
    receiveChannels (val) {
      this.options[this.index].channelAddrs = val.map(item => {
        return item.addr
      })
      this.options[this.index].others.titles = val.map(item => {
        return item.title
      })
      this.lineVisible = false
    },
    handleLine (row, index) {
      this.tags = []
      this.tags = row.channelAddrs.map((item, index) => {
        return {
          addr: item,
          title: row.others.titles[index]
        }
      })
      this.index = index
      this.lineVisible = true
      this.lineMac = row.mac
    },
    handleCloseTag (index, row) {
      row.others.titles.splice(index, 1)
      row.channelAddrs.splice(index, 1)
    }
  },
  watch: {}
}
</script>

<style lang="stylus" scoped>
#BatchEdit
  >>> .el-form-item__label
        color #333
.device-wrap
  border none
  border 1px solid #EBEEF5
  color #606266
  >>> .el-table__header-wrapper, >>> .el-table__body-wrapper
        th, tr, td
          color #606266
          border-right 1px solid #EBEEF5
        td, th.is-leaf
          border-bottom 1px solid #EBEEF5
  .el-button--text
    color #606266 !important
    &:hover
      color #409EFF !important
.el-tag + .el-tag
  margin 0 0 5px 5px
.repeat
  &:hover
    color #409EFF !important
</style>
