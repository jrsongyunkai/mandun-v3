<template>
    <div id="smartMeter">
        <el-col class="box-wrap">
          <el-row>
            <div class="box">
              <el-col>
                <i class="primary-icon iconfont icon-Dollar"></i>
                <span class="tl">
                  <p>{{ $t('dialog.remainingAmount') }}</p>
                  <p v-if="meterData.money">{{ meterData.money + $t('dialog.moneyUnit') }}</p>
                </span>
              </el-col>
            </div>
            <div class="box">
              <el-col>
                <i class="iconfont icon-dianchi"></i>
                <span class="tl">
                  <p>{{ $t('menu.totalPower') }}</p>
                  <p v-if="meterData.money">{{ meterData.electro + 'KWh' }}</p>
                </span>
              </el-col>
            </div>
            <div class="primary-wrap pointer" @click="handelMeterReading">
              <el-col class="tc">
                <i class="primary-icon iconfont icon-chaobiao"></i>
                <p class="primary-title">{{ $t('control.meterReading') }}</p>
              </el-col>
            </div>
          </el-row>
        </el-col>
    </div>
</template>

<script>
import { queryChtqdqMeterReadingData, eleRead } from '@/api/api'
export default {
  props: {
    mac: {
      type: String
    },
    model: {
      type: String
    }
  },
  data () {
    return {
      meterData: {
        money: '',
        electro: ''
      }
    }
  },
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let params = {
        cid: this.mac,
        type: '3,22'
      }
      queryChtqdqMeterReadingData(params)
        .then(res => {
          if (res.code === '0') {
            if (res.data.length > 0) {
              this.meterData = {
                electro: res.data[0].value,
                money: res.data[1].value
              }
            } else {
              this.meterData = {
                money: '',
                electro: ''
              }
            }
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
    handelMeterReading () {
      this.$confirm(this.$t('control.dueMeterReading'), this.$t('dialog.prompt'), {
        confirmButtonText: this.$t('btns.ok'),
        cancelButtonText: this.$t('btns.cancel'),
        type: 'warning'
      }).then(() => {
        let params = {
          cid: this.mac,
          address: this.mac,
          model: this.model
        }
        eleRead(params)
          .then(res => {
            if (res.code === '0') {
              if (res.data.status === 'SUCCESS') {
                this.$message({
                  message: this.$t('message.controlSuccess'),
                  type: 'success'
                })
              } else {
                if (res.data.error_msg) {
                  this.$message({
                    message: res.data.error_msg,
                    type: 'error'
                  })
                } else {
                  this.$message({
                    message: this.$t('control.meterFail'),
                    type: 'error'
                  })
                }
              }
            } else {
              if (res.data.status) {
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
          message: this.$t('message.cancelled')
        })
      })
    }
  },
  watch: {}
}
</script>

<style lang="stylus" scoped>
#smartMeter
  margin-top 15px
  height 191px
.box
  margin-top 40px
  width 160px
  height 70px
  -webkit-border-radius 5px
  -moz-border-radius 5px
  border-radius 5px
  border 1px solid #fff
  display inline-block
  margin-right 15px
  i
    float left
    margin 0 10px
    font-size 40px
    line-height 70px
.primary-wrap
  width 95.5px
  height 70px
  border 1px solid #fff
  -webkit-border-radius 5px
  -moz-border-radius 5px
  border-radius 5px
  display inline-block
  .primary-icon
    font-size 42px
    text-align center
  .primary-title
    margin 0 0 5px
</style>
