<template>
  <el-row class="news">
    <el-col>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="mb-20">
        <el-breadcrumb-item class="pointer" @click.native="$router.go(-1)">{{ $t('btns.back') }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ $t('table.news')}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-col :span="4">
        <el-menu
          :default-active="defaultActive"
          class="el-menu-vertical"
          background-color="transparent"
          text-color="#FFFFFF">
          <template v-for="(item, index) in menu">
            <el-menu-item :index="index" :key="index" @click="handelSelected(item, index)">
              <!-- <i :class="item.icon"></i> -->
              <span style="margin-left: 34px" slot="title">{{ item.text }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </el-col>
      <el-col :span="20">
        <el-col :span="24" class="tr">
          <el-form :inline="true" size="small" :model="formInline" class="demo-form-inline">
            <el-form-item :label="$t('table.status') + ':'">
              <el-select v-model="formInline.region" @change="handleChangeType" :placeholder="$t('placeholder.pleaseChoose')" style="width: 120px">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">{{ $t('btns.query') }}</el-button>
            </el-form-item>
            <!-- <el-form-item>
              <el-button @click="delSubmit">{{ $t('placeholder.all') + $t('placeholder.empty')}}</el-button>
            </el-form-item> -->
          </el-form>
        </el-col>
        <el-col :span="24">
          <el-table
            custom-class="details-dialog"
            :show-header="false"
            :data="tableData"
            @cell-mouse-enter="handleMouseEnter"
            @cell-click="handleClick"
            style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <div>
                  <i class="spot iconfont icon-spot" v-show="!scope.row.isRead"></i>
                  <span :class="scope.row.isRead ? 'ml-20' : ''">{{scope.row.title}}</span>
                  <i class="el-icon-close pointer c-default tableTime icon-top" @click.stop="handelDel(scope.row, scope.$index)"></i>
                  <span class="tableTime" >{{scope.row.createTime}}</span>
                </div>
                <div class="mt-10 ml-20">{{scope.row.content}}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col class="tc mt-10" :span="24">
          <el-pagination
            @size-change="handleSizeChange"
            :page-sizes="[10, 20, 50]"
            :page-size="PageSize"
            layout="sizes">
          </el-pagination>
          <el-button-group>
            <el-button size="small" @click="handlecurrentPage('home')">{{ $t('system.home') }}</el-button>
            <el-button
              size="small"
              @click="handlecurrentPage('prev')"
              :disabled="currentPage === 1"
            >{{ $t('btns.prev') }}</el-button>
            <el-button
              size="small"
              @click="handlecurrentPage('next')"
              :disabled="tableData.length !== pageSize"
            >{{ $t('btns.next') }}</el-button>
          </el-button-group>
        </el-col>
      </el-col>
    </el-col>
  </el-row>
</template>

<script>
import { pageInfoById, delNewsStatus, updateReadStatus } from '@/api/api'
export default {
  data () {
    return {
      defaultActive: 0,
      selected: this.$t('home.all') + this.$t('table.news'),
      menu: [
        {
          text: this.$t('home.all') + this.$t('table.news')
        },
        {
          text: this.$t('table.systemAnnouncement')
        }
      ],
      options: [{
        value: '',
        label: this.$t('placeholder.all')
      }, {
        value: 0,
        label: this.$t('system.unread')
      }, {
        value: 1,
        label: this.$t('system.read')
      }],
      formInline: {
        region: ''
      },
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      msgId: '',
      isRead: '',
      msgType: '',
      pageData: [],
      lastId: ''
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.querypageInfoById()
    },
    handelSelected (item, index) {
      this.selected = item.text
      this.msgType = index === 0 ? '' : 1
      this.handlecurrentPage('home')
    },
    querypageInfoById () {
      let params = {
        msgId: this.msgId,
        isRead: this.isRead,
        msgType: this.msgType,
        pageSize: this.pageSize
      }
      pageInfoById(params)
        .then(res => {
          if (res.success) {
            this.tableData = res.data
            this.lastId = res.lastId
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
    handleChangeType () {
      this.isRead = this.formInline.region
    },
    onSubmit () {
      this.isRead = this.formInline.region
      this.querypageInfoById()
    },
    handleMouseEnter (row, column, cell, event) {
      cell.classList.add('warning-row')
    },
    handleClick (row, column, cell, event) {
      if (row.isRead === 1) {
        return false
      }
      updateReadStatus({ careId: row.careId })
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            row.isRead = 1
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
    handelDel (row, index) {
      let parmas = {
        careId: row.careId
      }
      delNewsStatus(parmas)
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.tableData.splice(index, 1)
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
    handlecurrentPage (e) {
      if (e === 'home') {
        this.currentPage = 1
        this.pageData = []
        this.msgId = ''
      } else if (e === 'prev') {
        if (this.currentPage !== 1) {
          this.currentPage -= 1
          this.pageData.pop()
          this.msgId = this.pageData[this.pageData.length - 1]
        } else {
          return false
        }
      } else if (e === 'next') {
        this.currentPage += 1
        this.pageData.push(this.lastId)
        this.msgId = this.lastId
      }
      this.querypageInfoById()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.querypageInfoById()
    }
  }
}
</script>

<style lang="stylus" scoped>
.news
  padding 0 20px
.el-table, .el-table >>> th, .el-table >>> td
  color #fff
.el-menu-item
  height 40px
  line-height 40px
  i
    color #FFF
  &:hover
    background-color #FFFFFF00 !important
.el-menu-item.is-active
  background-color transparent !important
  i
    color #409EFF
.el-menu-vertical
  border-right none
.spot
  font-size 16px
  color #409EFF
.tableTime
  float right
  margin-top 0
  margin-right 20px
.icon-top
  margin-top 5px
.el-pagination
  padding 0
  margin-top 0
  display inline-block
  vertical-align middle
  .el-pagination__sizes, >>> span:not([class*=suffix]), >>> .el-input__inner
    margin-right 0
    height 32px
</style>
