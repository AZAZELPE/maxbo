const dynamo = require('../../../awsUtils/dynamoUtils');

module.exports.main = async (event, context) => {

  const customerId = event.pathParameters.customerId;
  const newCustomerData = JSON.parse(event.body);

  await dynamo.saveContactDataFromCustomer(customerId,newCustomerData);
  const customerData = await dynamo.getContactDataFromCustomer(customerId);

  console.log(customerData);
  
  const response = {
    statusCode: 200,
    "headers": {
      "X-Requested-With": '*',
      "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,x-requested-with',
      "Access-Control-Allow-Origin": '*',
      "Access-Control-Allow-Methods": 'POST,GET,OPTIONS',
      "Access-Control-Allow-Credentials" : true
    },
    body: JSON.stringify(customerData)
  }

  return response;

}