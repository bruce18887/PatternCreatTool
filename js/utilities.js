const maxItems = 30;
const webconsole_list = document.getElementById('webconsolelist');
export const commandlist = document.getElementById("commandlist_i2c");

export const setting_i2c = {"slaveid":"0x00", "scl":"SCL","sda":"SDA","wftname":"WFT1","patternfilename":"1.csv"};
const command_i2c = {"mode":"C","address":"0x00","data":"0x00"};

// 添加新的列表项
function addItem(command) {
    const truerowindex = commandlist_i2c.getColumnData(0).length;
    if (command.mode === 'C'||command.mode === 'D') {
        // 判断是否为第一行且为空
        if ((truerowindex-1)===0 && commandlist_i2c.getCellFromCoords(0,0).innerText==="") {
            commandlist_i2c.setRowData(0,[command.mode,command.address,command.data]);
        }
        else if (truerowindex!=0){
            commandlist_i2c.insertRow([command.mode,command.address,command.data],truerowindex,false);
        }
        else{
            logMessage("webconsolelist", "danger", `command_i2c: ${JSON.stringify(command)} 插入出现问题`);
        }
    }
    else{
        logMessage("webconsolelist", "danger", `command_i2c: ${JSON.stringify(command)} 格式错误`);
    }
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

// 执行添加命令
export function AddCommand() {
    // command.mode = getInputValue('input_i2c_mode');
    command_i2c.mode = 'D';
    command_i2c.address = getInputValue('input_i2c_address');
    command_i2c.data = getInputValue('input_i2c_data');
        // 检查输入框的值是否符合格式
    if (inputformatcheck(getInputValue('input_i2c_slaveid')) && inputformatcheck(command_i2c.address) && inputformatcheck(command_i2c.data)) {
        // 添加新的列表项
        addItem(command_i2c);
        // 弹出toast提示
        logMessage('webconsolelist', 'info', `command_i2c: ${JSON.stringify(command_i2c)} 添加成功`);
    }
    else {
        logMessage('webconsolelist', 'danger', `command_i2c: ${JSON.stringify(command_i2c)} 格式错误`);
    }

}

export const commandlist_i2c = jspreadsheet(document.getElementById('commandlist_i2c'), {
    data:[[]],
    // minSpareRows:1,//空余行
    textOverflow: true,
    columns: [
        { type: 'text', title: '模式', width: 50, },
        { type: 'text', title: '地址', width: 120,}, 
        { type: 'text', title: '数据', width: 120,},
      ],
    rowDrag: true,//行拖动
    columnDrag: false,//禁止列拖动
    allowSorting: false, // 关闭代码排序功能
    columnSorting: false, // 关闭列排序功能
    allowExport: false, // 关闭导出功能
    columnResize: false, // 关闭列宽调整功能
    editable: false, // 关闭编辑功能
    allowInsertColumn: false, // 关闭插入列功能
    allowRenameColumn: false, // 关闭重命名列功能
    autoIncrement: false, // 关闭自动增量功能
    allowManualInsertColumn: false, // 关闭手动插入列功能
    allowInsertRow: true, 
    allowManualInsertRow: false, // 关闭手动插入行功能
    allowDeleteColumn: false, // 关闭删除列功能
});


export function settingcheck() {

    const inputslaveid = getInputValue('input_i2c_slaveid'); // 获取输入框的值
    const regex4 = /^0x[0-9a-fA-F]{2}$/; // 定义正则表达式
    if (regex4.test(inputslaveid)) {
        setting_i2c.slaveid = inputslaveid;
    } else {
        logMessage('webconsolelist', 'warning', `SlaveID: ${inputslaveid} 错误的值`);
        return 0;
    }


    const inputpins = getInputValue('input_i2c_signals'); // 获取输入框的值
    const regex = /^[a-zA-Z]\w*,\s*[a-zA-Z]\w*$/; // 定义正则表达式
    if (regex.test(inputpins)) {
        const [scl, sda] = inputpins.split(',').map(s => s.trim()); // 使用 split() 方法将字符串分割成两个部分，并去掉两端的空格
        setting_i2c.scl = scl;
        setting_i2c.sda = sda;
    } else {
        logMessage('webconsolelist', 'warning', `Signals: ${inputpins} 格式错误`);
        return 0;
    }

    const inputwftname = getInputValue('input_i2c_timingsetname'); // 获取输入框的值
    const regex2 = /^[a-zA-Z]\w*$/; // 定义正则表达式
    if (regex2.test(inputwftname)) {
        setting_i2c.wftname = inputwftname;
    } else {
        logMessage('webconsolelist', 'warning', `WFT Name: ${inputwftname} 格式错误`);
        return 0;
    }

    const inputfilename = getInputValue('input_i2c_filename'); // 获取输入框的值
    const regex3 = /\.csv$/i; // 定义正则表达式
    if (regex3.test(inputfilename)) {
        setting_i2c.patternfilename = inputfilename;
    }
    else {
        logMessage('webconsolelist', 'warning', `Filename: ${inputfilename} 格式错误`);
        return 0;
    }

    updatesettingtable(setting_i2c);
    return 1;
}

function updatesettingtable(setting) {
    const tableitem  = [document.getElementById('settingtable_i2c_slaveid'),
                        document.getElementById('settingtable_i2c_sclpin'),
                        document.getElementById('settingtable_i2c_sdapin'),
                        document.getElementById('settingtable_i2c_wftname'),
                        document.getElementById('settingtable_i2c_filename')];
    tableitem[1].textContent = setting.scl;
    tableitem[2].textContent = setting.sda;
    tableitem[3].textContent = setting.wftname;
    tableitem[4].textContent = setting.patternfilename;
    logMessage('webconsolelist','info',`setting_i2c: ${JSON.stringify(setting_i2c)} 更新成功`);
}