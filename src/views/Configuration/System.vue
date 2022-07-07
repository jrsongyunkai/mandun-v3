<template>
  <el-row class="system-wrap">
    <el-col>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-20">
        <el-breadcrumb-item class="pointer" @click.native="$router.go(-1)">{{ $t('btns.back') }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $t('table.configuration') }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-col :span="4">
        <el-menu
          :default-active="defaultActive"
          class="el-menu-vertical"
          background-color="transparent"
          text-color="#FFFFFF">
          <template v-for="(item, index) in menu">
            <el-menu-item v-if="item.val" :index="index" :key="index" @click="selected = item.text">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.text }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-col>
      <el-col v-if="selected === $t('system.alarm')" :span="20">
        <el-tabs v-model="systemActive" id="system-tab" @tab-click="handleClick" v-if="selected === $t('system.alarm')">
          <el-tab-pane :label="$t('system.firstChoice')" name="first">
            <FirstChoice v-if="systemActive === 'first'"></FirstChoice>
          </el-tab-pane>
          <el-tab-pane :label="$t('system.popupNotice')" name="second">
            <PopupNotification v-if="systemActive === 'second'"></PopupNotification>
          </el-tab-pane>
          <el-tab-pane :label="$t('system.alarmSound')" name="third">
            <AlarmSound v-if="systemActive === 'third'"></AlarmSound>
          </el-tab-pane>
          <el-tab-pane :label="$t('system.SMSNotice')" name="fourth">
            <Notification :category="3" v-if="systemActive === 'fourth'"></Notification>
          </el-tab-pane>
          <el-tab-pane :label="$t('system.VoiceNotification')" name="fifth">
            <Notification :category="6" v-if="systemActive === 'fifth'"></Notification>
          </el-tab-pane>
          <el-tab-pane :label="$t('system.AppNotice')" name="sixth">
            <Notification :category="1" v-if="systemActive === 'sixth'"></Notification>
          </el-tab-pane>
          <el-tab-pane :label="$t('system.interfaceNotice')" name="seventh">
            <Notification :category="2" v-if="systemActive === 'seventh'"></Notification>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col v-if="selected === $t('system.associatedAccount')" :span="20">
        <AssociatedAccount></AssociatedAccount>
      </el-col>
      <el-col v-if="selected === $t('system.underlay')" :span="20">
        <Underlay></Underlay>
      </el-col>
    </el-col>
  </el-row>
</template>
<script>
import Underlay from './Underlay'
import FirstChoice from './FirstChoice'
import AlarmSound from './AlarmSound'
import Notification from './Notification'
import PopupNotification from './PopupNotification'
import AssociatedAccount from './AssociatedAccount'
import { queryPageAuth } from '@/api/api'
export default {
  data () {
    return {
      systemActive: 'first',
      defaultActive: 0,
      selected: this.$t('system.alarm'),
      menu: [
        {
          icon: 'el-icon-bell',
          text: this.$t('system.alarm'),
          val: true
        },
        {
          icon: 'el-icon-connection',
          text: this.$t('system.associatedAccount'),
          val: false
        },
        {
          icon: 'el-icon-picture',
          text: this.$t('system.underlay'),
          val: false
        }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let parmas = {
        resKeys: 'AUTH_PROJECT_USE,AUTH_PROJECT_USE',
        operKeys: 'ASSOCIATE,CUSTOM_MAP'
      }
      queryPageAuth(parmas)
        .then(res => {
          if (res.data) {
            this.menu[1].val = res.data[0].result
            this.menu[2].val = res.data[1].result
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
    handleClick (tab, event) {}
  },
  components: {
    Underlay,
    FirstChoice,
    Notification,
    AlarmSound,
    PopupNotification,
    AssociatedAccount
  }
}
</script>
<style lang="stylus" scoped>
.system-wrap
  padding 0 20px
#system-tab
  >>> .el-tabs__header
        .el-tabs__item
          color #fff
.el-menu-item
  height 40px
  line-height 40px
  i
    color #FFF
  &:hover
    background-color #FFFFFF00 !important
.el-menu-item.is-active
  background-color transparent !important
  i
    color #409EFF
.el-menu-vertical
  border-right none
</style>
