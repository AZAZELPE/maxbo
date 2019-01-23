'use strict';

const jsUtils = require('../jsUtils/jsUtils');
const fbUtils = require('../messengerUtils/fbUtils')


let handleMessage = async (sender_psid, received_message) => {
  let message;

  if (received_message.text) { 
    message = `You sent the message: "${received_message.text}". Now send me an image!`;   
  }

  await fbUtils.sendMessage2FB(sender_psid,message);

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
