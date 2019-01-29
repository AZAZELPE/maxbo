const jsUtils = require('../jsUtils/jsUtils');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const productsTableName = process.env.productsTableName;
const customersTableName = process.env.customersTableName;

// GENERICS
let call = (action, params) => {
  return dynamoDb[action](params).promise();
}



//TABLE: PRODUCTOS

let lookUpPostbackItem = async (postbackIntent) => {

  const params = {
    Key: {
      "id": postbackIntent
    },
    TableName: productsTableName
  };

  return await call("get",params);

};

let lookUpFilters = async () => {

  let data;
  
  const params = {
    TableName: productsTableName
  };

  data = await call("scan",params);

  return data.Items.filter((data)=> data.tipoData == 'filtro');

};

let lookUpByFilter = async (filter) => {

  let data;
  
  const params = {
    TableName: productsTableName
  };

  data = await call("scan",params);
  
  return data.Items.filter((data)=> data.tipoData == 'producto')
                  .filter((product) => product[filter.apunta].toString().toUpperCase() == filter.nombre.toString().toUpperCase());

};



// TABLE: CUSTOMERS

let saveCustomer = async (customer) => {

  const params = {
    TableName: customersTableName,
    Item: customer
  }

  return await call("put",params);
}

let getCustomer = async (customerId) => {
  
  const paramsGet = {
    TableName: customersTableName,
    Key: {
      "id": customerId
    }
  };

  let customer = await call("get",paramsGet);

  return customer.Item;
}

let getContactDataFromCustomer = async (customerId) => {

  let customer = await getCustomer(customerId);

  jsUtils.consoleLog('INFO',customer)

  let contactInfo = {
    "address": customer.address,
    "cellphone": customer.cellphone
  }

  return contactInfo;
}

let saveContactDataFromCustomer = async (customerId,contactInfo) => {

  let customer = await getCustomer(customerId);

  jsUtils.consoleLog('INFO',customer)

  customer['address'] = contactInfo.address;
  customer['cellphone'] = contactInfo.cellphone;

  return await saveCustomer(customer);
}

let getCartFromCustomer = async (customerId) => {

  let customer = await getCustomer(customerId);
  return customer.cart;

}

let saveProducto2Cart = async (product, customerId) => {

  let customer = await getCustomer(customerId);

  jsUtils.consoleLog('INFO',product);
  jsUtils.consoleLog('INFO',customer);

  customer.cart.push(product);

  jsUtils.consoleLog('INFO',customer);

  await saveCustomer(customer);

  return customer.cart;

}

let saveNewOrderFromCart = async (customerId, orderNumber) => {
  
  let customer = await getCustomer(customerId);

  let newOrder = {
    "id": orderNumber,
    "products": customer.cart,
    "date": new Date().getTime()
  };

  customer.orders.push(newOrder);
  customer['cart']=[];

  return await saveCustomer(customer);

}




module.exports.lookUpPostbackItem = lookUpPostbackItem;
module.exports.lookUpFilters = lookUpFilters;
module.exports.lookUpByFilter = lookUpByFilter;
module.exports.saveCustomer = saveCustomer;
module.exports.saveProducto2Cart = saveProducto2Cart;
module.exports.getContactDataFromCustomer = getContactDataFromCustomer;
module.exports.saveNewOrderFromCart = saveNewOrderFromCart;
module.exports.getCartFromCustomer = getCartFromCustomer;
module.exports.saveContactDataFromCustomer = saveContactDataFromCustomer;
