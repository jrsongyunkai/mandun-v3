<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="75px" class="rule-form" size="small">
      <el-form-item :label="$t('table.ruleName') + ':'" prop="ruleName">
        <el-col :span="12">
          <el-input v-model="ruleForm.ruleName" :placeholder="$t('table.pleaseEnter') + $t('table.ruleName')"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('table.ruleLogic') + ':'">
        <el-col :span="10">
          <el-time-picker
            v-model="ruleForm.actTime"
            format="HH:mm"
            :editable="false"
            :clearable="false"
            value-format="HH:mm"
            :placeholder="$t('placeholder.anyTime')">
          </el-time-picker>
        </el-col>
        <el-col :style="{width : '80px'}">{{ $t('control.shouldBe') + ':' }}</el-col>
        <el-col :span="8">
          <el-select v-model="ruleForm.cpValue">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0" class="mb-0">
        <el-col :span="13" class="left-padding-right">
          <el-form-item :label="$t('table.contact') + ' 1:'" prop="linkMan1">
            <el-input v-model="ruleForm.linkMan1" style="margin-left: 10px;" :placeholder="$t('statistics.prjManager')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" class="left-padding-right">
          <el-form-item label-width="25px" prop="linkTel1">
            <el-input v-model="ruleForm.linkTel1" :placeholder="$t('statistics.prjTel')"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0" class="mb-0">
        <el-col :span="13" class="left-padding-right">
          <el-form-item :label="$t('table.contact') + ' 2:'">
          <el-input v-model="ruleForm.linkMan2" style="margin-left: 10px;" :placeholder="$t('statistics.prjManager')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" class="left-padding-right">
          <el-form-item label-width="25px" prop="linkTel2">
          <el-input v-model="ruleForm.linkTel2" :placeholder="$t('statistics.prjTel')"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label-width="0" class="mb-0">
        <el-col :span="13" class="left-padding-right">
          <el-form-item :label="$t('table.contact') + ' 3:'">
          <el-input v-model="ruleForm.linkMan3" style="margin-left: 10px;" :placeholder="$t('statistics.prjManager')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" class="left-padding-right">
          <el-form-item label-width="25px" prop="linkTel3">
          <el-input v-model="ruleForm.linkTel3" :placeholder="$t('statistics.prjTel')"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item :label="$t('table.status') + ':'">
        <el-col :span="9">
          <el-select v-model="ruleForm.status">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="12">
          <el-button type="primary" @click="submitForm('ruleForm')">{{ $t('btns.save') }}</el-button>
          <el-button @click="closeForm">{{ $t('btns.cancel') }}</el-button>
        </el-col>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { saveDeStatuscanConf } from '@/api/api'
export default {
  data () {
    let checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('table.pleaseEnter') + this.$t('table.contactNumber')))
      } else {
        if (!this.$func.checkPhone(value)) {
          callback(new Error(this.$t('message.numberFormatError')))
        } else {
          callback()
        }
      }
    }
    let checkPhone2 = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        if (!this.$func.checkPhone(value)) {
          callback(new Error(this.$t('message.numberFormatError')))
        } else {
          callback()
        }
      }
    }
    return {
      ruleForm: {
        ruleName: '',
        cpValue: '0',
        actTime: this.$func.formatDate('HH:mm', new Date()),
        status: 0,
        linkMan1: '',
        linkTel1: '',
        linkMan2: '',
        linkTel2: '',
        linkMan3: '',
        linkTel3: ''
      },
      rules: {
        ruleName: [
          {required: true, message: this.$t('table.pleaseEnter') + this.$t('table.ruleName'), trigger: 'blur'}
        ],
        linkMan1: [
          {required: true, message: this.$t('table.pleaseEnter') + this.$t('table.contact'), trigger: 'blur'}
        ],
        linkTel1: [
          {validator: checkPhone, trigger: 'blur'}
        ],
        linkTel2: [
          {validator: checkPhone2, trigger: 'blur'}
        ],
        linkTel3: [
          {validator: checkPhone2, trigger: 'blur'}
        ]
      },
      options: [
        {
          value: '0',
          label: this.$t('table.opening') + this.$t('table.status')
        },
        {
          value: '1',
          label: this.$t('table.closing') + this.$t('table.status')
        }
      ],
      options2: [
        {
          value: 0,
          label: this.$t('control.invalid')
        },
        {
          value: 1,
          label: this.$t('control.effective')
        }
      ]
    }
  },
  mounted () {
    if (this.$store.state.ruleForm !== null) this.ruleForm = this.$store.state.ruleForm
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.projectCode = this.$store.state.projectCode
          saveDeStatuscanConf(this.ruleForm)
            .then(res => {
              if (res.success) {
                this.$message({
                  message: this.$t('btns.save2') + this.$t('system.success'),
                  type: 'success'
                })
                this.$parent.handleClose()
                this.$parent.$parent.queryList()
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
      })
    },
    closeForm () {
      this.$parent.handleClose()
    }
  }
}
</script>
<style lang="stylus" scoped>
.rule-form
  >>> .el-form-item__label
        padding-right 0
  >>> .el-form-item__error
        left 10px
.el-date-editor.el-input
  width 100%
.mb-0
  margin-bottom 0 !important
/deep/ .el-form-item__label
         color #606266
</style>
