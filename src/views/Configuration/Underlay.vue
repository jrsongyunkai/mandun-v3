<template>
  <div>
    <el-checkbox v-model="checked" @change="handleChange" class="c-default custom-check">{{$t('system.customUnderlay')}}</el-checkbox>
    <span class="c-warning fs-14 ml-5">{{$t('system.customTips')}}</span>
    <el-row class="mt-10 wrap">
      <el-col :span="18">
        <el-upload
          style="display: inline-block"
          :action="uploadUrl"
          name="img"
          :data="imgData"
          :on-success="handleSuccess"
          :before-upload="handleBefore"
          :show-file-list="false"
          :file-list="fileList"
          list-type="picture">
          <el-button size="small" icon="el-icon-upload" type="primary">{{$t('system.importUnderlay')}}</el-button>
        </el-upload>
        <el-col class="static-upload mt-10" ref="static-upload" :style="{height: $store.state.uploadHeight + 'px'}">
          <el-col v-if="imgUrl === ''" class="tc" :style="{marginTop: ($store.state.uploadHeight - 9) / 2 + 'px'}">
            {{$t('system.importImage')}}
          </el-col>
          <el-col v-if="imgUrl !==''" class="img-wrap">
            <img class="ecology" ref="ecology" :src="imgUrl" :alt="imgUrl">
            <div v-for="(item, index) in data" :key="item.projectCode" class="item-copy tc" :x="item.x" :y="item.y" :style="{transform: `translate(${item.x}px, ${item.y}px)`}" :title="item.projectName" :ref="`project-${item.projectCode}`">
              <span :ref="`project-name-${item.projectCode}`">{{ item.projectName }}<i class="el-icon-close pointer" @click="handleClose(item, index)"></i></span>
              <div class="project-icon"><img :src="myIcon" alt=""></div>
            </div>
          </el-col>
        </el-col>
      </el-col>
      <el-col :span="6" style="margin-top: 42px;padding: 0 10px;">
        <el-card class="box-card">
            <div slot="header" class="tc clearfix">
              <span>{{$t('table.projectName')}}</span>
            </div>
            <div :style="{height: $store.state.uploadHeight - 97 + 'px'}">
              <el-scrollbar style="height: 100%;">
                <div v-infinite-scroll="load" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
                  <div v-for="(item, index) in list" :key="index" class="pointer" :ref="`project-${index}`" @click="handleClick(item, index)">
                    <el-col :span="2">
                      <i :class="dataMap.indexOf(item.code) !== -1 ? 'c-success el-icon-check fw' : 'c-default el-icon-check'"></i>
                    </el-col>
                    <el-col :span="22" class="item">
                      {{ item.name }}
                    </el-col>
                  </div>
                  <div class="fs-12 tc c-info" v-if="loading">
                    <span id="load-text">{{loadText}}</span>
                  </div>
                </div>
              </el-scrollbar>
            </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
/* global ctxPaths */
/* global config */
import myIcon from '../../assets/image/nIcon.png'
import store from '@/store'
import interact from 'interactjs'
import { findStaffProperty, saveStaffProperty, queryProject4Select, queryMapInfo, saveMapDetail, delMapDetail } from '@/api/api'
export default {
  data () {
    return {
      cfg: config,
      checked: false,
      imgUrl: '',
      mapId: 0,
      uploadUrl: ctxPaths + '/customMap/img/upload.as?v=' + new Date().getTime(),
      imgData: {
        imgFile: 'img'
      },
      mLeft: 0,
      mTop: 0,
      mouseFlag: false,
      myIcon: myIcon,
      loading: false,
      loadText: this.$t('system.loading'),
      list: [],
      data: [],
      dataMap: [],
      pageNo: 1,
      pageSize: 20,
      curWidth: 0,
      curHeight: 0,
      nWidth: 0,
      nHeight: 0
    }
  },
  created () {
    window.onresize = () => {
      let _height
      if (window.innerHeight < 969) {
        _height = 969
      } else {
        _height = window.innerHeight
      }
      store.commit('uploadHeight', _height - 208)
      this.queryList()
      this.queryMapInfos()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.findProperty()
      this.queryList()
      this.queryMapInfos('mounted')
    },
    onloaded () {
      return new Promise(resolve => {
        document.querySelector('.ecology').onload = () => {
          resolve()
        }
      })
    },
    findProperty () {
      findStaffProperty({property: 'CUSTOM_MAP'})
        .then(res => {
          if (res.success) {
            this.checked = JSON.parse(res.data)
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
    queryMapInfos (lifeCycle) {
      queryMapInfo({})
        .then(res => {
          if (res.success) {
            let _this = this
            this.imgUrl = res.imgUrl
            this.mapId = res.mapId
            this.data = res.data
            this.dataMap = this.data.map(item => { return item.projectCode })
            this.$nextTick(async () => {
              if (lifeCycle === 'mounted') await this.onloaded()
              this.data.map((item) => {
                this.curWidth = window.getComputedStyle(document.querySelector('.ecology')).width
                this.curHeight = window.getComputedStyle(document.querySelector('.ecology')).height
                this.curWidth = Number(this.curWidth.substring(0, this.curWidth.length - 2))
                this.curHeight = Number(this.curHeight.substring(0, this.curHeight.length - 2))
                this.$refs[`project-name-${item.projectCode}`][0].style.position = 'absolute'
                this.$refs[`project-name-${item.projectCode}`][0].style.marginTop = -this.$refs[`project-name-${item.projectCode}`][0].offsetHeight + 'px'
                this.$refs[`project-name-${item.projectCode}`][0].style.marginLeft = -this.$refs[`project-name-${item.projectCode}`][0].offsetWidth / 2 + 'px'
                let element = this.$refs[`project-${item.projectCode}`][0]
                const position = { x: this.curWidth / item.curImgWidth * item.offsetX, y: this.curHeight / item.curImgHeight * item.offsetY }
                element.style.transform =
                  `translate(${this.curWidth / item.curImgWidth * item.offsetX + (this.curWidth / item.curImgWidth * 21 - 21) / 2}px, ${this.curHeight / item.curImgHeight * item.offsetY + (this.curHeight / item.curImgHeight * 34 - 34)}px)`
                interact(element).draggable({
                  listeners: {
                    start (event) {
                      // console.log(event.type, event.target)
                    },
                    move (event) {
                      position.x += event.dx
                      position.y += event.dy
                      element.style.transform =
                        `translate(${position.x}px, ${position.y}px)`
                    },
                    end (event) {
                      let params = {
                        mapId: _this.mapId,
                        projectCode: item.projectCode,
                        offsetX: position.x,
                        offsetY: position.y,
                        curImgWidth: Number(window.getComputedStyle(document.querySelector('.ecology')).width.substring(0, window.getComputedStyle(document.querySelector('.ecology')).width.length - 2)),
                        curImgHeight: Number(window.getComputedStyle(document.querySelector('.ecology')).height.substring(0, window.getComputedStyle(document.querySelector('.ecology')).height.length - 2))
                      }
                      _this.saveMap(params)
                    }
                  }
                })
              })
            })
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
    queryList (callBack) {
      let params = {
        params: {
          keyword: ''
        },
        pageNo: this.pageNo,
        pageSize: this.pageSize
      }
      queryProject4Select(params)
        .then(res => {
          if (res.success) {
            let data = res.datas
            if (!data) data = []
            let len = this.list.length
            this.list = this.list.concat(data)
            if (data && data.length === 0 && !len) {
              this.loadText = this.$t('system.noDataFound')
            } else if (data && data.length < 20) {
              this.loadText = this.$t('system.noMoreData')
            } else {
              this.loading = false
            }
            callBack && callBack()
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
    handleClick (row, index) {
      if (this.imgUrl === '') {
        this.$message({
          message: this.$t('system.notUploadedUnderlay'),
          type: 'error'
        })
        return false
      }
      if (this.dataMap.indexOf(row.code) !== -1) {
        this.handleClose(this.data[this.dataMap.indexOf(row.code)])
      } else {
        let params = {
          mapId: this.mapId,
          projectCode: row.code,
          offsetX: 200,
          offsetY: 60,
          curImgWidth: Number(window.getComputedStyle(document.querySelector('.ecology')).width.substring(0, window.getComputedStyle(document.querySelector('.ecology')).width.length - 2)),
          curImgHeight: Number(window.getComputedStyle(document.querySelector('.ecology')).height.substring(0, window.getComputedStyle(document.querySelector('.ecology')).height.length - 2))
        }
        this.saveMap(params)
      }
    },
    saveMap (params) {
      saveMapDetail(params)
        .then(res => {
          if (res.success) {
            this.queryMapInfos()
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
    handleClose (row, index) {
      delMapDetail({id: row.id})
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.queryMapInfos()
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
    load () {
      this.loading = true
      this.pageNo += 1
      this.queryList()
    },
    handleSuccess (response, file, fileList) {
      if (response.success) {
        this.$message({
          message: response.message,
          type: 'success'
        })
        this.imgUrl = response.data
      } else {
        this.$message({
          message: response.message,
          type: 'error'
        })
      }
    },
    handleBefore (file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message({
          message: this.$t('message.exceedSize'),
          type: 'error'
        })
      } else {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function (event) {
          let img = new Image()
          img.src = event.target.result
          img.onload = () => {
            this.nWidth = img.width
            this.nHeight = img.height
          }
        }
      }
      return isLt1M
    },
    handleChange (val) {
      let params = {
        useCustomMap: val.toString()
      }
      saveStaffProperty(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
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
  },
  watch: {}
}
</script>
<style lang="stylus" scoped>
.wrap
  position relative
.static-upload
  padding 5px
  border-radius 5px
  border 1px solid #eeeeee
  width 100%
  height 100%
.ecology
  position absolute
  max-width 100%
.item
  margin-bottom 18px
  z-index 9999
.item-copy
  display inline-block
  position absolute
  touch-action none
  z-index 999
  span
    padding 2px 5px
    display inline-block
    border 1px solid #fff
    border-radius 3px
    color #fff
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
.el-scrollbar__wrap
  overflow-x hidden
/deep/  .custom-check
          .el-checkbox__label
            &:hover
              color #fff
.project-icon
  font-size 0
.not-allowed
  cursor not-allowed
.img-wrap
  position relative
.c-default
  &:hover
    color #fff !important
</style>
