<template>
  <span>{{ clock }}</span>
</template>
<script>
export default {
  data () {
    return {
      clockId: null,
      clock: this.$func.getNowFormatDateTime()
    }
  },
  mounted () {
    let _this = this
    this.clockId = setInterval(function () {
      _this.init()
    }, 1000)
  },
  methods: {
    init () {
      this.clock = this.$func.getNowFormatDateTime()
    }
  },
  destroyed () {
    this.clockId = null
  }
}
</script>
<style lang="stylus" scoped>

</style>
