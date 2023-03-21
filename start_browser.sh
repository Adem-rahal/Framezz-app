#!/bin/bash
xrandr -o 3
cd home/framez/Framezz-app/
npm start
sleep 5 # wait for server to start
chromium-browser http://localhost:3000
