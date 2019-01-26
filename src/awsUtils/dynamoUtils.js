const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.tableName;

let call = (action, params) => {
  return dynamoDb[action](params).promise();
}

let lookUpPostbackItem = async (postbackIntent) => {

  const params = {
    Key: {
      "id": postbackIntent
    },
    TableName: tableName
  };

  return await call("get",params);

};

let lookUpFilters = async () => {

  let data;
  
  const params = {
    TableName: tableName
  };

  data = await call("scan",params);

  return data.Items.filter((data)=> data.tipoData == 'filtro');

};

module.exports.lookUpPostbackItem = lookUpPostbackItem;
module.exports.lookUpFilters = lookUpFilters;
