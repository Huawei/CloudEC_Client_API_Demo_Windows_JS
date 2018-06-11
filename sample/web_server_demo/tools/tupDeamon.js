// universal module definition
/**
 * [en]This module is about protocol registration
 * [cn]协议注册模块
 */
(function (root, factory)
{
    if (typeof define === 'function' && define.amd)
    {
        // AMD. Register as an anonymous module.
        define([], factory);
    }
    else if (typeof exports === 'object')
    {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    }
    else
    {
        // Browser globals (root is window)
        root.TUPDeamon = factory();
    }
}
(this, function ()
{
    function TUPDeamon(opts)
    {
        this.notifyFuncs = new Array();
        this.rspFuncs = new Array();
        var serviceAddr = opts.svrAddr || "127.0.0.1";
        this.wsocket = new WebSocket("ws://" + serviceAddr + ":7682", "protocol_ws_deamon_service");
        this.wsocket.onopen = opts.ready;
        this.wsocket.onclose = opts.close;
        this.wsocket.onmessage = function(msg)
        {
            var data = JSON.parse(msg.data);
            console.log(msg.data);
            data.notify = data.notify & 0x7fff;
            if (data.notify > 0)
            {
                if(typeof this.notifyFuncs[data.notify] == "function")
                {
                    this.notifyFuncs[data.notify](data);
                }
            }
            if(data.rsp > 0)
            {
                var rspIdx = data.rsp & 0x7fff;
                if(typeof this.rspFuncs[rspIdx] == "function")
                {
                    this.rspFuncs[rspIdx](data);
                }
            }
        }.bind(this);
    };

    TUPDeamon.prototype.sendData = function (data)
    {
        var sendStr = JSON.stringify(data);
        this.wsocket.send(sendStr);
    };  
    
    TUPDeamon.prototype.setSeviceCallBack = function (callbacks)
    {
        if (callbacks && typeof callbacks.serviceStartUp == "function") 
        {
            this.notifyFuncs[1] = callbacks.serviceStartUp;
        }
        if (callbacks && typeof callbacks.serviceShutDown == "function") 
        {
            this.notifyFuncs[2] = callbacks.serviceShutDown;
        }
        if (callbacks && typeof callbacks.serviceRecover == "function") 
        {
            this.notifyFuncs[3] = callbacks.serviceRecover;
        }
    };  
	
    return TUPDeamon;
}));
