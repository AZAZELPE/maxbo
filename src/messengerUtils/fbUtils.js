const jsUtils = require('../jsUtils/jsUtils');
const request = require('request');

const PAGE_ACCESS_TOKEN = "EAAJ9y8vys9ABABj6s7VBtaMv6DjY47xaQQPqUFUCgbulTBPaZCK0mSOD8afgIFgedGA4Me4KZCcy031DvAkjsq4A44QwXAIlRjpfWh6F5upuT9EMLj0XVoXXNS31xZCsh0ZAR3vqOPKB5mzsfjCan4csq7IGsIL8GMvElga6ZBktn5ZAMcPZBOK";

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

//Tipos de Respuestas (Plantillas que nos da FB)
let buildGenericTemplate = () => {

  return {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"Welcome!",
            "image_url":"https://res.cloudinary.com/practicaldev/image/fetch/s--ciMqVBs6--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://raw.githubusercontent.com/adnanrahic/cdn/master/trigger-lambda-sns/sls-aws-lambda-sns3.png",
            "subtitle":"We have the right hat for everyone.",
            "default_action": {
              "type": "web_url",
              "url": "https://petersfancybrownhats.com/view?item=103",
              "messenger_extensions": false,
              "webview_height_ratio": "tall",
              "fallback_url": "https://petersfancybrownhats.com/"
            },
            "buttons":[
              {
                "type":"web_url",
                "url":"https://petersfancybrownhats.com",
                "title":"View Website"
              },{
                "type":"postback",
                "title":"Start Chatting",
                "payload":"DEVELOPER_DEFINED_PAYLOAD"
              }              
            ]      
          }
        ]
      }
    }
  }

}

module.exports.sendMessage2FB = sendMessage2FB;