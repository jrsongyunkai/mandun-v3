<template>
  <div class="base-img-wrap" :class="source === 'inner' ? 'inner-img-wrap' : ''">
    <div class="img-wrap" ref="wrap">
      <canvas :id='uniqueID'></canvas>
    </div>
    <div class="mark-wrap" ref="mark">
      <div v-for="item in datas.data" :key="item.projectCode" class="item-copy tc" :title="item.projectName" :ref="`mark-${item.projectCode}`">
        <span :ref="`project-name-${item.projectCode}`">
          <i class="el-icon-close" @click="handleMarkClose(item.projectCode)"></i>
          <div class="project-name">{{ item.projectName }}</div>
          <el-button class="button-enter" size="mini" type="primary" @click="handleEnterProject(item)">{{ $t('home.enterProject') }}</el-button>
        </span>
        <div class="project-icon"><img :src="myIcon" @click="handleMarkInfo(item.projectCode)"></div>
      </div>
    </div>
  </div>
</template>
<script>
import myIcon from '../../assets/image/nIcon.png'
import myIcon2 from '../../assets/image/wIcon.png'
import uuid from 'uuid/v1'
export default {
  props: {
    source: {
      type: String
    },
    datas: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      remote: [],
      flag: false,
      nWidth: 0,
      nHeight: 0,
      myIcon: myIcon,
      myIcon2: myIcon2
    }
  },
  created () {
    this.uniqueID = uuid()
  },
  mounted () {
    this.initBase()
  },
  methods: {
    initBase () {
      let wrap = this.$refs['wrap']
      let markWrap = this.$refs['mark']
      this.$nextTick(async () => {
        this.data = this.datas.data
        await this.imgLoad(this.datas.imgUrl)
        this.data.map((item) => {
          let mark = this.$refs[`mark-${item.projectCode}`][0]
          mark.style.left = this.nWidth / item.curImgWidth * item.offsetX + (this.nWidth / item.curImgWidth * 21 - 21) / 2 + 'px'
          mark.style.top = this.nHeight / item.curImgHeight * item.offsetY + (this.nHeight / item.curImgHeight * 34 - 34) + 'px'
        })
        markWrap.onmousedown = (event) => {
          event.preventDefault()
          let clientX = event.clientX
          let clientY = event.clientY
          let _left = Number(markWrap.style.marginLeft.substring(0, markWrap.style.marginLeft.length - 2))
          let _top = Number(markWrap.style.marginTop.substring(0, markWrap.style.marginTop.length - 2))
          this.flag = true
          markWrap.onmousemove = (ev) => {
            if (this.flag) {
              ev.preventDefault()
              markWrap.style.marginLeft = wrap.style.marginLeft = _left + ev.clientX - clientX + 'px'
              markWrap.style.marginTop = wrap.style.marginTop = _top + ev.clientY - clientY + 'px'
              markWrap.onmouseleave = (e) => {
                this.flag = false
              }
            }
          }
        }
        markWrap.onmouseup = (event) => {
          this.flag = false
        }
      })
    },
    imgLoad (url) {
      return new Promise(resolve => {
        let mark = this.$refs['mark']
        let wrap = this.$refs['wrap']
        let cvs = document.getElementById(this.uniqueID)
        let ctx = cvs.getContext('2d')
        let img = new Image()
        img.onload = () => {
          this.nWidth = cvs.width = img.width
          this.nHeight = cvs.height = img.height
          cvs.style.position = 'absolute'
          cvs.style.left = 0
          cvs.style.right = 0
          wrap.style.width = mark.style.width = img.width + 'px'
          wrap.style.height = mark.style.height = img.height + 'px'
          wrap.style.left = mark.style.left = '50%'
          wrap.style.top = mark.style.top = '50%'
          wrap.style.marginLeft = mark.style.marginLeft = -(img.width / 2) + 'px'
          wrap.style.marginTop = mark.style.marginTop = -(img.height / 2) + 'px'
          ctx.drawImage(img, 0, 0)
          resolve()
        }
        img.src = url
      })
    },
    handleMarkClose (code) {
      this.$refs[`project-name-${code}`][0].style.display = 'none'
    },
    handleMarkInfo (code) {
      if (this.source === 'inner') return false
      let refs = this.$refs
      for (let x in refs) {
        if (x.indexOf('project-name-') !== -1) {
          if (x === `project-name-${code}`) {
            refs[x][0].style.display = 'block'
            refs[x][0].style.position = 'absolute'
            refs[x][0].style.left = '50%'
            refs[x][0].style.zIndex = 99
            refs[x][0].style.marginTop = -refs[x][0].offsetHeight + 'px'
            refs[x][0].style.marginLeft = -refs[x][0].offsetWidth / 2 + 'px'
          } else {
            refs[x][0].style.display = 'none'
          }
        }
      }
    },
    handleEnterProject (obj) {
      this.$emit('handleEnterProject', obj.projectCode, obj.projectName)
    }
  }
}
</script>
<style lang="stylus" scoped>
.inner-img-wrap
  min-height 500px
.base-img-wrap
  width 100%
  height 100%
  overflow hidden
  position relative
  z-index 4
  color rgb(0, 0, 0)
  text-align left
.img-wrap, .mark-wrap
  overflow visible
  position absolute
  z-index 0
  top 0
  bottom 0
  cursor url(http://api.map.baidu.com/images/openhand.cur) 8 8, default
.mark-wrap
  span
    display none
    padding 25px 15px
    position absolute
    background-color rgba(96,100,112,.9)
    border-radius 3px
.item-copy
  display inline-block
  position absolute
  cursor pointer
  touch-action none
.project-name
    width 220px
    padding-bottom 10px
    color #fff
    font-weight bold
    white-space nowrap
    overflow hidden
    text-overflow ellipsis
.el-icon-close
  position absolute
  top 5px
  right 5px
  color #8f9092
  font-weight bold
.button-enter
  width 100%
.wIcon
  animation: dump 1s linear infinite
@keyframes dump
  0%
    transform: translateY(0)
  25%
    transform: translateY(-10px)
  50%
    transform: translateY(-15px)
  75%
    transform: translateY(-10px)
  100%
    transform: translateY(0)
</style>
