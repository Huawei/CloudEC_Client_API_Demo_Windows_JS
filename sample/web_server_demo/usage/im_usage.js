/* im test */
function getContactList(){
	client.getContactlist(true, "19000000000000", function(data){
        // alert(JSON.stringify(data));
        var newPage = window.open("");
        newPage.document.write(JSON.stringify(data));
	});	
}

function addContactGroup(){
    var contactGroupName = document.getElementById("contactGroupNameForAdd").value;
	client.addContactGroup( contactGroupName,-1, function(data){
		alert(JSON.stringify(data));
	});	
}

function modContactGroup(){
    var contactGroupID = document.getElementById("contactGroupIDForMod").value;
    var contactGroupName = document.getElementById("contactGroupNameForMod").value;
    var contactGroupIndex = document.getElementById("contactGroupIndexForMod").value;
    contactGroupIndex = Number(contactGroupIndex);
    contactGroupID = Number(contactGroupID);
	client.modContactGroup(contactGroupID,contactGroupName, contactGroupIndex,function(data){
		alert(JSON.stringify(data));
	});	
}

function delContactGroup(){
    var contactGroupID = document.getElementById("contactGroupIDForDel").value;
    contactGroupID = Number(contactGroupID);
	client.delContactGroup(contactGroupID, function(data){
		alert(JSON.stringify(data));
	});	
}

function updateGroupListOrder(){
    var contactGroupIDs = document.getElementById("contactGroupIDs").value;
    contactGroupIDs = contactGroupIDs.split(",");
    var contactGroupIDArr = new Array();
    for(i=0;(contactGroupIDs!=NaN) && i<contactGroupIDs.length;i++){
        contactGroupIDArr[i] = Number(contactGroupIDs[i]);
    }
	client.updateGroupListOrder(contactGroupIDs, function(data){
		alert(JSON.stringify(data));
	});	
}

function moveContact(){
    var contactID = document.getElementById("contactIDForMove").value;
    var oldGroupID = document.getElementById("oldGroupID").value;
    var newGroupID = document.getElementById("newGroupID").value;
    var moveTypeObj = document.getElementById("moveType");
	var type = moveTypeObj.options[moveTypeObj.selectedIndex].value;
    contactID = Number(contactID);
    oldGroupID = Number(oldGroupID);
    newGroupID = Number(newGroupID);
    type = Number(type);
	client.moveContact(contactID, oldGroupID, newGroupID, type, function(data){
		alert(JSON.stringify(data));
	});	
}

function addContact(){
    var contactName = document.getElementById("contactNameByAdd").value;
    var contactForeignName = document.getElementById("contactForeignNameByAdd").value;
    var contactGroupID = document.getElementById("contactGroupIDByAdd").value;
    var contactMobile = document.getElementById("contactMobileByAdd").value;
    var contactInfo = {
        id: 99,
        staffID: "",
        name: contactName,
        nickName: "",
        foreignName: contactForeignName,
        birthday: "",
        gender: 2, 
        corpName: "",
        deptName: "",
        title: "",
        mobile: contactMobile, 
        officePhone: "",
        homePhone: "",
        otherPhone: "", 
        fax: "", 
        email: "", 
        webSite: "",
        imNO: "",  
        address: "", 
        desc: "", 
        postalcode: "",
        state: "",                 
        extensions: "",//option
    }
	client.addContact(contactInfo, contactGroupID === "" ? "" : Number(contactGroupID), function(data){
		alert(JSON.stringify(data));
	});	
}

function modContact(){
    var contactName = document.getElementById("contactNameByMod").value;
    var contactForeignName = document.getElementById("contactForeignNameByMod").value;
    var contactID = document.getElementById("contactIDByMod").value;
    var contactMobile = document.getElementById("contactMobileByMod").value;
    var contactInfo = {
        id: Number(contactID),
        staffID: "",
        name: contactName,
        nickName: "",
        foreignName: contactForeignName,
        birthday: "",
        gender: 2, 
        corpName: "",
        deptName: "",
        title: "",
        mobile: contactMobile, 
        officePhone: "",
        homePhone: "",
        otherPhone: "", 
        fax: "", 
        email: "", 
        webSite: "",
        imNO: "",  
        address: "", 
        desc: "", 
        postalcode: "",
        state: 0,                 
        extensions: "",//option
    }
	client.modContact(contactInfo,function(data){
		alert(JSON.stringify(data));
	});	
}

function delContact(){
    var contactID = document.getElementById("contactIDByDel").value;
    var contactGroupID = document.getElementById("contactGroupIDByDel").value;
	client.delContact(Number(contactID),Number(contactGroupID), function(data){
		alert(JSON.stringify(data));
	});	
}

function getUserInfoIm(){
	var account = document.getElementById("accountForGetUserInfo").value;
	client.getUserInfo(account, function(data){
        // alert(JSON.stringify(data));
        var newPage = window.open("");
        newPage.document.write(JSON.stringify(data));
	});	
}

function setUserInfoIm(){
    //get logined account, query user info
    var account = document.getElementById("name").value;
    var signature = document.getElementById("signatureForSetUserInfo").value;
    client.getUserInfo(account, function(data){
		if (data.result){
            var userInfoParam = {
                account: account,
                signature:signature
            };
            client.setUserInfo(userInfoParam, function(data){
                alert(JSON.stringify(data));
            });
        } else {
            alert("Set user info failed. The user is not exist");
        }
	});			
}

function addFriend(){	
	var account = document.getElementById("accountForAddFriend").value;
	var groupID = parseInt(document.getElementById("groupIDForAddFriend").value);
	var diaplaytName = document.getElementById("diaplaytNameForAddFriend").value;
	
	client.addFriend(account, groupID, diaplaytName, function(data){
		alert(JSON.stringify(data));
	});	
}

function addGroup(){	
	var name = document.getElementById("nameForGroup").value;
    var groupTypeObj = document.getElementById("groupType");
	var groupType = parseInt(groupTypeObj.options[groupTypeObj.selectedIndex].value);	
    
    var groupParam = {
        name: name, 
        groupType: groupType
    }

	client.addGroup(groupParam, function(data){
		alert(JSON.stringify(data));
	});	
}

function modGroup(){
    var groupId = document.getElementById("groupIdForEdit").value;
    var groupName = document.getElementById("groupNameForEdit").value;
    var manifesto = document.getElementById("manifestoForEdit").value;
    var desc = document.getElementById("descForEdit").value;
    client.getGroupDetail(groupId, function(data){
		if (data.result){
            var groupInfoParam = {
                id: groupId, 
                name: groupName, 
                manifesto: manifesto,
                desc: desc,
                groupType: data.info.groupType,
                owner:data.info.owner
            };
            client.modGroup(groupInfoParam, function(data){
                alert(JSON.stringify(data));
            });
        } else {
            alert("Modify group info failed. The group is not exist");
        }
	});			
}

function delGroup(){
    var groupId = document.getElementById("groupIdForDelAndDetail").value;
	client.delGroup(groupId, function(data){
		alert(JSON.stringify(data));
    });	
}

function queryGroupDetail(){
    var groupId = document.getElementById("groupIdForDelAndDetail").value;
	client.getGroupDetail(groupId, function(data){
        // alert(JSON.stringify(data));
        var newPage = window.open("");
        newPage.document.write(JSON.stringify(data));
    });	
}

function joinGroup(){
	var groupId = document.getElementById("groupIdForJoin").value;
    var account = document.getElementById("accountForJoin").value;
    var displayName = document.getElementById("displayNameForJoin").value;
    var joinTypeObj = document.getElementById("joinGroupType");
	var joinType = parseInt(joinTypeObj.options[joinTypeObj.selectedIndex].value);	
    
    var joinParam = {
        groupId: groupId,
        account: account,
        flag: joinType, 
        displayName: displayName
    }

	client.joinGroup(joinParam, function(data){
		alert(JSON.stringify(data));
	});
}

function leaveGroup(){
	var groupId = document.getElementById("groupIdForLeave").value;
    var account = document.getElementById("accountForLeave").value;
    var leaveTypeObj = document.getElementById("leaveGroupType");
	var leaveType = parseInt(leaveTypeObj.options[leaveTypeObj.selectedIndex].value);	
    
	client.leaveGroup(groupId, account, leaveType, function(data){
		alert(JSON.stringify(data));
	});
}

function queryGroupMembers(){
    var groupId = document.getElementById("groupIdForDelAndDetail").value;
	client.getGroupMembers(groupId, true,"19000000000000",function(data){
        var newPage = window.open("");
        newPage.document.write("queryGroupMembers:"+JSON.stringify(data));
    });	
}

function transferGroup(){
    var groupId = document.getElementById("groupIdForTransfer").value;
    var account = document.getElementById("accountForTransfer").value;
	client.transferGroup(groupId, account,function(data){
		alert(JSON.stringify(data));
    });	
}

function setGroupMsgPromptPolicy(){
    var groupId = document.getElementById("groupIdForMSgPolicy").value;
    var msgPolicyObj = document.getElementById("msgPolicy");
	var msgPolicy = parseInt(msgPolicyObj.options[msgPolicyObj.selectedIndex].value);	
	client.setGroupMsgPromptPolicy(groupId, msgPolicy,function(data){
		alert(JSON.stringify(data));
    });	
}

function setDisgroupPolicy(){
    var groupId = document.getElementById("groupIdForGroupPolicy").value;
    var groupPolicyObj = document.getElementById("groupPolicy");
	var groupPolicy = parseInt(groupPolicyObj.options[groupPolicyObj.selectedIndex].value);	
	client.setDisgroupPolicy(groupId, groupPolicy,function(data){
		alert(JSON.stringify(data));
    });	
}

function publishStatus(){	
    var statusObj = document.getElementById("IMUserStatus");
    var status =parseInt(statusObj.options[statusObj.selectedIndex].value);
	
	client.publishStatus(status, function(data){
		alert(JSON.stringify(data));
	});	
}

function detectUserStatus(){	
    var IMUserList = document.getElementById("IMUserList").value;
    if (IMUserList != null && IMUserList != "") {   
        var IMUserListArray = IMUserList.split(",");
        var accountList = new Array();
        for (var i = 0; i < IMUserListArray.length; i++) {
            accountList[i] =IMUserListArray[i];
        }
    }
	
	client.detectUserStatus(accountList, function(data){
		alert(JSON.stringify(data));
	});	
}

function sendIMMessage(){	
    var msgContent = document.getElementById("msgContent").value;
    var msgReceiver = document.getElementById("msgReceiver").value;
    var msgMediaTypeObj = document.getElementById("msgMediaType");
    var msgMediaType = parseInt(msgMediaTypeObj.options[msgMediaTypeObj.selectedIndex].value);	
    var msgChatTypeObj = document.getElementById("msgChatType");
    var msgChatType = parseInt(msgChatTypeObj.options[msgChatTypeObj.selectedIndex].value);	
    var msgatUserInfoList = document.getElementById("msgatUserInfoList").value;
    if (msgatUserInfoList != null && msgatUserInfoList != "") {   
        var msgatUserInfoListArr = msgatUserInfoList.split(",");
        msgatUserInfoList = msgatUserInfoListArr;
    }
    var messageSendParam = {
        chatType: msgChatType, 
        mediaType: msgMediaType, 
        clientChatID: 1,
        receiver:msgReceiver,
        content: msgContent, 
        displayName:"displayName",
        utcStamp: 1,
        atUserInfoList:msgatUserInfoList, 
        extensions: ""
    }

	client.sendIMMessage(messageSendParam, function(data){
		alert(JSON.stringify(data));
	});	
}

function notifyImInputting(){	
    var inputAccount = document.getElementById("inputAccount").value;
    var inputTypeObj = document.getElementById("inputType");
    var inputType = parseInt(inputTypeObj.options[inputTypeObj.selectedIndex].value);	

	client.notifyImInputting(inputAccount, inputType);	
}

function withDrawMessage(){	
    var withDrawReceiver = document.getElementById("withDrawReceiver").value;
    var withDrawgroupName = document.getElementById("withDrawGroupName").value;
    var withDrawOriginName = document.getElementById("withDrawOriginName").value;
    var withDrawisGroupMsgObj = document.getElementById("withDrawisGroupMsg");
    var withDrawisGroupMsg = parseInt(withDrawisGroupMsgObj.options[withDrawisGroupMsgObj.selectedIndex].value);
    var withDrawmsgId = document.getElementById("withDrawmsgId").value;

    var messageWithDrawParam = {
        receiver:withDrawReceiver, 
        isGroupMsg: withDrawisGroupMsg, 
        groupName: withDrawgroupName,
        originName:withDrawOriginName,
        msgId:withDrawmsgId, 
        extensions: ""//option  
    }

	client.withDrawMessage(messageWithDrawParam, function(data){
		alert(JSON.stringify(data));
	});	
}

function setReadMessage(){	
    var setReadMsgId = document.getElementById("setReadMsgId").value;
    var setReadSender = document.getElementById("setReadSender").value;
    var setReadMsgTypeObj = document.getElementById("setReadMsgType");
    var setReadMsgType = parseInt(setReadMsgTypeObj.options[setReadMsgTypeObj.selectedIndex].value);

    var messageReadParam = {
        msgType:setReadMsgType,
        sender: setReadSender, 
        msgId: setReadMsgId 
    }

    var messageReadParamArray = new Array();
    messageReadParamArray[0] = messageReadParam;
	
	client.setReadMessage(messageReadParamArray, function(data){
		alert(JSON.stringify(data));
	});	
}

function deleteMessage(){	
    var deleteMessageIsGroupMsgObj = document.getElementById("deleteMessageIsGroupMsg");
    var deleteMessageIsGroupMsg = parseInt(deleteMessageIsGroupMsgObj.options[deleteMessageIsGroupMsgObj.selectedIndex].value);
    var deleteMessageOptTypeObj = document.getElementById("deleteMessageOptType");
    var deleteMessageOptType =deleteMessageOptTypeObj.options[deleteMessageOptTypeObj.selectedIndex].value;
    var deleteMessageSender = document.getElementById("deleteMessageSender").value;
    var deleteMessageMsgIdList = document.getElementById("deleteMessageMsgIdList").value;
    if (deleteMessageMsgIdList != null && deleteMessageMsgIdList != "") {   
        var deleteMessageMsgIdListArr = deleteMessageMsgIdList.split(",");
        deleteMessageMsgIdList = deleteMessageMsgIdListArr;
    }

    var deleteMessageParam = {
        isGroupMsg:Number(deleteMessageIsGroupMsg), 
        sender: deleteMessageSender, 
        optType:Number(deleteMessageOptType),
        msgIdList:deleteMessageMsgIdList, 
    }

	client.deleteMessage(deleteMessageParam,function(data){
		alert(JSON.stringify(data));
	});	
}

function queryHistoryMessage(){	
    var queryMessageOpTypeObj = document.getElementById("queryMessageOpType");
    var queryMessageOpType = parseInt(queryMessageOpTypeObj.options[queryMessageOpTypeObj.selectedIndex].value);
    var queryMessageMsgTypeObj = document.getElementById("queryMessageMsgType");
    var queryMessageMsgType = parseInt(queryMessageMsgTypeObj.options[queryMessageMsgTypeObj.selectedIndex].value);
    var queryMessageSender = document.getElementById("queryMessageSender").value;
    var queryMessageMsgId = document.getElementById("queryMessageMsgId").value;

    var queryHistoryMessageParam = {
        operationType: Number(queryMessageOpType),   
        msgType : Number(queryMessageMsgType),      
        sender: queryMessageSender,         
        msgId : queryMessageMsgId,         
        count : 10,                       
    }

	client.queryHistoryMessage(queryHistoryMessageParam,function(data){
        var newPage = window.open("","queryHistoryMessage");
        newPage.document.write("queryHistoryMessage:"+JSON.stringify(data));     
	});	
}



function queryFixedGroups(){
    var condition = document.getElementById("conditionForQuery").value;    
    var searchParam = {
        isNeedAmount: true,
        offset: 0,
        count: 15,
        condition:condition,
        queryType: 2
    };
	client.searchGroup(searchParam, function(data){
        // alert(JSON.stringify(data));
        var newPage = window.open("");
        newPage.document.write(JSON.stringify(data));
    });	
}

function displayJoinAccount(type){
    if (type == 1){
        accountForJoin.style.display = "none";
    } else{
        accountForJoin.style.display = "";
    }
}

function displayLeaveAccount(type){
    if (type == 0){
        accountForLeave.style.display = "none";
    } else{
        accountForLeave.style.display = "";
    }
}