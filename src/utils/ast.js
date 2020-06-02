const parse = require("json-to-ast");

const find = (ast, key) =>
	ast.children && ast.children.find(m => m.key && m.key.value === key); // return match

const jsonAST = (str, keys, wholeMatch = false) => {
	const ast = parse(str);
	if (wholeMatch) {
		return find(ast, keys);
	}
	let result = ast;
	keys.forEach((v, p) => {
		const item = find(result, v);
		if (item) {
			switch (item.type) {
				case "Object":
					result = item;
					break;
				case "Property":
					result = item.value;
					break;
				case "Object":
					result = item;
					break;
			}
		}
	});
	return result;
};

const jsAST = () => {};
module.exports = {
	jsonAST,
	jsAST
};
