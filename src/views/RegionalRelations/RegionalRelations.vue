<template>
    <div id="RegionalRelations">
      <el-row class="energy ml-10" :style="{height: height}">
        <el-col :span="24" class="mt-10 ml-10">
            <el-col :span="5"><el-input size="small" placeholder="请输入关键字进行过滤" v-model="searchName"></el-input></el-col>
            <el-col :span="10"><el-button class="ml-10" type="primary" size="small" @click="handleSeekAreaListTree">查询</el-button></el-col>
            <el-col :span="8" class="tr"><el-button class="mr-10 fs-14 c-default" type="text" size="small" @click="handleAddAreaList"><i class="el-icon-plus"></i>新增层级</el-button></el-col>
        </el-col>
        <el-col :span="24" class="mt-10">
            <el-table
              :data="tableData"
              :height="tableComponentHeight"
              :max-height="tableComponentHeight"
              v-el_scrollBar:scrollBar
              style="width: 100%;margin-bottom: 20px;"
              row-key="id"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
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
              <el-table-column
                align="center"
                label="操作">
                  <template slot-scope="scope">
                    <el-dropdown @command="handleCommand">
                      <span class="el-dropdown-link pointer el-icon-circle-plus-outline" style="color: #fff"></span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item disabled :command="beforeHandleCommand('up', scope.row)">新增上级</el-dropdown-item>
                        <el-dropdown-item :command="beforeHandleCommand('low', scope.row)">新增下级</el-dropdown-item>
                        <el-dropdown-item :command="beforeHandleCommand('mid', scope.row)">新增本级</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                    <span class="pointer el-icon-edit ml-5" @click="handleEdit(scope.row)"></span>
                    <span class="pointer el-icon-delete ml-5" @click="handleDelete(scope.row)"></span>
                  </template>
              </el-table-column>
            </el-table>
        </el-col>
      </el-row>
      <el-dialog
        :title="informationTitle"
        custom-class="custom-password"
        :modal="false"
        :close-on-click-modal="false"
        :visible.sync="informationFlag"
        width="600px"
        top="25vh"
        :before-close="handleBeforeClose">
        <el-form :model="informationForm" :rules="rules" ref="informationForm" size="small" :label-width="$i18n.locale === 'zh' ? '100px' : '140px'">
          <el-form-item required :label="'区域名称' + ':'" prop="name">
            <el-input v-model="informationForm.name" :placeholder="$t('table.pleaseEnter') + '区域名称'" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item required :label="'建筑面积' + ':'" prop="area">
            <el-input v-model="informationForm.area" :placeholder="$t('table.pleaseEnter') + '建筑面积'" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item required :label="'用能人数' + ':'" prop="persons">
            <el-input v-model="informationForm.persons" :placeholder="$t('table.pleaseEnter') + '用能人数'" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item class="tr">
            <el-button size="small" @click="handleInformationClose('informationForm')">{{ $t('btns.cancel2') }}</el-button>
            <el-button size="small" type="primary" @click="submitInformation('informationForm')">{{ $t('btns.ok2') }}</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
</template>

<script>
import { seekAreaListTreeByProject, energyAddArea, energyUpdateArea, energyDelArea } from '@/api/api'
export default {
  components: {},
  data () {
    return {
      height: this.$store.state.asideTowHeight,
      searchName: '',
      tableData: [],
      informationFlag: false,
      informationTitle: '',
      informationForm: {
        name: '',
        area: '',
        persons: ''
      },
      formRow: {},
      rules: {
        name: [
          {required: true, message: this.$t('table.pleaseEnter') + '区域名称', trigger: 'blur'}
        ],
        area: [
          {required: true, message: this.$t('table.pleaseEnter') + '建筑面积', trigger: 'blur'}
        ],
        persons: [
          {required: true, message: this.$t('table.pleaseEnter') + '用能人数', trigger: 'blur'}
        ]
      },
      tableComponentHeight: this.$store.state.asideHeight
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
      let params = {}
      if (this.searchName) {
        params.searchName = this.searchName
      }
      seekAreaListTreeByProject(params)
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
        }).catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    },
    handleAddAreaList () {
      this.informationTitle = '新增层级'
      this.informationFlag = true
      this.informationForm = {
        name: '',
        area: '',
        persons: ''
      }
      this.formRow.type = 'add'
    },
    beforeHandleCommand (command, row) {
      return {
        'command': command,
        'row': row
      }
    },
    handleCommand (command) {
      switch (command.command) {
        case 'up':
          this.handleUp(command.row)
          break
        case 'low':
          this.handlelow(command.row)
          break
        case 'mid':
          this.handleMid(command.row)
          break
      }
    },
    handleUp (row) {
      this.informationTitle = '新增上级'
      this.informationFlag = true
      this.formRow = row
      this.informationForm = {
        name: '',
        area: '',
        persons: ''
      }
      this.formRow.type = 'add'
    },
    handlelow (row) {
      this.informationTitle = '新增下级'
      this.informationFlag = true
      this.formRow = row
      this.informationForm = {
        name: '',
        area: '',
        persons: ''
      }
      this.formRow.type = 'low'
    },
    handleMid (row) {
      this.informationTitle = '新增本级'
      this.informationFlag = true
      this.formRow = row
      this.informationForm = {
        name: '',
        area: '',
        persons: ''
      }
      this.formRow.type = 'add'
    },
    handleEdit (row) {
      this.informationTitle = '编辑本级'
      this.informationFlag = true
      this.informationForm = {
        name: row.areaName,
        area: row.area,
        persons: row.persons
      }
      this.formRow = row
      this.formRow.type = 'edit'
    },
    handleDelete (row) {
      this.$confirm('此操作将永久删除该区域层级, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        energyDelArea({id: row.id})
          .then(res => {
            if (res.success) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.handleSeekAreaListTree()
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    submitInformation (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formRow.type === 'edit') {
            let parmas = {
              id: this.formRow.id,
              projectCode: this.$store.state.projectCode,
              parentId: this.formRow.parentId,
              areaName: this.informationForm.name,
              area: this.informationForm.area,
              persons: this.informationForm.persons
            }
            energyUpdateArea(parmas)
              .then(res => {
                if (res.success) {
                  this.$message({
                    message: res.message,
                    type: 'success'
                  })
                  this.handleSeekAreaListTree()
                  this.handleInformationClose(formName)
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
          } else {
            let parmas = {
              projectCode: this.$store.state.projectCode,
              parentId: this.formRow.type === 'low' ? this.formRow.id : this.formRow.parentId,
              areaName: this.informationForm.name,
              area: this.informationForm.area,
              persons: this.informationForm.persons
            }
            energyAddArea(parmas)
              .then(res => {
                if (res.success) {
                  this.$message({
                    message: res.message,
                    type: 'success'
                  })
                  this.handleSeekAreaListTree()
                  this.handleInformationClose(formName)
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
          }
        } else {
          return false
        }
      })
    },
    handleInformationClose (formName) {
      this.informationFlag = false
      this.informationForm = {
        name: '',
        area: '',
        persons: ''
      }
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
    handleBeforeClose (done) {
      this.$refs['informationForm'].resetFields()
      done()
    }
  },
  watch: {
    '$store.state.asideTowHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.height = newVal
        }
      }
    },
    '$store.state.asideHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.tableComponentHeight = newVal
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.pointer
  cursor pointer
/deep/ .custom-password .el-form-item__label
          color #606266
.energy
  border 2px solid #303a5ecc
  box-shadow 3px 3px 6px 1px rgba(0, 0, 0, .2)
  -webkit-border-radius 10px
  -moz-border-radius 10px
  border-radius 10px
</style>
