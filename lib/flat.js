const fs = require('fs');
const path = require('path');
const flatten = require('flat');
const { msg } = require('../utils/vs');
const isDir = url => fs.statSync(url).isDirectory();
const isFile = url => fs.statSync(url).isFile();
const useTime = beginTime => (new Date().getTime() - beginTime) / 1000;
const writeFile = ({
    beginTime,
    fPath,
    flattedArr,
    str,
    resolveArr,
    fileName,
}) => {
    fs.writeFile(fPath, str, err => {
        if (!err) {
            if (fileName) {
                msg.info(
                    `Flatted '${fileName}' Success In ${useTime(beginTime)}s!`
                );
            } else {
                flattedArr.push(fPath);
                if (flattedArr.length === resolveArr.length) {
                    msg.info(
                        `Flatted ${
                            flattedArr.length
                        } Files Success in ${useTime(beginTime)}s!`
                    );
                }
            }
        } else {
            msg.error(`Flatted File ${fPath} fail`);
        }
    });
};
const resolveOld = ({ bkPath, oldStr, callback }) => {
    if (fs.existsSync(bkPath)) {
        callback();
    } else {
        fs.writeFile(bkPath, oldStr, err => {
            if (!err) {
                callback();
            } else {
                msg.error(`Write ${bkPath} fail`);
            }
        });
    }
};
module.exports = uri => {
    const currentPath = uri.path;
    let beginTime = new Date().getTime();
    if (isDir(currentPath)) {
        let files = fs.readdirSync(currentPath);
        //只对json进行一次back复制
        const resolveArr = files.filter(
            item =>
                fs.statSync(path.join(currentPath, item)).isFile() &&
                /.json$/g.test(item) &&
                !/_back.json$/g.test(item)
        );
        console.log(`Flat Files:${resolveArr}`);
        const flattedArr = [];
        resolveArr.forEach(item => {
            const fPath = path.join(currentPath, item);
            const bkPath = path.join(
                currentPath,
                item.slice(0, -5) + '_back.json'
            );
            fs.readFile(fPath, (err, data) => {
                if (!err) {
                    let _data = JSON.parse(data.toString());
                    let oldStr = JSON.stringify(_data, null, 4);
                    _data = flatten(_data);
                    let str = JSON.stringify(_data, null, 4);
                    resolveOld({
                        bkPath,oldStr,callback:()=>{
                            writeFile({
                                beginTime,
                                fPath,
                                str,
                                resolveArr,
                                flattedArr,
                            });
                        }
                    })
                }
            });
        });
    }
    if (isFile(currentPath)) {
        if (!/.json$/.test(currentPath)) {
            msg.error('Flat File Type Should Be JSON !');
            return;
        } else {
            console.log(`Flat File:${currentPath}`);
            const arr = currentPath.split('.');
            const fileName = currentPath.split('/')[
                currentPath.split('/').length - 1
            ];
            //倒数第二项改名
            arr[arr.length - 2] += '_back';
            const bkPath = arr.join('.');
            fs.readFile(currentPath, (err, data) => {
                if (!err) {
                    let _data = JSON.parse(data.toString());
                    let oldStr = JSON.stringify(_data, null, 4);
                    _data = flatten(_data);
                    let str = JSON.stringify(_data, null, 4);
                    resolveOld({
                        bkPath,oldStr,callback:()=>{
                            writeFile({
                                beginTime,
                                fPath: currentPath,
                                str,
                                fileName,
                            });
                        }
                    })
                }
            });
        }
    }
};
