<template>
  <div>
    <div style="margin-left:10px">
      <el-button type="text" class="home" @click="backToHome">{{ $t('btns.backToHome') }}</el-button>
    </div>
    <h3 style="margin-left:10px">本账号所有项目设备电量统计导出页</h3>
    <el-form
      :inline="true"
      ref="rangeExportForm"
      :model="rangeExportForm"
      label-width="80px"
    >
      <el-form-item :label="$t('dialog.time') + $t('dialog.range')">
        <el-date-picker
          v-model="rangeExportForm.value"
          type="monthrange"
          style="width:280px"
          value-format="yyyyMM"
          :clearable="false"
          :editable="false"
          :range-separator="$t('table.to')"
          :start-placeholder="$t('table.startMonth')"
          :end-placeholder="$t('table.endMonth')"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleExportRange">{{
          $t('home.export')
        }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/* global ctxPaths */
export default {
  data () {
    return {
      rangeExportForm: {
        value: ''
      }
    }
  },
  methods: {
    handleExportRange () {
      // console.log(
      //   Number(this.rangeExportForm.value[0]),
      //   Number(this.rangeExportForm.value[1]),
      //   '=====this.rangeExportForm.value'
      // )
      if (
        Number(this.rangeExportForm.value[1]) -
          Number(this.rangeExportForm.value[0]) >
        6
      ) {
        this.$message({
          message: this.$t('message.limitThreeMonths'),
          type: 'error'
        })
        return false
      }
      this.$func.windowCountDown(
        ctxPaths +
          '/project/main/v5/xls/userBoxPowerStats.as?startMonth=' +
          this.rangeExportForm.value[0] +
          '&endMonth=' +
          this.rangeExportForm.value[1]
      )
    },
    backToHome () {
      this.$router.push({path: '/Home'})
    }
  }
}
</script>

<style></style>
