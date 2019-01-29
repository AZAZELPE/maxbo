const dynamo = require('../awsUtils/dynamoUtils');

module.exports.main = async (event, context) => {

  let customerId = event.pathParameters.id;
  let contactInfo = JSON.parse(event.body);

  await dynamo.saveContactDataFromCustomer(customerId,contactInfo);
  let mybody = await dynamo.getContactDataFromCustomer(customerId);

  console.log(mybody);
  
  let response = {
    statusCode: 200,
    "headers": {
      "X-Requested-With": '*',
      "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
      "Access-Control-Allow-Origin": '*',
      "Access-Control-Allow-Methods": 'POST,GET,OPTIONS',
      "Access-Control-Allow-Credentials" : true
    },
    body: JSON.stringify(mybody)
  }

  return response;

}