echo off

set start_service=1
set resource_path=%appdata%\CloudLinkMeetingDeamon
set log_path=%appdata%\CloudLinkMeetingDeamon\log
set paths=%~dp0

if %start_service%==0 (
	echo tup_service_bat is not allow to create service
	goto END
)

if NOT EXIST %resource_path% (
	mkdir %resource_path%
)
 
if NOT EXIST %log_path% (
	mkdir %log_path%
)


::sc config tup_service_d start= auto
::net start tup_service_d
start "" "%paths%CloudLinkMeetingDeamon.exe" --ssl  --resource_path="%appdata%\CloudLinkMeetingDeamon/" --log_path="%appdata%\CloudLinkMeetingDeamon\log/" --cert_file="%paths%server.pem" --key_file="%paths%server.key" --ws_port=7684

