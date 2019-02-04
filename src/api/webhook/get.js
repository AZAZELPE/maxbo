'use strict';
const jsUtils = require('../../jsUtils/jsUtils');

module.exports.main = async (event, context) => {
  
  jsUtils.consoleLog('INFO',event);

  let response = {
    statusCode: 404
  };

  let VERIFY_TOKEN = "yqGDQWskUvTnGLruxnexQ8P3V4h5ka";
  
  // Parse the query params
  let mode = event.queryStringParameters["hub.mode"];
  let token = event.queryStringParameters["hub.verify_token"];
  let challenge = event.queryStringParameters["hub.challenge"];
  
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      
      response = {
        statusCode: 200,
        headers: {
          "Content-Type" : "text/plain"
        },
        body: challenge
      };
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      response = {
        statusCode: 403
      }; 

    }
  }

  jsUtils.consoleLog('INFO',response);

  return response;
};
