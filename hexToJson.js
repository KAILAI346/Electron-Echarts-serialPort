// 接收传入的中文hex16进制字符串，然后将它转换成中文
let readUTF = function(arr) {
	if (typeof arr === 'string') {
		return arr;
	}
	let UTF = '', _arr = arr;
	for (let i = 0; i < _arr.length; i++) {
		let one = _arr[i].toString(2), v = one.match(/^1+?(?=0)/);
		if (v && one.length == 8) {
			let bytesLength = v[0].length;
			let store = _arr[i].toString(2).slice(7 - bytesLength);
			for (let st = 1; st < bytesLength; st++) {
				store += _arr[st + i].toString(2).slice(2)
			}
			UTF += String.fromCharCode(parseInt(store, 2));
			i += bytesLength - 1
		} else {
			UTF += String.fromCharCode(_arr[i])
		}
	}
	return UTF
}
// hexToString
hexToString = function (str) {
  if (str.length % 2 != 0) {
    return console.log('必须为偶数');
  }
  let buf = [];
  for (let i = 0; i < str.length; i += 2) {
    buf.push(parseInt(str.substring(i, i + 2), 16));
  }
  return readUTF(buf);
}
