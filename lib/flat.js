const fs = require("fs");
const path = require("path");
const flatten = require("flat");
const unflatten = require("flat").unflatten;
const { showMessage } = require("../utils");
const isDir = url => fs.statSync(url).isDirectory();
const isFile = url => fs.statSync(url).isFile();
const useTime = beginTime => (new Date().getTime() - beginTime) / 1000;
const writeFile = ({ unFlat = false, beginTime, uri, str, fileName }) => {
	const fPath = uri.fsPath;
	fs.writeFile(fPath, str, err => {
		if (!err) {
			if (fileName) {
				showMessage({
					message: `Flatted '${fileName}' Success In ${useTime(beginTime)}s!`,
					file: fPath,
					callback: {
						func: () => flat(uri, !unFlat),
						name: unFlat ? "Flat it" : "Unflat it"
					}
				});
			}
		} else {
			showMessage({
				type: "error",
				message: `Flatted File ${fPath} fail`,
				file: fPath
			});
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
					type: "error",
					message: `Write ${bkPath} fail`,
					file: bkPath
				});
			}
		});
	}
};
const flat = (uri, unFlat = false) => {
	//use fsPath ,or it will be error in window
	const currentFsPath = uri.fsPath;
	let beginTime = new Date().getTime();
	if (isFile(currentFsPath)) {
		if (!/.json$/.test(currentFsPath)) {
			showMessage({
				type: "error",
				message: `Flat File Type Should Be JSON !`,
				needOpen: false
			});
			return;
		} else {
			const fileName = path.basename(currentFsPath);
			fs.readFile(currentFsPath, (err, data) => {
				if (!err) {
					let _data = !data.toString() ? {} : JSON.parse(data.toString());
					_data = unFlat ? unflatten(_data) : flatten(_data);
					let str = JSON.stringify(_data, null, 2);
					writeFile({
						unFlat,
						beginTime,
						uri,
						str,
						fileName
					});
				}
			});
		}
	}
};
module.exports = flat;
