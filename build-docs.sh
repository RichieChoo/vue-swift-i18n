#!/bin/bash

git reset --hard
git pull origin master
npm install && npm run docs:build
