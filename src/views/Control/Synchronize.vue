<template>
  <div>
    <el-col :span="15" class="mt-10">
      <el-button type="text" class="c-default" icon="el-icon-arrow-left" @click="handleBack">{{ $t('btns.back') }}</el-button>
      <span class="ml-20 fs-12">{{ $t('table.batchSyncDescription') }}</span>
    </el-col>
    <el-col :span="9" class="mt-10">
      <el-form ref="form" size="small" @submit.native.prevent :inline="true" :model="form" class="tr">
        <el-form-item>
          <el-input v-model="form.mac" @keyup.enter.native="queryList" :placeholder="$t('table.pleaseEnter') + $t('table.deviceNo')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="queryList">{{ $t('btns.query') }}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="24">
      <el-table
      size="small"
      :data="syncData"
      ref="multipleTable"
      :height="BuiltInTimingHeight"
      :max-height="BuiltInTimingHeight"
      v-el_scrollBar:scrollBar
      @sort-change="sortChange"
      @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="others.address" :label="$t('table.location')" align="center"></el-table-column>
        <el-table-column prop="mac" sortable :label="$t('table.deviceNo')" align="center">
          <template slot-scope="scope">
            <div>{{ scope.row.mac }}</div>
            <div>{{ scope.row.others.name }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="others.titles" :label="$t('table.line')" align="center"></el-table-column>
        <el-table-column sortable prop="weekday" :label="$t('table.cycle')" align="center"></el-table-column>
        <el-table-column sortable prop="time" :label="$t('dialog.time')" align="center"></el-table-column>
        <el-table-column sortable prop="status" :label="$t('control.action')" align="center">
           <template slot-scope="scope">
              <span v-if="scope.row.status === 0" >{{ $t('table.opening') }}</span>
              <span v-else >{{ $t('table.closing') }}</span>
           </template>
        </el-table-column>
        <el-table-column :label="$t('table.pushDownStatus')" align="center"  width="210">
          <template slot-scope="scope">
            <span :class="scope.row.pushStatus === 0 ? '' : 'c-default'" @click="toBuiltIn(scope.row)" >{{ scope.row.pushStatus === 0 ? $t('table.unissued') : ($t('table.pushed') + '(' + scope.row.pushTime + ')') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('control.action')" width="120" align="center">
          <template slot-scope="scope">
            <el-button  class="c-default" type="text" :disabled="scope.row.others.syncFlag === '1'" @click="handleSync(scope.row.id, scope.row)">{{ $t('table.push') }}
              <span class="c-pushing" v-if="scope.row.others.syncFlag === '1'">{{ '(' + $t('table.pushing') + ')' }}</span>
              <span class="c-notProcess" v-if="scope.row.others.syncFlag === '2'">{{ '(' + $t('message.notProcess') + ')' }}</span>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col class="tc mt-5">
      <el-button size="mini" :disabled="syncDisable" @click="handleSyncToDevice">{{ $t('table.batchPushToDevices') }}</el-button>
      <el-pagination
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 30]"
        :page-size="pageSize"
        small
        layout="sizes">
      </el-pagination>
      <el-button-group>
        <el-button size="mini" @click="handleCurrentChange('home')">{{ $t('system.home') }}</el-button>
        <el-button size="mini" @click="handleCurrentChange('prev')" :disabled="currentPage === 1">{{ $t('btns.prev') }}</el-button>
        <el-button size="mini" @click="handleCurrentChange('next')" :disabled="syncData === undefined || syncData.length !== pageSize">{{ $t('btns.next') }}</el-button>
      </el-button-group>
    </el-col>
  </div>
</template>
<script>
import { queryListData, queryListsync } from '@/api/api'
export default {
  props: ['paramsId'],
  data () {
    return {
      form: {
        mac: ''
      },
      syncDisable: false,
      currentPage: 1,
      pageSize: 20,
      syncData: [],
      multipleSelection: [],
      BuiltInTimingHeight: this.$store.state.BuiltInTimingHeight
    }
  },
  mounted () {
    this.queryList()
  },
  methods: {
    queryList () {
      this.$refs.multipleTable.clearSort()
      this.currentPage = 1
      this.queryListDatas()
    },
    queryListDatas (prop, order) {
      let params = {
        pageSize: this.pageSize,
        pageNo: this.currentPage,
        params: {
          sceneId: this.paramsId,
          mac: this.form.mac
        }
      }
      if (prop) {
        params.sortName = prop
        if (order === 'ascending') {
          params.order = 'asc'
        } else if (order === 'descending') {
          params.order = 'desc'
        }
      }
      queryListData(params)
        .then(res => {
          this.syncDisable = true
          if (res.success) {
            this.syncData = res.datas
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
    sortChange ({column, prop, order}) {
      this.queryListDatas(prop, order)
    },
    toBuiltIn (row) {
      if (row.pushStatus === 1) {
        this.$router.push({
          name: 'BuiltInTiming',
          params: {
            mac: row.mac
          }
        })
      }
    },
    handleBack () {
      this.$emit('handleBatchBack')
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.syncDisable = val.length > 0 ? !1 : !0
    },
    handleSyncToDevice () {
      let params = this.multipleSelection.map(item => {
        return item.id
      })
      this.handleSync(params.toString(), this.multipleSelection)
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.queryList()
    },
    handleSync (id, row) {
      let that = this
      queryListsync({ids: id})
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('message.controlSuccess'),
              type: 'success'
            })
            if (row.length > 1) {
              row.forEach(element => {
                if (element.timerAutoid === 0) {
                  element.others.syncFlag = '1'
                }
              })
            } else {
              row.others.syncFlag = '1'
            }
          } else if (res.code === '-1') {
          } else {
            let message = ''
            if (res.data) {
              for (let elem of res.data) {
                if (elem.errorMsg === '0') {
                  message += '<div class="c-success tl">' + elem.mac + '：' + this.$t('message.processing') + '</div>'
                  row.map(element => {
                    if (elem.mac === element.mac && element.timerAutoid === 0) {
                      element.others.syncFlag = '1'
                    }
                  })
                } else {
                  message += '<div class="c-danger tl">' + elem.mac + '：' + elem.errorMsg + '</div>'
                }
              }
            } else {
              message = res.message
            }
            that.$alert(message, '', {
              dangerouslyUseHTMLString: true,
              showConfirmButton: false,
              customClass: 'alert-content',
              callback: action => {}
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
    handleCurrentChange (e) {
      if (e === 'home') {
        this.currentPage = 1
      } else if (e === 'prev') {
        if (this.currentPage !== 1) {
          this.currentPage -= 1
        } else {
          return false
        }
      } else if (e === 'next') {
        this.currentPage += 1
      }
      this.queryListDatas()
    }
  },
  watch: {
    '$store.state.BuiltInTimingHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.BuiltInTimingHeight.height = newVal
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.el-pagination
  padding 0
  margin-top 0
  display inline-block
  vertical-align middle
  .el-pagination__sizes, >>> span:not([class*=suffix]), >>> .el-input__inner
    margin-right 0
    height 28px
.c-pushing
  color #E6A23C !important
  &:hover
    color #409EFF !important
.c-notProcess
  color #F56C6C !important
  &:hover
    color #409EFF !important
</style>
