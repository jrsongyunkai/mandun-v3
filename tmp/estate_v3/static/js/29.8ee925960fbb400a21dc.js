webpackJsonp([29],{YlDK:function(e,t){},mF4K:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("mvHQ"),l=a.n(n),s=a("P9l9"),i={data:function(){return{stats:[{value:"",label:this.$t("placeholder.pleaseChoose")},{value:"0",label:this.$t("control.offline")},{value:"1",label:this.$t("table.online")},{value:"-1",label:this.$t("table.offLine")}],state:[{value:"",label:this.$t("placeholder.pleaseChoose")},{value:!0,label:this.$t("table.closing")},{value:!1,label:this.$t("table.opening")}],formInline:{projectCode:this.$route.query.projectCode,status:this.$route.query.status,mac:this.$route.query.mac},projectNames:[],currentPage:1,channelTotal:0,pageSize:20,tableData:[],channelAbled:!0,refreshAbled:!0,multipleSelection:[],disableRefresh:null,disableClosingOrOpening:null}},mounted:function(){this.init()},methods:{init:function(){this.queryChannel()},queryChannel:function(){var e=this;this.tableData=[];var t={pageNo:this.currentPage,pageSize:this.pageSize,mac:this.formInline.mac,onOrOff:this.formInline.state,onlineStats:this.formInline.status,projectCode:this.formInline.projectCode};Object(s._136)(t).then(function(t){t.success?(e.tableData=t.datas,e.channelTotal=t.total,e.projectNames=e.$store.state.allProjects.data):"-1"===t.code||e.$message({message:t.message,type:"error"})}).catch(function(t){t&&e.$message({message:e.$t("message.unknown"),type:"error"})})},onSubmit:function(){this.currentPage=1,this.queryChannel()},handleSizeChange:function(e){this.currentPage=1,this.pageSize=e,this.queryChannel()},handleCurrentChange:function(e){this.currentPage=e,this.queryChannel()},handleSelectionChange:function(e){if(this.multipleSelection=e,this.multipleSelection.length>0){this.refreshAbled=!1;var t=this.multipleSelection.map(function(e){return e.onlineStats});this.channelAbled=!(!t.includes(0)&&!t.includes(-1))}else this.refreshAbled=this.channelAbled=!0},queryMacOcList:function(){var e=this;this.refreshAbled=!0,this.disableRefresh=setTimeout(function(){e.refreshAbled=!(e.multipleSelection.length>0)},2e3);var t=this.multipleSelection.map(function(e){return e.mac+"-"+e.chnlAddr});this.$nextTick(function(){var e=this;Object(s._126)({macAddr:t.join(",")}).then(function(t){if(t.success)for(var a=0;a<e.tableData.length;a++)for(var n=0;n<t.data.length;n++)t.data[n].mac===e.tableData[a].mac&&t.data[n].chnlAddr===+e.tableData[a].chnlAddr&&(e.tableData[a].onOffTime=t.data[n].onOffTime,e.tableData[a].onlineStats=t.data[n].onlineStats,e.tableData[a].stats=t.data[n].state);else"-1"===t.code||e.$message({message:t.message,type:"error"})}).catch(function(t){t&&e.$message({message:e.$t("message.unknown"),type:"error"})})})},batchClosingOrOpening:function(e){var t=this;this.channelAbled=!0,this.disableClosingOrOpening=setTimeout(function(){var e=t.multipleSelection.map(function(e){return e.onlineStats});t.multipleSelection.length>0?t.channelAbled=!(!e.includes(0)&&!e.includes(-1)):t.channelAbled=!0},2e3);var a=this.multipleSelection.map(function(t){return{mac:t.mac,addrOptInfos:[{onOrOff:e,addrs:[+t.chnlAddr]}]}});Object(s.t)(l()(a)).then(function(e){e.success?t.$message({message:t.$t("message.controlSuccess"),type:"success"}):"-1"===e.code||t.$message({message:e.message,type:"error"})}).catch(function(e){e&&t.$message({message:t.$t("message.unknown"),type:"error"})})},destroyed:function(){clearTimeout(this.disableRefresh),clearTimeout(this.disableClosingOrOpening)}}},o={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"channelList"}},[a("el-row",{staticStyle:{margin:"0",padding:"20px"},attrs:{gutter:20}},[a("el-col",[a("el-breadcrumb",{attrs:{"separator-class":"el-icon-arrow-right"}},[a("el-breadcrumb-item",{staticClass:"pointer",nativeOn:{click:function(t){return e.$router.go(-1)}}},[e._v(e._s(e.$t("btns.back")))]),e._v(" "),a("el-breadcrumb-item",[e._v(e._s(e.$t("dialog.channelList")))])],1),e._v(" "),a("el-form",{staticClass:"demo-form-inline tr mt-20",attrs:{inline:!0,size:"small",model:e.formInline}},[a("el-form-item",{staticClass:"channel closing-button"},[a("el-button",{attrs:{disabled:e.channelAbled},on:{click:function(t){e.batchClosingOrOpening(e.val=!0)}}},[e._v(e._s(e.$t("table.batch")+e.$t("table.closing")))])],1),e._v(" "),a("el-form-item",{staticClass:"channel"},[a("el-button",{attrs:{disabled:e.channelAbled},on:{click:function(t){e.batchClosingOrOpening(e.val=!1)}}},[e._v(e._s(e.$t("table.batch")+e.$t("table.opening")))])],1),e._v(" "),a("el-form-item",[a("el-select",{attrs:{clearable:"",filterable:"",placeholder:e.$t("table.pleaseEnter")+e.$t("table.projectName")},model:{value:e.formInline.projectCode,callback:function(t){e.$set(e.formInline,"projectCode",t)},expression:"formInline.projectCode"}},e._l(e.projectNames,function(e){return a("el-option",{key:e.projectCode,attrs:{label:e.projectName,value:e.projectCode}})}),1)],1),e._v(" "),a("el-form-item",[a("el-input",{attrs:{placeholder:e.$t("placeholder.enterDeviceNo")},nativeOn:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.onSubmit(t)}},model:{value:e.formInline.mac,callback:function(t){e.$set(e.formInline,"mac",t)},expression:"formInline.mac"}})],1),e._v(" "),a("el-form-item",[a("el-select",{staticStyle:{width:"120px"},attrs:{placeholder:e.$t("placeholder.pleaseChoose")},on:{change:e.handleChange},model:{value:e.formInline.status,callback:function(t){e.$set(e.formInline,"status",t)},expression:"formInline.status"}},e._l(e.stats,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),a("el-form-item",[a("el-select",{staticStyle:{width:"120px"},attrs:{placeholder:e.$t("placeholder.pleaseChoose")},model:{value:e.formInline.state,callback:function(t){e.$set(e.formInline,"state",t)},expression:"formInline.state"}},e._l(e.state,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{type:"primary"},on:{click:e.onSubmit}},[e._v(e._s(e.$t("btns.query")))])],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{disabled:e.refreshAbled},on:{click:e.queryMacOcList}},[e._v(e._s(e.$t("btns.refresh")))])],1)],1),e._v(" "),a("el-table",{attrs:{data:e.tableData},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",align:"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"mac",label:e.$t("dialog.deviceNo"),align:"center",width:"180"}}),e._v(" "),a("el-table-column",{attrs:{prop:"projectName",label:e.$t("table.projectName"),align:"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"projectAddress",label:e.$t("table.position"),align:"center"}}),e._v(" "),a("el-table-column",{attrs:{prop:"chnlTitle",label:e.$t("table.lineName"),align:"center",width:"120"}}),e._v(" "),a("el-table-column",{attrs:{label:e.$t("table.status"),align:"center",width:"150"},scopedSlots:e._u([{key:"default",fn:function(t){return[-1===t.row.onlineStats?a("span",{staticClass:"c-info"},[e._v(e._s(e.$t("table.offLine")))]):e._e(),e._v(" "),0===t.row.onlineStats?a("span",{staticClass:"c-danger"},[e._v(e._s(e.$t("control.offline")))]):e._e(),e._v(" "),1===t.row.onlineStats?a("span",{staticClass:"c-success"},[e._v(e._s(e.$t("table.online")))]):e._e(),e._v(" "),a("span",[e._v("|")]),e._v(" "),t.row.stats?a("span",{staticClass:"c-success"},[e._v(e._s(e.$t("table.beenClosed")))]):a("span",{staticClass:"c-danger"},[e._v(e._s(e.$t("table.beenOpend")))])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"onOffTime",label:e.$t("table.openingClosing"),align:"center"}})],1),e._v(" "),a("div",{staticClass:"block tc mt-10"},[a("el-pagination",{attrs:{background:"",small:"","current-page":e.currentPage,"page-sizes":[20,50,100,500],"page-size":e.pageSize,layout:"sizes, prev, pager, next",total:e.channelTotal},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)],1)],1)],1)},staticRenderFns:[]};var r=a("VU/8")(i,o,!1,function(e){a("YlDK")},"data-v-249b86d8",null);t.default=r.exports}});