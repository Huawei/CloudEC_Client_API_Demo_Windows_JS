function login() {
	var account = document.getElementById("name").value;
	var passwd = document.getElementById("passwd").value;
	var serverAddress = document.getElementById("svr_addr").value;
	var serverPort = document.getElementById("svr_port").value;

	var extensionsParam = new Array();
	if (document.getElementById("setProxy_Select").checked)
	{
		var proxyAddress = document.getElementById("proxy_addr").value;
		var proxyPort = document.getElementById("proxy_port").value;
		var proxyAccount = document.getElementById("proxy_account").value;
		var proxyPassword = document.getElementById("proxy_pwd").value;

		var proxyParam = {
			proxyAddress:proxyAddress,
			proxyPort:proxyPort,
			proxyAccount:proxyAccount,
			proxyPassword:proxyPassword
		}
	}

	//0 account auth type
	client.login(0, { 'account': account, 'passwd': passwd },
		{ 'serverAddress': serverAddress, 'serverPort': parseInt(serverPort), 'extensions': JSON.stringify(proxyParam) }, function callback(evt) {

			if (!evt.result) {
				alert("login failed >>>errorCode:" + evt.info.errorCode + "errorInfo:" + evt.info.errorInfo)

			} else {
				//alert("good,to do something here for login success")
				var userInfo = "<dl><dt>USER INFO</dt><dd>user account:" + evt.info.userAccount
					+ "</dd><dd>SIP number:" + evt.info.sipAccount
					+ "</dd><dd>short number:" + evt.info.shortNumber
					+ "</dd><dd>login time:" + evt.info.loginTime
					+ "</dd>"

				document.getElementById("userinfo").innerHTML = userInfo;

				//change UI to login successful
				document.getElementById("passwd").value = "";
				document.getElementById("login").style.display = "none";
				document.getElementById("call").style.display = "block";

				//Login successful, trigger login event for conf_list.html and media_device.html
				var event = new Event('cloudec:login');
				document.getElementById("cloudec_conflist_div").dispatchEvent(event);
				event = new Event('cloudec:login');
				document.getElementById("configPanel").dispatchEvent(event);
				client.setDisplayName(evt.info.sipAccount);
			}

		});
	passwd = "";
	proxyPassword = "";
	proxyParam ="";
}

function modifyPassword(){
	var oldPasswd = document.getElementById("oldPasswd").value;
	var newPasswd = document.getElementById("newPasswd").value;
	var modifyPassword = {
		newPassword : newPasswd,
		oldPassword : oldPasswd,
	}
	client.modifyPassword(modifyPassword,()=>{});
}

//call start
function makeCall(){
	var isVideoCall = 0;
	var calleeNum = document.getElementById("callee_num").value;
    if(document.getElementById("isVideoCall").checked)
    {
        isVideoCall = 1;
    }
        
    client.makeCall(calleeNum, isVideoCall,function(data){
		if(data.result){
			document.getElementById("callState").innerHTML = "call state: make call";
		}
	});  
}

function answerCall(accept){
	var isVideo = document.getElementById("isVideoCall").checked;
	client.answerCall(accept, isVideo);
}

function hangup(){
	if (call == null) {
		return;
	}
	client.hangup();
}


function micMute(bMute){
	var call = client.getCallHandler();
	if (call == null) {
		return;
	}
	client.micMute(bMute);

}

function DTMF(dmtfNo){
	var call = client.getCallHandler();
	if (call == null) {
		return;
	}
	client.sendDTMF(dmtfNo);
}
	
function transfer2Conf(){
	var call = client.getCallHandler();
	if (call == null) {
		return;
	}

	var memberList = document.getElementById("memberList").value;
	if(memberList!=undefined && memberList!=null && memberList!=""){
		var memberListArr = memberList.split(",");
		var memberListTemp = new Array();
		for (var i = 0; i < memberListArr.length; i++) {
			memberListTemp[i] = { number: memberListArr[i], name: "", smsPhone: "", email: "", autoInvite: 1, role: 0,extensions: "" };
		}
		transfer2ConfParam = { 
			attendees: memberListTemp, 
			language: 1, 
			isHdConf:0,
			welcomePrompt : 0,
			isMultiStreamConf : 1,
			isAutoMute : 0,
			recordMode : 0,
			enterPrompt : 0,
			groupUri : "",
			confEncryptMode : 0,
			reminder : 0,
			leavePrompt : 0,
			isAutoProlong : 1, 
		}	
	}else{
		transfer2ConfParam=null;
	}

	client.transfer2Conf(transfer2ConfParam);	
}

var playHandle;
function startPlayMedia(){
	var mediaFilePath = document.getElementById("media_file_path").value;
	client.startPlayMedia(0, mediaFilePath,function(data){
		if(data.result){
			 playHandle = data.info.playHandle;
		}
	});	
}

function stopPlayMedia(){
	client.stopPlayMedia(playHandle);	
}

function addVideo(){
	var call = client.getCallHandler();
	if (call == null) {
		return;
	}

	client.switchAudioCall(false);	
}

function delVideo(){
	var call = client.getCallHandler();
	if (call == null) {
		return;
	}

	client.switchAudioCall(true);	
}

function replyAddVideo(accept){
	var call = client.getCallHandler();
	if (call == null) {
		return;
	}

	client.answerSwitch(accept);	
}

function uiSetIPTService(type){
	var forwardNumber3 = document.getElementById("forwardNumber3").value;
	var forwardNumber4 = document.getElementById("forwardNumber4").value;
	var forwardNumber5 = document.getElementById("forwardNumber5").value;
	var forwardNumber6 = document.getElementById("forwardNumber6").value;
	if (type==25 || type ==26){
        client.setIPTService(type, forwardNumber3);
    } else if (type==29 || type ==30){
        client.setIPTService(type, forwardNumber4);
    } else if (type==27 || type ==28){
        client.setIPTService(type, forwardNumber5);
    } else if (type==31 || type ==32){
        client.setIPTService(type, forwardNumber6);
    } else {
        client.setIPTService(type, 0);
    }
}

function blindTransfer(){
	var transtoNumber = document.getElementById("transtoNumber").value;
	var call = client.getCallHandler();
	if (call == null) {
		return;
	}

	client.blindTransfer(transtoNumber);
}

function getCallStatisticInfo(){
	client.getCallStatisticInfo(function(data){
		console.log("getCallStatisticInfo");
	});
}

function getShareStatisticInfo(){
	client.getShareStatisticInfo(function(data){
		console.log("getShareStatisticInfo");
	});
}

//call end

function joinInstanceConf() {
	var confTypeObj = document.getElementById("instance_conf_type");
	var confType = parseInt(confTypeObj.options[confTypeObj.selectedIndex].value);
	var attendeeInfo = document.getElementById("member_list").value;
	var isHdConfObj = document.getElementById("instance_is_HD_Conf");
	var isHdConf =  parseInt(isHdConfObj.options[isHdConfObj.selectedIndex].value);
	var array = attendeeInfo.split(",");
	var attendees = new Array();
	for (var i = 0; i < array.length; i++) {
		attendees[i] = { number: array[i], name: "", smsPhone: "", email: "",role: 0 };
	}

	var instanceConfParam = { 
		isVideo: confType, 
		language: 1, 
		attendees: attendees,
		isHdConf:isHdConf,
	    welcomePrompt : 0,
    	isMultiStreamConf : 1,
		isAutoMute : 0,
		recordMode : 0,
		enterPrompt : 0,
		groupUri : "",
		confEncryptMode : 0,
		reminder : 0,
		leavePrompt : 0,
		isAutoProlong : 1, 
	}

	client.joinInstanceConf(instanceConfParam, function callback(ret) {});

}

function logout() {
	alert("hi i am going now!")
	client.logout();
	//change UI to login
	document.getElementById("login").style.display = "block";
	document.getElementById("call").style.display = "none";
}

function accessReservedConf() {
	var conferenceId = document.getElementById("conferenceId").value;
	var accessNumber = document.getElementById("accessNumber").value;
	var confPasswd = document.getElementById("confPasswd").value;

	var joinConfParam = {
		conferenceId: conferenceId,
		accessNumber: accessNumber,
		confPasswd: confPasswd
	}

	client.joinConference(joinConfParam, function callback(evt) {
		console.info("join conference callback")
	});
	confPasswd = "";
	joinConfParam = "";
}

function joinAnonymousConf() {
	var anonyServerAddress = document.getElementById("anony_svr_addr").value;
	var anonyServerPort = document.getElementById("anony_svr_port").value;
	var anonyConfId = document.getElementById("anony_conf_id").value;
	var anonyConfPasswd = document.getElementById("anony_passwd").value;
	var displayName = document.getElementById("anony_display_name").value;	

	if (document.getElementById("setProxy_Select_anony").checked)
	{
		var proxyAddress = document.getElementById("proxy_addr_anony").value;
		var proxyPort = document.getElementById("proxy_port_anony").value;
		var proxyAccount = document.getElementById("proxy_account_anony").value;
		var proxyPassword = document.getElementById("proxy_pwd_anony").value;

		var proxyParam = {
			proxyAddress:proxyAddress,
			proxyPort:proxyPort,
			proxyAccount:proxyAccount,
			proxyPassword:proxyPassword
		}
	}

	var anonymousConfParam = {
		confId: anonyConfId,		
		confPasswd: anonyConfPasswd,
		displayName: displayName
	}

	var serverInfo = {
		serverAddress: anonyServerAddress,
		serverPort: parseInt(anonyServerPort),
		extensions: JSON.stringify(proxyParam)
	}

	client.joinAnonymousConf(anonymousConfParam, serverInfo, function callback(evt) {
		console.info("join anonymous conference callback")
	});
	anonyConfPasswd = "";
	anonymousConfParam = "";
}

function setConfNativeWndSize() {
	var width = parseInt(document.getElementById("nativeWnd_width").value);
	var height = parseInt(document.getElementById("nativeWnd_height").value);
	var xOffsetRate = parseInt(document.getElementById("nativeWnd_xOffsetRate").value);
	var yOffsetRate = parseInt(document.getElementById("nativeWnd_yOffsetRate").value);

	var nativeWndParam = {
		width: width, 
		height: height,
		xOffsetRate: xOffsetRate,
		yOffsetRate: yOffsetRate
	};
	client.resetNativeWndSize(nativeWndParam);	
}

function setConfNativeWndSmall() {
	var wndSizeParam = {
		width : 480,
		height : 352,
		yOffsetRate : 0,
		xOffsetRate : 0,
	}
	client.resetNativeWndSize(wndSizeParam, (data)=>{});	
}

function setConfNativeWndMedium() {
	var wndSizeParam = {
		width : 720,
		height : 480,
		yOffsetRate : 0,
		xOffsetRate : 0,
	}
	client.resetNativeWndSize(wndSizeParam, (data)=>{});	
}

function setConfNativeWndLarge() {
	var wndSizeParam = {
		width : 1080,
		height : 720,
		yOffsetRate : 0,
		xOffsetRate : 0,
	}
	client.resetNativeWndSize(wndSizeParam, (data)=>{});	
}

function setConfNativeWndPosition() {
	var uiWndLeftTopX = document.getElementById("ui_window_left_top_x").value;
	var uiWndLeftTopY = document.getElementById("ui_window_left_top_y").value;
	var wndSizeAbsPosParam = {
		width : 0,
		height : 0,
		leftTopX : parseInt(uiWndLeftTopX),
		leftTopY : parseInt(uiWndLeftTopY),
	}
	client.uiPluginSetWindowSizeAbsolutePos(wndSizeAbsPosParam, (data)=>{});	
}

//UI plugin
function uiPluginShowSmallWindow() {
	client.uiPluginShowSmallWindow((data)=>{});	
}

function uiPluginShowAnnotationTool() {
	client.uiPluginShowAnnotationTool((data)=>{});	
}

function uiPluginSetWindowTitle() {
	var uiWndTitle = document.getElementById("ui_window_title").value;
	client.uiPluginSetWindowTitle(uiWndTitle,(data)=>{});	
}

function uiPluginShowVideoWindow() {
	client.uiPluginShowVideoWindow((data)=>{});	
}
