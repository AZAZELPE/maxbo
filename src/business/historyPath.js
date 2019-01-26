const c = require('./constants');
const dynamo = require('../awsUtils/dynamoUtils')
const response = require('./responses')
const jsUtils = require('../jsUtils/jsUtils');

// EvaluatePath: Evalua el camino a seguir segun lo ingresado.
// type: 2 tipos: a)Message, b)Postback
// intent: texto
let evaluatePath = async (type, intent) => {

  jsUtils.consoleLog('INFO',intent.toString().toUpperCase());
  jsUtils.consoleLog('INFO',type);

  let tipoIntent = await evaluateIntent(type, intent.toString().toUpperCase());
  
  jsUtils.consoleLog('INFO',tipoIntent);
  let response = await generateRespond(tipoIntent);
  
  jsUtils.consoleLog('INFO',response);

  return response;
}

//Evalua el intent ya sea escrito o ingresado por boton y devuelve
//un tipo de intent conocido o nulo
let evaluateIntent = async (type, intent) => {
  
  //Primero se evalua si es un intent q esta en db por tipo de posback en boton
  //si no lo es se recorre todos los intents conocidos
  if(intent.toString().split("_")[0] == 'PBI' && type == c.TYPE_POSTBACK)  {// PBI = POSTBACK ITEM -- FIL = filtro -- PRO = producto
    
    if(intent.toString().split("_")[1] == 'FIL') { // Si se selecciona un filtro
      
      let result = await dynamo.lookUpPostbackItem(intent.toString().split("_")[2]);
      if(result.Item) {
        return {"tipo":c.TYPE_FILTER_INTENT,
                "data": result.Item}
      }

    } else if(intent.toString().split("_")[1] == 'PRO') { // Si se selecciona un producto 

      let productoCompuesto = intent.toString().split("_")[2];
      let product = productoCompuesto.toString().split("-")[0];
      let action = productoCompuesto.toString().split("-")[1];

      let result = await dynamo.lookUpPostbackItem(product);
      if(result.Item) {
        return {"tipo":c.TYPE_PRODUCT_INTENT,
                "data": result.Item,
                "action": action}
      }

    }

  } else { //Verifica en la lista de intents a ver si es un comando valido
    for(let dbintent of c.INTENTS) {
      for(let value of dbintent.values) {

        if(intent == value.postback && type == c.TYPE_POSTBACK) {
          return {"tipo":c.TYPE_TEXT_INTENT,
          "data": dbintent.name}
        } else if(intent == value.text && type == c.TYPE_MESSAGE){
          return {"tipo":c.TYPE_TEXT_INTENT,
          "data": dbintent.name};
        }

      }
    }
  }
  
  return c.INTENT_DEFAULT_RESPONSE;
};

let generateRespond = async (tipoIntent) => {

  if(tipoIntent.tipo == c.TYPE_FILTER_INTENT) {

    return await response.intentByFilterResponse(tipoIntent.data);

  } else if(tipoIntent.tipo == c.TYPE_PRODUCT_INTENT) {
  
    return await response.intentByProductResponse(tipoIntent.data,tipoIntent.action)

  } else if(tipoIntent.tipo == c.TYPE_TEXT_INTENT) {

    switch(tipoIntent.data) {
      case c.INTENT_VER_CATALOGO:
        return await response.intentVerCatalogo();

      case c.INTENT_VER_TIPO_PAGOS:
        return await response.intentVerTipoPagos();

      case c.INTENT_VER_CARRITO:
        return await response.intentVerCarrito();

      case c.INTENT_COMPRAR_CARRITO:
        return await response.intentComprarCarrito();

      case c.INTENT_COMPRAR_CARRITO_CONFIRMED:
        return await response.intentComprarCarritoConfirmado();

      case c.INTENT_INFOPROFILE_EDIT:
        return await response.intentEditProfileInfo();

      default:
        return await response.intentDefaultResponse();
    }
  }
}

module.exports.evaluatePath = evaluatePath;