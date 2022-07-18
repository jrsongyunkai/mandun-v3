<template>
    <div id="login">
        <el-header>
          <img class="logo-img" :src="logo" :width="lWidth" :height="lHeight">{{ topTitle }}
          <a id="prev-version" v-if="prevStatus" title="欢迎尝试使用新版界面，目前尚处于完善中，如果使用过程中遇到问题，请反馈给我们" href="javascript:void(0);" @click="v5Url">{{ $t('version.v5') }} <span style="color:#d53c2e">（New）</span></a>
          <div class="locale" :class="locale">
            <a href="javascript:void(0);" @click="changeLang('zh')">{{ $t('locale.zh') }}</a>
            <span>|</span>
            <a href="javascript:void(0);" @click="changeLang('en')">{{ $t('locale.en') }}</a>
          </div>
        </el-header>
        <el-form :model="loginRuleForm" status-icon :rules="rules" :validate-on-rule-change="false" ref="loginRuleForm" label-width="0" class="login-container">
            <section class="logo">
                <img :src="centerLogo" alt="" :width="cWidth" :height="cHeight">
            </section>
            <el-form-item prop="userName">
                <el-input type="text" @keyup.enter.native="loginSubmit('loginRuleForm')" v-model="loginRuleForm.userName" maxlength="30" :placeholder="$t('placeholder.userName')"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" @keyup.enter.native="loginSubmit('loginRuleForm')" v-model="loginRuleForm.password" maxlength="32" :placeholder="$t('placeholder.password')"></el-input>
            </el-form-item>
            <el-form-item class="verify-code" prop="verifyCode" v-if="codeCheckFlag">
                <el-input type="text" @keyup.enter.native="loginSubmit('loginRuleForm')" v-model="loginRuleForm.verifyCode" maxlength="4" :placeholder="$t('placeholder.verificationCode')"></el-input>
                <div class="code">
                  <img :src="verifyCodes" @click="changeCode">
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :style="{width: '100%'}" @click="loginSubmit('loginRuleForm')">{{ $t('btns.login') }}</el-button>
            </el-form-item>
        </el-form>
        <el-footer>
          <div v-if="chrome" class="browser-detection">{{ $t('footer.tips') }}<a href="https://www.google.com/chrome/" class="chrome-download" target="_blank">{{ $t('footer.browser') }}</a></div>
          <span class="cc1">{{ cc1 }}</span>
          <span class="cc2"><a href="http://beian.miit.gov.cn" target="_blank">{{ cc2 }}</a></span>
          <span>{{ $t('footer.current') + $t('table.version') + '\r' +  version }}</span>
          <span class="cc3"><a :href="cc3Href" target="_blank">{{ cc3 }}</a></span>
        </el-footer>
    </div>
</template>
<script>
/* global config */
import store from '@/store'
import pkg from '../../package.json'
import { getGblinfo, login } from '@/api/api'
export default {
  data () {
    var validateUserName = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('placeholder.userName')))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('placeholder.password')))
      } else {
        callback()
      }
    }
    var validateCode = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('placeholder.verificationCode')))
      } else {
        callback()
      }
    }
    return {
      chrome: false,
      prevStatus: true,
      codeCheckFlag: false,
      rsa: [],
      loginRuleForm: {
        userName: '',
        password: '',
        verifyCode: '',
        title: ''
      },
      rules: {
        userName: [
          {validator: validateUserName, trigger: ['blur']}
        ],
        password: [
          {validator: validatePass, trigger: ['blur']}
        ],
        verifyCode: [
          {validator: validateCode, trigger: ['blur']}
        ]
      },
      edition: '',
      verifyCodes: '/portal/getCode.as',
      notice: '',
      logo: '',
      topTitle: '',
      lWidth: '',
      lHeight: '',
      centerLogo: '',
      cWidth: '',
      cHeight: '',
      cc1: '',
      cc2: '',
      cc3: '',
      cc3Href: '',
      version: 'v' + pkg.version
    }
  },
  created () {},
  mounted () {
    let lang = window.navigator.systemLanguage ? window.navigator.systemLanguage : window.navigator.language
    if (lang && lang.startsWith('en')) {
      this.changeLang('en')
    } else {
      this.changeLang('zh')
    }
    if (window.location.host.toLowerCase().indexOf('snd02') === -1 || document.cookie.indexOf('IDENTITY=') !== -1) {
      this.prevStatus = false
    }
    /* eslint-disable */
    this.rsa = new RSAKey()
    this.changeCode()
    this.browserDetection()
    localStorage.setItem('locale', this.$i18n.locale)
  },
  computed: {
    locale () {
      return {
        'lang-zh': this.$i18n.locale === 'zh',
        'lang-en': this.$i18n.locale === 'en'
      }
    }
  },
  methods: {
    init () {
      let params = {
        fw: 'login'
      }
      let server = window.location.host
      if (!server || server.toLowerCase().indexOf('snd02.com') !== -1 || server.toLowerCase().indexOf('sndtest.com') !== -1 || server.toLowerCase().indexOf('sndtest.lc') !== -1) {
        this.edition = params.e = 'ESTATE_V3'
      } else {
        this.edition = params.e = 'ESTATE_V3_SPECIAL'
      }
      getGblinfo(params).then(res => {
        try {
          if (res) {
            this.loadJs(res)
            store.dispatch('reset')
            store.dispatch('resetEquipmentType')
            store.dispatch('resetMaintenanceObj')
            store.dispatch('resetOverviewMac')
            store.commit('distributionDateType', '')
            store.commit('exponent', config.exponent)
            store.commit('modulus', config.modulus)
            store.commit('platformName', document.title)
            store.commit('pageCustom', config.pageCustom)
            if (this.$store.state.pageCustom.login.logo_top !== undefined) {
              this.logo = this.$store.state.pageCustom.login.logo_top.image !== undefined ? this.$store.state.pageCustom.login.logo_top.image : ''
              this.lWidth = this.$store.state.pageCustom.login.logo_top.width !== undefined ? this.$store.state.pageCustom.login.logo_top.width : 'auto'
              this.lHeight = this.$store.state.pageCustom.login.logo_top.height !== undefined ? this.$store.state.pageCustom.login.logo_top.height : 'auto'
            }
            if (this.$store.state.pageCustom.login.logo_center !== undefined) {
              this.centerLogo = this.$store.state.pageCustom.login.logo_center.image !== undefined ? this.$store.state.pageCustom.login.logo_center.image : ''
              this.cWidth = this.$store.state.pageCustom.login.logo_center.width !== undefined ? this.$store.state.pageCustom.login.logo_center.width : 'auto'
              this.cHeight = this.$store.state.pageCustom.login.logo_center.height !== undefined ? this.$store.state.pageCustom.login.logo_center.height : 'auto'
            }
            if (this.$store.state.pageCustom.login.footer !== undefined) {
              this.cc1 = this.$store.state.pageCustom.login.footer.cc1 !== undefined ? this.$store.state.pageCustom.login.footer.cc1 : '' 
              this.cc2 = this.$store.state.pageCustom.login.footer.cc2 !== undefined ? this.$store.state.pageCustom.login.footer.cc2: ''
              this.cc3 = this.$store.state.pageCustom.login.footer.cc3 !== undefined ? this.$store.state.pageCustom.login.footer.cc3.text : ''
              this.cc3Href = this.$store.state.pageCustom.login.footer.cc3 !== undefined ? this.$store.state.pageCustom.login.footer.cc3.href : ''
            }
            this.topTitle = this.$store.state.pageCustom.login.title !== undefined ? this.$store.state.pageCustom.login.title : ''
          } else {
            this.$message({
              mesage: this.$t('message.unknown'),
              type: 'error'
            })
          }
        } catch (err) {
          this.$message({
            message: err,
            type: 'error'
          })
        }
      })
    },
    browserDetection () {
      this.$nextTick(function () {
        if (window.navigator.userAgent.indexOf('Chrome') === -1) this.chrome = true
      })
    },
    open () {},
    close () {},
    v5Url () {
      const _hn = window.location.host.toLowerCase(),_df = _hn.indexOf('snd')
      if (_df >= 0) {
        window.location.href = document.location.protocol + "//v5." + _hn.substr(_df)
        return false
      }
    },
    loadJs (param) {
      const theHead = document.getElementsByTagName('head').item(0)
      const myScript = document.createElement('script')
      myScript.type = 'text/javascript'
      myScript.innerHTML = param
      myScript.defer = true
      theHead.appendChild(myScript)
    },
    loginSubmit (ev) {
      this.$refs.loginRuleForm.validate((valid) => {
        try {
          if (valid) {
            let userName = this.loginRuleForm.userName
            let code = this.loginRuleForm.verifyCode
            this.rsa.setPublic(this.$store.state.modulus, this.$store.state.exponent)
            let pass = this.rsa.encrypt(this.loginRuleForm.password)
            let params = {
              edition: this.edition,
              loginName: userName,
              password: pass,
              checkCode: code
            }
            login(params).then((res) => {
              if (res.success) {
                this.close()
                this.$router.replace({ path: this.$route.query.redirect ? this.$route.query.redirect : '/Home' })
              }else {
                this.$message({
                  message: res.message,
                  type: 'error'
                })
                this.codeCheckFlag = res.data.codeCheckFlag
                this.changeCode()
              }
            })
          } else {
            this.$message({
              message: this.$t('message.unfilled'),
              type: 'error'
            })
          }
        } catch (error) {
          this.$message({
            message: error,
            type: 'error'
          })
        }
      })
    },
    changeCode () {
      this.verifyCodes = '/portal/getCode.as?randomStr=' + new Date().getTime()
    },
    changeLang (lang) {
      localStorage.setItem('locale', lang)
      this.$i18n.locale = localStorage.getItem('locale')
      if (lang === 'zh') {
        this.$func.setCookie('lang', 'zh_CN')
      } else if (lang === 'en') {
        this.$func.setCookie('lang', 'en_US')
      }
      this.init()
      this.$refs['loginRuleForm'].resetFields()
    }
  }
}
</script>
<style lang="stylus" scoped>
#login
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background: #80cde8 url('../assets/image/lg2-bg.png') no-repeat
    background-position: 10% center
.login-container
    -webkit-border-radius: 5px
    border-radius: 5px
    -moz-border-radius: 5px
    background-clip: padding-box
    width: 350px
    padding: 20px 35px
    background: #fff
    border: 1px solid #eaeaea
    box-shadow: 0 0 25px #cac6c6
    position: absolute
    top: 50%
    margin-top: -200px
    left: 50%
    margin-left: -211px
.logo
    margin-bottom 20px
    text-align: center
.verify-code .el-input
    width: 68%
.code
    display: inline-block
    width: 30%
    height: 40px
    vertical-align: top
.el-header
    position relative
    background: #0d2133
    line-height: 60px
    text-align: center
    font-size: 28px
.el-header #prev-version
    position absolute
    right 20px
    line-height 60px
    font-size: 14px
    color #ffffff
    text-decoration none
.logo-img
    margin-right 10px
    max-height 60px
    vertical-align middle
.browser-detection
   padding-bottom 10px
   color #F56C6C
   font-size 16px
   a
      margin-left 10px
      color #FFF
      text-decoration none
.el-footer
    position absolute
    margin-top: 230px
    left 0
    top 50%
    width 100%
    text-align center
    font-size 14px
    span a
      text-decoration: none
      color: #fff
.locale
    position absolute
    top 0
    line-height 60px
    font-size 14px
    a
      color #fff
      text-decoration none
      cursor pointer
.lang-zh
    right 210px
.lang-en
    right 170px
</style>
