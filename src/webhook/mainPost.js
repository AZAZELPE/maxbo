'use strict';

const jsUtils = require('../jsUtils/jsUtils');
const fbUtils = require('../messengerUtils/fbUtils')


let handleMessage = async (sender_psid, received_message) => {
  let message;

  if (received_message.text === 'CATALOGO') { 
    let buttons = [fbUtils.buildSelectButton('select')];
    
    let elements = [];

    elements.push(fbUtils.buildElementWithImage("Vino Tinto","Lo mejor de los vinos tintos para ti",buttons,"https://heredadaduna.com/wp-content/uploads/2017/02/vino_tinto_rioja.jpg"));
    elements.push(fbUtils.buildElementWithImage("Vino Blanco","Lo mejor de los vinos blancos para ti",buttons,"https://www.vinetur.com/imagenes/2017/junio/6/vino_blanco.jpg"));
    elements.push(fbUtils.buildElementWithImage("Vino Rosado","Lo mejor de los vinos rosados para ti",buttons,"https://vinosdiferentes.com/wp-content/uploads/2016/06/como-elaborar-vino-rosado.png"));
    elements.push(fbUtils.buildElementWithImage("Champagne","El mejor champagne para ti",buttons,"https://static.vinepair.com/wp-content/uploads/2017/11/vintage-internal.jpg"));

    message = fbUtils.buildListTemplate('large',elements);

  }

  if (received_message.text === 'telefono') { 
    let buttons = [fbUtils.buildSelectButton('select')];
    
    message = {"text": "Here is a quick reply!",
    "quick_replies":[
      {
        "content_type":"user_phone_number"
      }
    ]};

  }
  
  if (received_message.text === 'email') { 
    let buttons = [fbUtils.buildSelectButton('select')];
    
    message = {"text": "Here is a quick reply!",
    "quick_replies":[
      {
        "content_type":"user_email"
      }
    ]};

  }

  if (received_message.text === 'gps') { 
    let buttons = [fbUtils.buildSelectButton('select')];
    
    message = {"text": "Here is a quick reply!",
    "quick_replies":[
      {
        "content_type":"location"
      }
    ]};

  }

  await fbUtils.sendMessage2FB(sender_psid, message);

  return "";
};


module.exports.main = async (event, context) => {

  let response;

  let body = JSON.parse(event.body);
  jsUtils.consoleLog('INFO',body);
  
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    for (const entry of body.entry) {

      let webhook_event = entry.messaging[0];
      let sender_psid = webhook_event.sender.id;

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        await handleMessage(sender_psid, webhook_event.message);
      } 
      //else if (webhook_event.postback) {
      //  handlePostback(sender_psid, webhook_event.postback);
      //}
  
    }

    response = {
      statusCode: 200,
      headers: {
        "Content-Type" : "text/plain"
      },
      body: 'EVENT_RECEIVED'
    };

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    response = {
      statusCode: 404}
   
  }

  return response;

};

