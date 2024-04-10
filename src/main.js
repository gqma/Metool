const { app, BrowserWindow, autoUpdater } = require('electron');
const path = require('path');
const url = require('url');

// 开发环境下使用 electron-reloader
if (process.env.NODE_ENV === 'development') {
    require('electron-reloader')(module, {
        debug: true,
        watchRenderer: true
    });
}



// // 配置自动更新的服务器地址和应用程序包信息
// autoUpdater.setFeedURL({
//     provider: 'github',
//     repo: 'your-github-repo',
//     owner: 'your-github-username',
//     private: false
// });

// // 监听更新下载完成事件
// autoUpdater.on('update-downloaded', () => {
//     // 在更新下载完成后，提示用户安装更新
//     autoUpdater.quitAndInstall();
// });

// // 检查更新
// app.on('ready', () => {
//     autoUpdater.checkForUpdates();
// });

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.center(); // 将窗口居中显示

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}



app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
