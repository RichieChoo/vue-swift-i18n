const fs = require("fs");
const path = require("path");
const flatten = require("flat");
const { msg } = require("../utils/vs");
const isDir = url => fs.statSync(url).isDirectory();
const isFile = url => fs.statSync(url).isFile();
module.exports = uri => {
  const fPath = uri.path;
  let beginTime = new Date();
  if (isDir(fPath)) {
    console.warn(`flat dir:${fPath}`);
  }
  if (isFile(fPath)) {
    if (!/.json$/.test(fPath)) {
      msg.error("Flat file type should be JSON !");
      return;
    } else {
      console.warn(`Flat file:${fPath}`);
      const arr = fPath.split(".");
      const fileName = fPath.split("/")[fPath.split("/").length-1];
      //倒数第二项改名
      arr[arr.length - 2] += "_back";
      const bkPath = arr.join(".");
      fs.readFile(fPath, (err, data) => {
        if (!err) {
          let _data = JSON.parse(data.toString());
          let oldStr = JSON.stringify(_data, null, 4);
          _data = flatten(_data);
          let str = JSON.stringify(_data, null, 4);
          fs.writeFile(bkPath, oldStr, err => {
            if (!err) {
              //flatten
              fs.writeFile(fPath, str, err => {
                if (!err) {
                  let nowTime = new Date();
                  // @ts-ignore
                  const useTime = (nowTime - beginTime) / 1000;
                  msg.info(
                    `Flatted '${fileName}' Success In ${useTime}s!`
                  );
                } else {
                  msg.error(`Flat ${fPath} Fail`);
                }
              });
            } else {
              msg.error(`Write ${bkPath} Fail`);
            }
          });
        }
      });
    }
  }
};
