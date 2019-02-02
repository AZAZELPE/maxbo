let consoleLog = (type, data) => {
    let mydata = JSON.stringify(data,null,4);

    if(type === 'INFO') {
        console.log(`INFO:\t${mydata}`);
    } else if(type === 'WARN') {
        console.log(`WARN:\t${mydata}`);
    } else if(type === 'ERR') {
        console.error(`ERR:\t${mydata}`);
    }
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

module.exports.consoleLog = consoleLog;
module.exports.IsJsonString = IsJsonString;