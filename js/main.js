// this is the html script start point
// 2023.4.23
// author: nathan zhu
import { logMessage,
    AddCommand,
    settingcheck,
    setting_i2c,
    commandlist,
    commandlist_i2c ,
    callTerminator,
    SplitLabelsToArray,
    remove0x,
} from "./utilities.js";
import { sendRequest } from "./server.js";
import { isfileExist } from "./filecheck.js";
import { hexToBinaryArray } from "./format.js";
import { PatternSlice,
    i2c_zone,
    GetPatternZoneIndexes,
    findHeaderIndex,
 } from "./patterngenerator.js";

const sheets = [
    {
        sheetName: 'i2c_write',
        csv:'./patterntemplate/i2c_write.csv',
        tableOverflow:true,
        tableHeight:'500px',
        tableWidth:'850px',
        includeHeadersOnDownload:true,//下载时是否包含表头
        csvHeaders:true,//导入时是否包含表头
        columns: [
          { type: 'text', title: 'Label', width: 120},
          { type: 'text', title: 'WFT', width: 100 },
          { type: 'text', title: 'Sequence', width: 100 },
          { type: 'text', title: 'SCL', width: 100},
          { type: 'text', title: 'SDA', width: 100},
          { type: 'text', title: 'Comment', width: 200},
        ],
        allowSorting: false, // 关闭代码排序功能
        columnSorting: false, // 关闭列排序功能
        columnDrag: true,
    },
    {
        sheetName: 'i2c_read',
        csv:'./patterntemplate/i2c_read.csv',
        tableOverflow:true,
        tableHeight:'500px',
        tableWidth:'850px',
        includeHeadersOnDownload:true,//下载时是否包含表头
        csvHeaders:true,//导入时是否包含表头
        columns: [
          { type: 'text', title: 'Label', width: 120},
          { type: 'text', title: 'WFT', width: 100 },
          { type: 'text', title: 'Sequence', width: 100 },
          { type: 'text', title: 'SCL', width: 100},
          { type: 'text', title: 'SDA', width: 100},
          { type: 'text', title: 'Comment', width: 200},
        ],
        allowSorting: false, // 关闭代码排序功能
        columnSorting: false, // 关闭列排序功能
        columnDrag: true,
    }
];

jspreadsheet.tabs(document.getElementById('patterntemplate_i2c'), sheets);
const i2c_sheets = [document.getElementById('patterntemplate_i2c').jexcel[0],document.getElementById('patterntemplate_i2c').jexcel[1]];
const format_judge = {'D':0,'C':1};
function consolelog() {
    const modeselect = document.getElementById('i2c_mode_select');
    console.log(modeselect.value);
}

function webinit() {
    

    Promise.all([
        isfileExist('./patterntemplate/i2c_write.csv'),
        isfileExist('./patterntemplate/i2c_write.csv')
      ])
      .then(results => {
        if (results[0] && results[1]) {
          callTerminator('file \n ./patterntemplate/i2c_write.csv \n ./patterntemplate/i2c_read.csv exists');
        } else {
          callTerminator('file \n ./patterntemplate/i2c_write.csv \n ./patterntemplate/i2c_read.csv does not exist');
        }
    });
    

    // 添加示例项
    const truerowindex = commandlist_i2c.getColumnData(0).length;
    // console.log(truerowindex);
    if (commandlist_i2c.getCellFromCoords(0,0).innerText == '') {
        commandlist_i2c.setRowData(0,['C','0x30','0x55']);
    }
    //第一个参数是数组，第二个参数是插入的行号，第三个参数是之前还是之后
    // commandlist_i2c.insertRow(['C','0x30','0x55'],truerowindex,false);
    // addItem({"mode":"E", "slaveid":"0x6c","address":"0x03","data":"0xaa"});// 无效的格式，不会添加新项

    // 示例：添加新的信息
    logMessage('webconsolelist', 'warning', 'Something went wrong!');
    logMessage('webconsolelist', 'danger', 'fatal error!');
    logMessage('webconsolelist', 'info', 'welcome to use this tool!');
    logMessage('webconsolelist', 'info', 'Now this tool is on Ver-0.2 demo for use!');
}
// const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
// const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))



function createfile(){

        // 重复数组元素
        const repeatybinarry  = (binarray,times) => binarray.reduce((acc, val) => acc.concat(Array(times).fill(val)), []);

        if (settingcheck()) {
            const i2c_indexes = [GetPatternZoneIndexes(i2c_sheets[0],'SDA'),GetPatternZoneIndexes(i2c_sheets[1],'SDA')]
            const i2c_comment_header_index = [findHeaderIndex('Comment',i2c_sheets[0]),findHeaderIndex('Comment',i2c_sheets[1])];
            const i2c_sda_pin_index = [findHeaderIndex('SDA',i2c_sheets[0]),findHeaderIndex('SDA',i2c_sheets[1])];
            // sda 采样点数
            const i2c_repeat_times = [i2c_indexes[0].SlaveIDIndexes.length / 8,i2c_indexes[1].SlaveIDIndexes.length / 16];
            if ( i2c_repeat_times[0] %1 === 0 && i2c_repeat_times[1] %1 === 0)  {
                logMessage('webconsolelist', 'info', "The pattern template's number of sampling points detection is valid!");
            }
            else {
                logMessage('webconsolelist', 'danger', 'The pattern template has an incorrect number of sampling points, it must be a multiple of 8.!');
                return;
            }
            // Pattern切片
            PatternSlice(i2c_indexes,i2c_sheets);
            
            // 声明pattern原始数据
            let FullPatternData = [];
            for (const item of commandlist_i2c.getData()) {
                // add comment to the trans start
                i2c_zone[format_judge[item[0]]].slaveid_zone[0][i2c_comment_header_index[format_judge[item[0]]]] = '//' + setting_i2c.slaveid;
                i2c_zone[format_judge[item[0]]].address_zone[0][i2c_comment_header_index[format_judge[item[0]]]] = '//' + item[1];
                i2c_zone[format_judge[item[0]]].data_zone[0][i2c_comment_header_index[format_judge[item[0]]]] = '//' + item[2];
                //去掉0x,并转换为二进制数组再根据采样次数重复
                const slaveid_bin_array = repeatybinarry(hexToBinaryArray(setting_i2c.slaveid.replace('0x','')),i2c_repeat_times[format_judge[item[0]]]);
                const address_bin_array = repeatybinarry(hexToBinaryArray(item[1].replace('0x','')),i2c_repeat_times[format_judge[item[0]]]);
                const data_bin_array = repeatybinarry(hexToBinaryArray(item[2].replace('0x','')),i2c_repeat_times[format_judge[item[0]]]);
                // 将slaveid写入进slaveid_zone
                i2c_zone[format_judge[item[0]]].slaveid_zone.forEach((row, rowindex) => row[i2c_sda_pin_index[format_judge[item[0]]]] = slaveid_bin_array[rowindex]);
                // 将address写入进address_zone
                i2c_zone[format_judge[item[0]]].address_zone.forEach((row, rowindex) => row[i2c_sda_pin_index[format_judge[item[0]]]] = address_bin_array[rowindex]);
                // 判断是否为读取模式
                if (format_judge[item[0]] === 0) {
                    // 将data写入进data_zone
                    i2c_zone[format_judge[item[0]]].data_zone.forEach((row, rowindex) => row[i2c_sda_pin_index[format_judge[item[0]]]] = data_bin_array[rowindex]);
                    //拼接中间的pattern数据
                    FullPatternData = FullPatternData.concat(
                        i2c_zone[format_judge[item[0]]].slaveid_zone, 
                        i2c_zone[format_judge[item[0]]].ack_zone,
                        i2c_zone[format_judge[item[0]]].address_zone,
                        i2c_zone[format_judge[item[0]]].ack_zone,
                        i2c_zone[format_judge[item[0]]].data_zone,
                        i2c_zone[format_judge[item[0]]].ack_zone
                    );
                }
               else{
                    i2c_zone[format_judge[item[0]]].data_zone.forEach((row, rowindex) => row[i2c_sda_pin_index[format_judge[item[0]]]] = data_bin_array[rowindex]==='1' ? 'H' : 'L');
                    //拼接中间的pattern数据1
                    FullPatternData = FullPatternData.concat(
                        i2c_zone[format_judge[item[0]]].slaveid_zone, 
                        i2c_zone[format_judge[item[0]]].ack_zone,
                        i2c_zone[format_judge[item[0]]].address_zone,
                        i2c_zone[format_judge[item[0]]].ack_zone,
                    );
                    //将后面的slaveid rw位改为1,表示为读取模式
                    for (let index = 0; index < i2c_repeat_times[format_judge[item[0]]]; index++) {
                        i2c_zone[format_judge[item[0]]].slaveid_zone[i2c_zone[format_judge[item[0]]].slaveid_zone.length-1-index][i2c_sda_pin_index[format_judge[item[0]]]] = '1';
                    }
                    //拼接中间的pattern数据2
                    FullPatternData = FullPatternData.concat(
                        i2c_zone[format_judge[item[0]]].start_zone,
                        i2c_zone[format_judge[item[0]]].slaveid_zone,
                        i2c_zone[format_judge[item[0]]].ack_zone,
                        i2c_zone[format_judge[item[0]]].data_zone,
                        i2c_zone[format_judge[item[0]]].nack_zone
                    );
               }
            }
            //拼接完整的pattern数据
            FullPatternData = i2c_zone[0].start_zone.concat(FullPatternData,i2c_zone[0].end_zone);
            console.log("compeletepatterndata")
            console.log(FullPatternData);
            const new_pattern = jspreadsheet(document.getElementById('new_pattern'), {
                data: FullPatternData,
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