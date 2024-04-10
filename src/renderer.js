const { ipcRenderer } = require('electron');




// 热更新需要重新加载页面
ipcRenderer.on('reload', () => {
    location.reload();
});

function search() {
    const input = document.getElementById('searchInput').value;

    ipcRenderer.send('search', input);
}

ipcRenderer.on('searchResult', (event, result) => {
    const resultDiv = document.getElementById('result');

    if (result) {
        resultDiv.innerText = `翻译结果：${result}`;
    } else {
        resultDiv.innerText = '未找到翻译结果';
    }
});


document.getElementById('reloadButton').addEventListener('click', reload);

function reload() {
    console.log(111111)
    ipcRenderer.send('reload');
}