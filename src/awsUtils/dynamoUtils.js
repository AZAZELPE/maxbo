const jsUtils = require('../jsUtils/jsUtils');
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

let lookUpByFilter = async (filter) => {

  let data;
  
  const params = {
    TableName: tableName
  };

  data = await call("scan",params);
  
  return data.Items.filter((data)=> data.tipoData == 'producto')
                  .filter((product) => product[filter.apunta].toString().toUpperCase() == filter.nombre.toString().toUpperCase());

};

module.exports.lookUpPostbackItem = lookUpPostbackItem;
module.exports.lookUpFilters = lookUpFilters;
module.exports.lookUpByFilter = lookUpByFilter;
