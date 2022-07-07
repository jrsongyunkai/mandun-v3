<template>
    <div id="EnergyOverview">
      <el-row :style="{height: height}">
        <el-row>
          <el-col class="box-inner left-top" :span="15">
            <div class="energy box-inner" :style="{height: overHeight}">
              <div id="map"></div>
            </div>
          </el-col>
          <el-col class="box-inner right-top" :span="9">
            <div class="mr-5 box-inner" :style="{height: overHeight}">
              <el-col :md="24" class="left-padding-right" style="height: 10%">
                <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
                  <el-form-item label="区域层级：">
                    <el-cascader
                      :show-all-levels="false"
                      v-model="formInline.hierarchy"
                      :options="areaOptions"
                      :props="{ value: 'id', label: 'areaName', checkStrictly: true }"
                      clearable>
                    </el-cascader>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" :disabled="formInline.hierarchy.length === 0" @click="search">查询</el-button>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :md="24" class="boundary left-padding-right statistics" style="height: 28%">
                <el-row class="chart-title">
                  <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">数据统计</el-col>
                </el-row>
                <el-row  class="wrap">
                  <el-col :md="12" :xs="12" :sm="12" class="wrap-item">
                    <div class="left-borde"></div>
                    <div class="inco-size"><i class="el-icon-s-data el-icon"></i></div>
                    <div class="wrap-item-right">
                      <div class="fs-14">本月综合能耗</div>
                      <div class="fs-20" style="">{{totalTce}}<span class="fs-12 ml-5">tce</span></div>
                    </div>
                  </el-col>
                  <el-col :md="12" :xs="12" :sm="12" class="wrap-item">
                    <div class="left-borde"></div>
                    <div class="inco-size"><i class="iconfont icon-chatou el-icon"></i></div>
                    <div class="wrap-item-right">
                      <div class="fs-14">本月用电量 (kw.h)</div>
                      <div class="fs-20" style="">{{totalPower}}<span class="fs-12 ml-5">kw.h</span></div>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :md="24" class="boundary left-padding-right" style="height: 60%;margin-top: 2%">
                <el-row class="chart-title">
                  <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">当月各分类用能</el-col>
                </el-row>
                <el-row>
                  <fu-pie-chart :options="typeAlarmTypes"></fu-pie-chart>
                </el-row>
              </el-col>
            </div>
          </el-col>
        </el-row>
        <el-row class="mt-10">
          <el-col class="box-inner left-bottom" :span="10">
            <div class="box-inner" :style="{height: overTowHeight}">
              <el-col :md="24" class="boundary left-padding-right statistics" style="height: 100%;">
                <el-row class="chart-title">
                  <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">单位面积电耗排名</el-col>
                </el-row>
                <el-row class="area">
                  <div class="area-child" v-for="(item,i) in perAreaEnergyRange" :key="i">
                    <el-col :span="24" class="fs-14"><span class="mr-10" style="font-size: 16px;color: #3884d5">TOP{{i + 1}}</span>{{ item.areaName }}</el-col>
                    <el-col :span="18">
                      <el-progress stroke-width="8" :percentage="item.energyPercentage"></el-progress>
                    </el-col>
                    <el-col :span="6" class="tc">{{item.perAreaEnergy}} kw.h/m²</el-col>
                  </div>
                </el-row>
              </el-col>
            </div>
          </el-col>
          <el-col class="right-bottom" :span="14">
            <div class="box-inner" :style="{height: overTowHeight}">
              <el-col :md="24" class="boundary left-padding-right" style="height: 100%;">
                <el-row class="chart-title">
                  <el-col :md="24" :xs="24" :sm="24" class="el-padding-left-20">用能趋势</el-col>
                </el-row>
                <el-row>
                  <div v-if="timeType === 'MONTH'" class="fl box-border mt-10" style="margin-left: 10%">月度用电量： {{ currentMonthTotalPower }} kw.h</div>
                  <div v-if="timeType === 'DAY'" class="fl box-border mt-10" style="margin-left: 10%"> 昨日用电量： {{ yesterdayTotalPower }} kw.h</div>
                  <div v-if="timeType === 'DAY'" class="fl box-border ml-20 mt-10">今日用电量： {{ todayTotalPower }} kw.h</div>
                  <el-button @click="handleTrend('DAY')" type="primary" :plain="lineAreaType !== 'DAY'" class="box-btn" style="right: 15%" size="small">按日</el-button>
                  <el-button @click="handleTrend('MONTH')" type="primary" :plain="lineAreaType !== 'MONTH'" size="small" style="right: 5%" class="box-btn">按月</el-button>
                  <manage-Line-Area :options="trendOptions"></manage-Line-Area>
                </el-row>
              </el-col>
            </div>
          </el-col>
        </el-row>
      </el-row>
    </div>
</template>

<script>
/* global config */
/* global BMap */
/* global google */
import { Map } from '../../map'
import mapStyleJson from '../../assets/js/custom_map_config.json'
import myIcon1 from '../../assets/image/nIcon.png'
import store from '@/store'
import manageLineArea from '../Common/ManageLineArea'
import FuPieChart from '../Common/fupie'
import { getGblinfo, seekAreaListTreeByProject, energyOverview, energyTrend } from '@/api/api'
export default {
  components: {
    manageLineArea,
    FuPieChart
  },
  data () {
    return {
      height: this.$store.state.asideTowHeight,
      overHeight: this.$store.state.overHeight,
      overTowHeight: this.$store.state.overTowHeight,
      lineAreaType: 'DAY',
      longitude: '',
      latitude: '',
      areaOptions: [],
      bmap: null,
      geoc: null,
      rePoint: {lng: 0, lat: 0},
      obj: null,
      areaId: null, // 区域id
      totalTce: 0,
      totalPower: 0,
      todayTotalPower: 0,
      yesterdayTotalPower: 0,
      currentMonthTotalPower: 0,
      perAreaEnergyRange: [], // 单位面积排名
      form: {
        address: '',
        province: '',
        city: '',
        district: '',
        street: '',
        longitude: '',
        latitude: ''
      },
      formInline: {
        hierarchy: [],
        uesr: ''
      },
      trendOptions: {
        title: {
          show: true,
          text: '单位/kw.h'
        },
        xAxis: [],
        series: []
      },
      typeAlarmTypes: {
        series: []
      },
      typeAlarmData: [],
      timeType: ''
    }
  },
  created () {
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.handleSeekAreaListTree()
      this.getGblinfos()
    },
    handleSeekAreaListTree () {
      seekAreaListTreeByProject()
        .then(res => {
          if (res.success) {
            if (res.data.length > 0) {
              this.areaOptions = res.data
              this.formInline.hierarchy.push(res.data[0].id)
              this.handleTrend('MONTH')
              this.getEnergyOverview()
            }
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
    getGblinfos () {
      let params = {
        rf: 'json'
      }
      getGblinfo(params)
        .then(res => {
          this.address = res.DEF_PRJ_LOCATION.address
          this.longitude = res.DEF_PRJ_LOCATION.longitude
          this.latitude = res.DEF_PRJ_LOCATION.latitude
          this.form.province = res.DEF_PRJ_LOCATION.provinceName
          this.form.city = res.DEF_PRJ_LOCATION.cityName
          this.form.district = res.DEF_PRJ_LOCATION.countyName
          this.form.street = res.DEF_PRJ_LOCATION.street
          this.form.longitude = res.DEF_PRJ_LOCATION.longitude
          this.form.latitude = res.DEF_PRJ_LOCATION.latitude
          this.cfg = res
          store.commit('projectName', res.DEF_PRJ_TITLE)
          this.$nextTick(() => {
            this.renderMap()
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
    },
    search () {
      this.handleTrend(null)
      this.getEnergyOverview()
    },
    getEnergyOverview () {
      this.typeAlarmTypes = []
      let params = {
        areaId: this.formInline.hierarchy.length === 0 ? null : this.formInline.hierarchy[this.formInline.hierarchy.length - 1]
      }
      this.totalPower = 0
      this.totalTce = 0
      energyOverview(params)
        .then(res => {
          if (res.success) {
            if (res.data.totalPower != null) {
              this.totalPower = (res.data.totalPower).toFixed(2)
            }
            if (res.data.totalTce != null) {
              this.totalTce = (res.data.totalTce).toFixed(2)
            }
            this.typeAlarmData = [{ value: this.totalTce, name: res.data.industryName }]
            this.typeAlarmTypes = this.typeAlarmData
            this.perAreaEnergyRange = []
            if (res.data.perAreaEnergyRange) {
              for (let item of res.data.perAreaEnergyRange) {
                this.perAreaEnergyRange.push({
                  areaName: item.areaName,
                  energyPercentage: item.energyPercentage,
                  perAreaEnergy: item.perAreaEnergy
                })
              }
            }
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
    getEnergyTrend () {
      let params = {
        areaId: this.formInline.hierarchy.length === 0 ? null : this.formInline.hierarchy[this.formInline.hierarchy.length - 1],
        timeType: this.timeType
      }
      this.todayTotalPower = 0
      this.yesterdayTotalPower = 0
      this.currentMonthTotalPower = 0
      this.trendOptions.series = []
      energyTrend(params)
        .then(res => {
          if (res.success) {
            if (res.data.todayTotalPower != null) {
              this.todayTotalPower = (res.data.todayTotalPower).toFixed(2)
            }
            if (res.data.yesterdayTotalPower != null) {
              this.yesterdayTotalPower = (res.data.yesterdayTotalPower).toFixed(2)
            }
            if (res.data.currentMonthTotalPower != null) {
              this.currentMonthTotalPower = (res.data.currentMonthTotalPower).toFixed(2)
            }
            if (this.timeType === 'DAY') {
              this.trendOptions.xAxis = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
            } else if (this.timeType === 'MONTH') {
              this.trendOptions.xAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
            }
            // 昨日用电量趋势曲线
            if (res.data.yesterdayTrend) {
              let arr = Array(24).fill(0)
              res.data.yesterdayTrend.forEach(number => {
                this.trendOptions.xAxis.filter((item, index) => {
                  if (number.statsHour === item) {
                    arr[index] = number.statsPower
                  }
                })
              })
              this.trendOptions.series.push({name: '昨日', type: 'line', data: arr, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(65, 105, 225, .6)'}, {offset: 1, color: 'rgba(65, 105, 225, .1)'}], global: false}}, itemStyle: {color: '#34ACE7'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true})
            }
            // 今日用电量趋势曲线
            if (res.data.todayTrend) {
              let arr = Array(24).fill(0)
              res.data.todayTrend.forEach(number => {
                this.trendOptions.xAxis.filter((item, index) => {
                  if (number.statsHour === item) {
                    arr[index] = number.statsPower
                  }
                })
              })
              this.trendOptions.series.push({name: '今日', type: 'line', data: arr, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(0, 201, 78, .6)'}, {offset: 1, color: 'rgba(0, 201, 78, .1)'}], global: false}}, itemStyle: {color: '#00b582'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true})
            }
            // 这个月用电量趋势曲线
            if (res.data.currentMonthTrend) {
              let arr = Array(31).fill(0)
              res.data.currentMonthTrend.forEach(number => {
                this.trendOptions.xAxis.filter((item, index) => {
                  if (number.statsDay === item) {
                    arr[index] = (number.statsPower).toFixed(2)
                  }
                })
              })
              this.trendOptions.series.push({name: '用电量', type: 'line', data: arr, areaStyle: {color: {type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{offset: 0, color: 'rgba(65, 105, 225, .6)'}, {offset: 1, color: 'rgba(65, 105, 225, .1)'}], global: false}}, itemStyle: {color: '#34ACE7'}, showSymbol: true, symbol: 'emptyCircle', symbolSize: 4, smooth: true})
            }
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
    handleTrend (type) {
      if (type !== null && type !== '') {
        this.timeType = type
        this.lineAreaType = type
      }
      this.trendOptions.series = []
      this.trendOptions.xAxis = []
      this.getEnergyTrend()
    },
    async renderMap () {
      if (config.useMap === 'BAIDU' || config.useMap === 'CUSTOM_MAP') {
        if (typeof BMap === 'undefined') await Map(config.baiduKey, 'BAIDU')
        let bmap = new BMap.Map('map')
        let geoc = new BMap.Geocoder()
        let point = new BMap.Point(this.longitude, this.latitude)
        let marker = new BMap.Marker(point, {enalbeDragging: true})
        bmap.centerAndZoom(point, 16)
        if (!config.mapStyle || config.mapStyle !== 'normal') {
          bmap.setMapStyleV2({styleJson: mapStyleJson})
        }
        bmap.enableScrollWheelZoom(true)
        bmap.addOverlay(marker)
        bmap.addEventListener('click', (e) => {
          if (this.searchFlag) {
            this.obj = null
            this.handleReLocate(e.point)
            geoc.getLocation(e.point, (res) => {
              this.form.address = res.address
              this.rePoint = res.point
            })
          }
        })
        this.bmap = bmap
        this.geoc = geoc
      } else if (config.useMap === 'BAIDU_OFFLINE') {
        let bmap = new window.BMap.Map('map')
        this.bamp = bmap
        let point = new window.BMap.Point(this.longitude, this.latitude)
        let marker = new window.BMap.Marker(point, {enalbeDragging: true})
        bmap.centerAndZoom(point, this.baiduOfflinemapMaxzoom)
        bmap.setMaxZoom(this.baiduOfflinemapMaxzoom)
        bmap.enableScrollWheelZoom(true)
        bmap.addOverlay(marker)
        bmap.addEventListener('click', (e) => {
          if (this.searchFlag) {
            this.obj = null
            bmap.clearOverlays()
            bmap.addOverlay(new BMap.Marker(e.point))
            bmap.panTo(e.point)
            this.form.province = ''
            this.form.city = ''
            this.form.district = ''
            this.form.street = ''
            this.form.longitude = e.point.lng
            this.form.latitude = e.point.lat
          }
        })
      } else if (config.useMap === 'GOOGLE') {
        if (typeof google === 'undefined') await Map(config.googleKey, config.useMap)
        let myLatLng = this.$func.BD09_To_GCJ02(this.latitude, this.longitude)
        let map = new google.maps.Map(document.getElementById('map'), {
          center: myLatLng,
          mapTypeControl: false,
          streetViewControl: false,
          zoom: 15
        })
        let icon = {
          url: myIcon1,
          size: new google.maps.Size(21, 34),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(21, 34),
          scaledSize: new google.maps.Size(21, 34)
        }
        let marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          icon: icon
        })
        marker.setMap(map)
        google.maps.event.addListener(map, 'click', (event) => {
          if (this.searchFlag) {
            let latLng = this.$func.GCJ02_To_BD09(event.latLng.lat(), event.latLng.lng())
            marker.setMap(null)
            marker = new google.maps.Marker({
              position: event.latLng,
              map: map,
              icon: icon
            })
            marker.setMap(map)
            this.form.province = ''
            this.form.city = ''
            this.form.district = ''
            this.form.street = ''
            this.form.longitude = latLng.lng
            this.form.latitude = latLng.lat
          }
        })
      }
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
    '$store.state.overHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.overHeight = newVal
        }
      }
    },
    '$store.state.overTowHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.overTowHeight = newVal
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
#EnergyOverview
  height 100%
  font-size 14px
.left-top
  padding-left 10px
  padding-right 5px
.right-top
  padding-left 5px
.left-bottom
  padding-left 10px
  padding-right 5px
.right-bottom
  padding 0 5px
.box-inner
  box-sizing border-box
.energy
  border 2px solid #303a5ecc
  box-shadow 3px 3px 6px 1px rgba(0, 0, 0, .2)
  -webkit-border-radius 10px
  -moz-border-radius 10px
  border-radius 10px
.boundary
  border 2px solid #303a5ecc
  box-shadow 3px 3px 6px 1px rgba(0, 0, 0, .2)
.statistics
  display flex
  flex-direction column
.chart-title
  border-bottom 2px solid #303a5ecc
.wrap
  flex 1
.wrap-item
  height 100%
  display flex
  align-items center
  padding-left 5%
.left-borde
  line-height 100%
  width 3px
  height 60%
  border-left 1px solid #ccc
.inco-size
  line-height 100%
  width 25%
  height 60%
  background-color #28374e
  display flex
  align-items center
  justify-content center
.el-icon
  font-size 30px
.wrap-item-right
  margin-left 7%
  height 60%
  display flex
  flex-direction column
  justify-content space-between
.area
  display flex
  flex 1
  flex-direction column
  justify-content space-between
  padding 0 10px
.area-child >>> .el-progress__text
      color #3884d5
.box-border
  font-size 14px
  box-sizing border-box
  padding 5px 10px
  border 1px solid #ccc
  border-radius 5px
.box-btn
  position absolute
  z-index 999
  right 0
  top 2%
#map
    width 100%
    border-radius 10px
    height 100%
</style>
