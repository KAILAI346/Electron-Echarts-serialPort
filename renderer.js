// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// 获取按钮和容器的DOM节点
var content = document.getElementById('content');
var button = document.getElementById('btn');
var echartsDIV = document.getElementById('main')
var HexBtn = document.getElementById('HexBtn');
var option = {
    title: {
        text: '串口数据可视化',
        subtext: '模拟数据',
        left: 'center'
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left'
    },
    series: [
        {
        name: 'Access From',
        type: 'pie',
        radius: '50%',
        data: [{}],
        emphasis: {
            itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
        }
    ]
    };
const { ipcRenderer } = require('electron')

ipcRenderer.on('asynchronous-reply', (event, arg) => {
    content.innerText = hexToString(arg);
    console.log(hexToString(arg))
    option.series[0].data = JSON.parse(hexToString(arg));
    // echartsDIV.innerText = arg;
})

button.addEventListener('click', (e) => {
    ipcRenderer.send('asynchronous-message', 'read_serialport')
});
HexBtn.addEventListener('click',(e) =>{
    console.log(option);
    myChart.setOption(option);
})


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
// //去除hexToString函数返回到浏览器中将数组变成字符串时，存在双引号转移的问题
//   这个没有使用，但是可以用来学习的
// function trimSpecial(string) {

//     //替换字符串中的所有特殊字符（包含空格）
//     if(string!= ""){
//       const pattern=/[`""'\s]/g;
//       string = string.replace(pattern,"");
//     }
//     return string
//   }