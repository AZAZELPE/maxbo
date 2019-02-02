const c = require('./constants');
const dynamo = require('../awsUtils/dynamoUtils')
const fbUtils = require('../messengerUtils/fbUtils');
const pbUtils = require('../messengerUtils/postbackUtils');
const jsUtils = require('../jsUtils/jsUtils');

let intentEmpezar = async (sender_psid) => {
  let profile = await fbUtils.getProfileFromFB(sender_psid);

  const newCustomer = {
    "id": profile.id,
    "firstName": profile.first_name,
    "lastName": profile.last_name,
    "profileImage": profile.profile_pic,
    "address": 'Av Alameda Sur 917 - Chorrillos',
    "cellphone": '988663919',
    "signIn": new Date().getTime(),
    "cart": [],
    "orders": []
  }

  await dynamo.saveCustomer(newCustomer);
  jsUtils.consoleLog('INFO',newCustomer);

  let messages = [];
  messages.push(fbUtils.buildTextTemplate(`Hola ${profile.first_name}, muchas gracias por contar con nosotros!`));
  messages.push(fbUtils.buildTextTemplate(`Somos una empresa que vende vinos y estamos para atenderte`));
  messages.push(fbUtils.buildTextTemplate(`En la parte de abajo puedes encontrar nuestro menu de opciones.`));
  messages.push(fbUtils.buildQuickResponse(`Recomendamos poner "Ver Catalogo" para comenzar!`,"Ver Catalogo",c.INTENT_VER_CATALOGO));

  return messages;
}

let intentVerCatalogo = async () => {

  let tiposVino = await dynamo.lookUpFilters();    
  let elements = [];
  
  jsUtils.consoleLog('INFO', tiposVino);

  for(let tipoVino of tiposVino) {
    let postback = pbUtils.buildPostbackFilter(1,[{"id":tipoVino.id}]);
    let titulo = tipoVino.nombre.toString().toUpperCase();
    elements.push(fbUtils.buildQuickResponseElement(titulo,postback));
  }

  let messages = [];
  messages.push(fbUtils.buildQuickResponseTemplate('¿Qué tipo de Vino le gustaría?',elements));

  jsUtils.consoleLog('INFO', messages);

  return messages;
};

let intentVerTipoPagos = () => {

  let messages = [];
  messages.push(fbUtils.buildTextTemplate("Por ahora solo aceptamos pago contra entrega"));
  return messages;
};

let intentVerCarrito = async (cart, sender_psid) => {

  if(cart === undefined) {
    cart = await dynamo.getCartFromCustomer(sender_psid);
  }
  
  //jsUtils.consoleLog('INFO', product);
  let text = "";
  let total = 0;
  let checkEmoji = '\u{2705}';
  let cartEmoji = '\u{1F6D2}';

  for(let p of cart) {
    total += p.cantidad*p.precioMinorista;
    text += `${checkEmoji} ${p.cantidad} ${p.nombre} - ${p.tipo} (${p.moneda}${p.precioMinorista} c/u)\n`;
  }

  text = `${cartEmoji} CARRITO - TOTAL: S/${total}\n${text}`;

  let buttons = []
  buttons.push(fbUtils.buildPostbackButton("Separar",pbUtils.buildPostbackIntent(c.INTENT_COMPRAR_CARRITO,true,c.QUESTIONTYPE_EMAIL)));
  buttons.push(fbUtils.buildPostbackButton("Seguir viendo",pbUtils.buildPostbackIntent(c.INTENT_VER_CATALOGO)));

  let messages = []
  messages.push(fbUtils.buildButtonTemplate(text,buttons));


  jsUtils.consoleLog('INFO', messages);

  return messages;
};

let intentComprarCarrito = async (intentData, sender_psid) => {

  let messages = [];
  let datosContacto = await dynamo.getContactDataFromCustomer(sender_psid);

  if(!(datosContacto.email != undefined && datosContacto.email != null && datosContacto.email != "" && datosContacto.cellphone != undefined && datosContacto.cellphone != null && datosContacto.cellphone != "")) {
    if(intentData.questions != undefined || intentData.questions != null) {

      switch(intentData.questionType) {
        case c.QUESTIONTYPE_EMAIL:
          if(intentData.questions == true){
            messages.push(fbUtils.buildQuickResponseDefined(c.QUICKRESPONSE_EMAIL,"Ingrese su email"));
          } else {
            jsUtils.consoleLog('INFO',intentData.data);
            dynamo.saveContactDataFromCustomer(sender_psid,{"email":intentData.data});
            messages.push(fbUtils.buildQuickResponseDefined(c.QUICKRESPONSE_PHONE,"Ingrese su teléfono"));  
          }
          return messages;
          break;
        case c.QUESTIONTYPE_PHONE:
          if(intentData.questions == true) {
            messages.push(fbUtils.buildQuickResponseDefined(c.QUICKRESPONSE_PHONE,"Ingrese su teléfono"));  
            return messages;
          } else {
            jsUtils.consoleLog('INFO',intentData.data);
            dynamo.saveContactDataFromCustomer(sender_psid,{"email":intentData.phone});
            return await verificarDatos(null, sender_psid);
          }
          break;
      }
      
    } else {
      return await verificarDatos(datosContacto);
    }
  } else {
    return await verificarDatos(datosContacto);
  }

};

let verificarDatos = async (datosContacto, sender_psid) => {
  let elements = [];
  
  if(datosContacto == null) {
    datosContacto = await dynamo.getContactDataFromCustomer(sender_psid);
  }
  //jsUtils.consoleLog('INFO', product);
  

  let buttons = []
  buttons.push(fbUtils.buildWebButton("Confirmar Pedido","https://mybo.pe/checkout.html"));
  buttons.push(fbUtils.buildPostbackButton("Ver Carrito",pbUtils.buildPostbackIntent(c.INTENT_VER_CARRITO)));
  buttons.push(fbUtils.buildPostbackButton("Confirmar Pedido 2",pbUtils.buildPostbackIntent(c.INTENT_COMPRAR_CARRITO_CONFIRMED)));
  let text = `TUS DATOS:\nNombre:${datosContacto.nombre}\nTeléfono: ${datosContacto.cellphone}\nEmail: ${datosContacto.email}`;

  let messages = [];
  messages.push(fbUtils.buildButtonTemplate(text,buttons));

  jsUtils.consoleLog('INFO', messages);
  return messages;
}

let intentComprarCarritoConfirmado = async (customerId) => {

  let orderNumber = Math.floor(Math.random()*1000);
  await dynamo.saveNewOrderFromCart(customerId,orderNumber);

  let messages = [];
  messages.push(fbUtils.buildTextTemplate("Listo! Su pedido esta separado!.\n\nEn breve un encargado se comunicará con usted para el envio. Gracias!"));
  return messages;
}

let intentDefaultResponse = async () => {

  let messages = [];
  messages.push(fbUtils.buildTextTemplate("No tenemos ello"));
  return messages;
};

let intentByFilterResponse = async (filter,postback) => {

  let products = await dynamo.lookUpByFilter(filter);
  let elements = [];
  
  jsUtils.consoleLog('INFO', products);

  for(let product of products) {
    let buttons = []
    let postbackBtn = pbUtils.buildPostbackProduct(product.id,c.PRODUCT_ACTION_UPDATE,null,postback.filters);
    buttons.push(fbUtils.buildWebButton("Ver Detalle",`https://mybo.pe/detalle.html?product_id=${product.id}`));
    buttons.push(fbUtils.buildPostbackButton("Agregar a mi carrito",postbackBtn));
    let titulo = product.nombre.toString().toUpperCase();
    let subtitulo = `${product.tipo} - ${product.bodega} - ${product.moneda}${product.precioMinorista}`;
    let imageURL = product.imageURL;
    elements.push(fbUtils.buildElementWithImage(titulo,subtitulo,buttons,imageURL));
  }

  let messages = [];
  messages.push(fbUtils.buildGenericTemplate(elements));

  jsUtils.consoleLog('INFO', messages);

  return messages;

}

let intentByProductResponse = async (product, postback, sender_psid) => {

  if (postback.action == c.PRODUCT_ACTION_AGREGAR) {

    product['cantidad'] = postback.quantity;
    product['filters'] = postback.filters;
    let cart = await dynamo.saveProducto2Cart(product,sender_psid);
    jsUtils.consoleLog('INFO',cart);

    return intentVerCarrito(cart);

  } else if (postback.action == c.PRODUCT_ACTION_UPDATE) {

    let elements = [];

    for(let i=0;i<5;i++){
      let quickPostback = pbUtils.buildPostbackProduct(product.id,c.PRODUCT_ACTION_AGREGAR,i+1,postback.filters);
      let title = i+1;
      elements.push(fbUtils.buildQuickResponseElement(title,quickPostback));
    }

    let messages = [];
    messages.push(fbUtils.buildQuickResponseTemplate('Seleccione la cantidad',elements));

    return messages;

  }


}

let intentEditProfileInfo = async () => {

  return intentDefaultResponse();
}

module.exports.intentEmpezar = intentEmpezar;
module.exports.intentVerCatalogo = intentVerCatalogo;
module.exports.intentVerTipoPagos = intentVerTipoPagos;
module.exports.intentVerCarrito = intentVerCarrito;
module.exports.intentComprarCarrito = intentComprarCarrito;
module.exports.intentDefaultResponse = intentDefaultResponse;
module.exports.intentByFilterResponse = intentByFilterResponse;
module.exports.intentByProductResponse = intentByProductResponse;
module.exports.intentEditProfileInfo = intentEditProfileInfo;
module.exports.intentComprarCarritoConfirmado = intentComprarCarritoConfirmado;