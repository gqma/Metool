
// let ipcRenderer; // 声明一个全局变量用来存储 ipcRenderer

// window.addEventListener('DOMContentLoaded', () => {
    //     ipcRenderer = require('electron').ipcRenderer;
// });
const {ipcRenderer } = require('electron')

/***********************  Search  **************************/
let searchTimer = null;
    const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', (event) => {
    clearTimeout(searchTimer); // 清除之前的定时器
    const searchText = event.target.value.trim();
    searchTimer = setTimeout(() => {
        ipcRenderer.send('search', searchText);
}, 300); // 等待 0.5 秒后执行搜索
});

ipcRenderer.on('searchResult', (event, result) => {
    console.log("获取主线程传递的搜索结果")
    // console.log(result)
    const resultDiv = document.getElementById('result');
    
    if (result.length > 0) {
        const ul = document.createElement('ul');
        result.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name_zh}: ${item.name_en}`;
            ul.appendChild(li);
        });
        resultDiv.innerHTML = ''; // 清空结果容器
        resultDiv.appendChild(ul); // 将列表添加到结果容器中
    } else {
        resultDiv.innerText = '';
    }
});
/***********************  Search  **************************/