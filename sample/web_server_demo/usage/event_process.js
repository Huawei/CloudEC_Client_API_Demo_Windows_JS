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
            console.error(JSON.stringify(ret))
            if (390000003 == ret.info.errorCode) {
                console.warn(JSON.stringify(ret));
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
            console.info("the conference is ring" + JSON.stringify(ret))
        },

        //14 This callback is used to handle call connection
        onCallConnected: function(ret) {
            //alert("the call is connected" + ret)
            document.getElementById("callState").innerHTML = "call state: call connected";
            console.info("the call is connected" + JSON.stringify(ret))
                //call.
        },

        //15 This callback is used to handle a call hangup 
        onCallEnded: function(ret) {
            //alert("the call is ended" + ret)
            document.getElementById("callState").innerHTML = "call state: Not Update Yet";
            console.info("the call is ended" + JSON.stringify(ret))
        },

        //16 This callback is used to add a video
        onAddVideoRequest: function(ret){
            if(ret.result){
                alert("onAddVideoRequest:"+ ret.info);
            }
        },

        //17 This callback is used to delete a video
        onDelVideoRequest: function(ret){
            if(ret.result){
                alert("onDelVideoRequest:"+ ret.info);
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

    }

    root.client = cloudEC.createClient(listeners);

})(this);