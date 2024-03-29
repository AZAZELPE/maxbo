const c = require('./constants');
const dynamo = require('../awsUtils/dynamoUtils')
const response = require('./responses')
const jsUtils = require('../jsUtils/jsUtils');

// EvaluatePath: Evalua el camino a seguir segun lo ingresado.
// type: 2 tipos: a)Message, b)Postback
// intent: texto
let evaluatePath = async (type, intent,sender_psid) => {

  jsUtils.consoleLog('INFO',intent);
  jsUtils.consoleLog('INFO',type);

  let tipoIntent = await evaluateIntent(type, intent);
  
  jsUtils.consoleLog('INFO',tipoIntent);
  let response = await generateRespond(tipoIntent,sender_psid);
  
  jsUtils.consoleLog('INFO',response);

  return response;
}

//Evalua el intent ya sea escrito o ingresado por boton y devuelve
//un tipo de intent conocido o nulo
let evaluateIntent = async (type, intent) => {
  
  //Se verifica si es postback
  if(type == c.TYPE_POSTBACK) {

    let postback = JSON.parse(intent);
    jsUtils.consoleLog('INFO',postback);

    switch(postback.type) {
      case c.POSTBACK_INTENT:                     // CASO INTENT
        for(let dbintent of c.INTENTS) {
          for(let value of dbintent.values) {  
            if(postback.data.intent == value.postback) {
              return {"tipo":c.TYPE_TEXT_INTENT,
              "data": dbintent.name,
              "postback": postback.data}
            }
          }
        }
        break;
      case c.POSTBACK_FILTER:                     // CASO FILTRO
        let filter = await dynamo.lookUpPostbackItem(postback.data.filters[0].id);
        if(filter) {
          return {"tipo":c.TYPE_FILTER_INTENT,
                  "data": filter,
                  "postback": postback.data}
        }
        break;
      case c.POSTBACK_PRODUCT:                     // CASO PRODUCT
        let product = await dynamo.lookUpPostbackItem(postback.data.id);
        if(product) {
          return {"tipo":c.TYPE_PRODUCT_INTENT,
                  "data": product,
                  "postback": postback.data}
        }
        break;
    }

  } else if (type == c.TYPE_MESSAGE) {   // CASO TEXTO
    for(let dbintent of c.INTENTS) {
      for(let value of dbintent.values) {
        if(intent.toString().toUpperCase() == value.text) {
          return {"tipo":c.TYPE_TEXT_INTENT,
          "data": dbintent.name,
          "postback":""};
        }
      }
    }
  } 
    
  return {"tipo":c.TYPE_TEXT_INTENT,
  "data": c.INTENT_DEFAULT_RESPONSE,
  "postback": ""};

  //Primero se evalua si es un intent q esta en db por tipo de posback en boton
  //si no lo es se recorre todos los intents conocidos
  /*if(intent.toString().split("_")[0] == 'PBI' && type == c.TYPE_POSTBACK)  {// PBI = POSTBACK ITEM -- FIL = filtro -- PRO = producto
    
    
    
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
  } */
  
  
};

let generateRespond = async (tipoIntent,sender_psid) => {

  if(tipoIntent.tipo == c.TYPE_FILTER_INTENT) {

    return await response.intentByFilterResponse(tipoIntent.data,tipoIntent.postback);

  } else if(tipoIntent.tipo == c.TYPE_PRODUCT_INTENT) {
  
    return await response.intentByProductResponse(tipoIntent.data,tipoIntent.postback,sender_psid)

  } else if(tipoIntent.tipo == c.TYPE_TEXT_INTENT) {

    switch(tipoIntent.data) {
      case c.INTENT_EMPEZAR:
        return await response.intentEmpezar(sender_psid);
      
      case c.INTENT_VER_CATALOGO:
        return await response.intentVerCatalogo();

      case c.INTENT_VER_TIPO_PAGOS:
        return await response.intentVerTipoPagos();

      case c.INTENT_VER_CARRITO:
        return await response.intentVerCarrito(undefined,sender_psid);

      case c.INTENT_COMPRAR_CARRITO:
        return await response.intentComprarCarrito(tipoIntent.postback, sender_psid);

      case c.INTENT_COMPRAR_CARRITO_CONFIRMED:
        return await response.intentComprarCarritoConfirmado(sender_psid);

      case c.INTENT_INFOPROFILE_EDIT:
        return await response.intentEditProfileInfo();

      case c.INTENT_DEFAULT_RESPONSE:
        return await response.intentDefaultResponse();

      default:
        return await response.intentDefaultResponse();
    }
  }
}

module.exports.evaluatePath = evaluatePath;