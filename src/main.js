const {app, BrowserWindow, ipcMain, Menu, dialog, globalShortcut  } = require('electron');
const { autoUpdater } = require('electron-updater');
const Fuse = require('fuse.js');
const url = require("url");
const path = require('node:path')
const fs = require('fs');

// const electron_app = require('update-electron-app')
// electron_app()

if (process.env.NODE_ENV == 'development') {
    const reload = require('electron-reload');
    // 传入需要监视的目录或文件
    reload(__dirname);
}else{
  const { app, autoUpdater } = require('electron')
  const server = 'https://update.electronjs.org'
  const feed = `${server}/OWNER/REPO/${process.platform}-${process.arch}/${app.getVersion()}`
  autoUpdater.setFeedURL(feed)

  setInterval(() => {
    autoUpdater.checkForUpdates()
  }, 10 * 60 * 1000)
}

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        nodeIntegration: false,
        // hardwareAcceleration: false, # 硬件加速
        show: false,
        resizable: false,
        // frame: false,
        width: 800,
        height: 600,
        // autoHideMenuBar: true, // 设置自动隐藏菜单栏
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    const template = [
        {
          label: '关于',
          submenu: [
            {
              label: '检查更新',
              click: () => {
                checkForUpdates();
              },
            },
            {
              label: '版本说明',
              click: () => {
                showVersionInfo();
              },
            },
          ],
        },
        // 其他菜单项
      ];
    
      const menu = Menu.buildFromTemplate(template);
      
      Menu.setApplicationMenu(menu);

}

// 程序启动时
app.on('ready', ()=>{
    ipcMain.handle('ping', () => 'pong')
    createWindow()
    mainWindow.loadURL(
      url.format({
          pathname: path.join(__dirname, 'index.html'), // 指定好对应的主页文件就好了
          protocol: "file:",
          slashes: true
      })
  )
  // 注册全局快捷键 CommandOrControl+Shift+I 打开控制台
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    mainWindow.webContents.openDevTools();
  });
  // 当应用加载完成后显示主窗口
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

})

// 在应用退出时取消注册的快捷键
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
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

/***********************  Update  **************************/

function checkForUpdates() {
    autoUpdater.checkForUpdatesAndNotify();
  }


autoUpdater.on('update-available', () => {
dialog.showMessageBox({
    type: 'info',
    message: '发现新版本，是否现在更新？',
    buttons: ['是', '否']
}).then((buttonIndex) => {
    if (buttonIndex.response === 0) {
    autoUpdater.downloadUpdate();
    }
});
});

autoUpdater.on('update-downloaded', () => {
    dialog.showMessageBox({
      type: 'info',
      message: '更新已下载完成，是否现在重启应用程序？',
      buttons: ['是', '否']
    }).then((buttonIndex) => {
      if (buttonIndex.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

/***********************  Update  **************************/


/***********************  Version  **************************/ 
function showVersionInfo() {
dialog.showMessageBox({
    type: 'info',
    title: '版本说明',
    message: '当前应用程序版本: ' + app.getVersion() + '.',
});
}
/***********************  Version  **************************/


/***********************  Search  **************************/

// 假设 database 是包含对象的数组，每个对象有一个 name 字段
const options = {
    keys: [{ name: 'name_zh', weight: 0.7 }, // 设置权重，可根据实际情况调整
    { name: 'name_en', weight: 0.3 }], // 搜索的字段，可以是单个字段或多个字段的数组
    includeScore: true, // 是否返回搜索结果的匹配得分
    threshold: 0.4, // 匹配阈值，0 表示完全匹配，1 表示模糊匹配
};


// 进行模糊搜索

ipcMain.on('search', (event, input) => {
    let nameEns=[]
    // console.log("接收到渲染进程消息：", input)
    fs.readFile(path.join(__dirname, 'database.json'), "UTF8", (err, data) => {
        if (err) {
            console.error(err);
            event.sender.send('searchResult', null);
            return;
        }

        const database = JSON.parse(data);
                // 初始化 Fuse 实例
        const fuse = new Fuse(database, options);
        // 进行模糊搜索
        const searchResults = fuse.search(input);
        names = searchResults.map(result => ({ name_en: result.item.name_en, name_zh: result.item.name_zh }));
        event.sender.send('searchResult', names);
    });
});

/***********************  Search  **************************/