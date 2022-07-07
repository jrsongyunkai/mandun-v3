<template>
    <div id="RegionalRelationshipBinding">
        <el-row>
            <el-col :span="20">
                <el-col :span="24" class="mb-20">{{ '当前绑定' + '：'}} <span v-for="(v, f) in list" :key="f">{{ v + '\xa0\xa0\xa0' }}</span><span v-if="list.length > 0" @click="closeNodeTree"><i class="pointer ml-10 c-hover fs-14 el-icon-close"></i></span></el-col>
            </el-col>
            <el-col :span="20">
                <el-input v-model="input" size="small" placeholder="请输入关键字进行过滤"></el-input>
            </el-col>
            <el-col :span="4">
                <el-button class="ml-15" type="primary" size="small" @click="handleSeekAreaListTree">查询</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-table
              :data="tableData"
              height="440px"
              ref="Table"
              v-el_scrollBar:scrollBar
              class="device-wrap mt-10"
              style="width: 100%"
              :row-key="(row) => { return row.id }"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              @selection-change="handleSelectionChange"
              @current-change="currentChange">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                prop="areaName"
                label="区域层级">
              </el-table-column>
              <el-table-column
                align="center"
                prop="area"
                label="建筑面积(m²)">
              </el-table-column>
              <el-table-column
                align="center"
                prop="persons"
                label="用能人数">
              </el-table-column>
            </el-table>
        </el-row>
        <el-row class="tr mt-10">
          <el-button size="small" @click="handleInformationClose">{{ $t('btns.cancel2') }}</el-button>
          <el-button size="small" type="primary" @click="submitInformation">{{ $t('btns.ok2') }}</el-button>
        </el-row>
    </div>
</template>

<script>
import { seekAreaListTreeByProject, addAreaBoxMapping, seekAreaBoxMapping, delAreaBoxMapping } from '@/api/api'
export default {
  components: {},
  props: {
    resId: String
  },
  data () {
    return {
      input: '',
      tableData: [],
      resList: [],
      list: [],
      areaList: []
    }
  },
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.handleSeekAreaListTree()
    },
    handleSeekAreaListTree () {
      seekAreaListTreeByProject({searchName: this.input})
        .then(res => {
          if (res.success) {
            this.tableData = res.data
            this.handleViewRelationships()
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }).catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    },
    handleViewRelationships () {
      seekAreaBoxMapping({resId: this.resId})
        .then(res => {
          if (res.success) {
            if (JSON.stringify(res.data) !== '{}' && (res.data[this.resId]).length > 0) {
              this.areaList = res.data[this.resId].split(',')
              this.setTowName(this.tableData, (res.data[this.resId]).split(','))
              if (this.list.length > 1) {
                for (let i in this.list) {
                  if (+i !== this.list.length - 1) {
                    this.list[i] = this.list[i] + '>'
                  }
                }
              }
            } else {}
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }).catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    },
    setTowName (datas, arr) {
      for (let i in datas) {
        for (let j in arr) {
          if (datas[i].id === +(arr[j])) {
            this.list.push(datas[i].areaName)
            if (datas[i].children) {
              this.setTowName(datas[i].children, arr)
            } else {
            }
          } else {
          }
        }
      }
    },
    closeNodeTree () {
      let parmas = {
        areaId: this.areaList[this.areaList.length - 1],
        resId: this.resId
      }
      delAreaBoxMapping(parmas)
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.list = []
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }).catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    },
    handleSelectionChange (val) {
      if (val.length > 1) {
        this.$refs.Table.clearSelection()
        this.$refs.Table.toggleRowSelection(val.pop())
      } else {
      }
      this.resList = val
    },
    currentChange (currentRow, oldCurrentRow) {
      this.$refs.Table.toggleRowSelection(currentRow)
    },
    submitInformation () {
      if (this.resList.length === 0) {
        this.$message({
          message: '请绑定区域关系',
          type: 'error'
        })
      }
      let parmas = {
        areaId: this.resList[0].id,
        resId: this.resId
      }
      addAreaBoxMapping(parmas)
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.handleInformationClose()
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }).catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    },
    handleInformationClose () {
      this.input = ''
      this.$emit('handleClose')
    }
  },
  watch: {}
}
</script>

<style lang="stylus" scoped>
.device-wrap
  border none
  color #606266
  >>> .el-table__header-wrapper, >>> .el-table__body-wrapper
      th, tr, td
        color #606266
        border-bottom 1px solid #EBEEF5
      td, th.is-leaf
        border-bottom 1px solid #EBEEF5
/deep/ .el-table__header .el-table-column--selection .el-checkbox__inner
    display none !important
</style>
