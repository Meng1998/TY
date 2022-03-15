echo off
cd %nginx_home%


	echo "nginx is not running, starting"
	start "" MapNginx.exe
	echo "start ok"