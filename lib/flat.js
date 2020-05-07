const fs = require("fs");
const path = require("path");
const flatten = require("flat");
const unflatten = require("flat").unflatten;
const sortPackageJson = require("sort-package-json");
const sortJson = require("sort-json");
const { showMessage } = require("../utils");
const isDir = url => fs.statSync(url).isDirectory();
const isFile = url => fs.statSync(url).isFile();
const useTime = beginTime => (new Date().getTime() - beginTime) / 1000;
const writeFile = ({
	unFlat = false,
	beginTime,
	uri,
	str,
	fileName,
	isPackage = false
}) => {
	const fPath = uri.fsPath;
	fs.writeFile(fPath, str, err => {
		if (!err) {
			if (fileName) {
				const message = isPackage
					? "Current json is 'package.json',sort it for you O(∩_∩)O"
					: `${unFlat ? "UnFlat" : "Flat"} '${fileName}' Success In ${useTime(
							beginTime
					  )}s!`;
				showMessage({
					message,
					file: fPath,
					callback: isPackage
						? false
						: {
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
					const isPackageJson = /package\.json/.test(currentFsPath);
					let _data = !data.toString() ? {} : JSON.parse(data.toString());
					if (isPackageJson) {
						let str = JSON.stringify(_data, null, 2);
						str = sortPackageJson(str);
						writeFile({
							unFlat,
							isPackage: true,
							beginTime,
							uri,
							str,
							fileName
						});
					} else {
						_data = unFlat ? unflatten(_data) : flatten(_data);
						if (!isPackageJson) {
							_data = sortJson(_data);
						}
						let str = JSON.stringify(_data, null, 2);

						writeFile({
							unFlat,
							beginTime,
							uri,
							str,
							fileName
						});
					}
				}
			});
		}
	}
};
module.exports = flat;
