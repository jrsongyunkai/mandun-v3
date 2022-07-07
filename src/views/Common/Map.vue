<template>
    <div>
        <el-row class='project-info'>
          <Statistics></Statistics>
        </el-row>
        <div id="geoMap" :style="{height: mapHeight}">
          <div v-if="mapType !== 'CUSTOM_MAP'" :id='uniqueID' class="map"></div>
          <Custom v-if="mapType === 'CUSTOM_MAP' && customFlag" source="home" :datas="customDatas" ref="custom-map" @handleEnterProject="handleEnterProject(arguments)"></Custom>
        </div>
        <el-row :gutter='20' class='industry-type' type="flex" justify="center">
            <el-col :span='2' :push='1' :style="fullScreenIndustry">
                <div class='grid-content' @click.prevent="filterIndustry('all')"><i class="iconfont icon-sh_quanbu"></i></div>
                <div class='industry-title' @click.prevent="filterIndustry('all')">{{ $t('home.all') }}</div>
            </el-col>
            <el-col :span='2' :push='1' v-for="(value, index) in $store.state.industryTypes" :key="index" :style="fullScreenIndustry">
                <div class='grid-content' @click.prevent="filterIndustry(value.code)"><img class="industry-icon" :src="value.icon" alt=""></div>
                <div class='industry-title' @click.prevent="filterIndustry(value.code)">{{ value.name }}</div>
            </el-col>
        </el-row>
        <el-dialog width="400px" top="35vh" @closed="audioFlag = false;localDatas = []" :visible.sync="dialogAlarmVisible" :modal="false" class="d-alm-wrap">
          <span slot="title"><i class="iconfont icon-jinggao"></i>{{ $t('home.newAlarm') }}</span>
          <span class="d-alm-title">{{ $t('home.payAttention') + '：'}}</span>
          <div class="d-alm-content">
            <span @click="handleAlarm(item.code, item.name)" class="handle-alarm" :style="{color: item.color}" v-for="(item, index) in localDatas" :key="index" v-show="!item.enbAlm">【{{item.name}}】</span>
          </div>
        </el-dialog>
        <span v-if="audioFlag">
          <span v-if="$store.state.muted">
            <audio muted :src="(AlarmSoundList[audioKey] && alarmSoundDiscern ==='true') ? cdnPaths + AlarmSoundList[audioKey] : cdnPaths + '/static/audio/pelic.mp3'"></audio>
          </span>
          <span v-else>
            <audio autoplay :src="(AlarmSoundList[audioKey] && alarmSoundDiscern ==='true') ? cdnPaths + AlarmSoundList[audioKey] : cdnPaths + '/static/audio/pelic.mp3'"></audio>
          </span>
        </span>
    </div>
</template>
<script>
/* global config */
/* global ctxPaths */
/* global google */
/* global BMAP_ANIMATION_DROP */
/* global BMAP_ANIMATION_BOUNCE */
import { Map } from '../../map'
import { alarmTypeStats, statisticalNumber, switchHover, globalAlarmSound, queryHomeMapInfo } from '@/api/api'
import { CodeToText } from 'element-china-area-data'
import uuid from 'uuid/v1'
import store from '@/store'
import mapStyleJson from '../../assets/js/custom_map_config.json'
import myIcon1 from '../../assets/image/nIcon.png'
import myIcon2 from '../../assets/image/wIcon.png'
import Custom from './Custom'
import Statistics from '../Home/Statistics'
export default {
  data () {
    return {
      alarmSoundDiscern: config.authority.AUTH_PROJECT_USE__ALARM_SOUND_DISCERN,
      cdnPaths: (document.location.host.indexOf('snd02.com') >= 0 || document.location.host.indexOf('snd01.com') >= 0) ? `${document.location.protocol}//v3cdn5.snd02.com` : ctxPaths,
      ctxPaths: ctxPaths,
      uniqueID: '',
      wsData: '',
      mapStyleJson: [],
      repeatid: 0,
      count: 0,
      chart: null,
      myGeo: null,
      Bmap: null,
      Gmap: null,
      AlarmSoundList: {},
      gMarkers: [],
      parameter: null,
      dialogAlarmVisible: false,
      localDatas: [],
      localData: [],
      audioKey: 0,
      audioFlag: false,
      mapId: null,
      mapFlag: false,
      mapType: config.useMap,
      mapStyle: config.mapStyle,
      baiduOfflinemapMaxzoom: config.baiduOfflinemapMaxzoom === undefined ? 16 : config.baiduOfflinemapMaxzoom,
      lastIdx: '',
      infoWindows: [],
      bounds: [],
      provinceId: '',
      cityId: '',
      countyId: '',
      customDatas: [],
      customFlag: false,
      mapHeight: this.$store.state.mapHeight
    }
  },
  props: {
    options: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  created () {
    this.uniqueID = uuid()
  },
  mounted () {
    this.init()
    let _this = this
    window.openPrjAction = (name, code) => {
      let item = {
        value: name,
        projectCode: code
      }
      _this.handleSelect(item)
    }
  },
  activated () {
    if ('WebSocket' in window) {
      window.addEventListener('onmessageWS', this.getsocketData)
    } else {
      this.repeatid = setInterval(() => {
        this.queryAlarm(true)
      }, config.pollingInterval.alarmOfProjectStats * 1000)
    }
  },
  deactivated () {
    clearInterval(this.repeatid)
    window.removeEventListener('onmessageWS', this.getsocketData)
  },
  methods: {
    init () {
      this.initMap()
      this.getGlobalAlarmSound()
    },
    getGlobalAlarmSound () {
      globalAlarmSound()
        .then(res => {
          if (res.success) {
            this.AlarmSoundList = res.data
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
    },
    initMap () {
      let that = this
      this.$nextTick(function () {
        if (this.mapType === 'GOOGLE') {
          Map(config.googleKey, config.useMap)
            .then(google => {
              let myLatLng = {lat: 28.6139391, lng: 77.20902120000005}
              let map = new google.maps.Map(document.getElementById(this.uniqueID), {
                center: myLatLng,
                mapTypeControl: false,
                streetViewControl: false,
                zoom: 15
              })
              that.Gmap = map
            })
        } else if (this.mapType === 'BAIDU') {
          Map(config.baiduKey, config.useMap)
            .then(BMap => {
              let myGeo = new BMap.Geocoder()
              that.myGeo = myGeo
              that.bmap = new BMap.Map(this.uniqueID, {enableMapClick: false})
              let point = new BMap.Point(116.404, 39.915)
              that.bmap.centerAndZoom(point, 15)
              that.bmap.enableScrollWheelZoom(true)
              if (!this.mapStyle || this.mapStyle !== 'normal') {
                that.bmap.setMapStyleV2({styleJson: mapStyleJson})
              }
              that.bmap.closeInfoWindow()
            })
        } else if (this.mapType === 'CUSTOM_MAP') {
          queryHomeMapInfo({})
            .then(res => {
              if (res.success) {
                this.customDatas = res
                this.customFlag = true
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
                this.customFlag = false
              }
            })
            .catch(err => {
              if (err) {
                this.$message({
                  message: this.$t('message.unknown'),
                  type: 'error'
                })
              }
              this.customFlag = false
            })
        }
      })
      if (this.mapType === 'BAIDU_OFFLINE') {
        setTimeout(() => {
          that.bmap = new window.BMap.Map(this.uniqueID, {enableMapClick: false})
          let point = new window.BMap.Point(114.070014, 22.551894)
          that.bmap.setMaxZoom(this.baiduOfflinemapMaxzoom)
          that.bmap.centerAndZoom(point, 15)
          that.bmap.enableScrollWheelZoom(true)
          that.bmap.closeInfoWindow()
          that.bmap.addEventListener('tilesloaded', () => {
            // this.$message({
            //   message: this.$t('system.successfullyLoaded'),
            //   type: 'success'
            // })
          })
        }, 2000)
      }
    },
    getsocketData (e) {
      this.wsData = JSON.parse(e && e.detail.data)
      if (!this.wsData.data) return false
      this.audioKey = ''
      this.audioFlag = false
      this.socketStatsNumber(this.localData, this.wsData.data, true)
    },
    statisticalNumber () {
      store.commit('statisticsFlag', false)
      this.$nextTick(function () {
        let params = {
          provinceId: this.provinceId ? this.provinceId : '',
          cityId: this.cityId ? this.cityId : '',
          countyId: this.countyId ? this.countyId : ''
        }
        statisticalNumber(params)
          .then(res => {
            if (res.success) {
              store.commit('totalAlarm', res.data.totalAlarm)
              store.commit('totalMac', res.data.totalMac)
              store.commit('totalOnline', res.data.totalOnline)
              store.commit('allTotalAlarm', res.data.allTotalAlarm)
              store.commit('totalProject', res.data.totalProject)
              store.commit('totalWarn', res.data.totalWarn)
              store.commit('totalAddr', res.data.totalAddr)
              store.commit('totalOnlineAddr', res.data.totalOnlineAddr)
            } else if (res.code === '-1') {
            } else {
              store.commit('totalAlarm', 0)
              store.commit('totalMac', 0)
              store.commit('totalOnline', 0)
              store.commit('totalProject', 0)
              store.commit('totalWarn', 0)
              store.commit('allTotalAlarm', 0)
              store.commit('totalAddr', 0)
              store.commit('totalOnlineAddr', 0)
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
            store.commit('statisticsFlag', true)
          })
      })
    },
    queryAlarm (isPopTip) {
      let pcs = []
      if (this.localData.length > 0) {
        this.localData.forEach(function (item, index) {
          pcs.push(item.code)
        })
      }
      let params = {
        projectCode: pcs.join(',')
      }
      if (pcs.length === 0) return
      this.$nextTick(function () {
        alarmTypeStats(params)
          .then(res => {
            if (res.data.length > 0) this.audioKey = String(res.data[0].lastTypeNumber)
            if (res.code !== '0') return false
            this.reloadStatsNumber(this.localData, res.data, isPopTip)
          })
      })
    },
    reloadStatsNumber (localData, remoteData, isPopTip) {
      let that = this
      this.$nextTick(function () {
        for (let i = 0; i < localData.length; i++) {
          let li = localData[i]
          let ri = null
          if (remoteData) {
            for (let j = 0; j < remoteData.length; j++) {
              if (li.code === remoteData[j].projectCode) {
                ri = remoteData[j]
                break
              }
            }
          }
          if (!ri) ri = {number: 0, numberWarn: 0}
          li.hasMod = (ri.number !== li.number || ri.numberWarn !== li.numberWarn)
          li.enbAlm = (ri.number > li.number || ri.numberWarn > li.numberWarn)
          if (!li.hasMod) continue
          li.type = (ri.number === 0)
          li.number = ri.number
          li.numberWarn = ri.numberWarn
        }
        let markers
        if (this.mapType === 'BAIDU') {
          markers = this.bmap.getOverlays()
        } else if (this.mapType === 'GOOGLE') {
          markers = this.gMarkers
        } else if (this.mapType === 'BAIDU_OFFLINE') {
          markers = this.bmap.getOverlays()
        }
        for (let i = 0; i < localData.length; i++) {
          let li = localData[i]
          if (!li.hasMod) continue
          if (this.mapType === 'CUSTOM_MAP') {
            for (let k = 0; k < this.$refs['custom-map'].data.length; k++) {
              if (this.$refs['custom-map'].data[k].idx !== i) continue
              if (!li.type) {
                this.$refs['custom-map'].$refs[`mark-${li.code}`][0].lastChild.lastChild.src = myIcon2
                this.$refs['custom-map'].$refs[`mark-${li.code}`][0].lastChild.lastChild.className = 'wIcon'
              } else {
                this.$refs['custom-map'].$refs[`mark-${li.code}`][0].lastChild.lastChild.src = myIcon1
                this.$refs['custom-map'].$refs[`mark-${li.code}`][0].lastChild.lastChild.className = ''
              }
              break
            }
          } else {
            for (let j = 0; j < markers.length; j++) {
              if (markers[j].idx !== i) continue
              if (li.type) {
                if (that.mapType === 'BAIDU' || that.mapType === 'BAIDU_OFFLINE') {
                  markers[j].setAnimation(BMAP_ANIMATION_DROP)
                  markers[j].setIcon(new window.BMap.Icon(myIcon1, new window.BMap.Size(32, 32), {anchor: new window.BMap.Size(11.5, 31)}))
                } else if (that.mapType === 'GOOGLE') {
                  markers[j].setAnimation(google.maps.Animation.DROP)
                  markers[j].setIcon(myIcon1)
                }
              } else {
                if (that.mapType === 'BAIDU' || that.mapType === 'BAIDU_OFFLINE') {
                  markers[j].setAnimation(BMAP_ANIMATION_BOUNCE)
                  markers[j].setIcon(new window.BMap.Icon(myIcon2, new window.BMap.Size(32, 32), {anchor: new window.BMap.Size(11.5, 31)}))
                } else if (that.mapType === 'GOOGLE') {
                  markers[j].setAnimation(google.maps.Animation.BOUNCE)
                  markers[j].setIcon(myIcon2)
                }
              }
              break
            }
          }
        }
        let almPrjs = []
        for (let i = 0; i < localData.length; i++) {
          let li = localData[i]
          if (!li.enbAlm) continue
          almPrjs.push({code: li.code, name: li.name})
        }
        if (isPopTip && almPrjs.length > 0) {
          this.localDatas = almPrjs
          this.audioFlag = true
          this.dialogAlarmVisible = true
          this.statisticalNumber()
          store.commit('totalStatus', true)
        }
      })
    },
    socketStatsNumber (localData, remoteData, isPopTip) {
      if (this.wsData.data.msgType === 1) {
        this.audioKey = String(remoteData.dataList[0].lastTypeNumber)
        let that = this
        this.$nextTick(function () {
          for (let i = 0; i < localData.length; i++) {
            let ri = null
            if (localData[i].code === remoteData.dataList[0].projectCode) {
              ri = remoteData.dataList[0]
              localData[i].hasMod = ri.classify === -100
              localData[i].type = false
              break
            }
          }
          let markers
          if (this.mapType === 'BAIDU') {
            markers = this.bmap.getOverlays()
          } else if (this.mapType === 'GOOGLE') {
            markers = this.gMarkers
          } else if (this.mapType === 'BAIDU_OFFLINE') {
            markers = this.bmap.getOverlays()
          }
          for (let i = 0; i < localData.length; i++) {
            if (!localData[i].hasMod) continue
            if (this.mapType === 'CUSTOM_MAP') {
              for (let k = 0; k < this.$refs['custom-map'].data.length; k++) {
                if (this.$refs['custom-map'].data[k].idx !== i) continue
                if (!localData[i].type) {
                  this.$refs['custom-map'].$refs[`mark-${localData[i].code}`][0].lastChild.lastChild.src = myIcon2
                  this.$refs['custom-map'].$refs[`mark-${localData[i].code}`][0].lastChild.lastChild.className = 'wIcon'
                } else {
                  this.$refs['custom-map'].$refs[`mark-${localData[i].code}`][0].lastChild.lastChild.src = myIcon1
                  this.$refs['custom-map'].$refs[`mark-${localData[i].code}`][0].lastChild.lastChild.className = ''
                }
                break
              }
            } else {
              for (let j = 0; j < markers.length; j++) {
                if (markers[j].idx !== i) continue
                if (localData[i].type) {
                  if (that.mapType === 'BAIDU' || that.mapType === 'BAIDU_OFFLINE') {
                    markers[j].setAnimation(BMAP_ANIMATION_DROP)
                    markers[j].setIcon(new window.BMap.Icon(myIcon1, new window.BMap.Size(32, 32), {anchor: new window.BMap.Size(11.5, 31)}))
                  } else if (that.mapType === 'GOOGLE') {
                    markers[j].setAnimation(google.maps.Animation.DROP)
                    markers[j].setIcon(myIcon1)
                  }
                } else {
                  if (that.mapType === 'BAIDU' || that.mapType === 'BAIDU_OFFLINE') {
                    markers[j].setAnimation(BMAP_ANIMATION_BOUNCE)
                    markers[j].setIcon(new window.BMap.Icon(myIcon2, new window.BMap.Size(32, 32), {anchor: new window.BMap.Size(11.5, 31)}))
                  } else if (that.mapType === 'GOOGLE') {
                    markers[j].setAnimation(google.maps.Animation.BOUNCE)
                    markers[j].setIcon(myIcon2)
                  }
                }
                break
              }
            }
          }
          let allProjectsData = this.$store.state.allProjects.data
          for (let i = 0; i < allProjectsData.length; i++) {
            if (allProjectsData[i].projectCode === remoteData.dataList[0].projectCode) {
              if (this.localDatas.length > 0) {
                for (let j = 0; j < this.localDatas.length; j++) {
                  this.localDatas[j].color = '#ff696a'
                  if (this.localDatas[j].code === remoteData.dataList[0].projectCode) this.localDatas[j].color = '#ee1705'
                }
              }
              if (JSON.stringify(this.localDatas).indexOf(JSON.stringify({code: allProjectsData[i].projectCode, name: allProjectsData[i].projectName, color: '#ff696a'})) === -1 && JSON.stringify(this.localDatas).indexOf(JSON.stringify({code: allProjectsData[i].projectCode, name: allProjectsData[i].projectName, color: '#ee1705'})) === -1) this.localDatas.unshift({code: allProjectsData[i].projectCode, name: allProjectsData[i].projectName, color: '#ee1705'})
            }
          }
          if (isPopTip && this.localDatas.length > 0) {
            this.audioFlag = true
            this.dialogAlarmVisible = true
            this.statisticalNumber()
            store.commit('totalStatus', true)
          }
        })
      } else if (this.wsData.data.msgType === 3) {
        let markers
        let that = this
        if (this.mapType === 'BAIDU') {
          markers = this.bmap.getOverlays()
        } else if (this.mapType === 'GOOGLE') {
          markers = this.gMarkers
        } else if (this.mapType === 'BAIDU_OFFLINE') {
          markers = this.bmap.getOverlays()
        }
        if (this.mapType === 'CUSTOM_MAP') {
          this.$refs['custom-map'].$refs[`mark-${remoteData.dataList[0].projectCode}`][0].lastChild.lastChild.src = myIcon1
          this.$refs['custom-map'].$refs[`mark-${remoteData.dataList[0].projectCode}`][0].lastChild.lastChild.className = ''
        } else {
          for (let i = 0; i < localData.length; i++) {
            let li = localData[i]
            if (localData[i].code === remoteData.dataList[0].projectCode) {
              li.type = true
            }
            for (let j = 0; j < markers.length; j++) {
              if (markers[j].idx !== i) continue
              if (li.type) {
                if (that.mapType === 'BAIDU' || that.mapType === 'BAIDU_OFFLINE') {
                  markers[j].setAnimation(BMAP_ANIMATION_DROP)
                  markers[j].setIcon(new window.BMap.Icon(myIcon1, new window.BMap.Size(32, 32), {anchor: new window.BMap.Size(11.5, 31)}))
                } else if (that.mapType === 'GOOGLE') {
                  markers[j].setAnimation(google.maps.Animation.DROP)
                  markers[j].setIcon(myIcon1)
                }
              }
            }
          }
        }
      }
    },
    filterIndustry (code) {
      this.reRender(code)
    },
    handleEnterProject (arg) {
      this.handleAlarm(arg[0], arg[1])
    },
    handleAlarm (code, name) {
      this.audioFlag = false
      this.dialogAlarmVisible = false
      this.localDatas = []
      let params = {
        projectCode: code
      }
      switchHover(params)
        .then(res => {
          if (res.success) {
            store.commit('projectName', name)
            store.commit('projectCode', code)
            this.$router.push({path: '/InnerMain/Overview'})
            if (this.$parent.md !== 17) {
              this.$emit('handleFullScreen')
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
    },
    reRender (code) {
      let that = this
      let res = this.$store.state.allProjects
      if (!code) {
        code = 'all'
      }
      if (res.success) {
        this.localData = []
        if (this.mapType === 'BAIDU') {
          if (this.bmap) this.bmap.clearOverlays()
          if (res.data.length === 0) {
            that.myGeo.getPoint(CodeToText[that.$store.state.provinceId] + CodeToText[that.$store.state.cityId] + CodeToText[that.$store.state.countyId], function (point) {
              if (point) {
                that.bmap.centerAndZoom(point, 11)
              }
            }, CodeToText[that.$store.state.provinceId])
            return false
          }
        } else if (this.mapType === 'GOOGLE') {
          for (let i = 0; i < this.gMarkers.length; i++) {
            this.gMarkers[i].setMap(null)
          }
        } else if (that.mapType === 'BAIDU_OFFLINE') {
          setTimeout(() => {
            if (this.bmap) this.bmap.clearOverlays()
          }, 2000)
        }
        if (this.mapType === 'CUSTOM_MAP') {
          this.$refs['custom-map'].data.map((item) => {
            this.localData.push({type: true, number: 0, numberWarn: 0, code: item.projectCode, name: item.projectName})
          })
        } else {
          res.data.forEach((item, index) => {
            if (typeof item.latitude !== 'undefined' && item.latitude > 0 && typeof item.longitude !== 'undefined' && item.longitude > 0 && item.industryCode !== 'undefined' && item.industryCode === code) {
              this.localData.push({lng: item.longitude, lat: item.latitude, type: true, number: 0, numberWarn: 0, code: item.projectCode, name: item.projectName})
            } else if (code === 'all') {
              this.localData.push({lng: item.longitude, lat: item.latitude, type: true, number: 0, numberWarn: 0, code: item.projectCode, name: item.projectName})
            }
          })
        }
        if (this.mapType === 'BAIDU' || that.mapType === 'BAIDU_OFFLINE') {
          let myIconN = new window.BMap.Icon(myIcon1, new window.BMap.Size(32, 32), {anchor: new window.BMap.Size(11.5, 31)})
          let myIconA = new window.BMap.Icon(myIcon2, new window.BMap.Size(32, 32), {anchor: new window.BMap.Size(11.5, 31)})
          let pointArray = []
          let opts = {
            width: 205,
            height: 80,
            title: ''
          }
          let _content = ''
          this.localData.forEach(function (v, i) {
            let myIcon = v.type ? myIconN : myIconA
            var marker = new window.BMap.Marker(new window.BMap.Point(v.lng, v.lat), {icon: myIcon, title: v.name})
            marker.idx = i
            if (that.mapType === 'BAIDU_OFFLINE') {
              setTimeout(() => {
                that.bmap.addOverlay(marker)
              }, 2000)
            } else {
              that.bmap.addOverlay(marker)
            }
            if (v.type) {
              marker.setAnimation(BMAP_ANIMATION_DROP)
            } else {
              marker.setAnimation(BMAP_ANIMATION_BOUNCE)
            }
            pointArray[i] = new window.BMap.Point(v.lng, v.lat)
            marker.addEventListener('click', function (e) {
              let p = e.target
              let point = new window.BMap.Point(p.getPosition().lng, p.getPosition().lat)
              let idx = p.idx
              _content = '<div class="project-infoWindow"><h3>' + that.localData[idx].name + '</h3><a href="javascript:;" onclick="openPrjAction(' + '\'' + that.localData[idx].name + '\'' + ', ' + '\'' + that.localData[idx].code + '\'' + ')" class="goWarn">' + that.$t('home.enterProject') + '</a></div>'
              let infoWindow = new window.BMap.InfoWindow(_content, opts)
              that.bmap.openInfoWindow(infoWindow, point)
            })
          })
          this.bounds = pointArray
          if (that.mapType === 'BAIDU_OFFLINE') {
            setTimeout(() => {
              this.bmap.setViewport(pointArray)
              this.queryAlarm(false)
            }, 2000)
          } else {
            this.bmap.setViewport(pointArray)
            this.queryAlarm(false)
          }
        } else if (typeof this.Gmap !== 'undefined' && this.mapType === 'GOOGLE') {
          this.gMarkers = []
          this.infoWindows = []
          let marker, content
          let bounds = new google.maps.LatLngBounds()
          let infowindow = new google.maps.InfoWindow()
          this.localData.forEach(function (v, i) {
            let latlng = that.$func.BD09_To_GCJ02(v.lat, v.lng)
            let icon = {
              url: v.type ? myIcon1 : myIcon2,
              size: new google.maps.Size(21, 34),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(21, 34),
              scaledSize: new google.maps.Size(21, 34)
            }
            marker = new google.maps.Marker({
              map: that.Gmap,
              icon: icon,
              animation: v.type ? google.maps.Animation.DROP : google.maps.Animation.BOUNCE,
              position: new google.maps.LatLng(latlng.lat, latlng.lng)
            })
            marker.idx = i
            that.gMarkers.push(marker)
            bounds.extend(marker.position)
            google.maps.event.addListener(marker, 'click', (function (marker, i) {
              let idx = marker.idx
              return function () {
                content = '<div class="project-gInfoWindow"><h3>' + v.name + '</h3><a href="javascript:void(0);" onclick="openPrjAction(' + '\'' + that.localData[idx].name + '\'' + ', ' + '\'' + that.localData[idx].code + '\'' + ')" class="goWarn" projectCode=' + v.code + ' projectName=' + v.name + '>' + that.$t('home.enterProject') + '</a></div>'
                infowindow.setContent(content)
                infowindow.open(that.Gmap, marker)
                if (that.lastIdx) {
                  that.lastIdx.close()
                }
              }
            })(marker, i))
          })
          this.bounds = bounds
          this.Gmap.fitBounds(bounds)
          this.queryAlarm(false)
        } else if (this.mapType === 'CUSTOM_MAP') {
          this.$refs['custom-map'].data.map((item, index) => {
            item.idx = index
          })
          this.queryAlarm(false)
        }
      }
    },
    handleSelect (item) {
      let params = {
        projectCode: item.projectCode
      }
      if (this.$parent.md !== 17) {
        this.$emit('handleFullScreen')
      }
      switchHover(params)
        .then(res => {
          if (res.success) {
            store.commit('projectName', item.value)
            store.commit('projectCode', item.projectCode)
            this.$router.push({path: '/InnerMain/Overview'})
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
    }
  },
  beforeDestroy () {
    clearInterval(this.repeatid)
    window.removeEventListener('onmessageWS', this.getsocketData)
  },
  watch: {
    '$store.state.location': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.provinceId = newVal[0]
          this.cityId = newVal[1]
          this.countyId = newVal[2]
          this.mapId = setTimeout(() => {
            if (this.bmap !== null && this.bmap !== undefined) {
              this.mapFlag = true
              this.reRender()
            }
            if (this.mapFlag) clearTimeout(this.mapId)
          }, 1000)
        }
      }
    },
    '$store.state.allProjects': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.statisticalNumber()
          this.mapId = setTimeout(() => {
            if (this.bmap !== null || this.bmap !== undefined) {
              this.mapFlag = true
              this.reRender()
            }
            if (this.mapFlag) clearTimeout(this.mapId)
          }, 1000)
        }
      },
      deep: true
    },
    '$store.state.mapHeight': {
      handler (newVal, oldVal) {
        if (newVal) {
          this.mapHeight = newVal
        }
      }
    },
    '$route' (to, from) {
      if (to.path === '/Home') {
        this.statisticalNumber()
        this.queryAlarm(false)
        if ('WebSocket' in window) {
          window.removeEventListener('onmessageWS', this.getsocketData)
        }
      }
      if (to.path === '/InnerMain/Overview') {
        if ('WebSocket' in window) {
          window.removeEventListener('onmessageWS', this.getsocketData)
        }
      }
    }
  },
  computed: {
    fullScreenIndustry: function () {
      if (!(this.mapHeight === window.innerHeight - 185 + 'px')) {
        return {width: '10%'}
      } else {
        return {width: '4%'}
      }
    }
  },
  components: {
    Custom,
    Statistics
  }
}
</script>
<style lang='stylus' scoped>
.project-info .el-row .el-col
    margin 15px 0
#geoMap
    width 100%
    overflow hidden
.map
    width 100%
    height 100%
.el-col
    margin-top 20px
    text-align center
.industry-type
    width 95%
.industry-type .el-col div, .handle-alarm
    cursor pointer
.industry-type .el-col div.grid-content
    height 33px
    line-height 35px
    border-radius 10px
    border 1px solid #66666630
.industry-type .el-col
    width 10%
.industry-title
    margin 10px 0 10px
    font-size 12px
    letter-spacing -1px
    overflow hidden
    text-overflow ellipsis
    display -webkit-box
    -webkit-line-clamp 1
    -webkit-box-orient vertical
.handle-alarm
    color #ee1705
    font-weight 600
.industry-icon
    width 16px
    height 16px
#geoMap >>> .project-infoWindow
    &:after
      content ''
      width 0
      height 0
      border-top 8px solid rgba(96, 100, 112, 0.9)
      border-bottom 0
      border-right 8px solid rgba(96, 100, 112, 0)
      border-left 8px solid rgba(96, 100, 112, 0)
      position absolute
      bottom -23px
      left 41%
      transform translateX(-41%)
      -ms-transform translateX(-41%)
#geoMap >>> .BMap_pop div
    border none !important
#geoMap >>> .BMap_pop  div:nth-child(8)
      display none
#geoMap >>> .BMap_pop div:nth-child(1) div,#geoMap >>> .BMap_pop div:nth-child(3) div,#geoMap >>> .BMap_pop div:nth-child(4),#geoMap >>> .BMap_pop div:nth-child(5) div,#geoMap >>> .BMap_pop div:nth-child(7) div, #geoMap >>> .BMap_top, #geoMap >>> .BMap_bottom, #geoMap >>> .gm-style-iw-c, #geoMap >>> .gm-style .gm-style-iw-t::after
    background-color rgba(96, 100, 112, .9) !important
#geoMap >>> .gm-style-iw-d
    overflow hidden !important
    margin-right 12px
    margin-bottom 12px
#geoMap
    >>> .project-infoWindow h3
      text-align center
      color #fff
      font-size 14px
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
    >>> .project-gInfoWindow h3
      padding 0 50px
#geoMap >>> .BMap_pop div:nth-child(9)
    overflow visible !important
#geoMap >>> .project-infoWindow .goWarn, >>> .project-gInfoWindow .goWarn
    display block
    width 100%
    height 24px
    text-align center
    line-height 24px
    border-radius 3px
    color #fff
    font-size 14px
    cursor pointer
    background-color #6193f2
    text-decoration none
.d-alm-wrap >>> .el-dialog
    border-top-left-radius 4px
    border-top-right-radius 4px
.d-alm-wrap >>> .el-dialog__header
    background-color #ee1705
    color #fff
    border-top-left-radius 4px
    border-top-right-radius 4px
    .el-dialog__close
      color #fff
.d-alm-wrap >>> .el-dialog__header
    padding 10px 20px
    span
      font-size 14px
.d-alm-wrap >>> .el-dialog__headerbtn
    top 10px
.d-alm-title
    display inline-block
    color #ee1705
    font-weight 400
    vertical-align top
.d-alm-content
    display inline-block
    width 265px
    vertical-align top
.device-table
  .el-table, .el-table__expanded-cell, .el-table >>> th, .el-table >>> tr
      background-color transparent
      color #909399
  .el-table, .el-table >>> th, .el-table >>> td
      border 1px solid #ebeef5
  .el-table >>> td, .el-table >>> th.is-leaf
      border-bottom 1px solid #ebeef5
  .el-table--border::after,.el-table--group::after,.el-table::before
      background-color #ebeef5
  .block
    >>> .el-pagination__total, >>> .el-pagination__jump
      color #909399
.el-icon-location
    font-size 20px
</style>
