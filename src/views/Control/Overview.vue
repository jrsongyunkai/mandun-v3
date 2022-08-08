<template>
  <div id="tabsOverView">
    <el-col :span="24" style="position: relative;">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('control.protectionSwitch')" name="first">
          <List
            :options="options"
            @sendMac="receiveMac"
            v-if="activeName === 'first'"
          ></List>
        </el-tab-pane>
        <el-tab-pane :label="$t('control.electricalFire')" name="second">
          <List
            :options="options"
            @sendMac="receiveMac"
            v-if="activeName === 'second'"
          ></List>
        </el-tab-pane>
         <el-tab-pane
         :label="$t('control.protectionPanel')"

          name= "nineth"
         >
          <List
            :options="options"
            @sendMac="receiveMac"
            v-if="activeName === 'nineth'"
          ></List>
         </el-tab-pane>
        <el-tab-pane
          :label="$t('control.hydrologicalMonitoring')"
          v-if="activeFlag3"
          name="third"
        >
          <List
            :options="options"
            @sendMac="receiveMac"
            v-if="activeName === 'third'"
          ></List>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('control.flueGasMonitoring')"
          v-if="activeFlag4"
          name="fourth"
        >
          <List
            :options="options"
            @sendMac="receiveMac"
            v-if="activeName === 'fourth'"
          ></List>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('control.streetLamp')"
          v-if="activeFlag5"
          name="fifth"
        >
          <List
            :options="options"
            @sendMac="receiveMac"
            v-if="activeName === 'fifth'"
          ></List>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('control.temperatureHumiditySensor')"
          v-if="activeFlag6"
          name="six"
        >
          <List
            :options="options"
            @sendMac="receiveMac"
            v-if="activeName === 'six'"
          ></List>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('control.smartMeter')"
          v-if="activeFlag7"
          name="seventh"
        >
          <List
            :options="options"
            @sendMac="receiveMac"
            v-if="activeName === 'seventh'"
          ></List>
        </el-tab-pane>
        <el-tab-pane
          :label="$t('control.waterMeter')"
          v-if="activeFlag8"
          name="eighth"
        >
          <List
            :options="options"
            @sendMac="receiveMac"
            v-if="activeName === 'eighth'"
          ></List>
        </el-tab-pane>
      </el-tabs>
      <el-popover placement="bottom" width="160" v-model="visible">
        <el-checkbox-group v-model="checkedCities">
          <el-checkbox
            v-for="item in checkboxList"
            :label="item.value"
            :key="item"
            :value="item.value"
            >{{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="visible = false"
            >取消</el-button
          >
          <el-button type="primary" size="mini" @click="addClassifyTab"
            >确定</el-button
          >
        </div>
        <i
          class="el-icon-menu"
          slot="reference"
          size="large"
          style="position: absolute;right:15px;top:15px;"
          @click="openClassifyTab"
        ></i>
      </el-popover>
    </el-col>
  </div>
</template>
<script>
import store from '@/store'
import List from './List'
import { getEquipmentClassifyTab, saveEquipmentClassifyTab } from '@/api/api'
export default {
  data () {
    return {
      visible: false,
      activeName: 'first',
      options: {
        type: '1',
        mac: ''
      },
      rightView: this.$store.state.rightView,
      tabsWidth: '',
      checkedCities: [],
      checkboxList: [
        // { value: 1, label: '智能空开' },
        // { value: 2, label: '电器火灾' },
        { value: 3, label: '水浸、水位水压' },
        { value: 4, label: '烟雾、可燃气体' },
        { value: 5, label: 'LORA专网' },
        { value: 6, label: '温度、湿度、光照' },
        { value: 7, label: '智能电表' },
        { value: 8, label: '智能水表' }
      ],
      activeList: [],
      activeFlag3: false,
      activeFlag4: false,
      activeFlag5: false,
      activeFlag6: false,
      activeFlag7: false,
      activeFlag8: false
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.monitorTab()
      this.gettClassifyTab()
      if (!this.rightView) {
        if (document.body.clientWidth <= 1800) {
          this.tabsWidth = document.body.clientWidth * 0.7916667 - 240 + 'px'
        }
      }
    },
    openClassifyTab () {
      this.visible = true
    },
    addClassifyTab () {
      // console.log(this.checkedCities)
      if (this.checkedCities.length < 1) {
        this.$message({
          message: '选择不能为空',
          type: 'error'
        })
        return false
      }
      let newCheckList = Array.from(new Set([1, 2, 9].concat(this.checkedCities)))
      // console.log(newCheckList, '======newCheckList')
      let params = {
        projectCode: this.$store.state.projectCode,
        classify: newCheckList.join()
      }
      saveEquipmentClassifyTab(params)
        .then(res => {
          if (res.success) {
            this.visible = false
            this.$message({
              message: res.message,
              type: 'success'
            })
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
        .finally(() => {
          this.gettClassifyTab()
          let tab = {name: 'first'}
          this.handleClick(tab)
        })
    },
    gettClassifyTab () {
      let params = { projectCode: this.$store.state.projectCode }
      getEquipmentClassifyTab(params)
        .then(res => {
          if (res.success) {
            this.activeList = res.data
            this.checkedCities = res.data
            if (this.checkedCities.indexOf(3) > -1) {
              this.activeFlag3 = true
            } else {
              this.activeFlag3 = false
            }
            if (this.checkedCities.indexOf(4) > -1) {
              this.activeFlag4 = true
            } else {
              this.activeFlag4 = false
            }
            if (this.checkedCities.indexOf(5) > -1) {
              this.activeFlag5 = true
            } else {
              this.activeFlag5 = false
            }
            if (this.checkedCities.indexOf(6) > -1) {
              this.activeFlag6 = true
            } else {
              this.activeFlag6 = false
            }
            if (this.checkedCities.indexOf(7) > -1) {
              this.activeFlag7 = true
            } else {
              this.activeFlag7 = false
            }
            if (this.checkedCities.indexOf(8) > -1) {
              this.activeFlag8 = true
            } else {
              this.activeFlag8 = false
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
    monitorTab () {
      let type = this.$store.state.overview.equipmentType
      if (type === 1) {
        this.options.type = '1'
        this.activeName = 'first'
      }
      if (type === 2 || type === 3) {
        this.options.type = '2,3'
        this.activeName = 'second'
      }
      if (type === 4 || type === 5 || type === 18) {
        this.options.type = '4,5,18'
        this.activeName = 'third'
      }
      if (type === 6 || type === 7 || type === 10 || type === 13 || type === 17) {
        this.options.type = '6,7,10,13,17'
        this.activeName = 'fourth'
      }
      if (type === 8) {
        this.options.type = '8'
        this.activeName = 'fifth'
      }
      if (type === 11 || type === 14) {
        this.options.type = '11,14'
        this.activeName = 'six'
      }
      if (type === 12) {
        this.options.type = '12'
        this.activeName = 'seventh'
      }
      if (type === 15 || type === 16) {
        this.options.type = '15,16'
        this.activeName = 'eighth'
      }
      if (type === 19) {
        this.options.type = '19'
        this.activeName = 'nineth'
      }
      this.options.mac = this.$store.state.overview.mac
    },
    handleClick (tab, event) {
      let name = tab.name
      this.activeName = tab.name
      if (name === 'first') this.options.type = '1'
      if (name === 'second') this.options.type = '2,3'
      if (name === 'third') this.options.type = '4,5,18'
      if (name === 'fourth') this.options.type = '6,7,10,13,17'
      if (name === 'fifth') this.options.type = '8'
      if (name === 'six') this.options.type = '11,14'
      if (name === 'seventh') this.options.type = '12'
      if (name === 'eighth') this.options.type = '15,16'
      if (name === 'nineth') this.options.type = '19'
    },
    receiveMac (val) {
      this.options.mac = val
      store.commit('overviewMac', val)
    }
  },
  watch: {
    $route (to, from) {
      if (
        from.path === '/Home' ||
        from.path === '/Overview' ||
        from.path === '/Alarm' ||
        from.path === '/Device'
      ) {
        if (
          [
            '/Home',
            '/Logs',
            '/system',
            '/Overview',
            '/Device',
            '/Alarm',
            '/MaintenanceRecords',
            '/MaintenanceBox',
            '/ConfigurationList',
            '/StralsundConfiguration',
            '/LHydrologicalConfiguration',
            '/PHydrologicalConfiguration',
            '/SmokeConfiguration',
            '/FlammableGasConfiguration'
          ].indexOf(to.path) === -1
        ) {
          this.init()
        }
      }
    },
    '$store.state.rightView': {
      handler (newVal, oldVal) {
        if (newVal === false) {
          this.rightView = newVal
          if (document.body.clientWidth <= 1800) {
            this.tabsWidth = document.body.clientWidth * 0.7916667 - 240 + 'px'
          }
        } else {
          this.tabsWidth = '100%'
        }
      }
    }
  },
  components: {
    List
  }
}
</script>
<style lang="stylus" scoped>
.tabsClass
  width auto !important
.el-tabs
  >>> .el-tabs__item
        color #fff
</style>
