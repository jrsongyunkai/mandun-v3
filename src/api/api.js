import * as Request from './request'

export const getList = (params) => {
  return Request.POST('/app/versionConfig/page.as', params)
}

export const getGblinfo = (params) => {
  return Request.FETCH('/portal/gblinfo.as?v=' + new Date().getTime(), params)
}

export const sessionState = (params) => {
  return Request.POST('/portal/sessionState.as?v=' + new Date().getTime(), params)
}

export const checkLogin = (params) => {
  return Request.FETCH('/portal/gblinfo.as?callback=loginchk&time=' + new Date().getTime(), params)
}

export const login = (params) => {
  return Request.POST('/portal/login.as', params)
}

export const signOut = (params) => {
  return Request.POST('/portal/logout.as', params)
}
export const loadMetadata = (params) => {
  return Request.POST('/project/main/v3/loadMetadata.as', params)
}

export const queryAlarmTrend = (params) => {
  return Request.POST('/project/main/v3/queryAlarmStatisticsTrend.as', params)
}

export const statisticalNumber = (params) => {
  return Request.POST('/project/main/v3/statisticalNumber.as', params)
}

export const loadAllProject = (params) => {
  return Request.POST('/project/main/loadAllHoldingProject.as', params)
}

export const alarmTypeStats = (params) => {
  return Request.POST('/project/main/v2/alarmOfProjectStats.as', params)
}

export const switchHover = (params) => {
  return Request.POST('/project/main/switchover.as', params)
}

export const classifiedAlarm = (params) => {
  return Request.POST('/project/main/v3/classifiedAlarmStatistics.as', params)
}

export const queryRealtimeAlarm = (params) => {
  return Request.POST('/project/main/v3/queryRealtimeAlarm.as', params)
}
export const powerAlarm = (params) => {
  return Request.POST('/project/main/v2/alarmOfTypeStats.as', params)
}

export const alarmDetail = (params) => {
  return Request.POST('/project/main/v2/alarmDetailOfProject.as', params)
}

export const leakageStats = (params) => {
  return Request.POST('/project/main/v2/leakageCurrentStats.as', params)
}

export const leakageDetail = (params) => {
  return Request.POST('/project/main/v2/leakageCurrentRealtime.as', params)
}

export const rangeTemperatureStats = (params) => {
  return Request.POST('/project/main/v2/rangeTemperatureStats.as', params)
}

export const temperatureDetail = (params) => {
  return Request.POST('/project/main/v2/temperatureRealtime.as', params)
}

export const queryChannels = (params) => {
  return Request.POST('/project/main/query/box/channels.as', params)
}

export const temperatureW = (params) => {
  return Request.POST('/project/main/v2/alarmOfTimeStats.as', params)
}

export const temperatureWDetail = (params) => {
  return Request.POST('/project/main/v2/alarmDetailOfProject.as', params)
}

export const leakageW = (params) => {
  return Request.POST('/project/main/v2/alarmOfTimeStats.as', params)
}

export const leakageAW = (params) => {
  return Request.POST('/project/main/v2/alarmAndWarnOfTimeStats.as', params)
}

export const leakageWDetail = (params) => {
  return Request.POST('/project/main/v2/alarmDetailOfProject.as', params)
}

export const currentStats = (params) => {
  return Request.POST('/project/main/v2/currentStats.as', params)
}

export const loadStats = (params) => {
  return Request.POST('/project/main/v2/loadStats.as', params)
}

export const avgVoltageStats = (params) => {
  return Request.POST('/project/main/v2/avgVoltageStats.as', params)
}

export const last2mPowerStats = (params) => {
  return Request.POST('/project/main/v2/last2mPowerStats.as', params)
}

export const getBuildings = (params) => {
  return Request.POST('/project/main/getBuildings.as', params)
}

export const queryPower = (params) => {
  return Request.POST('/project/main/query/project/mainline/power.as', params)
}

export const chnlPowerStatsOfBox = (params) => {
  return Request.POST('/project/main/v2/chnlPowerStatsOfBox.as', params)
}

export const last2yPowerStats = (params) => {
  return Request.POST('/project/main/v2/last2yPowerStats.as', params)
}

export const last2xLoadStats = (params) => {
  return Request.POST('/project/main/v2/last2xLoadStats.as', params)
}

export const queryBoxes = (params) => {
  return Request.POST('/project/main/query/boxes.as', params)
}

export const remotectrl = (params) => {
  return Request.POST('/app/remotectrl.as', params)
}

export const verifyAuthCode = (params) => {
  return Request.POST('/portal/verifyAuthCode.as', params)
}

export const queryScenes = (params) => {
  return Request.POST('/project/main/query/scenes.as', params)
}

export const scenesLock = (params) => {
  return Request.POST('/project/main/scene/lock.as', params)
}

export const scenesUpdate = (params) => {
  return Request.POST('/project/main/scene/add.as', params)
}
export const scenesDel = (params) => {
  return Request.POST('/project/main/scene/del.as', params)
}

export const scenesCtlOc = (params) => {
  return Request.POST('/project/main/scene/oc.as', params)
}

export const addrMod = (params) => {
  return Request.POST('/project/main/scene/addr/mod.as', params)
}

export const timerMod = (params) => {
  return Request.POST('/project/main/scene/timer/mod.as', params)
}

export const sceneInfo = (params) => {
  return Request.POST('/project/main/scene/info.as', params)
}

export const chgPwd = (params) => {
  return Request.POST('/portal/chgpwd.as', params)
}

export const queryPoPup = (params) => {
  return Request.POST('/alarmPopup/queryAlarmPoPupConfig.as', params)
}

export const updatePoPup = (params) => {
  return Request.POST('/alarmPopup/updateAlarmPoPupConfig.as', params)
}

export const queryChnlAttr = (params) => {
  return Request.POST('/box/findChnlAttrByMac.as', params)
}

export const macAlias = (params) => {
  return Request.POST('/box/updateMacNameAndFloor.as', params)
}
export const updateNodeTitle = (params) => {
  return Request.POST('/box/updateChnlAttrTitle.as', params)
}

export const updateChnlAttr = (params) => {
  return Request.POST('/box/updateChnlAttr.as', params)
}

export const SMSPush = (params) => {
  return Request.POST('/alarmPushConfig/getAlarmPushConfigInfoOfStaff.as', params)
}

export const projectSelect = (params) => {
  return Request.POST('/project/listProjectForSelect.as', params)
}

export const lockPushEnable = (params) => {
  return Request.POST('/alarmPushConfig/lockPushEnable.as', params)
}

export const saveAlarmPushConfigInfo = (params) => {
  return Request.POST('/alarmPushConfig/saveAlarmPushConfigInfo.as', params)
}

export const payQrCode = (params) => {
  return Request.POST('/app/wxPay/getPayQrCode.as', params)
}

export const payStatus = (params) => {
  return Request.POST('/app/wxPay/getTradeNoPayStatu.as', params)
}

export const confirmPayStatus = (params) => {
  return Request.POST('/app/wxPay/confirmPayStatu.as', params)
}

export const listProjectForConfig = (params) => {
  return Request.POST('/alarmPushConfig/listProjectForSelect.as', params)
}

export const lastAlarm4tip = (params) => {
  return Request.POST('/project/main/v2/lastAlarm4tip.as', params)
}

export const queryProjectMacDetails = (params) => {
  return Request.POST('/project/main/v3/queryProjectMacDetails.as', params)
}

export const queryOperateLog = (params) => {
  return Request.POST('/operateLog/pageList.as', params)
}

export const queryProjectDetails = (params) => {
  return Request.POST('/project/main/v3/queryProjectDetails.as', params)
}

export const queryProjectMacAddrDetails = (params) => {
  return Request.POST('/project/main/v2/queryProjectMacAddrDetails.as', params)
}

export const batchRemotectrl = (params) => {
  return Request.POST2('/project/main/v2/batchRemotectrl.as', params)
}

export const queryMacOcState = (params) => {
  return Request.POST('/project/main/v2/queryMacOcState.as', params)
}

export const alarmDetailOfDistrict = (params) => {
  return Request.POST('/project/main/v2/alarmDetailOfDistrict.as', params)
}

export const modifyBoxsChnlTitle = (params) => {
  return Request.POST('/boxProperties/modifyBoxsChnlTitle.as', params)
}

export const modifyBoxsChnlPower = (params) => {
  return Request.POST('/boxProperties/modifyBoxsChnlPower.as', params)
}

export const modifyBoxsChnlCurrent = (params) => {
  return Request.POST('/boxProperties/modifyBoxsChnlCurrent.as', params)
}

export const modifyBoxsChnlLeakageCurrent = (params) => {
  return Request.POST('/boxProperties/modifyBoxsChnlLeakageCurrent.as', params)
}

export const modifyBoxsChnlTemperature = (params) => {
  return Request.POST('/boxProperties/modifyBoxsChnlTemperature.as', params)
}

export const modifyBoxsChnlVoltage = (params) => {
  return Request.POST('/boxProperties/modifyBoxsChnlVoltage.as', params)
}

export const modifyBoxsChnlWiring = (params) => {
  return Request.POST('/boxProperties/modifyBoxsChnlWiring.as', params)
}

export const modifyBoxsWireless = (params) => {
  return Request.POST('/boxProperties/modifyBoxsWireless.as', params)
}

export const modifyBoxsLoginPasswrod = (params) => {
  return Request.POST('/boxProperties/modifyBoxsLoginPasswrod.as', params)
}

export const modifyBoxsChnlAlarmEbable = (params) => {
  return Request.POST('/boxProperties/modifyBoxsChnlAlarmEbable.as', params)
}

export const modifyBoxsChnlTripEnable = (params) => {
  return Request.POST('/boxProperties/modifyBoxsChnlTripEnable.as', params)
}

export const modifyBoxsChnlTimer = (params) => {
  return Request.POST('/boxProperties/modifyBoxsChnlTimer.as', params)
}

export const queryAlarmById = (params) => {
  return Request.POST('/project/main/v3/queryAlarmById.as', params)
}

export const getEffectAddr = (params) => {
  return Request.POST('/app/compare/config/getEffectAddr.as', params)
}

export const queryChannelDetailsByBoxAndAddr = (params) => {
  return Request.POST('/box/queryChannelDetailsByBoxAndAddr.as', params)
}

export const channelHistory = (params) => {
  return Request.POST('/trend/channelHistory.as', params)
}

export const queryBoxDetails = (params) => {
  return Request.POST('/box/queryBoxDetails.as', params)
}

export const queryAlarmListOfPageById = (params) => {
  return Request.POST('/project/main/v3/queryAlarmListOfPage.as', params)
}

export const modifyBoxsChnlClearAlarm = (params) => {
  return Request.POST('/boxProperties/modifyBoxsChnlClearAlarm.as', params)
}

export const modifyBoxsChnlRemoteMute = (params) => {
  return Request.POST('/boxProperties/modifyBoxsChnlRemoteMute.as', params)
}

export const listMaintenance = (params) => {
  return Request.POST('/maintenance/listMaintenance.as', params)
}

export const isExist = (params) => {
  return Request.POST('/maintenance/isExist.as', params)
}

export const findMaintenance = (params) => {
  return Request.POST('/maintenance/findMaintenance.as', params)
}

export const updateMaintenance = (params) => {
  return Request.POST('/maintenance/updateMaintenance.as', params)
}

export const queryNorChannelByMac = (params) => {
  return Request.POST('/norChannel/queryNorChannelByMac.as', params)
}

export const norChannelHistory = (params) => {
  return Request.POST('/trend/norChannelHistory.as', params)
}

export const queryAlarmByBox = (params) => {
  return Request.POST('/box/queryAlarmByBox.as', params)
}

export const strlStatusQuery = (params) => {
  return Request.POST('/norProperties/strlStatusQuery.as', params)
}

export const strlAlarmReset = (params) => {
  return Request.POST('/norProperties/strlAlarmReset.as', params)
}

export const strlTripOut = (params) => {
  return Request.POST('/norProperties/strlTripOut.as', params)
}

export const strlRefreshAttr = (params) => {
  return Request.POST('/norProperties/strlRefreshAttr.as', params)
}

export const strlModifyThreshold = (params) => {
  return Request.POST('/norProperties/strlModifyThreshold.as', params)
}

export const checkMacOnlineStatus = (params) => {
  return Request.POST('/project/main/v3/checkMacOnlineStatus.as', params)
}

export const forsafeDeviceCommand = (params) => {
  return Request.POST('/norProperties/forsafeDeviceCommand.as', params)
}

export const queryForsafeChannelByMac = (params) => {
  return Request.POST('/forsafe/queryForsafeChannelByMac.as', params)
}

export const queryForsafeChnllHistory = (params) => {
  return Request.POST('/forsafe/queryForsafeChnllHistory.as', params)
}

export const queryForsafeMsgTypeConfig = (params) => {
  return Request.POST('/forsafe/queryForsafeMsgTypeConfig.as', params)
}

export const tlinkDeviceCommand = (params) => {
  return Request.POST('/norProperties/tlinkDeviceCommand.as', params)
}

export const preferences = (params) => {
  return Request.POST('/prjAlarmConfig/load/preferences.as', params)
}

export const savePreferences = (params) => {
  return Request.POST2('/prjAlarmConfig/batchSave/preferences.as', params)
}

export const findParamsById = (params) => {
  return Request.POST('/operateLog/findParamsById.as', params)
}

export const queryTlinkChannelByMac = (params) => {
  return Request.POST('/tlink/queryTlinkChannelByMac.as', params)
}

export const queryTlinkChnlHistory = (params) => {
  return Request.POST('/tlink/queryTlinkChnlHistory.as', params)
}

export const queryTlinkConfig = (params) => {
  return Request.POST('/tlink/queryTlinkConfig.as', params)
}

export const deStatuscanConf = (params) => {
  return Request.POST('/deStatuscan/conf/page.as', params)
}

export const saveDeStatuscanConf = (params) => {
  return Request.POST('/deStatuscan/conf/save.as', params)
}

export const delDeStatuscanConf = (params) => {
  return Request.POST('/deStatuscan/conf/del.as', params)
}

export const saveDeStatuscanConfDetail = (params) => {
  return Request.POST('/deStatuscan/confDetail/save.as', params)
}

export const delDeStatuscanConfDetail = (params) => {
  return Request.POST('/deStatuscan/confDetail/del.as', params)
}

export const deStatuscanPage = (params) => {
  return Request.POST('/deStatuscan/result/page.as', params)
}

export const forTip = (params) => {
  return Request.POST('/deStatuscan/result/forTip.as', params)
}

export const projectOpeningAndClosingWarning = (params) => {
  return Request.POST('/project/main/v3/projectOpeningAndClosingWarning.as', params)
}

export const alarmHandling = (params) => {
  return Request.POST('/project/main/v3/alarmHandling.as', params)
}

export const timeingList = (params) => {
  return Request.POST('/timing/list.as', params)
}

export const findById = (params) => {
  return Request.POST('/timing/findById.as', params)
}

export const modifyTiming = (params) => {
  return Request.POST('/timing/modifyTiming.as', params)
}

export const modifyMacRate = (params) => {
  return Request.POST('/project/main/ctl/boxes/rate.as', params)
}

export const winextlora = (params) => {
  return Request.POST('/winextlora/queryChannelHistory.as', params)
}

export const winextloraQueryChannelDetails = (params) => {
  return Request.POST('/winextlora/queryChannelDetails.as', params)
}

export const winextloraCmd = (params) => {
  return Request.POST('/winextlora/down/cmd.as', params)
}

export const zhloraQueryBoxConfig = (params) => {
  return Request.POST('/zhlora/queryBoxConfig.as', params)
}

export const getPayQuotaConfig = (params) => {
  return Request.POST('/app/wxPay/getPayQuotaConfig.as', params)
}

export const getLeftTreeView = (params) => {
  return Request.POST('/project/main/v2/loadGroupTreeProject.as', params)
}

export const updateAlarmSound = (params) => {
  return Request.POST2('/alarmPopup/soundFileUpload.as', params)
}

export const queryAlarmSound = (params) => {
  return Request.POST2('/alarmPopup/soundQuery.as', params)
}

export const saveAlarmSound = (params) => {
  return Request.POST2('/alarmPopup/soundSave.as', params)
}

export const delAlarmSound = (params) => {
  return Request.POST('/alarmPopup/soundFileDel.as', params)
}

export const globalAlarmSound = (params) => {
  return Request.POST('/alarmPopup/gblSoundInfo.as', params)
}

export const queryListData = (params) => {
  return Request.POST('/timing/querySyncSceneToBuiltInTimingList.as', params)
}

export const queryListsync = (params) => {
  return Request.POST('/timing/issueSyncSceneToBuiltInTimingCmd.as', params)
}

export const syncScene = (params) => {
  return Request.POST('/timing/syncSceneToBuiltInTiming.as', params)
}

export const queryFollwerByStaff = (params) => {
  return Request.POST('/project/main/v3/queryFollwerByStaff.as', params)
}

export const updateProjectInfo = (params) => {
  return Request.POST('/project/main/v3/updateProjectInfo.as', params)
}
export const orbindOrvibo = (params) => {
  return Request.POST2('/orvibo/checkAccountBound.as', params)
}

export const getOrviboList = (params) => {
  return Request.POST('/orvibo/orviboDeviceList.as', params)
}

export const getOrvibofamilyList = (params) => {
  return Request.POST('/orvibo/familyDiscovery.as', params)
}

export const getOrviboRoomList = (params) => {
  return Request.POST('/orvibo/orviboRoomList.as', params)
}

export const discoveryOrvibo = (params) => {
  return Request.POST('/orvibo/deviceDiscovery.as', params)
}

export const modifyDeviceName = (params) => {
  return Request.POST('/orvibo/modifyDeviceName.as', params)
}

export const queryTimer = (params) => {
  return Request.POST2('/orvibo/timerQuery.as', params)
}

export const addTiming = (params) => {
  return Request.POST2('/orvibo/addTiming.as', params)
}

export const delTiming = (params) => {
  return Request.POST('/timing/delTiming.as', params)
}

export const addCountdown = (params) => {
  return Request.POST2('/orvibo/addCountdown.as', params)
}

export const modifyOrviboTiming = (params) => {
  return Request.POST2('/orvibo/modifyTiming.as', params)
}

export const queryStatus = (params) => {
  return Request.POST('/orvibo/queryDeviceStatus.as', params)
}

export const deviceControl = (params) => {
  return Request.POST('/orvibo/deviceControl.as', params)
}

export const delOrviboTiming = (params) => {
  return Request.POST2('/orvibo/delTiming.as', params)
}

export const queryAlarmForConfig = (params) => {
  return Request.POST('/project/main/v3/queryAlarmForConfig.as', params)
}

export const delAlarmPushConfig = (params) => {
  return Request.POST('/alarmPushConfig/del.as', params)
}

export const queryZacChannelMac = (params) => {
  return Request.POST('/zac/findZacChannelByMac.as', params)
}

export const querySmokeHistory = (params) => {
  return Request.POST('/zac/queryZacChnlHistory.as', params)
}

export const findProject = (params) => {
  return Request.POST('/project/findProject.as', params)
}

export const saveServerPoint = (params) => {
  return Request.POST('/project/saveServerPoint.as', params)
}

export const prjAlarmConfigDel = (params) => {
  return Request.POST('/prjAlarmConfig/del.as', params)
}

export const prjAlarmConfigSave = (params) => {
  return Request.POST('/prjAlarmConfig/save.as', params)
}

export const soundDel = (params) => {
  return Request.POST('/alarmPopup/soundDel.as', params)
}

export const getAuthCode = (params) => {
  return Request.FETCH('/orvibo/getAuthCode.as', params)
}

export const saveBoxProperty = (params) => {
  return Request.POST('/box/saveBoxProperty.as', params)
}

export const queryAssociatedUsers = (params) => {
  return Request.POST('/project/main/v3/queryAssociatedUsers.as', params)
}

export const saveFollowerForAssign = (params) => {
  return Request.POST('/project/main/v3/saveFollowerForAssign.as', params)
}

export const queryStaffByAccount = (params) => {
  return Request.POST('/project/main/v3/queryStaffByAccount.as', params)
}

export const pageInfoById = (params) => {
  return Request.POST('/message/pageInfoById.as', params)
}

export const updateReadStatus = (params) => {
  return Request.POST('/message/updateReadStatus.as', params)
}

export const delNewsStatus = (params) => {
  return Request.POST('/message/del.as', params)
}

export const findStaffProperty = (params) => {
  return Request.POST('/project/main/v3/findCustomMapOfEnable.as', params)
}

export const saveStaffProperty = (params) => {
  return Request.POST('/project/main/v3/updateStaff4CustomMap.as', params)
}

export const queryProject4Select = (params) => {
  return Request.POST('/customMap/queryProject4Select.as', params)
}

export const queryMapInfo = (params) => {
  return Request.POST('/customMap/queryMapInfo.as', params)
}

export const saveMapDetail = (params) => {
  return Request.POST('/customMap/saveMapDetail.as', params)
}

export const delMapDetail = (params) => {
  return Request.POST('/customMap/delMapDetail.as', params)
}

export const queryHomeMapInfo = (params) => {
  return Request.POST('/project/main/v3/queryMapInfo.as', params)
}

export const addrEditGroup = (params) => {
  return Request.POST('/stats-group/save.as', params)
}

export const queryGroup = (params) => {
  return Request.POST('/stats-group/page.as', params)
}

export const delGroup = (params) => {
  return Request.POST('/stats-group/del.as', params)
}

export const chnlDetails = (params) => {
  return Request.POST('/stats-group/queryChnlDetails.as', params)
}

export const delDetail = (params) => {
  return Request.POST('/stats-group/delDetail.as', params)
}

export const pageBoxsSelect = (params) => {
  return Request.POST('/stats-group/pageBoxs4Select.as', params)
}

export const queryChnlSelect = (params) => {
  return Request.POST('/stats-group/queryChnl4Select.as', params)
}

export const saveDetail = (params) => {
  return Request.POST('/stats-group/saveDetail.as', params)
}

export const queryPageAuth = (params) => {
  return Request.POST('/portal/pageAuth.as', params)
}

export const findByMacAndNode = (params) => {
  return Request.POST('/renke/findByMacAndNode.as', params)
}

export const queryParamByMac = (params) => {
  return Request.POST('/renke/queryParamByMac.as', params)
}

export const updateParam = (params) => {
  return Request.POST('/renke/updateParam.as', params)
}

export const refreshParam = (params) => {
  return Request.POST('/renke/refreshParam.as', params)
}

export const updateAlarmEnable = (params) => {
  return Request.POST('/renke/updateAlarmEnable.as', params)
}

export const queryRenkeChnlHistory = (params) => {
  return Request.POST('/renke/queryRenkeChnlHistory.as', params)
}

export const linkageSceneList = (params) => {
  return Request.POST('/cbScene/list.as', params)
}

export const linkageSceneSave = (params) => {
  return Request.POST('/cbScene/save.as', params)
}

export const linkageSceneDel = (params) => {
  return Request.POST('/cbScene/del.as', params)
}

export const linkageDetail = (params) => {
  return Request.POST('/cbScene/detail.as', params)
}

export const linkagedeLock = (params) => {
  return Request.POST('/cbScene/lock.as', params)
}

export const refreshSim = (params) => {
  return Request.POST('/box/refreshSim.as', params)
}

export const queryAlarms4Custom = (params) => {
  return Request.POST('/project-property/queryAlarms4Custom.as', params)
}

export const resetCustomAlarm = (params) => {
  return Request.POST('/project-property/resetCustomAlarm.as', params)
}

export const saveCustomAlarms = (params) => {
  return Request.POST('/project-property/saveCustomAlarms.as', params)
}

export const statsPowerByTimeRange = (params) => {
  return Request.POST('/project/main/v3/statsPowerByTimeRange.as', params)
}

export const queryYearRatioByTimeRangePower = (params) => {
  return Request.POST('/project/main/v3/queryYearRatioByTimeRangePower.as', params)
}

export const queryTimeRangePowerOfProject = (params) => {
  return Request.POST('/project/main/v3/queryTimeRangePowerOfProject.as', params)
}

export const eleRead = (params) => {
  return Request.POST('/chtqdq/eleRead.as', params)
}

export const queryChtqdqMeterReadingData = (params) => {
  return Request.POST('/chtqdq/queryChtqdqMeterReadingData.as', params)
}

export const queryChtqdqMeterReadingDataHistory = (params) => {
  return Request.POST('/chtqdq/queryChtqdqMeterReadingDataHistory.as', params)
}

export const abnormalSwitchUnlock = (params) => {
  return Request.POST('/box-control/abnormalSwitchUnlock.as', params)
}

export const cmdFeedBack = (params) => {
  return Request.POST('/cmd-feedback/page.as', params)
}

export const cmdQueryHistory = (params) => {
  return Request.POST('/cmd-feedback/queryHistory.as', params)
}

export const findStaffInfo = (params) => {
  return Request.POST('/project/main/v3/findStaffInfo.as', params)
}

export const updateStaffInfo = (params) => {
  return Request.POST('/project/main/v3/updateStaffInfo.as', params)
}

export const tempOfRealtimeOrStatistic = (params) => {
  return Request.POST('/project/main/v3/tempOfRealtimeOrStatistic.as', params)
}

export const remoteSwitchLock = (params) => {
  return Request.POST('/box-control/remoteSwitchLock.as', params)
}

export const alarmHistoryStatisticalNumber = (params) => {
  return Request.POST('/project/main/v3/alarmHistoryStatisticalNumber.as', params)
}

export const loadTree = (params) => {
  return Request.POST('/projectGroup/loadTree.as', params)
}

export const pageRsOfProject = (params) => {
  return Request.POST('/projectGroup/pageRsOfProject.as', params)
}

export const saveProjectGroup = (params) => {
  return Request.POST('/projectGroup/save.as', params)
}

export const delProjectGroup = (params) => {
  return Request.POST('/projectGroup/del.as', params)
}

export const pageProject4SelectOfGroup = (params) => {
  return Request.POST('/projectGroup/pageProject4SelectOfGroup.as', params)
}

export const saveProjectOfGroup = (params) => {
  return Request.POST('/projectGroup/saveProjectOfGroup.as', params)
}

export const analysisReportAlarm = (params) => {
  return Request.POST('/analysis-report/statistic/alarm.as', params)
}

export const analysisReportMaintenance = (params) => {
  return Request.POST('/analysis-report/statistic/maintenance.as', params)
}

export const analysisReportPower = (params) => {
  return Request.POST('/analysis-report/statistic/power.as', params)
}

export const analysisReportInspection = (params) => {
  return Request.POST('/analysis-report/statistic/inspection.as', params)
}

export const alarmUrgePush = (params) => {
  return Request.POST('/alarm/urge4Push.as', params)
}

export const inspectionDetailQuery = (params) => {
  return Request.POST('/inspection/detail/query.as', params)
}

export const inspectionDetailSave = (params) => {
  return Request.POST('/inspection/detail/save.as', params)
}

export const modifyBoxRemoteControl = (params) => {
  return Request.POST('/boxProperties/modifyBoxRemoteControl.as', params)
}

export const terriblePower = (params) => {
  return Request.POST('/boxProperties/modifyBoxsChnl/terriblePower.as', params)
}

export const downGetTime = (params) => {
  return Request.POST('/timing/downGetTime.as', params)
}

export const switchToNewPlatform = (params) => {
  return Request.POST('/project-property/switchToNewPlatform.as', params)
}

export const disableSelection = (params) => {
  return Request.POST('/boxConfig/channel/disableSelection.as', params)
}

export const batchModifyTiming = (params) => {
  return Request.POST('/timing/batchModifyTiming.as', params)
}

export const longitudeAndLatitude = (params) => {
  return Request.POST('/timing/longitudeAndLatitude/get.as', params)
}

export const refreshLongitudeLatitude = (params) => {
  return Request.POST('/timing/longitudeAndLatitude/refresh.as', params)
}

export const setLongitudeLatitude = (params) => {
  return Request.POST('/timing/longitudeAndLatitude/set.as', params)
}

export const seekAreaListTreeByProject = (params) => {
  return Request.FETCH('/energy/seekAreaListTreeByProject.as', params)
}

export const seekAreaEnergyPlanList = (params) => {
  return Request.FETCH('/energy/seekAreaEnergyPlanList.as', params)
}

export const addAreaEnergyPlan = (params) => {
  return Request.POST2('/energy/addAreaEnergyPlan.as', params)
}

export const seekAreaEnergyPlanByYear = (params) => {
  return Request.FETCH('/energy/seekAreaEnergyPlanLastYear.as', params)
}

export const getChannelCategory = (params) => {
  return Request.FETCH('/energy/getChannelCategory.as', params)
}

export const addChannelCategory = (params) => {
  return Request.POST2('/energy/addChannelCategory.as', params)
}

export const energyAddArea = (params) => {
  return Request.POST('/energy/addArea.as', params)
}

export const energyDelArea = (params) => {
  return Request.POST('/energy/delArea.as', params)
}

export const energyUpdateArea = (params) => {
  return Request.POST2('/energy/updateArea.as', params)
}

export const addAreaBoxMapping = (params) => {
  return Request.POST('/energy/addAreaBoxMapping.as', params)
}

export const energyOverview = (params) => {
  return Request.POST('/energyReport/energyOverview.as', params)
}

export const energyTrend = (params) => {
  return Request.POST('/energyReport/energyTrend.as', params)
}

export const delAreaEnergyPlan = (params) => {
  return Request.POST('/energy/delAreaEnergyPlan.as', params)
}

export const reportPage = (params) => {
  return Request.POST('/energyReport/page.as', params)
}

export const reportExport = (params) => {
  return Request.POST('/energyReport/export.as', params)
}

export const findHuaxuChannelByMac = (params) => {
  return Request.POST('/huaxu/findHuaxuChannelByMac.as', params)
}

export const queryHuaxuChnlHistory = (params) => {
  return Request.POST('/huaxu/queryHuaxuChnlHistory.as', params)
}

export const valveControl = (params) => {
  return Request.POST('/huaxu/valveControl.as', params)
}

export const energyContrast = (params) => {
  return Request.POST('/energyReport/contrast.as', params)
}

export const energyGeneral = (params) => {
  return Request.FETCH('/energyReport/general.as', params)
}

export const energyArea = (params) => {
  return Request.FETCH('/energyReport/area.as', params)
}

export const seekAreaBoxMapping = (params) => {
  return Request.FETCH('/energy/seekAreaBoxMapping.as', params)
}

export const sameCompare = (params) => {
  return Request.POST('/energyReport/sameCompare.as', params)
}

export const energyCategory = (params) => {
  return Request.FETCH('/energyReport/category.as', params)
}

export const queryBoxByArea = (params) => {
  return Request.POST('/energyReport/queryBoxByArea.as', params)
}

export const delAreaBoxMapping = (params) => {
  return Request.POST('/energy/delAreaBoxMapping.as', params)
}

export const energyGeneralArea = (params) => {
  return Request.FETCH('/energyReport/generalArea.as', params)
}

export const energyGeneralCategory = (params) => {
  return Request.FETCH('/energyReport/generalCategory.as', params)
}

export const energyAreaBaseInfo = (params) => {
  return Request.FETCH('/energyReport/areaBaseInfo.as', params)
}

export const energyAreaOrder = (params) => {
  return Request.FETCH('/energyReport/areaOrder.as', params)
}

export const energyGeneralByMonth = (params) => {
  return Request.FETCH('/energyReport/generalByMonth.as', params)
}

export const queryChannelOfLevel = (params) => {
  return Request.POST('/energyReport/queryChannelOfLevel.as', params)
}

export const statistics = (params) => {
  return Request.POST('/energyReport/statistics.as', params)
}

export const energyAnalysis = (params) => {
  return Request.POST('/energyReport/analysis.as', params)
}

export const getClosestRealTimeByAlarmTime = (params) => {
  return Request.POST('/project/main/v3/getClosestRealTimeByAlarmTime.as', params)
}

export const findLastChannelByMac = (params) => {
  return Request.POST('/chaobiaomao/findLastChannelByMac.as', params)
}

export const queryChaobiaomaoChannel = (params) => {
  return Request.POST('/chaobiaomao/queryChaobiaomaoChannel.as', params)
}
export const getChannelInOutConfig = (params) => {
  return Request.POST('/box/getChannelInOutConfig.as', params)
}
export const setChannelInOutConfig = (params) => {
  return Request.POST2('/box/setChannelInOutConfig.as', params)
}
export const getEquipmentClassifyTab = (params) => {
  return Request.POST('/project-property/getEquipmentClassifyTab.as', params)
}
export const saveEquipmentClassifyTab = (params) => {
  return Request.POST('/project-property/saveEquipmentClassifyTab.as', params)
}
export const findJadeBirdFireChannelByMac = (params) => {
  return Request.POST('/jadebirdfire/findJadeBirdFireChannelByMac.as', params)
}
export const httpCommand = (params) => {
  return Request.POST('/jadebirdfire/httpCommand.as', params)
}
export const modActionType = (params) => {
  return Request.POST('/project/main/scene/addr/modActionType.as', params)
}
