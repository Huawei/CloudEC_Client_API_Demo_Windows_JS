/**
 * [en]This function is used to get description of server exception
 * [cn]获取服务器返回错误描述
 */
function GetSvrExcepDesp(exception)
{
    return "<li><p>[time] " + exception.time + "<br>[type] server returned error <br>[description] " 
    + serverJson[exception.stage][exception.reason.toString()]["desp"] + "<br>[solution] " 
    + serverJson[exception.stage][exception.reason.toString()]["howtofix"] + " </p></li>"
}

/**
 * [en]This function is used to get description of null param exception 
 * [cn]获取参数为空异常描述
 */
function GetNullExcepDesp(exception)
{
    return "<li><p>[time] " + exception.time 
    + "<br>[type] parameter exception <br>[description](" + exception["function"] + ")is illegal，parameter(" + exception.param + ")is null!</p></li>"
}

/**
 * [en]This function is used to get description of param over range
 * [cn]获取参数超范围异常描述
 */
function GetRangeExcepDesp(exception)
{
    return "<li><p>[time] " + exception.time 
    + "<br>[type] parameter exception <br>[description] (" + exception["function"] + ")is illegal，parameter(" + exception.param + ")is not in range (" + exception.range + ")!</p></li>"
}

/**
 * [en]This function is used to get description of illegal param
 * [cn]获取入参不合法异常描述
 */
function GetInterfaceExcepDesp(exception)
{
    return "<li><p>[time] " + exception.time 
    + "<br>[type] parameter exception <br>[description] (" + exception["function"] + ")is illegal，parameter(" + exception.param + ")" 
    + interfaceJson[exception["module"]][exception.code] + "！</p></li>"
}

/**
 * [en]This function is used to get description of module exception
 * [cn]获取模块异常描述
 */
function GetComponentExcepDesp(exception)
{
    return "<li><p>[time] " + exception.time 
    + "<br>[type] internal erroe in the module<br>[description] moudle(" + exception["module"] + ")is error," 
    + componentJson[exception["module"]][exception.code] + "!</p></li>"
}

/**
 * [en]This function is used to get description of return error
 * [cn]获取接口返回错误
 */
function GetReturnErrDesp(exception)
{
    return "<li><p>[time] " + exception.time 
    + "<br>[type] interface returned error <br>[description] interface(" + exception["function"] + ") is error," 
    + returnJson[exception["module"]][exception.code] + "!</p></li>"
}

/**
 * [en]This function is used to get exception type
 * [cn]获取异常类型
 */
function GetExceptionDesp(exception)
{
    switch(exception.type)
    {
    case 0:
        return GetNullExcepDesp(exception)
    case 1:
        return GetRangeExcepDesp(exception)
    case 2:
        return GetSvrExcepDesp(exception)
    case 3:
        return GetComponentExcepDesp(exception)
    case 4:
        return GetInterfaceExcepDesp(exception)
    case 5:
        return GetReturnErrDesp(exception)
    }
}

// function AutoRefresh()
// {
//     window.location.reload();
// }

// var autoRefreshTimer
var serverJson
var componentJson
var interfaceJson
var returnJson

/**
 * [en]This function is used to connect channal between exception and service
 * [cn]连接异常描述与业务的通道
 */
function ConnectExceptionChannal()
{
    var wsocket = new WebSocket("ws://localhost:7684", "tup_exception_protocol");
    $.getJSON("json/server_exception.json",function(json){
        console.log("load server exceptions description success")
        serverJson = json
    });
    $.getJSON("json/interface_exception.json",function(json){
        console.log("load interface exceptions description success")
        interfaceJson = json
    });
    $.getJSON("json/component_exception.json",function(json){
        console.log("load component exceptions description success")
        componentJson = json
    });
    $.getJSON("json/return_errors.json",function(json){
        console.log("load interface return error description success")
        returnJson = json
    });

    wsocket.onopen = function()
    {
        console.log("the exception channel is open");
        // if (autoRefreshTimer)
        //     clearTimer(autoRefreshTimer)
        $('#exceptionConnection').attr("style", "background-color:green;border:none; width:70px; text-align: center;")
        $('#exceptionConnection').val("online");
    }
    wsocket.onmessage = function(msg)
    {
        var data = JSON.parse(msg.data);
        console.log(msg.data);
        // var exceptions = document.getElementById("exceptionList")
        // exceptions.innerHTML = exceptions.innerHTML + GetExceptionDesp(data)
        $("#exceptionList").append(GetExceptionDesp(data))
    };
    wsocket.onclose = function()
    {
        console.log("the exception channel is close");
        // autoRefreshTimer = setTimeout('AutoRefresh()',10000)
        $('#exceptionConnection').attr("style", "background-color:red;border:none; width:70px; text-align: center;")
        $('#exceptionConnection').val("offline");
    }
}

$(document).ready(function(){
    $("#parseLog").click(function(){
        var files = $('input[name="fileTrans"]').prop('files');//Get to file list
        if(files.length == 0){
            alert('Please select a file');
            return;
        }else{
            var reader = new FileReader();
            reader.readAsText(files[0], "UTF-8");//Read file 
            reader.onload = function(evt){ //After reading the file will come back here
                var fileString = evt.target.result;
                var lines = fileString.split("\r\n")
                
                for (var line in lines) {
                    if (lines.hasOwnProperty(line)) {
                        var element = lines[line];
                        try {
                            var singleE = JSON.parse(element);
                            $("#exceptionList").append(GetExceptionDesp(singleE))
                        } catch (error) {
                            
                        }
                        
                    }
                }
            }
        }
    });

    $(".file").on("change","input[type='file']",function(){
        var filePath=$(this).val();
        $(".fileerrorTip").html("").hide();
        var arr=filePath.split('\\');
        var fileName=arr[arr.length-1];
        $("#fileFullPath").val("choose file：" + filePath)
    });
});


