<template>
  <div id="maintenance">
    <div v-if="$route.path !== '/MaintenanceRecords'">
      {{ $t('control.maintenance') + $t('control.recording') }}
      <i @click="handleMaintenance" class="iconfont icon-icon-import"></i>
      <i @click="handleMore" class="iconfont icon-gengduo"></i>
    </div>
    <el-row :gutter="20" :style="$route.path !== '/MaintenanceRecords' ? {margin: 0} : {margin: 0, padding:'20px'}">
      <el-col>
        <el-breadcrumb separator-class="el-icon-arrow-right" v-if="$route.path === '/MaintenanceRecords'">
          <el-breadcrumb-item class="pointer" @click.native="$router.go(-1)">{{ $t('btns.back') }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $t('control.maintenance') + $t('control.recording') }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-col class="tr mt-20">
          <el-form
            v-if="$route.path === '/MaintenanceRecords'"
            :inline="true"
            size="small"
            :model="maintenance"
            class="demo-form-inline tr"
            @submit.native.prevent
          >
            <el-form-item>
              <el-button :type="datePicker === 'day' ? 'success' : 'info'" circle @click="handleDatePicker('day')">{{ $t('main.day') }}</el-button>
              <el-button :type="datePicker === 'month' ? 'success' : 'info'" circle @click="handleDatePicker('month')">{{ $t('main.month') }}</el-button>
              <span class="block" v-show="datePicker === 'day'">
                <span class="demonstration">{{ $t('main.date') }}</span>
                  <el-date-picker
                  v-model="maintenance.day"
                  type="date"
                  :editable="false"
                  value-format="yyyy-MM-dd"
                  @change="handleChangeDate">
                  </el-date-picker>
                </span>
                <span class="block" v-show="datePicker === 'month'">
                <span class="demonstration">{{ $t('main.date') }}</span>
                  <el-date-picker
                  v-model="maintenance.month"
                  value-format="yyyy-MM"
                  type="month"
                  :editable="false"
                  @change="handleChangeDate">
                  </el-date-picker>
                </span>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="maintenance.mac"
                @keyup.enter.native="handleQueryRecords"
                :placeholder="$t('placeholder.enterDeviceNo')"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleQueryRecords">{{ $t('btns.query') }}</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-table
          :data="tableData"
          :height="$route.path === '/MaintenanceRecords' ? powerTableHeight : 200"
          v-el_scrollBar:scrollBar
          style="width: 100%;margin-top: 10px">
          <el-table-column
            prop="projectName"
            align="center"
            v-if="$store.state.systemFlag === 'MaintenanceRecords'"
            :label="$t('table.projectName')">
          </el-table-column>
          <el-table-column
            prop="mac"
            align="center"
            v-if="$store.state.systemFlag === 'MaintenanceRecords'"
            :label="$t('table.deviceNo')">
          </el-table-column>
          <el-table-column
            prop="addres"
            align="center"
            :label="$t('table.location')">
          </el-table-column>
          <el-table-column
            prop="maintenanceTime"
            align="center"
            :label="$t('control.maintenance') + $t('dialog.time')">
          </el-table-column>
          <el-table-column
            prop="handlerName"
            align="center"
            :label="$t('control.process') + $t('control.staff')">
          </el-table-column>
          <el-table-column
            prop="telephone"
            align="center"
            :label="$t('table.contactNumber')">
          </el-table-column>
          <el-table-column :label="$t('control.process') + $t('control.contentResult')" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.handledResult }}</span>
              </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.operating')"
            align="center"
            width="100">
            <template slot-scope="scope">
              <span class="pointer" @click="handleView(scope.row)">{{ $t('btns.view') }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="block tc mt-10">
          <el-pagination
            v-if="$route.path === '/MaintenanceRecords'"
            background
            @current-change="handleCurrentChange"
            @size-change="handleSize"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            small
            layout="total, sizes, prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :title="$t('control.maintenance') + $t('control.edit')" :close-on-click-modal="false"
      :visible.sync="dialogVisible" append-to-body :modal="false" @close="closeMaintenance">
      <MaintenanceBox
      v-if="dialogVisible"
      :maintenanceBoxObj="maintenanceBoxObj"
      v-on:close-maintenance="closeMaintenance"
      ></MaintenanceBox>
    </el-dialog>
  </div>
</template>
<script>
import store from '@/store'
import MaintenanceBox from '../Home/MaintenanceBox'
import { listMaintenance, findMaintenance } from '@/api/api'
export default {
  props: {
    mac: {
      type: String
    },
    equipmentType: {
      type: Number
    }
  },
  data () {
    return {
      maintenance: {
        mac: this.$store.state.mac,
        day: this.$func.getNowFormatDate(),
        month: this.$func.getCurrentYearMonth()
      },
      dialogVisible: false,
      maintenanceBoxObj: {},
      datePicker: 'day',
      tableData: [],
      currentPage: 1,
      pageSize: this.$route.path === '/MaintenanceRecords' ? 20 : 10,
      powerTableHeight: this.$store.state.powerTableHeight
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.queryRecords()
    },
    queryRecords () {
      let params = {
        projectCode: this.$route.params.projectCode ? this.$route.params.projectCode : this.$store.state.projectCode,
        mac: this.maintenance.mac,
        dateType: this.datePicker === 'day' ? '1' : '2',
        date: this.datePicker === 'day' ? this.maintenance.day : this.maintenance.month,
        page: this.currentPage,
        rows: this.pageSize
      }
      listMaintenance(params)
        .then(res => {
          if (res.success) {
            this.tableData = res.datas
            this.total = res.total
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
        .finally(() => {
          this.loading = false
        })
    },
    handleMore () {
      this.$router.push({
        name: 'MaintenanceRecords',
        params: {
          projectCode: ''
        }
      })
    },
    handleDatePicker (val) {
      this.datePicker = val
      this.queryRecords()
    },
    handleMaintenance () {
      store.commit('alarmId', '')
      this.dialogVisible = true
    },
    handleView (obj) {
      let params = {
        mac: obj.mac,
        alarmId: '',
        id: obj.id
      }
      findMaintenance(params)
        .then(res => {
          if (res.success) {
            store.commit('maintenanceObj', res.data)
            this.maintenanceBoxObj = obj
            if (!this.maintenanceBoxObj.equipmentType) this.maintenanceBoxObj.equipmentType = this.equipmentType
            this.dialogVisible = true
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
        .catch(res => {
          this.$message({
            message: this.$('message.unknown'),
            type: 'error'
          })
        })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.queryRecords()
    },
    handleSize (val) {
      this.currentPage = 1
      this.pageSize = val
      this.queryRecords()
    },
    handleQueryRecords () {
      this.currentPage = 1
      this.queryRecords()
    },
    closeMaintenance () {
      store.dispatch('resetMaintenanceObj')
      this.queryRecords()
      this.dialogVisible = false
    }
  },
  watch: {
    '$route' (to, from) {
      if (from.path === '/MaintenanceBox') this.queryRecords()
    }
  },
  components: {
    MaintenanceBox
  }
}
</script>
<style lang="stylus" scoped>
.block
  >>> .el-pagination .btn-prev, >>> .el-pagination .btn-next, >>> .el-pager li
    background transparent
    color #fff
  &:disabled
    background transparent
  >>> .el-pager li.active
    color #409EFF
  >>> .el-pagination__jump
    color #fff
</style>
