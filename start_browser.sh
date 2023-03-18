#!/bin/bash
cd Framezz-app/
pm2 start npm --name "my-app" -- start
sleep 5 # wait for server to start
/usr/bin/firefox -new-window http://localhost:3000
