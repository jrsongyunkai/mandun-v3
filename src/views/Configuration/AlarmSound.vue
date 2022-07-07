<template>
  <div id='alarm-sound' class="mt-20" >
      <i class="el-icon-plus pointer c-default" @click="addAlarmSound()" >{{ $t('system.add') }}</i>
      <span class="alarm-sound-tip ml-20 c-warning">{{ $t('dialog.prompt') + '：' + $t('dialog.alarmSoundTips') }}</span>
      <el-table
        :data="SoundList"
        style="width: 100%;margin-top: 30px;">
          <el-table-column
            :label="$t('table.soundFile')"
            align="left"
            width="448">
            <template slot-scope="scope">
              <div class="voice-file">
                <span class="voiceSelect pointer c-default" @click="selectAdd(scope.$index)" >{{ $t('btns.select') }}
                  <input type="file" style="display: none" accept=".mp3" name="warnAudio" id="people-export" ref="inputer" @change="fileUpload" />
                </span>
                <span :class="$i18n.locale === 'en' ? 'en-path' : 'path'"  v-show="scope.row.path !== ''" >{{ scope.row.path }}</span>
                <span v-if="scope.row.path !== ''" class="pointer audition c-default" @click="viocePaly(scope.row, scope.$index)" >{{ $t('system.audition') }}
                  <audio :src="ctxPaths + scope.row.path" ref="audio"></audio>
                </span>
                <span v-if="scope.row.path !== ''" class="pointer delete c-default" @click="delVoiceFlie(scope.row.path, scope.$index)" >{{ $t('system.delete') }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('table.alarmType')"
            align="left">
            <template slot-scope="scope">
              <span class="tag-add pointer c-default" @click="handleAdd(scope.row.typeNumbers, scope.$index)">{{ $t('system.add') }}</span>
              <el-tag
                size="medium"
                v-for="tag in scope.row.typeNumbers"
                :key="tag.typeNumber"
                closable
                :disable-transitions="false"
                @close="handleTypesClose(scope.row.typeNumbers, tag)">
                {{ tag.alarmInfo }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            :width="$i18n.locale === 'zh' ? 100 : 150"
            :label="$t('table.operating')"
            align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" class="c-default" @click="handleSave(scope.row)">{{ $t('btns.save') }}</el-button>
              <el-button type="text" size="mini" class="c-default" @click="handleDel(scope.row, scope.$index)">{{ $t('btns.remove') }}</el-button>
            </template>
          </el-table-column>
      </el-table>
      <el-dialog :title="$t('dialog.alarmTypeSelection')" :modal="false" :visible.sync="flag" top="30vh" @close="handleSaveTypes">
        <checkbox-group v-model="alarmTypeList" ref="typesCheckboxGroup"></checkbox-group>
    </el-dialog>
  </div>
</template>

<script>
/* global ctxPaths */
import CheckboxGroup from '../Common/CheckboxGroup'
import { updateAlarmSound, queryAlarmSound, saveAlarmSound, delAlarmSound, soundDel } from '@/api/api'
export default {
  data () {
    return {
      ctxPaths: ctxPaths,
      SoundList: undefined,
      index: '',
      urlPath: '',
      length: 0,
      flag: false,
      alarmTypeList: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.QueryAlarm()
    },
    QueryAlarm () {
      queryAlarmSound({})
        .then(res => {
          if (res.success) {
            this.SoundList = res.data
            this.length = res.data.length
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
    addAlarmSound () {
      if (this.length === this.SoundList.length - 1) return false
      if (this.SoundList === undefined) {
        this.SoundList = []
      }
      let obj = {
        id: 0,
        path: '',
        typeNumbers: []
      }
      this.SoundList.unshift(obj)
    },
    selectAdd (index) {
      this.$refs.inputer.click()
      this.index = index
    },
    viocePaly (row, index) {
      this.$refs.audio.src = this.ctxPaths + row.path
      this.$refs.audio.addEventListener('loadedmetadata', () => {
        this.$refs.audio.currentTime = 0
      }, false)
      this.$refs.audio.play()
      setTimeout(() => {
        this.$refs.audio.pause()
      }, 3000)
    },
    fileUpload (e) {
      let file = e.target.files
      let size = file[0].size
      if (size / 1024 > 150) {
        this.$message({
          message: this.$t('message.exceedUpSize'),
          type: 'error'
        })
        return
      }
      let formData = new FormData()
      formData.append('name', 'warnAudio')
      formData.append('warnAudio', file[0])
      updateAlarmSound(formData).then(res => {
        if (res.success) {
          this.SoundList[this.index].path = res.data
          e.target.value = ''
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
    handleAdd (row, index, origin) {
      this.index = index
      this.alarmTypeList = row.map((item) => {
        return item.typeNumber
      })
      this.flag = true
      if (origin) {
        this.$nextTick(() => {
          this.$refs.typesCheckboxGroup.changeList(origin)
        })
      }
    },
    handleSaveTypes () {
      let cfg = this.$store.state.alarmForConfig
      this.SoundList[this.index].typeNumbers = []
      cfg.forEach((value) => {
        this.alarmTypeList.forEach((item) => {
          if (value.typeNumber === item) {
            this.SoundList[this.index].typeNumbers.push({typeNumber: value.typeNumber, alarmInfo: value.info})
          }
        })
      })
      this.flag = false
    },
    handleTypesClose (row, tag) {
      let index = row.indexOf(tag)
      if (index > -1) row.splice(index, 1)
    },
    handleDel (row, index) {
      if (row.id === 0) {
        this.SoundList.splice(index, 1)
      } else {
        this.$confirm(this.$t('message.confirmDeleteConfig'), this.$t('dialog.prompt'), {
          confirmButtonText: this.$t('btns.ok'),
          cancelButtonText: this.$t('btns.cancel'),
          type: 'warning'
        }).then(() => {
          soundDel({id: row.id})
            .then(res => {
              if (res.success) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
                this.QueryAlarm()
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('message.undelete')
          })
        })
      }
    },
    delVoiceFlie (path, index) {
      delAlarmSound({'path': path})
        .then(res => {
          if (res.success) {
            this.SoundList[index].path = ''
            this.$message({
              message: this.$t('system.delete') + this.$t('system.success'),
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
    },
    handleSave (row) {
      if (row.path === '' || row.typeNumbers.length === 0) {
        this.$message({
          message: this.$t('message.atLeastOneItem'),
          type: 'error'
        })
        return false
      }
      row.typeNumbers = row.typeNumbers.map((item) => {
        return item.typeNumber
      })
      saveAlarmSound(JSON.stringify(row))
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('btns.save2') + this.$t('system.success'),
              type: 'success'
            })
            this.QueryAlarm()
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
  components: {
    CheckboxGroup
  }
}
</script>

<style lang="stylus" scoped>
.el-icon-plus
  font-size 12px
.alarm-sound-tip
  font-size 14px
.voice-file
  span
    display inline-block
    line-height 23px
    vertical-align middle
.voiceSelect
  font-size 14px
.path, .en-path
  display inline-block
  margin-left 1%
  white-space nowrap
  text-overflow ellipsis
  overflow hidden
.path
  width 76%
.en-path
  width 63%
.el-tag + .el-tag
  margin 0 0 5px 5px
.el-tag
  color #fff
  background transparent
.tag-add
  margin-right 5px
  line-height 40px
</style>
