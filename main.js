// electron 模块可以用来控制应用的生命周期和创建原生浏览窗口
const { app, BrowserWindow } = require('electron')
const path = require('path')
// let { hexToString } = require('./hexToJson')

const createWindow = () => {
  // 创建浏览窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 加载 index.html
  mainWindow.loadFile('index.html')

  // 打开开发工具
  // mainWindow.webContents.openDevTools()
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。


var {SerialPort} = require('serialport')
var sp = new SerialPort({ path:'COM2',baudRate: 9600 })

function writeport(senddata){
  sp.write(senddata, function (err) {
        if (err) {
            return console.log('Error on write: ', err.message);
        }
        console.log('send: ' + senddata);
    });
}



function openport(event){
  sp.on('open', function () {
    console.log("open port success.");
  });

  // open errors will be emitted as an error event
  sp.on('error', function (err) {
    console.log('Error: ', err.message);
  })

  sp.on('data', function (data) {
    // console.log("data",hexToString(data));
    //hex
    console.log('recv: ' + data.toString('hex'));
    // console.log('recvToString: ' + hexToString(data));
    //ascii
    //console.log('recv: ' + data.toString('ascii'));
    event.sender.send('asynchronous-reply', data.toString('hex'));



  });
}

function closeport(){
  sp.on('close', function () {
    console.log("open port success.");
  });
}

const { ipcMain } = require('electron')
ipcMain.on('asynchronous-message', (event, cmd) => { //主进程接收渲染进程的请求事件
  console.log("read_serialport")
  switch (cmd) {
    case "read_serialport":
      openport(event)
      break;
  }
});


