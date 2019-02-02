// Constantes para el POSTBACK
module.exports.POSTBACK_FILTER = 'FILTER';
module.exports.POSTBACK_INTENT = 'INTENT';
module.exports.POSTBACK_PRODUCT = 'PRODUCT';




module.exports.TYPE_MESSAGE = 'MESSAGE';
module.exports.TYPE_POSTBACK = 'POSTBACK';
module.exports.TYPE_FILTER_INTENT = 'FILTER_INTENT';
module.exports.TYPE_TEXT_INTENT = 'TEXT_INTENT';
module.exports.TYPE_PRODUCT_INTENT = 'PRODUCT_INTENT';

module.exports.INTENT_EMPEZAR = 'EMPEZAR';
module.exports.INTENT_VER_CATALOGO = 'CATALOGUE';
module.exports.INTENT_VER_TIPO_PAGOS = 'INFO_PAYMETHODS';
module.exports.INTENT_VER_CARRITO = 'CART_VIEW';
module.exports.INTENT_COMPRAR_CARRITO = 'CART_CHECKOUT';
module.exports.INTENT_COMPRAR_CARRITO_CONFIRMED = 'CART_CHECKOUT_CONFIRMED';
module.exports.INTENT_DEFAULT_RESPONSE = 'DEFAULT_RESPONSE';
module.exports.INTENT_INFOPROFILE_EDIT = 'INFOPROFILE_EDIT';

module.exports.PRODUCT_ACTION_AGREGAR = 'ADD';
module.exports.PRODUCT_ACTION_REMOVER = 'DEL';
module.exports.PRODUCT_ACTION_UPDATE = 'UPDATE';

module.exports.QUICKRESPONSE_PHONE = 'user_phone_number';
module.exports.QUICKRESPONSE_LOCATION = 'location';
module.exports.QUICKRESPONSE_EMAIL = 'user_email';

//Aqui se describe el intent y se ingresan los sinonimos que pueden tener para
//llamar a un intent en particular
module.exports.INTENTS = [
  {"name": "EMPEZAR",
    "values": [
    {"postback":"EMPEZAR"}
  ]},
  {"name": "CATALOGUE",
    "values": [
    {"postback":"CATALOGUE"},
    {"text":"CATALOGO"},
    {"text":"VER CATALOGO"},
    {"text":"CARTA"}
  ]},
  {"name": "INFO_PAYMETHODS",
  "values": [
    {"postback":"INFO_PAYMETHODS"},
    {"text":"METODO DE PAGO"},
    {"text":"PAGOS"},
    {"text":"PAGO"}
  ]},
  {"name": "CART_VIEW",
  "values": [
    {"postback":"CART_VIEW"},
    {"text":"CARRITO"},
    {"text":"PRODUCTOS"}
  ]},
  {"name": "CART_CHECKOUT",
  "values": [
    {"postback":"CART_CHECKOUT"},
    {"text":"COMPRAR"},
    {"text":"PAGAR"}
  ]},
  {"name": "INFOPROFILE_EDIT",
  "values": [
    {"postback":"INFOPROFILE_EDIT"},
    {"text":"EDITAR PERFIL"}
  ]},
  {"name": "CART_CHECKOUT_CONFIRMED",
  "values": [
    {"postback":"CART_CHECKOUT_CONFIRMED"}
  ]}
];




