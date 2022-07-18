import 'babel-polyfill'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
// import * as mutations from './mutations'

const state = {
  pageCustom: '',
  exponent: null,
  modulus: null,
  isLogin: false,
  platformName: '',
  projectCode: '',
  projectName: '',
  fullName: '',
  gaugeMax: '',
  realName: null,
  innerMessage: false,
  rightView: false,
  collapsed: true,
  totalStatus: false,
  totalAlarm: '',
  totalMac: '',
  totalOnline: '',
  totalProject: '',
  totalWarn: '',
  totalAddr: '',
  totalOnlineAddr: '',
  allTotalAlarm: '',
  industryTypes: [],
  location: {},
  provinceId: '',
  cityId: '',
  countyId: '',
  localData: [],
  classifiedAlarm: {
    ratioOfIndustry: [],
    l2dCompare: [],
    numberOfHandling: [],
    ratioOfAlert: []
  },
  distribution: {
    projectCode: '',
    dateType: '',
    date: ''
  },
  allProjects: [],
  realtimeAlarm: [],
  toPath: '',
  systemFlag: 'home',
  queryType: '',
  muted: false,
  heightGauge: '',
  heightOne: '',
  heightFour: '',
  heightSecond: '',
  heightThird: '',
  mapHeight: '',
  innerMainHeight: '',
  asideHeight: '',
  asideTowHeight: '',
  formulaHeight: '',
  overHeight: '',
  overTowHeight: '',
  manageHeight: '',
  consumHeight: '',
  manageTowHeight: '',
  innerComponentHeight: '',
  innerTableHeight: '',
  powerTableHeight: '',
  groupTableHeight: '',
  controlTableHeight: '',
  analysispieHeight: '',
  orviboTableHeight: '',
  channelsTableHeight: '',
  alarmTableHeight: '',
  channelsHeight: '',
  BuiltInTimingHeight: '',
  batchHeight: '',
  dialogHeight: '',
  uploadHeight: '',
  windowHeight: '',
  detailsAddr: '',
  nodeId: '',
  quantityType: '',
  typeNumber: -100,
  aliasName: '',
  mac: '',
  maintenanceObj: [],
  alarmId: '',
  oqp2: '',
  historyDate: '',
  dateFlag: false,
  statisticsFlag: false,
  stralsundObj: [],
  pressureObj: [],
  levelObj: [],
  smokeObj: [],
  smokeAlarmObj: [],
  flammableGasObj: [],
  homeProjectCode: '',
  source: '',
  sourceRoot: '',
  sourceUrl: '',
  overview: {
    equipmentType: 1,
    mac: ''
  },
  quantityForm: {},
  quantityPageSize: 20,
  quantityPage: [],
  sortBUR: {},
  warnTab: 'first',
  warnDatePicker: 'day',
  warnDateType: 1,
  warnDay: '',
  warnMonth: '',
  warnPageNo: 1,
  warnMac: '',
  ruleForm: null,
  ruleId: '',
  alarmForConfig: [],
  customAlarm: '',
  classifyLabel: '',
  Tcequipment: '',
  lineType: ''
}
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [createPersistedState()],
  state,
  mutations: {
    pageCustom: (state, v) => {
      state.pageCustom = v
    },
    lineType: (state, v) => {
      state.lineType = v
    },
    Tcequipment: (state, v) => {
      state.Tcequipment = v
    },
    exponent: (state, v) => {
      state.exponent = v
    },
    modulus: (state, v) => {
      state.modulus = v
    },
    isLogin: (state, v) => {
      state.isLogin = v
    },
    platformName: (state, v) => {
      state.platformName = v
    },
    realName: (state, v) => {
      state.realName = v
    },
    innerMessage: (state, v) => {
      state.innerMessage = v
    },
    rightView: (state, v) => {
      state.rightView = v
    },
    collapsed: (state, v) => {
      state.collapsed = v
    },
    projectCode: (state, v) => {
      state.projectCode = v
    },
    projectName: (state, v) => {
      state.projectName = v
    },
    fullName: (state, v) => {
      state.fullName = v
    },
    localData: (state, v) => {
      state.localData = v
    },
    gaugeMax: (state, v) => {
      state.gaugeMax = v
    },
    totalStatus: (state, v) => {
      state.totalStatus = v
    },
    totalAlarm: (state, v) => {
      state.totalAlarm = v
    },
    totalMac: (state, v) => {
      state.totalMac = v
    },
    totalOnline: (state, v) => {
      state.totalOnline = v
    },
    totalProject: (state, v) => {
      state.totalProject = v
    },
    totalWarn: (state, v) => {
      state.totalWarn = v
    },
    totalAddr: (state, v) => {
      state.totalAddr = v
    },
    totalOnlineAddr: (state, v) => {
      state.totalOnlineAddr = v
    },
    allTotalAlarm: (state, v) => {
      state.allTotalAlarm = v
    },
    industryTypes: (state, v) => {
      state.industryTypes = v
    },
    location: (state, v) => {
      state.location = v
    },
    provinceId: (state, v) => {
      state.provinceId = v
    },
    cityId: (state, v) => {
      state.cityId = v
    },
    countyId: (state, v) => {
      state.countyId = v
    },
    ratioOfIndustry: (state, v) => {
      state.classifiedAlarm.ratioOfIndustry = v
    },
    l2dCompare: (state, v) => {
      state.classifiedAlarm.l2dCompare = v
    },
    numberOfHandling: (state, v) => {
      state.classifiedAlarm.numberOfHandling = v
    },
    ratioOfAlert: (state, v) => {
      state.classifiedAlarm.ratioOfAlert = v
    },
    distributionProjectCode: (state, v) => {
      state.distribution.projectCode = v
    },
    distributionDateType: (state, v) => {
      state.distribution.dateType = v
    },
    distributionDate: (state, v) => {
      state.distribution.date = v
    },
    allProjects: (state, v) => {
      state.allProjects = v
    },
    realtimeAlarm: (state, v) => {
      state.realtimeAlarm = v
    },
    toPath: (state, v) => {
      state.toPath = v
    },
    systemFlag: (state, v) => {
      state.systemFlag = v
    },
    queryType: (state, v) => {
      state.queryType = v
    },
    muted: (state, v) => {
      state.muted = v
    },
    heightGauge: (state, v) => {
      state.heightGauge = v
    },
    heightOne: (state, v) => {
      state.heightOne = v
    },
    heightFour: (state, v) => {
      state.heightFour = v
    },
    heightSecond: (state, v) => {
      state.heightSecond = v
    },
    heightThird: (state, v) => {
      state.heightThird = v
    },
    mapHeight: (state, v) => {
      state.mapHeight = v
    },
    innerMainHeight: (state, v) => {
      state.innerMainHeight = v
    },
    asideHeight: (state, v) => {
      state.asideHeight = v
    },
    asideTowHeight: (state, v) => {
      state.asideTowHeight = v
    },
    formulaHeight: (state, v) => {
      state.formulaHeight = v
    },
    overHeight: (state, v) => {
      state.overHeight = v
    },
    overTowHeight: (state, v) => {
      state.overTowHeight = v
    },
    consumHeight: (state, v) => {
      state.consumHeight = v
    },
    manageHeight: (state, v) => {
      state.manageHeight = v
    },
    manageTowHeight: (state, v) => {
      state.manageTowHeight = v
    },
    innerComponentHeight: (state, v) => {
      state.innerComponentHeight = v
    },
    innerTableHeight: (state, v) => {
      state.innerTableHeight = v
    },
    powerTableHeight: (state, v) => {
      state.powerTableHeight = v
    },
    groupTableHeight: (state, v) => {
      state.groupTableHeight = v
    },
    controlTableHeight: (state, v) => {
      state.controlTableHeight = v
    },
    analysispieHeight: (state, v) => {
      state.analysispieHeight = v
    },
    orviboTableHeight: (state, v) => {
      state.orviboTableHeight = v
    },
    channelsTableHeight: (state, v) => {
      state.channelsTableHeight = v
    },
    alarmTableHeight: (state, v) => {
      state.alarmTableHeight = v
    },
    channelsHeight: (state, v) => {
      state.channelsHeight = v
    },
    BuiltInTimingHeight: (state, v) => {
      state.BuiltInTimingHeight = v
    },
    batchHeight: (state, v) => {
      state.batchHeight = v
    },
    dialogHeight: (state, v) => {
      state.dialogHeight = v
    },
    uploadHeight: (state, v) => {
      state.uploadHeight = v
    },
    windowHeight: (state, v) => {
      state.windowHeight = v
    },
    detailsAddr: (state, v) => {
      state.detailsAddr = v
    },
    nodeId: (state, v) => {
      state.nodeId = v
    },
    typeNumber: (state, v) => {
      state.typeNumber = v
    },
    quantityType: (state, v) => {
      state.quantityType = v
    },
    aliasName: (state, v) => {
      state.aliasName = v
    },
    mac: (state, v) => {
      state.mac = v
    },
    maintenanceObj: (state, v) => {
      state.maintenanceObj = v
    },
    alarmId: (state, v) => {
      state.alarmId = v
    },
    oqp2: (state, v) => {
      state.oqp2 = v
    },
    historyDate: (state, v) => {
      state.historyDate = v
    },
    dateFlag: (state, v) => {
      state.dateFlag = v
    },
    statisticsFlag: (state, v) => {
      state.statisticsFlag = v
    },
    stralsundObj: (state, v) => {
      state.stralsundObj = v
    },
    pressureObj: (state, v) => {
      state.pressureObj = v
    },
    levelObj: (state, v) => {
      state.levelObj = v
    },
    smokeObj: (state, v) => {
      state.smokeObj = v
    },
    flammableGasObj: (state, v) => {
      state.flammableGasObj = v
    },
    smokeAlarmObj: (state, v) => {
      state.smokeAlarmObj = v
    },
    homeProjectCode: (state, v) => {
      state.homeProjectCode = v
    },
    source: (state, v) => {
      state.source = v
    },
    sourceRoot: (state, v) => {
      state.sourceRoot = v
    },
    sourceUrl: (state, v) => {
      state.sourceUrl = v
    },
    equipmentType: (state, v) => {
      state.overview.equipmentType = v
    },
    overviewMac: (state, v) => {
      state.overview.mac = v
    },
    quantityForm: (state, v) => {
      state.quantityForm = v
    },
    quantityPageSize: (state, v) => {
      state.quantityPageSize = v
    },
    quantityPage: (state, v) => {
      state.quantityPage = v
    },
    sortBUR: (state, v) => {
      state.sortBUR = v
    },
    warnTab: (state, v) => {
      state.warnTab = v
    },
    warnDatePicker: (state, v) => {
      state.warnDatePicker = v
    },
    warnDateType: (state, v) => {
      state.warnDateType = v
    },
    warnDay: (state, v) => {
      state.warnDay = v
    },
    warnMonth: (state, v) => {
      state.warnMonth = v
    },
    warnPageNo: (state, v) => {
      state.warnPageNo = v
    },
    warnMac: (state, v) => {
      state.warnMac = v
    },
    ruleForm: (state, v) => {
      state.ruleForm = v
    },
    ruleId: (state, v) => {
      state.ruleId = v
    },
    alarmForConfig: (state, v) => {
      state.alarmForConfig = v
    },
    customAlarm: (state, v) => {
      state.customAlarm = v
    },
    classifyLabel: (state, v) => {
      state.classifyLabel = v
    }
  },
  actions: {
    reset ({ commit }) {
      commit('exponent', null)
      commit('modulus', null)
      commit('isLogin', false)
      commit('platformName', '')
      commit('projectCode', '')
      commit('projectName', '')
      commit('fullName', '')
      commit('gaugeMax', '')
      commit('realName', null)
      commit('innerMessage', false)
      commit('rightView', false)
      commit('collapsed', true)
      commit('totalStatus', false)
      commit('totalAlarm', '')
      commit('totalMac', '')
      commit('totalOnline', '')
      commit('totalProject', '')
      commit('totalWarn', '')
      commit('totalAddr', '')
      commit('totalOnlineAddr', '')
      commit('allTotalAlarm', '')
      commit('industryTypes', [])
      commit('location', {})
      commit('provinceId', '')
      commit('cityId', '')
      commit('countyId', '')
      commit('localData', [])
      commit('ratioOfIndustry', [])
      commit('l2dCompare', [])
      commit('numberOfHandling', [])
      commit('ratioOfAlert', [])
      commit('tabSecond', '')
      commit('allProjects', [])
      commit('realtimeAlarm', [])
      commit('toPath', '')
      commit('systemFlag', 'home')
      commit('queryType', '')
      commit('detailsAddr', '')
      commit('nodeId', '')
      commit('quantityType', '')
      commit('aliasName', '')
      commit('mac', '')
      commit('alarmId', '')
      commit('oqp2', '')
      commit('historyDate', '')
      commit('dateFlag', false)
      commit('statisticsFlag', false)
      commit('homeProjectCode', '')
      commit('sourceUrl', '/InnerMain/Overview')
      commit('quantityForm', {})
      commit('quantityPageSize', 20)
      commit('quantityPage', [])
      commit('warnTab', 'first')
      commit('warnDatePicker', 'day')
      commit('warnDateType', 1)
      commit('warnDay', '')
      commit('warnMonth', '')
      commit('warnPageNo', 1)
      commit('warnMac', '')
      commit('ruleForm', null)
      commit('ruleId', '')
      commit('alarmForConfig', [])
      commit('customAlarm', [])
      commit('classifyLabel', [])
    },
    resetHistoryDate ({commit}) {
      commit('historyDate', '')
    },
    resetOqp2 ({commit}) {
      commit('oqp2', '')
    },
    resetTotalStatus ({commit}) {
      commit('totalStatus', false)
    },
    resetQueryType ({commit}) {
      commit('queryType', '')
    },
    resetTypeNumber ({commit}) {
      commit('typeNumber', -100)
    },
    resetQuantityType ({commit}) {
      commit('quantityType', '')
    },
    resetMac ({commit}) {
      commit('mac', '')
    },
    resetMaintenanceObj ({commit}) {
      commit('maintenanceObj', [])
    },
    resetHomeProjectCode ({commit}) {
      commit('homeProjectCode', '')
    },
    resetSource ({commit}) {
      commit('source', '')
    },
    resetSourceRoot ({commit}) {
      commit('sourceRoot', '')
    },
    resetEquipmentType ({commit}) {
      commit('equipmentType', 1)
    },
    resetOverviewMac ({commit}) {
      commit('overviewMac', '')
    },
    resetQuantityForm ({commit}) {
      commit('quantityForm', {})
    },
    resetQuantityPageSize ({commit}) {
      commit('quantityPageSize', 20)
    },
    resetQuantityPage ({commit}) {
      commit('quantityPage', [])
    },
    resetWarnTab ({commit}) {
      commit('warnTab', 'first')
    },
    resetWarnDatePicker ({commit}) {
      commit('warnDatePicker', 'day')
    },
    resetWarnDateType ({commit}) {
      commit('warnDateType', 1)
    },
    resetWarnDay ({commit}) {
      commit('warnDay', '')
    },
    resetWarnMonth ({commit}) {
      commit('warnMonth', '')
    },
    resetWarnPageNo ({commit}) {
      commit('warnPageNo', 1)
    },
    resetWarnMac ({commit}) {
      commit('warnMac', '')
    },
    resetRuleForm ({commit}) {
      commit('ruleForm', null)
    }
  }
})
