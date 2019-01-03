"use strict";
(function(root) {
    var listeners = {
        //1 This callback is used to handle kick out of login scenes
        onForceUnReg: function(ret) {
            alert("you have be kickouted" +  JSON.stringify(ret))
            document.getElementById("login").style.display = "block";
            document.getElementById("call").style.display = "none";
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
            var con_ret = confirm("You have a sharing invitation,reject or accept?");
            if (con_ret == true) {
                client.answerScreenSharing(true);
            } else {
                client.answerScreenSharing(false);
            }
        },
        //6 This callback is used to handle meeting invitation
        onConfIncoming: function(ret) {
            var con_ret = confirm("You have a incoming conference, reject or accept?");
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
            if (ret.info.sharePrivilege == 1) {
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
                            client.answerRemoteCtrl(ret.info.userid, true);
                        } else {
                            client.answerRemoteCtrl(ret.info.userid, false);
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

        },

        //12 This callback is used to handle call incoming
        onCallIncomming: function(ret) {
            if(ret.result){
                alert("you have a incoming call");
                var callerNum = document.getElementById("caller_num");
                callerNum.value = ret.info.callNo;
                if(ret.info.callType){
                    document.getElementById("callState").innerHTML = "call state: video call";
                }else{
                    document.getElementById("callState").innerHTML = "call state: audio call";
                }
            }
        },

        //13 This callback is used to handle call ringing 
        onCallRingBack: function(ret) {
            //alert("the call is ring...." + ret)
            document.getElementById("callState").innerHTML = "call state: call ring back";
            console.info("the conference is ring")
        },

        //14 This callback is used to handle call connection
        onCallConnected: function(ret) {
            //alert("the call is connected" + ret)
            document.getElementById("callState").innerHTML = "call state: call connected";
            console.info("the call is connected")
                //call.
        },

        //15 This callback is used to handle a call hangup 
        onCallEnded: function(ret) {
            //alert("the call is ended" + ret)
            document.getElementById("callState").innerHTML = "call state: Not Update Yet";
            console.info("the call is ended")
        },

        //16 This callback is used to add a video
        onAddVideoRequest: function(ret){
            if(ret.result){
                alert("onAddVideoRequest:");
            }
        },

        //17 This callback is used to delete a video
        onDelVideoRequest: function(ret){
            if(ret.result){
                alert("onDelVideoRequest:");
            }       
        },

        //18 This callback is used to handle video modification results
        onCallModifyVideoResult: function(ret){
            if(ret.result){
                alert("onCallModifyVideoResult:"+ ret.info);
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
            alert("onSetIptServiceResult:"+ ret.info);       
        },

        onCallBldTransferRecvSucRsp:function(ret){
            alert("onCallBldTransferRecvSucRsp:"+ ret.info);                   
        },
        
        onCallBldTransferResult:function(ret){
            alert("onCallBldTransferResult:"+ ret.info);                       
        },

        onUserInfoChange:function(ret){
           var newPage = window.open("","onUserInfoChange");
           newPage.document.write("onUserInfoChange:"+JSON.stringify(ret));                        
        },

        onAddFriend:function(ret){
           var newPage = window.open("","onAddFriend");
           newPage.document.write("onAddFriend:"+JSON.stringify(ret));      
        },
        onUserStatusList:function(ret){    
            var newPage = window.open("","onUserStatusList");
            newPage.document.write("onUserStatusList:"+JSON.stringify(ret));                 
        },

        onGroupDismiss:function(ret){
            var newPage = window.open("","onGroupDismiss");
            newPage.document.write("onGroupDismiss:"+JSON.stringify(ret));                          
        },

        onGroupInfoChange:function(ret){
            var newPage = window.open("","onGroupInfoChange");
            newPage.document.write("onGroupInfoChange:"+JSON.stringify(ret));                     
        },
	
        onGroupOwnerChange:function(ret){
            var newPage = window.open("","onGroupOwnerChange");
            newPage.document.write("onGroupOwnerChange:"+JSON.stringify(ret));                      
        },

        onGroupMemberAdd:function(ret){ 
            var newPage = window.open("","onGroupMemberAdd");
            newPage.document.write("onGroupMemberAdd:"+JSON.stringify(ret));                     
        },

        onGroupMemberDel:function(ret){
            var newPage = window.open("","onGroupMemberDel");
            newPage.document.write("onGroupMemberDel:"+JSON.stringify(ret));                        
        },

        onWasAddToGroup:function(ret){ 
           var newPage = window.open("","onWasAddToGroup");
           newPage.document.write("onWasAddToGroup:"+JSON.stringify(ret));                          
        },

        onReceiveInviteJoinGroup:function(ret){
            var group_ret = confirm(ret.info.memberName + " apply to join " + ret.info.groupName +" group, accept or reject?");

            var approvalParam = {
                flag: 1,
                agreeJoin: group_ret,
                groupId: ret.info.groupID,    
                memberAccount: ret.info.memberAccount
            };

            client.approvalGroup(approvalParam, function(data){
                var newPage = window.open("","approvalGroup");
                newPage.document.write("approvalGroup:"+JSON.stringify(data));     
            });  

        },

        onReceiveInviteToGroup:function(ret) {
            var group_ret = confirm("You are invited to join " + ret.info.groupName +" group, accept or reject?");

            var approvalParam = {
                flag: 0,
                agreeJoin: group_ret,
                groupId: ret.info.groupID,    
                memberAccount: ret.info.adminAccount
            };
            client.approvalGroup(approvalParam, function(data){
                var newPage = window.open("","approvalGroup");
                newPage.document.write("approvalGroup:"+JSON.stringify(data)); 
            });	   
        },

        onGroupOwnerInviteResult:function(ret){     
            var newPage = window.open("","onGroupOwnerInviteResult");
            newPage.document.write("onGroupOwnerInviteResult:"+JSON.stringify(ret));                 
        },

        onGroupKickout:function(ret){
            var newPage = window.open("","onGroupKickout");
            newPage.document.write("onGroupKickout:"+JSON.stringify(ret));                     
        },

        onGroupLeaveResult:function(ret){
            var newPage = window.open("","onGroupLeaveResult");
            newPage.document.write("onGroupLeaveResult:"+JSON.stringify(ret));                      
        },

        onMsgSendAck:function(ret){
            var newPage = window.open("","onMsgSendAck");
            newPage.document.write("onMsgSendAck:"+JSON.stringify(ret));                   
        },

        onChatNotify:function(ret){
            var chatMessage = ret.info;
            var messageReadParam = {
                msgType:chatMessage.chatType,
                sender: chatMessage.origin, 
                msgId: chatMessage.serverChatID
            }
        
            var messageReadParamArray = new Array();
            messageReadParamArray[0] = messageReadParam;
            client.setReadMessage(messageReadParamArray, function(data){

            });	
            var newPage = window.open("","onChatNotify");
            newPage.document.write("onChatNotify:"+JSON.stringify(ret));       
            
        },

        onChatListNotify:function(ret){
            var newPage = window.open("","onChatListNotify");
            newPage.document.write("onChatListNotify:"+JSON.stringify(ret));                    
        },

        onSystemBulletin:function(ret){
            var newPage = window.open("","onSystemBulletin");
            newPage.document.write("onSystemBulletin:"+JSON.stringify(ret));                    
        },

        onUnDeliver:function(ret){
            var newPage = window.open("","onUnDeliver");
            newPage.document.write("onUnDeliver:"+JSON.stringify(ret));                      
        },

        onWithdrawResult:function(ret){    
            var newPage = window.open("","onWithdrawResult");
            newPage.document.write("onWithdrawResult:"+JSON.stringify(ret));                  
        },

        onWithdrawNotify:function(ret){   
            var newPage = window.open("","onWithdrawNotify");
            newPage.document.write("onWithdrawNotify:"+JSON.stringify(ret));                    
        },

        onSendImInput:function(ret){
            var newPage = window.open("","onSendImInput");
            newPage.document.write("onSendImInput:"+JSON.stringify(ret));                      
        },
    }

    root.client = cloudEC.createClient(listeners);

})(this);