<template>
  <div>
    <el-form ref="form" :model="form" label-width="130px">
      <el-form-item :label="$t('table.status') + ':'">
        <el-radio v-model="form.serverPointStatus" :label="1">{{ $t('system.enable') }}</el-radio>
        <el-radio v-model="form.serverPointStatus" :label="0">{{ $t('home.disable') }}</el-radio>
      </el-form-item>
      <el-form-item :label="$t('home.newDirection', {param: $t('table.type') }) + ':'">
        <el-select v-model="serverPoint[0]" :placeholder="$t('placeholder.pleaseChoose')" :disabled="form.serverPointStatus === 0">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('home.newDirection', {param: '(UDP)' }) + ':'">
        <el-input v-model="serverPoint[1]" :placeholder="$t('system.formatExample', ['192.168.1.1:7758', 'sample.com:7758'])" :disabled="form.serverPointStatus === 0"></el-input>
      </el-form-item>
      <el-form-item :label="$t('home.newDirection', {param: '(HTTP)' }) + ':'">
        <el-input v-model="serverPoint[2]" :placeholder="$t('system.formatExample', ['192.168.1.1:8080/data/carry', 'sample.com:8080/data/carry'])" :disabled="form.serverPointStatus === 0"></el-input>
      </el-form-item>
      <!-- <el-form-item label="">
        <el-checkbox v-model="immediate">{{ $t('system.orientationTip') }}</el-checkbox>
      </el-form-item> -->
      <el-form-item label="">
        <el-button  size="small" @click="handleSave" type="primary">{{ $t('btns.save') }}</el-button>
        <el-button size="small" @click="handleSeverDialog">{{ $t('btns.cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { findProject, saveServerPoint } from '@/api/api'
export default {
  props: {
    id: {
      type: Number
    }
  },
  data () {
    return {
      form: [],
      serverPoint: ['0', '', ''],
      // immediate: false,
      options: [
        {
          label: 'IP',
          value: '0'
        },
        {
          label: this.$t('system.domainName'),
          value: '1'
        }
      ]
    }
  },
  mounted () {
    this.queryInfo()
  },
  computed: {},
  methods: {
    queryInfo () {
      findProject({id: this.id})
        .then(res => {
          if (res.success) {
            this.form = res.data
            if (res.data.serverPoint) {
              this.serverPoint = res.data.serverPoint.split(',')
              if (this.serverPoint.length === 1) this.serverPoint = ['0', this.serverPoint[0], '']
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
        .finally(() => {})
    },
    handleSave () {
      let params = {
        id: this.id,
        serverPointStatus: this.form.serverPointStatus
      }
      if (this.form.serverPointStatus !== 0) {
        params.isDomain = this.serverPoint[0]
        params.address1 = this.serverPoint[1]
        params.address2 = this.serverPoint[2]
      }
      // if (this.immediate) params.immediate = 1
      saveServerPoint(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.handleSeverDialog()
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
        .finally(() => {})
    },
    handleSeverDialog () {
      this.$emit('handleSeverDialog')
    }
  }
}
</script>
<style lang="stylus" scoped>
/deep/ .el-form-item__label
          color #606266
</style>
