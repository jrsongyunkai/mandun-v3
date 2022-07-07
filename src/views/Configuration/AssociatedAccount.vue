<template>
  <div id="AssociatedAccount">
    <el-row>
      <el-col :span="24" class="tr">
        <el-form :inline="true" :model="formInline">
          <el-form-item :label="$t('system.associatedAccount') + ':'">
            <el-input v-model="formInline.user" size="small" :placeholder="$t('system.enterAssociatedAccount')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="onSubmit">{{ $t('btns.query') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <i class="el-icon-plus pointer c-default" @click="handleAdd" >{{ $t('system.add') }}</i>
        <span class="alarm-sound-tip ml-20 c-warning">{{ $t('dialog.prompt') + '：' + $t('system.associatedAccountTips') }}</span>
      </el-col>
      <el-col :span="24" class="mt-20">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            :label="$t('system.personalAccount')"
            width="300"
            align="center">
            <template slot-scope="scope">
              {{scope.row.loginName + scope.row.nickName}}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('system.HoldLabels')">
            <template slot-scope="scope">
              <el-popover
                placement="top"
                width="250"
                :ref="`popover-${scope.$index}`">
                <el-input size="small" maxlength="10"  show-word-limit v-model.trim="form.label" :placeholder="$t('table.pleaseEnter') + $t('system.genericLabel')"></el-input>
                <div class="tr" style="margin: 5px 0 0">
                  <el-button type="primary" size="mini" @click="handleAddLabel(form.label, scope.$index)">{{ $t('btns.ok') }}</el-button>
                  <el-button size="mini" type="plain" @click="$refs[`popover-` + scope.$index].doClose();form.label = ''">{{ $t('btns.cancel') }}</el-button>
                </div>
                <span slot="reference" class="tag-add pointer c-default">{{ $t('system.add') }}</span>
              </el-popover>
              <span v-if="scope.row.holdingLabels !== ''">
                <el-tag
                  size="medium"
                  v-for="tag in scope.row.holdingLabels.split(',')"
                  :key="tag"
                  closable
                  :disable-transitions="false"
                  @close="handleClosePushlabel(tag, scope.$index)">
                  {{ tag }}
                </el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('table.operating')" align="center" width="150">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="c-default" @click="handleSave(scope.row, scope.$index)">{{ $t('btns.save') }}</el-button>
              <el-button type="text" size="mini" class="c-default" @click="handleDel(scope.row, scope.$index)">{{ $t('btns.remove') }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog
      top="30vh"
      :title="$t('system.personalAccount') + $t('btns.select')"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="650px"
      :modal="false">
      <div class="dialogVisible">
        <el-row>
          <el-col :span="24" class="mt-10">
            <el-form ref="form" :inline="true" size="small" :model="accountForm" @submit.native.prevent>
              <el-form-item>
                <el-input v-model="accountForm.account" size="small" :placeholder="$t('placeholder.mobilePhone')"></el-input>
              </el-form-item>
              <el-form-item>
                <el-input type="password" v-model="accountForm.password" size="small" :placeholder="$t('placeholder.password')"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="small" @click="handleQueryAccount">{{ $t('btns.query') }}</el-button>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="24" class="mt-10">
            <el-table
              :data="newsData"
              style="width: 100%"
              :header-cell-class-name="cellStyle"
              tooltip-effect="dark">
              <el-table-column
                align="center"
                width="100"
                :label="$t('btns.select')">
                <template slot-scope="scope">
                  <el-button type="plain" size="mini" @click="handleSelect(scope.row)">{{ $t('btns.select') }}</el-button>
                </template>
              </el-table-column>
              <el-table-column
                prop="loginName"
                align="center"
                :label="$t('system.account')">
              </el-table-column>
              <el-table-column
                prop="nickName"
                align="center"
                :label="$t('system.nickname')">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
     </el-dialog>
  </div>
</template>

<script>
import { queryAssociatedUsers, saveFollowerForAssign, queryStaffByAccount } from '@/api/api'
export default {
  data () {
    return {
      dialogVisible: false,
      formInline: {
        user: ''
      },
      rsa: [],
      accountForm: {
        account: '',
        password: ''
      },
      form: {
        label: ''
      },
      tableData: [],
      newsData: [],
      length: 0
    }
  },
  mounted () {
    this.init()
    this.rsa = new RSAKey() // eslint-disable-line
  },
  methods: {
    init () {
      this.queryAssociatedtableData()
    },
    queryAssociatedtableData () {
      queryAssociatedUsers()
        .then(res => {
          if (res.success) {
            this.tableData = res.data
            this.length = res.data.length
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
    onSubmit () {
      let params = {
        loginName: this.formInline.user
      }
      queryAssociatedUsers(params)
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
    },
    handleAdd () {
      if (this.length === this.tableData.length - 1) return false
      this.dialogVisible = true
    },
    handleAddLabel (label, index) {
      let reg = /^[0-9a-zA-Z]*$/g
      if (!reg.test(label) || label.length < 1) {
        this.$message({
          message: this.$t('message.lableFormat'),
          type: 'error'
        })
        return false
      }
      if (this.tableData[index].holdingLabels.split(',').indexOf(label) > -1) {
        this.$message({
          message: this.$t('message.labelExists'),
          type: 'error'
        })
        return false
      }
      this.$refs[`popover-` + index].doClose()
      this.form.label = ''
      this.tableData[index].holdingLabels = this.tableData[index].holdingLabels !== '' ? this.tableData[index].holdingLabels.concat(',' + label) : label
    },
    handleSave (row, index) {
      let arr = row.holdingLabels.split(',')
      if (arr.length > 18) {
        this.$message({
          message: this.$t('message.moreLabel'),
          type: 'error'
        })
        return false
      }
      let params = {
        oper: 'associate',
        followerId: row.followerId,
        classifyLabels: row.holdingLabels,
        associatedId: row.associatedId
      }
      saveFollowerForAssign(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.queryAssociatedtableData()
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
    handleDel (row, index) {
      if (row.associatedId === 0) {
        this.tableData.splice(index, 1)
        return false
      }
      this.$confirm(this.$t('message.confirmDeleteLabel'), this.$t('dialog.prompt'), {
        confirmButtonText: this.$t('btns.ok'),
        cancelButtonText: this.$t('btns.cancel'),
        type: 'warning'
      }).then(() => {
        saveFollowerForAssign({oper: 'disassociate', followerId: row.followerId, associatedId: row.associatedId})
          .then(res => {
            if (res.success) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.queryAssociatedtableData()
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('message.undelete')
        })
      })
    },
    handleClosePushlabel (tag, index) {
      let label = this.tableData[index].holdingLabels.split(',')
      label.splice(label.indexOf(tag), 1)
      this.tableData[index].holdingLabels = label.join(',')
    },
    handleQueryAccount () {
      if (this.accountForm.account.length < 1 || this.accountForm.password.length < 1) {
        this.$message({
          message: this.$t('message.unfilled'),
          type: 'error'
        })
        return false
      }
      this.rsa.setPublic(this.$store.state.modulus, this.$store.state.exponent)
      let pass = this.rsa.encrypt(this.accountForm.password)
      let params = {
        loginName: this.accountForm.account,
        password: pass
      }
      queryStaffByAccount(params)
        .then(res => {
          if (res.success) {
            this.newsData = res.data
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
    handleSelect (row) {
      let obj = {
        loginName: row.loginName,
        nickName: '(' + row.nickName + ')',
        holdingLabels: '',
        followerId: row.staffId,
        associatedId: 0
      }
      this.tableData.unshift(obj)
      this.dialogVisible = false
      this.accountForm.account = ''
      this.accountForm.password = ''
      this.newsData = []
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-icon-plus
  font-size 12px
.alarm-sound-tip
  font-size 14px
.el-tag
  margin 0 2px 5px
  color #fff
  background transparent
.AssociatedAccount
  height 400px
.dialogVisible
  padding 0 10px
  .el-table, .el-table >>> th, .el-table >>> td
      border 1px solid #ebeef5
      color #909399
.dialogVisible
  .el-table >>> .choose-cell .cell
    .el-checkbox__inner
        display none
        position relative
    &::before
        content '选择'
        position absolute
        right 8px
</style>
