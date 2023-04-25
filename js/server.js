// server address
import { logMessage } from './utilities.js';

const server = 'http://127.0.0.1:5505';
const route = '/CreatePatternFile?';


export function sendRequest(filename) {
    const request = 'filename=' + filename;
    // 创建XMLHttpRequest对象
    const xhr = new XMLHttpRequest();
    // 设置请求方法和URL
    xhr.open('GET', server + route + request, true);
    // 设置超时时间为3秒
    xhr.timeout = 3000;
    // 监听请求状态
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          // 处理响应数据
          const response = JSON.parse(xhr.responseText);
          logMessage('webconsolelist', 'info', response.message);
        } else {
          logMessage('webconsolelist', 'danger', '请求失败，错误码：'+ xhr.status );
        }
      }
    };
    // 监听超时事件
    xhr.ontimeout = function() {
      logMessage('webconsolelist', 'warning', '请求超时，请检查网络连接');
    };
    // 发送请求
    xhr.send();
}
  