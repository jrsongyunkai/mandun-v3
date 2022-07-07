<template>
  <el-col :span="24" >
  <el-tabs v-if="isShow" >
    <WiseList ref="ref"></WiseList>
    <el-tooltip class="item" :value='disabled' effect="light" placement="bottom">
        <div slot="content">
          <div style="cursor: pointer" @click="handleRebind">智家账号重绑</div>
          <div class="mt-10" style="cursor: pointer" @click="discoveryOrviboList">同步设备列表</div>
        </div>
        <img src="../../assets/image/function.png" class="img">
    </el-tooltip>
  </el-tabs>
  <el-dialog
    :visible.sync="successVisible"
    :close-on-click-modal="false"
    width="420px"
    top="31vh"
    :modal="false"
    custom-class="dialogStyle">
    <div class="dialogTitle" >智家365
      <i class="iconfont icon-cha" @click="closeSuccess(reload)" ></i>
    </div>
    <div class="dialogMain tc">
      <div class="successMain">已经跳转到智家365登陆了!</div>
      <el-button size="small" type="primary" @click="handleQuery">确 定</el-button>
      <el-button size="small" @click="closeSuccess(reload)">关 闭</el-button>
    </div>
  </el-dialog>
   </el-col>
</template>

<script>
import WiseList from './WiseList'
import { orbindOrvibo, discoveryOrvibo, getAuthCode } from '@/api/api'
export default {
  data () {
    return {
      isShow: false,
      aShow: true,
      reload: false,
      successVisible: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      orbindOrvibo()
        .then(res => {
          if (res.success) {
            if (res.data) {
              this.isShow = true
            } else {
              this.isShow = false
              this.successVisible = true
              this.getOrviboAuthCode()
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
    discoveryOrviboList () {
      discoveryOrvibo()
        .then(res => {
          if (res.success) {
            this.$message({
              message: '同步成功',
              type: 'success'
            })
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: '同步失败',
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
    toOrvibo () {
      orbindOrvibo()
        .then(res => {
          if (res.success) {
            if (res.data) {
              this.isShow = true
            } else {
              this.isShow = false
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
    getOrviboAuthCode () {
      getAuthCode()
        .then(res => {
          if (res.success) {
            window.open(res.data, '_blank')
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
    handleRebind () {
      this.isShow = false
      this.reload = true
      this.getOrviboAuthCode()
      this.successVisible = true
    },
    closeSuccess (reload) {
      this.successVisible = false
      if (reload) {
        this.isShow = true
      }
      this.reload = false
    },
    handleQuery () {
      this.successVisible = false
      this.isShow = true
    }
  },
  components: {
    WiseList
  }
}
</script>

<style lang="stylus" scoped>
.item
  position absolute
  right 0
  top 0
.img
  margin-bottom -10px
.dialogStyle
  box-sizing border-box
.dialogTitle
  box-sizing border-box
  position absolute
  left 0
  top 0
  width 100%
  background-color #000
  height 40px
  line-height 40px
  text-indent 10px
  color #fff
.icon-cha
  float right
  margin-right 10px
  font-size 14px
  color #6c6c6c
.dialogMain
  position absolute
  width 100%
  height 260px
  left 0
  top 40px
  box-sizing border-box
  background-color #0c1e32
.successMain
  color #fff
  font-size 30px
  line-height 215px
</style>
