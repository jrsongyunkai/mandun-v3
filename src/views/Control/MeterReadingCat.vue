<template>
    <div id="IntelligentWaterMeter">
        <el-col :span="10" class="box-wrap">
          <el-row class="tc">
            <div class="primary-wrap pointer" v-if="false" @click="handelMeterReading">
              <el-col class="tc">
                <i class="primary-icon iconfont icon-chaobiao"></i>
                <p class="primary-title">{{ $t('control.meterReading') }}</p>
              </el-col>
            </div>
            <div class="box-border" v-if="false"></div>
            <div class="box">
              <el-col class="tc" style="line-height: 70px">
                  <span class="block">最新抄表度数：</span>
                  <span class="block">{{ lastScale + $t('table.ton') }}</span>
              </el-col>
            </div>
          </el-row>
        </el-col>
        <el-col :span="14">
            <el-table
              :data="tableData"
              v-el_scrollBar:scrollBar
              max-height="400"
              style="width: 100%;margin-top: -200px">
              <el-table-column
                align="center"
                prop="preScale"
                label="上期度数"
                width="80">
              </el-table-column>
              <el-table-column
                align="center"
                prop="curScale"
                label="本期度数"
                width="80">
              </el-table-column>
              <el-table-column
                align="center"
                prop="waterVolume"
                label="用量"
                width="80">
              </el-table-column>
              <el-table-column
                align="center"
                prop="timeRange"
                label="用量日期范围">
              </el-table-column>
              <el-table-column
                align="center"
                prop="meterReadTime"
                label="抄表时间"
                width="160">
              </el-table-column>
            </el-table>
        </el-col>
    </div>
</template>

<script>
import { findLastChannelByMac, queryChaobiaomaoChannel } from '@/api/api'
export default {
  components: {},
  props: {
    param: {
      type: Object
    }
  },
  data () {
    return {
      lastScale: '',
      tableTime: this.$store.state.historyDate,
      tableData: []
    }
  },
  mounted () {
    this.init()
    this.queryChaoBiaoMaoTable()
  },
  methods: {
    init () {
      let params = {
        mac: this.param.mac
      }
      findLastChannelByMac(params)
        .then(res => {
          if (res.success) {
            this.lastScale = res.data.lastScale
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
    queryChaoBiaoMaoTable () {
      let parmas = {
        mac: this.param.mac,
        startTime: this.tableTime[0],
        endTime: this.tableTime[1]
      }
      queryChaobiaomaoChannel(parmas)
        .then(res => {
          if (res.success) {
            this.tableData = res.data
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
    }
    // handelMeterReading () {
    //   this.$confirm(this.$t('control.dueMeterReading'), this.$t('dialog.prompt'), {
    //     confirmButtonText: this.$t('btns.ok'),
    //     cancelButtonText: this.$t('btns.cancel'),
    //     type: 'warning'
    //   }).then(() => {
    //     this.$message({
    //       type: 'success',
    //       message: this.$t('message.controlSuccess')
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: this.$t('message.cancelled')
    //     })
    //   })
    // }
  },
  watch: {
    '$store.state.historyDate': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.tableTime = newVal
          this.$nextTick(() => {
            this.queryChaoBiaoMaoTable()
          })
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
#IntelligentWaterMeter
  margin-top 15px
  height 191px
.box
  margin-top 40px
  width 360px
  height 70px
  -webkit-border-radius 5px
  -moz-border-radius 5px
  border-radius 5px
  border 1px solid #fff
  display inline-block
  margin-right 15px
  i
    float left
    margin 0 10px
    font-size 40px
    line-height 70px
.primary-wrap
  width 95.5px
  height 70px
  border 1px solid #fff
  -webkit-border-radius 5px
  -moz-border-radius 5px
  border-radius 5px
  display inline-block
  .primary-icon
    font-size 42px
    text-align center
  .primary-title
    margin 0 0 5px
.box-border
  height 90px
  margin 0 20px
  border-right 1px solid #fff
  display inline-block
.block
  display inline-block
  font-size 28px
</style>
