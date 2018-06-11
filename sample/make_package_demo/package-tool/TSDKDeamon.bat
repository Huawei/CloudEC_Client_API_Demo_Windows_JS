echo off

set start_service=1
set resource_path=%appdata%\TSDK
set log_path=%appdata%\TSDK\log
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


::sc create tup_service_d binPath= "\"%paths%tup_service_d.exe\" --ssl  --resource_path=\"%appdata%\TSDK/\" --log_path=\"%appdata%\TSDK\log/\" --cert_file=\"%paths%server.pem\" --key_file=\"%paths%server.key\" --winservice  "
::sc config tup_service_d start= auto
::net start tup_service_d
start "" "%paths%tsdk_service_tray.exe" --ssl  --resource_path="%appdata%\TSDK/" --log_path="%appdata%\TSDK\log/" --cert_file="%paths%server.pem" --key_file="%paths%server.key" --ws_port=7684

