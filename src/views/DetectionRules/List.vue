<template>
  <div id="list">
    <el-col :span="24" class="wrap">
      <span class="pointer fs-14 c-default" @click="handleAddRule"><i class="el-icon-plus"></i>{{ $t('table.newRules') }}</span>
      <span class="ml-20">{{ $t('control.explanation') + '：' + $t('control.rules') }}</span>
    </el-col>
    <el-col :span="24">
      <el-table
        :data="data"
        size="small"
        :height="BuiltInTimingHeight"
        :max-height="BuiltInTimingHeight"
        v-el_scrollBar:scrollBar
        style="width: 100%;">
        <el-table-column
          prop="ruleName"
          align="center"
          width="100"
          :label="$t('table.ruleName')">
        </el-table-column>
        <el-table-column
          prop="mac"
          align="center"
          :label="$t('control.device') + '/' + $t('table.line')">
          <template slot-scope="scope">
            <div class="tl">
              <el-col :lg="4" :xl="2">
                <el-button type="text" class="c-default" @click="handleAddMacLine(scope.row.id)">{{ $t('system.add') }}</el-button>
              </el-col>
              <el-col :lg="20" :xl="22">
                <el-tag
                  v-for="tag in scope.row.others.confDetailList"
                  :key="tag"
                  effect="dark"
                  @close="handleCloseTag(tag.id)"
                  closable>
                  {{ (tag.mac === 'ALL' ? $t('home.all') + $t('control.device') : tag.mac ) + '\n' + tag.chnlnames }}
                </el-tag>
              </el-col>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          align="center"
          :label="$t('table.ruleLogic')">
          <template slot-scope="scope">
            <div>{{ scope.row.actTime }}</div>
            <div>{{ $t('control.shouldBe') + (scope.row.cpValue === '0' ? $t('table.opening') + $t('table.status') : $t('table.closing') + $t('table.status')) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="180"
          :label="$t('table.contact')">
          <template slot-scope="scope">
            <div>{{ scope.row.linkMan1 + '\r' + scope.row.linkTel1 }}</div>
            <div>{{ scope.row.linkMan2 + '\r' + scope.row.linkTel2 }}</div>
            <div>{{ scope.row.linkMan3 + '\r' + scope.row.linkTel3 }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="50"
          :label="$t('table.status')">
          <template slot-scope="scope">
            <div>{{ scope.row.status === 1 ? $t('control.effective') : $t('control.invalid')}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="operating"
          align="center"
          width="90"
          :label="$t('table.operating')">
            <template slot-scope="scope">
              <el-button @click="handleEdit(scope.row)" type="text" size="small" class="c-default">{{ $t('control.edit') }}</el-button>
              <el-button @click="handleDelete(scope.row.id)" type="text" size="small" class="c-default">{{ $t('system.delete') }}</el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col class="tc mt-10">
    <el-pagination
      background
      class="left-padding-right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[20, 50, 100, 500]"
      :page-size="20"
      small
      layout="total, sizes, prev, pager, next"
      :total="total">
    </el-pagination>
    </el-col>
    <el-dialog :title="dialogTitle" top="10vh" :close-on-click-modal="false" :custom-class="dialogType === 'device' ? 'custom-dialog' : ''" :visible.sync="dialogVisible" :destroy-on-close="true" :width="dialogType === 'rule' ? '35%' : '70%'" @close="handleCloses" @closed="handleClose">
      <Rule v-if="dialogType === 'rule'"></Rule>
      <el-scrollbar style="height: 100%;">
        <Device v-if="dialogType === 'device'" source="DetectionRules" @handleDeviceClose="handleDeviceClose"></Device>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>
<script>
import store from '@/store'
import Rule from './Rule'
import Device from './Device'
import { deStatuscanConf, delDeStatuscanConf, delDeStatuscanConfDetail } from '@/api/api'
export default {
  data () {
    return {
      data: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      dialogVisible: false,
      dialogTitle: '',
      dialogType: '',
      BuiltInTimingHeight: this.$store.state.BuiltInTimingHeight
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.queryList()
    },
    queryList () {
      let params = {
        projectCode: this.$store.state.projectCode,
        pageNo: this.currentPage,
        pageSize: this.pageSize
      }
      deStatuscanConf(params)
        .then(res => {
          if (res.success) {
            this.total = res.total
            this.data = res.datas
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
    handleAddRule () {
      this.dialogTitle = this.$t('btns.add') + this.$t('table.rule')
      this.dialogType = 'rule'
      this.dialogVisible = true
    },
    handleAddMacLine (id) {
      store.commit('ruleId', id)
      this.dialogTitle = this.$t('table.addDeviceLine')
      this.dialogType = 'device'
      this.dialogVisible = true
    },
    handleEdit (row) {
      let data = JSON.stringify(row)
      store.commit('ruleForm', JSON.parse(data))
      this.dialogTitle = this.$t('control.edit') + this.$t('table.rule')
      this.dialogType = 'rule'
      this.dialogVisible = true
    },
    handleDelete (id) {
      delDeStatuscanConf({id: id})
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('system.delete') + this.$t('system.success'),
              type: 'success'
            })
            this.queryList()
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
    handleSizeChange (val) {
      this.pageSize = val
      this.queryList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.queryList()
    },
    handleCloses () {
      this.dialogType = 'other'
    },
    handleClose () {
      this.dialogType = 'other'
      this.dialogVisible = false
      store.dispatch('resetRuleForm')
    },
    handleCloseTag (id) {
      delDeStatuscanConfDetail({id: id})
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('system.delete') + this.$t('system.success'),
              type: 'success'
            })
            this.queryList()
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
    handleDeviceClose () {
      this.dialogVisible = false
      if (this.dialogType === 'device') this.queryList()
      this.dialogType = 'other'
    }
  },
  watch: {
    '$store.state.BuiltInTimingHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.BuiltInTimingHeight.height = newVal
        }
      }
    },
    '$store.state.projectCode': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.init()
        }
      }
    }
  },
  components: {
    Rule,
    Device
  }
}
</script>
<style lang="stylus" scoped>
#list
  font-size 12px
  .wrap
    margin-top 22px
    margin-bottom 15px
  >>> .custom-dialog
        .el-dialog__body
          height 70vh
.el-pagination
  >>> .btn-prev, >>> .el-pager li, >>> .btn-next
        background-color transparent
        color #fff
  &:disabled
    background transparent
  >>> .el-pager li.active
    color #409EFF
  >>> .el-pagination__jump
    color #fff
.el-tag
  margin-bottom 5px
  margin-right 5px
  height auto
  line-height auto
  white-space normal
  word-wrap break-word
  word-break normal
  color #fff
  border 1px solid #fff
  background-color transparent
.el-button + .el-button
  margin-left 0
.el-button--text
  color #409EFF
</style>
