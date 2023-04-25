// to check the web init file is exist or not


// 通过 XMLHttpRequest 检测文件是否存在
// usage: isfileExist('./file.txt').then(exists => { console.log(exists); });
export function isfileExist(url) {
    return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', url);
    xhr.onload = () => {
        if (xhr.status === 200) {
        resolve(true); // 文件存在
        } else {
        resolve(false); // 文件不存在
        }
    };
    xhr.onerror = () => {
        resolve(false); // 文件不存在
    };
    xhr.send();
    });
}
