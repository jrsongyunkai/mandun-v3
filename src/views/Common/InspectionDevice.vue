<template>
    <div id="Inspction">
      <div class="inspction" v-if="titleFlag">
        <el-form label-position="left" ref="ruleForm" label-width="100px" :rules="rules" size="small" :model="inspectionForm">
          <el-form-item prop="time" required :label="$t('table.inspection') + $t('dialog.time') + '：'">
            <el-date-picker
              v-model="inspectionForm.time"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              :placeholder="$t('placeholder.pleaseChoose') + $t('main.date') + $t('dialog.time')">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="name" required :label="$t('table.inspector') + '：'">
            <el-input v-model="inspectionForm.name"></el-input>
          </el-form-item>
          <el-form-item prop="content" required :label="$t('table.inspection') + $t('control.content') + '：'">
            <el-input type="textarea" :rows="8" v-model="inspectionForm.content"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-else style="height: 430px;">
        <el-table
          :data="tableData"
          height="440px"
          v-el_scrollBar:scrollBar
          class="device-wrap mt-10"
          style="width: 100%">
          <el-table-column
            prop="completeTime"
            :label="$t('table.inspection') + $t('main.date')"
            width="170"
            align="center">
          </el-table-column>
          <el-table-column
            prop="completeStaffName"
            :label="$t('table.inspector')"
            width="160"
            align="center">
          </el-table-column>
          <el-table-column
            prop="content"
            :label="$t('table.inspection') + $t('control.content')">
          </el-table-column>
        </el-table>
      </div>
    </div>
</template>

<script>
import { inspectionDetailQuery, inspectionDetailSave } from '@/api/api'
export default {
  props: {
    inspectionData: {
      type: Object
    },
    titleFlag: {
      type: Boolean
    }
  },
  components: {},
  data () {
    return {
      inspectionForm: {
        name: '',
        time: '',
        content: ''
      },
      tableData: [],
      rules: {
        name: [
          { required: true, message: this.$t('table.pleaseEnter') + this.$t('table.inspector'), trigger: 'blur' }
        ],
        time: [
          { required: true, message: this.$t('table.pleaseEnter') + this.$t('main.date') + this.$t('dialog.time'), trigger: 'blur' }
        ],
        content: [
          { required: true, message: this.$t('placeholder.content'), trigger: 'blur' }
        ]
      }
    }
  },
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (!this.titleFlag) {
        let params = {
          projectCode: this.inspectionData.projectCode,
          mac: this.inspectionData.macs
        }
        inspectionDetailQuery(params)
          .then(res => {
            if (res.success) {
              this.tableData = res.data
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
    submitForm () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let params = {
            projectCode: this.inspectionData.projectCode,
            macs: this.inspectionData.macs,
            content: this.inspectionForm.content,
            completeStaffName: this.inspectionForm.name,
            completeTime: this.inspectionForm.time
          }
          inspectionDetailSave(params)
            .then(res => {
              if (res.success) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
                this.$emit('handleInspectionClose')
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
        } else {
          return false
        }
      })
    }
  },
  watch: {}
}
</script>

<style lang="stylus" scoped>
#Inspction >>> .el-form-item__label
  color #606266
#Inspction >>> .el-form-item
  margin-bottom 60px
.inspction
  height 370px
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
</style>
