"use strict";
(function(root) {
    var options = {
        domain: "localhost.cloudec.huaweicloud.com",
        isWSS: 1,
        confCtrlProtocol: 1,
        isTlsSupport: 0,
        uiPluginAppDisplayName : "eSDK-Desktop",
        IsSupportIm:0,
        IsSupportSvcConference:1,

        uiPluginlLanguage : 0,
        uiPluginResourcesPath: "",
        uiPluginUserFilesPath:"",
        uiPluginHasFrameInfo:1,
        uiPluginFrameInfoX:100,
        uiPluginFrameInfoY:50,
        uiPluginFrameInfoWidth:1038,
        uiPluginFrameInfoHeight:620,
        uiPluginHasParentInfo:1,
        uiPluginParentInfoIsNeedAttach:1,
        uiPluginParentInfoXOffsetRate:20,
        uiPluginParentInfoYOffsetRate:15,
		uiPluginFrameInfoMinWidth:480,
        uiPluginFrameInfoMinHeight:352,        

        uiPluginHideTopToolBar:0,
        uiPluginHideBottomToolBar:0,
        uiPluginHideInviteButton:1,
        uiPluginHideAttendeesButton:1,
        uiPluginHideShareButton:0,
        uiPluginHideShareConfLink:1,
        uiPluginHideExtendConfButton:0,
        uiPluginHideAudioVideoSettingButton:1,
        uiPluginHideCloseButton:0,
        uiPluginHideMaxsizeMinisizeButton:0,
		uiPluginHideLeaveButton:0,        
        uiPluginHideConfTime:0,
        uiPluginHideConfChairmanPwd:0,
        uiPluginHideConfGuestPwd:0,
        uiPluginHideShareTypeSelection:0,
        uiPluginDataHideInviteButton:1,
        uiPluginDataHideAttendeesButton:1,
        uiPluginDataHideRequestRemotecontrolButton:1,

        pageTitle:"High-Level-API"
    }
    cloudEC.configure(options);

})(this);