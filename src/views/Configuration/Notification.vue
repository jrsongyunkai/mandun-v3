<template>
  <div class="mt-20">
    <el-col v-if="data.length === 0 && this.count === 1" class="c-danger">
      {{ $t('system.nonactivated') }}
      <el-button
        type="text"
        class="add-btn ml-20 pointer"
        @click="openFlag = false"
      >{{ $t('system.open') }}</el-button>
    </el-col>
    <el-col>
      <el-form class="SMS-form" :model="form" ref="form" v-if="category === 3 || category === 6">
        <el-form-item class="mb-0" :label="category === 3 ? $t('system.SMSAccount') : $t('system.VoiceAccount')">
          <span>{{ $t('system.remaining') + (remaining ? remaining : 0) + (category === 3 ? $t('system.piece') : $t('table.minute')) }}</span>
          <el-button
            type="text"
            class="fw add-btn ml-20"
            @click="instantRecharge"
          >{{ $t('system.recharge') }}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col v-if="!openFlag || data.length > 0 || this.count > 1" class="tips-wrap">
      <i class="el-icon-plus pointer fs-12 c-default" v-if="category === 1 || category === 3 || category === 6" @click="addNotification" >{{ $t('system.add') }}</i>
      <i class="el-icon-plus pointer fs-12 c-default" v-if="category === 2 && data.length === 0" @click="addNotification" >{{ $t('system.add') }}</i>
      <span class="alarm-sound-tip ml-20 fs-14 c-warning" v-if="category === 3">{{ $t('dialog.prompt') + '：' + $t('dialog.SMSTips') }}</span>
      <span class="alarm-sound-tip ml-20 fs-14 c-warning" v-if="category === 6">{{ $t('dialog.prompt') + '：' + $t('dialog.VoiceTips') }}</span>
      <span class="alarm-sound-tip ml-20 fs-14 c-warning" v-if="category === 1">{{ $t('dialog.prompt') + '：' + $t('dialog.LocalAppTips') }}</span>
    </el-col>
    <el-table
      :data="data"
      ref="table"
      v-if="!openFlag || data.length > 0 || this.count > 1">
      <el-table-column
        v-if="dataFlag"
        align="left"
        width="270"
        :label="$t('system.allodwdProject')">
        <template slot-scope="scope">
          <span class="tag-add pointer c-default" @click="handleAddProject(scope.row.prjList, scope.$index)">{{ $t('system.add') }}</span>
          <el-tag
            size="medium"
            v-for="tag in scope.row.prjList"
            :key="tag.code"
            closable
            :disable-transitions="false"
            @close="handleProjectClose(scope.row.prjList, tag)">
            {{ tag.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.AppChannel')" width="180" v-if="category === 1 && dataFlag">
        <template slot-scope="scope">
          <el-checkbox-group v-model="scope.row.appChnl">
            <el-checkbox :label="$t('system.IOS')" class="c-default"></el-checkbox>
            <el-checkbox :label="$t('system.Android')" class="c-default"></el-checkbox>
          </el-checkbox-group>
        </template>
      </el-table-column>
      <el-table-column  :label="$t('system.interfaceUrl')" v-if="category === 2 && dataFlag">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.url"></el-input>
        </template>
      </el-table-column>
      <el-table-column :label="$t('system.signatureSaltValue')" :width="$i18n.locale === 'zh' ? 100 : 150" v-if="category === 2 && dataFlag">
        <template slot-scope="scope">
          <el-input size="small" v-model="scope.row.salt"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        align="left"
        :label="$t('system.reveivePhone')"
        width="220"
        v-if="(category === 3 || category === 6) && dataFlag">
        <template slot-scope="scope">
          <el-popover
            placement="top"
            width="250"
            :ref="`phone-popover-${scope.$index}`">
            <el-input size="small" maxlength="20" show-word-limit v-model.trim="form.phone" :placeholder="$t('table.pleaseEnter') + $t('system.mobilePhone')"></el-input>
            <div class="tr" style="margin: 5px 0 0">
              <el-button type="primary" size="mini" @click="handleAddPhone(form.phone, scope.$index)">{{ $t('btns.ok') }}</el-button>
              <el-button size="mini" type="plain" @click="$refs[`phone-popover-` + scope.$index].doClose();form.phone = ''">{{ $t('btns.cancel') }}</el-button>
            </div>
            <span slot="reference" class="tag-add pointer c-default">{{ $t('system.add') }}</span>
          </el-popover>
          <span v-if="scope.row.phoneNumber !== ''">
            <el-tag
              size="medium"
              v-for="tag in scope.row.phoneNumber.split(',')"
              :key="tag"
              closable
              :disable-transitions="false"
              @close="handleClosePushPhone(tag, scope.$index)">
              {{ tag }}
            </el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="dataFlag"
        align="left"
        :min-width="$i18n.locale === 'zh' ? 200 : 240"
        :label="$t('system.allowedType')">
        <template slot-scope="scope">
          <span class="tag-add pointer c-default" @click="handleAddAlarm(scope.row.alarmList, scope.$index)">{{ $t('system.add') }}</span>
          <el-tag
            size="medium"
            v-for="tag in scope.row.alarmList"
            :key="tag.typeNumber"
            closable
            :disable-transitions="false"
            @close="handleTypesClose(scope.row.alarmList, tag)">
            {{ tag.alarmInfo }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        v-if="dataFlag"
        align="left"
        width="175"
        :label="$t('system.timePeriodNotification')">
        <template slot-scope="scope">
          <div>
            <el-popover
              placement="top"
              width="180"
              :ref="`time-popover-${scope.$index}`">
              <time-picker
                v-on:period-flag="handlePeriodFlag(scope.$index)"
                v-model="scope.row.timeRanges"
                :index="scope.$index"
                :ref="`time-picker-${scope.$index}`"
              ></time-picker>
              <span slot="reference" class="tag-add pointer c-default" @click="handleAddTime(scope.$index)">{{ $t('system.add') }}</span>
            </el-popover>
            <el-tag
              size="medium"
              v-for="tag in scope.row.timeRanges"
              :key="tag"
              closable
              :disable-transitions="false"
              @close="handleTimeClose(tag, scope.row.timeRanges)">
              {{ tag }}
            </el-tag>
          </div>
          <div>
            <span>{{ $t('table.silenceCycle') + '\xa0\xa0'}}</span>
            <el-select v-model="scope.row.silenceTimeout" size="mini" style="width: 80px" :placeholder="$t('placeholder.pleaseChoose')">
              <el-option
                v-for="item in timeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="category === 3 && dataFlag"
        :width="$i18n.locale === 'zh' ? 90 : 150"
        :label="$t('system.SMSsignature')">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.generalSignName" class="c-default">{{ $t('system.generic') }}</el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        v-if="dataFlag"
        :width="$i18n.locale === 'zh' ? 90 : 150"
        :label="$t('table.status')">
        <template slot-scope="scope">
          <el-select size="mini" v-model="scope.row.pushEnable">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        v-if="dataFlag"
        :width="$i18n.locale === 'zh' ? 90 : 150"
        :label="$t('table.operating')">
        <template slot-scope="scope">
          <el-button type="text" size="small" class="c-default" @click="handleSave(scope.row)">{{ $t('btns.save') }}</el-button>
          <el-button type="text" size="small" class="c-default" @click="handleDel(scope.row, scope.$index)">{{ $t('btns.remove') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页 v5也没有做  已做-->
    <el-pagination
      :page-size="10"
      layout="slot">
    </el-pagination>
    <div class="tc" v-if="(data.length > 0 || this.count > 1) && category !== 2">
      <el-button-group>
        <el-button size="small" @click="handlePage('home')">{{ $t('system.home') }}</el-button>
        <el-button size="small" icon="el-icon-arrow-left"  @click="handlePage('prev')" :disabled="count <= 1">{{ $t('btns.prev') }}</el-button>
        <el-button size="small" @click="handlePage('next')" :disabled="length < 10">{{ $t('btns.next') }}<i class="el-icon-arrow-right el-icon--right"></i></el-button>
      </el-button-group>
    </div>
    <!-- v5剩下的弹窗  完成-->
    <el-dialog
      :title="category === 3 ? $t('dialog.SMSRecharge') : $t('dialog.VoiceRecharge')"
      :close-on-click-modal="false"
      :modal="false"
      :visible.sync="rechargeFlag"
      width="35%"
      top="30vh"
      id="recharge-form"
      @close="handleCloseRecharge"
    >
      <span v-if="packageFlag">
        <span class="fw recharge-tip">{{ $t('dialog.rechargePackage') }}</span>
        <el-radio-group v-model="rechargeOption" id="rechargeOption">
          <el-radio :label="parseInt(item.split(':')[0])" v-for="(item, index) in rechargeOptions" :key="index">{{ item.split(':')[2] + (category === 3 ? $t('system.piece') : $t('table.minute')) + '(' + item.split(':')[1] + $t('dialog.moneyUnit') + ')'}}</el-radio>
        </el-radio-group>
        <span class="fw recharge-tip">{{ $t('dialog.rechargeInstructions') }}</span>
        <div slot="footer" class="dialog-footer">
          <el-button
            type="primary"
            size="small"
            @click="payImmediately"
          >{{ $t('btns.instantRecharge') }}</el-button>
        </div>
      </span>
      <span v-if="!packageFlag">
        <el-row>
          <el-col :span="24" v-if="!paymentResultFlag">
            <el-col :span="10" class="pay-code">
              <img
                src="data:image/png;base64,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"
              />
              <img :src="qrCode" class="qr-code" />
              <img
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQQAAABWCAYAAAApOehCAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAABEwSURBVHja7J1/UBvnmce/znTq2GiwRiHDgYM1dvlhxmBb8o8ZyYd9eAZKrXPd+lBh0oNTomZunMxJzrXjzulmgsVc6F1ydwNMY6Z15Kh2rgcV46bJyPHAjKntQ2qTWCJjWmIJh5OxITo7OnAQNv3juD92V+xKu9KKn8I8n78MSLvvrvf5vs/zvO8+z7rZ2VmUfftlNwiCWNMMvn/GsG7H0RPuPNVzYwB+QLeEINYsb49H7uY/xf5AYkAQa5sfAMBTdB8IguAgQSAIggSBIAgSBIIgSBAIgiBBIAiCBIEgCBIEgiBIEAiCIEEgCIIEgSAIEgSCIEgQCIIgQSAIggSBIAgSBIIgMoSvLefJep22eX+3ytTyxI2DIMhDIAiCBIEgCBIEgiBWEV9byZOvVDyeznkXkm8gCPIQiNRojehqNUIv+YFKdDgtaNbKOI7o52R+f5Gvw2y3octazPtAMZpbbegwSh1A/O96qwW99soUJ69EhzPZsVNgNKPXaYY56XiYn4XXRB4Csdj4XOg5ZoPdaUan6TrUrbXQKRM/VmixoVfwmzA6TQ44OMOpyINqYhyXfekPQW+1wK5RpPWdYXcLTrh4xtJYhEi/Fw1OM0pNDsGxrbiMurbNeFY5hfu3pYyyAjplGJ0u4a89bTcx7NShw9jHO58McbIUQSV7/AQJQgbhaGoB7DZUW4G6ky0is1857re34zWf9Oxas1WByAjQ4LTBDjmCEmcUE0E0nXTBI5gha/Fsf7zhVKLDqYsTlBroJr2ocgEdBikjzYFqYhwXJK7BXJaLiL8bsNvQqxb5gMGGXsGxp+CVuic+F+pMybwJXXJvwZArfV5NLXqda0NUSBBWWBQcYg+khEFH/N2oawuwxrYLJcowetpccIgaQCpBmT+MdxGF11+O3lYgAgXquVyLuhZ2ABE/68EoFbDz8jAxg9IaUa2ewq3fBODwtYhcQ7IwiecJsMYruDdpeBL1Thuq/d2oMgVEBJH5uWRE5rFJEFaOgrxnoNtdhLLiAqjzc7ApeyOyNqxH9NEMJh9O4874A9y8NQrvQBCj419m9sW4HKhypWfQ5mNFUE0EMZSGoCzW7FaqisZCnYiIsTAhw2bGg2EN1Wy3oTrSHTu/+VgRVAgj5JszPLGwKdG74TwBdtZP95o4T8JoRq8BghCMWGWCsG4doNcUo96gR9bG9fAOBPHhtQGExh5g8uE0oo9mkLVhPTZlb8SWvByUlxTAbqlFdHoGnW4PPP4AZmdX+CL4M9REEE392bCLGHNSlx9m1KsBTEjlF+IFhZ354k+gLBLM3tKuOnvumGfjYAxKGUanyMzpaWuHR2tEl2YuFFFvAiKDgdg9qBaECAG8djITdoDGjyNTxkWCkMBzf6bCq6Yj+Gr6MZy/voobgyOin4s+mkH00QzGwv+L3w0EcbbrCvaUbcXRw3twvHo/Wp0fYvSLFfQY+DPUATHvIBXFaG7NxXAojMJNCxzLvHMIxWg+kAuEvHCAWV2oj8sBDIfCQCgMqDYDAC+5yCYjQ2Go1MLjF0KOhxD3y3wmhIB/IW69PA8l4n/yQ4dlFYT57js4uK8UPzIb4Lx4DRd7Pkr7+zcGR3BjcATfrd6Ht06/gH91uHHt46ElHfPiP5CsB6DdhZJJL+oGtzGCEiMX9U4b6pOFDIs1XGMFM9bJuFyIWC6jNQd6LaBCFJ/42NwHN/6YIPThhKkvjQHwBGQr0GRqgYddIkx2DxOvP5fNIXhxSyA4ErkE8hBWniOHduOk6Vs49cYvMTAUWtCxft3zMUZG/wdvnHoerc71uHR1IKOuVXIGYuPdmIfhA2DcliIHwY+vJUKGyQc87yANYzRkYTg0FZvRE5YwY57HPdxHORqOAarQTUY0xMafdsiVjR6TF3DqgH7Ow0nm3vM8HEFSkQuzitHcSvmDjBeEg/u2w/o338LLp88xLugiMDAUwsunz+GtphcRfTSDqx8NZcz1qnjLW2IeQjK4pF1dW4BZ7kMYPS7pWLhUpQDUOvSKLcclyyFocwD/ZVxADewqkfCDC4XY814eqYFdo8Cwu2+BHhK35DiXVNy70JAt7hoL46877ucICcLK5gx+aP5L/PjN/1w0MeDHt6fe+CWaTxpx+04Yd7/IjP9qWR6CBI4mL/Y6a9HbGkTnCLNhaSiJAao3iZ1PRg7B58IJH7MPIam3YTSjK/866saigAbSm5NkxehMknSpoZAhQwVh3TrgVdMR/OLiNQwM/feSnOPTz0L4xcVreNV0BD/6l3dXbvVBa0TXMeDWAj0ELg43222o1wDDbpd0OKDdhRIlEBlbnARZqUqBSOQeEz7kZwHKXNgNYXSaNqPDmYvIxBR0jUbofa55hCjEmhcEvaYYX00/nlcCMR0u9nyEndu3QK8pRr9vBbLHyiLYLWF2Tb9oQR7CXGw8Ba97HCUxdzecsNbO7WFoS2t1Q2oLciX2shuMYqHIRBBNJz9FTWstVP5u1LUBza21sNsrUdXUt4g3cEqW50GsckH43hEdzr93Le3v9Tptaa8KfHDlBhq/c3DZBYHbtssIQDGaJQ2chV3iExeLXNbwedl+1tj1VgvssdWHKXjbb+JZ9RS87alm67ilwImg6BZkvbUcKv9lnPBxoQszBr3VwmxtZgXutZPdaG6tTfp+QnIPaQr3E8YVZlYu5C5bpvg75RCAdTuOnnDnqZ47kikDKsh7BnZLLV78h58tiyAAwLmf/C2a2rszf0cjMU94qy63eUIb8rIei1TuRJhbedK3MI9H7l7KOA9Bt7sI3oHgsp7T4w9CrylCFwnCEwp/n4PYS1CpdiSunR2LGVcPoay4AIOB0bS+c2h/Kc6+/hIA4OzrL+HQ/tK0vv+H4Ch2FBWQ3RBrnowTBHV+DkJjD2R//uC+7Ti4rxQ/vdADAPjphR5U7N2eliiExh5AnZ9DTwNBgpBpA1Jmb8TEw2nZn2/4TgU+uOLDp58xuxg//SyED6748NfH/lz2MSYeTkOZvZGeBmLNk3E5hI0b1mP60UzSz8TXOXzzx8+L/o3/72TJxulHM9i4YT09DQQJQqYNiDPOZKLAN+6zr7+Et97twcBQKLbKsHP7Fvxdwzfx0j+elSdCT38d04//RE8DQYKQaQPi3PdUXgLHhff+C0cPa/F/7FbDndu34GilFv/xfr/8MGVTFiYmo/Q0EJRDyLQBpZvgu/bxEK5/cgvWRmZvvbWxBv2+AH77+z/KPka6iUyCIEFYJuazBPjb3/8RZtvPAQBm28/TEgMA2FFUgD8ER+lpIEgQMm1A3Cah5USvKYLHH6SngSBByLQBjY5/iej0DPaUbV2W8+0p24qvoo9X4bZl8SYieqsFva1G6FGJjoRGJEs5FonGMEYzO57UmO022Z9NeRx7JVI3iolDa0RXWvcsdSMXeU1nMoeMfLmp0+3B0cN7JOsmSjGf9xiOHt6DX13yrj4p55qcCPbWV6JBo5h79dlfDru9Eg7BG4ZSxUjC6HQD9RIFX4X1F+OLuLKFUBb4ijNT00GHBiPgWUB16KHIFLi3wi6f96LBYkNvmXeR37QErxT+k/N+Q0YKgscfwF99cz+OV+9f0legv1u9D9lZT8PjX+7/UHlFPaUNkilyOuwW1jLUW8tROBFEE2tMTAekcjRr+3jl3Hn78o1m9B54KCi06nBJzPJlycutedouw9taK8uYxYqyCpCo2DT3MpJcAvD4AvCY7kFvBPQAU9FJSvRY4mtTCkST9yq5+VgRVFJvoZIgLB6zs8C/v3MJZ06/iNt3wrFdiIvJzu1b8MLxQ3jl9DsrUBxlgS/LGCugA2v4sf4Cn2OvRgEgsbT6XLHVuAe6LBeRkesCQxeUYuOEJj8rVgAl6TX1h9FrMMPsSt3rIN0KxnqrRVCyLaWoQKQ8nIEpw1ZlShIyWLLRI6dXA9toxtt+L2Vx19hYEqpckyDI5u4XEfzbOTfeOPU8XrGfW9QyaoXqXLx56vv4yc9+s7Il2efrXRzIgve8Ax5UosPA1FUYstagHsJS5YwR3ZSYVYWFTQTGOiYsq1azVYFIvwzjdV2H90AN1FoAvmShQUvas6qnrR1VMkUl+XUvDkyjmamU4r4cY1m1ghC/5ThVzH/1oyFkbViPM6dfXJSqywCwu1TNVl3+UNbyZLpjXnK0u1CiVEDFzfoTQTRd3wWrJb3GrXprOQpDN2OFTTjjVyf0ekjRsDXB84nr4pSfBUx+LjIryitqwpCkp6OYeIxFga05TIgwj5AtIWSID1USGs1QyLBsXLo6gKnpGTRbjfPuy8DPGbxw/BD+6cx7svsyZBw+fiuzctw/70LpMRsibi8iBl1i1R++68y5rFojrBqF4G/MbCti/MZtKEzSsHX+pNuLIZHECkuscIiGAnm4xUuCMrN6inZwbNWqyGBcUraxiL3f5avWE1i1ggAwuxE/Hw3j7184gp3bt+CDKzfSWoHYs2Mrjh7WIluxAa+cfmcVhgniM3ysdJmvBQ5UosMgJ2RgHmgVz+U2222ojv1dAV1CC7lcJi+RdgzMdai+tyT3QNj8lon/mV6RDxExZKMUYBq4NDLJv0QPow8X/OWwHzBC70q8LtHak1yjmbiu1/NqYU+CsLCcwg//+V3oNcUwHT+EV75fDY8/iMHAKO6MP8DEZBTTj/+EjU9/HcpNWdiSl4Oy4gLoNUWIPppBp9sLj+/Wyvd2XBQq0aC6ibqmeayOaHehBGEMT+RClcasrbdaYE97awjjcdy6HpDtridFriD5HiCCPKi1gL6ihlmePdknkZtgVkes1mJ4+PkIoxn1YrUnuUYzqEy8d+5tspOqJAiLwOws0O8LoN8XQEHeM9BrimD4i93YkpcD5aas2FuLE5NR3Bl/gMHA6BNZK9Fs16FQjblQIORFVRPzTzkhQ52PMUpVGucsVSlSdHqqRIcdOMHzRphl0PhwIzEJF+/JMOIznsT445rHAsA3snnXcw/3J3QoabRAp1Rg2N2exEADeO18EF2WWnQYWe+KXZocdrfIzlsAAFwOdJbZsNcosXxLgrB0jI5/ia7xL9F16XdYW7CJv4TZkpmx5K8yJM7mkjN3yIvOpOGLBXZNFJ0mhyD+trLLoAmz73zCCkEeIDHXoc/PAmLNaQK4PDIFnYZpRy9otiJWKNXnQl27EV0WG7oOTEGlVIg3lpXBfFZQSBCIBbBUBT/vJT2u2a4T9wqcOhSGvKgShBqV6LAwHZmrxirQa+DNvgliUiOy4zIFsUSncKVirjkNs2MT4C+hbsazSqnmNHN5FSgVAML4xLU2ny4ShBWI/+Uvt8XD31gkjMWH3elvv+Zn6SOR5GPeqwYifnYW1+ZABQUKLeXwtrcIly65fhIhridDAE35FtgNFjTf5i8dcvchsZGMKN/IhgpRhHzFaG7kNlQF4InPeXA7EUNeNEXK586L+H6Xwia1EX93rIcEMzZ26TG0sC3P/K5WJAiECAtdbuMMaQre9hZU8Q3MkCKHELeeL77KEGfYfDFiDUZfkQeVSIKP2z047G5BnYufuGtHp92GeosZZtPn2Msb/wmfWKKPydjH77iM+Lvh0O5CF4Jok9qQpAG87Vzs34cqoxm93KpJyAsH77oi/m5UmQLJ/4+MZsn7J0/ww+hsWj3vOixro5aM2+TzRI05xZr6cng9SWfTSnS0bsMn5x1w+EBkIOORu5dWVBDSYTENMVPGQRCZJghP0W0gCIKDBIEgCBIEgiASWdZVhkyJvykPQBDkIRAEQYJAEAQJAkEQJAgEQZAgEARBgkAQBAkCQRAkCARBkCAQBEGCQBAECQJBECQIBEGQIBAEQYJAEAQJAkEQq0IQ3qZbQRBrmrcBYN3s7CzKvv2ym+4HQaxtBt8/Y/j/AQCPRVQDj5voFAAAAABJRU5ErkJggg=="
              />
            </el-col>
            <el-col :span="14" class="tc pay-desc">
              <h2>{{ $t('dialog.packageChoose') }}</h2>
              <h3>{{ quantity + (category === 3 ? $t('system.piece') : $t('table.minute')) }}</h3>
              <h3>{{ $t('dialog.pay') + packagePrice + $t('dialog.moneyUnit') }}</h3>
            </el-col>
          </el-col>
          <el-col :span="24" v-if="paymentResultFlag" class="payment-result">
            <p v-if="paymentResult === '1'">
              <i class="el-icon-success c-success"></i>
              <span class="fw">{{ $t('dialog.paymentSuccessful') }}</span>
            </p>
            <p v-if="paymentResult === '2'">
              <i class="el-icon-warning c-danger"></i>
              <span>
                <div class="fw">{{ $t('dialog.paymentFailed') }}</div>
                <div class="failure-msg">{{ paymentFailureMsg }}</div>
              </span>
            </p>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
    <el-dialog :title="$t('dialog.projectSelection')"  :close-on-click-modal="false" :modal="false" :visible.sync="projectSelectFlag" top="30vh" @close="handleProjectSelect">
      <project-select v-model="projectLists" v-if="projectSelectFlag"></project-select>
    </el-dialog>
    <el-dialog :title="$t('dialog.alarmTypeSelection')" :modal="false" :visible.sync="alarmTypeFlag" top="30vh" @close="handleSaveTypes">
      <checkbox-group v-model="alarmTypeList" ref="typesCheckboxGroup"></checkbox-group>
    </el-dialog>
  </div>
</template>
<script>
import TimePicker from '../Common/TimePicker'
import ProjectSelect from '../Common/ProjectSelect'
import CheckboxGroup from '../Common/CheckboxGroup'
import { SMSPush, payQrCode, payStatus, confirmPayStatus, saveAlarmPushConfigInfo, getPayQuotaConfig, delAlarmPushConfig } from '@/api/api'
export default {
  props: {
    category: {
      type: Number,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      form: {
        phone: ''
      },
      data: [],
      length: 0,
      index: 0,
      remaining: 0,
      quantity: 0,
      options: [
        {
          label: this.$t('system.disable'),
          value: 0
        },
        {
          label: this.$t('system.enable'),
          value: 1
        }
      ],
      timeOptions: [{
        value: '',
        label: '0'
      }, {
        value: '1800',
        label: '30' + this.$t('table.minute')
      }, {
        value: '3600',
        label: '60' + this.$t('table.minute')
      }, {
        value: '10800',
        label: '3' + this.$t('table.hour')
      }, {
        value: '21600',
        label: '6' + this.$t('table.hour')
      }, {
        value: '43200',
        label: '12' + this.$t('table.hour')
      }, {
        value: '86400',
        label: '24' + this.$t('table.hour')
      }],
      periodFlag: false,
      projectLists: [],
      alarmTypeList: [],
      alarmTypeFlag: false,
      projectSelectFlag: false,
      rechargeFlag: false,
      rechargeOption: 1,
      rechargeOptions: [],
      packagePrice: '',
      packageFlag: true,
      paymentResult: '',
      paymentResultFlag: false,
      paymentFailureMsg: '',
      polling: null,
      openFlag: true,
      dataFlag: false,
      count: 1
    }
  },
  mounted () {
    this.queryList()
  },
  methods: {
    queryList () {
      this.dataFlag = false
      let params = {
        pushChannel: this.category,
        pageSize: 10,
        pageNo: this.count
      }
      SMSPush(params)
        .then(res => {
          if (res.success) {
            res.data.configList.forEach(v => {
              if (!v.silenceTimeout) v.silenceTimeout = ''
            })
            this.data = res.data.configList
            this.remaining = res.data.quantity
            this.length = res.data.configList.length
            this.dataFlag = true
          } else if (res.code === '-1') {
          } else {
            if (res.message) {
              this.$message({
                message: res.message,
                type: 'error'
              })
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
    },
    handlePage (e) {
      if (e === 'home') {
        this.count = 1
      } else if (e === 'prev') {
        this.count--
      } else if (e === 'next') {
        this.count++
      }
      this.queryList()
      this.$refs.table.doLayout()
    },
    addNotification () {
      if (this.data.length === this.length + 1) return false
      if (this.category === 1) this.data.unshift({alarmList: [], cid: 0, appChnl: [], phoneNumber: '', prjList: [], silenceTimeout: '', pushEnable: 1, timeRanges: []})
      if (this.category === 2) this.data.unshift({alarmList: [], cid: 0, url: '', salt: '', phoneNumber: '', prjList: [], silenceTimeout: '', pushEnable: 1, timeRanges: []})
      if (this.category === 3) this.data.unshift({alarmList: [], cid: 0, generalSignName: false, phoneNumber: '', prjList: [], silenceTimeout: '', pushEnable: 1, timeRanges: []})
      if (this.category === 6) this.data.unshift({alarmList: [], cid: 0, phoneNumber: '', prjList: [], silenceTimeout: '', pushEnable: 1, timeRanges: []})
    },
    handleAddPhone (phone, index) {
      if (!this.$func.checkPhone(phone) && phone.length < 1 && phone !== undefined) {
        this.$message({
          message: this.$t('message.numberFormatError'),
          type: 'error'
        })
        return false
      }
      if (this.data[index].phoneNumber.split(',').indexOf(phone) > -1) {
        this.$message({
          message: this.$t('message.numberExists'),
          type: 'error'
        })
        return false
      }
      this.form.phone = ''
      this.$refs[`phone-popover-` + index].doClose()
      this.data[index].phoneNumber = this.data[index].phoneNumber !== '' ? this.data[index].phoneNumber.concat(',' + phone) : phone
    },
    handleClosePushPhone (tag, index) {
      let phone = this.data[index].phoneNumber.split(',')
      phone.splice(phone.indexOf(tag), 1)
      this.data[index].phoneNumber = phone.join(',')
    },
    handleAddTime (index) {
      this.periodFlag = true
      this.$nextTick(() => {
        this.$refs['time-picker-' + index].period()
      })
    },
    handleTimeClose (tag, time) {
      let index = time.indexOf(tag)
      time.splice(index, 1)
    },
    handlePeriodFlag (index) {
      this.$refs['time-popover-' + index].doClose()
      this.periodFlag = false
    },
    handleSave (row) {
      if (this.category === 3 || this.category === 6) {
        if (row.alarmList.length < 1 || row.phoneNumber.length < 1 || row.prjList.length < 1 || row.timeRanges.length < 1) {
          this.$message({
            message: this.$t('message.atLeastOneItem'),
            type: 'error'
          })
          return false
        }
      } else if (this.category === 1) {
        if (row.alarmList.length < 1 || row.appChnl.length < 1 || row.prjList.length < 1 || row.timeRanges.length < 1) {
          this.$message({
            message: this.$t('message.atLeastOneItem'),
            type: 'error'
          })
          return false
        }
      } else if (this.category === 2) {
        if (row.alarmList.length < 1 || row.url === '' || row.salt === '' || row.prjList.length < 1 || row.timeRanges.length < 1) {
          this.$message({
            message: this.$t('message.atLeastOneItem'),
            type: 'error'
          })
          return false
        }
      }
      let types = row.alarmList.map((item) => {
        return item.typeNumber
      })
      let projects = row.prjList.map((item) => {
        return item.code
      })
      let params = {
        id: row.cid,
        pushChannel: this.category,
        typeNumbers: types.join(','),
        timeRanges: row.timeRanges.join(','),
        prjCodes: projects.join(','),
        pushEnable: row.pushEnable
      }
      if (this.category === 3) {
        params.channelParams = row.phoneNumber + (row.generalSignName ? '^' + row.generalSignName : '^false') + (row.silenceTimeout ? '^' + row.silenceTimeout : '')
      } else if (this.category === 6) {
        params.channelParams = row.phoneNumber + (row.silenceTimeout ? ('^' + row.silenceTimeout) : '')
      } else if (this.category === 1) {
        params.channelParams = row.appChnl.join(',') + (row.silenceTimeout ? ('^' + row.silenceTimeout) : '')
      } else if (this.category === 2) {
        params.channelParams = row.url + ',' + row.salt + (row.silenceTimeout ? ('^' + row.silenceTimeout) : '')
      }
      this.savePushConfig(params, this.category)
    },
    savePushConfig (params, type) {
      saveAlarmPushConfigInfo(params)
        .then(res => {
          if (res.success) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.periodFlag = false
            this.queryList()
          } else if (res.code === '-1') {
          } else {
            if (res.message) {
              this.$message({
                message: res.message,
                type: 'error'
              })
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
    },
    handleDel (row, index) {
      if (row.cid === 0) {
        this.data.splice(index, 1)
      } else {
        this.$confirm(this.$t('message.confirmDeleteConfig'), this.$t('dialog.prompt'), {
          confirmButtonText: this.$t('btns.ok'),
          cancelButtonText: this.$t('btns.cancel'),
          type: 'warning'
        }).then(() => {
          delAlarmPushConfig({cid: row.cid})
            .then(res => {
              if (res.success) {
                this.$message({
                  message: res.message,
                  type: 'success'
                })
                this.queryList()
              } else if (res.code === '-1') {
              } else {
                if (res.message) {
                  this.$message({
                    message: res.message,
                    type: 'error'
                  })
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
            message: this.$t('message.undelete')
          })
        })
      }
    },
    handleAddProject (row, index) {
      this.projectLists = row
      this.projectSelectFlag = true
    },
    handleProjectClose (row, tag) {
      row.forEach((item, index) => {
        if (item.code === tag.code) {
          row.splice(index, 1)
        }
      })
    },
    handleAddAlarm (row, index, origin) {
      this.index = index
      this.alarmTypeList = row.map((item) => {
        return item.typeNumber
      })
      this.alarmTypeFlag = true
      if (origin) {
        this.$nextTick(() => {
          this.$refs.typesCheckboxGroup.changeList(origin)
        })
      }
    },
    handleSaveTypes () {
      let cfg = this.$store.state.alarmForConfig
      this.data[this.index].alarmList = []
      cfg.forEach((value) => {
        this.alarmTypeList.forEach((item) => {
          if (value.typeNumber === item) {
            this.data[this.index].alarmList.push({typeNumber: value.typeNumber, alarmInfo: value.info})
          }
        })
      })
      this.alarmTypeFlag = false
    },
    handleTypesClose (row, tag) {
      let index = row.indexOf(tag)
      if (index > -1) row.splice(index, 1)
    },
    handleCloseRecharge () {
      this.rechargeFlag = false
      clearInterval(this.polling)
    },
    instantRecharge () {
      this.rechargeFlag = true
      this.packageFlag = true
      this.rechargeOption = 1
      getPayQuotaConfig({chargeType: this.category === 3 ? 1 : 2})
        .then(res => {
          if (res.success) {
            this.rechargeOptions = res.data
          } else if (res.code === '-1') {
          } else {
            if (res.message) {
              this.$message({
                message: res.message,
                type: 'error'
              })
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
    },
    payImmediately () {
      let recharge = this.rechargeOptions[this.rechargeOption - 1].split(':')
      this.quantity = recharge[2]
      this.packagePrice = recharge[1]
      let params = {
        quotaId: this.rechargeOption,
        chargeType: this.category === 3 ? 1 : 2
      }
      payQrCode(params)
        .then(res => {
          if (res.success) {
            this.packageFlag = false
            this.paymentResultFlag = false
            this.qrCode = 'data:image/gif;base64,' + res.data.qrCode
            this.polling = setInterval(() => {
              this.queryPaymentResult(res.data.tradeNo)
            }, 2000)
          } else if (res.code === '-1') {
          } else {
            if (res.message) {
              this.$message({
                message: res.message,
                type: 'error'
              })
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
    },
    queryPaymentResult (tradeNo) {
      payStatus({tradeNo: tradeNo})
        .then(res => {
          if (res.success) {
            let code = res.data.statu
            if (code !== '0') {
              clearInterval(this.polling)
              if (code === '1') {
                this.paymentResultFlag = true
                this.paymentResult = code
                this.queryList()
              } else if (code === '2') {
                this.confirmPaymentResult(tradeNo)
              }
            }
          } else if (res.code === '-1') {
          } else {
            if (res.message) {
              this.$message({
                message: res.message,
                type: 'error'
              })
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
    },
    confirmPaymentResult (tradeNo) {
      confirmPayStatus({tradeNo: tradeNo})
        .then(res => {
          if (res.success) {
            let code = res.data.statu
            if (code === '1' || code === '2') {
              this.paymentResultFlag = true
              this.paymentResult = code
            }
            if (code === '2') {
              this.paymentFailureMsg = res.data.desc
            }
          } else if (res.code === '-1') {
          } else {
            if (res.message) {
              this.$message({
                message: res.message,
                type: 'error'
              })
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
    }
  },
  destroyed () {
    clearInterval(this.polling)
  },
  components: {
    TimePicker,
    ProjectSelect,
    CheckboxGroup
  }
}
</script>
<style lang="stylus" scoped>
.el-button--small
  font-size 14px
.el-pagination
  padding 0 5px
  margin-top 0
  display inline-block
  vertical-align middle
  .el-pagination__sizes, >>> span:not([class*=suffix]), >>> .el-input__inner
    margin-right 0
    height 34px
.block
  .el-pagination
    height 34px
    line-height 34px
  .el-date-editor.el-input__inner
    width 250px
.el-tag
  margin 0 2px 5px
  color #fff
  background transparent
.tag-add
  margin-right 5px
.el-date-editor.el-input__inner
  width 100%
.period-time-picker.el-time-panel__footer
  display block
.tips-wrap
  height 40px
  line-height 40px
#recharge-form
  .dialog-footer
    text-align center
.recharge-tip
  padding 20px 0
  display inline-block
  font-size 14px
#rechargeOption
  label
    margin-left 0
    width 33.33%
    padding 10px 0
    box-sizing border-box
.pay-code img
  display inline-block
  width 100%
.pay-code
  overflow hidden
  .qr-code
    width 100%
.pay-desc
  margin-top 60px
  h2, h3
    color #303133
.payment-result
  text-align center
  p
    font-size 64px
    i
      vertical-align middle
    span
      display inline-block
      font-size 22px
      vertical-align middle
      text-align center
.failure-msg
  max-width 200px
  margin-top 5px
  font-size 16px
/deep/ .el-table__header
         width 100% !important
         table-layout fixed
/deep/ .el-table__body
         width 100% !important
</style>
