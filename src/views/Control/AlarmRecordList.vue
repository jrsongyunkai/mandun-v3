<template>
  <div id="record-list">
    <div>
      {{ $t('home.alarm') + $t('control.recording') }}
      <i class="iconfont icon-gengduo" @click="handleMore"></i>
    </div>
    <el-col ref="box" style="overflow: hidden;">
      <el-table
        :data="tableData"
        height="200"
        v-el_scrollBar:scrollBar
        style="width: 100%;margin-top: 10px">
        <el-table-column
          prop="id"
          align="center"
          :label="$t('table.jobNumber')">
        </el-table-column>
        <el-table-column
          prop="others.address"
          align="center"
          :label="$t('table.location')">
        </el-table-column>
        <el-table-column
          prop="dateTime"
          align="center"
          :label="$t('table.alarmTime')"
          width="170px">
        </el-table-column>
        <el-table-column
          prop="node"
          align="center"
          :label="equipmentType === 11 ? $t('table.node') : $t('table.line')"
          width="80px">
        </el-table-column>
        <el-table-column
          prop="info"
          align="center"
          :label="$t('table.alarmType')">
            <template slot-scope="scope">
              <el-tooltip effect="dark" :content="scope.row.info" placement="right">
                <span>{{scope.row.info}}</span>
              </el-tooltip>
            </template>
        </el-table-column>
        <el-table-column :label="$t('home.value')"
          prop="valueDescribe"
          align="center"
          width="100">
            <template slot-scope="scope">
              <el-popover placement="top" width="250" trigger="click" :content="alarmInfo">
                <i
                  class="el-icon-news"
                  slot="reference"
                  v-show="scope.row.others.valueDescribe !== '' && JSON.stringify(scope.row.valueDescribe) !== '{}'"
                  @click="handleValue(scope.row.others.valueDescribe)"
                ></i>
              </el-popover>
            </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('table.schedule')">
            <template slot-scope="scope">
              <el-progress
                :text-inside="true"
                :stroke-width="18"
                :show-text="false"
                :class="scope.row.processStatus === 2 ? 'solved' : 'rejected'"
                :percentage="100"
                v-if="scope.row.others.progress > 100"
              ></el-progress>
              <el-progress
                v-else
                :text-inside="true"
                :stroke-width="18"
                :show-text="false"
                :class="scope.row.processStatus === 2 ? 'solved' : 'rejected'"
                :percentage="scope.row.others.progress"
              ></el-progress>
            </template>
        </el-table-column>
        <el-table-column
          align="center"
          :label="$t('table.timeConsuming')"
          width="100px">
            <template slot-scope="scope">
              <span
                :class="scope.row.passTime === '48' ? 'danger-text' : 'warning-text'"
              >{{ scope.row.others.passTime + $t('table.hour') }}</span>
            </template>
        </el-table-column>
        <el-table-column
          prop="processStatus"
          :label="$t('table.status')"
          align="center"
          width="120px">
          <template slot-scope="scope">
            <el-button type="text" v-if="scope.row.processStatus === 0" @click="handleUrge(scope.row.id)">{{ $t('table.urge') }}</el-button>
            <span class="pointer" @click="queryMaintenance(scope.row)" :class="scope.row.processStatus === 0 ? 'c-danger' : 'c-success'">{{ scope.row.processStatus === 0 ? $t('home.unprocessed') : $t('home.processed') }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <el-dialog
      :title="$t('control.maintenance') + $t('control.edit')"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible" append-to-body :modal="false" @close="closeMaintenance">
      <MaintenanceBox
      v-if="dialogVisible"
      v-on:close-maintenance="closeMaintenance"
      :maintenanceBoxObj="maintenanceBoxObj"
      ></MaintenanceBox>
    </el-dialog>
  </div>
</template>
<script>
import store from '@/store'
import MaintenanceBox from '../Home/MaintenanceBox'
import { queryAlarmByBox, findMaintenance, alarmUrgePush } from '@/api/api'
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
      tableData: [],
      alarmInfo: '',
      page: 1,
      loadMore: true,
      dialogVisible: false,
      maintenanceBoxObj: {}
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.$route.path === '/ConfigurationList') return false
      this.queryAlarm(false)
    },
    queryAlarm (flag) {
      let params = {
        limit: 10,
        typeNumbers: '',
        mac: this.mac
      }
      queryAlarmByBox(params)
        .then(res => {
          if (res.success) {
            if (flag) {
              if (res.datas.length === 0) {
                this.loadMore = false
                return false
              } else {
                this.loadMore = true
              }
              this.tableData = this.tableData.concat(res.datas)
            } else {
              this.tableData = res.data
              this.loadMore = true
            }
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
    listenDistance () {
      let that = this
      const selectWrap = document.querySelector('#record-list .el-table__body-wrapper')
      if (selectWrap) {
        selectWrap.addEventListener('scroll', function () {
          const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
          if (scrollDistance === 0 && that.loadMore) {
            setTimeout(() => {
              that.page += 1
              that.queryAlarm(true)
              that.loadMore = false
            }, 1000)
          }
        })
      }
    },
    handleValue (obj) {
      let type = ''
      let signal = ''
      if (obj.elecType === 1) {
        type = this.$t('main.watt')
      } else if (obj.elecType === 2) {
        type = this.$t('main.ampere')
      } else if (obj.elecType === 3) {
        type = this.$t('menu.leakageCurrent')
      } else if (obj.elecType === 4) {
        type = this.$t('menu.temperature')
      } else if (obj.elecType === 5) {
        type = this.$t('main.volt')
      } else if (obj.elecType === 8) {
        type = this.$t('main.lightningCurrent')
      } else if (obj.elecType === 9) {
        signal = this.$t('control.signal')
        type = this.$t('main.volt')
      } else if (obj.elecType === 10) {
        type = this.$t('menu.humidity')
      } else if (obj.elecType === 11) {
        type = this.$t('stralsund.concentration')
      } else if (obj.elecType === 12) {
        type = this.$t('echarts.illumination') + this.$t('echarts.celsius')
      } else if (obj.elecType === 14) {
        type = this.$t('table.waterVolume')
      }
      if (obj.elecType === 9) {
        this.alarmInfo = [`${type}(${obj.unit1}): ${obj.value1},\xa0${signal}(${obj.unit2}): ${obj.value2}`]
      } else if (obj.elecType === 8) {
        this.alarmInfo = [`${type}(${obj.unit}): ${obj.value} ${obj.elecType === 8 ? '' : ('(' + this.$t('table.threshold') + ':' + obj.threshold + ')')}`,
          `${obj.groundWire !== undefined ? this.$t('main.groundState') + ': ' + (obj.groundWire === 0 ? this.$t('control.normal') : this.$t('control.abnormal')) : ''}`,
          `${obj.spd !== undefined ? 'SPD: ' + (obj.spd === 0 ? this.$t('control.normal') : this.$t('control.abnormal')) : ''}`,
          `${obj.occurTime ? this.$t('main.surgeTime') + ': ' + (obj.occurTime ? obj.occurTime : '') : ''}`]
      } else if (obj.elecType === 10) {
        this.alarmInfo = `${type}: ${obj.value}${obj.unit + 'RH'} ${'(' + this.$t('table.threshold') + ':' + obj.threshold + ')'}`
      } else if (obj.elecType === 11) {
        this.alarmInfo = `${type}: ${obj.value}${obj.unit} ${'(' + this.$t('table.threshold') + ':' + obj.threshold + ')'}`
      } else if (obj.elecType === 12) {
        this.alarmInfo = `${type}: ${obj.value + 'Lux'} ${'(' + this.$t('table.threshold') + ':' + obj.threshold + ')'}`
      } else if (obj.elecType === 14) {
        this.alarmInfo = `${type}: ${obj.value1 + obj.unit1}`
      } else {
        this.alarmInfo = `${type}: ${obj.value}${obj.unit} ${'(' + this.$t('table.threshold') + ':' + obj.threshold + ')'}`
      }
    },
    handleMore () {
      this.$router.push({
        name: 'Alarms',
        params: {
          projectCode: this.$store.state.projectCode,
          mac: this.mac,
          typeNumber: '-100',
          status: '',
          oqp2: ''
        }
      })
    },
    queryMaintenance (obj) {
      let params = {
        mac: obj.mac,
        alarmId: obj.id,
        id: ''
      }
      findMaintenance(params)
        .then(res => {
          if (res.success) {
            store.commit('maintenanceObj', res.data)
            store.commit('alarmId', obj.id)
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
    closeMaintenance () {
      store.dispatch('resetMaintenanceObj')
      this.dialogVisible = false
      this.init()
      this.$emit('clickAlarm')
    },
    handleUrge (id) {
      alarmUrgePush({ id: id })
        .then(res => {
          this.$message({
            message: res.message,
            type: res.code === '0' ? 'success' : 'error'
          })
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
  },
  watch: {
    '$store.state.detailsAddr': {
      handler (newVal, oldVal) {
        if (newVal) {}
      }
    },
    '$route': 'init'
  },
  components: {
    MaintenanceBox
  }
}
</script>
<style lang="stylus" scoped>
.icon-gengduo
  vertical-align middle
</style>
