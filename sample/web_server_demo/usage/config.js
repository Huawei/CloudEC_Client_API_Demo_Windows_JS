"use strict";
(function(root) {
    var options = {
        domain: "localhost.cloudec.huaweicloud.com",
        isWSS: 1,
        confCtrlProtocol: 1,
        isTlsSupport: 0,
        uiPluginAppDisplayName : "eSDK-Desktop",

        uiPluginlLanguage : 0,
        uiPluginResourcesPath: "",
        uiPluginUserFilesPath:"",
        uiPluginHasFrameInfo:0,
        uiPluginFrameInfoX:0,
        uiPluginFrameInfoY:0,
        uiPluginFrameInfoWidth:1280,
        uiPluginFrameInfoHeight:720,
        uiPluginHasParentInfo:0,
        uiPluginParentInfoIsNeedAttach:0,
        uiPluginParentInfoXOffset:0,
        uiPluginParentInfoYOffset:0,

        uiPluginHideTopToolBar:0,
        uiPluginHideBottomToolBar:0,
        uiPluginHideInviteButton:1,
        uiPluginHideAttendeesButton:1,
        uiPluginHideShareButton:1,
        uiPluginDataHideInviteButton:1,
        uiPluginDataHideAttendeesButton:1,
        uiPluginDataHideRequestRemotecontrolButton:1,
    }
    cloudEC.configure(options);

})(this);