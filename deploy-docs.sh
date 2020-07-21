#!/usr/bin/env sh
deployName="Vue Swift I18n Docs"
readonly deployName

echo `Deploying '${deployName}'...\n`

# 确保脚本抛出遇到的错误
set -e

# 清除对项目的改动
git clean -fd

# 获取最新代码
git pull origin master

# 生成静态文件
npm run docs:build

# 重启nginx服务器
nginx -s reload

# 查看nginx 进程状态
systemctl status nginx
