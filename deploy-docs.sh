#!/usr/bin/env sh


deployName="Vue Swift I18n Docs"
readonly deployName


# 确保脚本抛出遇到的错误
set -e



echo "Deploying '${deployName}'..."
echo ""

# 清除对项目的改动
    git clean -fdx && git reset --hard HEAD

# 获取最新代码
git pull origin master

# 安装更新依赖,生成静态文件
npm install && npm update && npm run docs:build

# 重启nginx服务器
nginx -s reload

# 查看nginx 进程状态
systemctl status nginx
