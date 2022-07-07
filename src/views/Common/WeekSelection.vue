<template>
  <div>
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllRepeatChange">{{ $t('system.Indeterminate') }}</el-checkbox>
    <div style="margin: 15px 0;"></div>
    <el-checkbox-group v-model="options" @change="handleCheckedWeekChange">
      <el-checkbox v-for="item in week" :label="item.value" :key="item.value">{{ item.label }}</el-checkbox>
    </el-checkbox-group>
    <div class="mt-20 tr">
      <el-button type="primary" @click="handleSave" size="mini">{{ $t('btns.ok2') }}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    options: {
      type: Object,
      default () {
        return ''
      }
    }
  },
  data () {
    return {
      isIndeterminate: true,
      checkAll: false,
      week: [
        {
          value: '日',
          label: this.$t('echarts.Sunday')
        },
        {
          value: '一',
          label: this.$t('echarts.Monday')
        },
        {
          value: '二',
          label: this.$t('echarts.Tuesday')
        },
        {
          value: '三',
          label: this.$t('echarts.Wednesday')
        },
        {
          value: '四',
          label: this.$t('echarts.Thursday')
        },
        {
          value: '五',
          label: this.$t('echarts.Friday')
        },
        {
          value: '六',
          label: this.$t('echarts.Saturday')
        }
      ]
    }
  },
  mounted () {},
  methods: {
    handleCheckAllRepeatChange (val) {
      this.options = val ? ['日', '一', '二', '三', '四', '五', '六'] : []
      this.isIndeterminate = false
    },
    handleCheckedWeekChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.week.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.week.length
    },
    handleSave () {
      this.$emit('sendWeekSelection', this.options)
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
