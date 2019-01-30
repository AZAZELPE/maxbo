const jsUtils = require('../jsUtils/jsUtils');
const request = require('request');

const PAGE_ACCESS_TOKEN = "EAAJ9y8vys9ABABj6s7VBtaMv6DjY47xaQQPqUFUCgbulTBPaZCK0mSOD8afgIFgedGA4Me4KZCcy031DvAkjsq4A44QwXAIlRjpfWh6F5upuT9EMLj0XVoXXNS31xZCsh0ZAR3vqOPKB5mzsfjCan4csq7IGsIL8GMvElga6ZBktn5ZAMcPZBOK";

//Recoge los datos de la persona usando un GET a la url definida por google
let getProfileFromFB = async (sender_psid) => {

  return await new Promise((resolve, reject) => {
    request({
      "uri": `https://graph.facebook.com/${sender_psid}`,
      "qs": { 
        "fields": "first_name,last_name,profile_pic",
        "access_token": PAGE_ACCESS_TOKEN 
      },
      "method": "GET"
    }, (err, res, body) => {
      if (!err) {
        let result = JSON.parse(res.body);
        jsUtils.consoleLog('INFO',`read profile from ${sender_psid}: ${result.first_name} ${result.last_name}!`);
        resolve(result);
      } else {
        jsUtils.consoleLog('ERR','Unable to send message:' + err);
        reject(err);
      }
    });
  });

};


//Envia un mensaje a FB, ingresar id del usuario a enviar y el mensaje
let sendMessage2FB = async (sender_psid, message) => {

  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": message
  }

  jsUtils.consoleLog('INFO',request_body);

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

};


let buildPostbackButton = (title, payload) => {
  return {      
    "type":"postback",
    "title":title,
    "payload":payload
  }
};

let buildWebButton = (title, weburl) => {
  return {
    "type":"web_url",
    "url":weburl,
    "title":title
  }  
}

let buildSelectButton = (payload) => {
  return {
    "type":"postback",
    "title":"Seleccionar",
    "payload":payload
  }
};

let buildElement = (title, subtitle, buttons) => {

  return {
    "title":title,
    "subtitle":subtitle,
    "buttons": buttons
  }
};

let buildElementWithImage = (title, subtitle, buttons, imageUrl) => {
  return {
    "title":title,
    "image_url":imageUrl,
    "subtitle":subtitle,
    "buttons": buttons
  }
};

let buildGenericTemplate = (elements) => {
  return {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements": elements
      }
    }
  }
};

//style : compact or large
let buildListTemplate = (style, elements) => {
  return {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"list",
        "top_element_style": style,
        "elements": elements
      }
    }
  }
};

let buildTextTemplate = (text) => {
  return {
    "text":text
  }
};

let buildQuickResponseDefined = (type, text) => {
  return {"text": text,
  "quick_replies":[
    {
      "content_type":type
    }
  ]};
};

let buildQuickResponse = (text, buttonTitle, payload) => {
  return {"text": text,
  "quick_replies":[
    {
      "content_type":"text",
      "title": buttonTitle,
      "payload": payload
    }
  ]};
};


module.exports.getProfileFromFB = getProfileFromFB;
module.exports.sendMessage2FB = sendMessage2FB;
module.exports.buildPostbackButton = buildPostbackButton;
module.exports.buildElement = buildElement;
module.exports.buildElementWithImage = buildElementWithImage;
module.exports.buildGenericTemplate = buildGenericTemplate;
module.exports.buildSelectButton = buildSelectButton;
module.exports.buildListTemplate = buildListTemplate;
module.exports.buildTextTemplate = buildTextTemplate;
module.exports.buildQuickResponseDefined = buildQuickResponseDefined;
module.exports.buildQuickResponse = buildQuickResponse;
module.exports.buildWebButton = buildWebButton;