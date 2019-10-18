echo off
rem sc delete tup_service_d
::sc delete tup_service_d
taskkill /f /t /im CloudLinkMeetingDaemon.exe
taskkill /f /t /im CloudLinkMeetingService.exe
taskkill /f /t /im tsdk_attach_agent.exe