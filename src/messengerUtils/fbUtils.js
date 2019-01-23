const jsUtils = require('../jsUtils/jsUtils');
const request = require('request');

const PAGE_ACCESS_TOKEN = "EAAJ9y8vys9ABAG4oZCWM1RPm4BU9XLibaq3mZAYmIXy1I5aXfN0vmjx9ZCX5upOLZB515NbefZAOBLrZCGawFnOjmqxlZB8c3ZCZCB0ltZB7ZC8kylwk4tsZCDxdxQd97DxwPCZCn0X955ZAkkxUbj6vXjkApMlK6awY8A5ZBWbmpiRi4B58SvxcWkKr70v";

//Envia un mensaje a FB, ingresar id del usuario a enviar y el mensaje
let sendMessage2FB = async (sender_psid, message) => {

  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": {
      "text": message
    }
  }

  return await new Promise((resolve, reject) => {
    request({
      "uri": "https://graph.facebook.com/v2.6/me/messages",
      "qs": { "access_token": PAGE_ACCESS_TOKEN },
      "method": "POST",
      "json": request_body
    }, (err, res, body) => {
      if (!err) {
        jsUtils.consoleLog('INFO','message sent!');
        resolve(res);
      } else {
        jsUtils.consoleLog('ERR','Unable to send message:' + err);
        reject(err);
      }
    });
  });

}

module.exports.sendMessage2FB = sendMessage2FB;