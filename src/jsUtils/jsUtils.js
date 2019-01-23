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

module.exports.consoleLog = consoleLog;