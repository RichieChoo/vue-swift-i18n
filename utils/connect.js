module.exports = (first, second) => {
	if (typeof first !== "string" || typeof second !== "string") {
		return false;
	}
	const endWithDot = /\.$/;
	const beginWithDot = /^\./;
	if (endWithDot.test(first)) {
		return beginWithDot.test(second) ? first + second.slice(1) : first + second;
	} else {
		return beginWithDot.test(second) ? first + second : first + "." + second;
	}
};
