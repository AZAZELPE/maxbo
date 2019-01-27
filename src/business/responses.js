const c = require('./constants');
const dynamo = require('../awsUtils/dynamoUtils')
const fbUtils = require('../messengerUtils/fbUtils');
const jsUtils = require('../jsUtils/jsUtils');

let intentEmpezar = async (sender_psid) => {
  let profile = await fbUtils.getProfileFromFB(sender_psid);

  const newCustomer = {
    "id": profile.id,
    "firstName": profile.first_name,
    "lastName": profile.last_name,
    "profileImage": profile.profile_pic,
    "direccion": 'Av Alameda Sur 917 - Chorrillos',
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
    let button = [fbUtils.buildSelectButton(`PBI_FIL_${tipoVino.id}`)];
    let titulo = tipoVino.nombre.toString().toUpperCase();
    let subtitulo = "";
    let imageURL = tipoVino.imageURL;
    elements.push(fbUtils.buildElementWithImage(titulo,subtitulo,button,imageURL));
  }

  let messages = [];
  messages.push(fbUtils.buildTextTemplate('¿Qué tipo de Vino le gustaría?'));
  messages.push(fbUtils.buildGenericTemplate(elements));

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

  let elements = [];
  
  //jsUtils.consoleLog('INFO', product);
  let subs = "";
  let total = 0;

  for(let p of cart) {
    total += p.cantidad*p.precioMinorista;
    subs += `${p.cantidad} ${p.nombre} - ${p.tipo} (${p.moneda}${p.precioMinorista})\n`;
  }

  let buttons = []
  buttons.push(fbUtils.buildPostbackButton("Separar",c.INTENT_COMPRAR_CARRITO));
  buttons.push(fbUtils.buildPostbackButton("Seguir viendo",c.INTENT_VER_CATALOGO));

  let titulo = `Carrito - TOTAL: S/${total}`+"";
  let subtitulo = subs;
  let imageURL = "https://s3.amazonaws.com/maxbo-aws-image/wineCart.png";
  elements.push(fbUtils.buildElementWithImage(titulo,subtitulo,buttons,imageURL));

  let messages = []
  messages.push(fbUtils.buildGenericTemplate(elements));

  jsUtils.consoleLog('INFO', messages);

  return messages;
};

let intentComprarCarrito = async (sender_psid) => {

  let customer = dynamo
  
  let elements = [];
  
  //jsUtils.consoleLog('INFO', product);
  let datosContacto = await dynamo.getContactDataFromCustomer(sender_psid);

  let buttons = []
  buttons.push(fbUtils.buildPostbackButton("Editar Info",c.INTENT_INFOPROFILE_EDIT));
  buttons.push(fbUtils.buildPostbackButton("¡CONFIRMADO!",c.INTENT_COMPRAR_CARRITO_CONFIRMED));
  let titulo = "Datos de contacto y entrega";
  let subtitulo = `Dirección: ${datosContacto.address}\nTeléfono: ${datosContacto.cellphone}`;
  let imageURL = "https://s3.amazonaws.com/maxbo-aws-image/contactInfo.png";
  elements.push(fbUtils.buildElementWithImage(titulo,subtitulo,buttons,imageURL));

  let messages = []
  messages.push(fbUtils.buildTextTemplate("Porfavor confirmar la informacion de entrega y contacto"));
  messages.push(fbUtils.buildGenericTemplate(elements));

  jsUtils.consoleLog('INFO', messages);

  return messages;

};

let intentComprarCarritoConfirmado = async (customerId) => {

  let orderNumber = Math.floor(Math.random()*1000);
  await dynamo.saveNewOrderFromCart(customerId,orderNumber);

  let messages = [];
  messages.push(fbUtils.buildTextTemplate("Listo! Su pedido esta separado!.\n\nEn breve un encargado se comunicará con usted para el envio. Gracias!"));
  return messages;
}

let intentDefaultResponse = () => {

  let messages = [];
  messages.push(fbUtils.buildTextTemplate("No tenemos ello"));
  return messages;
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

  let messages = [];
  messages.push(fbUtils.buildGenericTemplate(elements));

  jsUtils.consoleLog('INFO', messages);

  return messages;

}

let intentByProductResponse = async (product, action, sender_psid) => {

  if(action == c.PRODUCT_ACTION_DETALLE) {

    let message = `${product.ubicacion}\nEl vino ${product.nombre} es de tipo ${product.tipo} producido en la bodega "${product.bodega}" en el año ${product.anio}. Contiene cepas: ${product.cepas} a un precio de ${product.moneda}${product.precioMinorista}, pero si lleva ${product.umbralMayorista} o más, le sale a un precio de ${product.moneda}${product.precioMayorista} cada uno`;
    return [fbUtils.buildTextTemplate(message)];

  } else if (action == c.PRODUCT_ACTION_AGREGAR) {

    product['cantidad'] = 1;
    let cart = await dynamo.saveProducto2Cart(product,sender_psid);
    jsUtils.consoleLog('INFO',cart);

    return intentVerCarrito(cart);

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