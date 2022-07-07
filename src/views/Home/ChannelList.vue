<template>
  <div id="channelList">
    <el-row :gutter="20" style="margin: 0; padding:20px">
      <el-col>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item class="pointer" @click.native="$router.go(-1)">{{
            $t('btns.back')
          }}</el-breadcrumb-item>
          <el-breadcrumb-item>{{
            $t('dialog.channelList')
          }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
          :inline="true"
          size="small"
          :model="formInline"
          class="demo-form-inline tr mt-20"
        >
          <el-form-item class="channel closing-button">
            <el-button
              :disabled="channelAbled"
              @click="batchClosingOrOpening((val = true))"
              >{{ $t('table.batch') + $t('table.closing') }}</el-button
            >
          </el-form-item>
          <el-form-item class="channel">
            <el-button
              :disabled="channelAbled"
              @click="batchClosingOrOpening((val = false))"
              >{{ $t('table.batch') + $t('table.opening') }}</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="formInline.projectCode"
              clearable
              filterable
              :placeholder="$t('table.pleaseEnter') + $t('table.projectName')"
            >
              <el-option
                v-for="item in projectNames"
                :key="item.projectCode"
                :label="item.projectName"
                :value="item.projectCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="formInline.mac"
              @keyup.enter.native="onSubmit"
              :placeholder="$t('placeholder.enterDeviceNo')"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="formInline.status"
              style="width:120px"
              :placeholder="$t('placeholder.pleaseChoose')"
              @change="handleChange"
            >
              <el-option
                v-for="item in stats"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select
              v-model="formInline.state"
              style="width:120px"
              :placeholder="$t('placeholder.pleaseChoose')"
            >
              <el-option
                v-for="item in state"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">{{
              $t('btns.query')
            }}</el-button>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="refreshAbled" @click="queryMacOcList">{{
              $t('btns.refresh')
            }}</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center"></el-table-column>
          <el-table-column
            prop="mac"
            :label="$t('dialog.deviceNo')"
            align="center"
            width="180"
          ></el-table-column>
          <el-table-column
            prop="projectName"
            :label="$t('table.projectName')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="projectAddress"
            :label="$t('table.position')"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="chnlTitle"
            :label="$t('table.lineName')"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column
            :label="$t('table.status')"
            align="center"
            width="150"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.onlineStats === -1" class="c-info">{{
                $t('table.offLine')
              }}</span>
              <span v-if="scope.row.onlineStats === 0" class="c-danger">{{
                $t('control.offline')
              }}</span>
              <span v-if="scope.row.onlineStats === 1" class="c-success">{{
                $t('table.online')
              }}</span>
              <span>|</span>
              <span v-if="scope.row.stats" class="c-success">{{
                $t('table.beenClosed')
              }}</span>
              <span v-else class="c-danger">{{ $t('table.beenOpend') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="onOffTime"
            :label="$t('table.openingClosing')"
            align="center"
          ></el-table-column>
        </el-table>
        <div class="block tc mt-10">
          <el-pagination
            background
            small
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[20, 50, 100, 500]"
            :page-size="pageSize"
            layout="sizes, prev, pager, next"
            :total="channelTotal"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  queryMacOcState,
  batchRemotectrl,
  queryProjectMacAddrDetails
} from '@/api/api'
export default {
  data () {
    return {
      stats: [
        {
          value: '',
          label: this.$t('placeholder.pleaseChoose')
        },
        {
          value: '0',
          label: this.$t('control.offline')
        },
        {
          value: '1',
          label: this.$t('table.online')
        },
        {
          value: '-1',
          label: this.$t('table.offLine')
        }
      ],
      state: [
        {
          value: '',
          label: this.$t('placeholder.pleaseChoose')
        },
        {
          value: true,
          label: this.$t('table.closing')
        },
        {
          value: false,
          label: this.$t('table.opening')
        }
      ],
      formInline: {
        projectCode: this.$route.query.projectCode,
        status: this.$route.query.status,
        mac: this.$route.query.mac
      },
      projectNames: [],
      currentPage: 1,
      channelTotal: 0,
      pageSize: 20,
      tableData: [],
      channelAbled: true,
      refreshAbled: true,
      multipleSelection: [],
      disableRefresh: null,
      disableClosingOrOpening: null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.queryChannel()
    },
    queryChannel () {
      this.tableData = []
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        mac: this.formInline.mac,
        onOrOff: this.formInline.state,
        onlineStats: this.formInline.status,
        projectCode: this.formInline.projectCode
      }
      queryProjectMacAddrDetails(params)
        .then(res => {
          if (res.success) {
            this.tableData = res.datas
            this.channelTotal = res.total
            this.projectNames = this.$store.state.allProjects.data
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
    onSubmit () {
      this.currentPage = 1
      this.queryChannel()
    },
    handleSizeChange (val) {
      this.currentPage = 1
      this.pageSize = val
      this.queryChannel()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.queryChannel()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      if (this.multipleSelection.length > 0) {
        this.refreshAbled = false
        let onlineStatsArr = this.multipleSelection.map(item => {
          return item.onlineStats
        })
        this.channelAbled =
          onlineStatsArr.includes(0) || onlineStatsArr.includes(-1) ? !0 : !1
      } else {
        this.refreshAbled = this.channelAbled = true
      }
    },
    queryMacOcList () {
      this.refreshAbled = true
      this.disableRefresh = setTimeout(() => {
        this.refreshAbled = this.multipleSelection.length > 0 ? !1 : !0
      }, 2000)
      let params = this.multipleSelection.map(item => {
        return item.mac + '-' + item.chnlAddr
      })
      this.$nextTick(function () {
        queryMacOcState({ macAddr: params.join(',') })
          .then(res => {
            if (res.success) {
              for (let j = 0; j < this.tableData.length; j++) {
                for (let i = 0; i < res.data.length; i++) {
                  if (
                    res.data[i].mac === this.tableData[j].mac &&
                    res.data[i].chnlAddr === +this.tableData[j].chnlAddr
                  ) {
                    this.tableData[j].onOffTime = res.data[i].onOffTime
                    this.tableData[j].onlineStats = res.data[i].onlineStats
                    this.tableData[j].stats = res.data[i].state
                  }
                }
              }
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
      })
    },
    batchClosingOrOpening (val) {
      this.channelAbled = true
      this.disableClosingOrOpening = setTimeout(() => {
        let onlineStatsArr = this.multipleSelection.map(item => {
          return item.onlineStats
        })
        if (this.multipleSelection.length > 0) {
          this.channelAbled =
            onlineStatsArr.includes(0) || onlineStatsArr.includes(-1) ? !0 : !1
        } else {
          this.channelAbled = true
        }
      }, 2000)
      // let params = this.multipleSelection.map(item => {
      //   return item.mac + '-' + item.chnlAddr
      // })
      let params = this.multipleSelection.map(item => ({
        mac: item.mac,
        addrOptInfos: [
          {
            onOrOff: val,
            addrs: [+item.chnlAddr]
          }
        ]
      }))
      batchRemotectrl(JSON.stringify(params))
        .then(res => {
          if (res.success) {
            this.$message({
              message: this.$t('message.controlSuccess'),
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
        .catch(err => {
          if (err) {
            this.$message({
              message: this.$t('message.unknown'),
              type: 'error'
            })
          }
        })
    },
    destroyed () {
      clearTimeout(this.disableRefresh)
      clearTimeout(this.disableClosingOrOpening)
    }
  }
}
</script>

<style lang="stylus" scoped>
.channel
  float left
.closing-button
  margin-left 17px
</style>
