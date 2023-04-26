// this is the html script start point
// 2023.4.23
// author: nathan zhu
import { logMessage,AddCommand,settingcheck,setting_i2c,commandlist,commandlist_i2c } from "./utilities.js";
import { sendRequest } from "./server.js";
import { isfileExist } from "./filecheck.js";
// import { pattern_i2c } from "./patterntemplate.js";
// import { getData } from "../import/js/jexcel.js";

// const data = [
//     ['STRAT', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'repeat 10', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'repeat 10', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'repeat 10', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['', 'WFT1', 'nop', '0', '1'],
//     ['STOP', 'WFT1', 'nop', '0', '1'],
//     ];
  
const pattern_i2c = jspreadsheet(document.getElementById('patterntemplate_i2c'), {
    // data: data,
    csv:'./patterntemplate/i2c_write.csv',
    tableOverflow:true,
    tableHeight:'500px',
    // tableWidth:'1000px',
    includeHeadersOnDownload:true,//下载时是否包含表头
    csvHeaders:true,//导入时是否包含表头
    columns: [
      { type: 'text', title: 'Label', width: 120},
      { type: 'text', title: 'WFT', width: 100 },
      { type: 'text', title: 'Sequence', width: 100 },
      { type: 'text', title: 'SCL', width: 200},
      { type: 'text', title: 'SDA', width: 200},
      { type: 'text', title: 'Comment', width: 200},
    ],
    allowSorting: false, // 关闭代码排序功能
    columnSorting: false, // 关闭列排序功能
    columnDrag: true,
});

const binaryMap = {
"0": ["0", "0", "0", "0"],
"1": ["0", "0", "0", "1"],
"2": ["0", "0", "1", "0"],
"3": ["0", "0", "1", "1"],
"4": ["0", "1", "0", "0"],
"5": ["0", "1", "0", "1"],
"6": ["0", "1", "1", "0"],
"7": ["0", "1", "1", "1"],
"8": ["1", "0", "0", "0"],
"9": ["1", "0", "0", "1"],
"a": ["1", "0", "1", "0"],
"b": ["1", "0", "1", "1"],
"c": ["1", "1", "0", "0"],
"d": ["1", "1", "0", "1"],
"e": ["1", "1", "1", "0"],
"f": ["1", "1", "1", "1"],
};

function hexToBinaryArray(hexString) {
    const binaryArray = hexString
        .split("") // 将字符串拆分为单个字符数组
        .map((hex) => binaryMap[hex.toLowerCase()]) // 将每个 16 进制数字转换为长度为 4 的二进制字符串数组
        .flat(); // 将所有二进制字符串数组拼接为一个数组

    return binaryArray;
}
  
  

function consolelog(elm) {

return;
}

function webinit() {
    isfileExist('./patterntemplate/i2c_write.csv').then(exists => console.log('file ./patterntemplate/i2c_write.csv exists: '+ exists));
    // 添加示例项
    const truerowindex = commandlist_i2c.getColumnData(0).length;
    console.log(truerowindex);
    if (commandlist_i2c.getCellFromCoords(0,0).innerText == '') {
        console.log('empty');
        commandlist_i2c.setRowData(0,['C','0x30','0x55']);
    }
    //第一个参数是数组，第二个参数是插入的行号，第三个参数是之前还是之后
    commandlist_i2c.insertRow(['D','0x30','0x55'],truerowindex,false);
    // addItem({"mode":"E", "slaveid":"0x6c","address":"0x03","data":"0xaa"});// 无效的格式，不会添加新项

    
  

    // 示例：添加新的信息
    logMessage('webconsolelist', 'warning', 'Something went wrong!');
    logMessage('webconsolelist', 'danger', 'fatal error!');
    logMessage('webconsolelist', 'info', 'welcome to use this tool!');
    logMessage('webconsolelist', 'info', 'Now this tool is on Ver-0.1 demo for use!');
}
// const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
// const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))



function createfile(){

        // 重复数组元素
        const repeatybinarry  = (binarray,times) => binarray.reduce((acc, val) => acc.concat(Array(times).fill(val)), []);
        console.log(commandlist_i2c.getData());
        const generatorcommand = {"mode":"C","address":"00","data":"00"};
        const command_translist = commandlist_i2c.getData();

        if (settingcheck()) {

            const findIndexes = (array, char) => array.flatMap((element, index) => element === char ? index : []).filter(Boolean);

            const sdadata = pattern_i2c.getColumnData(4);
            
            // 找到所有的 'S' 索引值
            const indexesofsdaslaveid = findIndexes(sdadata, 'S');        
            // 找到所有的 'A' 索引值
            const indexesofsdaaddress = findIndexes(sdadata, 'A');
            // 找到所有的 'D' 索引值
            const indexesofsdaata = findIndexes(sdadata, 'D');

            // sda 采样点数
            const sdarepeattimes = indexesofsdaslaveid.length / 8;
            if ( sdarepeattimes %1 === 0)  {
                logMessage('webconsolelist', 'info', 'pattern template sda column is valid!');
            }
            else {
                logMessage('webconsolelist', 'danger', 'pattern template sda column is invalid!');
                return;
            }
            // 获取所有的数据
            const alldata = pattern_i2c.getData();

            // pattern 切片
            const start_zone = alldata.slice(0, indexesofsdaslaveid[0]);
 

            const slaveid_zone = alldata.slice(indexesofsdaslaveid[0] , indexesofsdaslaveid[indexesofsdaslaveid.length -1] + 1);
  

            const address_zone = alldata.slice(indexesofsdaaddress[0] , indexesofsdaaddress[indexesofsdaaddress.length -1] + 1);
    

            const data_zone = alldata.slice(indexesofsdaata[0] , indexesofsdaata[indexesofsdaata.length -1] + 1);


            const ack_zone = alldata.slice(indexesofsdaslaveid[indexesofsdaslaveid.length -1] + 1, indexesofsdaaddress[0]);


            const end_zone = alldata.slice(indexesofsdaata[indexesofsdaata.length -1] + 1 + ack_zone.length, alldata.length);

            // 拼接pattern
            let compeletepatterndata = [];
            for (const item of command_translist) {
                //转换前去掉 0x 
                let slaveid_bin_array = hexToBinaryArray(setting_i2c.slaveid.replace('0x',''));
                let address_bin_array = hexToBinaryArray(item[1].replace('0x',''));
                let data_bin_array = hexToBinaryArray(item[2].replace('0x',''));

                // 将slaveid写入进slaveid_zone
                slaveid_bin_array = repeatybinarry(slaveid_bin_array,sdarepeattimes);
                for (let rowindex in slaveid_zone)
                {
                    slaveid_zone[rowindex][4] = slaveid_bin_array[rowindex];
                }
                console.log("slaveid_zone")
                console.log(slaveid_zone);
                // 将address写入进address_zone
                address_bin_array = repeatybinarry(address_bin_array,sdarepeattimes);
                for (let rowindex in address_zone)
                {
                    address_zone[rowindex][4] = address_bin_array[rowindex];
                }
                console.log("address_zone")
                console.log(address_zone);
                // 将data写入进data_zone
                data_bin_array = repeatybinarry(data_bin_array,sdarepeattimes);
                for (let rowindex in data_zone)
                {
                    data_zone[rowindex][4] = data_bin_array[rowindex];
                }
                console.log("data_zone")
                console.log(data_zone);
                compeletepatterndata = compeletepatterndata.concat(slaveid_zone, ack_zone,address_zone,ack_zone,data_zone);
            }
            compeletepatterndata = start_zone.concat(compeletepatterndata,end_zone);
            console.log("compeletepatterndata")
            console.log(compeletepatterndata);
            const new_pattern = jspreadsheet(document.getElementById('new_pattern'), {
                data: compeletepatterndata,
                // includeHeadersOnDownload:true,
                columns: [
                { type: 'text', title: 'Label', width: 120},
                { type: 'text', title: 'WFT', width: 100 },
                { type: 'text', title: 'Sequence', width: 100 },
                { type: 'text', title: 'SCL', width: 200},
                { type: 'text', title: 'SDA', width: 200},
                { type: 'text', title: ' ', width: 200},
                ],
                allowSorting: false, // 关闭代码排序功能
                columnSorting: false, // 关闭列排序功能
                columnDrag: true,
            });

            new_pattern.setHeader(3,setting_i2c.scl);
            new_pattern.setHeader(4,setting_i2c.sda);
            new_pattern.options.csvFileName = setting_i2c.patternfilename.replace(/.csv/g, '');
            new_pattern.download(true);
        
        }
}

// 初始化
webinit();
//添加按钮监听事件，当点击按钮时，执行getInputValue函数
const addbutton = document.getElementById('button_i2c_addcommand');
addbutton.addEventListener('click', AddCommand);
const settingbutton = document.getElementById('button_i2c_settingcheck');
settingbutton.addEventListener('click', settingcheck);
const createbutton = document.getElementById('button_i2c_create');
createbutton.addEventListener('click', createfile);
const co =  document.getElementById('consolelog');
co.addEventListener('click', consolelog );