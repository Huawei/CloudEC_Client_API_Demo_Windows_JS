"use strict";
(function(root) {
    var isNochairSharing = 0;
    var isPluginClickShare = 0;
    var listeners = {   
        //1 This callback is used to handle kick out of login scenes
        onForceUnReg: function(ret) {
            if(ret.info.serviceAccountType==0){
                var confStatus = client.getConfHandler();
                if(confStatus){
                    client.leaveConf();
                }
                client.logout(); 
                alert("you have be kickouted" +  JSON.stringify(ret))
                document.getElementById("login").style.display = "block";
                document.getElementById("call").style.display = "none";
            }
        },

        //2 This callback is used to process text messages
        onChatRecvMsg: function(ret) {
            if (ret.result) {
                cloudecReceiveMsg(ret.info);
            }
        },

        //3 This callback is used to process the participant list refresh
        onUpdateAttendeeList: function(ret) {
            if (ret.result) {
                var event = new Event('cloudec:getAttendeeList');
                document.getElementById("cloudec_attendeelist_div").dispatchEvent(event);
            }
        },

        //4 This callback is used to handle speaker notifications
        onSpeakerIdentify: function(ret) {
            if (ret.result) {
                cloudecSpeaker(ret.info);
            }
        },
        //5 This callback is used to handle invitation sharing
        onSharedInComing: function(ret) {
            if(isNochairSharing==0){
                var con_ret = confirm("You have a sharing invitation,reject or accept?");
                if (con_ret == true) {
                    client.answerScreenSharing(true);
                } else {
                    client.answerScreenSharing(false);
                }
            }else{
                client.answerScreenSharing(true);
            }
        },
        //6 This callback is used to handle meeting invitation
        onConfIncoming: function(ret) {
            var confIncomingInfo = ret.info;
            var con_ret;
            if(confIncomingInfo.subject!=""){
                con_ret = confirm("You have a "+confIncomingInfo.subject+" conference, reject or accept?");
            }else{
                con_ret = confirm(confIncomingInfo.number+"invites you to join the conference, reject or accept?");
            }
            
            if (con_ret === true) {
                client.answerConference(true)
            } else {
                client.answerConference(false)
            }
        },
        //7 This callback is used to handle the conference connection
        onConfConnected: function(ret) {
            document.getElementById("callState").innerHTML = "call state: Not Update Yet";
        },
        //8 This callback is used to handle exceptions
        onError: function(ret) {
            if (390000003 == ret.info.errorCode) {
                console.warn("Memory usage over 80%, please close the unrelated program.");
            } else {
                alert(JSON.stringify(ret));
            }
        },

        //9 This callback is used to handle meeting departure events
        onLeaveConference: function(ret) {
            if (ret.result) {
                var clearAttendeeEvent = new Event('cloudec:clearAttendeeList');
                document.getElementById("cloudec_attendeelist_div").dispatchEvent(clearAttendeeEvent);
                var clearChatListEvent = new Event('cloudec:clearChatList');
                document.getElementById("cloudec_chat_display_div").dispatchEvent(clearChatListEvent);
                alert("The meeting has already left")
            }
        },

        //10 This callback is used to handle meeting hang-up events
        onEndConference: function(ret) {
            if (ret.result) {
                var clearAttendeeEvent = new Event('cloudec:clearAttendeeList');
                document.getElementById("cloudec_attendeelist_div").dispatchEvent(clearAttendeeEvent);
                var clearChatListEvent = new Event('cloudec:clearChatList');
                document.getElementById("cloudec_chat_display_div").dispatchEvent(clearChatListEvent);
                alert("the conference is ended")
            }
        },

        //11 This callback is used to apply for remote control
        onAsOnPrivilege: function(ret) {
            if (ret.info.sharePrivilegeType == 0) {
                switch (ret.info.shareAction) {
                    case 0:
                        alert("share permissions are released ");
                        break;
                    case 1:
                        alert("share permissions are added ");
                        break;
                    case 2:
                        alert("share permissions are modified  ");
                        break;
                    case 3:
                        var privilegeRet = confirm("The other person requests control of your computer,reject or accept?");
                        if (privilegeRet == true) {
                            client.answerRemoteCtrl(ret.info.attendee, true);
                        } else {
                            client.answerRemoteCtrl(ret.info.attendee, false);
                        }
                        break;
                    case 4:
                        alert("share permission request is denied ");
                        break;
                    default:
                }
            }
        },

        //11 This callback is used to handle screen sharing
        onAsOnSharingState: function(ret) {
            if (ret.info.state == 0)
            {
                isNochairSharing=0;
            }            
        },

        //12 This callback is used to handle call incoming
        onCallIncomming: function(ret) {
            if(ret.result){
                var callerNum = document.getElementById("caller_num");
                callerNum.value = ret.info.callNo;
                if(ret.info.callType){
                    document.getElementById("callState").innerHTML = "call state: video call";
                }else{
                    document.getElementById("callState").innerHTML = "call state: audio call";
                }

                var con_ret = confirm("You have a call,reject or accept?");
                if (con_ret == true) {
                    client.answerCall(true, ret.info.isVideo);
                } else {
                    client.answerCall(false, ret.info.isVideo);
                }
            }
        },

        //13 This callback is used to handle call ringing 
        onCallRingBack: function(ret) {
            //alert("the call is ring...." + ret)
            document.getElementById("callState").innerHTML = "call state: call ring back";
            console.info("the call is ring")
        },

        //14 This callback is used to handle  
        onEvtCallRtpCreated: function(ret) {
            console.info("call timeout")
        },

        //15 This callback is used to handle call connection
        onCallConnected: function(ret) {
            //alert("the call is connected" + ret)
            document.getElementById("callState").innerHTML = "call state: call connected";
            console.info("the call is connected")
                //call.
        },

        //16 This callback is used to handle a call hangup 
        onCallEnded: function(ret) {
            //alert("the call is ended" + ret)
            document.getElementById("callState").innerHTML = "call state: Not Update Yet";
            console.info("the call is ended")
        },

        //17 This callback is used to add a video
        onAddVideoRequest: function(ret){
            if(ret.result){
                alert("onAddVideoRequest");
            }
        },

        //18 This callback is used to delete a video
        onDelVideoRequest: function(ret){
            if(ret.result){
                alert("onDelVideoRequest");
            }       
        },

        //19 This callback is used to handle video modification results
        onCallModifyVideoResult: function(ret){
            if(ret.result){
                alert("onCallModifyVideoResult:"+ JSON.stringify(ret));
            }        
        },

        onNewServiceRight:function(ret){
            if(ret.result){
                if(ret.info.dnd.register==1){
                    var regDND = document.getElementById("regDND");
                    regDND.checked = "checked";
                }else{
                    var deregDND = document.getElementById("deregDND");
                    deregDND.checked = "checked";
                }

                if(ret.info.callWait.register==1){
                    var regWait = document.getElementById("regWait");
                    regWait.checked = "checked";
                }else{
                    var deregWait = document.getElementById("deregWait");
                    deregWait.checked = "checked";
                }

                if(ret.info.cfu.register==1){
                    var reguncondition = document.getElementById("reguncondition");
                    reguncondition.checked = "checked";
                }else{
                    var unreguncondition = document.getElementById("unreguncondition");
                    unreguncondition.checked = "checked";
                }

                if(ret.info.cfb.register==1){
                    var regbusy = document.getElementById("regbusy");
                    regbusy.checked = "checked";
                }else{
                    var deregbusy = document.getElementById("deregbusy");
                    deregbusy.checked = "checked";
                }

                if(ret.info.cfn.register==1){
                    var regnoReply = document.getElementById("regnoReply");
                    regnoReply.checked = "checked";
                }else{
                    var deregnoReply = document.getElementById("deregnoReply");
                    deregnoReply.checked = "checked";
                }

                if(ret.info.cfo.register==1){
                    var regoffline = document.getElementById("regoffline");
                    regoffline.checked = "checked";
                }else{
                    var deregoffline = document.getElementById("deregoffline");
                    deregoffline.checked = "checked";
                }
            }
        },

        onSetIptServiceResult:function(ret){
            alert("onSetIptServiceResult:"+ JSON.stringify(ret));       
        },

        onCallBldTransferRecvSucRsp:function(ret){
            alert("onCallBldTransferRecvSucRsp:"+ JSON.stringify(ret));                   
        },
        
        onCallBldTransferResult:function(ret){
            alert("onCallBldTransferResult:"+ JSON.stringify(ret));                       
        },
        
        onPluginEvtClickHangupCall:function(ret){
            var call = client.getCallHandler();
            if (call == null) {
                return;
            }
            client.hangup();       
        },

        onEvtGetDataconfParamResult:function(ret){
            if(ret.result){
                client.joinDataConference();       
            }else{
            }
        },

        onPluginEvtClickMuteMic:function(ret){ 
            console.log("onPluginEvtClickMuteMic:"+ JSON.stringify(ret));           
        },

        onPluginEvtClickMuteSpeaker:function(ret){ 
            console.log("onPluginEvtClickMuteSpeaker:"+ JSON.stringify(ret));          
        },

        onPluginEvtClickMuteCamera:function(ret){
            console.log("onPluginEvtClickMuteCamera:"+ JSON.stringify(ret));             
        },

        onPluginEvtClickAddMember:function(ret){
            client.uiPluginSetButtonState(3,1,(ret) => {});
            var transfer2ConfParam = null;
            var memberList=prompt("Please enter the invitee number","")

            if(ret.info.videoType == 0){
                if(memberList!=undefined && memberList!=null && memberList!=""){
                    var memberListArr = memberList.split(",");
                    var memberListTemp = new Array();
                    for (var i = 0; i < memberListArr.length; i++) {
                        memberListTemp[i] = { number: memberListArr[i], name: "", smsPhone: "", email: "", autoInvite: 1, role: 0,extensions: "" };
                    }
                    transfer2ConfParam = { attendees: memberListTemp }	
                }else{
                    transfer2ConfParam=null;
                }
                client.transfer2Conf(transfer2ConfParam);	
            }else{
                if(memberList!=undefined && memberList!=null && memberList!=""){
                    var cloudecAttendeesArray = memberList.split(",");
                    var cloudecAttendees = new Array();
                    for (var i = 0; i < cloudecAttendeesArray.length; i++) {
                        cloudecAttendees[i] = { number: cloudecAttendeesArray[i], name: cloudecAttendeesArray[i], role: 0 };
                    }
            
                    client.addAttendee(cloudecAttendees);
                }else{
                    console.log("attendee number is empty");       
                    return;
                }
            }
            

        }, 

        onPluginEvtSetWindowSize:function(ret){
            console.log("onPluginEvtSetWindowSize:"+ JSON.stringify(ret));        
        },        
        
        onPluginEvtClickLeaveConf:function(ret){
            client.leaveConf();    
        },
        
        onPluginEvtClickEndConf:function(ret){
            client.endConf();             
        }, 

        onPluginEvtClickShowMemberList:function(ret){
            client.uiPluginSetButtonState(4,1,(ret) => {});
            console.log("onPluginEvtClickShowMemberList:"+ JSON.stringify(ret));  
        },   
        
        onPluginEvtConfCtrlOperation:function(ret){
            console.log("onPluginEvtConfCtrlOperation:"+ JSON.stringify(ret));        
        },  

        onPluginEvtClickStartShare:function(ret){
            if(ret.info.videoType == 0){
                console.log("onPluginEvtClickStartShare on call");	         
                isPluginClickShare = 0;
                client.transfer2Conf(null);	
            }else{
                console.log("onPluginEvtClickStartShare on data conf"); 
                client.getAttendeeList(function (ret){
                    if(ret){
                        var attendeeList = new Array();
                        attendeeList = ret.info;
                        for(var i=0;i<attendeeList.length;i++){
                            var member = attendeeList[i];
                            if(member.isSelf==1 && member.role==1){
                                client.startScreenSharing(member.number,"");
                            }else if(member.isSelf==1 && member.role!=1){
                                isNochairSharing=1;
                                client.startScreenSharing(member.number,"");
                            }
                        }

                    }
                });
            }
            console.log("onPluginEvtClickStartShare:"+ JSON.stringify(ret));        
        },  
        
        onPluginEvtClickStopShare:function(ret){
            console.log("onPluginEvtClickStopShare:"+ JSON.stringify(ret));        
        },          
        
        onPluginEvtClickRequestRemoteControl:function(ret){
            console.log("onPluginEvtClickRequestRemoteControl:"+ JSON.stringify(ret));        
        },  

        onPluginEvtClickReleaseRemoteControl:function(ret){
            var number=prompt("Please enter the number","");
            if(number!=undefined && number!=null && number!=""){
                client.setRemoteCtrl(1, 0, number);
            }else{
  
            }
            console.log("OnPluginEvtClickReleaseRemoteControl:"+ JSON.stringify(ret));        
        }, 

        onEvtConfctrlOperationResult:function(ret){
            console.log("onEvtConfctrlOperationResult:"+ JSON.stringify(ret));    
        }, 

        onPluginEvtClickDevicesSetting:function(ret){
            alert("Please start setting up the video and video settings you need.");
        }, 

        onEvtModifyPasswordResult:function(ret){
            if(ret.info.reasonCode==0){
                alert("password has been updated.");
            }else{
                alert("modify password failed >>>errorCode:" + ret.info.reasonCode + "errorInfo:" + ret.info.reasonDescription)
            }
        }, 
        onEvtStatisticInfo:function(ret){
            console.log("onEvtStatisticInfo");    
        },        
        
        onEvtSvcWatchInfoInd:function(ret){
            console.log("onEvtSvcWatchInfoInd");    
        },  

        onEvtJoinDataConfResult:function(ret){
            if(isPluginClickShare==1 && ret.result==0){
                isPluginClickShare = 0;
                client.getAttendeeList(function (ret){
                    if(ret){
                        var attendeeList = new Array();
                        attendeeList = ret.info;
                        for(var i=0;i<attendeeList.length;i++){
                            var member = attendeeList[i];
                            if(member.isSelf==1 && member.role==1){
                                client.startScreenSharing(member.number,"");
                            }
                        }
                    }
                });
            } else{
                isPluginClickShare = 0;
            }
        },  

        OnEvtGetTempUserResult:function(ret) {
            if(ret.param.reasonCode!=0){
                alert("Join conference anonymously failed.");
            }
        },

        OnEvtRequestConfRightFailed:function(ret) {
            console.log("Request conference right failed.");    
        },

        OnEvtMediaErrorInfo:function(ret) {
            console.log("OnEvtMediaErrorInfo"+ JSON.stringify(ret));
        },

        OnEndConferenceResult:function(ret) {
            console.log("OnEndConferenceResult"+ JSON.stringify(ret));
        },
    }

    root.client = cloudEC.createClient(listeners);

})(this);