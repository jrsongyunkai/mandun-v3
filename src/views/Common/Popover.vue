<template>
  <div>
    <el-popover
      placement="bottom"
      width="250"
      :ref="uniqueID"
      @hide="options[type] = value"
      trigger="click">
      <el-input size="small" :maxlength="type === 'title' ? 8 : 20" show-word-limit @input="(val) => {
        if (type !== 'title') {
          options[type] = val
            .replace(/[^0-9.]/g, '')
            .replace('.', '#*')
            .replace(/\./g, '')
            .replace('#*', '.');
          }
        }" v-model.number="options[type]" :placeholder="$t('placeholder.content')"></el-input>
      <div style="text-align: right; margin: 5px 0 0">
        <el-button type="primary" size="mini" @click="handleMonitor">{{ $t('btns.ok') }}</el-button>
        <el-button size="mini" type="plain" @click="$refs[uniqueID].doClose();options[type] = value">{{ $t('btns.cancel') }}</el-button>
      </div>
      <span slot="reference" @mouseover="mark = type" @mouseout="mark = 0" class="pointer adjustment-name">
        {{ value ? value : ''}}
        <i v-if="permission === 'true' && mark === type" class="el-icon-edit pointer"></i>
      </span>
    </el-popover>
  </div>
</template>
<script>
/* global config */
import uuid from 'uuid/v1'
export default {
  props: {
    options: {
      type: String
    },
    mac: {
      type: String
    },
    type: {
      type: String
    }
  },
  data () {
    return {
      uniqueID: '',
      value: this.options[this.type],
      mark: 0,
      permission: config.authority.BOX_ATTR_MODIFY
    }
  },
  created () {
    this.uniqueID = uuid()
  },
  methods: {
    handleMonitor () {
      this.$emit('monitor')
      this.$refs[this.uniqueID].doClose()
    }
  }
}
</script>
<style lang="stylus" scoped>

</style>
