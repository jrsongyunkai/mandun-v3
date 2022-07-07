<template>
  <div id="level">
    <el-col :span="24" class="attention" v-show="alarmName !== ''">{{ $t('home.alarm') + $t('table.status') + '：' }}<span class="c-danger">{{ alarmName }}</span>{{ ' (' + $t('control.attention') + ')' }}</el-col>
    <el-col class="box">
      <el-col :offset="2" class="tc primary-wrap" @click.native="handleConfiguration">
        <i class="primary-icon iconfont icon-shezhi"></i>
        <p class="primary-title">{{ $t('table.configuration') }}</p>
      </el-col>
    </el-col>
    <el-col class="box-wrap">
      <el-row>
        <span class="box-right">
          <el-col @click.native="handleSwitch(datas, 'f')" class="pointer grid-content grid-content-open" :class="datas['f-alarmInfo'] ? 'grid-content-close' : ''">
            <i class="iconfont icon-lengqueyewendu"></i>
            <span>
              <p>{{ $t('control.level') + '：' + (datas.F !== undefined ? datas.F + datas['f-Unit'] : '--') }}</p>
              <p>{{ $t('control.upperLimit') + '：' + (datas.F !== undefined ? datas.FH + datas['f-Unit'] : '--') }}</p>
              <p>{{ $t('control.lowerLimit') + '：' + (datas.F !== undefined ? datas.FL + datas['f-Unit'] : '--') }}</p>
            </span>
          </el-col>
        </span>
        <span class="box-right">
          <el-col @click.native="handleSwitch(datas, 't')" class="pointer grid-content grid-content-open" :class="datas['t-alarmInfo'] ? 'grid-content-close' : ''">
            <i class="iconfont icon-wenduji"></i>
            <span>
              <p>{{ $t('menu.temperature') + '：' + (datas.T !== undefined ? datas.T + datas['t-Unit'] : '--') }}</p>
              <p>{{ $t('control.upperLimit') + '：' + (datas.T !== undefined ? datas.TH + datas['t-Unit'] : '--') }}</p>
              <p>{{ $t('control.lowerLimit') + '：' + (datas.T !== undefined ? datas.TL + datas['t-Unit'] : '--') }}</p>
            </span>
          </el-col>
        </span>
      </el-row>
    </el-col>
    <el-dialog
      :title="$t('dialog.equipmentParameterAdjustment')"
      :close-on-click-modal="false"
      custom-class="details-dialog"
      :modal="false"
      width="1323px"
      lock-scroll="false"
      :visible.sync="equipmentFlag"
      :before-close="handleEquipmentClose">
      <el-scrollbar style="height: 100%;">
        <HydrologicalConfiguration v-if="equipmentFlag" :equipmentNum="4"></HydrologicalConfiguration>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>
<script>
/* global config */
import store from '@/store'
import HydrologicalConfiguration from './HydrologicalConfiguration'
import { queryTlinkChannelByMac } from '@/api/api'
export default {
  props: {
    mac: {
      type: String
    }
  },
  data () {
    return {
      alarmName: '',
      equipmentFlag: false,
      datas: [],
      type: 'f',
      timerID: null
    }
  },
  created () {
    this.init()
  },
  activated () {
    this.setTimer(this.queryNorChannel, config.pollingInterval.queryTlinkChannelByMac * 1000)
  },
  deactivated () {
    clearTimeout(this.timerID)
  },
  methods: {
    init () {
      this.queryNorChannel()
      this.setTimer(this.queryNorChannel, config.pollingInterval.queryTlinkChannelByMac * 1000)
    },
    queryNorChannel () {
      let params = {
        mac: this.mac
      }
      queryTlinkChannelByMac(params)
        .then(res => {
          if (res.success) {
            if (JSON.stringify(res.data) !== '{}') {
              this.datas = res.data
              if (res.data['f-alarmInfo'] !== '') this.alarmName = res.data['f-alarmInfo']
              store.commit('levelObj', this.datas)
              this.$set(this.$store.state.levelObj, 'type', this.type)
              store.commit('dateFlag', false)
            } else {
              this.datas = {}
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
    handleSwitch (item, type) {
      if (!item.mac) return false
      this.type = type
      if (type === 't') {
        this.alarmName = item['t-alarmInfo']
      } else {
        this.alarmName = item['f-alarmInfo']
      }
      this.$set(this.$store.state.levelObj, 'type', type)
      store.commit('levelObj', item)
    },
    handleConfiguration () {
      this.equipmentFlag = true
    },
    handleEquipmentClose () {
      this.equipmentFlag = false
    },
    setTimer (fn, delay) {
      let _this = this
      function timer () {
        _this.timerID = setTimeout(function () {
          timer()
          fn()
        }, delay)
      }
      timer()
    }
  },
  destroyed () {
    clearTimeout(this.timerID)
  },
  components: {
    HydrologicalConfiguration
  }
}
</script>
<style lang="stylus" scoped>
#level
  margin-top 15px
.box
  padding-left 17px
  width 292px
  height 191px
  margin-right 20px
  margin-bottom 20px
  border-right 2px solid #fff
.primary-wrap
  width 95.5px
  margin-bottom 25px
  border 1px solid #fff
  -webkit-border-radius 5px
  -moz-border-radius 5px
  border-radius 5px
.primary-icon
  font-size 42px
  text-align center
.primary-title
  margin 0 0 5px
.attention
  margin-bottom 20px
.box-wrap
  width 958px
  overflow hidden
.box-right
  margin 0 20.5px
  display inline-block
  .grid-content
    width 431px
    height 183.4px
    -webkit-border-radius 5.85px
    -moz-border-radius 5.85px
    border-radius 5.85px
  i
    padding-left 50px
    display inline-block
    line-height 183.4px
    font-size 80px
    vertical-align middle
  span
    vertical-align middle
    padding-left 59px
    font-size 22px
    display inline-block
    width calc(100% - 194px)
.grid-content-open
  border 1px solid #fff
.grid-content-close
  border 1px solid #f9482e
  color #f9482e
.not-allowed
  cursor not-allowed
  color #999
  .iconfont
    cursor not-allowed
#level >>> .details-dialog
    background-color #0c1e32
    position: absolute
    top 96px
    left 50%
    margin-left -661.5px
    bottom 0
    margin-top 0 !important
    max-height calc(100% - 116px)
    max-width calc(100% - 20px)
    min-width 1323px
    display flex
    flex-direction column
    border 1px solid #fff
    .el-dialog__title, .el-dialog__headerbtn .el-dialog__close
      color #fff
      font-size 18px
    .el-dialog__header
      padding 14px 17px 0
      height 19px
    .el-dialog__body
      color #fff
      padding 0 17px
      overflow auto
      overflow-y hidden
    .el-dialog__headerbtn
      top 10px
      right 5px
</style>
