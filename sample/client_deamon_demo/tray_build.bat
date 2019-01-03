@echo off
rem --------------------------------------------
rem 	初始化编译
rem --------------------------------------------
net use \\10.184.236.179\sdk_version\Version_Of_Day gNu@BVQ5 /user:HSH1000056275\Administrator
set shareDir=\\10.184.236.179\sdk_version\Version_Of_Day\SDK\Js
set currentDir=%~dp0
cd .\tsdk_service_tray\lib
copy %shareDir%\lib\tupService.lib      .\    /y
cd ..\..\
rem --------------------------------------------
rem 	编译工程
rem --------------------------------------------
@"%VS110COMNTOOLS%\..\IDE\devenv.com" tsdk_service_tray.sln /clean
@"%VS110COMNTOOLS%\..\IDE\devenv.com" tsdk_service_tray.sln /build "release"
rem --------------------------------------------
rem 	清除无用生成文件
rem --------------------------------------------
copy .\Release\tsdk_service_tray.exe      .\bin    /y
del  /q ".\tsdk_service_tray\lib\tupService.lib" 
rmdir /s/q  .\Release
rmdir /s/q  .\tsdk_service_tray\Release
rmdir /s/q  .\tsdk_service_tray\Debug

