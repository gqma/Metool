
let ipcRenderer; // 声明一个全局变量用来存储 ipcRenderer

window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer = require('electron').ipcRenderer;
});


/***********************  Search  **************************/
function search() {
    const input = document.getElementById('searchInput').value;
    ipcRenderer.send('search', input);
}

ipcRenderer.on('searchResult', (event, result) => {
    const resultDiv = document.getElementById('result');
    console.log(result)
    console.log(resultDiv)
    resultDiv.innerText = '未找到翻译结果';

    if (result.length > 0) {
        resultDiv.innerText = `翻译结果：${result}`;
    } else {
        resultDiv.innerText = '未找到翻译结果';
    }
});
/***********************  Search  **************************/