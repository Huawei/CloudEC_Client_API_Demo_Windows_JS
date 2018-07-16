"use strict";
(function(root) {
    var options = {
        domain: "localhost.cloudec.huaweicloud.com",
        isWSS: 1,
        isTlsSupport: 0,
        isWithSBC: 1,
        dropFrame: 1,
        videoDisplayMode:1,
        nativeWindowWidth:720,
        nativeWindowHeight:480,
        nativeWindowXOffset:600,
        nativeWindowYOffset:300,
        nativeWindowXOffsetRate:50,
        nativeWindowYOffsetRate:20
    }
    cloudEC.configure(options);

})(this);