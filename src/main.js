const {app, BrowserWindow, ipcMain } = require('electron');
const Fuse = require('fuse.js');
const url = require("url");
const path = require("path");
const fs = require('fs');

const reload = require('electron-reload');

// 传入需要监视的目录或文件
reload(__dirname);


let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'index.html'), // 指定好对应的主页文件就好了
            protocol: "file:",
            slashes: true
        })
    )
    mainWindow.on('closed', function () {
        mainWindow = null
    })

    mainWindow.webContents.openDevTools() // 显示这个窗口的调试窗口，如果不想显示，删除该段即可
}

// 程序启动时
app.on('ready', ()=>{
    createWindow()
})

// 所有窗口关闭时
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// 程序处于激活状态时
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})


/***********************  Search  **************************/

// 假设 database 是包含对象的数组，每个对象有一个 name 字段
const options = {
    keys: ['name'], // 搜索的字段，可以是单个字段或多个字段的数组
    includeScore: true, // 是否返回搜索结果的匹配得分
    threshold: 0.4, // 匹配阈值，0 表示完全匹配，1 表示模糊匹配
};


// 进行模糊搜索

ipcMain.on('search', (event, input) => {

    console.log('This is a log message from the main process');

    fs.readFile(path.join(__dirname, 'database.json'), "UTF8", (err, data) => {
        if (err) {
            console.error(err);
            event.sender.send('searchResult', null);
            return;
        }

        const database = JSON.parse(data);
        console.log("database")
        console.log(database)

        // 初始化 Fuse 实例
        const fuse = new Fuse(database, options);
        // 进行模糊搜索
        const result = fuse.search(input);
        event.sender.send('searchResult', result);
    });
});

/***********************  Search  **************************/