#!/bin/bash
cd Framezz-app/
pm2 start npm --name "my-app" -- start
sleep 5 # wait for server to start
DISPLAY=:0 chromium-browser http://localhost:3000
