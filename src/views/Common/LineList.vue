<template>
  <el-row>
    <div class="checkbox-group">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{ $t('system.Indeterminate')}}</el-checkbox>
      <div style="margin: 15px 0;"></div>
      <el-checkbox-group v-model="checkedLines" @change="handleCheckedLinesChange">
        <el-checkbox v-for="item in lines" :label="item.addr + '-' +  item.title" :key="item">{{ item.title }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <el-row class="mt-20" v-if="source === 'BuiltInTiming'">
      <el-col :span="22" v-show="false">
        <el-button style="float: right" class="mr-20" size="small" @click="handleBuiltInTimingBack">{{ $t('btns.back') }}</el-button>
      </el-col>
      <el-col :span="23">
        <el-button class="fr" :disabled="checkedLines.length === 0" type="primary" size="small" @click="handleBuiltInTimingSave">{{ $t('btns.save') }}</el-button>
      </el-col>
    </el-row>
    <el-row class="mt-20" v-if="source === 'DetectionRules'">
      <el-col :span="22">
        <el-button style="float: right" class="mr-20" size="small" @click="handleBack">{{ $t('btns.back') }}</el-button>
      </el-col>
      <el-col :span="2">
        <el-button :disabled="checkedLines.length === 0" type="primary" size="small" @click="handleSave">{{ $t('btns.save') }}</el-button>
      </el-col>
    </el-row>
  </el-row>
</template>
<script>
import { queryChannels, saveDeStatuscanConfDetail } from '@/api/api'
export default {
  props: {
    mac: {
      type: String,
      default () {
        return ''
      }
    },
    source: {
      type: String,
      default () {
        return ''
      }
    },
    tags: {
      type: Object,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      checkedLines: [],
      checkAll: false,
      isIndeterminate: true,
      lines: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.mac) {
        this.queryList()
      } else {
        const lineLists = [...(Array(29).keys())].map((item) => {
          return {addr: item + 1, title: item === 0 ? this.$t('control.mainRoad') : this.$t('table.line') + item}
        })
        this.lines = lineLists
      }
    },
    queryList () {
      queryChannels({mac: this.mac})
        .then(res => {
          if (res.success) {
            this.lines = res.datas
            this.checkedLines = this.tags.map((item) => { return item.addr + '-' + item.title })
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
    handleCheckAllChange (val) {
      let datas = []
      if (val) this.lines.map((item) => { datas.push(item.addr + '-' + item.title) })
      this.checkedLines = val ? datas : []
      this.isIndeterminate = false
    },
    handleCheckedLinesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.lines.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.lines.length
    },
    handleSave () {
      let chnls = []
      let chnlNames = []
      let val = null
      this.checkedLines.map((item) => {
        val = item.split('-')
        chnls.push(val[0])
        chnlNames.push(val[1])
      })
      let params = {
        mac: this.mac ? this.mac : 'all',
        ruleId: this.$store.state.ruleId,
        chnls: chnls.join(','),
        chnlNames: chnlNames.join('，')
      }
      saveDeStatuscanConfDetail(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('btns.save2') + this.$t('system.success'),
              type: 'success'
            })
            this.$parent.$parent.handleLineClose()
            this.$parent.$parent.handleLineListClose()
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
    handleBack () {
      this.$parent.$parent.handleLineClose()
    },
    handleBuiltInTimingSave () {
      let channel = []
      let val = null
      this.checkedLines.map((item) => {
        val = item.split('-')
        channel.push({addr: val[0], title: val[1]})
      })
      this.$emit('sendChannels', channel)
    },
    handleBuiltInTimingBack () {
      let channel = []
      this.$emit('sendChannels', channel)
    }
  }
}
</script>
<style lang="stylus" scoped>
.checkbox-group
  .el-checkbox-group
    label
      width calc(17.4% - 30px)
      margin-left 0
      &:nth-child(6n)
        width auto
</style>
