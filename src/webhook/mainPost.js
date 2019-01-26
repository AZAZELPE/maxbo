'use strict';

const jsUtils = require('../jsUtils/jsUtils');
const fbUtils = require('../messengerUtils/fbUtils');
//const testing = require('../business/testing/foolingAround');
const bussines = require('../business/historyPath');
const c = require('../business/constants');

/*let handleMessage = async (sender_psid, received_message) => {
  let message;

  message = testing.pruebas(sender_psid, received_message);

  await fbUtils.sendMessage2FB(sender_psid, message);

  return "";
};*/


module.exports.main = async (event, context) => {

  let response;

  let body = JSON.parse(event.body);
  jsUtils.consoleLog('INFO',body);
  
  if (body.object === 'page') {

    // Iterate over each entry - there may be multiple if batched
    for (const entry of body.entry) {

      let webhook_event = entry.messaging[0];
      let sender_psid = webhook_event.sender.id;
      let messages;

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        messages = await bussines.evaluatePath(c.TYPE_MESSAGE, webhook_event.message.text,sender_psid);
      } 
      else if (webhook_event.postback) {
        messages = await bussines.evaluatePath(c.TYPE_POSTBACK, webhook_event.postback.payload,sender_psid);
      }

      for(let message of messages) {
        await fbUtils.sendMessage2FB(sender_psid, message);
      }
      
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

