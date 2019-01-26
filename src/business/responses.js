const c = require('./constants');
const dynamo = require('../awsUtils/dynamoUtils')
const fbUtils = require('../messengerUtils/fbUtils');
const jsUtils = require('../jsUtils/jsUtils');

let intentVerCatalogo = async () => {

  let tiposVino = await dynamo.lookUpFilters();    
  let elements = [];
  
  jsUtils.consoleLog('INFO', tiposVino);

  for(let tipoVino of tiposVino) {
    let button = [fbUtils.buildSelectButton(`PBI_${tipoVino.id}`)];
    elements.push(fbUtils.buildElementWithImage(tipoVino.nombre.toString().toUpperCase(),"",button,tipoVino.imageURL));
  }

  let message = fbUtils.buildGenericTemplate(elements);

  jsUtils.consoleLog('INFO', message);

  return message;
};

let intentVerTipoPagos = () => {

  return intentDefaultResponse;
};

let intentVerCarrito = () => {

  return intentDefaultResponse;
};

let intentComprarCarrito = () => {

  return intentDefaultResponse;
};

let intentDefaultResponse = () => {

  return {"text":"No tenemos ello"};
};

let intentByDBResponse = async (filter) => {

  let products = await dynamo.lookUpByFilter(filter);
  let elements = [];
  
  jsUtils.consoleLog('INFO', products);

  for(let product of products) {
    let button = [fbUtils.buildSelectButton(`PBI_${product.id}`)];
    elements.push(fbUtils.buildElementWithImage(product.nombre.toString().toUpperCase(),"",button,product.imageURL));
  }

  let message = fbUtils.buildGenericTemplate(elements);

  jsUtils.consoleLog('INFO', message);

  return message;


}


module.exports.intentVerCatalogo = intentVerCatalogo;
module.exports.intentVerTipoPagos = intentVerTipoPagos;
module.exports.intentVerCarrito = intentVerCarrito;
module.exports.intentComprarCarrito = intentComprarCarrito;
module.exports.intentDefaultResponse = intentDefaultResponse;
module.exports.intentByDBResponse = intentByDBResponse;