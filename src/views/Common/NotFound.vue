<template>
    <div id="notFound">
        <div class="notFound">
            <img src="../../assets/image/notFound.jpg" alt="404">
            <div class="">
                <a class="home" @click="backToHome">{{ $t('btns.backToHome') }}</a>
            </div>
            <p class="errorTips"><span>{{ $t('notFound.possibleReason') }} </span>{{ $t('notFound.listOfReasons') }}</p>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {}
  },
  methods: {
    backToHome () {
      this.$router.push({path: '/Home'})
    }
  }
}
</script>
<style lang="stylus" scoped>
#notFound
    position fixed
    left 0
    top 0
    height 100%
    width 100%
    background #fff
.notFound
    margin-top 100px
    text-align center
.errorTips
    color #9fa0a0
    font-size 14px
    margin-top 20px
    span
        color #595757
.home
    width 100px
    border 1px solid #EDEDED
    margin 0 auto
    padding 0 20px
    display block
    line-height 40px
    color #fff
    background #367dff
    text-decoration none
    cursor pointer
</style>
