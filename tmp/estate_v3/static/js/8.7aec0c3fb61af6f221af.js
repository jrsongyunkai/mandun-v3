webpackJsonp([8],{UY1T:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=a("IcnI"),n=a("SPzd"),i=a("P9l9"),s={data:function(){return{loading:!1,quantityType:"",quantityForm:{mac:"",jobNumber:"",type:"",oqp1:this.$route.params.status,month:"2"===this.$route.params.type?[this.$func.formatDate("yyyy-MM-dd",new Date((new Date).getFullYear(),(new Date).getMonth(),1)),this.$func.getNowFormatDate()]:[(this.$route.params.oqp2,this.$func.formatDate("yyyy-MM-dd",new Date((new Date).getFullYear(),(new Date).getMonth(),1))),this.$func.getNowFormatDate()],lastId:""},exportId:0,page:[],prevId:"",quantityData:[],alarmData:[],quantityPageSize:20,alarmInfo:[],status:[{value:"",label:this.$t("placeholder.all")},{value:"0",label:this.$t("home.unprocessed")},{value:"2",label:this.$t("home.processed")}],alarmTypes:[],ids:[],alarmHistory:{},maintenanceBoxObj:{},dialogVisible:!1,jobFlag:!1}},mounted:function(){this.init(),this.queryConfig()},methods:{init:function(){this.quantityForm.jobNumber="",this.quantityForm.type=this.$route.params.typeNumber.split(","),this.queryAlarm(),this.queryAlarmHistoryStatisticalNumber()},queryConfig:function(){var e=this;Object(i._100)({}).then(function(t){e.alarmTypes=t.data.alarms.concat(t.data.warns),e.alarmTypes.unshift({typeNumber:"-100",info:e.$t("menu.allAlarms")},{typeNumber:"-200",info:e.$t("placeholder.all")+e.$t("home.warning")})}).catch(function(t){t&&e.$message({message:e.$t("message.unknown"),type:"error"})})},queryAlarm:function(e){var t=this;this.quantityData=[],this.quantityType=e;var a={};if(a=(this.jobFlag,{provinceId:this.$store.state.provinceId,cityId:this.$store.state.cityId,countryId:this.$store.state.countyId,lastId:this.quantityForm.lastId,rows:this.quantityPageSize,projectCode:this.$route.params.projectCode,typeNumbers:this.quantityForm.type?this.quantityForm.type.join(","):"",mac:this.quantityForm.mac?this.quantityForm.mac:"",jobNumber:this.quantityForm.jobNumber?this.quantityForm.jobNumber:"",oqp1:this.quantityForm.oqp1,startTime:this.quantityForm.month[0],endTime:this.quantityForm.month[1]}),"false"===this.$func.checkDateThreeMonths(a.startTime,a.endTime))return this.$message({message:this.$t("message.limitThreeMonths"),type:"error"}),!1;Object(i._101)(a).then(function(e){e.success?(t.quantityData=e.data,e.data.length>0?(t.quantityForm.lastId=e.lastId,t.prevId=e.data[0].id+1,t.exportId=e.data[0].id):(t.quantityForm.lastId=e.lastId,t.exportId=0)):"-1"===e.code||t.$message({message:e.message,type:"error"})}).catch(function(e){e&&t.$message({message:t.$t("message.unknown"),type:"error"})}).finally(function(){t.loading=!1})},handleChange:function(e){this.alarmTypes.forEach(function(t){e.indexOf("-100")>-1?"1"!==t.typeNumber&&"2"!==t.typeNumber&&"3"!==t.typeNumber&&"4"!==t.typeNumber&&"5"!==t.typeNumber&&"6"!==t.typeNumber&&"7"!==t.typeNumber&&"8"!==t.typeNumber&&"11"!==t.typeNumber&&"17"!==t.typeNumber&&"18"!==t.typeNumber&&"19"!==t.typeNumber&&"53"!==t.typeNumber&&"54"!==t.typeNumber&&"56"!==t.typeNumber&&"57"!==t.typeNumber&&"62"!==t.typeNumber&&"63"!==t.typeNumber&&"1001"!==t.typeNumber&&"1002"!==t.typeNumber&&"1005"!==t.typeNumber&&"2002"!==t.typeNumber&&"2003"!==t.typeNumber&&"2004"!==t.typeNumber&&"2006"!==t.typeNumber&&"9000"!==t.typeNumber&&"9001"!==t.typeNumber||(t.disabled=!0):"1"!==t.typeNumber&&"2"!==t.typeNumber&&"3"!==t.typeNumber&&"4"!==t.typeNumber&&"5"!==t.typeNumber&&"6"!==t.typeNumber&&"7"!==t.typeNumber&&"8"!==t.typeNumber&&"11"!==t.typeNumber&&"17"!==t.typeNumber&&"18"!==t.typeNumber&&"19"!==t.typeNumber&&"53"!==t.typeNumber&&"54"!==t.typeNumber&&"56"!==t.typeNumber&&"57"!==t.typeNumber&&"62"!==t.typeNumber&&"63"!==t.typeNumber&&"1001"!==t.typeNumber&&"1002"!==t.typeNumber&&"1005"!==t.typeNumber&&"2002"!==t.typeNumber&&"2003"!==t.typeNumber&&"2004"!==t.typeNumber&&"2006"!==t.typeNumber&&"9000"!==t.typeNumber&&"9001"!==t.typeNumber||(t.disabled=!1),e.indexOf("-200")>-1?"9"!==t.typeNumber&&"10"!==t.typeNumber&&"12"!==t.typeNumber&&"13"!==t.typeNumber&&"14"!==t.typeNumber&&"15"!==t.typeNumber&&"16"!==t.typeNumber&&"55"!==t.typeNumber&&"58"!==t.typeNumber&&"1003"!==t.typeNumber&&"1004"!==t.typeNumber&&"1006"!==t.typeNumber||(t.disabled=!0):"9"!==t.typeNumber&&"10"!==t.typeNumber&&"12"!==t.typeNumber&&"13"!==t.typeNumber&&"14"!==t.typeNumber&&"15"!==t.typeNumber&&"16"!==t.typeNumber&&"55"!==t.typeNumber&&"58"!==t.typeNumber&&"1003"!==t.typeNumber&&"1004"!==t.typeNumber&&"1006"!==t.typeNumber||(t.disabled=!1)});e.indexOf("-100")>-1&&["1","2","3","4","5","6","7","8","11","17","18","19","53","54","56","57","62","63","1001","1002","1005","2002","2003","2004","2006","9000","9001"].forEach(function(t){e.forEach(function(a,r){a===t&&e.splice(r,1)})});e.indexOf("-200")>-1&&["9","10","12","13","14","15","16","55","58","1003","1004","1006"].forEach(function(t){e.forEach(function(a,r){a===t&&e.splice(r,1)})})},handleFocus:function(){var e=this;this.alarmTypes.forEach(function(t){e.quantityForm.type.indexOf("-100")>-1?"1"!==t.typeNumber&&"2"!==t.typeNumber&&"3"!==t.typeNumber&&"4"!==t.typeNumber&&"5"!==t.typeNumber&&"6"!==t.typeNumber&&"7"!==t.typeNumber&&"8"!==t.typeNumber&&"11"!==t.typeNumber&&"17"!==t.typeNumber&&"18"!==t.typeNumber&&"19"!==t.typeNumber&&"53"!==t.typeNumber&&"54"!==t.typeNumber&&"56"!==t.typeNumber&&"57"!==t.typeNumber&&"62"!==t.typeNumber&&"63"!==t.typeNumber&&"1001"!==t.typeNumber&&"1002"!==t.typeNumber&&"1005"!==t.typeNumber&&"2002"!==t.typeNumber&&"2003"!==t.typeNumber&&"2004"!==t.typeNumber&&"2006"!==t.typeNumber&&"9000"!==t.typeNumber&&"9001"!==t.typeNumber||(t.disabled=!0):"1"!==t.typeNumber&&"2"!==t.typeNumber&&"3"!==t.typeNumber&&"4"!==t.typeNumber&&"5"!==t.typeNumber&&"6"!==t.typeNumber&&"7"!==t.typeNumber&&"8"!==t.typeNumber&&"11"!==t.typeNumber&&"17"!==t.typeNumber&&"18"!==t.typeNumber&&"19"!==t.typeNumber&&"53"!==t.typeNumber&&"54"!==t.typeNumber&&"56"!==t.typeNumber&&"57"!==t.typeNumber&&"62"!==t.typeNumber&&"63"!==t.typeNumber&&"1001"!==t.typeNumber&&"1002"!==t.typeNumber&&"1005"!==t.typeNumber&&"2002"!==t.typeNumber&&"2003"!==t.typeNumber&&"2004"!==t.typeNumber&&"2006"!==t.typeNumber&&"9000"!==t.typeNumber&&"9001"!==t.typeNumber||(t.disabled=!1),e.quantityForm.type.indexOf("-200")>-1?"9"!==t.typeNumber&&"10"!==t.typeNumber&&"12"!==t.typeNumber&&"13"!==t.typeNumber&&"14"!==t.typeNumber&&"15"!==t.typeNumber&&"16"!==t.typeNumber&&"55"!==t.typeNumber&&"58"!==t.typeNumber&&"1003"!==t.typeNumber&&"1004"!==t.typeNumber&&"1006"!==t.typeNumber||(t.disabled=!0):"9"!==t.typeNumber&&"10"!==t.typeNumber&&"12"!==t.typeNumber&&"13"!==t.typeNumber&&"14"!==t.typeNumber&&"15"!==t.typeNumber&&"16"!==t.typeNumber&&"55"!==t.typeNumber&&"58"!==t.typeNumber&&"1003"!==t.typeNumber&&"1004"!==t.typeNumber&&"1006"!==t.typeNumber||(t.disabled=!1)})},queryAlarmHistoryStatisticalNumber:function(){var e=this,t=this.alarmHistory;Object(i.k)(t).then(function(t){t.data&&(e.alarmData=t.data)}).catch(function(t){t&&e.$message({message:e.$t("message.unknown"),type:"error"})})},queryQuantity:function(){this.page=[],this.quantityForm.lastId="",this.queryAlarm(this.quantityType)},handleValue:function(e){var t="",a="";1===e.elecType?t=this.$t("main.watt"):2===e.elecType?t=this.$t("main.ampere"):3===e.elecType?t=this.$t("menu.leakageCurrent"):4===e.elecType?t=this.$t("menu.temperature"):5===e.elecType?t=this.$t("main.volt"):8===e.elecType?t=this.$t("main.lightningCurrent"):9===e.elecType?(a=this.$t("control.signal"),t=this.$t("main.volt")):10===e.elecType?t=this.$t("menu.humidity"):11===e.elecType?t=this.$t("stralsund.concentration"):12===e.elecType?t=this.$t("echarts.illumination")+this.$t("echarts.celsius"):14===e.elecType&&(t=this.$t("table.waterVolume")),9===e.elecType?this.alarmInfo=[t+"("+e.unit1+"): "+e.value1+", "+a+"("+e.unit2+"): "+e.value2]:8===e.elecType?this.alarmInfo=[t+"("+e.unit+"): "+e.value+" "+(8===e.elecType?"":"("+this.$t("table.threshold")+":"+e.threshold+")"),void 0!==e.groundWire?this.$t("main.groundState")+": "+(0===e.groundWire?this.$t("control.normal"):this.$t("control.abnormal")):"",void 0!==e.spd?"SPD: "+(0===e.spd?this.$t("control.normal"):this.$t("control.abnormal")):"",e.occurTime?this.$t("main.surgeTime")+": "+(e.occurTime?e.occurTime:""):""]:10===e.elecType?this.alarmInfo=t+": "+e.value+e.unit+"RH ("+this.$t("table.threshold")+":"+e.threshold+")":11===e.elecType?this.alarmInfo=t+": "+e.value+e.unit+" ("+this.$t("table.threshold")+":"+e.threshold+")":12===e.elecType?this.alarmInfo=t+": "+e.value+"Lux ("+this.$t("table.threshold")+":"+e.threshold+")":14===e.elecType?this.alarmInfo=t+": "+(e.value1+e.unit1):this.alarmInfo=t+": "+e.value+e.unit+" ("+this.$t("table.threshold")+":"+e.threshold+")"},handleChangeDate:function(){this.page=[],this.quantityForm.lastId=""},handlePage:function(e){"home"===e?(this.quantityForm.lastId="",this.page=[]):"prev"===e?this.quantityForm.lastId=this.page.pop():"next"===e&&this.page.push(this.prevId),r.a.commit("quantityPage",this.page),this.queryAlarm()},handleSizeChange:function(e){this.page=[],this.quantityForm.lastId="",this.quantityPageSize=e,r.a.commit("quantityPageSize",e),this.queryAlarm()},queryMaintenance:function(e){var t=this,a={mac:e.mac,alarmId:e.id,id:""};Object(i._20)(a).then(function(a){a.success?(0===t.page.length?t.quantityForm.lastId="":t.quantityForm.lastId=t.prevId,r.a.commit("maintenanceObj",a.data),r.a.commit("alarmId",e.id),t.maintenanceBoxObj=e,t.dialogVisible=!0):"-1"===a.code||t.$message({message:a.message,type:"error"})}).catch(function(e){t.$message({message:t.$("message.unknown"),type:"error"})})},handleCommand:function(e){if("false"===this.$func.checkDateThreeMonths(this.quantityForm.month[0],this.quantityForm.month[1]))return this.$message({message:this.$t("message.limitThreeMonths"),type:"error"}),!1;this.$func.windowCountDown(ctxPaths+"/project/main/v3/xls/exportAlarmListOfPage.as?projectCode="+(this.$route.params.projectCode?this.$route.params.projectCode:"")+"&provinceId="+(this.$store.state.provinceId?this.$store.state.provinceId:"")+"&cityId="+(this.$store.state.cityId?this.$store.state.cityId:"")+"&countyId="+(this.$store.state.countyId?this.$store.state.countyId:"")+"&mac="+this.quantityForm.mac+"&typeNumbers="+(this.quantityForm.type?this.quantityForm.type.join(","):0)+"&lastId="+this.exportId+"&rows="+this.quantityPageSize+"&oqp1="+(this.quantityForm.oqp1?this.quantityForm.oqp1:"")+"&startTime="+String(this.quantityForm.month[0])+"&endTime="+String(this.quantityForm.month[1])+"&exportType="+("current"===e?"exportCurrent":""))},handleSwitch:function(e,t){var a=this,n={projectCode:e.projectCode};Object(i._196)(n).then(function(n){n.success?(r.a.commit("projectCode",e.projectCode),r.a.commit("fullName",e.projectName),r.a.commit("distributionDateType",1),"project"!==t?(r.a.commit("equipmentType",e.equipmentType),r.a.commit("overviewMac",e.mac)):(r.a.commit("equipmentType",1),r.a.commit("overviewMac","")),a.$router.push({path:"/InnerMain/Overview"})):"-1"===n.code||a.$message({message:n.message,type:"error"})}).catch(function(e){e&&a.$message({message:a.$t("message.unknown"),type:"error"})})},handleSelectionChange:function(e){var t=this;this.ids=[],e.forEach(function(e){t.ids.push(e.id)})},handleBatchEdit:function(e){var t=this;Object(i.j)({id:e.join(","),isSolve:1}).then(function(e){e.success?(t.quantityForm.lastId="",t.$message({message:e.message,type:"success"}),t.queryAlarm()):"-1"===e.code||t.$message({message:e.message,type:"error"})}).catch(function(e){e&&t.$message({message:t.$t("message.unknown"),type:"error"})})},closeMaintenance:function(){r.a.dispatch("resetMaintenanceObj"),this.dialogVisible=!1,this.init()},handleUrge:function(e){var t=this;Object(i.m)({id:e}).then(function(e){t.$message({message:e.message,type:"0"===e.code?"success":"error"})}).catch(function(e){e&&t.$message({message:t.$t("message.unknown"),type:"error"})})}},watch:{"$store.state.location":{handler:function(e,t){e&&this.queryAlarm()},deep:!0},$route:{handler:function(e,t){if("/Alarm"===e.path){if("/Home"===t.path?(this.quantityForm.jobNumber="",this.alarmHistory={}):"/InnerMain/Overview"===t.path&&(this.alarmHistory={projectCode:this.$route.params.projectCode}),"/MaintenanceBox"===t.path)return!1;this.quantityForm.lastId="",this.quantityForm.oqp1=this.$route.params.status,this.quantityForm.jobNumber="",this.quantityForm.mac=this.$route.params.mac?this.$route.params.mac:"","2"===this.$route.params.type?this.quantityForm.month=[this.$func.formatDate("yyyy-MM-dd",new Date((new Date).getFullYear(),(new Date).getMonth(),1)),this.$func.getNowFormatDate()]:2===this.$route.params.oqp2?this.quantityForm.month=[2===this.$route.params.oqp2?this.$func.formatDate("yyyy-MM-dd",new Date((new Date).getFullYear(),(new Date).getMonth(),1)):this.$func.getNowFormatDate(),this.$func.getNowFormatDate()]:this.quantityForm.month=[this.$func.getNowFormatDate(),this.$func.getNowFormatDate()],this.queryAlarm(),this.queryAlarmHistoryStatisticalNumber()}}},"$route.params.typeNumber":{handler:function(e,t){e&&(this.quantityForm.type=e.split(","),this.queryAlarm())},deep:!0},"quantityForm.jobNumber":{handler:function(e,t){e.length>0?this.jobFlag=!0:this.jobFlag=!1},deep:!0}},components:{MaintenanceBox:n.a}},o={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"alarms"}},[a("el-row",{staticStyle:{margin:"0",padding:"20px"},attrs:{gutter:20}},[a("el-col",[a("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[a("el-breadcrumb-item",{staticClass:"pointer",nativeOn:{click:function(t){return e.$router.go(-1)}}},[e._v(e._s(e.$t("btns.back")))]),e._v(" "),a("el-breadcrumb-item",[e._v(e._s(e.$t("home.alarm")+"/"+e.$t("home.warning")+e.$t("table.list")))])],1),e._v(" "),a("el-row",[a("el-col",{attrs:{span:24}},[a("el-form",{staticClass:"demo-form-inline tr mt-20",attrs:{inline:!0,size:"small",model:e.quantityForm},nativeOn:{submit:function(e){e.preventDefault()}}},[a("el-form-item",{staticClass:"fl"},[e.alarmData.currentMonthAlarmNum?a("span",{staticClass:"ml-20 fs-18"},[e._v(e._s(e.$t("table.thisMonth")+e.$t("statistics.numberOfAlarms")+"："+e.alarmData.currentMonthAlarmNum))]):e._e(),e._v(" "),e.alarmData.lastMonthAlarmNum?a("span",{staticClass:"ml-20 fs-18"},[e._v(e._s(e.$t("table.lastmonth")+e.$t("statistics.numberOfAlarms")+"："+e.alarmData.lastMonthAlarmNum))]):e._e(),e._v(" "),e.alarmData.totalAlarmNum?a("span",{staticClass:"ml-20 fs-18"},[e._v(e._s(e.$t("statistics.cumulative")+e.$t("statistics.numberOfAlarms")+"："+e.alarmData.totalAlarmNum))]):e._e()]),e._v(" "),a("el-form-item",["/Home"!==e.$store.state.toPath&&""!==e.$store.state.toPath?a("span",{staticClass:"mr-20 fw"}):e._e(),e._v(" "),a("span",{staticClass:"block"},[a("el-date-picker",{attrs:{disabled:e.jobFlag,"value-format":"yyyy-MM-dd",type:"daterange",editable:!1,clearable:!1,"range-separator":e.$t("table.to"),"start-placeholder":e.$t("table.startDate"),"end-placeholder":e.$t("table.endDate")},on:{change:e.handleChangeDate},model:{value:e.quantityForm.month,callback:function(t){e.$set(e.quantityForm,"month",t)},expression:"quantityForm.month"}})],1)]),e._v(" "),a("el-form-item",[a("el-input",{attrs:{disabled:e.jobFlag,onkeyup:e.quantityForm.mac=e.quantityForm.mac.replace(/[, ]/g,""),placeholder:e.$t("placeholder.enterDeviceNo")},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.queryQuantity(t)}},model:{value:e.quantityForm.mac,callback:function(t){e.$set(e.quantityForm,"mac",t)},expression:"quantityForm.mac"}})],1),e._v(" "),a("el-form-item",[a("el-input",{attrs:{onkeyup:e.quantityForm.jobNumber=e.quantityForm.jobNumber.replace(/[^\d]/g,""),placeholder:e.$t("placeholder.enterJobNumber")},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.queryQuantity(t)}},model:{value:e.quantityForm.jobNumber,callback:function(t){e.$set(e.quantityForm,"jobNumber",t)},expression:"quantityForm.jobNumber"}})],1),e._v(" "),a("el-form-item",[a("el-select",{style:e.quantityForm.type.length>1?"width: 390px":"",attrs:{disabled:e.jobFlag,multiple:"","multiple-limit":"3",placeholder:e.$t("table.alarmTypes")},on:{change:e.handleChange,"visible-change":e.handleFocus},model:{value:e.quantityForm.type,callback:function(t){e.$set(e.quantityForm,"type",t)},expression:"quantityForm.type"}},e._l(e.alarmTypes,function(e){return a("el-option",{key:e.typeNumber,attrs:{label:e.info,value:e.typeNumber,disabled:e.disabled}})}),1)],1),e._v(" "),a("el-form-item",[a("el-select",{staticClass:"w-100",attrs:{disabled:e.jobFlag,placeholder:e.$t("table.status")},model:{value:e.quantityForm.oqp1,callback:function(t){e.$set(e.quantityForm,"oqp1",t)},expression:"quantityForm.oqp1"}},e._l(e.status,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:e.queryQuantity}},[e._v(e._s(e.$t("btns.query")))])],1),e._v(" "),a("el-form-item",[a("el-dropdown",{attrs:{trigger:"click"},on:{command:e.handleCommand}},[a("el-button",[e._v("\n                  "+e._s(e.$t("home.export"))),a("i",{staticClass:"el-icon-arrow-down el-icon--right"})]),e._v(" "),a("el-dropdown-menu",{attrs:{slot:"dropdown"},slot:"dropdown"},[a("el-dropdown-item",{attrs:{command:"current"}},[e._v(e._s(e.$t("btns.exportCurrent")))]),e._v(" "),a("el-dropdown-item",{attrs:{command:"all"}},[e._v(e._s(e.$t("btns.exportAll")))])],1)],1)],1)],1)],1)],1),e._v(" "),a("div",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],attrs:{"element-loading-spinner":"el-icon-loading","element-loading-background":"rgba(0, 0, 0, 0)","element-loading-text":e.$t("message.loading")}},[a("el-table",{attrs:{data:e.quantityData},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",align:"center",width:"55"}}),e._v(" "),a("el-table-column",{attrs:{property:"id",label:e.$t("table.jobNumber"),align:"center",width:"150"}}),e._v(" "),a("el-table-column",{attrs:{label:e.$t("dialog.deviceNo"),align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{staticClass:"pointer",on:{click:function(a){return e.handleSwitch(t.row)}}},[e._v(e._s(t.row.mac))]),e._v(" "),a("div",[e._v(e._s(t.row.name))])]}}])}),e._v(" "),a("el-table-column",{attrs:{property:"projectName",label:e.$t("table.project"),align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("span",{staticClass:"pointer",on:{click:function(a){return e.handleSwitch(t.row,"project")}}},[e._v(e._s(t.row.projectName))])]}}])}),e._v(" "),a("el-table-column",{attrs:{property:"address",label:e.$t("table.position"),align:"center"}}),e._v(" "),a("el-table-column",{attrs:{property:"channel",label:e.$t("table.line"),align:"center",width:"60"}}),e._v(" "),a("el-table-column",{attrs:{property:"info",label:e.$t("home.alarm")+"/"+e.$t("home.warning")+e.$t("table.type"),align:"center",width:"180"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-tooltip",{attrs:{effect:"dark",content:t.row.info,placement:"right"}},[a("span",[e._v(e._s(t.row.info))])])]}}])}),e._v(" "),a("el-table-column",{attrs:{property:"time",label:e.$t("dialog.time"),align:"center",width:"160"}}),e._v(" "),a("el-table-column",{attrs:{label:e.$t("home.value"),align:"center",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-popover",{attrs:{placement:"top",width:"250",trigger:"click"}},[e._t("default",[a("div",[e._v("\n                    "+e._s(e.alarmInfo)+"\n                  ")])]),e._v(" "),a("i",{directives:[{name:"show",rawName:"v-show",value:""!==t.row.valueDescribe&&"{}"!==JSON.stringify(t.row.valueDescribe),expression:"scope.row.valueDescribe !== '' && JSON.stringify(scope.row.valueDescribe) !== '{}'"}],staticClass:"el-icon-news",attrs:{slot:"reference"},on:{click:function(a){return e.handleValue(t.row.valueDescribe)}},slot:"reference"})],2)]}}],null,!0)}),e._v(" "),a("el-table-column",{attrs:{label:e.$t("table.status"),align:"center",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[0===t.row.processStatus?a("el-button",{attrs:{type:"text"},on:{click:function(a){return e.handleUrge(t.row.id)}}},[e._v(e._s(e.$t("table.urge")))]):e._e(),e._v(" "),a("span",{staticClass:"pointer",class:0===t.row.processStatus?"c-danger":"c-success",on:{click:function(a){return e.queryMaintenance(t.row)}}},[e._v(e._s(0===t.row.processStatus?e.$t("home.unprocessed"):e.$t("home.processed")))])]}}])})],1),e._v(" "),a("div",{staticClass:"block tc mt-10"},[a("el-button",{attrs:{size:"small",disabled:0===e.ids.length},on:{click:function(t){return e.handleBatchEdit(e.ids)}}},[e._v(e._s(e.$t("table.batchEditStatusProcessed")))]),e._v(" "),a("el-pagination",{attrs:{"page-sizes":[20,50,100,500],"page-size":e.quantityPageSize,layout:"sizes"},on:{"size-change":e.handleSizeChange}}),e._v(" "),a("el-button-group",[a("el-button",{attrs:{size:"small"},on:{click:function(t){return e.handlePage("home")}}},[e._v(e._s(e.$t("system.home")))]),e._v(" "),a("el-button",{attrs:{size:"small",icon:"el-icon-arrow-left",disabled:e.page.length<1},on:{click:function(t){return e.handlePage("prev")}}},[e._v(e._s(e.$t("btns.prev")))]),e._v(" "),a("el-button",{attrs:{size:"small",disabled:e.quantityData.length<e.quantityPageSize},on:{click:function(t){return e.handlePage("next")}}},[e._v(e._s(e.$t("btns.next"))),a("i",{staticClass:"el-icon-arrow-right el-icon--right"})])],1)],1)],1)],1)],1),e._v(" "),a("el-dialog",{attrs:{title:e.$t("control.maintenance")+e.$t("control.edit"),"close-on-click-modal":!1,visible:e.dialogVisible,"append-to-body":"",modal:!1},on:{"update:visible":function(t){e.dialogVisible=t},close:e.closeMaintenance}},[e.dialogVisible?a("MaintenanceBox",{attrs:{maintenanceBoxObj:e.maintenanceBoxObj},on:{"close-maintenance":e.closeMaintenance}}):e._e()],1)],1)},staticRenderFns:[]};var u=a("VU/8")(s,o,!1,function(e){a("isau")},"data-v-74361a48",null);t.default=u.exports},isau:function(e,t){}});