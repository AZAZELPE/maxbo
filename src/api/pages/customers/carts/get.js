const dynamo = require('../../../../awsUtils/dynamoUtils');

module.exports.main = async (event, context) => {

  const customerId = event.pathParameters.customerId;
  
  const cart = await dynamo.getCartFromCustomer(customerId);
  
  console.log(cart);

  const response = {
    statusCode: 200,
    headers: {
      "X-Requested-With": '*',
      "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
      "Access-Control-Allow-Origin": '*',
      "Access-Control-Allow-Methods": 'POST,GET,OPTIONS',
      "Access-Control-Allow-Credentials" : true
    },
    body: JSON.stringify(cart)
  }

  return response;

}