<template>
  <div id="GreenBirdDevice">
    <el-row style="margin: 30px">
      <el-col :span="14" style="padding-right:20px;border-right:1px solid">
        <el-row :gutter="18" >
          <el-col :span="12">
            <div style="border: 1px solid; height: 75px; border-radius: 8px;">
              <el-row>
                 <el-col :span="7" style="padding:18px">
                   <span><img src="../../../static/images/moniliang.png" alt=""></span>
                 </el-col>
              <el-col :span="13"  style="padding:18px">{{analogValue+analogType || ''}}
                <div>模拟量</div>
              </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="border: 1px solid; height: 75px; border-radius: 8px;">
              <el-row>
                 <el-col :span="7" style="padding:18px">
                   <span><img src="../../../static/images/temptrue.png" alt=""></span>
                 </el-col>
              <el-col :span="13" style="padding:18px">{{temperature+'℃' || ''}}
                <div>温度</div>
              </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="18" style="margin-top: 20px">
           <el-col :span="12">
            <div style="border: 1px solid; height: 75px; border-radius: 8px;">
              <el-row>
                 <el-col :span="7" style="padding:18px">
                   <span><img src="../../../static/images/dianya.png" alt=""></span>
                 </el-col>
              <el-col :span="13"  style="padding:18px">{{voltage+'V' || ''}}
                <div>电压</div>
              </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :span="12">
            <div style="border: 1px solid; height: 75px; border-radius: 8px;">
              <el-row>
                 <el-col :span="7" style="padding:18px">
                   <span><img src="../../../static/images/signal.png" alt=""></span>
                 </el-col>
              <el-col :span="13"  style="padding:18px">{{Math.abs(rssi)+'%' || ''}}
                <div>信号强度</div>
              </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <div style="padding:30px;margin:30px;border:1px solid;border-radius:5px;" @click="getCloseVioces">
          <div style="margin-left:10px">
            <img src="../../../static/images/yuanchengxiaoyin.png" alt="">
          </div>
          <span>
            远程消音</span>
            </div>  </el-col>
    </el-row>
  </div>
</template>

<script>
/* global  */
// import store from '@/store'
import {findJadeBirdFireChannelByMac, httpCommand} from '@/api/api'
export default {
  props: {
    param: {
      type: Object
    },
    online: {
      type: Number
    }
  },
  components: {
  },
  data () {
    return {
      analogValue: '',
      analogType: '',
      voltage: '',
      temperature: '',
      rssi: ''
    }
  },
  created () {},
  mounted () {
    this.init()
  },
  methods: {
    init () {
      console.log(this.param.mac, '=====this.param.mac')
      this.getAddr()
    },
    getAddr () {
      let params = {
        mac: this.param.mac
      }
      findJadeBirdFireChannelByMac(params)
        .then((res) => {
          if (res.success) {
            // console.log(res, '==========res')
            this.analogValue = res.data.analogValue
            this.analogType = res.data.analogType
            this.voltage = res.data.voltage
            this.temperature = res.data.temperature
            this.rssi = res.data.rssi
            // this.formInline.line = res.datas[0].nodeName
            // this.options = res.datas
            // let val = res.datas[0].nodeId
            // store.commit('nodeId', res.datas[0].nodeId)
            // this.handleNodeName(val)
          } else if (res.code === '-1') {
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        })
        .catch((err) => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    },
    getCloseVioces () {
      let params = {
        mac: this.param.mac,
        cmd: 'setMute'
      }
      httpCommand(params).then(res => {
        if (res.success) {
          //  console.log(res, '==========res')
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
    }
  }
}
</script>

<style lang="stylus" scoped>
#TemperatureHumiditySensor {
  margin-top: 15px;
}

.box {
  padding-left: 17px;
  width: 292px;
  height: 191px;
  margin-right: 20px;
  margin-bottom: 20px;
  border-right: 2px solid #fff;
}

.primary-wrap {
  width: 95.5px;
  margin-bottom: 25px;
  border: 1px solid #fff;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
}

.primary-icon {
  font-size: 42px;
  text-align: center;
}

.primary-title {
  margin: 0 0 5px;
}

.attention {
  margin-bottom: 20px;
}

.box-wrap {
  width: 958px;
  overflow: hidden;
}

.box-right {
  margin: 0 20.5px;
  display: inline-block;

  .grid-content {
    width: 331px;
    height: 183.4px;
    -webkit-border-radius: 5.85px;
    -moz-border-radius: 5.85px;
    border-radius: 5.85px;
    border: 1px solid #fff;
  }

  i {
    padding-left: 50px;
    display: inline-block;
    line-height: 183.4px;
    font-size: 60px;
    vertical-align: middle;
  }

  span {
    vertical-align: middle;
    font-size: 22px;
    display: inline-block;
    width: calc(100% - 194px);
  }

  .zh-span {
    padding-left: 59px;
  }

  .en-span {
    padding-left: 30px;
  }

  .grid-content-unavailable {
    border: 1px solid #999;
    color: #999;
  }

  .grid-content-open {
    border: 1px solid #fff;
  }
}

.custom-input {
  >>> .el-input__inner {
    margin-top: -6px;
    background-color: #0c1e32;
    color: #fff;
    font-size: 14px;
    text-align: center;
    border: none;
  }
}

.custom-input {
  >>> .el-input--mini .el-input__icon {
    line-height: 22px;
  }
}

#TemperatureHumiditySensor >>> .details-dialog {
  background-color: #0c1e32;
  position: absolute;
  top: 96px;
  left: 50%;
  margin-left: -661.5px;
  bottom: 0;
  margin-top: 0 !important;
  max-height: calc(100% - 116px);
  max-width: calc(100% - 20px);
  min-width: 1323px;
  display: flex;
  flex-direction: column;
  border: 1px solid #fff;

  .el-dialog__title, .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
    font-size: 18px;
  }

  .el-dialog__header {
    padding: 14px 17px 0;
    height: 19px;
  }

  .el-dialog__body {
    color: #fff;
    padding: 0 17px;
    overflow: auto;
    overflow-y: hidden;
  }

  .el-dialog__headerbtn {
    top: 10px;
    right: 5px;
  }
}
</style>
