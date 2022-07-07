<template>
  <el-row :gutter="addrOnlineFlag ? 1 : 20" :class="$route.path === '/Home' ? 'statistics' : ''">
    <el-col :span="addrOnlineFlag ? 2 : 3" :style="(!addrFlag && addrOnlineFlag) ? 'margin-left: 30px' : ''" :push='(addrFlag && !addrOnlineFlag) ? 2 : 3' class="tc pointer" @click.native="handleProjects">
      <div>
        <div :class="addrOnlineFlag ? 'title2' : 'title1'" :title="$t('table.project') + $t('control.total')">{{ $t('table.project') + $t('control.total') }}</div>
        <div class="line"></div>
        <div class="loading" :style="baseStyle" v-if="!statisticsFlag"><i class="el-icon-loading"></i></div>
        <div v-else class="numbers">{{$store.state.totalProject}}</div>
      </div>
    </el-col>
    <el-col :span="addrOnlineFlag ? 2 : 3" :push='(addrFlag && !addrOnlineFlag) ? 2 : 3' class="tc pointer" @click.native="handleDevice('100')">
      <div>
        <div :class="addrOnlineFlag ? 'title2' : 'title1'" :title="$t('statistics.totalMac')">{{ $t('statistics.totalMac') }}</div>
        <div class="line"></div>
        <div class="loading" :style="baseStyle" v-if="!statisticsFlag"><i class="el-icon-loading"></i></div>
        <div v-else class="numbers">{{$store.state.totalMac}}</div>
      </div>
    </el-col>
    <el-col :span="addrOnlineFlag ? 2 : 3" :push='(addrFlag && !addrOnlineFlag) ? 2 : 3' class="tc pointer" @click.native="handleDevice('1')">
      <div>
        <div :class="addrOnlineFlag ? 'title2' : 'title1'" :title="$t('statistics.online')">{{ $t('statistics.online') }}</div>
        <div class="line"></div>
        <div class="loading" :style="baseStyle" v-if="!statisticsFlag"><i class="el-icon-loading"></i></div>
        <div v-else class="numbers">{{$store.state.totalOnline}}</div>
      </div>
    </el-col>
    <el-col :span="addrOnlineFlag ? 2 : 3" :push='(addrFlag && !addrOnlineFlag) ? 2 : 3' class="tc pointer" @click.native="handleDevice('0,-1')">
      <div>
        <div :class="addrOnlineFlag ? 'title2' : 'title1'" :title="$t('statistics.offline')">{{ $t('statistics.offline') }}</div>
        <div class="line"></div>
        <div class="loading" :style="baseStyle" v-if="!statisticsFlag"><i class="el-icon-loading"></i></div>
        <div v-else class="numbers">{{$store.state.totalMac - $store.state.totalOnline}}</div>
      </div>
    </el-col>
    <el-col :span="addrOnlineFlag ? 2 : 3" :push='(addrFlag && !addrOnlineFlag) ? 2 : 3' class="tc" v-if="addrFlag">
      <div>
        <div :class="addrOnlineFlag ? 'title2' : 'title1'" :title="$t('statistics.totalLine')">{{ $t('statistics.totalLine') }}</div>
        <div class="line"></div>
        <div class="loading" :style="baseStyle" v-if="!statisticsFlag"><i class="el-icon-loading"></i></div>
        <div v-else class="numbers">{{$store.state.totalAddr}}</div>
      </div>
    </el-col>
    <el-col :span="addrOnlineFlag ? 2 : 3" :push='(addrFlag && !addrOnlineFlag) ? 2 : 3' class="tc" v-if="addrOnlineFlag">
      <div>
        <div :class="addrOnlineFlag ? 'title2' : 'title1'" :title="$t('statistics.onlineLines')">{{ $t('statistics.onlineLines') }}</div>
        <div class="line"></div>
        <div class="loading" :style="baseStyle" v-if="!statisticsFlag"><i class="el-icon-loading"></i></div>
        <div v-else class="numbers">{{$store.state.totalOnlineAddr}}</div>
      </div>
    </el-col>
    <el-col :span="addrOnlineFlag ? 2 : 3" :push='(addrFlag && !addrOnlineFlag) ? 2 : 3' class="tc" v-if="addrOnlineFlag">
      <div>
        <div :class="addrOnlineFlag ? 'title2' : 'title1'" :title="$t('statistics.offlineLines')">{{ $t('statistics.offlineLines') }}</div>
        <div class="line"></div>
        <div class="loading" :style="baseStyle" v-if="!statisticsFlag"><i class="el-icon-loading"></i></div>
        <div v-else class="numbers">{{$store.state.totalAddr - $store.state.totalOnlineAddr}}</div>
      </div>
    </el-col>
    <el-col :span="addrOnlineFlag ? 2 : 3" :push='(addrFlag && !addrOnlineFlag) ? 2 : 3' class="tc pointer" @click.native="handleQuantity('1')">
      <div>
        <div :class="addrOnlineFlag ? 'title2' : 'title1'" :title="$t('statistics.alarmsNumber')">{{ $t('statistics.alarmsNumber') }}</div>
        <div class="line"></div>
        <div class="loading" :style="baseStyle" v-if="!statisticsFlag"><i class="el-icon-loading"></i></div>
        <div v-else class="numbers">{{$store.state.totalAlarm}}</div>
      </div>
    </el-col>
    <el-col :span="addrOnlineFlag ? 2 : 3" :push='(addrFlag && !addrOnlineFlag) ? 2 : 3' class="tc pointer" @click.native="handleQuantity('2')">
      <div>
        <div :class="addrOnlineFlag ? 'title2' : 'title1'" :title="$t('table.thisMonth') + $t('home.alarm') + $t('control.number')">{{ $t('table.thisMonth') + $t('home.alarm') + $t('control.number') }}</div>
        <div class="line"></div>
        <div class="loading" :style="baseStyle" v-if="!statisticsFlag"><i class="el-icon-loading"></i></div>
        <div v-else class="numbers">{{$store.state.allTotalAlarm}}</div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { queryPageAuth } from '@/api/api'
export default {
  data () {
    return {
      statisticsFlag: this.$store.state.statisticsFlag,
      addrFlag: false,
      addrOnlineFlag: false
    }
  },
  props: {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let parmas = {
        resKeys: 'AUTH_PROJECT_USE,AUTH_PROJECT_USE',
        operKeys: 'GET_ADDR_COUNT,GET_ADDR_ONLINE_COUNT'
      }
      queryPageAuth(parmas)
        .then(res => {
          if (res.data) {
            this.addrFlag = res.data[0].result
            this.addrOnlineFlag = res.data[1].result
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
    handleProjects () {
      this.$router.push({
        name: 'Overviews',
        params: {
          projectName: this.$store.state.fullName
        }
      })
    },
    handleDevice (status) {
      this.$router.push({
        name: 'Devices',
        params: {
          projectCode: this.$store.state.projectCode,
          status: status
        }
      })
    },
    handleQuantity (dateType) {
      this.$router.push({
        name: 'Alarms',
        params: {
          projectCode: this.$store.state.projectCode,
          typeNumber: '-100',
          status: '',
          oqp2: '',
          type: dateType
        }
      })
    }
  },
  watch: {
    '$store.state.statisticsFlag': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.statisticsFlag = newVal
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.statistics
  margin 16.5px 0
.title1
  padding 5px 0 3px 0
  font-size 15px
.title2
  padding 5px 0 3px 0
  font-size 12px
.numbers
  font-size 26px
  padding-bottom 3px
.divider
  margin 0 auto
  width 70%
  height 1px
  background #efefef  /* fallback for old browsers */
  background -webkit-linear-gradient(to right, #efefef, #b6b6b6, #b6b6b6, #efefef)  /* Chrome 10-25, Safari 5.1-6 */
  background linear-gradient(to right, #efefef, #b6b6b6, #b6b6b6, #efefef) /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
.line
  height 2px
  background-color: #375e97
  width 100%
  margin-bottom 5px
  background-image: -webkit-linear-gradient(to right, #132240 0%, #045c7575 50%, #132240 100%)
  background-image: -moz-linear-gradient(to right, #132240 0%, #045c7575 50%, #132240 100%)
  background-image: -o-linear-gradient(to right, #132240 0%, #045c7575 50%, #132240 100%)
  background-image: linear-gradient(to right, #132240 0%, #045c7575 50%, #132240 100%)
.loading
  position relative
  padding-bottom 32px
.el-icon-loading
  position absolute
  left 34%
  top 39%
  font-size 24px
  opacity 0.5
</style>
