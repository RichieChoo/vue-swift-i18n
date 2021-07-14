#!/bin/bash

git reset --hard
git pull origin master
chattr -i /www/wwwroot/vueswifti18n.richieyu.top/dist/.user.ini
npm install && npm run docs:build
