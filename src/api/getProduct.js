const dynamo = require('../awsUtils/dynamoUtils');

module.exports.main = async (event, context) => {

  let productId = event.pathParameters.id;
  
  let mybody = await dynamo.lookUpPostbackItem(productId);
  let product = mybody.Item;

  let response = {
    statusCode: 200,
    body: JSON.stringify(product)
  }

  return response;

}