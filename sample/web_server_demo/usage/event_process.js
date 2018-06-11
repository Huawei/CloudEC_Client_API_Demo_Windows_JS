"use strict";
(function (root) {
	var listeners = {
		//1 This callback is used to handle kick out of login scenes
		onForceUnReg: function (ret) {
			alert("you have be kickouted" + ret)
			document.getElementById("login").style.display = "block";
			document.getElementById("call").style.display = "none";
		},

		//2 This callback is used to process text messages
		onChatRecvMsg: function (ret) {
			if (ret.result) {
				cloudecReceiveMsg(ret.info);
			}
		},

		//3 This callback is used to process the participant list refresh
		onUpdateAttendeeList: function (ret) {
			if (ret.result) {
				var event = new Event('cloudec:getAttendeeList');
				document.getElementById("cloudec_attendeelist_div").dispatchEvent(event);
			}
		},
		
		//4 This callback is used to handle speaker notifications
		onSpeakerIdentify: function (ret) {
			if (ret.result) {
				cloudecSpeaker(ret.info);
			}
		},
		//5 This callback is used to handle invitation sharing
		onSharedInComing: function (ret) {
			var con_ret = confirm("You have a sharing invitation,reject or accept?");
			if (con_ret == true) {
				ret.info.answerScreenSharing(true);
			}
			else {
				ret.info.answerScreenSharing(false);
			}
		},
		//6 This callback is used to handle meeting invitation
		onConfIncoming: function (ret) {
			var con_ret = confirm("you have a incoming conference, accept?");
			if (con_ret === true) {
				ret.info.answerConference(true)
			} else {
				ret.info.answerConference(false)
			}
		},
		//7 This callback is used to handle the conference connection
		onConfConnected: function (ret) {
			
		},
		//8 This callback is used to handle exceptions
		onError: function (ret) {
			console.error(JSON.stringify(ret))
			if(390000003 == ret.info.errorCode){
               console.warn(JSON.stringify(ret));
			}
			else{
				alert(JSON.stringify(ret));
			}
		},

		//9 This callback is used to handle meeting departure events
		onLeaveConference: function (ret) {
			if (ret.result) {
				var clearAttendeeEvent = new Event('cloudec:clearAttendeeList');
				document.getElementById("cloudec_attendeelist_div").dispatchEvent(clearAttendeeEvent);
				var clearChatListEvent = new Event('cloudec:clearChatList');
				document.getElementById("cloudec_chat_display_div").dispatchEvent(clearChatListEvent);
				alert("The meeting has already left")
			}
		},

		//10 This callback is used to handle meeting hang-up events
		onEndConference: function (ret) {
			if (ret.result) {
				var clearAttendeeEvent = new Event('cloudec:clearAttendeeList');
				document.getElementById("cloudec_attendeelist_div").dispatchEvent(clearAttendeeEvent);
				var clearChatListEvent = new Event('cloudec:clearChatList');
				document.getElementById("cloudec_chat_display_div").dispatchEvent(clearChatListEvent);
				alert("the conference is ended")
			}
		},

		//11 This callback is used to apply for remote control
		onAsOnPrivilege: function(ret){
			var conference = client.getConfHandler();
			if(ret.info.sharePrivilege==1){			   
				switch(ret.info.shareAction){
					case 0:     alert("share permissions are released "); break;
					case 1:     alert("share permissions are added "); break;
					case 2:     alert("share permissions are modified  "); break;
					case 3:    
							    var privilegeRet = confirm("The other person requests control of your computer,reject or accept?");
								if (privilegeRet == true) {
									client.answerRemoteCtrl(ret.info.userid,true);
								}else {
									client.answerRemoteCtrl(ret.info.userid,false);
								}
					          		           
					           break;
					case 4:    alert("share permission request is denied "); break;
					default:    
				}
			}
		},

		//11 This callback is used to handle screen sharing
		onAsOnSharingState: function (ret) {

		},
	}

	root.client = cloudEC.createClient(listeners);

})(this);