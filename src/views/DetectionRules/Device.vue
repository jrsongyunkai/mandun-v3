 <template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="rule-form" size="small" @submit.native.prevent>
      <el-form-item>
        <el-col :span="5" class="left-padding-right">
          <el-input v-model="ruleForm.mac" :placeholder="$t('table.deviceNo')"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="queryMac">{{ $t('btns.query') }}</el-button>
        </el-col>
        <el-col :span="15" v-if="false" class="tr">
          <el-button type="text" @click="handleLine('')">{{ $t('home.all') + $t('control.device') }}</el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <el-table
      class="mt-20 device-wrap"
      :data="data">
      <el-table-column
        prop="mac"
        align="center"
        :label="$t('dialog.deviceNo')">
      </el-table-column>
      <el-table-column
        prop="build"
        align="center"
        :label="config.positionLabelA">
      </el-table-column>
      <el-table-column
        prop="unit"
        align="center"
        :label="config.positionLabelB">
      </el-table-column>
      <el-table-column
        prop="room"
        align="center"
        :label="config.positionLabelC">
      </el-table-column>
      <el-table-column
        align="center"
        :label="$t('table.operating')">
        <template slot-scope="scope">
          <el-button v-if="source === 'DetectionRules'" type="text" @click="handleLine(scope.row.mac)">{{ $t('btns.select') + $t('table.line') }}</el-button>
          <el-button v-if="source === 'BuiltInTiming'" type="text" @click="handleMac(scope.row)">{{ $t('btns.select') + $t('control.device') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[20, 50, 100, 500]"
      :page-size="20"
      layout="sizes, prev, pager, next"
      :total="total">
    </el-pagination>
    <el-dialog :title="$t('dialog.channelList')" :visible.sync="dialogVisible" width="60%" append-to-body="true">
      <LineList :mac="mac" source="DetectionRules" v-if="dialogVisible"  @handleLineListClose="handleLineListClose"></LineList>
    </el-dialog>
  </div>
</template>
<script>
/* global config */
import LineList from '../Common/LineList'
import { queryBoxes } from '@/api/api'
export default {
  props: {
    source: {
      type: String,
      default: function () {
        return ''
      }
    },
    attrFlag: {
      type: String,
      default: function () {
        return ''
      }
    }
  },
  data () {
    return {
      ruleForm: {
        mac: ''
      },
      mac: '',
      data: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      dialogVisible: false,
      config: config
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.queryList()
    },
    queryList (mac) {
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        projectCode: this.$store.state.projectCode
      }
      if (mac) params.key = mac
      if (this.attrFlag) params.attrFlag = 'enableAdvancedTiming'
      queryBoxes(params)
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
    queryMac () {
      this.currentPage = 1
      this.queryList(this.ruleForm.mac)
    },
    handleLine (mac) {
      this.dialogVisible = true
      this.mac = mac
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.queryList(this.ruleForm.mac)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.queryList(this.ruleForm.mac)
    },
    handleLineClose () {
      this.dialogVisible = false
    },
    handleLineListClose () {
      this.$emit('handleDeviceClose')
    },
    handleMac (row) {
      this.$emit('sendBuiltInTimingMac', row.mac)
      this.$emit('sendBuiltInTimingName', row.name)
    }
  },
  components: {
    LineList
  }
}
</script>
<style lang="stylus" scoped>
.device-wrap
  border none
  border-top 1px solid #EBEEF5
  border-left 1px solid #EBEEF5
  color #606266
  >>> .el-table__header-wrapper, >>> .el-table__body-wrapper
        th, tr, td
          color #606266
          border-right 1px solid #EBEEF5
        td, th.is-leaf
          border-bottom 1px solid #EBEEF5
  .el-button--text
    color #409EFF
</style>
