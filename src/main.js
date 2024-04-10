const { app, BrowserWindow } = require('electron');
const { updateElectronApp, UpdateSourceType } = require('update-electron-app')
const path = require('path');
const url = require('url');

updateElectronApp({
    updateSource: {
      type: UpdateSourceType.ElectronPublicUpdateService,
      repo: 'github-user/repo'
    },
    updateInterval: '1 hour',
    logger: require('electron-log')
  })

// 开发环境下使用 electron-reloader
if (process.env.NODE_ENV === 'development') {
    require('electron-reloader')(module, {
        debug: true,
        watchRenderer: true
    });
}

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
