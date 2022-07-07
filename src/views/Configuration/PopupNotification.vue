<template>
  <div id="dialog-notice" :class="$i18n.locale === 'en' ? 'checked-types-wrap' : ''">
    <checkbox-group v-model="alarmTypeList" ref="typesCheckboxGroup"></checkbox-group>
    <el-col class="tc mt-20">
      <el-button plain size="small" @click="handleSubmitSystems">{{ $t('btns.save') }}</el-button>
    </el-col>
  </div>
</template>
<script>
import CheckboxGroup from '../Common/CheckboxGroup'
import { queryPoPup, updatePoPup } from '@/api/api'
export default {
  data () {
    return {
      alarmTypeList: []
    }
  },
  mounted () {
    this.queryAlarmSystem()
  },
  methods: {
    queryAlarmSystem () {
      queryPoPup({})
        .then(res => {
          if (res.success) {
            this.alarmTypeList = res.data !== '' ? res.data.split(',') : []
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
    handleSubmitSystems () {
      let params = {
        typeNumbers: this.alarmTypeList.join(',')
      }
      updatePoPup(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('message.successfulModified'),
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
          this.queryAlarmSystem()
        })
    }
  },
  components: {
    CheckboxGroup
  }
}
</script>
<style lang="stylus" scoped>
#dialog-notice
  >>> .el-checkbox
        padding 5px 0
        width 20%
        color #fff
        margin-left 0
      >>> .el-checkbox__input.is-checked + .el-checkbox__label
            color #fff
.checked-types-wrap
  >>> .el-checkbox
        width 23.33333%
</style>
