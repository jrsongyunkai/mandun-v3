<template>
  <div class="project-selection">
    <el-scrollbar style="height: 100%;">
      <el-form ref="form" :inline="true" size="small" :model="form" label-width="80px" @submit.native.prevent class="demo-form-inline">
        <el-form-item>
          <el-input v-model="form.name" :placeholder="$t('table.projectNumber') + '/Home' + $t('table.projectName')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">{{ $t('btns.query') }}</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="multipleTable"
        :data="tableData"
        :header-cell-class-name="cellStyle"
        tooltip-effect="dark"
        style="width: 100%"
        @select="handleSelection">
        <el-table-column
          v-if="type !== 'firstChoice'"
          type="selection"
          :selectable="handleSelectable">
        </el-table-column>
        <el-table-column
          v-if="type === 'firstChoice'"
          align="center"
          width="100"
          :label="$t('btns.select')">
          <template slot-scope="scope">
             <el-button type="plain" size="mini" @click="handleSelect(scope.row)">{{ $t('btns.select') }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="code"
          :label="$t('table.projectNumber')"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          :label="$t('table.projectName')"
          align="center">
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-scrollbar>
  </div>
</template>
<script>
import { listProjectForConfig } from '@/api/api'
export default {
  name: 'project-select',
  model: {
    prop: 'options',
    event: 'select-multiple'
  },
  props: {
    options: {
      type: Object,
      defalut () {
        return []
      }
    },
    type: {
      type: String,
      defalut () {
        return ''
      }
    }
  },
  data () {
    return {
      form: {
        name: ''
      },
      multipleSelection: [],
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      currentPage: 1,
      total: 0
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.initTable()
    },
    initTable () {
      let _this = this
      let params = {
        params: {
          keyword: this.form.name
        },
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      listProjectForConfig(params)
        .then(res => {
          if (res.success) {
            this.tableData = res.datas
            this.total = res.total
            this.$nextTick(function () {
              _this.checked()
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
    },
    checked () {
      let _this = this
      this.options.forEach((item) => {
        _this.tableData.forEach((value, index) => {
          if (value.code === item.code) {
            _this.$refs.multipleTable.toggleRowSelection(_this.tableData[index], true)
          }
        })
      })
    },
    handleSelection (val, row) {
      let _index = JSON.stringify(this.options).indexOf(JSON.stringify({code: row.code, name: row.name, others: {}}))
      if (_index === -1) {
        this.options.push({code: row.code, name: row.name, others: {}})
      } else {
        this.options.forEach((item, i) => {
          if (item.code === row.code) {
            this.options.splice(i, 1)
          }
        })
      }
      this.$message({
        message: this.$t('message.projectSelect') + ' "' + row.name + '"',
        type: 'info'
      })
      this.$emit('select-multiple', this.options)
    },
    handleSelectable (row, index) {
      let _index = JSON.stringify(this.options).indexOf(JSON.stringify({code: row.code, name: row.name, others: {}}))
      return _index === -1
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.initTable()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.initTable()
    },
    cellStyle (row) {
      if (row.columnIndex === 0 && this.type !== 'firstChoice') {
        return 'choose-cell'
      }
    },
    onSubmit () {
      this.initTable()
    },
    handleSelect (val) {
      this.$message({
        message: this.$t('message.projectSelect') + ' "' + val.name + '"',
        type: 'info'
      })
      this.options = []
      this.options.push(val)
      this.$emit('select-multiple', this.options)
      this.$emit('closeProjects')
    }
  },
  watch: {
    'options': {
      handler (newVal, oldVal) {
        this.initTable()
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.project-selection
    height 400px
.el-table, .el-table >>> th, .el-table >>> td
    border 1px solid #ebeef5
    color #909399
.el-table >>> .choose-cell .cell
    .el-checkbox__inner
        display none
        position relative
    &::before
        content '选择'
        position absolute
        right 8px
</style>
