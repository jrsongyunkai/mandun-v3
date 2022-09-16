<template>
  <div id="first-choice" class="mt-20">
    <el-row>
      <el-col :span="18">
        <i class="el-icon-plus pointer c-default" @click="handleAddProject">{{ $t('system.add') }}</i>
        <span class="first-choice-tip ml-20 c-warning">{{ $t('dialog.prompt') + '：' + $t('dialog.firstChoiceTips') }}</span>
      </el-col>
      <el-col :span="6" class="tr">
        <el-input style="width: 184px" v-model="projectName"  size="small" :placeholder="$t('table.pleaseEnter') + $t('table.projectName')"></el-input>
        <el-button size="small" type="primary" @click="onSubmit">{{ $t('btns.query') }}</el-button>
      </el-col>
    </el-row>
    <el-table
    :data="data"
    style="width: 100%">
      <el-table-column
        prop="projectName"
        :label="$t('table.project')"
        align="center"
        width="300">
      </el-table-column>
      <el-table-column
        :label="$t('table.attitude')"
        align="center"
        :width="$i18n.locale === 'zh' ? 100 : 150">
        <template slot-scope="scope">
          <el-select v-model="scope.row.acceptType" size="mini">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        :label="$t('table.alarmTypes')">
        <template slot-scope="scope">
          <span class="tag-add pointer c-default" @click="handleAddAlarm(scope.row.alarmList, scope.$index)">{{ $t('system.add') }}</span>
          <el-tag
            size="medium"
            v-for="tag in scope.row.alarmList"
            :key="tag.typeNumber"
            closable
            :disable-transitions="false"
            @close="handleTypesClose(scope.row.alarmList, tag)">
            {{ tag.alarmInfo }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        :width="$i18n.locale === 'zh' ? 120 : 160"
        :label="$t('table.frequencyLimit')">
        <template slot-scope="scope">
          <el-input size="mini" v-if="scope.row.acceptType === 1" v-model.number.trim="scope.row.frequence" @input="handleFrequence" :placeholder="$t('table.pleaseEnter')"></el-input>
        </template>
      </el-table-column>
      <el-table-column width="100" :label="$t('table.operating')">
        <template slot-scope="scope">
          <el-button type="text" size="mini" class="c-default" @click="handleSave(scope.row)">{{ $t('btns.save') }}</el-button>
          <el-button type="text" size="mini" class="c-default" @click="handleDel(scope.row, scope.$index)">{{ $t('btns.remove') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="10"
      layout="slot">
    </el-pagination>
    <div class="tc">
      <el-button-group>
        <el-button size="small" @click="handlePage('home')">{{ $t('system.home') }}</el-button>
        <el-button size="small" icon="el-icon-arrow-left"  @click="handlePage('prev')" :disabled="lastId < 1">{{ $t('btns.prev') }}</el-button>
        <el-button size="small" @click="handlePage('next')" :disabled="length < 10">{{ $t('btns.next') }}<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </el-button-group>
    </div>
    <el-dialog :title="$t('dialog.alarmTypeSelection')" :modal="false" :visible.sync="flag" top="30vh" @close="handleSaveTypes">
      <checkbox-group v-model="alarmTypeList" ref="typesCheckboxGroup"></checkbox-group>
    </el-dialog>
    <el-dialog :title="$t('dialog.projectSelection')" :close-on-click-modal="false" :modal="false" :visible="projectsFlag" class="project-selection" top="30vh" @close="handleCloseProjects">
      <project-select v-model="projectLists" @closeProjects="projectsFlag = false" type="firstChoice"></project-select>
    </el-dialog>
  </div>
</template>
<script>
import projectSelect from './../Common/ProjectSelect'
import CheckboxGroup from '../Common/CheckboxGroup'
import { preferences, prjAlarmConfigDel, prjAlarmConfigSave } from '@/api/api'
export default {
  data () {
    return {
      data: [],
      index: 0,
      length: 0,
      options: [
        {
          value: 1,
          label: this.$t('table.receive')
        },
        {
          value: 2,
          label: this.$t('table.throwAway')
        }
      ],
      projectsFlag: false,
      projectLists: [],
      flag: false,
      alarmTypeList: [],
      page: [],
      lastId: 0,
      projectName: ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.queryPreference()
    },
    onSubmit () {
      this.lastId = 0
      this.queryPreference()
    },
    queryPreference () {
      this.data = []
      this.length = 0
      let parmas = {
        keyword: this.projectName,
        pageSize: 10,
        lastId: this.lastId
      }
      preferences(parmas)
        .then(res => {
          if (res.success) {
            this.data = res.data
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
        .finally(() => {})
    },
    handlePage (e) {
      if (e === 'home') {
        this.lastId = 0
        this.page = []
      } else if (e === 'prev') {
        this.page.pop()
        if (this.page.length <= 0) {
          this.lastId = 0
        } else {
          this.lastId = this.page[this.page.length - 1]
        }
      } else if (e === 'next') {
        this.lastId = this.data[this.data.length - 1].id
        this.page.push(this.data[this.data.length - 1].id)
      }
      this.queryPreference()
    },
    handleAddProject () {
      if (this.length === this.data.length - 1) {
        this.$message({
          message: '请先点击表格中新添加项保存按钮后再点击添加',
          type: 'error'
        })
        return false
      }
      this.projectsFlag = true
      this.projectLists = []
    },
    handleCloseProjects () {
      this.projectsFlag = false
      this.projectLists.map((item, index) => {
        this.data.unshift({'acceptType': 1, 'projectCode': item.code, 'frequence': 60, alarmList: [], id: 0, projectName: item.name})
      })
    },
    handleAddAlarm (row, index, origin) {
      this.index = index
      this.alarmTypeList = row.map((item) => {
        return item.typeNumber
      })
      this.flag = true
      if (origin) {
        this.$nextTick(() => {
          this.$refs.typesCheckboxGroup.changeList(origin)
        })
      }
    },
    handleSaveTypes () {
      let cfg = this.$store.state.alarmForConfig
      this.data[this.index].alarmList = []
      cfg.forEach((value) => {
        this.alarmTypeList.forEach((item) => {
          if (value.typeNumber === item) {
            this.data[this.index].alarmList.push({typeNumber: value.typeNumber, alarmInfo: value.info})
          }
        })
      })
      this.flag = false
    },
    handleTypesClose (row, tag) {
      let index = row.indexOf(tag)
      if (index > -1) row.splice(index, 1)
    },
    handleFrequence (val) {
      if (val < 0 || val > 2592000) {
        this.$message({
          message: this.$t('dialog.range') + '0 ~ 2592000',
          type: 'error'
        })
      } else {
        if (val === '') {
          this.$message({
            message: this.$t('message.required'),
            type: 'error'
          })
        }
      }
    },
    handleSave (row) {
      if (row.alarmList.length === 0 || row.frequence === '') {
        this.$message({
          message: this.$t('message.atLeastOneItem'),
          type: 'error'
        })
        return false
      }
      if (row.frequence < 0 || row.frequence > 2592000) {
        this.$message({
          message: this.$t('dialog.range') + '0 ~ 2592000',
          type: 'error'
        })
        return false
      }
      row.typeNumbers = row.alarmList.map((item) => {
        return item.typeNumber
      })
      row.typeNumbers = row.typeNumbers.join(',')
      delete row.projectName
      delete row.alarmList
      prjAlarmConfigSave(row)
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.queryPreference()
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
    handleDel (row, index) {
      if (row.id === 0) {
        this.data.splice(index, 1)
      } else {
        this.$confirm(this.$t('message.confirmDeleteConfig'), this.$t('dialog.prompt'), {
          confirmButtonText: this.$t('btns.ok'),
          cancelButtonText: this.$t('btns.cancel'),
          type: 'warning'
        }).then(() => {
          prjAlarmConfigDel({id: row.id, projectCode: row.projectCode})
            .then(res => {
              if (res.success) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
                this.queryPreference()
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
      }
    }
  },
  components: {
    projectSelect,
    CheckboxGroup
  }
}
</script>
<style lang="stylus" scoped>
.el-icon-plus
  font-size 12px
.first-choice-tip
  font-size 14px
.el-tag + .el-tag
  margin 0 0 5px 5px
.el-tag
  color #fff
  background transparent
.el-button--small
  font-size 14px
.el-pagination
  padding 0 5px
  margin-top 0
  display inline-block
  vertical-align middle
  .el-pagination__sizes, >>> span:not([class*=suffix]), >>> .el-input__inner
    margin-right 0
    height 34px
.block
  .el-pagination
    height 34px
    line-height 34px
  .el-date-editor.el-input__inner
    width 250px
</style>
