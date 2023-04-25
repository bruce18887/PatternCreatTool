const maxItems = 30;
const webconsole_list = document.getElementById('webconsolelist');
export const commandlist = document.getElementById("commandlist_i2c");

export const setting_i2c = {"scl":"SCL","sda":"SDA","wftname":"WFT1","patternfilename":"1.csv"};
// const command_i2c = {"mode":"C", "slaveid":"0x00","address":"0x00","data":"0x00"};

// // 添加新的列表项
// export function addItem(format, value1, value2) {
//     // 创建一个新的列表项
//     var newItem = document.createElement("li");
//     newItem.classList.add("list-group-item", "list-group-item-action");
//     if (format === 'C') {
//         newItem.classList.add("list-group-item-primary");
//         newItem.classList.add("format-c");
//         newItem.textContent = "C, " + value1 + ", " + value2;
//     } else if (format === 'D') {
//         newItem.classList.add("list-group-item-secondary");
//         newItem.classList.add("format-d");
//         newItem.textContent = "D, " + value1 + ", " + value2;
//     } else {
//         logMessage("webconsolelist", "danger", "Invalid format: " + format);
//         return;
//     }
//     // alert(newItem.textContent)
//     // 将新项添加到列表中
//     commandlist.appendChild(newItem);
// }

 const command_i2c = {"mode":"C", "slaveid":"0x00","address":"0x00","data":"0x00"};

// 添加新的列表项
export function addItem(command) {
    const format = command.mode;
    const value1 = command.address;
    const value2 = command.data;
    
    // 创建一个新的列表项
    var newItem = document.createElement("li");
    newItem.classList.add("list-group-item", "list-group-item-action");
    if (format === 'C') {
        newItem.classList.add("list-group-item-primary");
        newItem.classList.add("format-c");
        newItem.textContent = `C, ${value1}, ${value2}`;
    } else if (format === 'D') {
        newItem.classList.add("list-group-item-secondary");
        newItem.classList.add("format-d");
        newItem.textContent = `D, ${value1}, ${value2}`;
    } else {
        logMessage("webconsolelist", "danger", `command_i2c: ${JSON.stringify(command)} 格式错误`);
        return;
    }
    // alert(newItem.textContent)
    // 将新项添加到列表中
    commandlist.appendChild(newItem);
}

// 添加新的列表项
export function logMessage(logId, type, message) {

    // // 创建新的列表项
    // const item = document.createElement('li');
    // item.classList.add('list-group-item');
    // item.classList.add(`list-group-item-${type}`);
    // item.innerHTML = `
    // <span class="badge bg-${type} ${type==='warning'?'text-dark':''}" style="margin-right: 8px;">${new Date().toLocaleString()}</span>
    // <i class="bi bi-${type === 'warning' ? 'exclamation-triangle-fill text-warning' : type === 'danger' ? 'x-octagon-fill text-danger' : 'info-circle-fill text-info'}" style="margin-right: 8px;"></i>
    // ${message}
    // `;
    // 为包含文件名的文本添加链接
    function addHrefToFilename(message) {
        const regex = /([\w-]+\.[a-z]+)/;
        const filename = message.match(regex);
        if (filename) {
            const href = `#${filename[0]}`;
            return message.replace(filename[0], `<a href="${href}">${filename[0]}</a>`);
        }
        return message;
    }
    // const addHrefToFilename = message => {
    //     const regex = /([\w-]+\.[a-z]+)/;
    //     const filename = message.match(regex);
    //     if (filename) {
    //     const href = `#${filename[0]}`;
    //     return message.replace(filename[0], `<a href="${href}">${filename[0]}</a>`);
    //     }
    //     return message;
    // };
  

    // 创建新的列表项
    const item = document.createElement('li');
    item.classList.add('list-group-item');
    item.classList.add(`list-group-item-${type}`);
    item.innerHTML = `
    <span class="badge bg-${type} ${type==='warning'?'text-dark':''}" style="margin-right: 8px;">${new Date().toLocaleString()}</span>
    <i class="bi bi-${type === 'warning' ? 'exclamation-triangle-fill text-warning' : type === 'danger' ? 'x-octagon-fill text-danger' : 'info-circle-fill text-info'}" style="margin-right: 8px;"></i>
    ${addHrefToFilename(message)}
    `;


    // 将新的列表项添加到列表中
    webconsole_list.appendChild(item);
    // 检查列表项数量
    checkList(webconsole_list);
}

// 检查列表项数量，删除多余的项
function checkList(list) {
    // 获取列表中的所有列表项
    const items = list.querySelectorAll('.list-group-item');
    if (items.length > maxItems) {
        for (let i = 0; i < items.length - maxItems; i++) {
        list.removeChild(items[i]);
        }
    }
}

// 弹出toast提示
function calltoast(text) {
    const toastvalue = document.getElementById('toastvalue');
    toastvalue.textContent = text;
    const toastLiveExample = document.getElementById('liveToast')
    const toast = new bootstrap.Toast(toastLiveExample)
    toast.show()
}

// 检查输入框的值是否符合格式
function inputformatcheck(input) {
    // 匹配 0x 前缀的 16 进制字符
    const regex = /^0x[0-9a-fA-F]{2}$/;
    return regex.test(input);
}
  


// 获取输入框的值
function getInputValue(inputid) {
    // 获取输入框的值
    const inputvalue = document.getElementById(inputid).value;
    return inputvalue;
    // calltoast(showtext);
    // logMessage('webconsolelist', 'info', showtext);
}

export function AddCommand() {
    // command.mode = getInputValue('input_i2c_mode');
    command_i2c.mode = 'C';
    command_i2c.slaveid = getInputValue('input_i2c_slaveid');
    command_i2c.address = getInputValue('input_i2c_address');
    command_i2c.data = getInputValue('input_i2c_data');

    // 检查输入框的值是否符合格式
    if (inputformatcheck(command_i2c.slaveid) && inputformatcheck(command_i2c.address) && inputformatcheck(command_i2c.data)) {
        // 添加新的列表项
        addItem('C', command_i2c.address, command_i2c.data);
        // 弹出toast提示
        logMessage('webconsolelist', 'info', `command_i2c: ${JSON.stringify(command_i2c)} 添加成功`);
    }
    else {
        logMessage('webconsolelist', 'danger', `command_i2c: ${JSON.stringify(command_i2c)} 格式错误`);
    }

}

export function settingcheck() {
    const inputpins = getInputValue('input_i2c_signals'); // 获取输入框的值
    const regex = /^[a-zA-Z]\w*,\s*[a-zA-Z]\w*$/; // 定义正则表达式
    if (regex.test(inputpins)) {
        const [scl, sda] = inputpins.split(',').map(s => s.trim()); // 使用 split() 方法将字符串分割成两个部分，并去掉两端的空格
        setting_i2c.scl = scl;
        setting_i2c.sda = sda;
    } else {
        logMessage('webconsolelist', 'danger', `Signals: ${inputpins} 格式错误`);
        return 0;
    }

    const inputwftname = getInputValue('input_i2c_timingsetname'); // 获取输入框的值
    const regex2 = /^[a-zA-Z]\w*$/; // 定义正则表达式
    if (regex2.test(inputwftname)) {
        setting_i2c.wftname = inputwftname;
    } else {
        logMessage('webconsolelist', 'danger', `WFT Name: ${inputwftname} 格式错误`);
        return 0;
    }

    const inputfilename = getInputValue('input_i2c_filename'); // 获取输入框的值
    const regex3 = /\.csv$/i; // 定义正则表达式
    if (regex3.test(inputfilename)) {
        setting_i2c.patternfilename = inputfilename;
    }
    else {
        logMessage('webconsolelist', 'danger', `Filename: ${inputfilename} 格式错误`);
        return 0;
    }

    logMessage('webconsolelist','info',`setting_i2c: ${JSON.stringify(setting_i2c)} 设置成功`);
    return 1;
}

