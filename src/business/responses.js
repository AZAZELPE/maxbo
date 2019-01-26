const c = require('./constants');
const dynamo = require('../awsUtils/dynamoUtils')
const fbUtils = require('../messengerUtils/fbUtils');
const jsUtils = require('../jsUtils/jsUtils');

let intentVerCatalogo = async () => {

  let tiposVino = await dynamo.lookUpFilters();    
  let elements = [];
  
  jsUtils.consoleLog('INFO', tiposVino);

  for(let tipoVino of tiposVino) {
    let button = [fbUtils.buildSelectButton(`PBI_FIL_${tipoVino.id}`)];
    let titulo = tipoVino.nombre.toString().toUpperCase();
    let subtitulo = "";
    let imageURL = tipoVino.imageURL;
    elements.push(fbUtils.buildElementWithImage(titulo,subtitulo,button,imageURL));
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

let intentByFilterResponse = async (filter) => {

  let products = await dynamo.lookUpByFilter(filter);
  let elements = [];
  
  jsUtils.consoleLog('INFO', products);

  for(let product of products) {
    let buttons = []
    buttons.push(fbUtils.buildPostbackButton("Ver Detalle",`PBI_PRO_${product.id}-${c.PRODUCT_ACTION_DETALLE}`));
    buttons.push(fbUtils.buildPostbackButton("Agregar a mi carrito",`PBI_PRO_${product.id}-${c.PRODUCT_ACTION_AGREGAR}`));
    let titulo = product.nombre.toString().toUpperCase();
    let subtitulo = `${product.tipo} - ${product.bodega} - ${product.moneda}${product.precioMinorista}`;
    let imageURL = product.imageURL;
    elements.push(fbUtils.buildElementWithImage(titulo,subtitulo,buttons,imageURL));
  }

  let message = fbUtils.buildGenericTemplate(elements);

  jsUtils.consoleLog('INFO', message);

  return message;

}

let intentByProductResponse = async (product, action) => {

  if(action == c.PRODUCT_ACTION_DETALLE) {

    let message = `${product.nombre} - ${product.tipo} - ${product.bodega} - ${product.moneda}${product.precioMinorista}`;
    return fbUtils.buildTextTemplate(message);

  } else if (action == c.PRODUCT_ACTION_AGREGAR) {

    let message = `Agregado al carrito - ${product.nombre}`;
    return fbUtils.buildTextTemplate(message);
  }


}


module.exports.intentVerCatalogo = intentVerCatalogo;
module.exports.intentVerTipoPagos = intentVerTipoPagos;
module.exports.intentVerCarrito = intentVerCarrito;
module.exports.intentComprarCarrito = intentComprarCarrito;
module.exports.intentDefaultResponse = intentDefaultResponse;
module.exports.intentByFilterResponse = intentByFilterResponse;
module.exports.intentByProductResponse = intentByProductResponse;