echo off
rem sc delete tup_service_d
::sc delete tup_service_d
taskkill /f /t /im tsdk_service_tray.exe
taskkill /f /t /im tup_service_s.exe