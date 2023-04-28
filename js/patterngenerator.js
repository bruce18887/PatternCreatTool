import { SplitLabelsToArray,logMessage } from "./utilities.js";
//i2c_data_zone 数组 0为 write pattern 1为 read pattern
export const i2c_zone =[{
    "start_zone": [],
    "slaveid_zone": [],
    "address_zone": [],
    "data_zone": [],
    "ack_zone": [],
    "end_zone": []
},{
    "start_zone": [],
    "slaveid_zone": [],
    "address_zone": [],
    "data_zone": [],
    "ack_zone": [],
    "nack_zone": [],
    "end_zone": []
}];
// 找到数组中所有的某个字符的索引值
const findIndexes = (array, char) => array.flatMap((element, index) => element === char ? index : []).filter(Boolean);

// 找到sheet中的某个header的索引值，比如找到SDA的索引值
export function findHeaderIndex(str, sheet)
{
    const arr = SplitLabelsToArray(sheet.getHeaders());
    for(let index in arr) {
        if (arr[index] === str) {
            return index;
        }
    }
    logMessage('webconsolelist', 'danger', `in pattern template, Header: ${str} 不存在`);
    return -1;
}

export function GetPatternZoneIndexes(sheet,sdapinname)
{
    const sdadata = sheet.getColumnData(findHeaderIndex(sdapinname, sheet));
    return {
        "SlaveIDIndexes": findIndexes(sdadata, 'S'),
        "AddressIndexes": findIndexes(sdadata, 'A'),
        "DataIndexes": findIndexes(sdadata, 'D'),
    };
}



export function PatternSlice(i2c_indexes,i2c_sheets)
{
    const i2c_all_data = [i2c_sheets[0].getData(),i2c_sheets[1].getData()];
    // write pattern 切片
    i2c_zone[0].start_zone = i2c_all_data[0].slice(0, i2c_indexes[0].SlaveIDIndexes[0]);
    i2c_zone[0].slaveid_zone = i2c_all_data[0].slice(i2c_indexes[0].SlaveIDIndexes[0] , i2c_indexes[0].SlaveIDIndexes[i2c_indexes[0].SlaveIDIndexes.length -1] + 1);
    i2c_zone[0].address_zone = i2c_all_data[0].slice(i2c_indexes[0].AddressIndexes[0] , i2c_indexes[0].AddressIndexes[i2c_indexes[0].AddressIndexes.length -1] + 1);
    i2c_zone[0].data_zone = i2c_all_data[0].slice(i2c_indexes[0].DataIndexes[0] , i2c_indexes[0].DataIndexes[i2c_indexes[0].DataIndexes.length -1] + 1);
    i2c_zone[0].ack_zone = i2c_all_data[0].slice(i2c_indexes[0].SlaveIDIndexes[i2c_indexes[0].SlaveIDIndexes.length -1] + 1, i2c_indexes[0].AddressIndexes[0]);
    i2c_zone[0].end_zone = i2c_all_data[0].slice(i2c_indexes[0].DataIndexes[i2c_indexes[0].DataIndexes.length -1] + 1 + i2c_zone[0].ack_zone.length, i2c_all_data[0].length);

    // read pattern 切片 
    //由于协议中slaveid 会重复一次，所以除2，只切取前面一半
    i2c_zone[1].start_zone = i2c_all_data[1].slice(0, i2c_indexes[1].SlaveIDIndexes[0]);
    i2c_zone[1].slaveid_zone = i2c_all_data[1].slice(i2c_indexes[1].SlaveIDIndexes[0] , i2c_indexes[1].SlaveIDIndexes[i2c_indexes[1].SlaveIDIndexes.length / 2 -1] + 1);
    i2c_zone[1].address_zone = i2c_all_data[1].slice(i2c_indexes[1].AddressIndexes[0] , i2c_indexes[1].AddressIndexes[i2c_indexes[1].AddressIndexes.length -1] + 1);
    i2c_zone[1].data_zone = i2c_all_data[1].slice(i2c_indexes[1].DataIndexes[0] , i2c_indexes[1].DataIndexes[i2c_indexes[1].DataIndexes.length -1] + 1);
    i2c_zone[1].ack_zone = i2c_all_data[1].slice(i2c_indexes[1].SlaveIDIndexes[i2c_indexes[1].SlaveIDIndexes.length/2 -1] + 1, i2c_indexes[1].AddressIndexes[0]);
    i2c_zone[1].nack_zone = i2c_all_data[1].slice(i2c_indexes[1].DataIndexes[i2c_indexes[1].DataIndexes.length -1] + 1, i2c_indexes[1].DataIndexes[i2c_indexes[1].DataIndexes.length -1] + 1 + i2c_zone[1].ack_zone.length);
    i2c_zone[1].end_zone = i2c_all_data[1].slice(i2c_indexes[1].DataIndexes[i2c_indexes[1].DataIndexes.length -1] + 1 + i2c_zone[1].nack_zone.length, i2c_all_data[1].length);

}


