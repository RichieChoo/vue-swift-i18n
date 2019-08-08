const fs = require('fs');
const path = require('path');
const flatten = require('flat');
const { showMessage } = require('../utils');
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
                showMessage({
                    message: `Flatted '${fileName}' Success In ${useTime(
                        beginTime
                    )}s!`,
                    file: fPath,
                });
            } else {
                flattedArr.push(fPath);
                if (flattedArr.length === resolveArr.length) {
                    showMessage({
                        message: `Flatted ${
                            flattedArr.length
                        } Files Success in ${useTime(beginTime)}s!`,
                        needOpen: false,
                    });
                }
            }
        } else {
            showMessage({
                type:"error",
                message:`Flatted File ${fPath} fail`,
                file:fPath

            })
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
                showMessage({
                    type:"error",
                    message:`Write ${bkPath} fail`,
                    file:bkPath

                })
            }
        });
    }
};
module.exports = uri => {
    //use fsPath ,or it will be error in window
    const currentFsPath = uri.fsPath;
    const currentPath = uri.path;
    let beginTime = new Date().getTime();
    if (isDir(currentFsPath)) {
        let files = fs.readdirSync(currentFsPath);
        //only output _back.json once
        const resolveArr = files.filter(
            item =>
                fs.statSync(path.join(currentFsPath, item)).isFile() &&
                /.json$/g.test(item) &&
                !/_flat.json$/g.test(item)
        );
        console.log(`Flat Files:${resolveArr}`);
        const flattedArr = [];
        resolveArr.forEach(item => {
            const fPath = path.join(currentFsPath, item);
            const arr = fPath.split('.');
            //倒数第二项改名
            arr[arr.length - 2] += '_flat';
            const flatPath = arr.join('.');
            fs.readFile(fPath, (err, data) => {
                if (!err) {
                    let _data = JSON.parse(data.toString());
                    _data = flatten(_data);
                    let str = JSON.stringify(_data, null, 4);
                    writeFile({
                        beginTime,
                        fPath: flatPath,
                        str,
                        resolveArr,
                        flattedArr,
                    });
                }
            });
        });
    }
    if (isFile(currentFsPath)) {
        if (!/.json$/.test(currentFsPath)) {
              showMessage({
                type:"error",
                message:`Flat File Type Should Be JSON !`,
                needOpen:false

            })
            return;
        } else {
            const arr = currentFsPath.split('.');
            const fileName = path.basename(currentPath);
            //倒数第二项改名
            arr[arr.length - 2] += '_flat';
            const flatPath = arr.join('.');
            fs.readFile(currentFsPath, (err, data) => {
                if (!err) {
                    let _data =!data.toString()?{}:JSON.parse(data.toString());
                    _data = flatten(_data);
                    let str = JSON.stringify(_data, null, 4);
                    writeFile({
                        beginTime,
                        fPath: flatPath,
                        str,
                        fileName,
                    });
                }
            });
        }
    }
};
