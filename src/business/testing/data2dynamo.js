const AWS = require('aws-sdk');
const catalogo = require("./data");
const jsUtils = require('../../jsUtils/jsUtils');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const productsTableName= process.env.productsTableName;

module.exports.main = async (event, context) => {
  
  let response;
  let params;

  let data = catalogo.catalogoTest;

  response = {
    statusCode: 200,
    body: "Se insertaron los items"
  };

  for(const item of data) {
    params = {
      TableName: productsTableName,
      Item: item
    };

    try {
      let res = await dynamoDbPut(params);
      jsUtils.consoleLog('INFO',res);

    } catch (error) {
      jsUtils.consoleLog('INFO',item);
      response = {
        statusCode: 500,
        body: error
      };
      break;
    }

  }

  return response;
};

let dynamoDbPut = (params) => {

  return new Promise((resolve,reject) => {
    dynamoDb.put(params, (error, data) => {
      if (error) {
        reject(error);
      }  
      resolve(params.Item)
    });
  });

}


