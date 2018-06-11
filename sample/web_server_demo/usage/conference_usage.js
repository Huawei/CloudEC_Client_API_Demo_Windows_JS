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
				document.getElementById("login").style.display = "none";
				document.getElementById("call").style.display = "block";

				//Login successful, trigger login event for conf_list.html and media_device.html
				var event = new Event('cloudec:login');
				document.getElementById("cloudec_conflist_div").dispatchEvent(event);
				event = new Event('cloudec:login');
				document.getElementById("configPanel").dispatchEvent(event);
			}

		});
}

function joinInstanceConf() {
	var conference;
	var confTypeObj = document.getElementById("instance_conf_type");
	var confType = parseInt(confTypeObj.options[confTypeObj.selectedIndex].value);
	var attendeeInfo = document.getElementById("member_list").value;
	var array = attendeeInfo.split(",");
	var attendees = new Array();
	for (var i = 0; i < array.length; i++) {
		attendees[i] = { number: array[i], name: "", smsPhone: "", email: "", autoInvite: 1, role: 0 };
	}

	var instanceConfParam = { isVideo: confType, language: 1, attendees: attendees }


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
		var conference = evt.info;
		console.info(JSON.stringify(conference))
	});
}

function joinAnonymousConf() {
	var anonyServerAddress = document.getElementById("anony_svr_addr").value;
	var anonyServerPort = document.getElementById("anony_svr_port").value;
	var anonyConfId = document.getElementById("anony_conf_id").value;
	var anonyConfPasswd = document.getElementById("anony_passwd").value;
	var callTypeObj = document.getElementById("anony_call_type");
	var anonyCallType = parseInt(callTypeObj.options[callTypeObj.selectedIndex].value);	

	var anonymousConfParam = {
		confId: anonyConfId,		
		confPasswd: anonyConfPasswd,
		callType: anonyCallType
	}

	var serverInfo = {
		serverAddress: anonyServerAddress,
		serverPort: parseInt(anonyServerPort)
	}

	client.joinAnonymousConf(anonymousConfParam, serverInfo, function callback(evt) {
		var conference = evt.info;
		console.info(JSON.stringify(conference))
	});
}