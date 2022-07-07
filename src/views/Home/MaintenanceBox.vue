<template>
  <div id="box">
    <el-form ref="form" size="small" :rules="rules" :model="form" label-width="120px">
    <el-row type="flex" justify="center">
      <el-col :span="24">
          <el-form-item :label="$t('control.viewProject') + '：'">
            {{ $store.state.maintenanceObj.projectName ? $store.state.maintenanceObj.projectName : $store.state.projectName }}
          </el-form-item>
          <el-form-item :label="$t('dialog.deviceNo') + '：'">
            {{ $store.state.maintenanceObj.mac ? $store.state.maintenanceObj.mac : this.$store.state.mac }}
            <span class="datetime">
              <span>{{ $t('control.maintenance') + $t('dialog.time') + '：' }}</span>
              <el-date-picker
                v-model="form.maintenanceTime"
                type="datetime"
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                :placeholder="$t('placeholder.pleaseChoose') + $t('main.date') + $t('dialog.time')">
              </el-date-picker>
            </span>
          </el-form-item>
          <el-form-item :label="$t('control.maintenance') + $t('control.content') + '：'" prop="maintenanceContent">
            <el-input type="textarea" :rows="4" v-model="form.maintenanceContent"></el-input>
          </el-form-item>
          <el-form-item :label="$t('control.malfunction') + $t('control.content') + '：'" prop="malfunctionContent">
            <el-input type="textarea" :rows="4" v-model="form.malfunctionContent"></el-input>
          </el-form-item>
          <el-form-item :label="$t('control.process') + $t('control.result') + '：'">
            <el-input type="textarea" :rows="4" v-model="form.handledResult"></el-input>
          </el-form-item>
          <el-form-item :label="$t('control.suggestions') + '：'">
            <el-input type="textarea" :rows="4" v-model="form.suggest"></el-input>
          </el-form-item>
          <el-form-item :label="$t('control.device') + $t('home.image') + '：'">
            <el-col :span="12">
              <span>{{ $t('home.preMaintenancePicture')  + ':'}}</span>
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                name="beforeImgFile"
                :show-file-list="false"
                :data="beforeImgData"
                :on-success="handleSuccess"
                :before-upload="beforeUpload">
                <el-button size="mini" icon="el-icon-upload" class="ml-20" type="primary">{{ $t('btns.upload') }}</el-button>
              </el-upload>
              <div class="preview" v-if="imageUrl">
                <el-image
                  style="width: 200px; height: 200px"
                  :src="imageUrl"
                  :preview-src-list="srcList">
                </el-image>
              </div>
            </el-col>
            <el-col :span="12">
              <span>{{ $t('home.postMaintenancePicture') + ':' }}</span>
              <el-upload
                class="avatar-uploader"
                :action="afterUploadUrl"
                :show-file-list="false"
                name="afterImgFile"
                :data="afterImgData"
                :on-success="handleAfterSuccess"
                :before-upload="beforeUpload">
                <el-button size="mini" icon="el-icon-upload" class="ml-20" type="primary">{{ $t('btns.upload') }}</el-button>
              </el-upload>
              <div class="preview" v-if="afterImageUrl">
                <el-image
                  style="width: 200px; height: 200px"
                  :src="afterImageUrl"
                  :preview-src-list="afterSrcList">
                </el-image>
              </div>
            </el-col>
          </el-form-item>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row type="flex"  class="tr">
      <el-col :span="14">
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">{{ $t('btns.save') }}</el-button>
          <el-button plain @click="cancelForm">{{ $t('btns.cancel2') }}</el-button>
        </el-form-item>
      </el-col>
      <el-col :span="8" class="mr-15 mt-5" v-if="maintenanceBoxObj.equipmentType === 2 && maintenanceBoxObj.channelAddr !== 0 && maintenanceBoxObj.addr !== 0 && maintenanceBoxObj.chnlAddr !== 0">
        <el-checkbox :disabled="!JSON.parse(config.authority.CTL_AUTHORITY)" v-model="mute">{{ $t('control.mute') }}</el-checkbox>
        <el-checkbox :disabled="!JSON.parse(config.authority.CTL_AUTHORITY)" v-model="reset">{{ $t('control.reset') }}</el-checkbox>
      </el-col>
    </el-row>
    </el-form>
  </div>
</template>
<script>
/* global config */
/* global ctxPaths */
import store from '@/store'
import { updateMaintenance, modifyBoxsChnlClearAlarm, modifyBoxsChnlRemoteMute } from '@/api/api'
export default {
  props: {
    maintenanceBoxObj: {
      type: Object,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      config: config,
      mute: false,
      reset: false,
      form: {
        maintenanceContent: this.$store.state.maintenanceObj.maintenanceContent ? this.$store.state.maintenanceObj.maintenanceContent : '',
        malfunctionContent: this.$store.state.maintenanceObj.malfunctionContent ? this.$store.state.maintenanceObj.malfunctionContent : '',
        handledResult: this.$store.state.maintenanceObj.handledResult ? this.$store.state.maintenanceObj.handledResult : '',
        suggest: this.$store.state.maintenanceObj.suggest ? this.$store.state.maintenanceObj.suggest : '',
        maintenanceTime: this.$store.state.maintenanceObj.maintenanceTime ? this.$store.state.maintenanceObj.maintenanceTime + ':00' : this.$func.getNowFormatDateTime() + ':00',
        imgUrls: this.$store.state.maintenanceObj.imgUrls ? this.$store.state.maintenanceObj.imgUrls.split(';') : []
      },
      rules: {
        maintenanceContent: [
          {required: true, message: this.$t('table.pleaseEnter') + this.$t('control.maintenance') + this.$t('control.content'), trigger: 'blur'}
        ],
        malfunctionContent: [
          {required: true, message: this.$t('table.pleaseEnter') + this.$t('control.malfunction') + this.$t('control.content'), trigger: 'blur'}
        ]
      },
      beforeImgData: {name: 'beforeImgFile'},
      afterImgData: {name: 'afterImgFile'},
      uploadUrl: ctxPaths + '/maintenance/imgUrl/before/upload.as?v=' + new Date().getTime(),
      afterUploadUrl: ctxPaths + '/maintenance/imgUrl/after/upload.as?v=' + new Date().getTime(),
      imageUrl: this.$store.state.maintenanceObj.imgUrls ? this.$store.state.maintenanceObj.imgUrls.split(';')[0] : '',
      srcList: [this.$store.state.maintenanceObj.imgUrls ? this.$store.state.maintenanceObj.imgUrls.split(';')[0] : ''],
      afterImageUrl: this.$store.state.maintenanceObj.imgUrls ? this.$store.state.maintenanceObj.imgUrls.split(';')[1] : '',
      afterSrcList: [this.$store.state.maintenanceObj.imgUrls ? this.$store.state.maintenanceObj.imgUrls.split(';')[1] : '']
    }
  },
  mounted () {
  },
  methods: {
    submitForm (formName) {
      let params = this.form
      params.projectCode = this.$store.state.maintenanceObj.projectCode ? this.$store.state.maintenanceObj.projectCode : this.$store.state.projectCode
      params.mac = this.$store.state.maintenanceObj.mac ? this.$store.state.maintenanceObj.mac : this.$store.state.mac
      params.id = this.$store.state.maintenanceObj.id ? this.$store.state.maintenanceObj.id : ''
      params.alarmId = this.$store.state.alarmId ? this.$store.state.alarmId : ''
      this.$refs[formName].validate((valid) => {
        if (valid) {
          params.imgUrls = params.imgUrls.join(';')
          if (this.mute) {
            this.handleControl('REMOTE_MUTE')
          }
          if (this.reset) {
            this.handleControl('CLEAR_ALARM')
          }
          updateMaintenance(params)
            .then(res => {
              if (res.success) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
                this.cancelForm()
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
        } else {
          return false
        }
      })
    },
    cancelForm () {
      store.dispatch('resetMaintenanceObj')
      this.$emit('close-maintenance')
    },
    handleSuccess (res, file) {
      if (res.success) {
        this.form.imgUrls[0] = res.data
        this.form.imgUrls[1] = this.form.imgUrls[1] === undefined ? this.form.imgUrls[1] = '' : this.form.imgUrls[1]
        this.imageUrl = URL.createObjectURL(file.raw)
        this.srcList = [this.imageUrl]
      } else if (res.code === '-1') {
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    handleAfterSuccess (res, file) {
      if (res.success) {
        this.form.imgUrls[1] = res.data
        this.form.imgUrls[0] = this.form.imgUrls[0] === undefined ? this.form.imgUrls[0] = '' : this.form.imgUrls[0]
        this.afterImageUrl = URL.createObjectURL(file.raw)
        this.afterSrcList = [this.afterImageUrl]
      } else if (res.code === '-1') {
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    beforeUpload (file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message({
          message: this.$t('message.exceedSize'),
          type: 'error'
        })
      }
      return isLt1M
    },
    handleControl (cmd) {
      let params = {
        macs: this.maintenanceBoxObj.mac,
        cmd: cmd,
        nodeNo: this.maintenanceBoxObj.chnlAddr ? this.maintenanceBoxObj.chnlAddr : this.maintenanceBoxObj.addr ? this.maintenanceBoxObj.addr : this.maintenanceBoxObj.channelAddr
      }
      if (cmd === 'CLEAR_ALARM' && this.reset) {
        modifyBoxsChnlClearAlarm(params)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: this.$t('message.controlSuccess')
              })
            } else if (res.code === '-1') {
            } else {
              this.$message({
                message: res.data[0].errorMsg,
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
      } else if (cmd === 'REMOTE_MUTE' && this.mute) {
        modifyBoxsChnlRemoteMute(params)
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: this.$t('message.controlSuccess')
              })
            } else if (res.code === '-1') {
            } else {
              this.$message({
                message: res.data[0].errorMsg,
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
    }
  }
}
</script>
<style lang="stylus" scoped>
#box >>> .el-form-item__label
  color #606266
.datetime
  margin-left 50px
.avatar-uploader
  display inline-block
  margin-right 20px
.avatar-uploader-icon
  font-size 28px
  color #8c939d
  width 200px
  text-align center
.preview
  margin-top 10px
  width 200px
  height 200px
  display block
</style>
