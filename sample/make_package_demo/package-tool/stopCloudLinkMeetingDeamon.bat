echo off
rem sc delete tup_service_d
::sc delete tup_service_d
taskkill /f /t /im CloudLinkMeetingDeamon.exe
taskkill /f /t /im CloudMeetingService.exe