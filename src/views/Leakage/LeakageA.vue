<template>
    <div id="leakageA">
      <el-row class="pickDate">
      <template>
        <div class="block" v-show="datePicker === 'day'">
          <span class="demonstration">{{ $t('main.date') }}</span>
          <el-date-picker
          v-model="value"
          type="date"
          value-format="yyyy-MM-dd"
          @change="handleDayPicker">
          </el-date-picker>
        </div>
        <div class="block" v-show="datePicker === 'month'">
          <span class="demonstration">{{ $t('main.date') }}</span>
          <el-date-picker
          v-model="month"
          value-format="yyyy-MM"
          @change="handleMonthPicker"
          type="month">
          </el-date-picker>
        </div>
      </template>
        <div class="block">
        <el-button type="success" v-show="datePicker === 'day'" circle @click="datePicker = 'day'">{{ $t('main.day') }}</el-button>
        <el-button type="info" v-show="datePicker !== 'day'" circle @click="datePicker = 'day'">{{ $t('main.day') }}</el-button>
        <el-button type="success" v-show="datePicker === 'month'" circle @click="datePicker = 'month'">{{ $t('main.month') }}</el-button>
        <el-button type="info" v-show="datePicker !== 'month'" circle @click="datePicker = 'month'">{{ $t('main.month') }}</el-button>
        </div>
      </el-row>
      <line-chart :options="options" v-if="flag"></line-chart>
      <el-col>
        <el-table
          :data="tableData"
          max-height="280"
          style="width: 100%;margin-top: 10px">
          <el-table-column
            prop="address"
            align="center"
            :label="$t('table.location')">
          </el-table-column>
          <el-table-column
            prop="mac"
            width="130px"
            align="center"
            :label="$t('table.deviceNo')">
          </el-table-column>
          <el-table-column
            prop="channel"
            align="center"
            :label="$t('table.line')">
          </el-table-column>
          <el-table-column
            prop="time"
            align="center"
            :label="$t('home.warning') + $t('dialog.time')">
          </el-table-column>
        </el-table>
        <el-col :span="24">
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
        </el-col>
      </el-col>
    </div>
</template>
<script>
import { temperatureW, temperatureWDetail } from '@/api/api'
import LineChart from '../Common/Line'
export default {
  data () {
    return {
      flag: false,
      loading: false,
      datePicker: 'day',
      dateType: 1,
      date: '',
      value: this.$func.getNowFormatDate(),
      month: '',
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      currentPage: 1,
      total: 0,
      options: {
        xAxis: [],
        series: [],
        title: {
          show: true,
          text: '24小时漏电预警情况'
        }
      }
    }
  },
  mounted () {
    this.init()
    this.queryList()
  },
  methods: {
    init () {
      this.options.xAxis = []
      this.options.series = []
      let params = {
        typeNumbers: 12,
        dateType: this.dateType,
        date: this.date ? this.date : this.$func.getNowFormatDate(),
        projectCode: this.$store.state.projectCode
      }
      this.$nextTick(function () {
        let data = []
        let that = this
        temperatureW(params)
          .then(res => {
            res.data.forEach(function (item, index) {
              that.options.xAxis.push(item.time)
              data.push(item.number)
            })
            this.options.series.push({name: '漏电预警数量（单位：条）', type: 'line', data: data, smooth: true, itemStyle: {normal: {areaStyle: {type: 'default'}, color: '#08BEC1'}}, symbol: 'emptyCircle'})
            this.flag = true
          })
          .catch(err => {
            if (err) {
              this.$message({
                message: this.$t('message.unknown'),
                type: 'error'
              })
            }
          })
      })
    },
    queryList (e) {
      this.$nextTick(function () {
        let params = {
          page: this.pageNo,
          rows: this.pageSize,
          typeNumbers: 12,
          dateType: this.dateType,
          date: this.date ? this.date : this.$func.getNowFormatDate(),
          projectCode: this.$store.state.projectCode
        }
        temperatureWDetail(params)
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
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.queryList()
    },
    handleCurrentChange (val) {
      this.pageNo = val
      this.queryList()
    },
    handleDayPicker (val) {
      this.dateType = 1
      this.date = val
      this.value = val
      this.options.title.text = '24小时漏电预警情况'
      this.init()
      this.queryList()
    },
    handleMonthPicker (val) {
      this.dateType = 2
      this.date = val
      this.month = val
      this.options.title.text = this.$func.getMonthText(val) + '漏电预警情况'
      this.init()
      this.queryList()
    }
  },
  components: {
    LineChart
  }
}
</script>
<style lang="stylus" scoped>
#leakageA
    height: 370px
</style>
