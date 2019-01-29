const dynamo = require('../awsUtils/dynamoUtils');

module.exports.main = async (event, context) => {

  let customerId = event.pathParameters.id;
  let contactInfo = JSON.parse(event.body);

  await dynamo.saveContactDataFromCustomer(customerId,contactInfo);
  let mybody = await dynamo.getContactDataFromCustomer(customerId);

  console.log(mybody);
  
  let response = {
    statusCode: 200,
    body: JSON.stringify(mybody)
  }

  return response;

}